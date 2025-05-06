"use client"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"

const AdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -10 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl"
      >
        {/* Gradient top border */}
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-purple-600 to-blue-500"></div>

        {/* Profile header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative flex flex-col items-center bg-gradient-to-r from-amber-300 to-orange-400 px-6 pb-12 pt-8"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        >
          <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-purple-600 bg-white shadow-lg">
            <span className="text-4xl font-bold text-purple-600">{currentUser?.name?.[0]?.toUpperCase() || "A"}</span>
          </div>

          <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
          <p className="text-white text-opacity-90">School Administrator</p>
        </motion.div>

        {/* Profile details */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ x: 10 }}
              className="flex items-center rounded-xl bg-gray-50 p-4 shadow-sm transition-all duration-300 hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-lg font-semibold text-gray-800">{currentUser.name}</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ x: 10 }}
              className="flex items-center rounded-xl bg-gray-50 p-4 shadow-sm transition-all duration-300 hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-lg font-semibold text-gray-800">{currentUser.email}</p>
              </div>
            </motion.div>

            {/* School */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ x: 10 }}
              className="flex items-center rounded-xl bg-gray-50 p-4 shadow-sm transition-all duration-300 hover:bg-gray-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-500">School</p>
                <p className="text-lg font-semibold text-gray-800">{currentUser.schoolName}</p>
              </div>
            </motion.div>
          </div>

          {/* Additional info or actions could go here */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg">
              Edit Profile
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminProfile
