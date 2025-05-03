const Workout = require('../models/Workout');

exports.createWorkout = async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWorkout = async (req, res) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
