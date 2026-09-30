import { useApi } from '../lib/useApi.js'

const CARD_LABELS = {
  publishedPages: 'Active Pages',
  draftBlogs: 'Draft Blogs',
  publishedBlogs: 'Published Blogs',
  caseStudies: 'Case Studies',
  activeEvents: 'Active Events',
  scheduledCampaignPhases: 'Scheduled Phases',
  recentFormSubmissions: 'Recent Leads',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function Dashboard() {
  const { data, loading, error } = useApi('/api/admin/dashboard/summary')

  if (loading) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Dashboard</h1>
        <p className="text-sm text-stone">A snapshot of the site and its event campaigns.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(CARD_LABELS).map(([key, label]) => (
          <div key={key} className="rounded-xl border border-line bg-cream p-4">
            <p className="text-2xl font-semibold text-ink-soft">{data.cards[key]}</p>
            <p className="text-xs text-stone">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-cream p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-soft">Upcoming Campaigns</h2>
          {data.upcomingCampaigns.length === 0 ? (
            <p className="text-sm text-stone">Nothing scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {data.upcomingCampaigns.map((c, i) => (
                <li key={i} className="text-sm">
                  <p className="font-medium text-ink-soft">{c.phaseName}</p>
                  <p className="text-stone">
                    {c.eventName} · {formatDate(c.scheduledAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-line bg-cream p-5">
          <h2 className="mb-3 text-sm font-semibold text-ink-soft">Recent Activity</h2>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-stone">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((a, i) => (
                <li key={i} className="text-sm">
                  <p className="text-ink-soft">{a.description}</p>
                  <p className="text-stone">
                    {a.user} · {formatDate(a.timestamp)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
