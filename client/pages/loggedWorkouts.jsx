import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const LoggedWorkouts = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [workouts, setWorkouts] = useState([]);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/workouts/user/${userId}`);
        setWorkouts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (userId) fetchWorkouts();
  }, [userId]);

  const deleteWorkout = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (workout) => {
    setEditingWorkout(workout);
  };

  const handleEditChange = (exIndex, setIndex, field, value) => {
    const updated = { ...editingWorkout };
    
    // Handle exercise name edit
    if (field === 'name') {
      updated.exercises[exIndex].name = value;
    } else {
      // Handle reps and weights edit
      updated.exercises[exIndex].repsAndWeights[setIndex][field] = value;
    }
    
    setEditingWorkout(updated);
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/workouts/${editingWorkout._id}`, editingWorkout);
      setWorkouts(workouts.map(w => w._id === editingWorkout._id ? editingWorkout : w));
      setEditingWorkout(null);
    } catch (err) {
      console.error(err);
    }
  };

  // New function to delete an exercise
  const deleteExercise = (exIndex) => {
    const updated = { ...editingWorkout };
    updated.exercises = updated.exercises.filter((_, i) => i !== exIndex);
    setEditingWorkout(updated);
  };

  // New function to delete a set
  const deleteSet = (exIndex, setIndex) => {
    const updated = { ...editingWorkout };
    updated.exercises[exIndex].repsAndWeights = updated.exercises[exIndex].repsAndWeights.filter((_, i) => i !== setIndex);
    setEditingWorkout(updated);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar/>
      <div className="pt-16 pb-24 px-4 sm:px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Your Workouts</h1>
        
        {workouts.length === 0 ? (
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400">You haven't logged any workouts yet.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div key={workout._id} className="mb-8 bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {/* Workout Header */}
              <div className="p-5 border-b border-gray-800 bg-gray-850">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {new Date(workout.date).toLocaleDateString("en-US", { weekday: "long" })}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(workout.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500 font-semibold text-lg">
                      {workout.muscleGroup}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Workout Content */}
              <div className="p-5">
                {editingWorkout?._id === workout._id ? (
                  // Edit Mode
                  <>
                    {editingWorkout.exercises.map((ex, i) => (
                      <div key={i} className="mb-6 bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) => handleEditChange(i, null, 'name', e.target.value)}
                            className="font-semibold text-lg text-white bg-gray-800 border-b border-gray-600 focus:outline-none focus:border-emerald-500 px-1 py-0.5 w-3/4"
                          />
                          <button 
                            onClick={() => deleteExercise(i)}
                            className="p-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 transition-all duration-300"
                            title="Delete exercise"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        
                        {ex.repsAndWeights.map((set, j) => (
                          <div key={j} className="mb-3 p-3 bg-gray-850 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm text-gray-400">Set {j + 1}</p>
                              <button 
                                onClick={() => deleteSet(i, j)}
                                className="p-1 rounded-md bg-red-900/20 hover:bg-red-900/40 text-red-300 hover:text-red-200 transition-all duration-300"
                                title="Delete set"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </button>
                            </div>
                            <div className="flex gap-3">
                              <div className="w-1/2">
                                <label className="block text-sm text-gray-400 mb-1">Reps</label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => handleEditChange(i, j, 'reps', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                              <div className="w-1/2">
                                <label className="block text-sm text-gray-400 mb-1">Weight</label>
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => handleEditChange(i, j, 'weight', e.target.value)}
                                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={saveEdit}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all duration-300"
                      >
                        Save Changes
                      </button>
                      <button 
                        onClick={() => setEditingWorkout(null)}
                        className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    {workout.exercises.map((ex, i) => (
                      <div key={i} className="mb-6 bg-gray-800 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3 text-white">{ex.name}</h3>
                        
                        {ex.repsAndWeights.map((set, j) => (
                          <div key={j} className="mb-2 p-3 bg-gray-850 rounded-lg flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-400">Set {j + 1}</span>
                            <div className="flex gap-4">
                              <div className="flex items-center">
                                <span className="text-xs text-gray-400 mr-1">Reps:</span>
                                <span className="text-white font-medium">{set.reps}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-400 mr-1">Weight:</span>
                                <span className="text-white font-medium">{set.weight}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={() => handleEditClick(workout)}
                        className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-all duration-300 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteWorkout(workout._id)}
                        className="px-4 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 border border-red-900/50 transition-all duration-300 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoggedWorkouts;