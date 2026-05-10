import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

export const getFoodRecommendation = async (userId, foodId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ai/food-detail`, {
      userId,
      foodId,
    });

    return response.data;
  } catch (error) {
    console.error("Gagal dapet saran dari RinAI:", error);
    throw error;
  }
};
