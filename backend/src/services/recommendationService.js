const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { calculateUserStatus } = require("../utils/bmiUtils");
const { buildAIPayload } = require("../utils/payloadBuilder");
const { normalizeScore } = require("../utils/scoreUtils");
const { requestRecommendation } = require("./aiApiService");

const {
  MAX_FOOD_SCAN,
  CACHE_TTL,
  RECOMMENDATION_LIST_TTL,
  CONCURRENT_LIMIT,
} = require("../config/aiConfig");

const { getCache, setCache } = require("../utils/cacheUtils");
// CACHE
const aiCache = new Map();
const recommendationListCache = new Map();

// HELPERS
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processWithLimit = async (items, limit, asyncFn) => {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const chunkResults = await Promise.all(chunk.map((item) => asyncFn(item)));
    results.push(...chunkResults);
    await sleep(300);
  }
  return results;
};
// FOOD FILTER
const isFoodSuitable = (food, userGoal, userStatus) => {
  const foodName = food.name.toLowerCase();
  const badWords = ["gajih", "goreng", "lemak", "minyak", "babi"];
  const isJunkFood = badWords.some((word) => foodName.includes(word));
  // WEIGHT LOSS / OBESITY
  if (
    userGoal.includes("weight") ||
    userGoal.includes("loss") ||
    userStatus.includes("Obesity")
  ) {
    if (isJunkFood || food.calories > 350 || food.fat > 15) {
      return false;
    }
  }
  // BULKING
  if (userGoal.includes("bulk")) {
    if (food.proteins < 8) {
      return false;
    }
  }
  return true;
};

// GENERATE FOOD LIST
const generateRecommendationList = async (userId) => {
  const user = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!user) {
    throw new Error("User profile not found");
  }

  const userGoal = user.goal?.toLowerCase() || "stay healthy";

  const recommendationCacheKey = `recommend-list-${userId}-${userGoal}`;

  const cachedRecommendations = getCache(
    recommendationListCache,
    recommendationCacheKey,
  );

  if (cachedRecommendations) {
    console.log("⚡ Using cached recommendation list");

    return cachedRecommendations;
  }

  // GET RANDOM FOODS
  const totalFoods = await prisma.food.count();

  const skip = Math.floor(
    Math.random() * Math.max(0, totalFoods - MAX_FOOD_SCAN),
  );

  const rawFoods = await prisma.food.findMany({
    take: MAX_FOOD_SCAN,
    skip,
  });

  const userStatus = calculateUserStatus(user.weight, user.height) || "Normal";

  // FILTER BEFORE AI
  const filteredFoods = rawFoods.filter((food) =>
    isFoodSuitable(food, userGoal, userStatus),
  );

  // AI EVALUATION
  const evaluatedFoods = await processWithLimit(
    filteredFoods,
    CONCURRENT_LIMIT,
    async (food) => {
      try {
        const cacheKey = `${userId}-${food.id}-${userGoal}`;
        const cachedFood = getCache(aiCache, cacheKey);

        if (cachedFood) {
          return cachedFood;
        }

        const payload = buildAIPayload(user, food);
        const aiData = await requestRecommendation(payload);

        if (!aiData?.is_recommended) {
          return null;
        }

        const result = {
          ...food,
          matchScore: normalizeScore(aiData.match_score_percent),
          explanation:
            aiData.explanation || "Good nutritional match for your profile.",
        };

        setCache(aiCache, cacheKey, result, CACHE_TTL);

        return result;
      } catch (error) {
        console.error(`❌ Food AI Error (${food.name}):`, error.message);
        return null;
      }
    },
  );

  // FINAL SORT
  const finalFoods = evaluatedFoods
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  setCache(
    recommendationListCache,
    recommendationCacheKey,
    finalFoods,
    RECOMMENDATION_LIST_TTL,
  );

  return finalFoods;
};

// FOOD DETAIL
const generateFoodDetail = async (userId, foodId) => {
  const user = await prisma.profile.findUnique({
    where: { userId },
  });

  const food = await prisma.food.findUnique({
    where: {
      id: Number(foodId),
    },
  });

  if (!user || !food) {
    throw new Error("Data not found");
  }
  const payload = buildAIPayload(user, food);
  return await requestRecommendation(payload);
};

module.exports = {
  generateRecommendationList,
  generateFoodDetail,
};
