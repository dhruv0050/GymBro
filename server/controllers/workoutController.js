const Workout = require('../models/Workout');
const UserProfile = require('../models/UserProfile');
const { buildGeminiPrompt } = require('../utils/geminiPromptBuilder');
const { getCaloriesFromGemini } = require('../utils/gemini');

// Helper to parse Gemini's response and extract the number
function extractCalories(text) {
  // Extract the first number in the string
  const match = text.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

exports.createWorkout = async (req, res) => {
  try {
    const { userId, exercises } = req.body;
    // Fetch user profile
    const userProfile = await UserProfile.findOne({ userId });
    // Prepare workoutDetails for Gemini
    const workoutDetails = exercises.map((ex) => ({
      name: ex.name,
      sets: ex.repsAndWeights.length,
      reps: ex.repsAndWeights.map((rw) => rw.reps).join(", "),
      weight: ex.repsAndWeights.map((rw) => rw.weight).join(", "),
      duration: ex.duration
    }));
    // Build prompt and get calories
    let burntCalories = 0;
    if (userProfile) {
      const prompt = buildGeminiPrompt(userProfile, workoutDetails);
      const geminiResult = await getCaloriesFromGemini(prompt);
      burntCalories = extractCalories(geminiResult);
    }
    // Save workout with burntCalories
    const newWorkout = new Workout({ ...req.body, burntCalories });
    await newWorkout.save();
    res.status(201).json(newWorkout);
    console.log("Prompt:", prompt);
    console.log("Gemini result:", geminiResult);
    console.log("Extracted calories:", burntCalories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserWorkouts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const workouts = await Workout.find({ user: userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const { userId, exercises } = req.body;
    // Fetch user profile
    const userProfile = await UserProfile.findOne({ userId });
    // Prepare workoutDetails for Gemini
    const workoutDetails = exercises.map((ex) => ({
      name: ex.name,
      sets: ex.repsAndWeights.length,
      reps: ex.repsAndWeights.map((rw) => rw.reps).join(", "),
      weight: ex.repsAndWeights.map((rw) => rw.weight).join(", "),
    }));
    // Build prompt and get calories
    let burntCalories = 0;
    if (userProfile) {
      const prompt = buildGeminiPrompt(userProfile, workoutDetails);
      const geminiResult = await getCaloriesFromGemini(prompt);
      console.log("Prompt:", prompt);
      console.log("Gemini result:", geminiResult);
      burntCalories = extractCalories(geminiResult);
      console.log("Extracted calories:", burntCalories);
    }
    // Update workout with new burntCalories
    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      { ...req.body, burntCalories },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWorkoutsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const workouts = await Workout.find({ userId }).sort({ date: -1 });

    const formatted = workouts.map(workout => {
      const dateObj = new Date(workout.date);
      const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      const formattedDate = dateObj.toLocaleDateString();

      return {
        _id: workout._id,
        muscleGroup: workout.muscleGroup,
        exercises: workout.exercises,
        date: formattedDate,
        day,
        burntCalories: workout.burntCalories,
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
