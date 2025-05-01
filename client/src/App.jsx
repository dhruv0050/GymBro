import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/landingPage'

const router = createBrowserRouter([
  {
    path : "/",
    element : <LandingPage/>,
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}
export default App


