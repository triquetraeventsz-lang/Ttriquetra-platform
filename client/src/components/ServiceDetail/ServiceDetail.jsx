import SEO from '../SEO/SEO'
import PageHero from '../Hero/PageHero'
import SectionHeading from '../SectionHeading/SectionHeading'
import Reveal from '../Reveal/Reveal'
import ImageGallery from '../ImageGallery/ImageGallery'
import ProcessTimeline from '../ProcessTimeline/ProcessTimeline'
import FAQSection from '../FAQ/FAQSection'
import CTASection from '../CTASection/CTASection'
import { pageSeo } from '../../data/seo'
import { breadcrumbJsonLd } from '../../lib/breadcrumbJsonLd'
import { faqJsonLd, eventsFaq, brandActivationFaq, miceFaq, onlineMarketingFaq } from '../../data/faq'

const faqBySlug = {
  events: eventsFaq,
  'brand-activation': brandActivationFaq,
  mice: miceFaq,
  'online-marketing': onlineMarketingFaq,
}

export default function ServiceDetail({ service }) {
  const Icon = service.icon
  const galleryImages = service.galleryImages ?? []
  const breakImage = galleryImages[0]
  const remainingGalleryImages = galleryImages.slice(1).map((src, i) => ({
    src,
    alt: `${service.title}, Triquetra Events`,
    key: `${service.slug}-${i}`,
  }))

  const path = `/services/${service.slug}`
  const seo = pageSeo[path]
  const faq = faqBySlug[service.slug]
  const breadcrumb = [{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]

  return (
    <>
      <SEO
        title={seo?.title ?? `${service.title} | Triquetra Events`}
        description={seo?.description ?? service.cardDescription}
        path={path}
        ogImage={service.heroImage ?? service.cardImage}
        jsonLd={[breadcrumbJsonLd(breadcrumb), ...(faq ? [faqJsonLd(faq)] : [])]}
      />

      <PageHero
        eyebrow="Service"
        title={service.pageTitle ?? service.title}
        description={service.tagline}
        image={service.heroImage}
        breadcrumb={breadcrumb}
      />

      {/* Intro */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-page grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <Reveal className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink text-gold">
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-2xl text-lg leading-relaxed text-stone-dark sm:text-xl">{service.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-paper py-20 sm:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="What's Included" title="Capabilities" className="mb-12" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((cap, i) => (
              <Reveal key={cap.title} delay={i * 0.05} className="rounded-2xl border border-line bg-white p-6">
                <span className="mb-3 inline-block h-1.5 w-8 rounded-full bg-gold" aria-hidden="true" />
                <h3 className="text-base font-semibold text-ink">{cap.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-dark">{cap.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width visual break */}
      {breakImage && (
        <Reveal as="section" className="h-[45vh] min-h-[320px] w-full sm:h-[55vh]">
          <img
            src={breakImage}
            alt={`${service.title}, Triquetra Events`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </Reveal>
      )}

      {/* Service-specific process */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <SectionHeading eyebrow="Our Process" title={service.processTitle} />
          <ProcessTimeline steps={service.process} />
        </div>
      </section>

      {/* Gallery */}
      {service.showGallery && remainingGalleryImages.length > 0 && (
        <section className="bg-ink py-20 text-cream sm:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="In the Field" title="Recent Work" dark className="mb-12" />
            <ImageGallery images={remainingGalleryImages} />
          </div>
        </section>
      )}

      <FAQSection items={faq} title={`${service.title} FAQs`} />

      <CTASection title={`Ready to Talk ${service.title}?`} />
    </>
  )
}
