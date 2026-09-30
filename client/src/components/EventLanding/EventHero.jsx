import { motion } from 'framer-motion'
import Button from '../Button/Button'

export default function EventHero({ headline, message, image, ctaLabel, ctaUrl }) {
  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink pt-28 pb-20 text-cream">
      {image ? (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-50" loading="eager" />
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
          className="max-w-2xl"
        >
          <h1 className="text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">{headline}</h1>
          {message && <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">{message}</p>}
          {ctaLabel && ctaUrl && (
            <Button href={ctaUrl} className="mt-8">
              {ctaLabel}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
