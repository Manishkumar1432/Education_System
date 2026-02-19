import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function ImportantQuestions() {
  const { user, token } = useAuth()

  const [qs, setQs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    question: '',
    explanation: '',
    subject: ''
  })
  const [loading, setLoading] = useState(false)

  // Load Questions
  useEffect(() => {
    api.get('/questions')
      .then(res => setQs(res.data))
      .catch(() => {})
  }, [])

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'teacher') return

    setLoading(true)

    try {
      if (editingId) {
        // UPDATE
        const res = await api.put(`/questions/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setQs(prev =>
          prev.map(q => q._id === editingId ? res.data : q)
        )

      } else {
        // CREATE
        const res = await api.post('/questions', form, {
          headers: { Authorization: `Bearer ${token}` }
        })

        setQs(prev => [res.data, ...prev])
      }

      // Reset form
      setForm({ question: '', explanation: '', subject: '' })
      setEditingId(null)
      setShowForm(false)

    } catch (err) {
      alert(err?.response?.data?.message || 'Operation failed')
    }

    setLoading(false)
  }

  // Start Edit
  const startEdit = (q) => {
    setEditingId(q._id)
    setForm({
      question: q.question,
      explanation: q.explanation || '',
      subject: q.subject || ''
    })
    setShowForm(true)
  }

  // DELETE (FIXED)
  const remove = async (id) => {
    if (!window.confirm('Delete this question?')) return

    try {
      await api.delete(`/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setQs(prev => prev.filter(q => q._id !== id))

    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed')
    }
  }

  // Ownership check
  const isOwner = (q) => {
    const teacherId = q.teacher?._id || q.teacher
    const userId = user?.id || user?._id
    return String(teacherId) === String(userId)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Important Questions</h2>

        {user?.role === 'teacher' && (
          <button
            onClick={() => {
              setShowForm(s => !s)
              setEditingId(null)
              setForm({ question: '', explanation: '', subject: '' })
            }}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            {showForm ? 'Cancel' : 'Add Question'}
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm && user?.role === 'teacher' && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2"
        >
          <input
            required
            className="w-full p-2 rounded border"
            placeholder="Question"
            value={form.question}
            onChange={e => setForm({ ...form, question: e.target.value })}
          />

          <input
            className="w-full p-2 rounded border"
            placeholder="Subject"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />

          <textarea
            className="w-full p-2 rounded border"
            placeholder="Explanation"
            value={form.explanation}
            onChange={e => setForm({ ...form, explanation: e.target.value })}
          />

          <button
            disabled={loading}
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {editingId
              ? (loading ? 'Updating...' : 'Update')
              : (loading ? 'Saving...' : 'Save')}
          </button>
        </form>
      )}

      {/* LIST */}
      <ul className="space-y-3">
        {qs.map(q => (
          <li
            key={q._id}
            className="bg-white dark:bg-gray-900 p-4 rounded shadow"
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{q.question}</div>
                <div className="text-sm text-gray-500">
                  {q.subject} — by {q.teacher?.name}
                </div>
                {q.explanation && (
                  <div className="mt-2 text-sm">{q.explanation}</div>
                )}
              </div>

              <div className="space-x-2">
                {user?.role === 'teacher' && isOwner(q) && (
                  <>
                    <button
                      onClick={() => startEdit(q)}
                      className="text-yellow-600 text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => remove(q._id)}
                      className="text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
