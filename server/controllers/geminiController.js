// controllers/geminiController.js
const { buildGeminiPrompt } = require('../utils/geminiPromptBuilder');
const { getCaloriesFromGemini } = require('../utils/gemini');

exports.estimateCalories = async (req, res) => {
  try {
    const { userProfile, workoutDetails } = req.body;

    const prompt = buildGeminiPrompt(userProfile, workoutDetails);
    const calories = await getCaloriesFromGemini(prompt);

    res.status(200).json({ calories });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to estimate calories" });
  }
};