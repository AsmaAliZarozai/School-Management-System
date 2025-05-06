"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addStuff } from "../../../redux/userRelated/userHandle"
import { underControl } from "../../../redux/userRelated/userSlice"
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

const SubjectForm = () => {
  const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }])

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const userState = useSelector((state) => state.user)
  const { status, currentUser, response, error } = userState

  const sclassName = params.id
  const adminID = currentUser._id
  const address = "Subject"

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)

  const handleSubjectNameChange = (index) => (event) => {
    const newSubjects = [...subjects]
    newSubjects[index].subName = event.target.value
    setSubjects(newSubjects)
  }

  const handleSubjectCodeChange = (index) => (event) => {
    const newSubjects = [...subjects]
    newSubjects[index].subCode = event.target.value
    setSubjects(newSubjects)
  }

  const handleSessionsChange = (index) => (event) => {
    const newSubjects = [...subjects]
    newSubjects[index].sessions = event.target.value || 0
    setSubjects(newSubjects)
  }

  const handleAddSubject = () => {
    setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }])
  }

  const handleRemoveSubject = (index) => () => {
    const newSubjects = [...subjects]
    newSubjects.splice(index, 1)
    setSubjects(newSubjects)
  }

  const fields = {
    sclassName,
    subjects: subjects.map((subject) => ({
      subName: subject.subName,
      subCode: subject.subCode,
      sessions: subject.sessions,
    })),
    adminID,
  }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(addStuff(fields, address))
  }

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/subjects")
      dispatch(underControl())
      setLoader(false)
    } else if (status === "failed") {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    } else if (status === "error") {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Add Subjects
          </motion.h2>

          <form onSubmit={submitHandler} className="space-y-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-gray-200 pb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="md:col-span-5">
                  <label htmlFor={`subName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name
                  </label>
                  <input
                    id={`subName-${index}`}
                    type="text"
                    value={subject.subName}
                    onChange={handleSubjectNameChange(index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="md:col-span-3">
                  <label htmlFor={`subCode-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Code
                  </label>
                  <input
                    id={`subCode-${index}`}
                    type="text"
                    value={subject.subCode}
                    onChange={handleSubjectCodeChange(index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor={`sessions-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Sessions
                  </label>
                  <input
                    id={`sessions-${index}`}
                    type="number"
                    min="0"
                    value={subject.sessions}
                    onChange={handleSessionsChange(index)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  {index === 0 ? (
                    <motion.button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Subject
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={handleRemoveSubject(index)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end pt-4">
              <motion.button
                type="submit"
                disabled={loader}
                className="px-6 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loader ? (
                  <div className="flex justify-center items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Saving...</span>
                  </div>
                ) : (
                  "Save"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default SubjectForm
