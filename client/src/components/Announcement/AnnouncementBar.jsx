import { X } from 'lucide-react'

/**
 * Fixed-height (h-10) so Navbar can reliably offset below it with a static
 * class rather than a measured height (see Navbar's `hasAnnouncement` prop).
 */
export default function AnnouncementBar({ announcement, onDismiss }) {
  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-10 items-center justify-center gap-3 bg-ink px-4 text-cream">
      <p className="truncate text-sm">
        {announcement.headline && <span className="font-semibold">{announcement.headline} </span>}
        {announcement.message}
      </p>
      {announcement.ctaLabel && announcement.ctaUrl && (
        <a href={announcement.ctaUrl} className="shrink-0 text-sm font-semibold text-gold underline-offset-2 hover:underline">
          {announcement.ctaLabel}
        </a>
      )}
      <button onClick={onDismiss} aria-label="Dismiss announcement" className="absolute right-3 shrink-0 text-cream/70 hover:text-cream">
        <X size={15} />
      </button>
    </div>
  )
}
