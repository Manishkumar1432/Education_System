import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

const MAX_QUESTIONS = 20
const OPTIONS_PER_QUESTION = 4

const emptyQuestion = () => ({
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0
})

// Beautiful Quiz Result Component
const QuizResultDisplay = ({ quiz, result, studentAnswers, navigate }) => {
  if (!quiz || !result || !quiz.questions) return null

  const totalQuestions = quiz.questions.length
  const score = typeof result.score === 'number' ? result.score : parseFloat(result.score) || 0

  // Determine performance level and colors
  const getPerformance = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', emoji: '🎉', color: 'green', bgColor: 'bg-green-50 dark:bg-green-900/20', textColor: 'text-green-700 dark:text-green-300', borderColor: 'border-green-500' }
    if (percentage >= 60) return { level: 'Good', emoji: '👍', color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/20', textColor: 'text-blue-700 dark:text-blue-300', borderColor: 'border-blue-500' }
    if (percentage >= 40) return { level: 'Average', emoji: '📚', color: 'yellow', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', textColor: 'text-yellow-700 dark:text-yellow-300', borderColor: 'border-yellow-500' }
    return { level: 'Needs Improvement', emoji: '💪', color: 'red', bgColor: 'bg-red-50 dark:bg-red-900/20', textColor: 'text-red-700 dark:text-red-300', borderColor: 'border-red-500' }
  }

  const performance = getPerformance(score)

  // Get question results - use result.answers if available, otherwise fallback to studentAnswers
  const submittedAnswers = result.answers || []
  const answerMap = {}
  submittedAnswers.forEach(a => {
    answerMap[a.questionId] = a.answerIndex
  })

  const questionResults = quiz.questions.map((q, idx) => {
    const studentAnswer = answerMap[q._id] ?? studentAnswers[q._id] ?? -1
    const isCorrect = q.correctAnswer === studentAnswer
    return {
      question: q,
      index: idx,
      studentAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      studentOption: q.options?.[studentAnswer] || 'Not answered',
      correctOption: q.options?.[q.correctAnswer] || ''
    }
  })

  // Recalculate correct count from actual results
  const actualCorrectCount = questionResults.filter(qr => qr.isCorrect).length

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <div className={`${performance.bgColor} border-2 ${performance.borderColor} rounded-xl p-8 shadow-lg`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className={`text-xl ${performance.textColor} font-semibold`}>{performance.level}</p>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - score / 100)}`}
                className={`${performance.textColor} transition-all duration-1000`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-5xl font-bold ${performance.textColor}`}>
                  {score.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalQuestions}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Questions</div>
          </div>
          <div className="text-center bg-green-100 dark:bg-green-900/30 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{actualCorrectCount}</div>
            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Correct</div>
          </div>
          <div className="text-center bg-red-100 dark:bg-red-900/30 rounded-lg p-4 shadow">
            <div className="text-3xl font-bold text-red-700 dark:text-red-300">{totalQuestions - actualCorrectCount}</div>
            <div className="text-sm text-red-600 dark:text-red-400 mt-1">Incorrect</div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Question Review
        </h3>
        <div className="space-y-4">
          {questionResults.map((qr, idx) => (
            <div
              key={qr.question._id || idx}
              className={`p-4 rounded-lg border-2 ${
                qr.isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    qr.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {qr.isCorrect ? '✓' : '✗'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Q{idx + 1}. {qr.question.text}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className={`flex items-center gap-2 ${qr.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                      <span className="font-medium">Your answer:</span>
                      <span>{qr.studentOption}</span>
                      {!qr.isCorrect && (
                        <span className="text-xs bg-red-200 dark:bg-red-800 px-2 py-0.5 rounded">Wrong</span>
                      )}
                    </div>
                    {!qr.isCorrect && (
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <span className="font-medium">Correct answer:</span>
                        <span>{qr.correctOption}</span>
                        <span className="text-xs bg-green-200 dark:bg-green-800 px-2 py-0.5 rounded">Correct</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate('/quizzes')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-colors"
        >
          Back to Quizzes
        </button>
      </div>
    </div>
  )
}

export default function QuizDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [studentAnswers, setStudentAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [questions, setQuestions] = useState([])

  const isTeacher = user?.role === 'teacher'
  const isOwner = quiz && (String(quiz.teacher?._id || quiz.teacher) === String(user?.id || user?._id))

  useEffect(() => {
    api.get(`/quizzes/${id}`)
      .then(r => {
        setQuiz(r.data)
        setQuestions(r.data.questions?.length
          ? r.data.questions.map(q => ({
              text: q.text || '',
              options: Array(OPTIONS_PER_QUESTION).fill('').map((_, i) => q.options?.[i] ?? ''),
              correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0
            }))
          : [emptyQuestion()]
        )
      })
      .catch(() => setQuiz(null))
      .finally(() => setLoading(false))
  }, [id])

  const addQuestion = () => {
    if (questions.length >= MAX_QUESTIONS) return
    setQuestions([...questions, emptyQuestion()])
  }

  const removeQuestion = (idx) => {
    if (questions.length <= 1) return
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const setQuestion = (idx, field, value) => {
    const next = [...questions]
    if (field === 'text') {
      next[idx] = { ...next[idx], text: value }
    } else if (field === 'option') {
      const [optIdx, val] = value
      const opts = [...(next[idx].options || [])]
      opts[optIdx] = val
      next[idx] = { ...next[idx], options: opts }
    } else if (field === 'correctAnswer') {
      next[idx] = { ...next[idx], correctAnswer: parseInt(value, 10) }
    }
    setQuestions(next)
  }

  const saveQuestions = async (e) => {
    e.preventDefault()
    if (!isTeacher || !isOwner) return
    const payload = questions
      .filter(q => q.text.trim())
      .map(q => ({
        text: q.text.trim(),
        options: (q.options || []).slice(0, OPTIONS_PER_QUESTION).map(o => o.trim() || ''),
        correctAnswer: Math.max(0, Math.min(3, q.correctAnswer || 0))
      }))
    if (payload.length === 0) {
      alert('Add at least one question with text.')
      return
    }
    setSaving(true)
    try {
      setAuthToken(token)
      const res = await api.put(`/quizzes/${id}`, { questions: payload })
      setQuiz(res.data)
      setQuestions(res.data.questions?.length
        ? res.data.questions.map(q => ({
            text: q.text || '',
            options: Array(OPTIONS_PER_QUESTION).fill('').map((_, i) => q.options?.[i] ?? ''),
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0
          }))
        : [emptyQuestion()]
      )
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Save failed')
    }
    setSaving(false)
  }

  const submitAttempt = async (e) => {
    e.preventDefault()
    if (user?.role !== 'student' || !quiz?.questions?.length) return
    const answers = quiz.questions.map(q => ({
      questionId: q._id,
      answerIndex: studentAnswers[q._id] ?? -1
    }))
    setSubmitLoading(true)
    try {
      setAuthToken(token)
      const res = await api.post(`/results/${id}/submit`, { answers })
      setResult(res.data)
    } catch (err) {
      alert(err?.response?.data?.message || err.message || 'Submit failed')
    }
    setSubmitLoading(false)
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (!quiz) return <div className="p-6">Quiz not found.</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <button type="button" onClick={() => navigate('/quizzes')} className="text-gray-600 hover:underline">
          ← Back to Quizzes
        </button>
      </div>
      {quiz.description && <p className="text-gray-600 dark:text-gray-400 mb-4">{quiz.description}</p>}

      {/* Teacher: Add/Edit up to 20 questions, 4 options each */}
      {isTeacher && isOwner && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Questions ({questions.length} / {MAX_QUESTIONS})</h3>
          <form onSubmit={saveQuestions} className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Q{idx + 1}</span>
                  {questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(idx)} className="text-red-600 text-sm">
                      Remove
                    </button>
                  )}
                </div>
                <input
                  required
                  className="w-full p-2 rounded border mb-3"
                  placeholder="Question text"
                  value={q.text}
                  onChange={e => setQuestion(idx, 'text', e.target.value)}
                />
                <div className="space-y-2 mb-3">
                  {[0, 1, 2, 3].map(optIdx => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <span className="w-6 text-gray-500">{(optIdx + 1).toString()}.</span>
                      <input
                        className="flex-1 p-2 rounded border"
                        placeholder={`Option ${optIdx + 1}`}
                        value={q.options?.[optIdx] ?? ''}
                        onChange={e => setQuestion(idx, 'option', [optIdx, e.target.value])}
                      />
                      <label className="flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="radio"
                          name={`correct-${idx}`}
                          checked={(q.correctAnswer ?? 0) === optIdx}
                          onChange={() => setQuestion(idx, 'correctAnswer', optIdx)}
                        />
                        Correct
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {questions.length < MAX_QUESTIONS && (
              <button type="button" onClick={addQuestion} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded">
                + Add question
              </button>
            )}
            <div>
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded">
                {saving ? 'Saving...' : 'Save questions'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Student: Attempt quiz */}
      {!isTeacher && (
        <section>
          {result !== null ? (
            <QuizResultDisplay quiz={quiz} result={result} studentAnswers={studentAnswers} navigate={navigate} />
          ) : quiz.questions?.length > 0 ? (
            <form onSubmit={submitAttempt} className="space-y-6">
              <h3 className="text-lg font-semibold">Attempt quiz</h3>
              {quiz.questions.map((q, idx) => (
                <div key={q._id} className="bg-white dark:bg-gray-900 p-4 rounded shadow">
                  <p className="font-medium mb-2">Q{idx + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={q._id}
                          checked={studentAnswers[q._id] === optIdx}
                          onChange={() => setStudentAnswers(prev => ({ ...prev, [q._id]: optIdx }))}
                        />
                        <span>{opt || `Option ${optIdx + 1}`}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={submitLoading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {submitLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          ) : (
            <p className="text-gray-500">No questions yet. Teacher will add questions first.</p>
          )}
        </section>
      )}

      {/* Teacher (non-owner): view only */}
      {isTeacher && !isOwner && (
        <p className="text-gray-500">Only the quiz owner can add questions. Students can attempt this quiz from the Quizzes page.</p>
      )}
    </div>
  )
}
