import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function TeacherDashboard() {
  const { user, token } = useAuth()
  const [qs, setQs] = useState([])
  const [form, setForm] = useState({ question: '', explanation: '', subject: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/questions').then(r => setQs(r.data)).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'teacher') return alert('Only teachers can perform this action')
    setLoading(true)
    try {
      setAuthToken(token)
      if (editing) {
        const res = await api.put(`/questions/${editing._id}`, form)
        setQs(qs.map(q => q._id === editing._id ? res.data : q))
        setEditing(null)
      } else {
        const res = await api.post('/questions', form)
        setQs([res.data, ...qs])
      }
      setForm({ question: '', explanation: '', subject: '' })
    } catch (err) {
      alert(err?.response?.data?.message || 'Operation failed')
    }
    setLoading(false)
  }

  const startEdit = (q) => {
    setEditing(q)
    setForm({ question: q.question, explanation: q.explanation, subject: q.subject })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ question: '', explanation: '', subject: '' })
  }

  const remove = async (id) => {
    if (!confirm('Delete this question?')) return
    setAuthToken(token)
    await api.delete(`/questions/${id}`)
    setQs(qs.filter(q => q._id !== id))
  }

  const isOwner = (q) => {
    const tid = q.teacher?._id || q.teacher
    const uid = user?.id || user?._id
    return String(tid) === String(uid)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold">Teacher Dashboard</h2>
        <p className="text-sm opacity-90">Create & manage important questions</p>
      </motion.div>

      {user?.role !== 'teacher' ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow"
        >
          Only teachers can manage content.
        </motion.div>
      ) : (
        <>
          {/* Form Card */}
          <motion.section
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg"
          >
            <h3 className="font-semibold mb-3 text-lg">
              {editing ? 'Edit Question' : 'Create New Question'}
            </h3>

            <AnimatePresence mode="wait">
              <motion.form
                key={editing ? 'edit' : 'create'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onSubmit={submit}
                className="space-y-3"
              >
                <input
                  required
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500"
                  placeholder="Question"
                  value={form.question}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                />
                <input
                  className="w-full p-3 rounded-xl border"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                />
                <textarea
                  className="w-full p-3 rounded-xl border"
                  placeholder="Explanation"
                  value={form.explanation}
                  onChange={e => setForm({ ...form, explanation: e.target.value })}
                />

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={loading}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700"
                  >
                    {editing ? 'Save Changes' : 'Create Question'}
                  </motion.button>
                  {editing && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-5 py-2 rounded-xl border"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </motion.form>
            </AnimatePresence>
          </motion.section>

          {/* Question List */}
          <section className="grid md:grid-cols-2 gap-4">
            <AnimatePresence>
              {qs.map(q => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ rotateX: 5, rotateY: -5 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg"
                >
                  <h4 className="font-semibold">{q.question}</h4>
                  <p className="text-sm text-gray-500">
                    {q.subject} • {q.teacher?.name}
                  </p>
                  {q.explanation && (
                    <p className="mt-2 text-sm">{q.explanation}</p>
                  )}

                  {isOwner(q) && (
                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => startEdit(q)}
                        className="text-yellow-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(q._id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </section>
        </>
      )}
    </motion.div>
  )
}
