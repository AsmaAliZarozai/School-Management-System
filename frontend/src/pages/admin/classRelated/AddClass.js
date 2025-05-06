"use client"

import { useEffect, useState } from "react"
import { Box, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { addStuff } from "../../../redux/userRelated/userHandle"
import { underControl } from "../../../redux/userRelated/userSlice"
import Popup from "../../../components/Popup"
import Classroom from "../../../assets/classroom.png"

const AddClass = () => {
  const [sclassName, setSclassName] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userState = useSelector((state) => state.user)
  const { status, currentUser, response, error, tempDetails } = userState

  const adminID = currentUser._id
  const address = "Sclass"

  const [loader, setLoader] = useState(false)
  const [message, setMessage] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  const fields = {
    sclassName,
    adminID,
  }

  const submitHandler = (event) => {
    event.preventDefault()
    setLoader(true)
    dispatch(addStuff(fields, address))
  }

  useEffect(() => {
    if (status === "added" && tempDetails) {
      navigate("/Admin/classes/class/" + tempDetails._id)
      dispatch(underControl())
      setLoader(false)
    } else if (status === "failed") {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    } else if (status === "error") {
      setMessage("Network Error")
      setShowPopup(true)
      setLoader(false)
    }
  }, [status, navigate, error, response, dispatch, tempDetails])

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
        >
          <div className="mb-6 flex justify-center">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              src={Classroom}
              alt="classroom"
              className="h-40 w-auto"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6 text-center text-3xl font-bold text-gray-900"
          >
            Create a New Class
          </motion.h2>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={submitHandler}
            className="space-y-6"
          >
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">
                Class Name
              </label>
              <div className="mt-1">
                <input
                  id="className"
                  name="className"
                  type="text"
                  required
                  value={sclassName}
                  onChange={(e) => setSclassName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-4 py-3 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter class name"
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex w-1/2 justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={loader}
                className="flex w-1/2 justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300"
              >
                {loader ? (
                  <svg
                    className="h-5 w-5 animate-spin text-white"
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
                  "Create"
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  )
}

export default AddClass
