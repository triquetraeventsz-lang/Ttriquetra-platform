import { motion } from 'framer-motion'
import SEO from '../components/SEO/SEO'
import Reveal from '../components/Reveal/Reveal'
import SectionHeading from '../components/SectionHeading/SectionHeading'
import Button from '../components/Button/Button'
import ServiceGrid from '../components/ServiceGrid/ServiceGrid'
import VisualShowcase from '../components/VisualShowcase/VisualShowcase'
import CTASection from '../components/CTASection/CTASection'
import FAQSection from '../components/FAQ/FAQSection'
import { brand } from '../data/siteContent'
import { pageSeo } from '../data/seo'
import { homeFaq, faqJsonLd } from '../data/faq'

const showcaseItems = [
  {
    src: '/images/gallery/ifat-sawas/1.jpg',
    alt: 'Triquetra Events team on-site building an exhibition stand',
    span: 'col-span-2 sm:col-span-3',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery/world-food-india-swadgram/1.jpg',
    alt: 'Swadgram exhibition stand at World Food India, Bharat Mandapam',
    span: 'col-span-2 sm:col-span-3',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/images/gallery/alucast-aakar/1.jpg',
    alt: 'Aakar Dies and Moulds exhibition stand at Alucast',
    span: 'col-span-1 sm:col-span-2',
    aspect: 'aspect-square',
  },
  {
    src: '/images/gallery/world-of-concrete-ambuja/2.jpg',
    alt: 'Ambuja Cement exhibition stand render, The World of Concrete India Expo',
    span: 'col-span-1 sm:col-span-2',
    aspect: 'aspect-square',
  },
  {
    src: '/images/gallery/intimasia-magpie/3.jpg',
    alt: 'Magpie Impex exhibition stand at Intimasia',
    span: 'col-span-2 sm:col-span-2',
    aspect: 'aspect-square',
  },
  {
    src: '/images/gallery/aahar-cropino/3.jpg',
    alt: 'Cropino lounge area at Aahar, Pragati Maidan',
    span: 'col-span-1 sm:col-span-3',
    aspect: 'aspect-[16/10]',
  },
  {
    src: '/images/gallery/ifat-brugg-rittmeyer/3.jpg',
    alt: 'BRUGG Rittmeyer exhibition stand at IFAT',
    span: 'col-span-1 sm:col-span-3',
    aspect: 'aspect-[16/10]',
  },
]

const approach = [
  { title: 'Understand', description: 'Every project starts with the brief: the audience, the objective, the outcome.' },
  { title: 'Plan & Design', description: 'The DeliDESIGN language, strategic manpower and a fully transparent workflow.' },
  { title: 'Execute', description: 'Built on schedule, delivered with clockwork punctuality. No delays, no excuses.' },
  { title: 'Deliver', description: 'Quality checks across every touchpoint: man, machine, material and message.' },
]

export default function Home() {
  return (
    <>
      <SEO
        title={pageSeo['/'].title}
        description={pageSeo['/'].description}
        path="/"
        ogImage="/images/gallery/world-of-concrete-ambuja/3.jpg"
        jsonLd={[faqJsonLd(homeFaq)]}
      />

      {/* Hero */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-ink text-cream">
        <div className="absolute inset-0">
          <img
            src="/images/gallery/world-of-concrete-ambuja/3.jpg"
            alt="Triquetra Events exhibition stand build for Ambuja Cement"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        </div>

        <div className="container-page relative z-10 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span className="mb-5 inline-block text-xs font-semibold tracking-[0.3em] text-gold uppercase">
              {brand.fullName}
            </span>
            <h1 className="text-5xl leading-[1.05] font-semibold sm:text-6xl md:text-7xl">
              We Engineer
              <span className="block text-gold">Brand Experiences.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-cream/80 sm:text-lg">{brand.tagline}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button to="/services">Explore Our Services</Button>
              <Button to="/contact" variant="outline-light">
                Let's Create Something Remarkable
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About preview: image + short copy split */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-6">
          <Reveal className="overflow-hidden rounded-3xl">
            <img
              src="/images/gallery/aahar-cropino/3.jpg"
              alt="Cropino lounge area built by Triquetra Events at Aahar, Pragati Maidan"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/6]"
            />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5 lg:pl-6">
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">About Triquetra</span>
            <h2 className="text-3xl leading-tight font-semibold text-ink sm:text-4xl">
              Experience Engineers, Not Just Event Managers
            </h2>
            <p className="max-w-md text-base leading-relaxed text-stone-dark">
              We plan with intent and execute with discipline. Every detail on time, on promise, on point.
              Our DeliDESIGN language blends modern aesthetics with Delhi's cultural vibrancy.
            </p>
            <div>
              <Button to="/about" variant="dark">
                Discover Triquetra
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="What We Do"
            title="Four Ways We Build Brand Experiences"
            align="center"
            className="mb-12"
          />
          <ServiceGrid />
        </div>
      </section>

      {/* Visual showcase */}
      <section className="bg-ink py-20 text-cream sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Work"
            title="Experiences in Action"
            dark
            className="mb-12"
          />
          <VisualShowcase items={showcaseItems} />
        </div>
      </section>

      {/* How We Work preview */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Our Approach" title="How We Work" align="center" className="mb-12" />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08} className="text-center">
                <span className="font-display text-4xl text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-dark">{step.description}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button to="/how-we-work" variant="dark">
              See Our Full Process
            </Button>
          </div>
        </div>
      </section>

      <FAQSection items={homeFaq} />

      <CTASection title="Let's Build Experiences That People Remember." ctaLabel="Talk to Us" />
    </>
  )
}
