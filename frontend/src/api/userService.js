import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUserProfile = async (userId) => {
  try {
    // nembak ke app.get("/api/profile/:userId", getProfile) di server.js
    const response = await axios.get(`${API_URL}/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    // nembak ke app.post("/api/profile", createOrUpdateProfile) di server.js
    const response = await axios.post(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
