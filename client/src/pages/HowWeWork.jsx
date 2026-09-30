import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SEO from '../components/SEO/SEO'
import PageHero from '../components/Hero/PageHero'
import SectionHeading from '../components/SectionHeading/SectionHeading'
import ProcessTimeline from '../components/ProcessTimeline/ProcessTimeline'
import CTASection from '../components/CTASection/CTASection'
import { howWeWork } from '../data/siteContent'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd } from '../lib/breadcrumbJsonLd'

const breadcrumb = [
  { label: 'Home', to: '/' },
  { label: 'How We Work' },
]

export default function HowWeWork() {
  return (
    <>
      <SEO
        title={pageSeo['/how-we-work'].title}
        description={pageSeo['/how-we-work'].description}
        path="/how-we-work"
        ogImage="/images/gallery/ifat-sawas/2.jpg"
        jsonLd={[breadcrumbJsonLd(breadcrumb)]}
      />

      <PageHero
        eyebrow="How We Work"
        title="A Transparent, Deal-Oriented Workflow"
        description="From costing to coordination, we believe in zero guesswork and full honesty."
        image="/images/gallery/ifat-sawas/2.jpg"
        breadcrumb={breadcrumb}
      />

      <section className="bg-cream py-24 sm:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Our Process"
            title="Seven Principles Behind Every Delivery"
            description="This is how Triquetra Events runs a project from first brief to final walkthrough."
          />
          <div>
            <ProcessTimeline steps={howWeWork} />
            <Link
              to="/services"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:text-gold-dark"
            >
              See how this plays out across our services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <CTASection title="Ready to Put This Into Motion?" />
    </>
  )
}
