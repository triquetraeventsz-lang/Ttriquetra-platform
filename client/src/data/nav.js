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
  // External — the concert has its own separate, already-live site at this
  // domain; this is a plain outbound link, not an internal route.
  { label: 'Concert', href: 'https://triquetraevents.co.in' },
  { label: 'Contact Us', to: '/contact' },
]
