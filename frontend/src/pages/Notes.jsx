import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [query, setQuery] = useState('')
  const { user, token } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  useEffect(() => { api.get('/notes').then(r => setNotes(r.data)).catch(() => {}) }, [])

  const createNote = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      setAuthToken(token)
      if (editingId) {
        const payload = { title, content, tags }
        const res = await api.put(`/notes/${editingId}`, payload)
        setNotes(notes.map(n => n._id === editingId ? res.data : n))
        setEditingId(null)
      } else {
        const fd = new FormData()
        fd.append('title', title)
        fd.append('content', content)
        fd.append('tags', tags)
        if (file) fd.append('file', file)
        const res = await api.post('/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setNotes([res.data, ...notes])
      }
      setTitle(''); setContent(''); setTags(''); setFile(null); setShowForm(false)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.message || err.message || 'Save failed')
    } finally { setLoading(false) }
  }

  const deleteNote = async (id) => {
    if (!confirm('Delete this note?')) return
    try {
      setAuthToken(token)
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter(n => n._id !== id))
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Delete failed') }
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Notes</h2>
        {user?.role === 'teacher' && (
          <div>
            <button onClick={() => setShowForm(s => !s)} className="bg-green-600 text-white px-3 py-1 rounded">{showForm ? 'Cancel' : 'Add Note'}</button>
          </div>
        )}
      </div>

      {showForm && user?.role === 'teacher' && (
        <form onSubmit={createNote} className="bg-white dark:bg-gray-900 p-4 rounded shadow mb-4 space-y-2">
          {error && <div className="text-red-500">{error}</div>}
          <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 rounded border" />
          <textarea required value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="w-full p-2 rounded border" />
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated)" className="w-full p-2 rounded border" />
          <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files[0])} />
          <div>
            <button disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">{loading ? 'Saving...' : 'Save Note'}</button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes..." className="w-full p-2 rounded border" />
      </div>

      <div className="space-y-3">
        {notes.filter(n => {
          if (!query || query.trim().length < 1) return true
          const q = query.toLowerCase()
          return (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q) || (n.tags || []).join(',').toLowerCase().includes(q)
        }).map(n => (
          <div key={n._id} className="bg-white dark:bg-gray-900 p-4 rounded shadow">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-gray-500">By {n.teacher?.name}</p>
            <p className="mt-2 text-sm">{n.content}</p>
            {n.filePath && <a href={n.filePath} className="text-blue-600 mt-2 block">Download</a>}
            <div className="mt-2 space-x-2">
              {user?.role === 'teacher' && String(n.teacher?._id || n.teacher) === String(user?.id || user?._id) && (
                <>
                  <button onClick={() => { setEditingId(n._id); setTitle(n.title); setContent(n.content); setTags((n.tags||[]).join(',')); setShowForm(true); }} className="text-yellow-600 text-sm">Edit</button>
                  <button onClick={() => deleteNote(n._id)} className="text-red-600 text-sm">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}