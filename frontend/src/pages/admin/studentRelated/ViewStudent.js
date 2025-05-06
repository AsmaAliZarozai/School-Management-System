"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUserDetails } from "../../../redux/userRelated/userHandle"
import { useNavigate, useParams } from "react-router-dom"
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle"
import { motion, AnimatePresence } from "framer-motion"
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "../../../components/attendanceCalculator"

// Custom Pie Chart Component
const CustomPieChart = ({ data }) => {
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((entry, index) => {
          const startAngle =
            index === 0 ? 0 : data.slice(0, index).reduce((sum, e) => sum + (e.value / totalValue) * 360, 0)

          const endAngle = startAngle + (entry.value / totalValue) * 360

          // Convert angles to radians and calculate path
          const startRad = (startAngle - 90) * (Math.PI / 180)
          const endRad = (endAngle - 90) * (Math.PI / 180)

          const x1 = 50 + 40 * Math.cos(startRad)
          const y1 = 50 + 40 * Math.sin(startRad)
          const x2 = 50 + 40 * Math.cos(endRad)
          const y2 = 50 + 40 * Math.sin(endRad)

          const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

          const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

          return (
            <path key={index} d={pathData} fill={index === 0 ? "#4ade80" : "#f87171"} stroke="#fff" strokeWidth="0.5" />
          )
        })}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{data[0].value}%</span>
        <span className="text-xs text-gray-500">Attendance</span>
      </div>
      <div className="flex justify-center mt-4 gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: index === 0 ? "#4ade80" : "#f87171" }}
            />
            <span className="text-xs">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

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

const ViewStudent = () => {
  const [value, setValue] = useState("1")
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.user)

  const studentID = params.id

  useEffect(() => {
    dispatch(getUserDetails(studentID, "Student"))
  }, [dispatch, studentID])

  useEffect(() => {
    if (userDetails && userDetails.sclassName && userDetails.sclassName._id !== undefined) {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"))
    }
  }, [dispatch, userDetails])

  const [name, setName] = useState("")
  const [rollNum, setRollNum] = useState("")
  const [sclassName, setSclassName] = useState("")
  const [studentSchool, setStudentSchool] = useState("")
  const [subjectAttendance, setSubjectAttendance] = useState([])

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "")
      setRollNum(userDetails.rollNum || "")
      setSclassName(userDetails.sclassName || "")
      setStudentSchool(userDetails.school || "")
      setSubjectAttendance(userDetails.attendance || [])
    }
  }, [userDetails])

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  const deleteHandler = () => {
    setMessage("Sorry, the delete function has been disabled for now.")
    setShowPopup(true)
  }

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance)
  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: 100 - overallAttendancePercentage },
  ]

  const subjectData = Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
    ([subName, { subCode, present, sessions }]) => ({
      subject: subName,
      attendancePercentage: calculateSubjectAttendancePercentage(present, sessions),
      totalClasses: sessions,
      attendedClasses: present,
    }),
  )

  const renderStudentDetails = () => (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-6">
        <motion.h2
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {name}
        </motion.h2>
        <motion.div
          className="space-y-2 text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>Roll Number: {rollNum}</p>
          <p>Class: {sclassName?.sclassName}</p>
          <p>School: {studentSchool?.schoolName}</p>
        </motion.div>

        {subjectAttendance.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <CustomPieChart data={chartData} />
          </motion.div>
        )}
      </div>
      <div className="border-t border-gray-100 p-4">
        <motion.button
          className="w-full py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
          onClick={deleteHandler}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Delete Student
        </motion.button>
      </div>
    </motion.div>
  )

  const renderAttendanceTable = () => (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Present
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Sessions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance Percentage
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjectData.map((subject, index) => (
              <motion.tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.attendedClasses}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.totalClasses}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${subject.attendancePercentage}%`,
                          backgroundColor: subject.attendancePercentage >= 75 ? "#4ade80" : "#f87171",
                        }}
                      ></div>
                    </div>
                    <span>{subject.attendancePercentage}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        className="max-w-5xl mx-auto"
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
            Student Profile
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
                Attendance
              </button>
            </nav>
          </div>
        </div>

        <div className="p-4">
          {value === "1" && renderStudentDetails()}
          {value === "2" && renderAttendanceTable()}
        </div>
      </motion.div>

      <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  )
}

export default ViewStudent
