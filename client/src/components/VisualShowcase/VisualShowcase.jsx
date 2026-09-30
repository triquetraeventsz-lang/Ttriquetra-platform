import Reveal from '../Reveal/Reveal'

/**
 * Asymmetric editorial bento grid: a large feature image alongside smaller
 * supporting shots, each item controlling its own span/aspect ratio via
 * `className`. Deliberately not a uniform Instagram-style grid.
 */
export default function VisualShowcase({ items }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-6">
      {items.map((item, i) => (
        <Reveal key={item.src} delay={(i % 5) * 0.06} className={item.span}>
          <div className={`group h-full overflow-hidden rounded-2xl bg-charcoal ${item.aspect}`}>
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </Reveal>
      ))}
    </div>
  )
}
