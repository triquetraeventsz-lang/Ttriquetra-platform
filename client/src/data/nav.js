import { services } from './services'

// Primary navigation. Case Studies is intentionally left out of this array
// so it stays hidden from the visible navbar; the route still exists at
// /case-studies (see App.jsx) and can be added back here later.
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  {
    label: 'Services',
    to: '/services',
    children: services.map((s) => ({ label: s.title, to: `/services/${s.slug}` })),
  },
  { label: 'How We Work', to: '/how-we-work' },
  // External — the concert has its own separate, already-live site on this
  // subdomain; this is a plain outbound link, not an internal route. Must
  // stay on the "concerts." subdomain (plural), not the bare corporate
  // domain, or it just sends visitors back to this site's own homepage.
  { label: 'Concert', href: 'https://concerts.triquetraevents.co.in/' },
  { label: 'Contact Us', to: '/contact' },
]
