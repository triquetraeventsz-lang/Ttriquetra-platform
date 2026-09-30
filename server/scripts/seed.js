// One-off seed for Pages, Navigation and SiteSettings, mirroring what the
// public site (`client/`) actually looks like today, so the Phase 2 admin
// UI has real, meaningful data to manage instead of an empty state.
// Safe to re-run — skips anything that already exists.

import { connectDB, disconnectDB } from '../src/config/db.js'
import Page from '../src/models/Page.js'
import Navigation from '../src/models/Navigation.js'
import SiteSettings from '../src/models/SiteSettings.js'

const pages = [
  { name: 'Home', slug: 'home', title: 'Triquetra Events | Event Management & Brand Experiences' },
  { name: 'About', slug: 'about', title: 'About Triquetra Events | Event & Experiential Marketing Company' },
  { name: 'Services', slug: 'services', title: 'Event & Experiential Marketing Services | Triquetra Events' },
  { name: 'Brand Activation', slug: 'brand-activation', title: 'Brand Activation & Experiential Marketing | Triquetra Events' },
  { name: 'Events', slug: 'events', title: 'Event Management Services | Triquetra Events' },
  { name: 'MICE', slug: 'mice', title: 'MICE & Exhibition Management Services | Triquetra Events' },
  { name: 'Online Marketing', slug: 'online-marketing', title: 'Online Marketing Services | Triquetra Events' },
  { name: 'How We Work', slug: 'how-we-work', title: 'How We Work | Triquetra Events' },
  { name: 'Contact', slug: 'contact', title: 'Contact Triquetra Events | Event Management & Experiences' },
  {
    name: 'Case Studies',
    slug: 'case-studies',
    title: 'Case Studies | Triquetra Events',
    showInNavigation: false, // matches client/src/data/nav.js today
  },
  { name: 'Blogs', slug: 'blogs', title: 'Blog | Triquetra Events', status: 'INACTIVE' }, // arrives with Phase 3
]

const navigationDoc = {
  items: [
    { label: 'Home', to: '/', order: 0, enabled: true, children: [] },
    { label: 'About Us', to: '/about', order: 1, enabled: true, children: [] },
    {
      label: 'Services',
      to: '/services',
      order: 2,
      enabled: true,
      children: [
        { label: 'Brand Activation', to: '/services/brand-activation', order: 0, enabled: true },
        { label: 'Events', to: '/services/events', order: 1, enabled: true },
        { label: 'MICE', to: '/services/mice', order: 2, enabled: true },
        { label: 'Online Marketing', to: '/services/online-marketing', order: 3, enabled: true },
      ],
    },
    { label: 'How We Work', to: '/how-we-work', order: 3, enabled: true, children: [] },
    { label: 'Contact Us', to: '/contact', order: 4, enabled: true, children: [] },
  ],
  ctaLabel: 'Talk to Us',
  ctaUrl: '/contact',
}

const siteSettingsDoc = {
  siteTitle: 'Triquetra Events',
  defaultDescription:
    'Triquetra Events is an event management and experiential marketing company in Ghaziabad, delivering events, brand activations, MICE and online marketing across India.',
  defaultOgImage: '/images/gallery/world-of-concrete-ambuja/3.jpg',
  canonicalDomain: 'https://triquetraevents.co.in',
  organizationName: 'Triquetra Events',
  organizationLogo: '/images/logo/triquetra-logo.png',
  organizationAddress: 'H NO. 18, BLOCK G ADARSH NAGAR, SECTOR 9, Khora Colony, Ghaziabad, Uttar Pradesh, 201020',
  organizationPhone: '+91 8800119668',
  organizationEmail: 'hello@triquetraevents.co.in',
  socialLinks: {
    instagram: 'https://www.instagram.com/triquetraeve?igsh=Y24yMjI4YWdodW9z',
    linkedin: 'https://www.linkedin.com/company/triquetraeem/',
  },
}

async function run() {
  await connectDB()

  let created = 0
  for (const page of pages) {
    const existing = await Page.findOne({ slug: page.slug })
    if (!existing) {
      await Page.create({ status: 'ACTIVE', visible: true, showInNavigation: true, indexable: true, ...page })
      created++
    }
  }
  console.log(`Pages: ${created} created, ${pages.length - created} already existed.`)

  const navExists = await Navigation.findOne()
  if (!navExists) {
    await Navigation.create(navigationDoc)
    console.log('Navigation: seeded.')
  } else {
    console.log('Navigation: already exists, left untouched.')
  }

  const settingsExists = await SiteSettings.findOne()
  if (!settingsExists) {
    await SiteSettings.create(siteSettingsDoc)
    console.log('SiteSettings: seeded.')
  } else {
    console.log('SiteSettings: already exists, left untouched.')
  }

  await disconnectDB()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
