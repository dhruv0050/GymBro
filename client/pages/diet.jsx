import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

const Diet = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // First fetch the user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setProfile(res.data);
        setProfileLoaded(true);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load your profile. Please try again later.");
        setLoading(false);
      }
    };
    
    if (userId) fetchProfile();
  }, [userId]);

  // Then fetch or generate diet plans once profile is loaded
  useEffect(() => {
    const fetchDietPlans = async () => {
      if (!profile) return;
      
      try {
        // First try to get existing diet plans
        const existingPlans = await axios.get(`http://localhost:5000/api/diets/diet/${userId}`);
        if (existingPlans.data.dietPlans) {
          setDietPlans(existingPlans.data.dietPlans.mealPlans);
          setLoading(false);
          return;
        }
      } catch (err) {
        // If no existing plans, generate new ones
        try {
          // Fetch macros from backend
          const macrosRes = await axios.get(`http://localhost:5000/api/macros/${userId}`);
          const macros = macrosRes.data;

          // Prepare user profile in the format expected by the backend
          const userProfile = {
            userId: userId,
            age: profile.age,
            sex: profile.sex ? profile.sex.toLowerCase() : '',
            weight: profile.weight,
            height: profile.height,
            activityLevel: profile.activityLevel,
            goal: profile.goal,
            diet: profile.diet
          };

          // Generate new diet plans
          const response = await axios.post("http://localhost:5000/api/diets/diet", {
            userProfile,
            macros
          });
          
          setDietPlans(response.data.dietPlans);
          setLoading(false);
        } catch (generateErr) {
          console.error("Error generating diet plans:", generateErr);
          setError("Failed to generate your diet plans. Please try again later.");
          setLoading(false);
        }
      }
    };

    if (profileLoaded) {
      fetchDietPlans();
    }
  }, [profileLoaded, profile, userId]);


  // Helper function to render meal items from markdown-style string
  const renderMealItems = (mealText) => {
    if (!mealText) return <p className="text-gray-400 italic">No items specified</p>;
    
    // Split by markdown list items and filter out empty strings
    const items = mealText
      .split('*   ')
      .filter(item => item.trim() !== '')
      .map(item => item.trim().replace(/\*\*/g, ''));
    
    return (
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            <span className="text-emerald-400 mr-2">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Component for individual meal card
  const MealCard = ({ title, content, icon }) => {
    return (
      <div className="bg-gray-800 rounded-lg p-4 shadow-md flex-1 min-w-[250px] max-w-[300px]">
        <div className="flex items-center mb-3">
          {icon}
          <h3 className="text-lg font-medium text-emerald-400 ml-2">{title}</h3>
        </div>
        <div className="text-gray-300 text-sm">
          {renderMealItems(content)}
        </div>
      </div>
    );
  };

  const ProfileSummary = () => {
    if (!profile) return null;
    
    return (
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
          Your Profile
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Goal:</span> 
            <span className="ml-2 capitalize">{profile.goal || 'Not specified'}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Weight:</span> 
            <span className="ml-2">{profile.weight || 'Not specified'} {profile.weightUnit || 'kg'}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Height:</span> 
            <span className="ml-2">{profile.height || 'Not specified'} {profile.heightUnit || 'cm'}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Age:</span> 
            <span className="ml-2">{profile.age || 'Not specified'}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Sex:</span> 
            <span className="ml-2 capitalize">{profile.sex || 'Not specified'}</span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="text-emerald-400">Activity Level:</span> 
            <span className="ml-2 capitalize">{profile.activityLevel || 'Not specified'}</span>
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Your Personalized Diet Plans</h1>
          <p className="text-gray-400 mb-8">
            Custom meal plans tailored to your fitness goals and macro requirements
          </p>

          {/* Display user profile summary */}
          <ProfileSummary />

          {/* Display diet plans */}
          <div className="space-y-12">
            {dietPlans.map((plan) => (
              <div 
                key={plan.planNumber} 
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
                  Diet Plan #{plan.planNumber}
                </h2>
                
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4 min-w-max">
                    {plan.breakfast && (
                      <MealCard 
                        title="Breakfast" 
                        content={plan.breakfast}
                        icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                        </svg>}
                      />
                    )}
                    
                    {plan.snack1 && (
                      <MealCard 
                        title="Morning Snack" 
                        content={plan.snack1}
                        icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>}
                      />
                    )}
                    
                    {plan.lunch && (
                      <MealCard 
                        title="Lunch" 
                        content={plan.lunch}
                        icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>}
                      />
                    )}
                    
                    {plan.snack2 && (
                      <MealCard 
                        title="Afternoon Snack" 
                        content={plan.snack2}
                        icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>}
                      />
                    )}
                    
                    {plan.dinner && (
                      <MealCard 
                        title="Dinner" 
                        content={plan.dinner}
                        icon={<svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {dietPlans.length === 0 && !loading && !error && (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg text-center">
              <p className="text-lg text-gray-300">No diet plans available. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Diet;