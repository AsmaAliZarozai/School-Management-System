"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle"
import { motion, AnimatePresence } from "framer-motion"

// Custom Popup Component
const CustomPopup = ({ message, setShowPopup, showPopup }) => {
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
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-gray-700">{message}</p>
            <button
              className="mt-4 w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Floating Action Button Component
const FloatingActionButton = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false)

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
                  transition: { delay: index * 0.1 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-medium">{action.name}</span>
                <span className="text-gray-600">{action.icon}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${isOpen ? "bg-red-500 rotate-45" : "bg-gray-700"} transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  )
}

const ShowSubjects = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { subjectsList, loading, error, response } = useSelector((state) => state.sclass)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, "AllSubjects"))
  }, [currentUser._id, dispatch])

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true)
  }

  const actions = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      name: "Add New Subject",
      action: () => navigate("/Admin/subjects/chooseclass"),
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      name: "Delete All Subjects",
      action: () => deleteHandler(currentUser._id, "Subjects"),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <motion.h1
            className="text-3xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Subjects Management
          </motion.h1>
          <motion.div
            className="w-16 h-1 bg-gray-300 mx-auto mt-2"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.2 }}
          />
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <>
            {response ? (
              <motion.div
                className="flex justify-center items-center flex-col gap-6 h-64 bg-white rounded-xl shadow-md p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-lg">No subjects available</p>
                <motion.button
                  className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => navigate("/Admin/subjects/chooseclass")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Subjects
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-700">Subject List</h2>
                  <motion.button
                    className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                    onClick={() => navigate("/Admin/subjects/chooseclass")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Subjects
                  </motion.button>
                </div>

                <motion.div
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {Array.isArray(subjectsList) && subjectsList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subject Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sessions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Class
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subjectsList.map((subject, index) => (
                            <motion.tr
                              key={subject._id}
                              className="hover:bg-gray-50 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {subject.subName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.sessions}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subject.sclassName.sclassName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  <button
                                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                    onClick={() => deleteHandler(subject._id, "Subject")}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                    onClick={() =>
                                      navigate(`/Admin/subjects/subject/${subject.sclassName._id}/${subject._id}`)
                                    }
                                  >
                                    View
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">No subjects found.</div>
                  )}
                </motion.div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <FloatingActionButton actions={actions} />
      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default ShowSubjects
