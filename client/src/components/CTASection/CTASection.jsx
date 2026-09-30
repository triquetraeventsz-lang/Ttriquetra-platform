import Reveal from '../Reveal/Reveal'
import Button from '../Button/Button'
import { closing } from '../../data/siteContent'

export default function CTASection({
  eyebrow = closing.eyebrow,
  title,
  body = closing.body,
  ctaLabel = 'Talk to Us',
  ctaTo = '/contact',
}) {
  return (
    <section className="bg-ink py-24 text-cream sm:py-28">
      <div className="container-page">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          {eyebrow && (
            <span className="text-xs font-semibold tracking-[0.25em] text-gold uppercase">{eyebrow}</span>
          )}
          {title && (
            <h2 className="text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl">{title}</h2>
          )}
          {body && <p className="text-base leading-relaxed text-cream/70 sm:text-lg">{body}</p>}
          <Button to={ctaTo} className="mt-2">
            {ctaLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
