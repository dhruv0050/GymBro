const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: String,
    repsAndWeights: [
      {
        reps: Number,
        weight: Number
      }
    ]
  });
  

  const WorkoutSchema = new mongoose.Schema({
    userId: String,
    muscleGroup: String,
    exercises: [ExerciseSchema],
    date: {
      type: String,
      default: () => new Date().toLocaleDateString("en-US") // e.g., "5/3/2025"
    },
    day: {
      type: String,
      default: () => new Date().toLocaleDateString("en-US", { weekday: 'long' }) // e.g., "Saturday"
    }
  });
  
module.exports = mongoose.model('Workout', WorkoutSchema);