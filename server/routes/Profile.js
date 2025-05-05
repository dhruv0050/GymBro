const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/', profileController.saveProfile);            // POST /api/profile
router.get('/:userId', profileController.getProfile);       // GET /api/profile/:userId

module.exports = router;
