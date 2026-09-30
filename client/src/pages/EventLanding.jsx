import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SEO from '../components/SEO/SEO'
import EventHero from '../components/EventLanding/EventHero'
import EventDetailsCard from '../components/EventLanding/EventDetailsCard'
import EventAnnouncementStrip from '../components/EventLanding/EventAnnouncementStrip'
import EventGallery from '../components/EventLanding/EventGallery'
import EventCta from '../components/EventLanding/EventCta'
import EventLeadForm from '../components/EventLanding/EventLeadForm'
import NotFound from './NotFound'
import { getEvent, getCampaign } from '../lib/api'
import { useSetFooterVisible } from '../context/FooterVisibilityContext'

// Sections with real backing data today. `timeline` and `faq` are valid
// toggles in the admin (forward-compatible with the schema) but have no
// structured content to render yet — see Phase 4 plan. `footer` isn't
// listed here since it's handled separately via FooterVisibilityContext,
// not rendered inline in this section list.
const RENDERABLE_SECTIONS = new Set(['hero', 'eventDetails', 'announcements', 'gallery', 'cta', 'leadForm'])

export default function EventLanding() {
  const { slug } = useParams()
  const [state, setState] = useState({ loading: true, notFound: false, event: null, phase: null })

  useEffect(() => {
    let cancelled = false
    setState({ loading: true, notFound: false, event: null, phase: null })

    Promise.all([getEvent(slug), getCampaign(slug, 'landing')])
      .then(([event, campaign]) => {
        if (!cancelled) setState({ loading: false, notFound: false, event, phase: campaign.activePhase })
      })
      .catch(() => {
        // A 404 (event not visible) and any other failure both land on the
        // same not-found page — there's nothing actionable a visitor can
        // do differently either way.
        if (!cancelled) setState({ loading: false, notFound: true, event: null, phase: null })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const footerEnabled = state.event?.sections?.footer?.enabled !== false
  useSetFooterVisible(footerEnabled)

  if (state.loading) return null
  if (state.notFound) return <NotFound />

  const { event, phase } = state
  const headline = phase?.publicHeadline || event.publicName || event.name
  const message = phase?.publicMessage || event.description
  const heroImage = phase?.image || event.heroImage
  const ctaLabel = phase?.ctaLabel
  const ctaUrl = phase?.ctaUrl

  const sections = Object.entries(event.sections || {})
    .filter(([key, cfg]) => cfg?.enabled && RENDERABLE_SECTIONS.has(key))
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([key]) => key)

  return (
    <>
      <SEO
        title={event.seo?.title || `${event.publicName || event.name} | Triquetra Events`}
        description={event.seo?.description || event.description}
        ogImage={event.seo?.ogImage || heroImage}
        noindex={event.seo?.indexable === false}
      />

      {sections.map((key) => {
        switch (key) {
          case 'hero':
            return <EventHero key={key} headline={headline} message={message} image={heroImage} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          case 'eventDetails':
            return (
              <EventDetailsCard
                key={key}
                venue={event.venue}
                city={event.city}
                eventDate={event.eventDate}
                eventTime={event.eventTime}
              />
            )
          case 'announcements':
            return <EventAnnouncementStrip key={key} headline={headline} message={message} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          case 'gallery':
            return <EventGallery key={key} images={event.gallery} />
          case 'cta':
            return <EventCta key={key} headline={headline} ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
          case 'leadForm':
            return <EventLeadForm key={key} slug={slug} leadForm={event.leadForm} />
          default:
            return null
        }
      })}
    </>
  )
}
