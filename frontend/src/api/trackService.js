import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
// ADD MEAL LOG
export const addMealLog = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/api/track/add`, payload);
    return response.data;
  } catch (error) {
    console.error("❌ Failed add meal log:", error);
    throw error;
  }
};

// GET DAILY LOGS
export const getDailyLogs = async (userId, date) => {
  try {
    const response = await axios.get(`${API_URL}/api/track/logs`, {
      params: {
        userId,
        date,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Failed get daily logs:", error);

    throw error;
  }
};
