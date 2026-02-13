import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signup(form.name, form.email, form.password, form.role)
      nav('/')
    } catch (err) {
      setError("Signup failed. Try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Sign up</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          required
          className="w-full p-2 mb-3 rounded border"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          required
          className="w-full p-2 mb-3 rounded border"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          required
          className="w-full p-2 mb-3 rounded border"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <div className="mb-3">
          <label className="mr-3">
            <input
              type="radio"
              name="role"
              checked={form.role === 'student'}
              onChange={() => setForm({ ...form, role: 'student' })}
            /> Student
          </label>

          <label className="ml-3">
            <input
              type="radio"
              name="role"
              checked={form.role === 'teacher'}
              onChange={() => setForm({ ...form, role: 'teacher' })}
            /> Teacher
          </label>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  )
}
