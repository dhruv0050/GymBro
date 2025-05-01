import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* SignUp Section with Gradient */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-purple-900/50 z-0"></div>
        
        {/* SignUp Form */}
        <div className="relative z-10">
          <SignUp 
          signInUrl="/signin"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700',
                footerActionLink: 'text-indigo-600 hover:text-indigo-700'
              }
            }}
          />
        </div>

      </div>
    </div>
  );
}
