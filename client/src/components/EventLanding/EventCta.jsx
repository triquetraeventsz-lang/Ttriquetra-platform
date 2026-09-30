import Reveal from '../Reveal/Reveal'
import Button from '../Button/Button'

export default function EventCta({ headline, ctaLabel, ctaUrl }) {
  if (!ctaLabel || !ctaUrl) return null

  return (
    <section className="bg-ink py-20 text-cream sm:py-24">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          {headline && <h2 className="text-3xl leading-tight font-semibold sm:text-4xl">{headline}</h2>}
          <Button href={ctaUrl} className="mt-2">
            {ctaLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
