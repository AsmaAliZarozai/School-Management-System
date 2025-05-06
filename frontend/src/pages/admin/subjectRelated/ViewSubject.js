"use client"

import { useEffect, useState } from "react"
import { getClassStudents, getSubjectDetails } from "../../../redux/sclassRelated/sclassHandle"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"

const ViewSubject = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { subloading, subjectDetails, sclassStudents, getresponse, error } = useSelector((state) => state.sclass)

  const { classID, subjectID } = params

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"))
    dispatch(getClassStudents(classID))
  }, [dispatch, subjectID, classID])

  const [value, setValue] = useState("1")
  const [selectedSection, setSelectedSection] = useState("attendance")

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  const handleSectionChange = (newSection) => {
    setSelectedSection(newSection)
  }

  const SubjectDetailsSection = () => {
    const numberOfStudents = sclassStudents.length

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-2xl font-bold text-gray-800 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Subject Details
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Subject Name:</span> {subjectDetails && subjectDetails.subName}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Subject Code:</span> {subjectDetails && subjectDetails.subCode}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Subject Sessions:</span> {subjectDetails && subjectDetails.sessions}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Class Name:</span>{" "}
                  {subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName.sclassName}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Number of Students:</span> {numberOfStudents}
                </p>
                {subjectDetails && subjectDetails.teacher ? (
                  <p className="text-gray-700">
                    <span className="font-medium">Teacher Name:</span> {subjectDetails.teacher.name}
                  </p>
                ) : (
                  <div className="mt-4">
                    <motion.button
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => navigate("/Admin/teachers/addteacher/" + subjectDetails._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Subject Teacher
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const SubjectStudentsSection = () => {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <motion.h2
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Students List
          </motion.h2>

          {getresponse && (
            <motion.button
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
              onClick={() => navigate("/Admin/class/addstudents/" + classID)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Students
            </motion.button>
          )}
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2  role="group">
            <button
              type="button"
              className={\`px-4 py-2 rounded-l-md ${
                selectedSection === "attendance" ? "bg-gray-700 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleSectionChange("attendance")}
            >
              Attendance
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-r-md ${
                selectedSection === "marks" ? "bg-gray-700 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleSectionChange("marks")}
            >
              Marks
            </button>
          </div>
        </div>

        {!getresponse && (
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Array.isArray(sclassStudents) && sclassStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sclassStudents.map((student, index) => (
                      <motion.tr
                        key={student._id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNum}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <button
                              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                              onClick={() => navigate("/Admin/students/student/" + student._id)}
                            >
                              View
                            </button>
                            {selectedSection === "attendance" ? (
                              <button
                                className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                                onClick={() =>
                                  navigate(`/Admin/subject/student/attendance/${student._id}/${subjectID}`)
                                }
                              >
                                Take Attendance
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
                                onClick={() => navigate(`/Admin/subject/student/marks/${student._id}/${subjectID}`)}
                              >
                                Provide Marks
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No students found.</div>
            )}
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {subloading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
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
              Subject Management
            </motion.h1>
            <motion.div
              className="w-16 h-1 bg-gray-300 mx-auto mt-2"
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.2 }}
            />
          </header>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    value === "1"
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } transition-colors`}
                  onClick={() => handleChange("1")}
                >
                  Details
                </button>
                <button
                  className={`py-4 px-6 font-medium text-sm border-b-2 ${
                    value === "2"
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } transition-colors`}
                  onClick={() => handleChange("2")}
                >
                  Students
                </button>
              </nav>
            </div>
          </div>

          <div className="p-4">
            {value === "1" && <SubjectDetailsSection />}
            {value === "2" && <SubjectStudentsSection />}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ViewSubject
