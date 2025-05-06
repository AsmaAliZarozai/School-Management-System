"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle"
import { registerUser } from "../../../redux/userRelated/userHandle"
import { underControl } from "../../../redux/userRelated/userSlice"
import { motion, AnimatePresence } from "framer-motion"

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

const AddTeacher = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subjectID = params.id

  const { status, response, error } = useSelector((state) => state.user)
  const { subjectDetails } = useSelector((state) => state.sclass)

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"))
  }, [dispatch, subjectID])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)

  const role = "Teacher"
  const school = subjectDetails && subjectDetails.school
  const teachSubject = subjectDetails && subjectDetails._id
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id

  const fields = { name, email, password, role, school, teachSubject, teachSclass }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl())
      navigate("/Admin/teachers")
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-gray-700"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Add Teacher
          </motion.h1>
          <motion.div
            className="w-20 h-1 bg-gray-400 mx-auto mt-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </header>

        <motion.div
          className="bg-white rounded-xl shadow-md overflow-hidden p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Subject: <span className="text-gray-600">{subjectDetails && subjectDetails.subName}</span>
            </h2>
            <h2 className="text-lg font-semibold text-gray-700">
              Class:{" "}
              <span className="text-gray-600">
                {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
              </span>
            </h2>
          </div>

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Teacher's Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Teacher's Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Teacher's Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loader}
              className="w-full py-3 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loader ? (
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2">Registering...</span>
                </div>
              ) : (
                "Register"
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>

      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default AddTeacher
