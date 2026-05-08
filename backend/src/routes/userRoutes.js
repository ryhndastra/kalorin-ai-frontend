const express = require("express");
const router = express.Router();
const {
  createOrUpdateProfile,
  getProfile,
} = require("../controllers/userController");

// Endpoint untuk sinkronisasi (POST)
router.post("/profile", createOrUpdateProfile);

// Endpoint untuk ambil data (GET)
router.get("/profile/:userId", getProfile);

module.exports = router;
