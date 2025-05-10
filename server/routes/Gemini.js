const { estimateCalories} = require('../controllers/geminiController');

const express = require('express');
const router = express.Router();

router.post('/estimate', estimateCalories);

module.exports = router;