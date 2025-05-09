// routes/gemini.js
const { estimateCalories} = require('../controllers/geminiController');

const express = require('express');
const router = express.Router();
const { buildGeminiPromptforMacros } = require('../utils/geminiPromptBuilder');
const { getMacrosFromGemini } = require('../utils/gemini');

router.post('/estimate', estimateCalories);
router.post('/test-macros', async (req, res) => {
  try {
    const { userProfile } = req.body;
    const prompt = buildGeminiPromptforMacros(userProfile);
    const text = await getMacrosFromGemini(prompt);

    const parsed = {};
    text.split('\n').forEach(line => {
      const [key, value] = line.split(':').map(s => s.trim());
      if (key && value) parsed[key.toLowerCase()] = value;
    });

    res.status(200).json(parsed);
  } catch (error) {
    console.error("Test Macros Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;