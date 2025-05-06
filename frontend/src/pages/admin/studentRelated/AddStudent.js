"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../../redux/userRelated/userHandle"
import { underControl } from "../../../redux/userRelated/userSlice"
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle"
import { motion, AnimatePresence } from "framer-motion"

// Custom Popup Component
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

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const { status, currentUser, response } = useSelector((state) => state.user)
  const { sclassesList } = useSelector((state) => state.sclass)

  const [name, setName] = useState("")
  const [rollNum, setRollNum] = useState("")
  const [password, setPassword] = useState("")
  const [className, setClassName] = useState("")
  const [sclassName, setSclassName] = useState("")
  const [section, setSection] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)

  const adminID = currentUser._id
  const role = "Student"
  const attendance = []

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id)
    }
  }, [params.id, situation])

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"))
  }, [adminID, dispatch])

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class")
      setSclassName("")
    } else {
      const selectedClass = sclassesList.find((classItem) => classItem.sclassName === event.target.value)
      setClassName(selectedClass.sclassName)
      setSclassName(selectedClass._id)
    }
  }

  const fields = { name, rollNum, password, section, sclassName, adminID, role, attendance }

  const submitHandler = (event) => {
    event.preventDefault()
    if (sclassName === "") {
      setMessage("Please select a class name")
      setShowPopup(true)
    } else {
      setLoader(true)
      dispatch(registerUser(fields, role))
    }
  }

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl())
      navigate(-1)
    } else if (status === "failed") {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    } else if (status === "error") {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, response, dispatch])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <motion.h2
            className="text-2xl font-bold text-center text-gray-800 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Add Student
          </motion.h2>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {situation === "Student" && (
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  id="class"
                  value={className}
                  onChange={changeHandler}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="Select Class">Select Class</option>
                  {sclassesList.map((classItem, index) => (
                    <option key={index} value={classItem.sclassName}>
                      {classItem.sclassName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="rollNum" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                id="rollNum"
                type="number"
                value={rollNum}
                onChange={(e) => setRollNum(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <input
                id="section"
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loader}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loader ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                "Add Student"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddStudent
