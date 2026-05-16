const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET STREAK DATA
const getStreakService = async (userId) => {
  // USER PROFILE
  const user = await prisma.profile.findFirst({
    where: {
      userId,
    },
  });

  // FETCH LOGS
  const logs = await prisma.dailyLog.findMany({
    where: {
      userId,
    },
    select: {
      date: true,
      proteins: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // EMPTY
  if (!logs.length) {
    return {
      trackingStreak: 0,
      longestTrackingStreak: 0,
      proteinStreak: 0,
    };
  }

  // UNIQUE DAYS
  const groupedDays = {};

  logs.forEach((log) => {
    const dateKey = new Date(log.date).toISOString().split("T")[0];

    if (!groupedDays[dateKey]) {
      groupedDays[dateKey] = {
        proteins: 0,
      };
    }

    groupedDays[dateKey].proteins += log.proteins || 0;
  });

  const uniqueDays = Object.keys(groupedDays).sort();

  // TRACKING STREAKS
  let trackingStreak = 0;
  let longestTrackingStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      currentStreak++;
      longestTrackingStreak = Math.max(longestTrackingStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  // ACTIVE TRACKING STREAK
  const lastTrackedDate = new Date(uniqueDays[uniqueDays.length - 1]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffFromToday = (today - lastTrackedDate) / (1000 * 60 * 60 * 24);

  if (diffFromToday <= 1) {
    trackingStreak = currentStreak;
  } else {
    trackingStreak = 0;
  }

  // PROTEIN STREAK
  const proteinTarget = user?.proteinTarget || 100;
  let proteinStreak = 0;
  const reversedDays = [...uniqueDays].reverse();

  for (const day of reversedDays) {
    const protein = groupedDays[day].proteins;
    if (protein >= proteinTarget) {
      proteinStreak++;
    } else {
      break;
    }
  }

  // RETURN
  return {
    trackingStreak,
    longestTrackingStreak,
    proteinStreak,
  };
};

module.exports = {
  getStreakService,
};
