// Central SEO configuration: site-wide business facts plus per-page
// title/description pairs. Every field here is either the real, already
//-published Triquetra Events content (see siteContent.js) or a concise,
// human-first summary of it. No claims, stats or pages are invented.

export const SITE_URL = 'https://triquetraevents.co.in'
export const SITE_NAME = 'Triquetra Events'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/gallery/world-of-concrete-ambuja/3.jpg`

// Used for the sitewide Organization/ProfessionalService structured data,
// injected once per page by the SEO component.
export const organization = {
  name: 'Triquetra Events',
  legalName: 'Triquetra Events, Exhibitions & Marketing',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo/triquetra-logo.png`,
  email: 'hello@triquetraevents.co.in',
  telephone: '+91-8800119668',
  address: {
    streetAddress: 'H NO. 18, BLOCK G ADARSH NAGAR, SECTOR 9, Khora Colony',
    addressLocality: 'Ghaziabad',
    addressRegion: 'Uttar Pradesh',
    postalCode: '201020',
    addressCountry: 'IN',
  },
  // Only accounts that were actually supplied and verified.
  sameAs: [
    'https://www.instagram.com/triquetraeve?igsh=Y24yMjI4YWdodW9z',
    'https://www.linkedin.com/company/triquetraeem/',
  ],
}

// path -> { title, description }. Titles stay close to "Primary topic |
// Triquetra Events"; descriptions are unique per page and written for
// people first.
export const pageSeo = {
  '/': {
    title: 'Triquetra Events | Event Management & Brand Experiences',
    description:
      'Triquetra Events is an event management and experiential marketing company in Ghaziabad, delivering events, brand activations, MICE and online marketing across India.',
  },
  '/about': {
    title: 'About Triquetra Events | Event & Experiential Marketing Company',
    description:
      'Learn how Triquetra Events plans and executes exhibitions, events and brand activations, and the values behind every project.',
  },
  '/services': {
    title: 'Event & Experiential Marketing Services | Triquetra Events',
    description:
      'Explore Triquetra Events’ four service areas: events, brand activation, MICE and online marketing, each run by the same skilled team.',
  },
  '/services/events': {
    title: 'Event Management Services | Triquetra Events',
    description:
      'Corporate events, product launches, conferences and trade shows planned and executed end to end by Triquetra Events.',
  },
  '/services/brand-activation': {
    title: 'Brand Activation & Experiential Marketing | Triquetra Events',
    description:
      'Triquetra Events designs experiential campaigns and on-ground brand activations that put your brand in front of a real audience.',
  },
  '/services/mice': {
    title: 'MICE & Exhibition Management Services | Triquetra Events',
    description:
      'Meetings, incentives, conferences and exhibitions handled end to end by Triquetra Events, from planning through on-ground execution.',
  },
  '/services/online-marketing': {
    title: 'Online Marketing Services | Triquetra Events',
    description:
      'Paid advertising, SEO and social media management from Triquetra Events, run alongside your events rather than as a separate workstream.',
  },
  '/how-we-work': {
    title: 'How We Work | Triquetra Events',
    description:
      'The transparent, deal-oriented workflow Triquetra Events follows on every project, from strategic manpower to non-negotiable quality checks.',
  },
  '/contact': {
    title: 'Contact Triquetra Events | Event Management & Experiences',
    description:
      'Get in touch with Triquetra Events in Ghaziabad, Uttar Pradesh, to discuss an upcoming event, activation or MICE programme.',
  },
  '/case-studies': {
    title: 'Case Studies | Triquetra Events',
    description:
      'Recent exhibition and event work by Triquetra Events, including builds for Ambuja, BRUGG Rittmeyer, Cropino and more.',
  },
}

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path === '/' ? '' : path}`
}
