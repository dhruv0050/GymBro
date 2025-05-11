import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Macros = () => {
  const { user, isLoaded } = useUser();
  const userId = isLoaded ? user?.id : null;

  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMacros = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await axios.post("https://gym-bro-backend.vercel.app/api/macros/calculate", {
          userId
        });
        setMacroData(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load your macros. Please try again later.");
        setLoading(false);
      }
    };
    fetchMacros();
  }, [userId]);

  const MacroCircle = ({ title, value, color, unit }) => {
    return (
      <div className="flex flex-col items-center">
        <p className={`text-xl font-medium mb-2 ${color}`}>{title}</p>
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2a2a3a"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color === "text-emerald-400" ? "#34d399" : color === "text-purple-500" ? "#a855f7" : color === "text-amber-400" ? "#fbbf24" : "#38bdf8"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={283}
              strokeDashoffset={0}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-gray-400 text-sm">{unit}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoaded || loading) {
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

  // Macro values from backend
  const calories = macroData?.total_calories || 0;
  const carbs = macroData?.carbohydrates || 0;
  const protein = macroData?.protein || 0;
  const fats = macroData?.fats || 0;
  const water = macroData?.water || 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="pt-16 pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Your Recommended Macros</h1>
          <p className="text-gray-400 mb-8">
            Custom macronutrient breakdown for your fitness goals
          </p>

          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Daily Caloric Target</h2>
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
                  {calories}
                </div>
                <div className="text-gray-400 mt-2">calories per day</div>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Macros</h2>
            <div className="flex flex-wrap justify-around gap-8">
              <MacroCircle title="Net Carbs" value={carbs} color="text-emerald-400" unit="g" />
              <MacroCircle title="Fat" value={fats} color="text-purple-500" unit="g" />
              <MacroCircle title="Protein" value={protein} color="text-amber-400" unit="g" />
              <MacroCircle title="Water" value={water} color="text-cyan-400" unit="L" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Macros;