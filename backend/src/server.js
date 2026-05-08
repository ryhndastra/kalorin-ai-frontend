require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const { getAllFoods, getFoodById } = require("./controllers/foodController");
const {
  createOrUpdateProfile,
  getProfile,
} = require("./controllers/userController");
const { getFoodRecommendation } = require("./controllers/aiController");
const user_routes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint Tes
app.get("/", (req, res) => res.send("API KalorinAI Running! 🚀"));

// Endpoint Food
app.get("/api/foods", getAllFoods);
app.get("/api/foods/:id", getFoodById);
// Endpoint User Profile
app.post("/api/profile", createOrUpdateProfile);
app.get("/api/profile/:userId", getProfile);
app.use("/api/user", user_routes);
// Endpoint AI Recommendation
app.post("/api/ai/recommend", getFoodRecommendation);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
