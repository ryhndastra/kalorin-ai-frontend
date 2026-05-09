const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { calculateUserStatus } = require("../utils/bmiUtils");

const AI_URL = process.env.AI_URL || "http://localhost:8000";

// Memory Cache untuk menghindari spam ke API Gemini (Error 429)
const aiCache = new Map();

// helper function buat hitung umur dari birthdate
const calculateAge = (birthdate) => {
  if (!birthdate) return 20;
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// quick insight untuk homepage (motivasi harian, tips, dll)
const getQuickInsight = async (req, res) => {
  try {
    const { userId, macroContext } = req.body;
    const user = await prisma.profile.findUnique({ where: { userId } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const userStatus =
      calculateUserStatus(user.weight, user.height) || "Normal";

    const aiResponse = await axios.post(`${AI_URL}/api/daily-insight`, {
      user_status: String(userStatus),
      macro_context: String(
        macroContext ||
          `User goal is ${user.goal || "Healthy"}. Keep them motivated!`,
      ),
    });

    return res.status(200).json({
      success: true,
      recommendation: aiResponse.data.insight_text,
    });
  } catch (error) {
    console.error(
      "❌ Error in getQuickInsight:",
      error.response?.data || error.message,
    );
    res.json({
      success: true,
      recommendation:
        "Keep track of your meals to get personalized AI insights! 🚀",
    });
  }
};

// rekomendasi makanan
const getRecommendedFoodList = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await prisma.profile.findUnique({ where: { userId } });
    if (!user) return res.status(404).json({ error: "User profile not found" });

    // ambil max 25 makanan acak agar database tidak monoton
    const totalFoods = await prisma.food.count();
    const skip = Math.floor(Math.random() * Math.max(0, totalFoods - 25));
    const rawFoods = await prisma.food.findMany({ take: 25, skip: skip });

    const user_status =
      calculateUserStatus(user.weight, user.height) || "Normal";
    const user_age = calculateAge(user.birthdate);
    const user_goal = user.goal?.toLowerCase() || "stay healthy";

    console.log(
      `🤖 RinAI Scanning | User: ${user_status} | Goal: ${user_goal}`,
    );

    const recommendationPromises = rawFoods.map(async (food) => {
      try {
        // hard filter berdasarkan goals dan status
        const foodName = food.name.toLowerCase();
        const badWords = ["lemak", "gajih", "babi", "minyak", "goreng"];
        const isJunkFood = badWords.some((w) => foodName.includes(w));

        // filter untuk obeseitas/weight loss
        if (user_goal === "weight loss" || user_status.includes("Obesity")) {
          if (isJunkFood || food.calories > 350 || food.fat > 15) return null;
        }

        // filter untuk bulking/muscle gain: makanan tanpa protein kemungkinan besar kurang optimal
        if (user_goal === "bulking") {
          if (food.proteins < 1) return null; // hilangin makanan null protein
        }

        // cache dipisahim berdasarkan goal agar tetap akurat saat user ganti target
        const cacheKey = `${userId}-${food.id}-${user_goal}`;
        if (aiCache.has(cacheKey)) return aiCache.get(cacheKey);

        // request ke AI untuk setiap makanan yang lolos filter awal
        const payload = {
          user_age: Number(user_age),
          user_weight: Number(user.weight),
          user_height: Number(user.height),
          user_status: String(user_status),
          user_goal: String(user_goal),
          food_cal: Number(food.calories),
          food_prot: Number(food.proteins),
          food_fat: Number(food.fat),
          food_carb: Number(food.carbohydrate),
          food_cluster: Number(food.foodCluster),
          food_name: String(food.name),
        };

        const aiRes = await axios.post(`${AI_URL}/api/recommend`, payload);

        if (aiRes.data.is_recommended) {
          const result = {
            ...food,
            matchScore: aiRes.data.match_score_percent,
            explanation: aiRes.data.explanation,
          };
          aiCache.set(cacheKey, result);
          return result;
        }
        return null;
      } catch (err) {
        return null;
      }
    });

    const evaluatedFoods = (await Promise.all(recommendationPromises)).filter(
      (f) => f !== null,
    );

    // sorting skor terbesar
    evaluatedFoods.sort((a, b) => b.matchScore - a.matchScore);

    console.log(`✅ Scan Complete. Showing ${evaluatedFoods.length} foods.`);

    return res.status(200).json({
      success: true,
      data: evaluatedFoods,
    });
  } catch (error) {
    console.error("❌ Error AI List:", error.message);
    res.status(500).json({ success: false });
  }
};

// detail rekomendasi makanan
const getFoodRecommendation = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    const user = await prisma.profile.findUnique({ where: { userId } });
    const food = await prisma.food.findUnique({
      where: { id: Number(foodId) },
    });

    if (!user || !food)
      return res.status(404).json({ error: "Data not found" });

    const payload = {
      user_age: Number(calculateAge(user.birthdate)),
      user_weight: Number(user.weight),
      user_height: Number(user.height),
      user_status: String(
        calculateUserStatus(user.weight, user.height) || "Normal",
      ),
      user_goal: String(user.goal || "Stay Healthy"),
      food_cal: Number(food.calories),
      food_prot: Number(food.proteins),
      food_fat: Number(food.fat),
      food_carb: Number(food.carbohydrate),
      food_cluster: Number(food.foodCluster),
      food_name: String(food.name),
    };

    const aiRes = await axios.post(`${AI_URL}/api/recommend`, payload);

    return res.status(200).json({
      success: true,
      recommendation: aiRes.data,
    });
  } catch (error) {
    console.error(
      "❌ Error in getFoodRecommendation:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to get detail recommendation" });
  }
};

module.exports = {
  getQuickInsight,
  getRecommendedFoodList,
  getFoodRecommendation,
};
