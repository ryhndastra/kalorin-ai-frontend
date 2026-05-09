const calculateDailyNeeds = (weight, height, birthdate, goal) => {
  // guard clause, kalau data ga lengkap kasih default standar minimal
  if (!weight || !height || !birthdate) {
    return { calories: 2000, protein: 100 };
  }

  // hitung umur
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // rumus basal metabolic rate
  // BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
  const bmr = 10 * parseFloat(weight) + 6.25 * parseFloat(height) - 5 * age + 5;

  // TDEE = BMR x Activity Multiplier
  // pake multiplier 1.375 (Lightly Active) sebagai standar aplikasi fitness
  let tdee = bmr * 1.375;

  let targetCalories = tdee;
  if (goal === "Weight Loss") {
    targetCalories = tdee - 500;
  } else if (goal === "Bulking") {
    targetCalories = tdee + 500;
  }

  let proteinMultiplier = 1.8;

  if (goal === "Weight Loss") {
    proteinMultiplier = 2.0;
  } else if (goal === "Bulking") {
    proteinMultiplier = 1.9;
  }

  let targetProtein = parseFloat(weight) * proteinMultiplier;

  return {
    calories: Math.round(targetCalories),
    protein: Math.round(targetProtein),
  };
};

module.exports = { calculateDailyNeeds };
