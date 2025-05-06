// routes/gemini.js
const express = require('express');
const router = express.Router();
const { estimateCalories } = require('../controllers/geminiController');

router.post('/estimate', estimateCalories);

module.exports = router;
