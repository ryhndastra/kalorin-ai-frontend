const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { calculateUserStatus } = require("../utils/bmiUtils");

const AI_URL = process.env.AI_URL || "http://localhost:8000";

const MAX_FOOD_SCAN = 15;
const AI_TIMEOUT = 10000;
const CACHE_TTL = 1000 * 60 * 30; // 30 menit
const INSIGHT_TTL = 1000 * 60 * 60 * 6; // 6 jam
const CONCURRENT_LIMIT = 3;

const aiCache = new Map();
const insightCache = new Map();

const setCache = (cache, key, value, ttl) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
};

const getCache = (cache, key) => {
  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }

  return item.value;
};

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// batasi concurrency biar ga spam AI
const processWithLimit = async (items, limit, asyncFn) => {
  const results = [];

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);

    const chunkResults = await Promise.all(chunk.map((item) => asyncFn(item)));

    results.push(...chunkResults);

    // delay kecil antar batch
    await sleep(300);
  }

  return results;
};

const getQuickInsight = async (req, res) => {
  try {
    const { userId, macroContext } = req.body;

    const cacheKey = `insight-${userId}`;

    const cachedInsight = getCache(insightCache, cacheKey);

    if (cachedInsight) {
      return res.status(200).json({
        success: true,
        recommendation: cachedInsight,
      });
    }

    const user = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({
        error: "User tidak ditemukan",
      });
    }

    const userStatus =
      calculateUserStatus(user.weight, user.height) || "Normal";

    const aiResponse = await axios.post(
      `${AI_URL}/api/daily-insight`,
      {
        user_status: String(userStatus),
        macro_context: String(
          macroContext ||
            `User goal is ${user.goal || "Healthy"}. Keep them motivated!`,
        ),
      },
      {
        timeout: AI_TIMEOUT,
      },
    );

    const insightText =
      aiResponse.data.insight_text ||
      "Stay consistent with your nutrition goals today!";

    setCache(insightCache, cacheKey, insightText, INSIGHT_TTL);

    return res.status(200).json({
      success: true,
      recommendation: insightText,
    });
  } catch (error) {
    console.error(
      "❌ Error in getQuickInsight:",
      error.response?.data || error.message,
    );

    return res.status(200).json({
      success: true,
      recommendation:
        "Keep tracking your meals consistently to unlock smarter nutrition insights 🚀",
    });
  }
};

const isFoodSuitable = (food, userGoal, userStatus) => {
  const foodName = food.name.toLowerCase();

  const badWords = ["gajih", "goreng", "lemak", "minyak", "babi"];

  const isJunkFood = badWords.some((w) => foodName.includes(w));

  // cutting / obesity
  if (
    userGoal.includes("weight") ||
    userGoal.includes("loss") ||
    userStatus.includes("Obesity")
  ) {
    if (isJunkFood || food.calories > 350 || food.fat > 15) {
      return false;
    }
  }

  // bulking
  if (userGoal.includes("bulk")) {
    if (food.proteins < 8) {
      return false;
    }
  }

  return true;
};

const normalizeScore = (score) => {
  const numericScore = Number(score || 0);

  // clamp safety
  const clamped = Math.max(0, Math.min(100, numericScore));

  // hindari semua 100%
  if (clamped >= 99) {
    return Math.floor(92 + Math.random() * 7); // 92-98
  }

  // hindari score terlalu kecil
  if (clamped < 50) {
    return Math.floor(50 + clamped * 0.4);
  }

  return Math.round(clamped);
};

const getRecommendedFoodList = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({
        error: "User profile not found",
      });
    }

    const totalFoods = await prisma.food.count();

    const skip = Math.floor(
      Math.random() * Math.max(0, totalFoods - MAX_FOOD_SCAN),
    );

    const rawFoods = await prisma.food.findMany({
      take: MAX_FOOD_SCAN,
      skip,
    });

    const user_status =
      calculateUserStatus(user.weight, user.height) || "Normal";

    const user_age = calculateAge(user.birthdate);

    const user_goal = user.goal?.toLowerCase() || "stay healthy";

    console.log(`🤖 RinAI Scan | ${user_status} | Goal: ${user_goal}`);

    // FILTER BEFORE AI
    const filteredFoods = rawFoods.filter((food) =>
      isFoodSuitable(food, user_goal, user_status),
    );

    // AI EVALUATION
    const evaluatedFoods = await processWithLimit(
      filteredFoods,
      CONCURRENT_LIMIT,
      async (food) => {
        try {
          const cacheKey = `${userId}-${food.id}-${user_goal}`;

          const cachedFood = getCache(aiCache, cacheKey);

          if (cachedFood) {
            return cachedFood;
          }

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

          const aiRes = await axios.post(`${AI_URL}/api/recommend`, payload, {
            timeout: AI_TIMEOUT,
          });

          // invalid response
          if (!aiRes?.data) {
            return null;
          }

          const { is_recommended, match_score_percent, explanation } =
            aiRes.data;

          if (!is_recommended) {
            return null;
          }

          // normalize display score
          const normalizedScore = normalizeScore(match_score_percent);

          console.log(
            `🧠 ${food.name} → RAW: ${match_score_percent} | DISPLAY: ${normalizedScore}`,
          );

          const result = {
            ...food,

            matchScore: normalizedScore,

            explanation:
              explanation || "Good nutritional match for your profile.",
          };

          setCache(aiCache, cacheKey, result, CACHE_TTL);

          return result;
        } catch (err) {
          console.error(
            `❌ AI Error (${food.name}):`,
            err.response?.status || err.message,
          );

          return null;
        }
      },
    );
    const finalFoods = evaluatedFoods
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    console.log(`✅ Scan Complete. Showing ${finalFoods.length} foods`);

    return res.status(200).json({
      success: true,
      data: finalFoods,
    });
  } catch (error) {
    console.error("❌ Error AI List:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      error: "Failed to generate recommendations",
    });
  }
};

const getFoodRecommendation = async (req, res) => {
  try {
    const { userId, foodId } = req.body;

    const user = await prisma.profile.findUnique({
      where: { userId },
    });

    const food = await prisma.food.findUnique({
      where: { id: Number(foodId) },
    });

    if (!user || !food) {
      return res.status(404).json({
        error: "Data not found",
      });
    }

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

    const aiRes = await axios.post(`${AI_URL}/api/recommend`, payload, {
      timeout: AI_TIMEOUT,
    });

    return res.status(200).json({
      success: true,
      recommendation: aiRes.data,
    });
  } catch (error) {
    console.error(
      "❌ Error in getFoodRecommendation:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      error: "Failed to get detail recommendation",
    });
  }
};

module.exports = {
  getQuickInsight,
  getRecommendedFoodList,
  getFoodRecommendation,
};
