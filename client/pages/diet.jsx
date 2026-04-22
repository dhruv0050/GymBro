import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import Navbar from "../components/Navbar";
import API_BASE_URL from "../utils/api";

const MEAL_META = [
  { key: "breakfast", label: "Breakfast" },
  { key: "snack1", label: "Morning Snack" },
  { key: "lunch", label: "Lunch" },
  { key: "snack2", label: "Afternoon Snack" },
  { key: "dinner", label: "Dinner" },
];

const EMPTY_MACROS = {
  calories: null,
  protein: null,
  carbohydrates: null,
  fats: null,
};

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMacro = (value, suffix = "") => {
  if (value === null || value === undefined) return "-";
  return `${Math.round(value)}${suffix}`;
};

const normalizeFoods = (rawFoods, fallbackText = "") => {
  let foods = [];

  if (Array.isArray(rawFoods)) {
    foods = rawFoods
      .map((food) => {
        if (typeof food === "string") {
          return {
            name: food.trim(),
            quantity: "",
          };
        }

        if (food && typeof food === "object") {
          return {
            name: String(food.name || food.item || "").trim(),
            quantity: String(food.quantity || "").trim(),
          };
        }

        return null;
      })
      .filter((food) => food && food.name);
  }

  if (foods.length === 0 && typeof fallbackText === "string" && fallbackText.trim()) {
    foods = fallbackText
      .split(/[,\n;]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name, quantity: "" }));
  }

  return foods;
};

const normalizeMacroBlock = (raw = {}) => ({
  calories: toNumber(raw.calories),
  protein: toNumber(raw.protein),
  carbohydrates: toNumber(raw.carbohydrates ?? raw.carbs),
  fats: toNumber(raw.fats ?? raw.fat),
});

const normalizeMeal = (rawMeal) => {
  if (typeof rawMeal === "string") {
    return {
      foods: normalizeFoods([], rawMeal),
      macros: { ...EMPTY_MACROS },
    };
  }

  const safeMeal = rawMeal && typeof rawMeal === "object" ? rawMeal : {};

  return {
    foods: normalizeFoods(safeMeal.foods || safeMeal.items, safeMeal.description || ""),
    macros: normalizeMacroBlock(safeMeal.macros || safeMeal.macro),
  };
};

const normalizePlan = (rawPlan, index) => {
  const safePlan = rawPlan && typeof rawPlan === "object" ? rawPlan : {};
  const mealSource = safePlan.meals && typeof safePlan.meals === "object" ? safePlan.meals : safePlan;

  return {
    planNumber: toNumber(safePlan.planNumber) || index + 1,
    breakfast: normalizeMeal(mealSource.breakfast),
    snack1: normalizeMeal(mealSource.snack1),
    lunch: normalizeMeal(mealSource.lunch),
    snack2: normalizeMeal(mealSource.snack2),
    dinner: normalizeMeal(mealSource.dinner),
    dailyTotals: normalizeMacroBlock(safePlan.dailyTotals || safePlan.totalMacros || safePlan.macros),
  };
};

const buildUserProfilePayload = (userId, profile) => ({
  userId,
  age: profile.age,
  sex: profile.sex ? profile.sex.toLowerCase() : "",
  weight: profile.weight,
  height: profile.height,
  activityLevel: profile.activityLevel,
  goal: profile.goal,
  diet: profile.diet,
});

const MacroBadge = ({ label, value, unit }) => (
  <div className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs">
    <p className="text-gray-400">{label}</p>
    <p className="mt-1 font-semibold text-white">{formatMacro(value, unit)}</p>
  </div>
);

const MealCard = ({ title, meal }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 shadow-lg">
    <h3 className="text-lg font-semibold text-emerald-400 mb-4">{title}</h3>

    {meal.foods.length > 0 ? (
      <ul className="space-y-2 text-sm text-gray-200 mb-4">
        {meal.foods.map((food, index) => (
          <li key={`${food.name}-${index}`} className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>
              <span className="font-medium">{food.name}</span>
              {food.quantity ? <span className="text-gray-400"> ({food.quantity})</span> : null}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 mb-4">No food items specified.</p>
    )}

    <div className="grid grid-cols-2 gap-2">
      <MacroBadge label="Calories" value={meal.macros.calories} unit=" kcal" />
      <MacroBadge label="Protein" value={meal.macros.protein} unit=" g" />
      <MacroBadge label="Carbs" value={meal.macros.carbohydrates} unit=" g" />
      <MacroBadge label="Fats" value={meal.macros.fats} unit=" g" />
    </div>
  </div>
);

const Diet = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [macroTargets, setMacroTargets] = useState(null);
  const [infoMsg, setInfoMsg] = useState("");

  const profileSummary = useMemo(() => {
    if (!profile) return [];

    return [
      { label: "Goal", value: profile.goal || "Not specified" },
      { label: "Weight", value: profile.weight ? `${profile.weight} kg` : "Not specified" },
      { label: "Height", value: profile.height ? `${profile.height} cm` : "Not specified" },
      { label: "Age", value: profile.age || "Not specified" },
      { label: "Sex", value: profile.sex || "Not specified" },
      { label: "Activity", value: profile.activityLevel || "Not specified" },
      { label: "Diet", value: profile.diet || "Not specified" },
    ];
  }, [profile]);

  const targetMacros = useMemo(() => ({
    calories: toNumber(macroTargets?.total_calories),
    protein: toNumber(macroTargets?.protein),
    carbohydrates: toNumber(macroTargets?.carbohydrates),
    fats: toNumber(macroTargets?.fats),
    water: toNumber(macroTargets?.water),
  }), [macroTargets]);

  const fetchOrCreateMacros = useCallback(async (uid) => {
    try {
      const macrosRes = await axios.get(`${API_BASE_URL}/api/macros/${uid}`);
      return macrosRes.data;
    } catch (err) {
      if (err.response?.status !== 404) {
        throw err;
      }

      const calculateRes = await axios.post(`${API_BASE_URL}/api/macros/calculate`, {
        userId: uid,
      });

      return calculateRes.data?.data || calculateRes.data;
    }
  }, []);

  const generateDietPlans = useCallback(async (uid, profileData, macrosData) => {
    const payload = {
      userProfile: buildUserProfilePayload(uid, profileData),
      macros: macrosData,
    };

    const response = await axios.post(`${API_BASE_URL}/api/diets/diet`, payload);
    return (response.data?.dietPlans || []).map((plan, index) => normalizePlan(plan, index));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDietPage = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setInfoMsg("");

        const profileRes = await axios.get(`${API_BASE_URL}/api/profile/${userId}`);
        const profileData = profileRes.data;

        if (cancelled) return;
        setProfile(profileData);

        const macrosData = await fetchOrCreateMacros(userId);
        if (cancelled) return;
        setMacroTargets(macrosData);

        let usedExistingPlans = false;

        try {
          const existingRes = await axios.get(`${API_BASE_URL}/api/diets/diet/${userId}`);
          const existingDiet = existingRes.data?.dietPlans;
          const isStale = Boolean(existingRes.data?.stale);

          if (existingDiet?.mealPlans?.length && !isStale) {
            setDietPlans(existingDiet.mealPlans.map((plan, index) => normalizePlan(plan, index)));
            usedExistingPlans = true;
          }

          if (isStale) {
            setInfoMsg("Your About You details changed, so we are generating an updated diet recommendation.");
          }
        } catch (existingErr) {
          if (existingErr.response?.status !== 404) {
            throw existingErr;
          }
        }

        if (!usedExistingPlans) {
          const generatedPlans = await generateDietPlans(userId, profileData, macrosData);
          if (cancelled) return;
          setDietPlans(generatedPlans);
        }
      } catch (err) {
        console.error("Error loading diet page:", err);
        if (!cancelled) {
          setError("Failed to load your diet plans. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDietPage();

    return () => {
      cancelled = true;
    };
  }, [userId, fetchOrCreateMacros, generateDietPlans]);

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

  const showEmptyState = !loading && !error && dietPlans.length === 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-950 text-gray-100">
        <div className="pt-16 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-white mb-4">Your Personalized Diet Plans</h1>
          <p className="text-gray-400 mb-8">
            Structured meal plans with foods and macro breakdown for each meal.
          </p>

          {infoMsg ? (
            <div className="bg-amber-950/50 border border-amber-700 text-amber-300 rounded-xl p-4">
              {infoMsg}
            </div>
          ) : null}

          {profile ? (
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
                About You Snapshot
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profileSummary.map((item) => (
                  <div key={item.label} className="bg-gray-800 p-3 rounded-lg">
                    <span className="text-emerald-400">{item.label}:</span>
                    <span className="ml-2 text-gray-200 capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
              Daily Macro Targets
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MacroBadge label="Calories" value={targetMacros.calories} unit=" kcal" />
              <MacroBadge label="Protein" value={targetMacros.protein} unit=" g" />
              <MacroBadge label="Carbs" value={targetMacros.carbohydrates} unit=" g" />
              <MacroBadge label="Fats" value={targetMacros.fats} unit=" g" />
              <MacroBadge label="Water" value={targetMacros.water} unit=" L" />
            </div>
          </div>

          <div className="space-y-12">
            {dietPlans.map((plan) => (
              <div 
                key={plan.planNumber} 
                className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
                  Diet Plan #{plan.planNumber}
                </h2>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-300 mb-3">Estimated Daily Totals</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MacroBadge label="Calories" value={plan.dailyTotals.calories} unit=" kcal" />
                    <MacroBadge label="Protein" value={plan.dailyTotals.protein} unit=" g" />
                    <MacroBadge label="Carbs" value={plan.dailyTotals.carbohydrates} unit=" g" />
                    <MacroBadge label="Fats" value={plan.dailyTotals.fats} unit=" g" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {MEAL_META.map((meal) => (
                    <MealCard key={meal.key} title={meal.label} meal={plan[meal.key]} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {showEmptyState && (
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