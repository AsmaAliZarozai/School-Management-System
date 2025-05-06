import React, { useState, useEffect } from "react";
import { ChevronRight, Users, BookOpen, Award } from "lucide-react";

const useAnimatedValue = (initialValue, targetValue, duration = 2000) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * targetValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);

  return value;
};

const Link = ({ to, children, className }) => (
  <a
    href={to}
    className={className}
    onClick={(e) => {
      e.preventDefault();
      window.location = to;
    }}
  >
    {children}
  </a>
);

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Stats counters
  const studentCount = useAnimatedValue(0, 5000);
  const courseCount = useAnimatedValue(0, 120);
  const successRate = useAnimatedValue(0, 98);

  useEffect(() => {
    setIsVisible(true);

    // Add keyframe animation via style element
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes pulse-x {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(5px);
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div
        className="max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
          <div
            className="relative z-10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateY(${isVisible ? 0 : "30px"})`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.3s",
            }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Digital Student Care Portal
            </h1>

            <p className="text-lg text-purple-100 mb-8">
              Your complete solution for modern education management
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Users className="h-8 w-8 mb-2 text-purple-200" />
                <div className="text-3xl font-bold">{studentCount}+</div>
                <div className="text-sm text-purple-200">Students</div>
              </div>

              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <BookOpen className="h-8 w-8 mb-2 text-purple-200" />
                <div className="text-3xl font-bold">{courseCount}+</div>
                <div className="text-sm text-purple-200">Courses</div>
              </div>

              <div className="bg-white bg-opacity-10 p-4 rounded-lg backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <Award className="h-8 w-8 mb-2 text-purple-200" />
                <div className="text-3xl font-bold">{successRate}%</div>
                <div className="text-sm text-purple-200">Success rate</div>
              </div>
            </div>
          </div>

          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 opacity-20">
            <svg width="400" height="400" viewBox="0 0 200 200">
              <circle cx="150" cy="50" r="50" fill="#fff" />
              <circle cx="50" cy="150" r="30" fill="#fff" />
              <circle cx="180" cy="180" r="20" fill="#fff" />
            </svg>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : "30px"})`,
              transition: "opacity 0.8s ease, transform 0.8s ease",
              transitionDelay: "0.5s",
            }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-600 mb-8">
              Streamline school management, track attendance, assess
              performance, and provide feedback. Access records, view marks, and
              communicate effortlessly.
            </p>

            <div className="space-y-4">
              <Link to="/choose" className="block">
                <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium flex items-center justify-between group hover:scale-102 active:scale-98 transition-transform duration-200">
                  <span>Login to Dashboard</span>
                  <div
                    className="animate-pulse-x"
                    style={{
                      animation: "pulse-x 1.5s infinite alternate",
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </button>
              </Link>

              <Link to="/chooseasguest" className="block">
                <button className="w-full py-3 px-4 rounded-lg border border-purple-300 text-purple-700 font-medium transition-colors duration-300 flex items-center justify-between hover:bg-gray-50">
                  <span>Login as Guest</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/Adminregister"
                  className="text-purple-700 font-medium hover:text-purple-800 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Features section */}
            <div className="mt-12">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Student Management",
                  "Attendance Tracking",
                  "Performance Analytics",
                  "Communication Tools",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-gray-700"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: `translateY(${isVisible ? 0 : "20px"})`,
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                      transitionDelay: `${0.7 + index * 0.1}s`,
                    }}
                  >
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
