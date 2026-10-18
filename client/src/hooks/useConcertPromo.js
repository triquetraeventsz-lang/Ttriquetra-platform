import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY = 'triquetra_concert_promo_seen'
const SHOW_DELAY_MS = 800

function wasAlreadySeen() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // Storage can throw in private browsing / blocked-storage contexts —
    // fail open (show it) rather than break the page, same reasoning as
    // useAnnouncement's own storage reads.
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // If storage is blocked, worst case it can show again later this
    // "session" — not worth failing the interaction over.
  }
}

/**
 * Shows the concert promo once per browser session, only while the
 * homepage is the active route, after a short delay. Leaving the
 * homepage before the delay elapses cancels the pending show — it should
 * never pop up on an inner page, and never re-show once dismissed.
 */
export function useConcertPromo() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname !== '/' || wasAlreadySeen()) return

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS)
    return () => clearTimeout(timer)
  }, [pathname])

  // Stable identities — ConcertPromoModal's own effect depends on
  // `onDismiss`, and an unstable function there would make that effect
  // tear down and rebuild (resetting focus/scroll-lock/keydown listener)
  // on every unrelated AppShell re-render while the modal happens to be
  // open, not just on actual open/close.
  const dismiss = useCallback(() => {
    markSeen()
    setOpen(false)
  }, [])

  const confirm = useCallback(() => {
    markSeen()
    setOpen(false)
  }, [])

  return { open, dismiss, confirm }
}
