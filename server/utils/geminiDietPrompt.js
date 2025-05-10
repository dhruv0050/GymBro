function geminiPromptforDiet(userProfile, macros) {
  return `You are a highly experienced and certified fitness trainer and nutrition specialist, renowned for crafting effective and personalized diet plans. Based on the following detailed user profile and their specific daily macronutrient targets for achieving their desired physique, generate four distinct and comprehensive daily meal plans. Each plan should clearly specify Breakfast, Snack 1, Lunch, Snack 2, and Dinner, ensuring that the total daily intake closely aligns with the provided macro requirements while offering a variety of nutritious and appealing food options.

User Profile:
- Age: ${userProfile.age} years old
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kilograms
- Height: ${userProfile.height} centimeters
- Activity Level: ${userProfile.activityLevel} (e.g., less active, moderately active, highly active)
- Fitness Goal: ${userProfile.goal} (e.g., gain weight, gain muscle, losse weight, maintain weight)
- Dietary Preferences: ${userProfile.diet} (e.g., vegetarian, non-vegetarian, vegan)

Daily Nutritional Targets:
- Total Calories: ${macros.total_calories} calories
- Carbohydrates: ${macros.carbohydrates} grams (Consider specifying "Net Carbs" if that's the primary metric)
- Fats: ${macros.fats} grams
- Protein: ${macros.protein} grams
- Daily Water Intake Goal: ${macros.water} liters

Meal Plan Requirements:
- Generate 4 distinct full-day meal plans.
- Each meal plan must include:
  - Breakfast
  - Snack 1
  - Lunch
  - Snack 2
  - Dinner
- Each meal within the plan should list specific food items and approximate quantities to help the user meet their daily macro targets.
- Ensure a variety of whole foods and nutrient-dense options across the different meal plans.
- Consider practical aspects like meal preparation time and accessibility of ingredients where appropriate.
- Briefly highlight a key characteristic or focus of each meal plan (e.g., "Plan 1: High Protein Focus," "Plan 2: Emphasis on Complex Carbs for Energy").`;
}

module.exports = { geminiPromptforDiet };