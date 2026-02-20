import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/", label: "Home" },
  { to: "/videos", label: "Videos" },
  { to: "/notes", label: "Notes" },
  { to: "/questions", label: "Important Qs" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/profile", label: "Profile" },
];

export default function AnimatedSidebar({ open, onClose }) {
  const { user } = useAuth();

  return (
    <motion.aside
      initial={{ x: -260 }}
      animate={{ x: open ? 0 : -260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-64 bg-yellow-400 shadow-lg z-40"
    >
      <div className="p-4 text-black">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">EduPlatform</h2>
          <button
            onClick={onClose}
            className="text-black text-xl hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {items.map((i) =>
            i.to === "/profile" && !user ? null : (
              <motion.div
                key={i.to}
                whileHover={{ scale: 1.05 }}
                className="rounded-md"
              >
                <Link
                  to={i.to}
                  onClick={onClose}
                  className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition"
                >
                  {i.label}
                </Link>
              </motion.div>
            ),
          )}

          {/* Auth Links */}
          {!user && (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition"
                >
                  Signup
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition"
                >
                  Login
                </Link>
              </motion.div>
            </>
          )}

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/teacher/results"
              onClick={onClose}
              className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition"
            >
              Student Results
            </Link>
          </motion.div>

          {/* Role-based dashboards */}
          {user?.role === "teacher" && (
            <>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/teacher"
                  onClick={onClose}
                  className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition font-semibold"
                >
                  Teacher Dashboard
                </Link>
              </motion.div>
            </>
          )}

          {user?.role === "student" && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/student"
                onClick={onClose}
                className="block px-3 py-2 rounded-md hover:bg-yellow-300 transition font-semibold"
              >
                Student Dashboard
              </Link>
            </motion.div>
          )}
        </nav>
      </div>
    </motion.aside>
  );
}
