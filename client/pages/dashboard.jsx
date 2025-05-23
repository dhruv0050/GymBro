import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X, ChevronRight, Heart, Activity, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import back from '../src/assets/back.png';
import leg from '../src/assets/leg.png';
import tricep from '../src/assets/tricep.png';
import chest from '../src/assets/chest.png';
import abs from '../src/assets/abs.png';
import full from '../src/assets/full.png';
import shoulder from '../src/assets/shoulder.png';
import bicep from '../src/assets/bicep.png';
import cardio from '../src/assets/cardio.png';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded || !user) {
    return null;
  }
  // Muscle groups data with descriptions
  const muscleGroups = [
    { 
      id: 'chest', 
      name: 'Chest',
      Image: chest,  
      description: 'Build a stronger, more defined chest',
      color: 'from-emerald-600 to-emerald-800' 
    },
    { 
      id: 'back', 
      name: 'Back',
      Image: back, 
      description: 'Strengthen your back muscles',
      color: 'from-emerald-600 to-emerald-800' 
    },
    { 
      id: 'shoulders', 
      name: 'Shoulders', 
      Image: shoulder,
      description: 'Develop broader shoulders',
      color: 'from-emerald-500 to-emerald-700' 
    },
    { 
      id: 'biceps', 
      name: 'Biceps',
      Image: bicep,  
      description: 'Sculpt your biceps',
      color: 'from-purple-600 to-purple-800' 
    },
    { 
      id: 'triceps', 
      name: 'Triceps',
      Image: tricep,  
      description: 'Define your triceps',
      color: 'from-purple-600 to-purple-800' 
    },
    { 
      id: 'legs', 
      name: 'Legs',
      Image: leg,  
      description: 'Don\'t skip leg day!',
      color: 'from-purple-500 to-purple-700' 
    },
    { 
      id: 'abs', 
      name: 'Abs', 
      Image: abs,
      description: 'Core strength is key',
      color: 'from-emerald-500 to-purple-700' 
    },
    { 
      id: 'cardio', 
      name: 'Cardio', 
      Image: cardio,
      description: 'Improve your cardiovascular health',
      color: 'from-emerald-600 to-purple-800' 
    },
    { 
      id: 'fullbody', 
      name: 'Full Body', 
      Image: full,
      description: 'Complete workout for all muscle groups',
      color: 'from-emerald-500 to-purple-700' 
    }
  ];

  // State for selected muscle groups
  const [selectedMuscles, setSelectedMuscles] = useState([]);

  // Toggle muscle group selection
  const toggleMuscle = (id) => {
    if (selectedMuscles.includes(id)) {
      setSelectedMuscles(selectedMuscles.filter(muscle => muscle !== id));
    } else {
      setSelectedMuscles([...selectedMuscles, id]);
    }
  };

  const navigate = useNavigate();

  const handleLogWorkoutClick = () => {
    navigate("/workouts", { state: { selectedMuscles } });
  };
 
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar/>
      
      <div className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mt-8 mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">{user.firstName}</span></h1>
          <p className="text-gray-400">Let's crush your fitness goals today!</p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-emerald-500/20 p-3 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Current Streak</p>
                {/* <p className="text-2xl font-bold">{user.streak} days</p> */}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                <Dumbbell className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Workout</p>
                {/* <p className="text-xl font-bold">{user.lastWorkout}</p> */}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-emerald-500/20 p-3 rounded-lg mr-4">
                <Heart className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <p className="text-gray-400 text-sm">Monthly Goal</p>
                  {/* <p className="text-gray-400 text-sm">{user.progress}%</p> */}
                </div>
                <div className="h-2 bg-gray-800 rounded-full mt-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-emerald-500 to-purple-500 rounded-full" 
                    // style={{ width: `${user.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Muscle Group Selection */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">What are you training today?</h2>
          <p className="text-gray-400 mb-6">Select one or more muscle groups you want to focus on</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {muscleGroups.map((muscle) => (
              <div 
                key={muscle.id}
                onClick={() => toggleMuscle(muscle.id)}
                className={`bg-gray-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedMuscles.includes(muscle.id) 
                    ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20' 
                    : 'border border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold text-white">{muscle.name}</h3>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedMuscles.includes(muscle.id) 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-gray-600'
                    }`}>
                      {selectedMuscles.includes(muscle.id) && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{muscle.description}</p>
                  <div className="rounded-lg overflow-hidden h-40 bg-gray-800">
                    <img 
                      src={muscle.Image}
                      alt={`${muscle.name} exercise`}
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                </div>
                <div className={`h-1 w-full bg-gradient-to-r ${muscle.color}`}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Log Workout Button */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogWorkoutClick}
            disabled={selectedMuscles.length === 0}
            className={`flex items-center px-6 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
              selectedMuscles.length > 0 
                ? 'bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Log Workout
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
        
        {/* Selected Muscle Groups Display */}
        {selectedMuscles.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Selected: {selectedMuscles.map(id => muscleGroups.find(m => m.id === id).name).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;