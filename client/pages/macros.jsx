import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Macros = () => {
  const { user, isLoaded } = useUser(); // Ensure user data is loaded
  const userId = isLoaded ? user?.id : null;

  const [profile, setProfile] = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(res.data);
        fetchMacrosForUser(res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load your profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const fetchMacrosForUser = async (profile) => {
    try {
      const response = await axios.post("http://localhost:5000/api/gemini/test-macros", {
        userProfile: {
          age: profile.age,
          sex: profile.sex,
          weight: profile.weight,
          height: profile.height,
          activityLevel: profile.activityLevel,
          goal: profile.goal,
          diet: profile.diet
        }
      });
      setMacroData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching macro data:", err);
      setError("Failed to load your macros. Please try again later.");
      setLoading(false);
    }
  };

  const extractNumber = (str) => {
    if (!str) return 0;
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const calculatePercentage = (current, target) => {
    if (!current || !target) return 0;
    return (current / target) * 100;
  };

  const MacroCircle = ({ title, value, target, color }) => {
    const percentage = Math.min(calculatePercentage(value, target), 100);
    const strokeDasharray = 283;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    const colorMap = {
      "text-emerald-400": "#34d399",
      "text-purple-500": "#a855f7",
      "text-amber-400": "#fbbf24",
    };
    const strokeColor = colorMap[color] || "#fff";

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
              stroke={strokeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-gray-400 text-sm">{target ? `/${target}g` : ''}</span>
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

  const calories = macroData?.calories || "0 cal";
  const carbs = extractNumber(macroData?.carbohydrates);
  const protein = extractNumber(macroData?.protein);
  const fats = extractNumber(macroData?.fats);

  const considerations = [
    { key: "Food Quality", value: macroData?.["*   **food quality"] || "" },
    { key: "Hydration", value: macroData?.["*   **hydration"] || "" },
    { key: "Sleep", value: macroData?.["*   **sleep"] || "" },
    { key: "Progress Tracking", value: macroData?.["*   **progress tracking"] || "" },
    { key: "Individual Variation", value: macroData?.["*   **individual variation"] || "" }
  ].filter(item => item.value);

  const macroKeys = ["calories", "carbohydrates", "protein", "fats"];
  const extraInfo = Object.entries(macroData || {})
    .filter(([key]) => !macroKeys.includes(key))
    .map(([key, value]) => ({
      key: key.replace(/\*|\_/g, '').replace(/\s+/g, ' ').trim(),
      value: value.replace(/\*|\_/g, '').trim()
    }));

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
                  {calories.split(' ')[0]}
                </div>
                <div className="text-gray-400 mt-2">calories per day</div>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">Macros</h2>
            <div className="flex flex-wrap justify-around gap-8">
              <MacroCircle title="Net Carbs" value={carbs} target={carbs} color="text-emerald-400" />
              <MacroCircle title="Fat" value={fats} target={fats} color="text-purple-500" />
              <MacroCircle title="Protein" value={protein} target={protein} color="text-amber-400" />
            </div>
          </div>

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