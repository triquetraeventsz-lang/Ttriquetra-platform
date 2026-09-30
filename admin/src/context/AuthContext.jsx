import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/api/admin/auth/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const user = await api.post('/api/admin/auth/login', { email, password })
    setUser(user)
    return user
  }

  async function logout() {
    try {
      await api.post('/api/admin/auth/logout')
    } catch {
      // Cookie may already be gone (e.g. expired) — clearing local state matters more than the network call.
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
