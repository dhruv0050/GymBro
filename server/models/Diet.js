const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    dietType: { type: String, required: true },
    mealPlans: [{ type: mongoose.Schema.Types.Mixed }],
    profileSnapshot: {
        age: Number,
        sex: String,
        weight: Number,
        height: Number,
        activityLevel: String,
        goal: String,
        diet: String,
    },
    macroTargets: {
        total_calories: Number,
        carbohydrates: Number,
        fats: Number,
        protein: Number,
        water: Number,
    },
    generatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);