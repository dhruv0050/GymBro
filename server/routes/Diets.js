const { getDiet, getUserDietPlans } = require('../controllers/dietController');

const express = require('express');
const router = express.Router();

router.post('/diet', getDiet);
router.get('/diet/:userId', getUserDietPlans);

module.exports = router;