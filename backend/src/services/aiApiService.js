const axios = require("axios");
const { AI_URL, AI_TIMEOUT } = require("../config/aiConfig");
// AXIOS INSTANCE
const aiClient = axios.create({
  baseURL: AI_URL,
  timeout: AI_TIMEOUT,
});

// GENERIC REQUEST WRAPPER
const postToAI = async (endpoint, payload) => {
  try {
    const response = await aiClient.post(endpoint, payload);

    return response.data;
  } catch (error) {
    console.error(
      `❌ AI API Error (${endpoint}):`,
      error.response?.data || error.message,
    );

    throw new Error("AI service unavailable");
  }
};

// RECOMMENDATION
const requestRecommendation = async (payload) => {
  return await postToAI("/api/recommend", payload);
};

// INSIGHT
const requestInsight = async (payload) => {
  return await postToAI("/api/daily-insight", payload);
};

module.exports = {
  requestRecommendation,
  requestInsight,
};
