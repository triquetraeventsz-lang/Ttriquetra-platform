import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Table } from '../components/Table.jsx'
import { Badge } from '../components/Badge.jsx'

export function Services() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const navigate = useNavigate()
  // UI-only convenience — the real boundary is the backend's own
  // requireRole('ADMIN') on the DELETE route (Section 8: never trust the
  // frontend guard alone). This just keeps the button from being shown to
  // someone who'd get a 403 anyway.
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const query = new URLSearchParams({ limit: '100', ...(status && { status }), ...(search && { search }) })
  const { data, loading, error, refetch } = useApi(`/api/admin/services?${query}`)

  async function handleDelete(e, row) {
    e.stopPropagation() // don't also trigger the row's onRowClick navigation
    if (deletingId) return // a delete is already in flight — ignore extra clicks

    const confirmed = window.confirm(
      `Delete "${row.name}"?\n\nThis is permanent and cannot be undone.`,
    )
    if (!confirmed) return

    setDeleteError('')
    setDeletingId(row._id)
    try {
      await api.del(`/api/admin/services/${row._id}`)
      await refetch()
    } catch (err) {
      setDeleteError(err.isTimeout ? 'The request took longer than expected. Please check the list before trying again.' : err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-soft">Services</h1>
          <p className="text-sm text-stone">Content, capabilities and process for each service line.</p>
        </div>
        <Link
          to="/services/new"
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark"
        >
          <Plus size={15} /> New service
        </Link>
      </div>

      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name…"
          className="rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
        >
          <option value="">All statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : (
        <Table
          rows={data.items}
          onRowClick={(row) => navigate(`/services/${row._id}`)}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
            { key: 'displayOrder', header: 'Order' },
            { key: 'updatedAt', header: 'Updated', render: (r) => new Date(r.updatedAt).toLocaleDateString() },
            ...(isAdmin
              ? [
                  {
                    key: 'actions',
                    header: '',
                    render: (r) => (
                      <button
                        onClick={(e) => handleDelete(e, r)}
                        disabled={deletingId === r._id}
                        aria-label={`Delete ${r.name}`}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> {deletingId === r._id ? 'Deleting…' : 'Delete'}
                      </button>
                    ),
                  },
                ]
              : []),
          ]}
        />
      )}
    </div>
  )
}
