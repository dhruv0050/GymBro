const mongoose = require('mongoose');

const macrosSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  total_calories: Number,
  carbohydrates: Number,
  fats: Number,
  protein: Number,
  water: Number,
});

module.exports = mongoose.model('Macros', macrosSchema);