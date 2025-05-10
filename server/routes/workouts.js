// routes/workouts.js
const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Create
router.post('/', workoutController.createWorkout);
 
// Read
router.get('/:userId', workoutController.getUserWorkouts);

// Update
router.put('/:id', workoutController.updateWorkout);

// Delete
router.delete('/:id', workoutController.deleteWorkout);

router.get('/user/:userId', workoutController.getWorkoutsByUser);

module.exports = router;
