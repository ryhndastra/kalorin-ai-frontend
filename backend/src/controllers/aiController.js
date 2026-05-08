const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { calculateUserStatus } = require("../utils/bmiUtils");

const AI_URL = process.env.AI_URL || "http://localhost:8000";

// fungsi Helper buat ngitung umur otomatis
const calculateAge = (birthdate) => {
  if (!birthdate) return 20; // fallback kalau user belum isi tgl lahir
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const getFoodRecommendation = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    const user = await prisma.profile.findUnique({ where: { userId: userId } });
    const food = await prisma.food.findUnique({ where: { id: foodId } });

    if (!user || !food) {
      return res
        .status(404)
        .json({ success: false, message: "User atau Makanan tidak ditemukan" });
    }

    // hitung Status & Umur secara dinamis dari data Supabase
    const user_status = calculateUserStatus(user.weight, user.height);
    const user_age = calculateAge(user.birthdate);

    // susun Payload buat dikirim ke FastAPI
    const payload = {
      user_age: user_age,
      user_weight: user.weight,
      user_height: user.height,
      user_status: user_status,
      food_cal: food.calories,
      food_prot: food.proteins,
      food_fat: food.fat,
      food_carb: food.carbohydrate,
      food_cluster: food.foodCluster,
      food_name: food.name,
    };

    const aiResponse = await axios.post(`${AI_URL}/api/recommend`, payload, {
      timeout: 5000,
    });

    return res.status(200).json({
      success: true,
      recommendation: aiResponse.data,
    });
  } catch (error) {
    console.error("Error in getFoodRecommendation:", error.message);
    return res.status(500).json({ error: "Gagal ambil rekomendasi dari AI" });
  }
};

const getDailyInsight = async (req, res) => {
  try {
    const { userId, macroContext } = req.body;

    const user = await prisma.profile.findUnique({ where: { userId: userId } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const userStatus = calculateUserStatus(user.weight, user.height);

    const pythonResponse = await axios.post(`${AI_URL}/api/daily-insight`, {
      user_status: userStatus,
      macro_context: macroContext,
    });

    const insightText = pythonResponse.data.insight_text;

    const savedInsight = await prisma.dailyInsight.create({
      data: {
        userId: userId,
        text: insightText,
      },
    });

    res.json({
      success: true,
      insight: insightText,
      historyId: savedInsight.id,
    });
  } catch (error) {
    console.error("Error in getDailyInsight:", error.message);
    res.status(500).json({ error: "Gagal mengambil daily insight" });
  }
};

module.exports = { getFoodRecommendation, getDailyInsight };
