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
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
  
app.use('/api/gemini', geminiRoutes);
  
app.use('/api/workouts', workoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/macros', macrosRoutes);
app.use('/api/diets', dietsRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
