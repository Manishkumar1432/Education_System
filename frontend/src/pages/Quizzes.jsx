import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function Quizzes() {
  const { user, token } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.get('/quizzes').then(r => setQuizzes(r.data)).catch(() => {}) }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!user || user.role !== 'teacher') return alert('Only teachers can perform this action')
    setLoading(true)
    try {
      if (editingId) {
        const res = await api.put(`/quizzes/${editingId}`, { title, description })
        setQuizzes(quizzes.map(q => q._id === editingId ? res.data : q))
        setEditingId(null)
      } else {
        const res = await api.post('/quizzes', { title, description })
        setQuizzes([res.data, ...quizzes])
      }
      setTitle(''); setDescription(''); setShowForm(false)
    } catch (err) {
      alert(err?.response?.data?.message || 'Operation failed')
    }
    setLoading(false)
  }

  const startEdit = (q) => {
    setEditingId(q._id)
    setTitle(q.title || '')
    setDescription(q.description || '')
    setShowForm(true)
  }

  const remove = async (id) => {
    if (!confirm('Delete this quiz?')) return
    try {
      setAuthToken(token)
      await api.delete(`/quizzes/${id}`)
      setQuizzes(quizzes.filter(q => q._id !== id))
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || err.message || 'Delete failed')
    }
  }

  const isOwner = (q) => {
    const tid = (q.teacher && q.teacher._id) ? q.teacher._id : q.teacher
    const uid = user?.id || user?._id
    return String(tid) === String(uid)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Quizzes</h2>
        {user?.role === 'teacher' && (
          <div>
            <button onClick={() => { setShowForm(s => !s); setEditingId(null); setTitle(''); setDescription('') }} className="bg-green-600 text-white px-3 py-1 rounded">{showForm ? 'Cancel' : 'Add Quiz'}</button>
          </div>
        )}
      </div>

      {showForm && user?.role === 'teacher' && (
        <form onSubmit={submit} className="mb-4 bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2 max-w-xl">
          <input required className="w-full p-2 rounded border" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="w-full p-2 rounded border" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <div>
            <button disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">{editingId ? (loading ? 'Saving...' : 'Save') : (loading ? 'Creating...' : 'Create')}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setDescription(''); setShowForm(false) }} className="ml-2 px-3 py-1 rounded border">Cancel Edit</button>}
          </div>
        </form>
      )}

      <div className="mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search quizzes..." className="w-full p-2 rounded border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.filter(z => {
          if (!query || query.trim().length < 1) return true
          const q = query.toLowerCase()
          return (z.title || '').toLowerCase().includes(q) || (z.description || '').toLowerCase().includes(q)
        }).map(q => (
          <div key={q._id} className="p-4 bg-white dark:bg-gray-900 rounded shadow card-3d">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{q.title}</h3>
                <p className="text-sm text-gray-500">By {q.teacher?.name}</p>
                <p className="mt-2 text-sm">{q.description}</p>
              </div>
              <div className="space-x-2">
                {user?.role === 'teacher' && isOwner(q) && (
                  <>
                    <button onClick={() => startEdit(q)} className="text-yellow-600 text-sm">Edit</button>
                    <button onClick={() => remove(q._id)} className="text-red-600 text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-3">
              <Link to={`/quizzes/${q._id}`} className="text-blue-600">Attempt</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}