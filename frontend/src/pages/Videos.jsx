import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function Videos() {
  const { user, token } = useAuth()
  const location = useLocation()
  const [videos, setVideos] = useState([])
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [vForm, setVForm] = useState({ title: '', description: '', tags: '' })
  const [vFile, setVFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/videos')
      .then(r => {
        let data = r.data
        if (location.state?.removed) {
          data = data.filter(v => v._id !== location.state.removed)
          // clear the state so refresh further doesn't re-filter
          window.history.replaceState({}, '')
        }
        setVideos(data)
      })
      .catch(() => {})
  }, [location.state])

  const uploadVideo = async (e) => {
    e.preventDefault(); setLoading(true)
    if (!vFile) return alert('Select a file')
    try {
      setAuthToken(token)
      const fd = new FormData()
      fd.append('video', vFile)
      fd.append('title', vForm.title)
      fd.append('description', vForm.description)
      fd.append('tags', vForm.tags)
      const res = await api.post('/videos', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setVideos([res.data, ...videos])
      setVForm({ title: '', description: '', tags: '' }); setVFile(null); setShowForm(false)
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Upload failed') }
    finally { setLoading(false) }
  }

  const editSave = async (id, payload) => {
    try {
      setAuthToken(token)
      const res = await api.put(`/videos/${id}`, payload)
      setVideos(videos.map(v => v._id === id ? res.data : v))
    } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Update failed') }
  }

  const remove = async (id) => {
    if (!confirm('Delete this video?')) return
    try { setAuthToken(token); await api.delete(`/videos/${id}`); setVideos(videos.filter(v => v._id !== id)) } catch (err) { console.error(err); alert(err?.response?.data?.message || err.message || 'Delete failed') }
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Videos</h2>
        {user?.role === 'teacher' && <button onClick={() => { setShowForm(s => !s); setVForm({ title: '', description: '', tags: '' }); setVFile(null); }} className="bg-green-600 text-white px-3 py-1 rounded">{showForm ? 'Cancel' : 'Add Video'}</button>}
      </div>

      {showForm && user?.role === 'teacher' && (
        <form onSubmit={uploadVideo} className="mb-4 bg-white dark:bg-gray-900 p-4 rounded shadow space-y-2">
          <input required className="w-full p-2 rounded border" placeholder="Title" value={vForm.title} onChange={e => setVForm({ ...vForm, title: e.target.value })} />
          <input className="w-full p-2 rounded border" placeholder="Description" value={vForm.description} onChange={e => setVForm({ ...vForm, description: e.target.value })} />
          <input className="w-full p-2 rounded border" placeholder="Tags (comma separated)" value={vForm.tags} onChange={e => setVForm({ ...vForm, tags: e.target.value })} />
          <input type="file" accept="video/*" onChange={e => setVFile(e.target.files[0])} />
          <div>
            <button disabled={loading} type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{loading ? 'Uploading...' : 'Upload'}</button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos..." className="w-full p-2 rounded border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.filter(v => {
          if (!query || query.trim().length < 1) return true
          const q = query.toLowerCase()
          return (v.title || '').toLowerCase().includes(q) || (v.description || '').toLowerCase().includes(q) || (v.tags || []).join(',').toLowerCase().includes(q)
        }).map(v => (
          <div key={v._id} className="p-4 bg-white dark:bg-gray-900 rounded shadow card-3d">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{v.title}</h3>
                <p className="text-sm text-gray-500">By {v.teacher?.name}</p>
                <p className="mt-2 text-sm">{v.description}</p>
              </div>
              <div className="space-x-2">
                {user?.role === 'teacher' && String(v.teacher?._id || v.teacher) === String(user?.id || user?._id) && (
                  <>
                    <button onClick={() => {
                      const t = prompt('Title', v.title); if (t !== null) editSave(v._id, { title: t })
                    }} className="text-yellow-600 text-sm">Edit</button>
                    <button onClick={() => remove(v._id)} className="text-red-600 text-sm">Delete</button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-3">
              <Link to={`/videos/${v._id}`} className="text-blue-600">
                Play &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}