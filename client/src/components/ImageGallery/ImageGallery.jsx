import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

/**
 * Editorial masonry gallery with a keyboard-accessible lightbox.
 * Varied image heights come naturally from a CSS column layout rather than
 * a forced uniform grid, keeping original aspect ratios intact.
 */
export default function ImageGallery({ images, lightbox = true }) {
  const [openIndex, setOpenIndex] = useState(null)

  const close = useCallback(() => setOpenIndex(null), [])
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  )
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (openIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openIndex, close, showPrev, showNext])

  const active = openIndex !== null ? images[openIndex] : null

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((img, i) => (
          <Reveal key={img.key ?? img.src} delay={(i % 6) * 0.05} className="mb-4 break-inside-avoid">
            <button
              type="button"
              className="group block w-full overflow-hidden rounded-2xl bg-charcoal focus-visible:outline-2 focus-visible:outline-gold"
              onClick={() => lightbox && setOpenIndex(i)}
              aria-label={`Open image: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading={i < 3 ? 'eager' : 'lazy'}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {lightbox && active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
            aria-label="Close image"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              showPrev()
            }}
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <figure
            className="flex max-h-[85vh] max-w-4xl flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="text-center text-sm text-cream/70">
              {active.project}, {active.client}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              showNext()
            }}
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  )
}
