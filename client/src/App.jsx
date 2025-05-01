import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/landingPage'
import SignInPage from '../components/SingIn';
import SignUpPage from '../components/SignUp';
import Dashboard from '../pages/dashboard';

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
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}
export default App


