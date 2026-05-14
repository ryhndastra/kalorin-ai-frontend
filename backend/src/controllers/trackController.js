const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ADD MEAL TO DAILY LOG
const addMealLog = async (req, res) => {
  try {
    const {
      userId,
      foodId,
      foodName,
      calories,
      proteins,
      fat,
      carbs,
      quantity = 1,
      mealType = "meal",
    } = req.body;

    // VALIDATION
    if (!userId || !foodName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // GET DAY NAME
    const today = new Date();
    const day = today.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // CREATE DAILY LOG
    const mealLog = await prisma.dailyLog.create({
      data: {
        userId,
        foodId,
        foodName,
        calories: parseFloat(calories) || 0,
        proteins: parseFloat(proteins) || 0,
        fat: parseFloat(fat) || 0,
        carbs: parseFloat(carbs) || 0,
        quantity: parseFloat(quantity) || 1,
        mealType,
        day: day.toLowerCase(),
      },
    });

    res.json({
      success: true,
      data: mealLog,
    });
  } catch (error) {
    console.error("❌ Error addMealLog:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET DAILY LOGS
const getDailyLogs = async (req, res) => {
  try {
    const { userId, date } = req.query;

    // VALIDATION
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // DEFAULT TODAY
    const selectedDate = date ? new Date(`${date}T00:00:00`) : new Date();

    // START OF DAY
    const startOfDay = new Date(selectedDate);

    startOfDay.setHours(0, 0, 0, 0);

    // END OF DAY
    const endOfDay = new Date(selectedDate);

    endOfDay.setHours(23, 59, 59, 999);

    // FETCH LOGS
    const logs = await prisma.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // CALCULATE TOTALS
    const totals = logs.reduce(
      (acc, log) => {
        acc.calories += log.calories || 0;
        acc.proteins += log.proteins || 0;
        acc.fat += log.fat || 0;
        acc.carbs += log.carbs || 0;
        return acc;
      },
      {
        calories: 0,
        proteins: 0,
        fat: 0,
        carbs: 0,
      },
    );

    res.json({
      success: true,
      data: {
        logs,
        totals,
      },
    });
  } catch (error) {
    console.error("❌ Error getDailyLogs:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMealLog,
  getDailyLogs,
};
