import os
import traceback
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras import layers
import google.generativeai as genai
import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv


load_dotenv()  

# Registrasi Custom Layer untuk Model Keras
class NutritionInteractionLayer(layers.Layer):
    def __init__(self, units=64, **kwargs):
        super(NutritionInteractionLayer, self).__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        # input_shape berisi dua dimensi: [shape_user, shape_food]
        user_dim = input_shape[0][-1]
        food_dim = input_shape[1][-1]
        concat_dim = user_dim + food_dim
        
        # Membuat bobot (weights) dan bias secara custom
        self.w = self.add_weight(
            shape=(concat_dim, self.units),
            initializer='he_normal',
            trainable=True,
            name='interaction_weights'
        )
        self.b = self.add_weight(
            shape=(self.units,),
            initializer='zeros',
            trainable=True,
            name='interaction_bias'
        )

    def call(self, inputs):
        user_features, food_features = inputs
        # Menggabungkan fitur user dan makanan
        merged = tf.concat([user_features, food_features], axis=-1)
        # Operasi matematis custom (Z = W.X + b) dengan aktivasi ReLU
        return tf.nn.relu(tf.matmul(merged, self.w) + self.b)

    def get_config(self):
        config = super(NutritionInteractionLayer, self).get_config()
        config.update({'units': self.units})
        return config
    
# Konfigurasi Generative AI (Gemini)
# Dapatkan API Key dari https://aistudio.google.com/
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.0-flash')

# Inisialisasi aplikasi FastAPI
app = FastAPI(title="KaloriN AI Recommender Microservice", version="1.0")

# Load Model
try:
    # Memasukkan custom_objects agar Keras mengenali NutritionInteractionLayer
    recsys_model = tf.keras.models.load_model(
        'kalorin_recsys_model.keras',
        custom_objects={'NutritionInteractionLayer': NutritionInteractionLayer}
    )
    print("Model dan Custom Layer berhasil dimuat!")

    # Memuat Scaler dan Encoder
    scaler_user = joblib.load('recsys_scaler_user.pkl')
    scaler_food = joblib.load('recsys_scaler_food.pkl')
    ohe_user = joblib.load('recsys_ohe_user.pkl')
    ohe_food = joblib.load('recsys_ohe_food.pkl')
    print("Semua model dan scaler berhasil dimuat!")
except Exception as e:
    print(f"Error loading model: {e}")

# Definisi Struktur Input dari Express.js (Pydantic)
class InferenceRequest(BaseModel):
    user_age: float
    user_weight: float
    user_height: float
    user_status: str
    food_cal: float
    food_prot: float
    food_fat: float
    food_carb: float
    food_cluster: int
    food_name: str

# Untuk Kotak Hijau AI Insight (General Harian)
class DailyInsightRequest(BaseModel):
    user_status: str
    macro_context: str  # Contoh kiriman dari Express: "kurang 38g protein" atau "kalori sudah batas maksimal"

# Fungsi Helper untuk Penjelasan AI
async def generate_explanation(food_name, user_status, is_recommended):
    if not is_recommended:
        return f"RinAI di sini! Makanan ini kurang pas buat kondisi {user_status} kamu sekarang, coba cari alternatif lain ya!"
    
    try:
        # Prompt Engineering untuk Gemini
        prompt = (
            f"Sapa user sebagai 'RinAI'. "
            f"Berperanlah sebagai ahli gizi digital untuk aplikasi KaloriN AI. "
            f"Berikan 1 kalimat penjelasan singkat dan ramah kenapa '{food_name}' "
            f"sangat cocok direkomendasikan untuk seseorang dengan status kesehatan '{user_status}'. "
            f"Fokus pada manfaat gizi makronya."
        )
        response = gemini_model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return "Makanan ini direkomendasikan karena komposisi nutrisinya sangat mendukung profil kesehatan kamu." 

# API Endpoints

# Untuk Kartu Makanan
@app.post("/api/recommend")
async def get_recommendation(data: InferenceRequest):
    try:
        # Siapkan kolom sesuai format training
        user_num_cols = ['user_age', 'user_weight', 'user_height']
        user_cat_cols = ['user_status']
        food_num_cols = ['food_calories', 'food_proteins', 'food_fat', 'food_carbohydrate']
        food_cat_cols = ['food_cluster']

        # Konversi input Pydantic ke DataFrame
        user_num = pd.DataFrame([[data.user_age, data.user_weight, data.user_height]], columns=user_num_cols)
        user_cat = pd.DataFrame([[data.user_status]], columns=user_cat_cols)
        
        food_num = pd.DataFrame([[data.food_cal, data.food_prot, data.food_fat, data.food_carb]], columns=food_num_cols)
        food_cat = pd.DataFrame([[data.food_cluster]], columns=food_cat_cols)

        # Preprocessing menggunakan Scaler & Encoder
        u_num_scaled = scaler_user.transform(user_num)
        u_cat_encoded = ohe_user.transform(user_cat)
        user_input_final = np.hstack([u_num_scaled, u_cat_encoded])

        f_num_scaled = scaler_food.transform(food_num)
        f_cat_encoded = ohe_food.transform(food_cat)
        food_input_final = np.hstack([f_num_scaled, f_cat_encoded])

        # Prediksi
        match_score = recsys_model.predict([user_input_final, food_input_final], verbose=0)[0][0]
        
        # Konversi ke Python float agar bisa diubah ke JSON
        score_percent = float(match_score * 100)
        is_recommended = bool(match_score >= 0.5)

        # Ambil penjelasan dari Gemini
        explanation = await generate_explanation(data.food_name, data.user_status, is_recommended)

        # Return response ke Express.js
        return {
            "food_name": data.food_name,
            "match_score_percent": round(score_percent, 2),
            "is_recommended": is_recommended,
            "message": "Direkomendasikan" if is_recommended else "Ditolak (Tidak sesuai target nutrisi)",
            "explanation": explanation
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# Untuk Kotak Hijau (AI Insight)
@app.post("/api/daily-insight")
async def get_daily_insight(data: DailyInsightRequest):
    try:
        # Gemini membuat kalimat berdasarkan kalkulasi dari Express.js
        prompt = (
            f"Kamu adalah AI Gizi di aplikasi. User dengan status {data.user_status} "
            f"saat ini kondisinya: {data.macro_context}. "
            f"Berikan 1 kalimat insight harian yang menyemangati dan spesifik (misal menyarankan jenis makanan). "
            f"Gunakan bahasa Inggris yang natural seperti contoh ini: 'You need 38g more protein today. Try adding a chicken breast!'"
        )
        response = gemini_model.generate_content(prompt)
        return {
            "insight_text": response.text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Cara run: uvicorn main:app --reload