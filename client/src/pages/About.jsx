import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO/SEO'
import PageHero from '../components/Hero/PageHero'
import Reveal from '../components/Reveal/Reveal'
import ValueList from '../components/ValueList/ValueList'
import SectionHeading from '../components/SectionHeading/SectionHeading'
import CTASection from '../components/CTASection/CTASection'
import { overview, vision, mission, coreValues, brand } from '../data/siteContent'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd } from '../lib/breadcrumbJsonLd'

const breadcrumb = [
  { label: 'Home', to: '/' },
  { label: 'About Us' },
]

const stripImages = [
  { src: '/images/gallery/world-of-concrete-ambuja/2.jpg', alt: 'Ambuja Cement exhibition stand render' },
  { src: '/images/gallery/world-food-india-swadgram/1.jpg', alt: 'Swadgram exhibition stand at World Food India' },
  { src: '/images/gallery/alucast-aakar/3.jpg', alt: 'Aakar Dies and Moulds exhibition stand at Alucast' },
]

export default function About() {
  return (
    <>
      <SEO
        title={pageSeo['/about'].title}
        description={pageSeo['/about'].description}
        path="/about"
        ogImage="/images/gallery/ifat-brugg-rittmeyer/3.jpg"
        jsonLd={[breadcrumbJsonLd(breadcrumb)]}
      />

      <PageHero
        eyebrow="About Us"
        title="Experience Engineers, Rooted in Precision"
        description={brand.tagline}
        image="/images/gallery/ifat-brugg-rittmeyer/3.jpg"
        breadcrumb={breadcrumb}
      />

      {/* Who we are: image + short copy */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-6">
          <Reveal className="overflow-hidden rounded-3xl lg:order-2">
            <img
              src="/images/gallery/intimasia-magpie/1.jpg"
              alt="Triquetra Events team at the Magpie Impex exhibition stand"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/6]"
            />
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-5 lg:order-1">
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Who We Are</span>
            <h2 className="text-3xl leading-tight font-semibold text-ink sm:text-4xl">Not Just Event Managers</h2>
            <p className="max-w-md text-base leading-relaxed text-stone-dark">{overview.paragraphs[0]}</p>
            <dl className="mt-2 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-ink uppercase">Established</dt>
                <dd className="mt-1 text-stone-dark">{brand.established}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold tracking-wide text-ink uppercase">Headquarters</dt>
                <dd className="mt-1 text-stone-dark">{brand.headquarters}</dd>
              </div>
            </dl>
            <Link
              to="/services"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-gold-dark"
            >
              Explore our event, activation, MICE and marketing services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Our approach: vision + mission */}
      <section className="bg-ink py-20 text-cream sm:py-28">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-cream/10 bg-cream/5 p-8 sm:p-10">
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Vision</span>
            <p className="mt-4 text-lg leading-relaxed text-cream/85 sm:text-xl">{vision}</p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-3xl border border-cream/10 bg-cream/5 p-8 sm:p-10">
            <span className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">Mission</span>
            <p className="mt-4 text-lg leading-relaxed text-cream/85 sm:text-xl">{mission}</p>
          </Reveal>
        </div>
      </section>

      {/* Strengths / core values */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our Strengths"
            title="Core Values That Shape Every Project"
            align="center"
            className="mb-12"
          />
          <ValueList values={coreValues} />
        </div>
      </section>

      {/* Photography strip */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stripImages.map((img) => (
            <Reveal key={img.src} className="overflow-hidden rounded-2xl">
              <img src={img.src} alt={img.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection title="Ready to Work With Us?" />
    </>
  )
}
