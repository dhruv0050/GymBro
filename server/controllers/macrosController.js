const Macros = require('../models/Macros');
const UserProfile = require('../models/UserProfile');
const calculateMacros = require('../utils/macroCalculator');

const calculateAndSaveMacros = async (req, res) => {
  try {
    const { userId } = req.body;

    // Getting user's profile data from DB
    const userProfile = await UserProfile.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Calculate macros based on profile
    const macros = calculateMacros(userProfile);

    // Save or update in Macros collection
    const savedMacros = await Macros.findOneAndUpdate(
      { userId },
      { userId, ...macros },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Macros calculated successfully', data: savedMacros });
  } catch (err) {
    console.error('Error calculating macros:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { calculateAndSaveMacros };
