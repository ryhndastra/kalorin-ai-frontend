const axios = require("axios");
const { generateNutritionPatterns } = require("./patternEngineService");
const { getFoodPatternService } = require("./foodPatternService");

// GET AI BEHAVIORAL INSIGHTS
const getBehavioralInsightsService = async (userId) => {
  try {
    // GENERATE BEHAVIOR PATTERNS
    const behavioralPatterns = await generateNutritionPatterns(userId);

    // GENERATE FOOD PATTERNS
    const foodPatterns = await getFoodPatternService(userId);

    // MERGE PAYLOAD
    const payload = {
      ...behavioralPatterns,
      ...foodPatterns,
    };

    // AI MICROSERVICE
    const response = await axios.post(
      "http://127.0.0.1:8000/api/behavioral-insights",
      payload,
    );

    // RETURN DATA
    return response.data.insights || [];
  } catch (error) {
    console.error("❌ AI Behavioral Insight Error:", error.message);
    return [
      {
        type: "info",
        title: "Insights Unavailable",
        message: "Behavioral insights could not be generated.",
      },
    ];
  }
};

module.exports = {
  getBehavioralInsightsService,
};
