function calculateMacros(userProfile) {
  const { age, sex, weight, height, activityLevel, goal } = userProfile;

  // Convert weight to kg, height to cm
  const weightKg = parseFloat(weight);
  const heightCm = parseFloat(height);

  // BMR Calculation (Mifflin-St Jeor Equation)
  let bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  // Activity multiplier
  const activityMap = {
    'less active': 1.2,
    'moderately active': 1.55,
    'highly active': 1.9
  };
  const activityKey = (activityLevel || '').toLowerCase();
  const activityFactor = activityMap[activityKey] || 1.2; // default to 'Less Active'

  let calories = bmr * activityFactor;

  // Adjust calories based on fitness goal
  switch (goal.toLowerCase()) {
    case 'gain weight':
      calories += 500;
      break;
    case 'gain muscle':
      calories += 300;
      break;
    case 'lose weight':
      calories -= 500;
      break;
    case 'maintain weight':
    default:
      break;
  }

  // Macronutrient distribution
  let protein = weightKg * 2; // grams
  let fats = weightKg * 1; // grams
  let proteinCal = protein * 4;
  let fatCal = fats * 9;

  let carbsCal = calories - (proteinCal + fatCal);
  let carbs = carbsCal / 4;

  // Water intake in liters
  let water = weightKg * 0.033;

  return {
    total_calories: Math.round(calories),
    carbohydrates: Math.round(carbs),
    fats: Math.round(fats),
    protein: Math.round(protein),
    water: parseFloat(water.toFixed(2))
  };
}

module.exports = { calculateMacros };
