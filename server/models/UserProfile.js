const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  age: Number,
  weight: Number,
  height: Number,
  sex: String,
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
