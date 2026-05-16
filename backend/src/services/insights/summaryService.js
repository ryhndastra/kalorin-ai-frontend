const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getWeeklySummaryService = async (userId) => {
  // DATE RANGE
  const today = new Date();
  const sevenDaysAgo = new Date();
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

  // EMPTY STATE
  if (!logs.length) {
    return {
      averageCalories: 0,
      averageProtein: 0,
      totalMeals: 0,
      goalCompletionRate: 0,
    };
  }

  // TOTALS
  const totalCalories = logs.reduce(
    (acc, log) => acc + (log.calories || 0),
    0,
  );

  const totalProteins = logs.reduce(
    (acc, log) => acc + (log.proteins || 0),
    0,
  );

  // UNIQUE DAYS
  const uniqueDays = new Set(
    logs.map((log) => new Date(log.date).toDateString()),
  );

  const totalDays = uniqueDays.size || 1;

  // AVERAGES
  const averageCalories = Number((totalCalories / totalDays).toFixed(1));
  const averageProtein = Number((totalProteins / totalDays).toFixed(1));

  // GOAL COMPLETION
  const goalDays = [...uniqueDays].length;
  const goalCompletionRate = Number(((goalDays / 7) * 100).toFixed(0));

  return {
    averageCalories,
    averageProtein,
    totalMeals: logs.length,
    goalCompletionRate,
  };
};

module.exports = {
  getWeeklySummaryService,
};
