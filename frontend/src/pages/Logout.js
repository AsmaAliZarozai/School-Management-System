"use client"

import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { authLogout } from "../redux/userRelated/userSlice"
import { motion } from "framer-motion"

const Logout = () => {
  const currentUser = useSelector((state) => state.user.currentUser)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(authLogout())
    navigate("/")
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="p-8 text-center">
            <motion.div
              className="mx-auto mb-6 relative"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto shadow-md">
                <span className="text-4xl font-bold text-gray-700">{currentUser.name.charAt(0)}</span>
              </div>
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {currentUser.name}
            </motion.h2>

            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Are you sure you want to log out?
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Log Out
              </motion.button>

              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>

          <motion.div
            className="h-1.5 bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <motion.div
          className="text-center mt-6 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p>School Management System</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Logout
