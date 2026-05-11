import axios from "axios";

// AXIOS INSTANCE
const API_BASE_URL = "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// FOOD DETAIL AI
export const getFoodRecommendation = async (userId, foodId) => {
  try {
    const response = await apiClient.post("/ai/food-detail", {
      userId,
      foodId,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Gagal dapet detail recommendation:", error);

    throw error;
  }
};

// FOOD LIST AI
export const getFoodRecommendations = async (userId) => {
  try {
    const response = await apiClient.post("/ai/food-list", {
      userId,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Gagal load recommendation list:", error);

    throw error;
  }
};

// DAILY INSIGHT
export const getDailyInsight = async (userId, macroContext) => {
  try {
    const response = await apiClient.post("/ai/recommend", {
      userId,
      macroContext,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Gagal load insight:", error);

    throw error;
  }
};

export default apiClient;
