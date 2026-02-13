import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function ImportantQuestions() {
  const { user, token } = useAuth()
  const [qs, setQs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ question: '', explanation: '', subject: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get('/questions').then(r => setQs(r.data)).catch(() => {}) }, [])

  const createQuestion = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      setAuthToken(token)
      const res = await api.post('/questions', form)
      setQs([res.data, ...qs])
      setForm({ question: '', explanation: '', subject: '' })
      setShowForm(false)
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Create failed') }
    finally { setLoading(false) }
  }

  const saveEdit = async () => {
    if (!form.id) return
    try {
      setAuthToken(token)
      const res = await api.put(`/questions/${form.id}`, { question: form.question, explanation: form.explanation, subject: form.subject })
      setQs(qs.map(x => x._id === form.id ? res.data : x))
      setForm({ question: '', explanation: '', subject: '' })
      setShowForm(false)
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Update failed') }
  }

  const remove = async (id) => {
    if (!confirm('Delete this question?')) return
    try { setAuthToken(token); await api.delete(`/questions/${id}`); setQs(qs.filter(q => q._id !== id)) } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Delete failed') }
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Important Questions</h2>
        {user?.role === 'teacher' && <button onClick={() => { setShowForm(s => !s); setForm({ question: '', explanation: '', subject: '' }) }} className="bg-green-600 text-white px-3 py-1 rounded">{showForm ? 'Cancel' : 'Add Question'}</button>}
      </div>

      {showForm && user?.role === 'teacher' && (
        <form onSubmit={createQuestion} className="mb-4 bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
          <input required className="w-full p-2 rounded border" placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
          <input className="w-full p-2 rounded border" placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <textarea className="w-full p-2 rounded border" placeholder="Explanation" value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })} />
          <div>
            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{loading ? 'Saving...' : 'Save'}</button>
            {form.id && <button type="button" onClick={saveEdit} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Save Edit</button>}
          </div>
        </form>
      )}

      <ul className="space-y-3">
        {qs.map(q => (
          <li key={q._id} className="bg-white dark:bg-gray-900 p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{q.question}</div>
                <div className="text-sm text-gray-500">{q.subject} — by {q.teacher?.name}</div>
                {q.explanation && <div className="mt-2 text-sm">{q.explanation}</div>}
              </div>
              <div className="space-x-2">
                {user?.role === 'teacher' && String(q.teacher?._id || q.teacher) === String(user?.id || user?._id) && (
                  <>
                    <button onClick={() => { setForm({ question: q.question, explanation: q.explanation, subject: q.subject, id: q._id }); setShowForm(true) }} className="text-yellow-600 text-sm">Edit</button>
                    <button onClick={() => remove(q._id)} className="text-red-600 text-sm">Delete</button>
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