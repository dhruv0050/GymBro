import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

const About = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    sex: "male",
  });

  const [isEditing, setIsEditing] = useState(false);

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
      alert("Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Failed to save profile.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            type="number"
            className="w-full border p-2"
          />
          <input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            type="number"
            className="w-full border p-2"
          />
          <input
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Height (cm)"
            type="number"
            className="w-full border p-2"
          />
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Save
          </button>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Age:</strong> {formData.age || "Not set"}</p>
          <p><strong>Weight:</strong> {formData.weight || "Not set"} kg</p>
          <p><strong>Height:</strong> {formData.height || "Not set"} cm</p>
          <p><strong>Sex:</strong> {formData.sex || "Not set"}</p>

          <button onClick={() => setIsEditing(true)} className="mt-3 bg-blue-500 text-white px-4 py-2">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default About;
