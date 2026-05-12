import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api";

// GET ALL FOODS
export const getFoods = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/foods`);
    return response.data;
  } catch (error) {
    console.error("❌ Failed fetching foods:", error);
    throw error;
  }
};
