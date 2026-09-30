import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Compass,
  Newspaper,
  BookOpen,
  HelpCircle,
  Image,
  CalendarDays,
  Megaphone,
  Search,
  Users,
  Settings,
  History,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const SECTIONS = [
  {
    label: null,
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Website',
    items: [
      { to: '/pages', label: 'Pages', icon: FileText },
      { to: '/navigation', label: 'Navigation', icon: Compass },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/services', label: 'Services', icon: Compass },
      { to: '/blogs', label: 'Blogs', icon: Newspaper },
      { to: '/case-studies', label: 'Case Studies', icon: BookOpen },
      { to: '/faqs', label: 'FAQs', icon: HelpCircle },
      { to: '/media', label: 'Media', icon: Image },
    ],
  },
  {
    label: 'Events',
    items: [
      { to: '/events', label: 'All Events', icon: CalendarDays },
      { to: '/announcement', label: 'Announcement', icon: Megaphone },
    ],
  },
  {
    label: null,
    items: [{ to: '/seo', label: 'SEO', icon: Search, adminOnly: true }],
  },
  {
    label: 'Settings',
    items: [
      { to: '/settings/users', label: 'Users', icon: Users, adminOnly: true },
      { to: '/settings/site', label: 'Site Settings', icon: Settings, adminOnly: true },
      { to: '/settings/activity-log', label: 'Activity Log', icon: History },
    ],
  },
]

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-cream">
      <div className="px-5 py-5">
        <p className="font-display text-lg font-semibold text-ink-soft">Triquetra</p>
        <p className="text-xs uppercase tracking-wide text-stone">Admin</p>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-5">
        {SECTIONS.map((section, i) => {
          const items = section.items.filter((item) => !item.adminOnly || user?.role === 'ADMIN')
          if (items.length === 0) return null
          return (
            <div key={i}>
              {section.label && (
                <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-stone">{section.label}</p>
              )}
              <div className="space-y-0.5">
                {items.map(({ to, label, icon: Icon, comingSoon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        isActive ? 'bg-gold/15 text-gold-dark font-medium' : 'text-ink-soft hover:bg-paper'
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span className="flex-1">{label}</span>
                    {comingSoon && <span className="text-[10px] uppercase text-stone">soon</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
