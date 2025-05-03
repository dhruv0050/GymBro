import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

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
    updated.exercises[exIndex].repsAndWeights[setIndex][field] = value;
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

  return (
    <div>
      <h1>Your Workouts</h1>
      {workouts.map((workout) => (
        <div key={workout._id}>
          <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p><strong>Muscle Group:</strong> {workout.muscleGroup}</p>

          {editingWorkout?._id === workout._id ? (
            <>
              {editingWorkout.exercises.map((ex, i) => (
                <div key={i}>
                  <p><strong>Exercise:</strong> {ex.name}</p>
                  {ex.repsAndWeights.map((set, j) => (
                    <div key={j}>
                      Reps:
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleEditChange(i, j, 'reps', e.target.value)}
                      />
                      Weight:
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleEditChange(i, j, 'weight', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={saveEdit}>Save</button>
              <button onClick={() => setEditingWorkout(null)}>Cancel</button>
            </>
          ) : (
            <>
              {workout.exercises.map((ex, i) => (
                <div key={i}>
                  <p><strong>Exercise:</strong> {ex.name}</p>
                  <ul>
                    {ex.repsAndWeights.map((set, j) => (
                      <li key={j}>Reps: {set.reps}, Weight: {set.weight}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <button onClick={() => handleEditClick(workout)}>Edit</button>
              <button onClick={() => deleteWorkout(workout._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoggedWorkouts;
