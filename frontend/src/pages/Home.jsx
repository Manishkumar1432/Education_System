import { motion } from "framer-motion"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-yellow-500">Edu Platform</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Learn smarter with videos, notes, quizzes, and expert guidance — all in one place.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/videos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition"
            >
              Explore Videos
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="mt-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <Link key={item.title} to={item.to} className="block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.desc}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Call To Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 bg-yellow-400 rounded-2xl p-10 max-w-5xl mx-auto text-center shadow-xl"
      >
        <h2 className="text-3xl font-bold text-black mb-4">
          Start Your Learning Journey Today 🚀
        </h2>
        <p className="text-black mb-6">
          Join students and teachers building a smarter future together.
        </p>
        <Link to="/signup">
          <button className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            Join Now
          </button>
        </Link>
      </motion.div>
    </div>
  )
}

const features = [
  {
    title: "Video Learning",
    desc: "Watch high-quality lectures and concept videos anytime.",
    icon: "🎥",
    to: "/videos",
  },
  {
    title: "Notes & PDFs",
    desc: "Download easy-to-understand notes and study materials.",
    icon: "📘",
    to: "/notes",
  },
  {
    title: "Quizzes & Tests",
    desc: "Test your knowledge with interactive quizzes.",
    icon: "📝",
    to: "/quizzes",
  },
  {
    title: "Important Questions",
    desc: "Key questions curated by teachers for exam prep.",
    icon: "❗",
    to: "/questions",
  },
  {
    title: "Tests",
    desc: "Take full-length tests and timed assessments.",
    icon: "🧪",
    to: "/quizzes",
  },
]
