"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllComplains } from "../../../redux/complainRelated/complainHandle"
import { motion } from "framer-motion"

const SeeComplains = () => {
  const dispatch = useDispatch()
  const { complainsList, loading, error, response } = useSelector((state) => state.complain)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"))
  }, [currentUser._id, dispatch])

  if (error) {
    console.log(error)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

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
            Complaints Management
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
                className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-lg">No Complaints Right Now</p>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Complaint
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <motion.tbody
                      className="bg-white divide-y divide-gray-200"
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      {Array.isArray(complainsList) &&
                        complainsList.length > 0 &&
                        complainsList.map((complain) => {
                          const date = new Date(complain.date)
                          const dateString =
                            date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date"
                          return (
                            <motion.tr
                              key={complain._id}
                              variants={item}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-medium">
                                      {complain.user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{complain.user.name}</div>
                                    <div className="text-sm text-gray-500">{complain.user.role || "User"}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 max-w-md">{complain.complaint}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {dateString}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <label className="inline-flex items-center">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600 rounded border-gray-300 focus:ring-gray-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Resolved</span>
                                </label>
                              </td>
                            </motion.tr>
                          )
                        })}
                    </motion.tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default SeeComplains
