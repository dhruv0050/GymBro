const UserProfile = require('../models/UserProfile');

exports.saveProfile = async (req, res) => {
  try {
    const { userId, age, weight, height, sex, activityLevel, goal, diet } = req.body;

    const existing = await UserProfile.findOne({ userId });

    if (existing) {
      // Update existing profile
      existing.age = age;
      existing.weight = weight;
      existing.height = height;
      existing.sex = sex;
      existing.activityLevel = activityLevel;
      existing.goal = goal;
      existing.diet = diet;
      await existing.save();
      return res.status(200).json(existing);
    }

    // Create new profile
    const newProfile = new UserProfile({ userId, age, weight, height, sex, activityLevel, goal, diet });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await UserProfile.findOne({ userId });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
