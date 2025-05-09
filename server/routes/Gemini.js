// routes/gemini.js
const { estimateCalories , estimateMacros} = require('../controllers/geminiController');

const express = require('express');
const router = express.Router();
const { buildGeminiPromptforMacros } = require('../utils/geminiPromptBuilder');
const { getMacrosFromGemini } = require('../utils/gemini');

router.post('/estimate', estimateCalories);
router.post('/test-macros', estimateMacros);

module.exports = router;