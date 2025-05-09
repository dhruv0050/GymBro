function buildGeminiPrompt(userProfile, workoutDetails) {
    return `
  You are a certified fitness trainer and calorie estimation expert. Based on the user's physical profile and the provided workout details, calculate the **total** estimated number of calories burned for the **entire workout session** using MET values or similar scientific estimations. Use all provided details for each exercise, and if duration is not specified, assume a typical duration for each set (e.g., 1.5 minutes per set).
  
  User Profile:
  - Age: ${userProfile.age}
  - Sex: ${userProfile.sex}
  - Weight: ${userProfile.weight}kg
  - Height: ${userProfile.height}cm
  
  Workout Details:
  ${workoutDetails.map((ex, i) => `
  ${i + 1}. Exercise: ${ex.name}
     Sets: ${ex.sets || "N/A"}
     Reps per set: ${ex.reps || "N/A"}
     Weight lifted: ${ex.weight || "N/A"}kg
     Duration: ${ex.duration || "N/A"} minutes
  `).join('')}
  
  Return only a single number — the **total** estimated calories burned for the entire workout session. With units, no explanation, no text, no formatting.
    `;
  }
module.exports = { buildGeminiPrompt };
  
function buildGeminiPromptforMacros(userProfile) {
  return `
You are a certified fitness trainer and nutrition expert. Based on the user's physical profile, estimate the **total daily calorie requirement** along with the required amounts of **carbohydrates, fats, and protein** to help the user reach their fitness goal.

User Profile:
- Age: ${userProfile.age}
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- Activity Level: ${userProfile.activityLevel} (e.g., high, medium, low)
- Fitness Goal: ${userProfile.goal} (e.g., gain muscle, gain weight, lose weight, maintain weight)

Return your response in the following format:
Calories: <number> kcal  
Carbohydrates: <number> g  
Protein: <number> g  
Fats: <number> g
`;
}
module.exports = { buildGeminiPromptforMacros };
  
