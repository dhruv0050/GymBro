import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Workouts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedMuscles = location.state?.selectedMuscles || [];
  const [duration, setDuration] = useState(60); // default 60 mins

  const [exercises, setExercises] = useState([
    { name: "", repsAndWeights: [{ reps: "", weight: "" }] }
  ]);

  const {user} = useUser();
  const userId = user?.id; 

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleRepsWeightChange = (exIndex, rwIndex, field, value) => {
    const updated = [...exercises];
    updated[exIndex].repsAndWeights[rwIndex][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: "", repsAndWeights: [{ reps: "", weight: "" }] }]);
  };

  const addSet = (exIndex) => {
    const updated = [...exercises];
    updated[exIndex].repsAndWeights.push({ reps: "", weight: "" });
    setExercises(updated);
  };

  const logWorkout = async () => {
    const filteredExercises = exercises.map(ex => ({
      name: ex.name,
      repsAndWeights: ex.repsAndWeights.map(rw => ({
        reps: parseInt(rw.reps),
        weight: parseFloat(rw.weight)
      }))
    }));

    const workoutData = {
      userId,
      muscleGroup: selectedMuscles.join(", "),
      exercises: filteredExercises,
      duration
    };
    
    try {
      const response = await axios.post("https://gym-bro-backend.vercel.app/api/workouts", workoutData);
      console.log("Workout Logged:", response.data);
      alert("Workout logged successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to log workout.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="pt-16 pb-24 px-4 sm:px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Log Workout</h1>
        <p className="text-gray-400 mb-6">Muscle Group: <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500 font-semibold">{selectedMuscles.join(", ")}</span></p>
  
        {exercises.map((exercise, i) => (
          <div key={i} className="mb-6 bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
            <input
              type="text"
              placeholder="Exercise name"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(i, "name", e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            
            {exercise.repsAndWeights.map((rw, j) => (
              <div key={j} className="flex gap-3 mb-3">
                <input
                  type="number"
                  placeholder="Reps"
                  value={rw.reps}
                  onChange={(e) => handleRepsWeightChange(i, j, "reps", e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-1/2"
                />
                <input
                  type="number"
                  placeholder="Weight"
                  value={rw.weight}
                  onChange={(e) => handleRepsWeightChange(i, j, "weight", e.target.value)}
                  className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-1/2"
                />
              </div>
            ))}
            
            <button 
              onClick={() => addSet(i)} 
              className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center mt-2"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Set
            </button>
          </div>
        ))}
  
        <button 
          onClick={addExercise} 
          className="mb-8 px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-medium transition-all duration-300 flex items-center w-full sm:w-auto justify-center"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Exercise
        </button>
        <div className="mb-6">
  <label className="block text-sm text-gray-400 mb-1">Duration (minutes)</label>
  <input
    type="number"
    value={duration}
    onChange={(e) => setDuration(parseInt(e.target.value))}
    className="w-full sm:w-40 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    min={1}
  />
</div>

        <button 
          onClick={logWorkout} 
          className="px-6 py-3 rounded-lg font-semibold w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300"
        >
          Submit Workout
        </button>
      </div>
    </div>
    </>
  );
};

export default Workouts;