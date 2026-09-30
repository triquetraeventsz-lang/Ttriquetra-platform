import { createContext, useContext, useEffect, useState } from 'react'

const FooterVisibilityContext = createContext(null)

/**
 * Lets a page (currently only EventLanding, via its `sections.footer`
 * toggle) hide the global Footer even though Footer is rendered by App.jsx
 * as a sibling of <Routes>, not a child of the page itself.
 */
export function FooterVisibilityProvider({ children }) {
  const [visible, setVisible] = useState(true)
  return <FooterVisibilityContext.Provider value={{ visible, setVisible }}>{children}</FooterVisibilityContext.Provider>
}

export function useFooterVisibility() {
  return useContext(FooterVisibilityContext)
}

/** Call from a page to hide the footer while mounted; restores it on unmount/navigation. */
export function useSetFooterVisible(visible) {
  const ctx = useFooterVisibility()
  useEffect(() => {
    ctx?.setVisible(visible)
    return () => ctx?.setVisible(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
}
