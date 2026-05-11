const AI_URL = process.env.AI_URL || "http://localhost:8000";

const MAX_FOOD_SCAN = 15;

const AI_TIMEOUT = 10000;

const CACHE_TTL = 1000 * 60 * 30; // 30 min

const INSIGHT_TTL = 1000 * 60 * 60 * 6; // 6h

const RECOMMENDATION_LIST_TTL = 1000 * 60 * 60 * 6; // 6h

const CONCURRENT_LIMIT = 3;

module.exports = {
  AI_URL,
  MAX_FOOD_SCAN,
  AI_TIMEOUT,
  CACHE_TTL,
  INSIGHT_TTL,
  RECOMMENDATION_LIST_TTL,
  CONCURRENT_LIMIT,
};
