import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../redux/userRelated/userHandle"
import bgpic from "../../assets/designlogin.jpg"
import { motion } from "framer-motion"

const AdminRegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status, currentUser, response, error, currentRole } = useSelector((state) => state.user)

  const [toggle, setToggle] = useState(false)
  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [message, setMessage] = useState("")

  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [adminNameError, setAdminNameError] = useState(false)
  const [schoolNameError, setSchoolNameError] = useState(false)
  const role = "Admin"

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = event.target.adminName.value
    const schoolName = event.target.schoolName.value
    const email = event.target.email.value
    const password = event.target.password.value

    if (!name || !schoolName || !email || !password) {
      if (!name) setAdminNameError(true)
      if (!schoolName) setSchoolNameError(true)
      if (!email) setEmailError(true)
      if (!password) setPasswordError(true)
      return
    }

    const fields = { name, email, password, role, schoolName }
    setLoader(true)
    dispatch(registerUser(fields, role))
  }

  const handleInputChange = (event) => {
    const { name } = event.target
    if (name === "email") setEmailError(false)
    if (name === "password") setPasswordError(false)
    if (name === "adminName") setAdminNameError(false)
    if (name === "schoolName") setSchoolNameError(false)
  }

  useEffect(() => {
    if (status === "success" || (currentUser !== null && currentRole === "Admin")) {
      navigate("/Admin/dashboard")
    } else if (status === "failed") {
      setMessage(response)
      setShowPopup(true)
      setLoader(false)
    } else if (status === "error") {
      console.log(error)
    }
  }, [status, currentUser, currentRole, navigate, error, response])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-5/12 flex items-center justify-center bg-white p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Register</h1>
            <p className="text-gray-600 px-4">
              Create your own school by registering as an admin.
              <br />
              You will be able to add students and faculty and manage the system.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                name="adminName"
                id="adminName"
                autoComplete="name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  adminNameError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your name"
                onChange={handleInputChange}
              />
              {adminNameError && <p className="mt-1 text-sm text-red-500">Name is required</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                type="text"
                name="schoolName"
                id="schoolName"
                autoComplete="off"
                className={`w-full px-4 py-3 rounded-lg border ${
                  schoolNameError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder="Create your school name"
                onChange={handleInputChange}
              />
              {schoolNameError && <p className="mt-1 text-sm text-red-500">School name is required</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your email"
                onChange={handleInputChange}
              />
              {emailError && <p className="mt-1 text-sm text-red-500">Email is required</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={toggle ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-10`}
                  placeholder="Create a strong password"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setToggle(!toggle)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {toggle ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-sm text-red-500">Password is required</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center mt-2"
            >
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-2"
            >
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 relative overflow-hidden group"
              >
                <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
                {loader ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Register"
                )}
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/Adminlogin"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden md:block md:w-7/12 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgpic})` }}
      >
        <div className="h-full w-full bg-black bg-opacity-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white text-center p-12 max-w-lg"
          >
            <h2 className="text-4xl font-bold mb-4">Create Your School</h2>
            <p className="text-xl">
              Register as an admin to set up your school management system and start adding students and faculty.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Popup for messages */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-sm mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notification</h3>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminRegisterPage
