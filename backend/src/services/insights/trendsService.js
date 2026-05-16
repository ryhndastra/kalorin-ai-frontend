const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET JAKARTA DATE
const getJakartaDate = () => {
  return new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    }),
  );
};

// FORMAT LOCAL DATE
const formatLocalDate = (date) => {
  return new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Jakarta",
  });
};

// GET WEEKLY TRENDS
const getWeeklyTrendsService = async (userId) => {
  // TODAY (JAKARTA)
  const today = getJakartaDate();

  // END OF TODAY
  today.setHours(23, 59, 59, 999);

  // START RANGE
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

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

  // DEBUG
  console.log("TODAY:", today);
  console.log("SEVEN DAYS AGO:", sevenDaysAgo);
  console.log(
    "LOG DATES:",
    logs.map((log) => ({
      raw: log.date,
      formatted: formatLocalDate(log.date),
    })),
  );

  // EMPTY 7 DAYS
  const grouped = {};

  for (let i = 6; i >= 0; i--) {
    const current = new Date(today);
    current.setDate(today.getDate() - i);
    const key = formatLocalDate(current);
    
    grouped[key] = {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fat: 0,
    };
  }

  // GROUP LOGS
  logs.forEach((log) => {
    const dayKey = formatLocalDate(log.date);

    if (!grouped[dayKey]) {
      grouped[dayKey] = {
        calories: 0,
        proteins: 0,
        carbs: 0,
        fat: 0,
      };
    }

    grouped[dayKey].calories += log.calories || 0;
    grouped[dayKey].proteins += log.proteins || 0;
    grouped[dayKey].carbs += log.carbs || 0;
    grouped[dayKey].fat += log.fat || 0;
  });

  // RESPONSE
  const trends = Object.entries(grouped).map(([date, values]) => ({
    date,
    calories: Number(values.calories.toFixed(1)),
    proteins: Number(values.proteins.toFixed(1)),
    carbs: Number(values.carbs.toFixed(1)),
    fat: Number(values.fat.toFixed(1)),
  }));

  console.log("FINAL TRENDS:", trends);
  return trends;
};

module.exports = {
  getWeeklyTrendsService,
};
