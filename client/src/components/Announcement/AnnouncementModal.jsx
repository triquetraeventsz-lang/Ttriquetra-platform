import { X } from 'lucide-react'
import Button from '../Button/Button'

export default function AnnouncementModal({ announcement, onDismiss }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-8 text-center">
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 text-stone hover:text-ink"
        >
          <X size={18} />
        </button>
        {announcement.headline && (
          <h2 className="font-display text-2xl font-semibold text-ink">{announcement.headline}</h2>
        )}
        {announcement.message && <p className="mt-3 text-sm leading-relaxed text-stone-dark">{announcement.message}</p>}
        {announcement.ctaLabel && announcement.ctaUrl && (
          <Button href={announcement.ctaUrl} className="mt-6 justify-center">
            {announcement.ctaLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
