import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useApi } from '../lib/useApi.js'
import { Table } from '../components/Table.jsx'
import { Badge } from '../components/Badge.jsx'

export function Events() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const query = new URLSearchParams({ limit: '50', ...(status && { status }), ...(search && { search }) })
  const { data, loading, error } = useApi(`/api/admin/events?${query}`)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-soft">Events</h1>
          <p className="text-sm text-stone">Event campaigns, from teaser to reveal.</p>
        </div>
        <Link
          to="/events/new"
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark"
        >
          <Plus size={15} /> New event
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
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : (
        <Table
          rows={data.items}
          onRowClick={(row) => navigate(`/events/${row._id}`)}
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'status', header: 'Status', render: (r) => <Badge>{r.status}</Badge> },
            {
              key: 'visibility',
              header: 'Visible On',
              render: (r) => (
                <div className="flex gap-1.5">
                  {r.landingPageEnabled && <Badge tone="gold">Landing Page</Badge>}
                  {r.mainWebsiteEnabled && <Badge tone="gold">Main Site</Badge>}
                  {!r.landingPageEnabled && !r.mainWebsiteEnabled && <Badge tone="gray">Hidden</Badge>}
                </div>
              ),
            },
            {
              key: 'eventDate',
              header: 'Event Date',
              render: (r) => (r.eventDate ? new Date(r.eventDate).toLocaleDateString() : '—'),
            },
          ]}
        />
      )}
    </div>
  )
}
