function buildGeminiPrompt(userProfile, workoutDetails) {
    return `
  You are a certified fitness trainer and calorie estimation expert. Based on the user's physical profile and the provided workout details, calculate an estimated number of calories burned during the session using MET values or similar scientific estimations.
  
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
  
  Return only a single number — the estimated calories burned. No units, no explanation, no text, no formatting.
    `;
  }
module.exports = { buildGeminiPrompt };
  
