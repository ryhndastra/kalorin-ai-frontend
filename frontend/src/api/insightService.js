import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// GET WEEKLY SUMMARY
export const getWeeklySummary = async (userId) => {
  const response = await axios.get(`${API_URL}/api/insights/weekly-summary`, {
    params: {
      userId,
    },
  });

  return response.data;
};

// GET WEEKLY TRENDS
export const getWeeklyTrends = async (userId) => {
  const response = await axios.get(`${API_URL}/api/insights/weekly-trends`, {
    params: {
      userId,
    },
  });

  return response.data;
};

export const getBehavioralInsights = async (userId) => {
  const response = await axios.get(
    `${API_URL}/api/insights/behavioral-insights`,
    {
      params: {
        userId,
      },
    },
  );

  return response.data;
};

export const getWeeklyComparison = async (userId) => {
  const response = await axios.get(
    `${API_URL}/api/insights/weekly-comparison`,
    {
      params: {
        userId,
      },
    },
  );

  return response.data;
};

// GET WEEKLY SCORE
export const getWeeklyScore = async (userId) => {
  const response = await axios.get(`${API_URL}/api/insights/weekly-score`, {
    params: {
      userId,
    },
  });

  return response.data;
};

// GET STREAKS
export const getStreaks = async (userId) => {
  const response = await axios.get(`${API_URL}/api/insights/streaks`, {
    params: {
      userId,
    },
  });

  return response.data;
};
