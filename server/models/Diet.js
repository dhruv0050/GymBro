const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    dietType: { type: String, required: true },
    mealPlans: [
        {
            planNumber: { type: Number, required: true },
            breakfast: { type: String },
            snack1: { type: String },
            lunch: { type: String },
            snack2: { type: String },
            dinner: { type: String },
        },
    ],
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);