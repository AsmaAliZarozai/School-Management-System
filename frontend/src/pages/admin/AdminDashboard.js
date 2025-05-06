"use client";

import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logout from "../Logout";
import SideBar from "./SideBar";
import AdminProfile from "./AdminProfile";
import AdminHomePage from "./AdminHomePage";

// Student related imports
import AddStudent from "./studentRelated/AddStudent";
import SeeComplains from "./studentRelated/SeeComplains";
import ShowStudents from "./studentRelated/ShowStudents";
import StudentAttendance from "./studentRelated/StudentAttendance";
import StudentExamMarks from "./studentRelated/StudentExamMarks";
import ViewStudent from "./studentRelated/ViewStudent";

// Notice related imports
import AddNotice from "./noticeRelated/AddNotice";
import ShowNotices from "./noticeRelated/ShowNotices";

// Subject related imports
import ShowSubjects from "./subjectRelated/ShowSubjects";
import SubjectForm from "./subjectRelated/SubjectForm";
import ViewSubject from "./subjectRelated/ViewSubject";

// Teacher related imports
import AddTeacher from "./teacherRelated/AddTeacher";
import ChooseClass from "./teacherRelated/ChooseClass";
import ChooseSubject from "./teacherRelated/ChooseSubject";
import ShowTeachers from "./teacherRelated/ShowTeachers";
import TeacherDetails from "./teacherRelated/TeacherDetails";

// Class related imports
import AddClass from "./classRelated/AddClass";
import ClassDetails from "./classRelated/ClassDetails";
import ShowClasses from "./classRelated/ShowClasses";
import AccountMenu from "../../components/AccountMenu";
import StudentAnalytics from "../StudentAnalytics";

const AdminDashboard = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: isMobile ? -280 : 0, opacity: isMobile ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg md:relative ${
              isMobile ? "shadow-xl" : ""
            }`}
          >
            <div className="flex h-full flex-col">
              {/* Sidebar header */}
              <div className="flex h-16 items-center justify-between border-b px-4">
                <h2 className="text-xl font-bold text-purple-700">
                  School Admin
                </h2>
                <button
                  onClick={toggleDrawer}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Sidebar content */}
              <div className="flex-1 overflow-y-auto py-4">
                <SideBar />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={toggleDrawer}
          aria-hidden="true"
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="z-10 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button
                onClick={toggleDrawer}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                Admin Dashboard
              </h1>
            </div>
            <AccountMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Routes>
                <Route path="/" element={<AdminHomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/Admin/dashboard" element={<AdminHomePage />} />
                <Route path="/Admin/profile" element={<AdminProfile />} />
                <Route path="/Admin/complains" element={<SeeComplains />} />

                {/* Notice */}
                <Route path="/Admin/addnotice" element={<AddNotice />} />
                <Route path="/Admin/notices" element={<ShowNotices />} />

                {/* Subject */}
                <Route path="/Admin/subjects" element={<ShowSubjects />} />
                <Route
                  path="/Admin/subjects/subject/:classID/:subjectID"
                  element={<ViewSubject />}
                />
                <Route
                  path="/Admin/subjects/chooseclass"
                  element={<ChooseClass situation="Subject" />}
                />

                <Route path="/Admin/addsubject/:id" element={<SubjectForm />} />
                <Route
                  path="/Admin/class/subject/:classID/:subjectID"
                  element={<ViewSubject />}
                />

                <Route
                  path="/Admin/subject/student/attendance/:studentID/:subjectID"
                  element={<StudentAttendance situation="Subject" />}
                />
                <Route
                  path="/Admin/subject/student/marks/:studentID/:subjectID"
                  element={<StudentExamMarks situation="Subject" />}
                />

                {/* Class */}
                <Route path="/Admin/addclass" element={<AddClass />} />
                <Route path="/Admin/classes" element={<ShowClasses />} />
                <Route
                  path="/Admin/classes/class/:id"
                  element={<ClassDetails />}
                />
                <Route
                  path="/Admin/class/addstudents/:id"
                  element={<AddStudent situation="Class" />}
                />

                {/* Student */}
                <Route
                  path="/Admin/addstudents"
                  element={<AddStudent situation="Student" />}
                />
                <Route path="/Admin/students" element={<ShowStudents />} />
                <Route
                  path="/Admin/students/student/:id"
                  element={<ViewStudent />}
                />
                <Route
                  path="/Admin/students/student/attendance/:id"
                  element={<StudentAttendance situation="Student" />}
                />
                <Route
                  path="/Admin/students/student/marks/:id"
                  element={<StudentExamMarks situation="Student" />}
                />

                {/* Teacher */}
                <Route path="/Admin/teachers" element={<ShowTeachers />} />
                <Route
                  path="/Admin/teachers/teacher/:id"
                  element={<TeacherDetails />}
                />
                <Route
                  path="/Admin/teachers/chooseclass"
                  element={<ChooseClass situation="Teacher" />}
                />
                <Route
                  path="/Admin/teachers/choosesubject/:id"
                  element={<ChooseSubject situation="Norm" />}
                />
                <Route
                  path="/Admin/teachers/choosesubject/:classID/:teacherID"
                  element={<ChooseSubject situation="Teacher" />}
                />
                <Route
                  path="/Admin/teachers/addteacher/:id"
                  element={<AddTeacher />}
                />

                {/* Analytics */}
                <Route
                  path="/Admin/student-analytics/:id?"
                  element={<StudentAnalytics />}
                />

                <Route path="/logout" element={<Logout />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
