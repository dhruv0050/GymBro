function geminiPromptforDiet(userProfile, macros) {
  return `You are a highly experienced fitness nutritionist. Create 2 practical full-day meal plans.

Return ONLY valid JSON (no markdown, no explanation, no extra text) using exactly this schema. Do not return meal strings; every meal must be an object with foods and macros:
[
  {
    "planNumber": 1,
    "breakfast": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "snack1": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "lunch": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "snack2": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "dinner": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "dailyTotals": {
      "calories": 0,
      "protein": 0,
      "carbohydrates": 0,
      "fats": 0
    }
  },
  {
    "planNumber": 2,
    "breakfast": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "snack1": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "lunch": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "snack2": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "dinner": {
      "foods": [
        { "name": "string", "quantity": "string" }
      ],
      "macros": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "fats": 0
      }
    },
    "dailyTotals": {
      "calories": 0,
      "protein": 0,
      "carbohydrates": 0,
      "fats": 0
    }
  }
]

User Profile:
- Age: ${userProfile.age} years
- Sex: ${userProfile.sex}
- Weight: ${userProfile.weight} kg
- Height: ${userProfile.height} cm
- Activity Level: ${userProfile.activityLevel}
- Goal: ${userProfile.goal}
- Diet Preference: ${userProfile.diet}

Daily Targets:
- Calories: ${macros.total_calories}
- Protein (g): ${macros.protein}
- Carbohydrates (g): ${macros.carbohydrates}
- Fats (g): ${macros.fats}
- Water (L): ${macros.water}

Rules:
- Include exactly 5 meals: breakfast, snack1, lunch, snack2, dinner.
- Every meal must include foods array with clear food names and quantities.
- Every meal must include macros with numeric values only.
- Never output breakfast/snack/lunch/dinner as plain text strings.
- Never omit macros for any meal.
- Never repeat the same foods in both plans unless required by the target macros.
- Distribute macros so the sum of the 5 meal macros equals dailyTotals.
- Make dailyTotals match the daily targets as closely as possible.
- Keep each meal within a realistic share of the daily target:
  breakfast 20-25%, snack1 8-12%, lunch 28-32%, snack2 8-12%, dinner 25-30%.
- Do not create a meal whose calories alone exceed 40% of the day's calories.
- Foods must be realistic, practical, and align with Diet Preference.
- Keep plans varied from each other.
- Return JSON only.
`;
}

module.exports = { geminiPromptforDiet };