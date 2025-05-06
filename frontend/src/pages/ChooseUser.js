import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Spinner = () => (
  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
);

const MockBackdrop = ({ open, children }) =>
  open ? (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      {children}
    </div>
  ) : null;

const MockPopup = ({ message, showPopup, setShowPopup }) =>
  showPopup ? (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <p>{message}</p>
      <button
        className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md"
        onClick={() => setShowPopup(false)}
      >
        Close
      </button>
    </div>
  ) : null;

const ChooseUser = ({ visitor }) => {
  // States
  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mock redux and router functionality
  const navigate = useNavigate();
  const status = "idle"; // Mock status
  const currentUser = null; // Mock user
  const currentRole = null; // Mock role

  // Handler to navigate based on user selection
  const navigateHandler = (user) => {
    setSelectedCard(user);

    // Simulate loading animation before navigation
    setTimeout(() => {
      if (user === "Admin") {
        if (visitor === "guest") {
          const email = "asmazarozai@gmail.com";
          const password = "zxc";
          const fields = { email, password };
          setLoader(true);
        } else {
          navigate("/Adminlogin");
        }
      } else if (user === "Student") {
        if (visitor === "guest") {
          const rollNum = "1";
          const studentName = "Asma Ali";
          const password = "zxc";
          const fields = { rollNum, studentName, password };
          setLoader(true);
        } else {
          navigate("/Studentlogin");
        }
      } else if (user === "Teacher") {
        if (visitor === "guest") {
          const email = "asmazarozai@gmail.com";
          const password = "zxc";
          const fields = { email, password };
          setLoader(true);
        } else {
          navigate("/Teacherlogin");
        }
      }
    }, 300);
  };

  useEffect(() => {
    setIsVisible(true);

    // Add keyframe animation for cards
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .floating {
        animation: float 6s ease-in-out infinite;
      }
      
      .card-hover:hover {
        animation: pulse 1.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Mock effect for handling login status
  useEffect(() => {
    if (status === "success" || currentUser !== null) {
      if (currentRole === "Admin") {
        navigate("/Admin/dashboard");
      } else if (currentRole === "Student") {
        navigate("/Student/dashboard");
      } else if (currentRole === "Teacher") {
        navigate("/Teacher/dashboard");
      }
    } else if (status === "error") {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  // User role data
  const userRoles = [
    {
      role: "Admin",
      icon: (
        <svg
          className="w-16 h-16 text-indigo-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      description:
        "Access the admin dashboard to manage app data, users, and settings.",
    },
    {
      role: "Student",
      icon: (
        <svg
          className="w-16 h-16 text-indigo-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          ></path>
        </svg>
      ),
      description:
        "Access your courses, assignments, grades, and learning materials.",
    },
    {
      role: "Teacher",
      icon: (
        <svg
          className="w-16 h-16 text-indigo-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      ),
      description:
        "Create courses, manage assignments, and track student progress.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-4 md:p-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full opacity-10 transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div
        className="max-w-6xl w-full"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: `translateY(${isVisible ? 0 : "20px"})`,
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Page title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Role
          </h1>
          <p className="text-purple-200 text-lg max-w-2xl mx-auto">
            Select how you want to access the Digital Student Care Portal
          </p>
        </div>

        {/* Role selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userRoles.map((user, index) => (
            <div
              key={user.role}
              className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg transition-all duration-300 card-hover ${
                index % 3 === 0
                  ? "floating"
                  : index % 3 === 1
                  ? "floating delay-500"
                  : "floating delay-1000"
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : "30px"})`,
                transition: "opacity 0.8s ease, transform 0.8s ease",
                transitionDelay: `${0.2 + index * 0.2}s`,
                borderColor:
                  selectedCard === user.role
                    ? "rgba(167, 139, 250, 0.7)"
                    : "transparent",
                borderWidth: selectedCard === user.role ? "3px" : "0px",
              }}
              onClick={() => navigateHandler(user.role)}
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
              <div className="p-6 text-center">
                <div className="flex justify-center">{user.icon}</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  {user.role}
                </h2>
                <p className="text-purple-200 mb-6">{user.description}</p>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105">
                  {visitor === "guest"
                    ? `Login as Guest ${user.role}`
                    : `Login as ${user.role}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="mt-12 text-center">
          <p className="text-purple-200">
            {visitor === "guest"
              ? "Exploring as a Guest? You can sign up for a full account later."
              : "Don't have an account? Contact your administrator to get started."}
          </p>
        </div>
      </div>

      {/* Loading state */}
      <MockBackdrop open={loader}>
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center">
          <Spinner />
          <p className="text-white mt-3">Please Wait...</p>
        </div>
      </MockBackdrop>

      {/* Notification popup */}
      <MockPopup
        message={message}
        showPopup={showPopup}
        setShowPopup={setShowPopup}
      />
    </div>
  );
};

export default ChooseUser;
