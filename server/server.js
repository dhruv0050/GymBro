require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const workoutRoutes = require('./routes/workouts');
const profileRoutes = require('./routes/Profile');
const geminiRoutes = require('./routes/Gemini');
const macrosRoutes = require('./routes/macros');
const dietsRoutes = require('./routes/Diets');

const app = express();
const PORT = process.env.PORT || 5000; // Use the Vercel-assigned port

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route for root path
app.get("/", (req, res) => {
  res.send("GymBro Backend is running.");
});

// Routes
app.use('/api/gemini', geminiRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/macros', macrosRoutes);
app.use('/api/diets', dietsRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
