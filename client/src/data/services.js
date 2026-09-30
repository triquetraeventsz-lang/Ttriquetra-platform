import { Megaphone, PartyPopper, Sparkles, Building2 } from 'lucide-react'

// Central service data, used by the navbar, the services overview page,
// service cards, and each dedicated service page. Every capability and
// process step here is drawn directly from Triquetra Events: the company
// profile's "Services Offered" table and "How We Work" section, plus the
// digital marketing scope (SEO, social media, paid ads) confirmed directly,
// each organised per service instead of repeating one generic sequence.

export const services = [
  {
    slug: 'brand-activation',
    title: 'Brand Activation',
    pageTitle: 'Brand Activation & Experiential Marketing',
    icon: Sparkles,
    tagline: 'Experiential campaigns that put a brand in front of its audience.',
    cardDescription: 'Experiential campaigns and on-ground engagement, built to be memorable.',
    intro:
      'Brand activation is where Triquetra Events turns a brand message into an experience: experiential campaigns, on-ground promotions and consumer engagement designed with the same precision behind every project.',
    capabilities: [
      { title: 'Experiential Campaigns', description: 'Concept-to-execution campaigns built around a brand experience.' },
      { title: 'On-Ground Promotions', description: 'Direct, in-person promotional activity where audiences already are.' },
      { title: 'Consumer Engagement', description: 'Interactions designed to captivate, connect and convert.' },
    ],
    cardImage: '/images/gallery/intimasia-magpie/1.jpg',
    heroImage: '/images/gallery/world-food-india-swadgram/1.jpg',
    processTitle: 'Brand to Experience',
    process: [
      { title: 'Brand Understanding', description: 'Every activation starts with the message a brand needs to carry.' },
      { title: 'Activation Concept', description: 'Concept-to-execution campaigns built around a brand experience.' },
      { title: 'Experience Design', description: 'Our DeliDESIGN language fuses modern aesthetics with cultural authenticity.' },
      { title: 'On-Ground Execution', description: 'Direct, in-person promotional activity where audiences already are.' },
      { title: 'Engagement', description: 'Interactions designed to captivate, connect and convert.' },
    ],
    showGallery: true,
    galleryImages: [
      '/images/gallery/intimasia-magpie/1.jpg',
      '/images/gallery/intimasia-magpie/3.jpg',
      '/images/gallery/world-food-india-swadgram/1.jpg',
      '/images/gallery/world-of-concrete-ambuja/1.jpg',
    ],
  },
  {
    slug: 'events',
    title: 'Events',
    pageTitle: 'Event Management',
    icon: PartyPopper,
    tagline: 'From exhibition stalls to full-scale corporate events.',
    cardDescription: 'Corporate events, launches, conferences and trade shows, concept to execution.',
    intro:
      'Events sit at the centre of what Triquetra Events builds: corporate events, product launches, conferences and trade shows, alongside the exhibition stands that carry a brand through the show floor.',
    capabilities: [
      { title: 'Corporate Events', description: 'Planning and on-ground management for corporate gatherings.' },
      { title: 'Product Launches', description: 'Launch events built around precision timing and brand presentation.' },
      { title: 'Conferences', description: 'End-to-end coordination for conference-scale programmes.' },
      { title: 'Trade Shows', description: 'Presence and execution across trade show environments.' },
      { title: 'Booth Design & Layout Planning', description: 'Stands designed around the DeliDESIGN language and planned for footfall.' },
      { title: 'Fabrication', description: 'On-site build and finish, delivered on schedule.' },
      { title: 'Attendee Engagement', description: 'Spaces designed to hold attention and drive real engagement.' },
    ],
    cardImage: '/images/gallery/world-of-concrete-ambuja/1.jpg',
    heroImage: '/images/gallery/world-of-concrete-ambuja/1.jpg',
    processTitle: 'From Concept to Execution',
    process: [
      { title: 'Brief', description: 'Every event starts with the brief: the audience, the objective, the outcome that matters.' },
      { title: 'Concept & Design', description: 'Stands and spaces designed around the DeliDESIGN language, planned for footfall.' },
      { title: 'Planning', description: 'Manpower, logistics and costing locked in with full transparency. Zero guesswork.' },
      { title: 'Production', description: 'On-site build and finish, delivered on schedule.' },
      { title: 'Execution', description: 'Doors open on time. Spaces built to hold attention and drive real engagement.' },
      { title: 'Post-Event', description: 'Quality checks across every touchpoint: man, machine, material and message.' },
    ],
    showGallery: true,
    galleryImages: [
      '/images/gallery/world-of-concrete-ambuja/1.jpg',
      '/images/gallery/world-of-concrete-ambuja/3.jpg',
      '/images/gallery/aahar-cropino/2.jpg',
      '/images/gallery/aahar-cropino/3.jpg',
      '/images/gallery/world-food-india-swadgram/1.jpg',
      '/images/gallery/ifat-sawas/3.jpg',
    ],
  },
  {
    slug: 'mice',
    title: 'MICE',
    pageTitle: 'MICE & Exhibition Management',
    icon: Building2,
    tagline: 'Meetings, Incentives, Conferences and Exhibitions.',
    cardDescription: 'Meetings, incentive travel, conferences and exhibitions, handled end to end.',
    intro:
      'MICE brings together the full range of Triquetra Events’ execution capability: expert handling of meetings, incentive travel, conferences and exhibitions, delivered with the same precision and transparent workflow across every engagement.',
    capabilities: [
      { title: 'Meetings', description: 'Coordinated planning and on-ground execution for business meetings.' },
      { title: 'Incentives', description: 'Expert handling of incentive travel programmes.' },
      { title: 'Conferences', description: 'Full conference planning, coordination and delivery.' },
      { title: 'Exhibitions', description: 'Exhibition stands and floor presence, from booth design to attendee engagement.' },
    ],
    cardImage: '/images/gallery/ifat-sawas/3.jpg',
    heroImage: '/images/gallery/alucast-aakar/3.jpg',
    processTitle: 'Objective to Execution',
    process: [
      { title: 'Objective', description: 'Meetings, incentive travel, conferences or exhibitions: each starts with a clear objective.' },
      { title: 'Planning', description: 'Costing and coordination, planned with zero guesswork.' },
      { title: 'Venue & Logistics', description: 'Strategic manpower, from execution and design to logistics, for every need.' },
      { title: 'Experience Design', description: 'Exhibition stands and floor presence, from booth design to attendee engagement.' },
      { title: 'Production & Execution', description: 'Delivered with clockwork accuracy. No delays, no excuses.' },
    ],
    showGallery: true,
    galleryImages: [
      '/images/gallery/ifat-sawas/1.jpg',
      '/images/gallery/ifat-sawas/2.jpg',
      '/images/gallery/ifat-sawas/3.jpg',
      '/images/gallery/alucast-aakar/1.jpg',
      '/images/gallery/alucast-aakar/2.jpg',
      '/images/gallery/alucast-aakar/3.jpg',
      '/images/gallery/ifat-brugg-rittmeyer/2.jpg',
      '/images/gallery/ifat-brugg-rittmeyer/3.jpg',
    ],
  },
  {
    slug: 'online-marketing',
    title: 'Online Marketing',
    pageTitle: 'Online Marketing',
    icon: Megaphone,
    tagline: 'Ads, SEO and social media, run alongside every event.',
    cardDescription: 'Paid advertising, SEO and social media management, digital reach for your brand.',
    intro:
      'Triquetra Events helps you market digitally: paid advertising, search engine optimisation and social media management, aligned with the same delivery as your ground events, not run as a separate workstream.',
    capabilities: [
      { title: 'Offline and Online Synergy', description: 'We align ground events with digital visibility, handled under one roof, by one skilled team.' },
      { title: 'Social Media Management', description: 'Running and growing your social handles with consistent, on-brand content.' },
      { title: 'Search Engine Optimisation (SEO)', description: 'Improving visibility and rankings so the right audience finds you organically.' },
      { title: 'Paid Advertising', description: 'Targeted ad campaigns across platforms to reach the right audience faster.' },
    ],
    cardImage: '/images/gallery/ifat-brugg-rittmeyer/1.jpg',
    heroImage: '/images/gallery/ifat-brugg-rittmeyer/1.jpg',
    processTitle: 'Understand to Optimise',
    process: [
      { title: 'Understand', description: 'Every campaign starts with your brand, audience and objective.' },
      { title: 'Plan', description: 'A channel mix built around social media, SEO and paid advertising.' },
      { title: 'Create', description: 'On-brand content and creative built for your social handles and campaigns.' },
      { title: 'Launch', description: 'Paid ad campaigns and SEO groundwork go live across the right platforms.' },
      { title: 'Measure', description: 'Performance tracked across every channel, not left to guesswork.' },
      { title: 'Optimise', description: 'Ongoing refinement based on what the numbers show is working.' },
    ],
    showGallery: false,
    galleryImages: [],
  },
]

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug)
