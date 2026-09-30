import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

/**
 * Image-led service card. Falls back to a dark graphic treatment (no forced
 * event photography) when a service, like Online Marketing, has no
 * representative photograph.
 */
export default function ServiceCard({ service, index = 0 }) {
  const Icon = service.icon

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Link
        to={`/services/${service.slug}`}
        className="group relative flex h-[380px] flex-col justify-end overflow-hidden rounded-3xl sm:h-[440px]"
      >
        {service.cardImage ? (
          <img
            src={service.cardImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 100% at 100% 0%, rgba(249,188,33,0.16) 0%, transparent 55%), linear-gradient(160deg, #241f18 0%, #0a0a0a 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent transition-opacity duration-300 group-hover:from-ink/90" />

        <div className="relative z-10 p-7">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-ink transition-transform duration-300 group-hover:scale-110">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <h3 className="font-display text-2xl font-semibold text-cream">{service.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream/75">{service.cardDescription}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-gold uppercase">
            Explore
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  )
}
