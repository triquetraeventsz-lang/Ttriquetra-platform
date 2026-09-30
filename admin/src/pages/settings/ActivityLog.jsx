import { useState } from 'react'
import { useApi } from '../../lib/useApi.js'
import { Table } from '../../components/Table.jsx'

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function ActivityLog() {
  const [page, setPage] = useState(1)
  const { data, loading, error } = useApi(`/api/admin/activity-log?page=${page}&limit=30`)

  if (loading) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Activity Log</h1>
        <p className="text-sm text-stone">A read-only record of admin actions across the platform.</p>
      </div>

      <Table
        rows={data.items}
        columns={[
          { key: 'user', header: 'User', render: (a) => a.userId?.name || a.userId?.email || 'Unknown' },
          { key: 'description', header: 'Action' },
          { key: 'timestamp', header: 'When', render: (a) => formatDate(a.timestamp) },
        ]}
      />

      {data.pages > 1 && (
        <div className="flex items-center gap-3 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-stone">
            Page {data.page} of {data.pages}
          </span>
          <button
            disabled={page >= data.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-line px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
