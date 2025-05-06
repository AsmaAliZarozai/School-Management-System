"use client"

import { useEffect } from "react"
import { getTeacherDetails } from "../../../redux/teacherRelated/teacherHandle"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"

const TeacherDetails = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { loading, teacherDetails, error } = useSelector((state) => state.teacher)

  const teacherID = params.id

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID))
  }, [dispatch, teacherID])

  const isSubjectNamePresent = teacherDetails?.teachSubject?.subName

  const handleAddSubject = () => {
    navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.div
        className="max-w-3xl mx-auto"
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
            Teacher Details
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
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <p className="text-red-500 text-lg">An error occurred. Please try again later.</p>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold text-gray-700 w-40">Teacher Name:</h3>
                  <p className="text-gray-600">{teacherDetails?.name}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold text-gray-700 w-40">Class Name:</h3>
                  <p className="text-gray-600">{teacherDetails?.teachSclass?.sclassName}</p>
                </div>

                {isSubjectNamePresent ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <h3 className="text-lg font-semibold text-gray-700 w-40">Subject Name:</h3>
                      <p className="text-gray-600">{teacherDetails?.teachSubject?.subName}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <h3 className="text-lg font-semibold text-gray-700 w-40">Subject Sessions:</h3>
                      <p className="text-gray-600">{teacherDetails?.teachSubject?.sessions}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center mt-6">
                    <motion.button
                      className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                      onClick={handleAddSubject}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Subject
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default TeacherDetails
