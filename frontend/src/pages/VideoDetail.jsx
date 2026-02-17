import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function VideoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const editSave = async (payload) => {
    try {
      setAuthToken(token)
      const res = await api.put(`/videos/${id}`, payload)
      setVideo(res.data)
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || err.message || 'Update failed')
    }
  }

  const remove = async () => {
    if (!confirm('Delete this video?')) return
    try {
      setAuthToken(token)
      await api.delete(`/videos/${id}`)
      navigate('/videos', { state: { removed: id } })
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || err.message || 'Delete failed')
    }
  }

  if (loading) return <p className="p-6">Loading...</p>
  if (!video) return <p className="p-6">Video not found</p>

  const isOwner = user?.role === 'teacher' && String(video.teacher?._id || video.teacher) === String(user?.id || user?._id)

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 mb-4">&larr; Back</button>
      <h2 className="text-xl font-bold">{video.title}</h2>
      <p className="text-sm text-gray-500">By {video.teacher?.name}</p>
      <p className="mt-2 mb-4">{video.description}</p>

      {isOwner && (
        <div className="space-x-2 mb-4">
          <button onClick={() => {
            const t = prompt('Title', video.title); if (t !== null) editSave({ title: t })
          }} className="text-yellow-600 text-sm">Edit</button>
          <button onClick={remove} className="text-red-600 text-sm">Delete</button>
        </div>
      )}

      <video controls className="w-full max-h-96 bg-black" src={video.filePath}>
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
