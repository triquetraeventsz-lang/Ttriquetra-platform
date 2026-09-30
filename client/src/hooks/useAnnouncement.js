import { useEffect, useState } from 'react'
import { getActiveAnnouncement } from '../lib/api'

const DAY_MS = 24 * 60 * 60 * 1000

function wasRecentlyDismissed(id, frequency) {
  try {
    if (frequency === 'once-per-session') {
      return sessionStorage.getItem(`triquetra_announcement_${id}`) === 'dismissed'
    }
    if (frequency === 'once-per-day') {
      const at = Number(localStorage.getItem(`triquetra_announcement_${id}`))
      return at && Date.now() - at < DAY_MS
    }
  } catch {
    // Storage can throw in private browsing / blocked-storage contexts —
    // fail open (show the announcement) rather than break the page.
  }
  return false
}

function persistDismissal(id, frequency) {
  try {
    if (frequency === 'once-per-session') sessionStorage.setItem(`triquetra_announcement_${id}`, 'dismissed')
    if (frequency === 'once-per-day') localStorage.setItem(`triquetra_announcement_${id}`, String(Date.now()))
  } catch {
    // Same as above — a failed write just means it may show again sooner.
  }
}

/**
 * Fetches the site-wide announcement once and tracks its dismissal
 * according to its own `frequency` setting. `always` never persists a
 * dismissal, so it reappears on the next full page load.
 */
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    getActiveAnnouncement()
      .then((data) => {
        if (data && !wasRecentlyDismissed(data._id, data.frequency)) setAnnouncement(data)
      })
      .catch(() => {})
  }, [])

  function dismiss() {
    if (announcement) persistDismissal(announcement._id, announcement.frequency)
    setDismissed(true)
  }

  return { announcement: dismissed ? null : announcement, dismiss }
}
