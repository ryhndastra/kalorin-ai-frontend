const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { calculateUserStatus } = require("../utils/bmiUtils");

const createOrUpdateProfile = async (req, res) => {
  try {
    const { userId, name, email, weight, height, goal, birthdate } = req.body;

    const userStatus =
      weight && height ? calculateUserStatus(weight, height) : "Normal";

    const profile = await prisma.profile.upsert({
      where: { userId: userId },
      update: {
        fullName: name,
        weight: parseFloat(weight),
        height: parseFloat(height),
        goal,
        userStatus,
        birthdate: birthdate ? new Date(birthdate) : null, 
      },
      create: {
        userId,
        email,
        fullName: name,
        weight: parseFloat(weight),
        height: parseFloat(height),
        goal,
        userStatus,
        birthdate: birthdate ? new Date(birthdate) : null,
      },
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.params.userId },
    });
    if (!profile)
      return res.status(404).json({ message: "Profil tidak ditemukan" });
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrUpdateProfile, getProfile };
