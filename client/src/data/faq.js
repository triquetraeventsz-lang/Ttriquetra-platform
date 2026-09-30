// Page-specific FAQ content. Every answer is a restatement of content that
// already appears elsewhere on the site (siteContent.js / services.js).
// Nothing here introduces a new claim, capability or number.
//
// Optional `link` fields point homepage FAQ answers to the relevant
// service page, giving FAQAccordion real internal links with descriptive
// anchor text without putting JSX into the FAQ's plain-text `answer`
// (that text is reused verbatim in FAQPage structured data).

import { contact } from './siteContent'

export const homeFaq = [
  {
    question: 'What services does Triquetra Events provide?',
    answer:
      'Triquetra Events provides four core services: events, brand activation, MICE (meetings, incentives, conferences and exhibitions), and online marketing.',
    link: { to: '/services', label: 'See all Triquetra Events services' },
  },
  {
    question: 'What types of events does Triquetra manage?',
    answer:
      'Corporate events, product launches, conferences, trade shows, and full exhibition stands, from booth design through fabrication and on-site execution.',
    link: { to: '/services/events', label: 'Explore our event management services' },
  },
  {
    question: 'Does Triquetra handle brand activations?',
    answer:
      'Yes. Triquetra designs experiential campaigns, on-ground promotions and consumer engagement built to be memorable.',
    link: { to: '/services/brand-activation', label: 'Explore our brand activation services' },
  },
  {
    question: 'Does Triquetra provide MICE services?',
    answer: 'Yes. Triquetra handles meetings, incentive travel, conferences and exhibitions end to end.',
    link: { to: '/services/mice', label: 'Explore our MICE services' },
  },
  {
    question: 'How can I contact Triquetra Events?',
    answer: `You can reach Triquetra Events by phone at ${contact.phones[0]}, by email at ${contact.email}, or through the enquiry form on the Contact page.`,
    link: { to: '/contact', label: 'Go to the Contact page' },
  },
]

export const eventsFaq = [
  {
    question: 'What types of events does Triquetra Events manage?',
    answer:
      'Corporate events, product launches, conferences and trade shows, along with the exhibition stands that carry a brand through the show floor.',
  },
  {
    question: 'Does Triquetra handle event planning and execution?',
    answer:
      'Yes, from the initial brief and concept design through planning, production, on-site execution and post-event quality checks.',
  },
  {
    question: 'Can Triquetra manage an event from concept through execution?',
    answer:
      "Yes. Triquetra's process runs from brief and concept design through planning, production, execution and post-event review.",
  },
  {
    question: 'What information is needed to plan an event?',
    answer:
      'Triquetra starts with a brief covering the audience, the objective and the outcome that matters, then builds the concept, planning and production around it.',
  },
  {
    question: 'How do I enquire about an event?',
    answer: 'Use the enquiry form on the Contact page, or reach out by phone or email.',
  },
]

export const brandActivationFaq = [
  {
    question: 'What is brand activation?',
    answer:
      'Brand activation is where a brand message becomes an experience: experiential campaigns, on-ground promotions and consumer engagement designed to be memorable.',
  },
  {
    question: 'What types of brand activations does Triquetra provide?',
    answer: 'Experiential campaigns, on-ground promotions and consumer engagement activities.',
  },
  {
    question: 'How does Triquetra approach experiential brand campaigns?',
    answer:
      'Through the DeliDESIGN language, campaigns are built from brand understanding through activation concept, experience design, on-ground execution and engagement.',
  },
  {
    question: 'Can Triquetra manage on-ground activation execution?',
    answer: 'Yes. Triquetra handles direct, in-person promotional activity where audiences already are.',
  },
]

export const miceFaq = [
  {
    question: 'What does MICE stand for?',
    answer: 'MICE stands for Meetings, Incentives, Conferences and Exhibitions.',
  },
  {
    question: 'What MICE services does Triquetra Events provide?',
    answer:
      'Coordinated planning for meetings, incentive travel programmes, full conference planning and coordination, and exhibition stands with floor presence.',
  },
  {
    question: 'Does Triquetra manage conferences and exhibitions?',
    answer:
      'Yes, including planning, coordination and delivery for conferences, plus booth design through attendee engagement for exhibitions.',
  },
  {
    question: 'How does Triquetra approach MICE event planning?',
    answer:
      'The process runs from a clear objective through planning, venue and logistics, experience design, and production and execution.',
  },
  {
    question: 'Can Triquetra support the execution and coordination of MICE events?',
    answer: 'Yes, with strategic manpower across execution, design and logistics for every need.',
  },
]

export const onlineMarketingFaq = [
  {
    question: 'What online marketing services does Triquetra Events provide?',
    answer: 'Paid advertising, search engine optimisation (SEO), and social media management.',
  },
  {
    question: 'Does Triquetra run paid advertising campaigns?',
    answer: 'Yes, targeted ad campaigns across platforms to reach the right audience faster.',
  },
  {
    question: 'Does Triquetra offer SEO services?',
    answer: 'Yes, improving visibility and rankings so the right audience finds you organically.',
  },
  {
    question: 'Does Triquetra manage social media accounts?',
    answer: 'Yes, running and growing social handles with consistent, on-brand content.',
  },
  {
    question: "How does online marketing fit with Triquetra's events?",
    answer:
      'Digital visibility is aligned with ground events and handled under one roof, by one skilled team, rather than as a separate workstream.',
  },
]

export function faqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
