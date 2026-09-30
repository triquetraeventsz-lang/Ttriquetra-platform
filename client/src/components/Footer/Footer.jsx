import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { navLinks } from '../../data/nav'
import { services } from '../../data/services'
import { brand, contact } from '../../data/siteContent'

// lucide-react dropped brand/logo icons; these are plain stroke-style SVGs
// drawn to match the same visual weight as the lucide icons around them.
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  const primaryLinks = navLinks.filter((item) => !item.children)

  return (
    <footer className="bg-ink text-cream">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo/triquetra-logo.png" alt="Triquetra Events logo" className="h-10 w-10" />
            <span className="font-display text-lg font-semibold">{brand.name}</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-cream/60">{brand.tagline}</p>
          <div className="flex items-center gap-3">
            {contact.socialLinks.instagram && (
              <a
                href={contact.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Triquetra Events on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {contact.socialLinks.linkedin && (
              <a
                href={contact.socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="Triquetra Events on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-gold hover:text-gold"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Navigate</h3>
          <ul className="flex flex-col gap-3 text-sm text-cream/70">
            {primaryLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-underline hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Services</h3>
          <ul className="flex flex-col gap-3 text-sm text-cream/70">
            {services.map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="link-underline hover:text-cream">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] text-gold uppercase">Contact</h3>
          <ul className="flex flex-col gap-4 text-sm text-cream/70">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{contact.headOffice.lines.join(', ')}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{contact.phones.join(' / ')}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${contact.email}`} className="link-underline hover:text-cream">
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/50 sm:flex-row">
          <span>&copy; {year} {brand.name}. All rights reserved.</span>
          <span>GSTIN: {brand.gstin}</span>
        </div>
      </div>
    </footer>
  )
}
