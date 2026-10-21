import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'

const CONCERT_URL = 'https://concert.triquetraevents.co.in'

function getFocusable(container) {
  return Array.from(container?.querySelectorAll('button, a[href]') ?? [])
}

/**
 * Premium, cinematic promo for the separate concert site — content and
 * destination are given verbatim by the brief, not invented here. Visual
 * treatment is CSS gradients only (no concert photography exists in this
 * project, and none is borrowed from the separate concert repo).
 */
export default function ConcertPromoModal({ open, onDismiss, onConfirm }) {
  const headingId = useId()
  const descId = useId()
  const dialogRef = useRef(null)
  const portalRootRef = useRef(null)
  const previouslyFocused = useRef(null)
  const prefersReducedMotion = useReducedMotion()
  const fadeDuration = prefersReducedMotion ? 0.15 : 0.3
  const dialogDuration = prefersReducedMotion ? 0.15 : 0.4

  // Focus management, Escape, Tab-cycling, and the scroll lock. Declared
  // before the inert effect below so that by the time background content
  // is made inert, focus has already moved into the dialog (nothing
  // inside the soon-to-be-inert tree is focused, so no forced blur).
  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement
    dialogRef.current?.focus()
    lockScroll()

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onDismiss()
        return
      }
      if (e.key !== 'Tab') return

      const focusable = getFocusable(dialogRef.current)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      // Initial focus lands on the dialog container itself (tabIndex=-1),
      // which isn't one of the tracked `focusable` elements — handle that
      // starting state explicitly in both directions, rather than relying
      // on the browser's native tab order to happen to land correctly.
      const onContainer = document.activeElement === dialogRef.current

      if (e.shiftKey) {
        if (onContainer || document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else if (onContainer || document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      unlockScroll()
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus()
      }
    }
  }, [open, onDismiss])

  // Hides the rest of the page from assistive tech while open — Tab-key
  // users are already contained by the handler above, but a screen
  // reader's browse-mode/virtual cursor isn't governed by Tab at all.
  // `inert` is a native DOM property (no dependency needed) and restores
  // each sibling's own prior value on close, rather than assuming it was
  // always `false` before.
  useEffect(() => {
    if (!open) return

    const root = portalRootRef.current
    const siblings = Array.from(document.body.children).filter((el) => el !== root)
    const previouslyInert = siblings.map((el) => el.inert)

    siblings.forEach((el) => {
      el.inert = true
    })

    return () => {
      siblings.forEach((el, i) => {
        el.inert = previouslyInert[i]
      })
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={portalRootRef}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={descId}
            tabIndex={-1}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 text-cream shadow-2xl focus:outline-none"
            style={{
              background:
                'radial-gradient(120% 120% at 20% 0%, rgba(124,16,45,0.55) 0%, transparent 55%), radial-gradient(100% 100% at 100% 100%, rgba(249,188,33,0.12) 0%, transparent 60%), linear-gradient(160deg, #0a0a0a 0%, #1a0608 55%, #0a0a0a 100%)',
            }}
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.94, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.96, y: prefersReducedMotion ? 0 : 10 }}
            transition={{ duration: dialogDuration, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: 'conic-gradient(from 200deg at 30% -10%, rgba(249,188,33,0.18), transparent 35%)' }}
            />

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-cream/80 transition-colors hover:border-gold hover:text-gold"
            >
              <X size={16} />
            </button>

            <div className="relative px-7 py-12 text-center sm:px-10 sm:py-14">
              <span className="text-xs font-semibold tracking-[0.3em] text-gold uppercase">The Countdown Begins</span>

              <h2 id={headingId} className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                The Stage Is Set. Are You Ready?
              </h2>

              <p id={descId} className="mt-4 text-sm leading-relaxed text-cream/70 sm:text-base">
                Get ready for an unforgettable live music experience. Discover the upcoming concert and explore the
                details.
              </p>

              <div className="mt-8 flex flex-col items-center gap-4">
                <a
                  href={CONCERT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onConfirm}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gold px-8 py-3.5 text-sm font-semibold tracking-wide text-ink uppercase transition-colors duration-300 hover:bg-gold-dark sm:w-auto"
                >
                  Explore the Concert
                </a>
                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-sm font-medium text-cream/60 underline-offset-4 transition-colors hover:text-cream hover:underline"
                >
                  Maybe Later
                </button>
              </div>

              <p className="mt-8 text-[0.65rem] font-semibold tracking-[0.25em] text-cream/40 uppercase">
                A Triquetra Events Experience
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
