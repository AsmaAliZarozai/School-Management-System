"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const ChooseClass = ({ situation }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass)
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, "Sclass"))
  }, [currentUser._id, dispatch])

  if (error) {
    console.log(error)
  }

  const navigateHandler = (classID) => {
    if (situation === "Teacher") {
      navigate("/Admin/teachers/choosesubject/" + classID)
    } else if (situation === "Subject") {
      navigate("/Admin/addsubject/" + classID)
    }
  }

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
            Choose a Class
          </motion.h1>
          <motion.div
            className="w-20 h-1 bg-gray-400 mx-auto mt-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.5 }}
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
            {getresponse ? (
              <motion.div
                className="flex justify-end mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={() => navigate("/Admin/addclass")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Class
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-xl shadow-md overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Class Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {Array.isArray(sclassesList) &&
                          sclassesList.length > 0 &&
                          sclassesList.map((sclass, index) => (
                            <motion.tr
                              key={sclass._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: index * 0.1, duration: 0.3 },
                              }}
                              exit={{ opacity: 0, y: -20 }}
                              whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {sclass.sclassName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <motion.button
                                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                  onClick={() => navigateHandler(sclass._id)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Choose
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))}
                      </AnimatePresence>
                    </tbody>
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

export default ChooseClass
