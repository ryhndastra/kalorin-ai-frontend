const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getWeeklyComparisonService = async (userId) => {
  // DATE RANGES
  const today = new Date();

  // CURRENT WEEK
  const currentWeekStart = new Date();
  currentWeekStart.setDate(today.getDate() - 6);
  currentWeekStart.setHours(0, 0, 0, 0);

  // PREVIOUS WEEK
  const previousWeekStart = new Date();
  previousWeekStart.setDate(today.getDate() - 13);
  previousWeekStart.setHours(0, 0, 0, 0);
  const previousWeekEnd = new Date();
  previousWeekEnd.setDate(today.getDate() - 7);
  previousWeekEnd.setHours(23, 59, 59, 999);

  // FETCH LOGS
  const [currentLogs, previousLogs] = await Promise.all([
    prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: currentWeekStart,
          lte: today,
        },
      },
    }),

    prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: previousWeekStart,
          lte: previousWeekEnd,
        },
      },
    }),
  ]);

  // HELPERS
  const sumCalories = (logs) =>
    logs.reduce((acc, log) => acc + (log.calories || 0), 0);

  const sumProteins = (logs) =>
    logs.reduce((acc, log) => acc + (log.proteins || 0), 0);

  const uniqueTrackingDays = (logs) =>
    new Set(logs.map((log) => new Date(log.date).toDateString())).size;

  // TOTALS
  const currentCalories = sumCalories(currentLogs);
  const previousCalories = sumCalories(previousLogs);
  const currentProteins = sumProteins(currentLogs);
  const previousProteins = sumProteins(previousLogs);
  const currentTracking = uniqueTrackingDays(currentLogs);
  const previousTracking = uniqueTrackingDays(previousLogs);

  // BASELINE
  const hasPreviousData = previousLogs.length > 0;

  // PERCENT CALCULATOR
  const calculatePercentChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(0));
  };

  // RETURN
  return {
    caloriesChange: calculatePercentChange(currentCalories, previousCalories),
    proteinsChange: calculatePercentChange(currentProteins, previousProteins),
    trackingChange: calculatePercentChange(currentTracking, previousTracking),
    hasPreviousData,
  };
};

module.exports = {
  getWeeklyComparisonService,
};
