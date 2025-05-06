"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getTeacherFreeClassSubjects } from "../../../redux/sclassRelated/sclassHandle"
import { updateTeachSubject } from "../../../redux/teacherRelated/teacherHandle"
import { motion, AnimatePresence } from "framer-motion"

const ChooseSubject = ({ situation }) => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [classID, setClassID] = useState("")
  const [teacherID, setTeacherID] = useState("")
  const [loader, setLoader] = useState(false)

  const { subjectsList, loading, error, response } = useSelector((state) => state.sclass)

  useEffect(() => {
    if (situation === "Norm") {
      setClassID(params.id)
      const classID = params.id
      dispatch(getTeacherFreeClassSubjects(classID))
    } else if (situation === "Teacher") {
      const { classID, teacherID } = params
      setClassID(classID)
      setTeacherID(teacherID)
      dispatch(getTeacherFreeClassSubjects(classID))
    }
  }, [situation, params, dispatch])

  const updateSubjectHandler = (teacherId, teachSubject) => {
    setLoader(true)
    dispatch(updateTeachSubject(teacherId, teachSubject))
    navigate("/Admin/teachers")
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
            Choose a Subject
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
        ) : response ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Sorry, all subjects have teachers assigned already
            </h2>
            <motion.button
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              onClick={() => navigate("/Admin/addsubject/" + classID)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Subjects
            </motion.button>
          </motion.div>
        ) : error ? (
          <div className="text-center text-red-500">An error occurred. Please try again.</div>
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
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subject Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Subject Code
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
                    {Array.isArray(subjectsList) &&
                      subjectsList.length > 0 &&
                      subjectsList.map((subject, index) => (
                        <motion.tr
                          key={subject._id}
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subject.subName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{subject.subCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {situation === "Norm" ? (
                              <motion.button
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                onClick={() => navigate("/Admin/teachers/addteacher/" + subject._id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Choose
                              </motion.button>
                            ) : (
                              <motion.button
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                disabled={loader}
                                onClick={() => updateSubjectHandler(teacherID, subject._id)}
                                whileHover={{ scale: loader ? 1 : 1.05 }}
                                whileTap={{ scale: loader ? 1 : 0.95 }}
                              >
                                {loader ? (
                                  <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    <span>Processing...</span>
                                  </div>
                                ) : (
                                  "Choose Subject"
                                )}
                              </motion.button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default ChooseSubject
