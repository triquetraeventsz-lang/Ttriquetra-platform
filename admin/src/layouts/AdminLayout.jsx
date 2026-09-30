import { Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Sidebar } from '../components/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen bg-paper">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-end gap-4 border-b border-line bg-cream px-6 py-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-ink-soft">{user?.name}</p>
            <p className="text-xs text-stone">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-paper"
          >
            <LogOut size={14} />
            Log out
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
