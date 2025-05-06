"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { getClassDetails, getClassStudents, getSubjectList } from "../../../redux/sclassRelated/sclassHandle"
import { deleteUser } from "../../../redux/userRelated/userHandle"
import { resetSubjects } from "../../../redux/sclassRelated/sclassSlice"
import SpeedDialTemplate from "../../../components/SpeedDialTemplate"
import Popup from "../../../components/Popup"

const ClassDetails = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { subjectsList, sclassStudents, sclassDetails, loading, error, response, getresponse } = useSelector(
    (state) => state.sclass
  )

  const classID = params.id

  useEffect(() => {
    dispatch(getClassDetails(classID, "Sclass"))
    dispatch(getSubjectList(classID, "ClassSubjects"))
    dispatch(getClassStudents(classID))
  }, [dispatch, classID])

  if (error) {
    console.log(error)
  }

  const [activeTab, setActiveTab] = useState("details")
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState({ id: "", type: "" })

  const deleteHandler = (deleteID, address) => {
    setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true)
    // Actual delete logic would go here
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getClassStudents(classID));
    //     dispatch(resetSubjects())
    //     dispatch(getSubjectList(classID, "ClassSubjects"))
    //   })
  }

  const confirmDelete = (id, type) => {
    setDeleteInfo({ id, type })
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    deleteHandler(deleteInfo.id, deleteInfo.type)
    setShowDeleteConfirm(false)
  }

  const subjectActions = [
    {
      icon: (
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
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      name: "Add New Subject",
      action: () => navigate("/Admin/addsubject/" + classID),
    },
    {
      icon: (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      name: "Delete All Subjects",
      action: () => deleteHandler(classID, "SubjectsClass"),
    },
  ]

  const studentActions = [
    {
      icon: (
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
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      ),
      name: "Add New Student",
      action: () => navigate("/Admin/class/addstudents/" + classID),
    },
    {
      icon: (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      name: "Delete All Students",
      action: () => deleteHandler(classID, "StudentsClass"),
    },
  ]

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  }

  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "details"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600"
                  }`}
                >
                  Details
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("subjects")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "subjects"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600"
                  }`}
                >
                  Subjects
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab("students")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "students"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600"
                  }`}
                >
                  Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("teachers")}
                  className={`inline-block rounded-t-lg border-b-2 p-4 ${
                    activeTab === "teachers"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600"
                  }`}
                >
                  Teachers
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                key="details"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Class Details</h2>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Class {sclassDetails && sclassDetails.sclassName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Number of Subjects</p>
                      <p className="text-2xl font-bold text-purple-600">{subjectsList.length}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">Number of Students</p>
                      <p className="text-2xl font-bold text-purple-600">{sclassStudents.length}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getresponse && (
                      <button
                        onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                        className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
                      >
                        Add Students
                      </button>
                    )}
                    {response && (
                      <button
                        onClick={() => navigate("/Admin/addsubject/" + classID)}
                        className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
                      >
                        Add Subjects
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "subjects" && (
              <motion.div
                key="subjects"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {response ? (
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate("/Admin/addsubject/" + classID)}
                      className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
                    >
                      Add Subjects
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Subjects List</h2>
                    {subjectsList && subjectsList.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Subject Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Subject Code
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {subjectsList.map((subject) => (
                              <tr key={subject._id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{subject.subName}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm text-gray-500">{subject.subCode}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                  <button
                                    onClick={() => confirmDelete(subject._id, "Subject")}
                                    className="mr-2 text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => navigate(`/Admin/class/subject/${classID}/${subject._id}`)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-4">
                        <p className="text-lg font-medium text-gray-600">No subjects found</p>
                        <button
                          onClick={() => navigate("/Admin/addsubject/" + classID)}
                          className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white shadow-md transition-all hover:bg-purple-700"
                        >
                          Add Subject
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <SpeedDialTemplate actions={subjectActions} />
              </motion.div>
            )}

            {activeTab === "students" && (
              <motion.div
                key="students"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {getresponse ? (
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                      className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
                    >
                      Add Students
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Students List</h2>
                    {sclassStudents && sclassStudents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Roll Number
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {sclassStudents.map((student) => (
                              <tr key={student._id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  <div className="text-sm text-gray-500">{student.rollNum}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                  <button
                                    onClick={() => confirmDelete(student._id, "Student")}
                                    className="mr-2 text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => navigate("/Admin/students/student/" + student._id)}
                                    className="mr-2 text-blue-600 hover:text-blue-900"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => navigate("/Admin/students/student/attendance/" + student._id)}
                                    className="text-purple-600 hover:text-purple-900"
                                  >
                                    Attendance
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-gray-50 p-4">
                        <p className="text-lg font-medium text-gray-600">No students found</p>
                        <button
                          onClick={() => navigate("/Admin/class/addstudents/" + classID)}
                          className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white shadow-md transition-all hover:bg-purple-700"
                        >
                          Add Students
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <SpeedDialTemplate actions={studentActions} />
              </motion.div>
            )}

            {activeTab === "teachers" && (
              <motion.div
                key="teachers"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-lg bg-white p-6 shadow-md"
              >
                <h2 className="mb-4 text-xl font-bold text-gray-900">Teachers</h2>
                <p className="text-gray-600">Teacher management coming soon...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this {deleteInfo.type.toLowerCase()}? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  )
}

export default ClassDetails
