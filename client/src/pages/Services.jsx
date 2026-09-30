import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SEO from '../components/SEO/SEO'
import PageHero from '../components/Hero/PageHero'
import Reveal from '../components/Reveal/Reveal'
import CTASection from '../components/CTASection/CTASection'
import { services } from '../data/services'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd } from '../lib/breadcrumbJsonLd'

const breadcrumb = [
  { label: 'Home', to: '/' },
  { label: 'Services' },
]

export default function Services() {
  return (
    <>
      <SEO
        title={pageSeo['/services'].title}
        description={pageSeo['/services'].description}
        path="/services"
        ogImage="/images/gallery/alucast-aakar/2.jpg"
        jsonLd={[breadcrumbJsonLd(breadcrumb)]}
      />

      <PageHero
        eyebrow="Services"
        title="Four Verticals. One Skilled Team."
        description="Every engagement runs on the same precision management and transparent workflow."
        image="/images/gallery/alucast-aakar/2.jpg"
        breadcrumb={breadcrumb}
      />

      <section className="bg-cream py-20 sm:py-28">
        <div className="container-page flex flex-col gap-4">
          {services.map((service, i) => {
            const Icon = service.icon
            const reversed = i % 2 === 1
            return (
              <Reveal
                key={service.slug}
                delay={i * 0.05}
                className="grid overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-2"
              >
                <div className={`relative min-h-[280px] md:min-h-[380px] ${reversed ? 'md:order-2' : ''}`}>
                  {service.cardImage ? (
                    <img
                      src={service.cardImage}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(120% 100% at 0% 0%, rgba(249,188,33,0.18) 0%, transparent 55%), linear-gradient(160deg, #241f18 0%, #0a0a0a 100%)',
                      }}
                    />
                  )}
                </div>

                <div className={`flex flex-col justify-center p-8 sm:p-12 ${reversed ? 'md:order-1' : ''}`}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-gold">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{service.title}</h2>
                  <p className="mt-3 text-sm font-medium tracking-wide text-gold-dark uppercase">
                    {service.tagline}
                  </p>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-stone-dark">
                    {service.cardDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap.title}
                        className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-stone-dark"
                      >
                        {cap.title}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/services/${service.slug}`}
                    className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-ink uppercase"
                  >
                    Explore {service.title}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <CTASection title="Not Sure Where to Start?" body="Tell us about the project and we'll point you to the right service." />
    </>
  )
}
