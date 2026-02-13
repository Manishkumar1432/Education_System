import { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      api.get('/auth/profile').then(res => setUser(res.data)).catch(() => logout())
    }
  }, [token])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const login = async (email, password) => {
    setLoading(true)
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    setAuthToken(res.data.token)
    setLoading(false)
    return res.data
  }

  const signup = async (name, email, password, role) => {
    setLoading(true)
    const res = await api.post('/auth/signup', { name, email, password, role })
    localStorage.setItem('token', res.data.token)
    setToken(res.data.token)
    setUser(res.data.user)
    setAuthToken(res.data.token)
    setLoading(false)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, theme, setTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext
