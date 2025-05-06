"use client"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const SideBar = () => {
  const location = useLocation()

  // Animation variants
  const sidebarVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  // Helper function to check if a path is active
  const isActive = (path) => {
    if (path === "/" || path === "/Admin/dashboard") {
      return location.pathname === "/" || location.pathname === "/Admin/dashboard"
    }
    return location.pathname.startsWith(path)
  }

  // Navigation items
  const mainNavItems = [
    { path: "/", icon: "home", label: "Home" },
    { path: "/Admin/classes", icon: "class", label: "Classes" },
    { path: "/Admin/subjects", icon: "assignment", label: "Subjects" },
    { path: "/Admin/teachers", icon: "supervisor", label: "Teachers" },
    { path: "/Admin/students", icon: "person", label: "Students" },
    { path: "/Admin/notices", icon: "announcement", label: "Notices" },
    { path: "/Admin/complains", icon: "report", label: "Complains" },
  ]

  const userNavItems = [
    { path: "/Admin/profile", icon: "account", label: "Profile" },
    { path: "/logout", icon: "exit", label: "Logout" },
  ]

  // Icon components
  const icons = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    class: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    assignment: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    supervisor: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    person: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    announcement: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
    report: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    account: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    exit: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
    ),
  }

  // NavItem component
  const NavItem = ({ path, icon, label }) => {
    const active = isActive(path)

    return (
      <motion.div variants={itemVariants}>
        <Link
          to={path}
          className={`mb-1 flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            active ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
          }`}
        >
          <span
            className={`mr-3 flex h-8 w-8 items-center justify-center rounded-md ${
              active ? "bg-purple-200 text-purple-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {icons[icon]}
          </span>
          {label}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="h-full w-64 overflow-y-auto rounded-xl bg-white p-4 shadow-lg"
    >
      {/* Main Navigation */}
      <div className="mb-6">
        {mainNavItems.map((item) => (
          <NavItem key={item.path} path={item.path} icon={item.icon} label={item.label} />
        ))}
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-200"></div>

      {/* User Section */}
      <div className="mb-2">
        <motion.p
          variants={itemVariants}
          className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500"
        >
          User
        </motion.p>
        {userNavItems.map((item) => (
          <NavItem key={item.path} path={item.path} icon={item.icon} label={item.label} />
        ))}
      </div>
    </motion.div>
  )
}

export default SideBar
