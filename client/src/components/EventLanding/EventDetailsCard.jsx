import { Calendar, MapPin } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

/**
 * Only renders the fields that are actually set — venue/date are routinely
 * unset during a teaser phase, and this must never show a placeholder or
 * invented value (standing project rule).
 */
export default function EventDetailsCard({ venue, city, eventDate, eventTime }) {
  const dateLabel = eventDate ? new Date(eventDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : null
  const place = [venue, city].filter(Boolean).join(', ')

  if (!dateLabel && !eventTime && !place) return null

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-xl flex-col gap-4 rounded-3xl border border-line bg-white p-8 sm:flex-row sm:justify-center sm:gap-10">
          {(dateLabel || eventTime) && (
            <div className="flex items-center gap-3 text-sm text-stone-dark">
              <Calendar className="h-4 w-4 shrink-0 text-gold" />
              <span>
                {dateLabel}
                {dateLabel && eventTime && ' · '}
                {eventTime}
              </span>
            </div>
          )}
          {place && (
            <div className="flex items-center gap-3 text-sm text-stone-dark">
              <MapPin className="h-4 w-4 shrink-0 text-gold" />
              <span>{place}</span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
