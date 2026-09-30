import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

/**
 * Gates a route in the UI only — Phase 1's `requireRole` middleware is the
 * actual security boundary and enforces this independently server-side.
 * An EDITOR who navigates here directly is redirected, not shown a
 * broken/half-loaded page.
 */
export function RequireRole({ role }) {
  const { user } = useAuth()
  if (!user) return null
  if (user.role !== role) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
