"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { addStuff } from "../../../redux/userRelated/userHandle"
import { underControl } from "../../../redux/userRelated/userSlice"
import Popup from "../../../components/Popup"

const AddNotice = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, response, error } = useSelector((state) => state.user)
  const { currentUser } = useSelector((state) => state.user)

  const [title, setTitle] = useState("")
  const [details, setDetails] = useState("")
  const [date, setDate] = useState("")
  const adminID = currentUser._id

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")

  const fields = { title, details, date, adminID }
  const address = "Notice"

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(addStuff(fields, address))
  }

  useEffect(() => {
    if (status === "added") {
      navigate("/Admin/notices")
      dispatch(underControl())
    } else if (status === "error") {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch])

  return (
    <>
      <div className="flex min-h-full items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Add Notice</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Create a new notice to inform students and teachers
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <div className="-space-y-px rounded-md shadow-sm">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <label htmlFor="title" className="sr-only">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="relative block w-full rounded-t-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-purple-600"
                  placeholder="Notice Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <label htmlFor="details" className="sr-only">
                  Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  className="relative block w-full border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-purple-600"
                  placeholder="Notice Details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label htmlFor="date" className="sr-only">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="relative block w-full rounded-b-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-purple-600"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group relative flex w-1/3 justify-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loader}
                className="group relative flex w-2/3 justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 disabled:bg-purple-400"
              >
                {loader ? (
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Add Notice"
                )}
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  )
}

export default AddNotice
