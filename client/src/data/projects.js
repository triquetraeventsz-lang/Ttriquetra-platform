// Case study / gallery data, sourced directly from the Triquetra Events
// company profile. Image files are the original event/exhibition
// photography supplied with that profile.

export const projects = [
  {
    slug: 'world-of-concrete-ambuja',
    project: 'The World of Concrete India Expo',
    client: 'Ambuja',
    venue: 'Bombay Exhibition Centre, Mumbai',
    images: [
      '/images/gallery/world-of-concrete-ambuja/1.jpg',
      '/images/gallery/world-of-concrete-ambuja/2.jpg',
      '/images/gallery/world-of-concrete-ambuja/3.jpg',
    ],
  },
  {
    slug: 'ifat-brugg-rittmeyer',
    project: 'IFAT',
    client: 'BRUGG Rittmeyer',
    venue: 'Bombay Exhibition Centre, Mumbai',
    images: [
      '/images/gallery/ifat-brugg-rittmeyer/1.jpg',
      '/images/gallery/ifat-brugg-rittmeyer/2.jpg',
      '/images/gallery/ifat-brugg-rittmeyer/3.jpg',
    ],
  },
  {
    slug: 'ifat-sawas',
    project: 'IFAT',
    client: 'Sawas',
    venue: 'Bombay Exhibition Centre, Mumbai',
    images: [
      '/images/gallery/ifat-sawas/1.jpg',
      '/images/gallery/ifat-sawas/2.jpg',
      '/images/gallery/ifat-sawas/3.jpg',
    ],
  },
  {
    slug: 'aahar-cropino',
    project: 'Aahar',
    client: 'Cropino',
    venue: 'Pragati Maidan, New Delhi',
    images: [
      '/images/gallery/aahar-cropino/1.jpg',
      '/images/gallery/aahar-cropino/2.jpg',
      '/images/gallery/aahar-cropino/3.jpg',
    ],
  },
  {
    slug: 'alucast-aakar',
    project: 'Alucast Exhibition',
    client: 'Aakar Dies and Moulds',
    venue: 'Yashobhoomi, IICC, Dwarka, Delhi',
    images: [
      '/images/gallery/alucast-aakar/1.jpg',
      '/images/gallery/alucast-aakar/2.jpg',
      '/images/gallery/alucast-aakar/3.jpg',
    ],
  },
  {
    slug: 'world-food-india-swadgram',
    project: 'World Food India',
    client: 'Swadgram',
    venue: 'Bharat Mandapam, New Delhi',
    images: [
      '/images/gallery/world-food-india-swadgram/1.jpg',
      '/images/gallery/world-food-india-swadgram/2.jpg',
      '/images/gallery/world-food-india-swadgram/3.jpg',
    ],
  },
  {
    slug: 'intimasia-magpie',
    project: 'Intimasia',
    client: 'Magpie Impex',
    venue: 'Yashobhoomi, New Delhi, India',
    images: [
      '/images/gallery/intimasia-magpie/1.jpg',
      '/images/gallery/intimasia-magpie/2.jpg',
      '/images/gallery/intimasia-magpie/3.jpg',
    ],
  },
]

// Flat list of every project photo, used for the homepage showcase.
export const allGalleryImages = projects.flatMap((p) =>
  p.images.map((src, i) => ({
    src,
    alt: `${p.project}, ${p.client}, ${p.venue}`,
    project: p.project,
    client: p.client,
    key: `${p.slug}-${i}`,
  })),
)
