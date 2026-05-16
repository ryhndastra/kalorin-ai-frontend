const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET PATTERN ENGINE
const generateNutritionPatterns = async (userId) => {
  // DATE RANGE
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // USER PROFILE
  const profile = await prisma.profile.findFirst({
    where: {
      userId,
    },
  });

  // FETCH LOGS
  const logs = await prisma.dailyLog.findMany({
    where: {
      userId,
      date: {
        gte: sevenDaysAgo,
        lte: today,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // EMPTY STATE
  if (!logs.length) {
    return {
      trackingConsistency: "none",
      trackingDays: 0,
      calorieSpikeDay: null,
      weekendOvereating: false,
      proteinGoalHitDays: 0,
      underProteinDays: 0,
      averageCalories: 0,
      averageProtein: 0,
      dominantMealType: null,
      highestCalorieFood: null,
      highestProteinFood: null,
    };
  }

  // GROUP DAILY DATA
  const grouped = {};

  logs.forEach((log) => {
    const key = new Date(log.date).toDateString();

    if (!grouped[key]) {
      grouped[key] = {
        calories: 0,
        proteins: 0,
        meals: [],
      };
    }

    grouped[key].calories += log.calories || 0;
    grouped[key].proteins += log.proteins || 0;
    grouped[key].meals.push(log);
  });

  const dailyData = Object.values(grouped);

  // TRACKING CONSISTENCY
  const trackingDays = Object.keys(grouped).length;
  let trackingConsistency = "low";

  if (trackingDays >= 6) {
    trackingConsistency = "excellent";
  } else if (trackingDays >= 4) {
    trackingConsistency = "moderate";
  }

  // AVERAGES
  const averageCalories =
    dailyData.reduce((acc, day) => acc + day.calories, 0) / dailyData.length;

  const averageProtein =
    dailyData.reduce((acc, day) => acc + day.proteins, 0) / dailyData.length;

  // CALORIE SPIKE DAY
  let calorieSpikeDay = null;
  let highestCalories = 0;

  Object.entries(grouped).forEach(([date, data]) => {
    if (data.calories > highestCalories) {
      highestCalories = data.calories;
      calorieSpikeDay = new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
      });
    }
  });

  // PROTEIN TARGET
  const proteinTarget = profile?.proteinTarget || 100;
  let proteinGoalHitDays = 0;
  let underProteinDays = 0;

  dailyData.forEach((day) => {
    if (day.proteins >= proteinTarget) {
      proteinGoalHitDays += 1;
    } else {
      underProteinDays += 1;
    }
  });

  // WEEKEND OVEREATING
  const calorieTarget = profile?.dailyCalories || 2000;
  const weekendLogs = logs.filter((log) => {
    const day = new Date(log.date).getDay();
    return day === 0 || day === 6;
  });

  const weekendCalories = weekendLogs.reduce(
    (acc, log) => acc + (log.calories || 0),
    0,
  );

  const weekendOvereating = weekendCalories > calorieTarget * 2;

  // DOMINANT MEAL TYPE
  const mealTypeCounts = {};

  logs.forEach((log) => {
    const type = log.mealType || "Unknown";
    mealTypeCounts[type] = (mealTypeCounts[type] || 0) + 1;
  });

  const dominantMealType = Object.keys(mealTypeCounts).reduce((a, b) =>
    mealTypeCounts[a] > mealTypeCounts[b] ? a : b,
  );

  // HIGHEST CALORIE FOOD
  const highestCalorieFood = logs.reduce((prev, curr) =>
    curr.calories > (prev?.calories || 0) ? curr : prev,
  );

  // HIGHEST PROTEIN FOOD
  const highestProteinFood = logs.reduce((prev, curr) =>
    curr.proteins > (prev?.proteins || 0) ? curr : prev,
  );

  // RESPONSE
  return {
    trackingConsistency,
    trackingDays,
    calorieSpikeDay,
    weekendOvereating,
    proteinGoalHitDays,
    underProteinDays,
    averageCalories: Math.round(averageCalories),
    averageProtein: Math.round(averageProtein),
    dominantMealType,
    highestCalorieFood: highestCalorieFood?.foodName || null,
    highestProteinFood: highestProteinFood?.foodName || null,
  };
};

module.exports = {
  generateNutritionPatterns,
};
