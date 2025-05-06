"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getUserDetails } from "../../../redux/userRelated/userHandle"
import { getSubjectList } from "../../../redux/sclassRelated/sclassHandle"
import { updateStudentFields } from "../../../redux/studentRelated/studentHandle"
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

const StudentExamMarks = ({ situation }) => {
  const dispatch = useDispatch()
  const { currentUser, userDetails, loading } = useSelector((state) => state.user)
  const { subjectsList } = useSelector((state) => state.sclass)
  const { response, error, statestatus } = useSelector((state) => state.student)
  const params = useParams()

  const [studentID, setStudentID] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [chosenSubName, setChosenSubName] = useState("")
  const [marksObtained, setMarksObtained] = useState("")

  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (situation === "Student") {
      setStudentID(params.id)
      const stdID = params.id
      dispatch(getUserDetails(stdID, "Student"))
    } else if (situation === "Subject") {
      const { studentID, subjectID } = params
      setStudentID(studentID)
      dispatch(getUserDetails(studentID, "Student"))
      setChosenSubName(subjectID)
    }
  }, [situation, params, dispatch])

  useEffect(() => {
    if (userDetails && userDetails.sclassName && situation === "Student") {
      dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"))
    }
  }, [dispatch, userDetails, situation])

  const changeHandler = (event) => {
    const selectedSubject = subjectsList.find((subject) => subject.subName === event.target.value)
    setSubjectName(selectedSubject.subName)
    setChosenSubName(selectedSubject._id)
  }

  const fields = { subName: chosenSubName, marksObtained }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(updateStudentFields(studentID, fields, "UpdateExamResult"))
  }

  useEffect(() => {
    if (response) {
      setLoader(false)
      setShowPopup(true)
      setMessage(response)
    } else if (error) {
      setLoader(false)
      setShowPopup(true)
      setMessage("error")
    } else if (statestatus === "added") {
      setLoader(false)
      setShowPopup(true)
      setMessage("Done Successfully")
    }
  }, [response, statestatus, error])

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <motion.div
            className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8">
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Record Exam Marks</h2>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Student Name:</span> {userDetails.name}
                  </p>
                  {currentUser.teachSubject && (
                    <p className="text-gray-600">
                      <span className="font-medium">Subject Name:</span> {currentUser.teachSubject?.subName}
                    </p>
                  )}
                </div>
              </motion.div>

              <form onSubmit={submitHandler} className="space-y-5">
                <motion.div
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {situation === "Student" && (
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Subject
                      </label>
                      <select
                        id="subject"
                        value={subjectName}
                        onChange={changeHandler}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        <option value="">Select Subject</option>
                        {subjectsList ? (
                          subjectsList.map((subject, index) => (
                            <option key={index} value={subject.subName}>
                              {subject.subName}
                            </option>
                          ))
                        ) : (
                          <option value="Select Subject">Add Subjects For Marks</option>
                        )}
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter Marks
                    </label>
                    <input
                      id="marks"
                      type="number"
                      value={marksObtained}
                      onChange={(e) => setMarksObtained(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loader}
                  className="w-full py-2.5 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loader ? (
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Submit"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
          <CustomPopup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </div>
      )}
    </>
  )
}

export default StudentExamMarks
