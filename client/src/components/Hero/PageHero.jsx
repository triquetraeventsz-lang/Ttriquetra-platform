import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

/**
 * Interior-page hero: dark band with eyebrow, large serif title and
 * optional supporting copy, used across About / Services / How We Work /
 * Contact / Case Studies for a consistent premium entrance.
 *
 * `breadcrumb`, when passed, is an array of {label, to} trailing to the
 * current page (last item is not linked) and doubles as the visible
 * counterpart to the page's BreadcrumbList structured data.
 */
export default function PageHero({ eyebrow, title, description, image, breadcrumb }) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden bg-ink pt-28 pb-16 text-cream">
      {image ? (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-35" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        </div>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 70% at 80% 20%, rgba(249,188,33,0.16) 0%, transparent 60%), radial-gradient(50% 60% at 10% 100%, rgba(249,188,33,0.08) 0%, transparent 60%)',
          }}
        />
      )}
      <div className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {breadcrumb && breadcrumb.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-cream/50">
                {breadcrumb.map((item, i) => (
                  <li key={item.to ?? item.label} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {i === breadcrumb.length - 1 || !item.to ? (
                      <span className="text-cream/70" aria-current="page">
                        {item.label}
                      </span>
                    ) : (
                      <Link to={item.to} className="hover:text-cream">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <span className="mb-4 inline-block text-xs font-semibold tracking-[0.25em] text-gold uppercase">
              {eyebrow}
            </span>
          )}
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">{description}</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
