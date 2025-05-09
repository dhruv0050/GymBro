import { useUser } from "@clerk/clerk-react";
import { act, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Import Navbar component
import { useNavigate } from "react-router-dom";

const About = () => {
  const { user } = useUser();
  const userId = user?.id;
  const firstName = user?.firstName || "there";

  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    sex: "",
    activityLevel: "",
    goal: "",
  });

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" }); // For success/error messages

  // Clear status message after 5 seconds
  useEffect(() => {
    if (statusMsg.text) {
      const timer = setTimeout(() => {
        setStatusMsg({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setFormData(res.data);
      } catch (err) {
        console.log("No profile yet or error occurred.");
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/profile", {
        userId,
        ...formData,
      });
      setStatusMsg({ text: "Profile saved successfully!", type: "success" });
      setIsEditing(false);
  
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setStatusMsg({ text: "Failed to save profile.", type: "error" });
      console.error(err);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="pt-16 pb-24 px-4 sm:px-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          
          <p className="text-gray-400 mb-4">
            Hi, <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500 font-semibold">{firstName}</span>!
            Let us know more about you!
          </p>

          {/* Status Message */}
          {statusMsg.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              statusMsg.type === "success" 
                ? "bg-emerald-900/50 border border-emerald-700 text-emerald-400" 
                : "bg-red-900/50 border border-red-700 text-red-400"
            }`}>
              <div className="flex items-center">
                {statusMsg.type === "success" ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )}
                <span>{statusMsg.text}</span>
              </div>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                <input
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  type="number"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
                <input
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight (kg)"
                  type="number"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
                <input
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height (cm)"
                  type="number"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Daily Activity Levels</label>
                <select
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Highly Active">Highly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Less Active">Less Active</option>
                </select>
              </div>

              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Fitness Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Gain Muscle">Gain Muscle</option>
                  <option value="Gain Weight">Gain Weight</option>
                  <option value="Loose Weight">Loose Weight</option>
                  <option value="Maintain Weight">Maintain Weight</option>
                </select>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-gray-300 hover:text-white font-medium transition-all duration-300 flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-lg font-semibold flex-1 bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Age</p>
                  <p className="font-semibold text-white">{formData.age || "Not set"}</p>
                </div>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Weight</p>
                  <p className="font-semibold text-white">{formData.weight ? `${formData.weight} kg` : "Not set"}</p>
                </div>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Height</p>
                  <p className="font-semibold text-white">{formData.height ? `${formData.height} cm` : "Not set"}</p>
                </div>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Sex</p>
                  <p className="font-semibold text-white capitalize">{formData.sex || "Not set"}</p>
                </div>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Activity Level</p>
                  <p className="font-semibold text-white capitalize">{formData.activityLevel || "Not set"}</p>
                </div>
              </div>
              <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Fitness Goal</p>
                  <p className="font-semibold text-white capitalize">{formData.goal || "Not set"}</p>
                </div>
              </div>

              <button 
                onClick={() => setIsEditing(true)} 
                className="mt-6 px-6 py-3 rounded-lg font-semibold w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default About;