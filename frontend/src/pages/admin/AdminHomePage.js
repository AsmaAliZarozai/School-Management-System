import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getAllSclasses } from "../../redux/sclassRelated/sclassHandle";
import { getAllStudents } from "../../redux/studentRelated/studentHandle";
import { getAllTeachers } from "../../redux/teacherRelated/teacherHandle";
import SeeNotice from "../../components/SeeNotice";
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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
};

const CounterAnimation = ({ end, duration = 2.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-4xl font-bold text-white drop-shadow-lg"
    >
      {end}
    </motion.div>
  );
};

const AdminHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { studentsList } = useSelector((state) => state.student);
  const { sclassesList } = useSelector((state) => state.sclass);
  const { teachersList } = useSelector((state) => state.teacher);
  const { currentUser } = useSelector((state) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllStudents(adminID));
    dispatch(getAllSclasses(adminID, "Sclass"));
    dispatch(getAllTeachers(adminID));
  }, [adminID, dispatch]);

  const numberOfStudents = studentsList && studentsList.length;
  const numberOfClasses = sclassesList && sclassesList.length;
  const numberOfTeachers = teachersList && teachersList.length;

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-purple-700">Welcome, Admin</h1>
        <p className="mt-2 text-gray-600">Manage your school with ease</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Students Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg transition-all duration-300 hover:shadow-xl"
          onClick={() => navigate("/Admin/students")}
        >
          <div className="flex flex-col items-center p-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 p-4">
              <img
                src={Students || "/placeholder.svg"}
                alt="Students"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              Total Students
            </h2>
            <CounterAnimation end={numberOfStudents} />
          </div>
          <div className="h-2 w-full bg-white/20"></div>
        </motion.div>

        {/* Classes Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg transition-all duration-300 hover:shadow-xl"
          onClick={() => navigate("/Admin/classes")}
        >
          <div className="flex flex-col items-center p-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 p-4">
              <img
                src={Classes || "/placeholder.svg"}
                alt="Classes"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">Total Classes</h2>
            <CounterAnimation end={numberOfClasses} />
          </div>
          <div className="h-2 w-full bg-white/20"></div>
        </motion.div>

        {/* Teachers Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg transition-all duration-300 hover:shadow-xl"
          onClick={() => navigate("/Admin/teachers")}
        >
          <div className="flex flex-col items-center p-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 p-4">
              <img
                src={Teachers || "/placeholder.svg"}
                alt="Teachers"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              Total Teachers
            </h2>
            <CounterAnimation end={numberOfTeachers} />
          </div>
          <div className="h-2 w-full bg-white/20"></div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-10 rounded-xl bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          <button
            onClick={() => navigate("/Admin/addstudents")}
            className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-6 w-6 text-purple-600"
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
            <span className="text-sm font-medium text-gray-700">
              Add Student
            </span>
          </button>

          <button
            onClick={() => navigate("/Admin/addclass")}
            className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Add Class</span>
          </button>

          <button
            onClick={() => navigate("/Admin/teachers/chooseclass")}
            className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Add Teacher
            </span>
          </button>

          <button
            onClick={() => navigate("/Admin/addnotice")}
            className="flex flex-col items-center rounded-lg bg-gray-50 p-4 text-center transition-colors hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-2 h-6 w-6 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Add Notice
            </span>
          </button>
        </div>
      </motion.div>

      {/* Notices Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-xl bg-white p-6 shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Notices</h2>
          <button
            onClick={() => navigate("/Admin/notices")}
            className="rounded-md bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200"
          >
            View All
          </button>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <SeeNotice />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHomePage;
