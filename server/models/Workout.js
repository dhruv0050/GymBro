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
    exercises: [ExerciseSchema]
  });  

module.exports = mongoose.model('Workout', WorkoutSchema);