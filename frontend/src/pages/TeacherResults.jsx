import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function TeacherResults() {
  const { user, token } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterQuiz, setFilterQuiz] = useState('')
  const [quizzes, setQuizzes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user?.role !== 'teacher') return
    setAuthToken(token)
    // Fetch teacher's quizzes
    api.get('/quizzes').then(r => {
      const myQuizzes = r.data.filter(q => String(q.teacher?._id || q.teacher) === String(user?.id || user?._id))
      setQuizzes(myQuizzes)
    }).catch(() => {})
    // Fetch all results for this teacher's quizzes
    api.get('/results/teacher')
      .then(r => setResults(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, token])

  // Filter results by quiz and search
  const filteredResults = results.filter(r => {
    if (filterQuiz && String(r.quiz?._id || r.quiz) !== filterQuiz) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const studentName = (r.student?.name || '').toLowerCase()
      const studentEmail = (r.student?.email || '').toLowerCase()
      const quizTitle = (r.quiz?.title || '').toLowerCase()
      return studentName.includes(q) || studentEmail.includes(q) || quizTitle.includes(q)
    }
    return true
  })

  if (user?.role !== 'teacher') {
    return <div className="p-6 text-center text-gray-500">Only teachers can view results.</div>
  }

  if (loading) return <div className="p-6">Loading results...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Quiz Results</h2>

      {/* Filters */}
      <div className="mb-6 space-y-3 bg-white dark:bg-gray-900 p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Quiz</label>
          <select
            value={filterQuiz}
            onChange={e => setFilterQuiz(e.target.value)}
            className="w-full p-2 rounded border"
          >
            <option value="">All Quizzes</option>
            {quizzes.map(q => (
              <option key={q._id} value={q._id}>{q.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Search (Student Name/Email)</label>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search student..."
            className="w-full p-2 rounded border"
          />
        </div>
      </div>

      {/* Results Stats */}
      {filteredResults.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{filteredResults.length}</div>
            <div className="text-sm text-gray-600">Total Submissions</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{(filteredResults.reduce((sum, r) => sum + (r.score || 0), 0) / filteredResults.length).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
            <div className="text-2xl font-bold text-yellow-600">{filteredResults.filter(r => (r.score || 0) >= 80).length}</div>
            <div className="text-sm text-gray-600">Excellent (≥80%)</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
            <div className="text-2xl font-bold text-red-600">{filteredResults.filter(r => (r.score || 0) < 40).length}</div>
            <div className="text-sm text-gray-600">Needs Help (&lt;40%)</div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {filteredResults.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No results found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-900 rounded shadow">
            <thead className="bg-gray-100 dark:bg-gray-800 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Student</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Quiz</th>
                <th className="px-4 py-3 text-center font-semibold">Score</th>
                <th className="px-4 py-3 text-center font-semibold">Date</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r, idx) => {
                const score = typeof r.score === 'number' ? r.score : parseFloat(r.score) || 0
                let statusColor = 'bg-red-100 text-red-800'
                if (score >= 80) statusColor = 'bg-green-100 text-green-800'
                else if (score >= 60) statusColor = 'bg-blue-100 text-blue-800'
                else if (score >= 40) statusColor = 'bg-yellow-100 text-yellow-800'
                return (
                  <tr key={r._id || idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">{r.student?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.student?.email || '-'}</td>
                    <td className="px-4 py-3">{r.quiz?.title || 'Unknown'}</td>
                    <td className="px-4 py-3 text-center font-semibold">{score.toFixed(0)}%</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-500">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
                        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : 'Needs Help'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
