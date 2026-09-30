import Reveal from '../Reveal/Reveal'

export default function EventAnnouncementStrip({ headline, message, ctaLabel, ctaUrl }) {
  if (!headline && !message) return null

  return (
    <section className="bg-ink py-10 text-cream">
      <div className="container-page">
        <Reveal className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <p className="text-sm sm:text-base">
            {headline && <span className="font-semibold text-gold">{headline}</span>}
            {headline && message && ' — '}
            {message}
          </p>
          {ctaLabel && ctaUrl && (
            <a href={ctaUrl} className="shrink-0 text-sm font-semibold underline-offset-2 hover:underline">
              {ctaLabel}
            </a>
          )}
        </Reveal>
      </div>
    </section>
  )
}
