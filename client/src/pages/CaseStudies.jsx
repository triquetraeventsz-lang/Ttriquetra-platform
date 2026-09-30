import SEO from '../components/SEO/SEO'
import PageHero from '../components/Hero/PageHero'
import SectionHeading from '../components/SectionHeading/SectionHeading'
import ProjectCard from '../components/ProjectCard/ProjectCard'
import ImageGallery from '../components/ImageGallery/ImageGallery'
import CTASection from '../components/CTASection/CTASection'
import { projects, allGalleryImages } from '../data/projects'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd } from '../lib/breadcrumbJsonLd'

const breadcrumb = [
  { label: 'Home', to: '/' },
  { label: 'Case Studies' },
]

// This page exists and is fully built, but is intentionally left out of the
// visible navbar for now (see src/data/nav.js). It remains reachable at
// /case-studies and can be surfaced in navigation later.
export default function CaseStudies() {
  return (
    <>
      <SEO
        title={pageSeo['/case-studies'].title}
        description={pageSeo['/case-studies'].description}
        path="/case-studies"
        ogImage="/images/gallery/aahar-cropino/2.jpg"
        jsonLd={[breadcrumbJsonLd(breadcrumb)]}
      />

      <PageHero
        eyebrow="Case Studies"
        title="Recent Projects"
        description="A selection of exhibition builds and event executions delivered by Triquetra Events."
        image="/images/gallery/aahar-cropino/2.jpg"
        breadcrumb={breadcrumb}
      />

      <section className="bg-cream py-24 sm:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Projects" title="Selected Work" className="mb-12" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 text-cream sm:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Full Photography"
            title="Browse Every Project"
            dark
            className="mb-12"
          />
          <ImageGallery images={allGalleryImages} />
        </div>
      </section>

      <CTASection title="Want to Be Our Next Case Study?" />
    </>
  )
}
