import React, { useState, useEffect } from 'react';
import { Dumbbell, Activity, Heart, Calendar } from 'lucide-react';

const LandingPage = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Create shining particles effect for the input
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Math.random().toString(36).substring(7),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.5,
        duration: Math.random() * 3 + 1
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, newParticle.duration * 1000);
    }, 200);
    
    return () => clearInterval(interval);
  }, []);

  // Handle cursor movement for subtle hover effects
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const container = e.currentTarget.getBoundingClientRect();
    
    const x = ((clientX - container.left) / container.width) * 100;
    const y = ((clientY - container.top) / container.height) * 100;
    
    setCursorPosition({ x, y });
  };

  // Feature cards data
  const features = [
    {
      icon: <Dumbbell className="mb-4" />,
      title: "Custom Workouts",
      description: "Personalized training programs tailored to your specific fitness goals and experience level."
    },
    {
      icon: <Activity className="mb-4" />,
      title: "Performance Tracking",
      description: "Track your progress with detailed analytics and visualize your improvements over time."
    },
    {
      icon: <Heart className="mb-4" />,
      title: "Health Monitoring",
      description: "Monitor your vital metrics and recovery to optimize your training and prevent injuries."
    },
    {
      icon: <Calendar className="mb-4" />,
      title: "Smart Scheduling",
      description: "AI-powered scheduling to balance your workout routine for maximum gains and recovery."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-purple-900/50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.2),rgba(15,23,42,0))]"></div>
        
        <div className="z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
            Welcome to Gym Bro
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Your personal AI fitness companion to maximize your gains and transform your physique
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-300 shadow-lg shadow-emerald-600/20"
            href='/signup'
            >
              Get Started
            </a>
            <button className="px-8 py-3 bg-transparent border-2 border-emerald-500 text-white rounded-lg hover:bg-emerald-900/30 transition duration-300">
              Learn More
            </button>
          </div>
          
          {/* AI-style input field with shining particles */}
          <div className="mt-12 w-full max-w-lg mx-auto relative">
            <div className="relative">
              <input 
                type="text" 
                placeholder="What muscle are you training today?" 
                className="w-full px-6 py-4 bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                {particles.map(particle => (
                  <div 
                    key={particle.id}
                    className="absolute bg-emerald-400 rounded-full animate-pulse"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      opacity: particle.opacity,
                      animationDuration: `${particle.duration}s`
                    }}
                  />
                ))}
              </div>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section with 4 Cards */}
      <div className="py-24 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-purple-500">
              Why Choose Gym Bro?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Elevate your fitness journey with our cutting-edge AI-powered platform designed for serious gains and optimal performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-900 rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-xl border border-gray-800 hover:border-emerald-500/50 flex flex-col items-center text-center"
              >
                <div className="text-emerald-400 w-12 h-12">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mt-2 mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;