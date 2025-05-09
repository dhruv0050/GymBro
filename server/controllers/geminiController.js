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

const { buildGeminiPromptforMacros } = require('../utils/geminiPromptBuilder');
const { getMacrosFromGemini } = require('../utils/gemini');

exports.estimateMacros = async (req, res) => {
  try {
    const { userProfile } = req.body;

    // Basic validation
    if (!userProfile || !userProfile.age || !userProfile.weight || !userProfile.height) {
      return res.status(400).json({ error: "Missing required user profile fields" });
    }

    const prompt = buildGeminiPromptforMacros(userProfile);
    const text = await getMacrosFromGemini(prompt);

    // Parse Gemini response
    const parsed = {};
    text.split('\n').forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) {
        parsed[key.toLowerCase()] = value;
      }
    });

    res.status(200).json(parsed);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to estimate calories and macros" });
  }
};