// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const workoutRoutes = require('./routes/workouts');
const profileRoutes = require('./routes/Profile');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use('/api/workouts', workoutRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
