const { geminiPromptforDiet } = require('../utils/geminiDietPrompt');
const { getDietFromGemini } = require('../utils/gemini');
const DietPlan = require('../models/Diet');
const UserProfile = require('../models/UserProfile');

const MEAL_KEYS = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner'];

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFoods(rawFoods, fallbackText = '') {
  let foods = [];

  if (Array.isArray(rawFoods)) {
    foods = rawFoods
      .map((food) => {
        if (typeof food === 'string') {
          return {
            name: food.trim(),
            quantity: '',
          };
        }

        if (food && typeof food === 'object') {
          return {
            name: String(food.name || food.item || '').trim(),
            quantity: String(food.quantity || '').trim(),
          };
        }

        return null;
      })
      .filter((food) => food && food.name);
  }

  if (foods.length === 0 && typeof fallbackText === 'string' && fallbackText.trim()) {
    foods = fallbackText
      .split(/[,\n;]+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => ({ name: part, quantity: '' }));
  }

  return foods;
}

function normalizeMacroBlock(raw = {}) {
  return {
    calories: toNumber(raw.calories),
    protein: toNumber(raw.protein),
    carbohydrates: toNumber(raw.carbohydrates ?? raw.carbs),
    fats: toNumber(raw.fats ?? raw.fat),
  };
}

function normalizeMeal(rawMeal) {
  if (typeof rawMeal === 'string') {
    return {
      foods: normalizeFoods([], rawMeal),
      macros: normalizeMacroBlock({}),
    };
  }

  const safeMeal = rawMeal && typeof rawMeal === 'object' ? rawMeal : {};

  return {
    foods: normalizeFoods(safeMeal.foods || safeMeal.items, safeMeal.description || ''),
    macros: normalizeMacroBlock(safeMeal.macros || safeMeal.macro),
  };
}

function normalizePlan(rawPlan, index) {
  const safePlan = rawPlan && typeof rawPlan === 'object' ? rawPlan : {};
  const mealSource = safePlan.meals && typeof safePlan.meals === 'object' ? safePlan.meals : safePlan;
  const plan = {
    planNumber: toNumber(safePlan.planNumber) || index + 1,
    dailyTotals: normalizeMacroBlock(safePlan.dailyTotals || safePlan.totalMacros || safePlan.macros),
  };

  for (const mealKey of MEAL_KEYS) {
    plan[mealKey] = normalizeMeal(mealSource[mealKey]);
  }

  return plan;
}

function hasValidMealMacros(macros) {
  return Boolean(
    macros &&
    [macros.calories, macros.protein, macros.carbohydrates, macros.fats].some((value) => value !== null)
  );
}

function isValidMealPlan(meal) {
  return Boolean(
    meal &&
    typeof meal === 'object' &&
    Array.isArray(meal.foods) &&
    meal.foods.length > 0 &&
    hasValidMealMacros(meal.macros)
  );
}

function areValidPlans(plans) {
  return Array.isArray(plans) && plans.length === 2 && plans.every((plan) => {
    return MEAL_KEYS.every((mealKey) => isValidMealPlan(plan[mealKey])) && hasValidMealMacros(plan.dailyTotals);
  });
}

function buildRepairPrompt(userProfile, macros) {
  return `${geminiPromptforDiet(userProfile, macros)}

The previous response was invalid because it used plain text meals or omitted macro objects. Regenerate both plans from scratch.
Return strictly valid JSON only with the exact object structure above. Every meal must be an object with foods and macros.`;
}

function extractJsonArray(text) {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  let cleaned = jsonMatch ? jsonMatch[0] : text.trim();

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
  }

  return JSON.parse(cleaned);
}

function profileSnapshotFromInput(userProfile) {
  return {
    age: toNumber(userProfile.age),
    sex: String(userProfile.sex || '').toLowerCase(),
    weight: toNumber(userProfile.weight),
    height: toNumber(userProfile.height),
    activityLevel: String(userProfile.activityLevel || ''),
    goal: String(userProfile.goal || ''),
    diet: String(userProfile.diet || ''),
  };
}

function profileSnapshotFromDb(profile) {
  if (!profile) return null;

  return {
    age: toNumber(profile.age),
    sex: String(profile.sex || '').toLowerCase(),
    weight: toNumber(profile.weight),
    height: toNumber(profile.height),
    activityLevel: String(profile.activityLevel || ''),
    goal: String(profile.goal || ''),
    diet: String(profile.diet || ''),
  };
}

function isProfileSnapshotStale(savedSnapshot, currentSnapshot, dietPlansRaw) {
  if (!savedSnapshot || !currentSnapshot) return true;
  
  // Force regeneration if the old format (string instead of object for meals) is detected
  if (dietPlansRaw && dietPlansRaw.mealPlans && dietPlansRaw.mealPlans.length > 0) {
    const firstPlan = dietPlansRaw.mealPlans[0];
    if (firstPlan && typeof firstPlan.breakfast === 'string') {
      return true;
    }
  }

  return (
    savedSnapshot.age !== currentSnapshot.age ||
    savedSnapshot.sex !== currentSnapshot.sex ||
    savedSnapshot.weight !== currentSnapshot.weight ||
    savedSnapshot.height !== currentSnapshot.height ||
    savedSnapshot.activityLevel !== currentSnapshot.activityLevel ||
    savedSnapshot.goal !== currentSnapshot.goal ||
    savedSnapshot.diet !== currentSnapshot.diet
  );
}

function macroTargetsFromInput(macros) {
  return {
    total_calories: toNumber(macros.total_calories),
    carbohydrates: toNumber(macros.carbohydrates),
    fats: toNumber(macros.fats),
    protein: toNumber(macros.protein),
    water: toNumber(macros.water),
  };
}

function sumMealMacros(plan) {
  return MEAL_KEYS.reduce((totals, mealKey) => {
    const meal = plan?.[mealKey] || {};
    const macros = meal.macros || {};

    return {
      calories: totals.calories + (toNumber(macros.calories) || 0),
      protein: totals.protein + (toNumber(macros.protein) || 0),
      carbohydrates: totals.carbohydrates + (toNumber(macros.carbohydrates) || 0),
      fats: totals.fats + (toNumber(macros.fats) || 0),
    };
  }, {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
  });
}

function isWithinTargetWindow(actual, target) {
  if (!Number.isFinite(actual) || !Number.isFinite(target) || target <= 0) {
    return false;
  }

  return actual >= target * 0.9 && actual <= target * 1.1;
}

function harmonizePlanTotals(plan) {
  return {
    ...plan,
    dailyTotals: sumMealMacros(plan),
  };
}

function scaleMealMacrosToTargets(plan, macros) {
  const targetTotals = macroTargetsFromInput(macros);
  const mealTotals = sumMealMacros(plan);
  const factors = {
    calories: mealTotals.calories > 0 ? targetTotals.total_calories / mealTotals.calories : 1,
    protein: mealTotals.protein > 0 ? targetTotals.protein / mealTotals.protein : 1,
    carbohydrates: mealTotals.carbohydrates > 0 ? targetTotals.carbohydrates / mealTotals.carbohydrates : 1,
    fats: mealTotals.fats > 0 ? targetTotals.fats / mealTotals.fats : 1,
  };

  const scaledPlan = { ...plan };

  for (const mealKey of MEAL_KEYS) {
    const meal = scaledPlan[mealKey];
    if (!meal || typeof meal !== 'object') continue;

    meal.macros = {
      calories: Math.round((toNumber(meal.macros?.calories) || 0) * factors.calories),
      protein: Math.round((toNumber(meal.macros?.protein) || 0) * factors.protein),
      carbohydrates: Math.round((toNumber(meal.macros?.carbohydrates) || 0) * factors.carbohydrates),
      fats: Math.round((toNumber(meal.macros?.fats) || 0) * factors.fats),
    };
  }

  const balanceMacro = (macroKey, targetValue) => {
    const total = MEAL_KEYS.reduce((acc, mealKey) => acc + (toNumber(scaledPlan[mealKey]?.macros?.[macroKey]) || 0), 0);
    const remainder = targetValue - total;

    if (remainder !== 0 && scaledPlan.dinner?.macros) {
      scaledPlan.dinner.macros[macroKey] = Math.max(0, (toNumber(scaledPlan.dinner.macros[macroKey]) || 0) + remainder);
    }
  };

  balanceMacro('calories', targetTotals.total_calories);
  balanceMacro('protein', targetTotals.protein);
  balanceMacro('carbohydrates', targetTotals.carbohydrates);
  balanceMacro('fats', targetTotals.fats);

  return {
    ...scaledPlan,
    dailyTotals: {
      calories: targetTotals.total_calories,
      protein: targetTotals.protein,
      carbohydrates: targetTotals.carbohydrates,
      fats: targetTotals.fats,
    },
  };
}

function arePlansCloseToTargets(plans, macros) {
  const targets = macroTargetsFromInput(macros);

  return plans.every((plan) => {
    const mealTotals = sumMealMacros(plan);
    return (
      isWithinTargetWindow(mealTotals.calories, targets.total_calories) &&
      isWithinTargetWindow(mealTotals.protein, targets.protein) &&
      isWithinTargetWindow(mealTotals.carbohydrates, targets.carbohydrates) &&
      isWithinTargetWindow(mealTotals.fats, targets.fats)
    );
  });
}

function buildTargetRepairPrompt(userProfile, macros) {
  return `${buildRepairPrompt(userProfile, macros)}

The latest draft exceeded the macro targets. Reduce the portions and rebalance the meals so the sum of meal macros stays within 10% of the requested daily targets.
Do not return a plan where the combined calories, protein, carbohydrates, or fats exceed the target window.`;
}

exports.getDiet = async (req, res) => {
  try {
    const { userProfile, macros } = req.body;

    if (!userProfile || !macros) {
      return res.status(400).json({ error: "User profile and macros are required" });
    }

    let normalizedPlans = null;
    let lastRawResponse = '';

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const prompt = attempt === 0
        ? geminiPromptforDiet(userProfile, macros)
        : attempt === 1
          ? buildRepairPrompt(userProfile, macros)
          : buildTargetRepairPrompt(userProfile, macros);

      try {
        lastRawResponse = await getDietFromGemini(prompt);
        const parsedPlans = extractJsonArray(lastRawResponse);

        if (!Array.isArray(parsedPlans) || parsedPlans.length === 0) {
          throw new Error('Model did not return a non-empty array of plans.');
        }

        const candidatePlans = parsedPlans.map((plan, index) => normalizePlan(plan, index));

        if (!areValidPlans(candidatePlans)) {
          throw new Error('Model returned meal plans without structured foods and macros.');
        }

        normalizedPlans = candidatePlans.map((plan) => scaleMealMacrosToTargets(harmonizePlanTotals(plan), macros));

        if (!arePlansCloseToTargets(candidatePlans, macros)) {
          console.warn('Generated diet plans were outside the target window and were normalized to requested totals.');
        }

        break;
      } catch (parseError) {
        if (attempt === 2) {
          console.error('Failed to parse structured diet response. Response was:', lastRawResponse);
          return res.status(500).json({ error: "Failed to parse diet plans from model. Please try again." });
        }
      }
    }

    if (!normalizedPlans) {
      console.error('Failed to generate valid diet plans. Last response was:', lastRawResponse);
      return res.status(500).json({ error: "Failed to generate diet plans from model. Please try again." });
    }

    await DietPlan.findOneAndUpdate(
      { userId: userProfile.userId },
      { 
        userId: userProfile.userId,
        dietType: userProfile.diet,
        mealPlans: normalizedPlans,
        profileSnapshot: profileSnapshotFromInput(userProfile),
        macroTargets: macroTargetsFromInput(macros),
        generatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ 
      message: "Diet plans generated and saved successfully",
      dietPlans: normalizedPlans 
    });
  } catch (error) {
    console.error("Critical error in getDiet:", error);
    res.status(500).json({ error: "Failed to generate and save diet plans" });
  }
};

exports.getUserDietPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const dietPlans = await DietPlan.findOne({ userId });
    
    if (!dietPlans) {
      return res.status(404).json({ error: "No diet plans found for this user" });
    }

    const currentProfile = await UserProfile.findOne({ userId });
    const savedSnapshot = dietPlans.profileSnapshot || null;
    const currentSnapshot = profileSnapshotFromDb(currentProfile);
    const stale = isProfileSnapshotStale(savedSnapshot, currentSnapshot, dietPlans);

    res.status(200).json({ dietPlans, stale });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to retrieve diet plans" });
  }
};