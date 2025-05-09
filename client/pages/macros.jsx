import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Macros = () => {
  const { user } = useUser();
  const userId = user?.id;
  
  // Define all necessary state variables
  const [profile, setProfile] = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile first
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(res.data);
        
        // After successfully fetching profile, fetch macros based on this user
        fetchMacrosForUser(userId);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load your profile. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);
  
  // Separate function to fetch macros after profile is loaded
  const fetchMacrosForUser = async (userId) => {
    try {
      // Replace with your actual endpoint that accepts userId
      // For example: `/api/gemini/macros/${userId}`
      // For now, using the test endpoint but in a real app pass the userId
      const response = await axios.get("http://localhost:5000/api/gemini/test-macros", {
        params: { userId } // Pass userId as a query parameter
      });
      
      setMacroData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching macro data:", err);
      setError("Failed to load your macros. Please try again later.");
      setLoading(false);
    }
  };

  // Extract the numerical value from a string (e.g., "315 g" -> 315)
  const extractNumber = (str) => {
    if (!str) return 0;
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Calculate circle percentage
  const calculatePercentage = (current, target) => {
    if (!current || !target) return 0;
    return (current / target) * 100;
  };

  // Function to render the circular progress
  const MacroCircle = ({ title, value, target, color }) => {
    const percentage = Math.min(calculatePercentage(value, target), 100);
    const strokeDasharray = 283; // 2 * PI * r, where r = 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
      <div className="flex flex-col items-center">
        <p className={`text-xl font-medium mb-2 ${color}`}>{title}</p>
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2a2a3a"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color.replace("text-", "stroke-")}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          {/* Text in center of circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-gray-400 text-sm">{target ? `/${target}g` : ''}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 text-gray-100 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-950 text-gray-100 flex justify-center items-center">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg max-w-md">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-600 to-purple-600 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Extract the actual macro values
  const calories = macroData?.calories || "0 cal";
  const carbs = extractNumber(macroData?.carbohydrates);
  const protein = extractNumber(macroData?.protein);
  const fats = extractNumber(macroData?.fats);

  // Extract considerations
  const considerations = [
    { key: "Food Quality", value: macroData?.["*   **food quality"] || "" },
    { key: "Hydration", value: macroData?.["*   **hydration"] || "" },
    { key: "Sleep", value: macroData?.["*   **sleep"] || "" },
    { key: "Progress Tracking", value: macroData?.["*   **progress tracking"] || "" },
    { key: "Individual Variation", value: macroData?.["*   **individual variation"] || "" }
  ].filter(item => item.value);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="pt-16 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Your Recommended Macros</h1>
          <p className="text-gray-400 mb-8">
            Custom macronutrient breakdown for your fitness goals
          </p>

          {/* Card 1: Total Calories */}
          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Daily Caloric Target</h2>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
                  {calories.split(' ')[0]}
                </div>
                <div className="text-gray-400 mt-2">calories per day</div>
              </div>
            </div>
          </div>

          {/* Card 2: Macros Circle */}
          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Macros</h2>
            <div className="flex flex-wrap justify-around gap-8">
              <MacroCircle
                title="Net Carbs"
                value={carbs}
                target={carbs}
                color="text-emerald-400"
              />
              <MacroCircle
                title="Fat"
                value={fats}
                target={fats}
                color="text-purple-500"
              />
              <MacroCircle
                title="Protein"
                value={protein}
                target={protein}
                color="text-amber-400"
              />
            </div>
          </div>

          {/* Card 3: Important Considerations */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Important Considerations</h2>
            <div className="space-y-5">
              {considerations.map((item, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-emerald-400 mb-2">{item.key}</h3>
                  <p className="text-gray-300">{item.value.replace(/\*\*|\*/g, '').trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Macros;