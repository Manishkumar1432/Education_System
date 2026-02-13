import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api, { setAuthToken } from '../services/api'

export default function Profile() {
  const { user, token } = useAuth()
  const [form, setForm] = useState({ name: '', bio: '' })

  useEffect(() => { if (user) setForm({ name: user.name, bio: user.profile?.bio || '' }) }, [user])

  const save = async (e) => {
    e.preventDefault()
    try {
      setAuthToken(token)
      await api.put('/auth/profile', { name: form.name, bio: form.bio })
      alert('Saved')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || err.message || 'Save failed')
    }
  }
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Profile</h2>
      <form onSubmit={save} className="max-w-md space-y-3">
        <input className="w-full p-2 rounded border" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <textarea className="w-full p-2 rounded border" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <button className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      </form>
    </div>
  )
}