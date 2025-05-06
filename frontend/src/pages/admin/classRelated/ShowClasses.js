"use client"

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { motion, AnimatePresence } from 'framer-motion';

// Custom components to replace MUI
const CustomTooltip = ({ children, title }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div className="relative" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10">
          {title}
        </div>
      )}
    </div>
  );
};

const CustomPopup = ({ message, showPopup, setShowPopup }) => {
  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPopup(false)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-center text-gray-700">{message}</p>
            <button 
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FloatingActionButton = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute bottom-16 right-0 flex flex-col gap-3 items-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.name}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                onClick={action.action}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">{action.name}</span>
                <span className="text-indigo-600">{action.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${isOpen ? 'bg-red-500 rotate-45' : 'bg-indigo-600'} transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  );
};

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const deleteHandler = (deleteID, address) => {
    setMessage(`Class with ID ${deleteID} has been deleted.`);
    setShowPopup(true);
    // Placeholder for actual delete logic
    console.log(`Deleting class with ID: ${deleteID} from ${address}`);
  };

  const actions = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ), 
      name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ), 
      name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  // Generate a random pastel color for each card
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage Classes
          </motion.h1>
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {getresponse ? (
              <motion.button
                className="block ml-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => navigate("/Admin/addclass")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Class
              </motion.button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <AnimatePresence>
                  {Array.isArray(sclassesList) && sclassesList.length > 0 && sclassesList.map((sclass, index) => {
                    const bgColor = getRandomPastelColor();
                    
                    return (
                      <motion.div
                        key={sclass._id}
                        className="relative overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: index * 0.1, duration: 0.5 }
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5 }}
                      >
                        <div 
                          className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                          style={{ background: `linear-gradient(135deg, ${bgColor}, white)` }}
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 -mb-12 -ml-12 rounded-full bg-white/20 backdrop-blur-sm"></div>
                          
                          <div className="p-6 relative z-10">
                            <h3 className="text-xl font-bold mb-2 text-gray-800">{sclass.sclassName}</h3>
                            <p className="text-sm text-gray-600 mb-6">
                              Class ID: <span className="font-mono">{sclass._id}</span>
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mt-4">
                              <motion.button
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                onClick={() => navigate(`/Admin/classes/class/${sclass._id}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                View
                              </motion.button>
                              
                              <motion.button
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                onClick={() => navigate(`/Admin/class/addstudents/${sclass._id}`)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Add Students
                              </motion.button>
                              
                              <CustomTooltip title="Delete Class">
                                <motion.button
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                  onClick={() => deleteHandler(sclass._id, "Sclass")}
                                  whileHover={{ scale: 1.1, rotate: 15 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </motion.button>
                              </CustomTooltip>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </motion.div>

      <FloatingActionButton actions={actions} />
      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ShowClasses;
