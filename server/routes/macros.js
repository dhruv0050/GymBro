const express = require('express');
const router = express.Router();
const Macros = require('../models/Macros');
const Profile = require('../models/UserProfile');
const { calculateMacros } = require('../utils/macroCalculator');

router.post('/calculate', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // 🔍 Fetch user profile
    const userProfile = await Profile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const { age, sex, weight, height, activityLevel, goal } = userProfile;

    // Calculate macros
    const macroData = calculateMacros({ age, sex, weight, height, activityLevel, goal });

    // Save or update macro document
    const updated = await Macros.findOneAndUpdate(
      { userId },
      { userId, ...macroData },
      { upsert: true, new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error('Macro calculation error:', err);
    res.status(500).json({ message: 'Server error during macro calculation' });
  }
});
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    const macros = await Macros.findOne({ userId });
    if (!macros) {
      return res.status(404).json({ message: 'No macros found for this user' });
    }
    res.status(200).json(macros);
  } catch (err) {
    console.error('Error fetching macros:', err);
    res.status(500).json({ message: 'Server error while fetching macros' });
  }
});

module.exports = router;
