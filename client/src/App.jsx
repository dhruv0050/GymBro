import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/landingPage'
import SignInPage from '../components/SingIn';
import SignUpPage from '../components/SignUp';
import Dashboard from '../pages/dashboard';
import Workouts from '../pages/workouts';
import LoggedWorkouts from '../pages/loggedWorkouts';
import About from '../pages/about';
import Macros from '../pages/macros';
import Diet from '../pages/diet';

const router = createBrowserRouter([
  {
    path : "/",
    element : <LandingPage/>,
  },
  {
    path : "/signin",
    element : <SignInPage/>,
  },
  {
    path : "/signup",
    element : <SignUpPage/>,
  },
  {
    path : "/dashboard",
    element : <Dashboard/>,
  },
  {
    path : "/workouts",
    element : <Workouts/>,
  },
  {
    path : "/your-workouts",
    element : <LoggedWorkouts/>,
  },
  {
    path : "/about",
    element : <About/>,
  },
  {
    path : "/macros",
    element : <Macros/>,
  },
  {
    path : "/diet",
    element : <Diet/>,
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}
export default App