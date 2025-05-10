const { geminiPromptforDiet } = require('../utils/geminiDietPrompt');
const { getDietFromGemini } = require('../utils/gemini');
const DietPlan = require('../models/Diet');

exports.getDiet = async (req, res) => {
  try {
    const { userProfile, macros } = req.body;

    if (!userProfile || !macros) {
      return res.status(400).json({ error: "User profile and macros are required" });
    }

    const prompt = geminiPromptforDiet(userProfile, macros);
    const dietPlans = await getDietFromGemini(prompt);

    // Parse the Gemini response into structured meal plans
    const parsedPlans = parseDietPlans(dietPlans);

    // Save the diet plans to the database
    const dietPlan = new DietPlan({
      userId: userProfile.userId,
      dietType: userProfile.diet,
      mealPlans: parsedPlans
    });

    await dietPlan.save();

    res.status(200).json({ 
      message: "Diet plans generated and saved successfully",
      dietPlans: parsedPlans 
    });
  } catch (error) {
    console.error("Error:", error);
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

    res.status(200).json({ dietPlans });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to retrieve diet plans" });
  }
};

// Helper function to parse Gemini response into structured meal plans
function parseDietPlans(geminiResponse) {
  // Split the response into individual plans
  const plans = geminiResponse.split('Plan').filter(plan => plan.trim());
  
  return plans.map((plan, index) => {
    const meals = plan.split('\n').filter(line => line.trim());
    return {
      planNumber: index + 1,
      breakfast: extractMeal(meals, 'Breakfast'),
      snack1: extractMeal(meals, 'Snack 1'),
      lunch: extractMeal(meals, 'Lunch'),
      snack2: extractMeal(meals, 'Snack 2'),
      dinner: extractMeal(meals, 'Dinner')
    };
  });
}

function extractMeal(meals, mealType) {
  const mealIndex = meals.findIndex(meal => meal.includes(mealType));
  if (mealIndex === -1) return '';
  
  let mealContent = '';
  let i = mealIndex + 1;
  while (i < meals.length && !meals[i].includes(':')) {
    mealContent += meals[i].trim() + ' ';
    i++;
  }
  return mealContent.trim();
}