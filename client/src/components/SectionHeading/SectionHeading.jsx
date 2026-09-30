import Reveal from '../Reveal/Reveal'

/**
 * Consistent section header: small gold eyebrow, large serif heading,
 * optional supporting copy. `align` controls text alignment; `dark` swaps
 * to light text for use on dark section backgrounds.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  dark = false,
  className = '',
}) {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'

  return (
    <Reveal className={`flex max-w-2xl flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{eyebrow}</span>
      )}
      {title && (
        <h2
          className={`text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl ${dark ? 'text-cream' : 'text-ink'}`}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className={`text-base leading-relaxed sm:text-lg ${dark ? 'text-cream/70' : 'text-stone-dark'}`}>
          {description}
        </p>
      )}
    </Reveal>
  )
}
