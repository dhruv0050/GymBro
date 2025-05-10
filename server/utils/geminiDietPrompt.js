function geminiPromptforDiet(userProfile, macros) {
  return `You are a highly experienced and certified fitness trainer and nutrition specialist, renowned for crafting effective and personalized diet plans. Based on the following detailed user profile and their specific daily macronutrient targets, generate two distinct and comprehensive daily meal plans.

Return ONLY a valid JSON array (no explanation, no markdown, no extra text), where each plan is an object with the following keys: planNumber, breakfast, snack1, lunch, snack2, dinner. Each meal should be a string listing specific food items and approximate quantities. Do not omit any meal or leave any field empty.

Example:
[
  {
    "planNumber": 1,
    "breakfast": "2 eggs, 1 cup oatmeal, 1 banana",
    "snack1": "Greek yogurt, 10 almonds",
    "lunch": "Grilled chicken breast, 1 cup brown rice, mixed vegetables",
    "snack2": "Protein shake",
    "dinner": "Salmon, sweet potato, broccoli"
  },
  ...
]

User Profile:
- Age: ${userProfile.age} years old
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kilograms
- Height: ${userProfile.height} centimeters
- Activity Level: ${userProfile.activityLevel}
- Fitness Goal: ${userProfile.goal}
- Dietary Preferences: ${userProfile.diet}

Daily Nutritional Targets:
- Total Calories: ${macros.total_calories} calories
- Carbohydrates: ${macros.carbohydrates} grams
- Fats: ${macros.fats} grams
- Protein: ${macros.protein} grams
- Daily Water Intake Goal: ${macros.water} liters

Requirements:
- Generate 2 full-day meal plans.
- Each plan must include: breakfast, snack1, lunch, snack2, dinner.
- Each meal should list specific food items and approximate quantities.
- Ensure variety and practicality.
- DO NOT include any explanation, markdown, or text outside the JSON array.
`;
}

module.exports = { geminiPromptforDiet };