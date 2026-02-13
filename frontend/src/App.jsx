import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import AnimatedSidebar from './components/AnimatedSidebar'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import ImportantQuestions from './pages/ImportantQuestions'
import Login from './pages/Login'
import Notes from './pages/Notes'
import Profile from './pages/Profile'
import Quizzes from './pages/Quizzes'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Videos from './pages/Videos'

export default function App() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // ❌ Hide header + sidebar on login & signup pages
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">

      {/* ✅ Show Header only if NOT hidden */}
      {!hideLayout && <Header onMenu={() => setOpen(true)} />}

      {/* ✅ Show Sidebar only if NOT hidden */}
      {!hideLayout && (
        <AnimatedSidebar open={open} onClose={() => setOpen(false)} />
      )}

      {/* Main Content */}
      <main className={`${!hideLayout ? "ml-0 md:ml-64 p-4" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/questions" element={<ImportantQuestions />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

    </div>
  )
}
