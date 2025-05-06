"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllNotices, deleteNotice, deleteAllNotices } from "../../../redux/noticeRelated/noticeHandle"
import SpeedDialTemplate from "../../../components/SpeedDialTemplate"
import Popup from "../../../components/Popup"

const ShowNotices = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { noticesList, loading, error, response } = useSelector((state) => state.notice)
  const { currentUser } = useSelector((state) => state.user)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, "Notice"))
  }, [currentUser._id, dispatch])

  if (error) {
    console.log(error)
  }

  const deleteHandler = (deleteID, address) => {
    dispatch(deleteNotice(deleteID, address)).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice"))
      setMessage("Notice deleted successfully")
      setShowPopup(true)
    })
  }

  const deleteAllHandler = (deleteID, address) => {
    dispatch(deleteAllNotices(deleteID, address)).then(() => {
      dispatch(getAllNotices(currentUser._id, "Notice"))
      setMessage("All notices deleted successfully")
      setShowPopup(true)
    })
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    deleteHandler(deleteId, "Notice")
    setShowDeleteConfirm(false)
  }

  const actions = [
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
      name: "Add New Notice",
      action: () => navigate("/Admin/addnotice"),
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
      name: "Delete All Notices",
      action: () => deleteAllHandler(currentUser._id, "Notices"),
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-600">Manage all school notices</p>
        </motion.div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {response ? (
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/Admin/addnotice")}
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow-md transition-all hover:bg-green-700"
                >
                  Add Notice
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="overflow-hidden rounded-lg bg-white shadow-md"
              >
                {Array.isArray(noticesList) && noticesList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Details
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            Date
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
                        {noticesList.map((notice) => {
                          const date = new Date(notice.date)
                          const dateString =
                            date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date"

                          return (
                            <motion.tr key={notice._id} variants={itemVariants}>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="max-w-xs overflow-hidden text-ellipsis text-sm text-gray-500">
                                  {notice.details}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm text-gray-500">{dateString}</div>
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                <button
                                  onClick={() => confirmDelete(notice._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center p-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mb-4 h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-xl font-medium text-gray-600">No notices found</p>
                    <p className="mt-1 text-gray-500">Create your first notice to get started</p>
                    <button
                      onClick={() => navigate("/Admin/addnotice")}
                      className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white shadow-md transition-all hover:bg-purple-700"
                    >
                      Add Notice
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-500">Are you sure you want to delete this notice? This action cannot be undone.</p>
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

      <SpeedDialTemplate actions={actions} />
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  )
}

export default ShowNotices
