import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login(form.email, form.password)
      nav('/')
    } catch (err) {
      setError("Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          className="w-full p-2 mb-3 rounded border"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          className="w-full p-2 mb-3 rounded border"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

<button
  disabled={loading}
  className="w-full bg-yellow-500 text-white py-2 rounded disabled:opacity-50"
>
  {loading ? "Logging in..." : "Login"}
</button>

<Link to="/signup" className="text-center block mt-3">
  <span className="text-green-600 cursor-pointer hover:underline">
    Create Account
  </span>
</Link>


      </form>
    </div>
  )
}

//new