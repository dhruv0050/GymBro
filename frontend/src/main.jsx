import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  );
} else {
  console.error("Root element not found");
}