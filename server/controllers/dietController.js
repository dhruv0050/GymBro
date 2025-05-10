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
    const dietPlansRaw = await getDietFromGemini(prompt);

    let parsedPlans;
    try {
      let cleaned = dietPlansRaw.trim();
      // Remove markdown code block if present
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
      }
      parsedPlans = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", dietPlansRaw);
      return res.status(500).json({ error: "Failed to parse diet plans from Gemini. Please try again." });
    }

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