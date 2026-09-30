import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { navLinks } from '../../data/nav'
import Button from '../Button/Button'

export default function Navbar({ hasAnnouncement = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const closeTimer = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setMobileServicesOpen(false)
  }, [location.pathname])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isHome = location.pathname === '/'
  const solid = scrolled || !isHome || mobileOpen
  const textColor = solid ? 'text-ink' : 'text-cream'

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setDesktopServicesOpen(true)
  }
  const scheduleCloseServices = () => {
    closeTimer.current = setTimeout(() => setDesktopServicesOpen(false), 150)
  }

  return (
    <>
    <header
      className={`fixed inset-x-0 z-50 transition-colors duration-300 ${hasAnnouncement ? 'top-10' : 'top-0'} ${
        solid ? 'bg-cream/95 shadow-sm backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Triquetra Events home">
          <img
            src="/images/logo/triquetra-logo.png"
            alt="Triquetra Events logo"
            className="h-11 w-11"
          />
          <span className={`font-display text-lg leading-tight font-semibold whitespace-nowrap ${textColor}`}>
            Triquetra Events
            <span className="block text-[0.6rem] font-sans font-semibold tracking-[0.15em] text-gold uppercase">
              Events - Exhibitions - Marketing
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className={`hidden items-center gap-8 lg:flex ${textColor}`}>
          {navLinks.map((item) =>
            item.children ? (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={openServices}
                onMouseLeave={scheduleCloseServices}
              >
                <button
                  className="flex items-center gap-1 py-2 text-sm font-semibold tracking-wide uppercase transition-colors hover:text-gold"
                  aria-haspopup="true"
                  aria-expanded={desktopServicesOpen}
                  onClick={() => setDesktopServicesOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${desktopServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {desktopServicesOpen && (
                  <div
                    className="absolute top-full left-1/2 w-64 -translate-x-1/2 pt-3"
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                  >
                    <ul className="overflow-hidden rounded-2xl border border-line bg-cream py-2 text-ink shadow-xl">
                      {item.children.map((child) => (
                        <li key={child.to}>
                          <Link
                            to={child.to}
                            className="block px-5 py-3 text-sm font-medium transition-colors hover:bg-paper hover:text-gold-dark"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ) : (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `py-2 text-sm font-semibold tracking-wide uppercase transition-colors hover:text-gold ${
                      isActive ? 'text-gold' : ''
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ),
          )}
        </ul>

        <div className="hidden lg:block">
          <Button to="/contact" variant={solid ? 'primary' : 'outline-light'}>
            Talk to Us
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${textColor}`}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      </header>

      {/* Mobile menu: portaled to <body> so header's backdrop-blur (which
          creates a containing block for fixed descendants) can't collapse it */}
      {createPortal(
        <div
          className={`fixed inset-x-0 top-20 bottom-0 z-50 overflow-y-auto bg-cream transition-transform duration-300 lg:hidden ${
            mobileOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
          }`}
        >
        <ul className="container-page flex flex-col gap-1 py-6 text-ink">
          {navLinks.map((item) =>
            item.children ? (
              <li key={item.label} className="border-b border-line py-2">
                <button
                  className="flex w-full items-center justify-between py-3 text-base font-semibold uppercase"
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ${
                    mobileServicesOpen ? 'grid-rows-[1fr] pb-3' : 'grid-rows-[0fr]'
                  }`}
                >
                  <ul className="flex min-h-0 flex-col gap-1 pl-4">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <Link to={child.to} className="block py-2.5 text-sm font-medium text-stone-dark">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={item.to} className="border-b border-line">
                <Link to={item.to} className="block py-4 text-base font-semibold uppercase">
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <div className="container-page pb-10">
          <Button to="/contact" className="w-full justify-center">
            Talk to Us
          </Button>
        </div>
        </div>,
        document.body,
      )}
    </>
  )
}
