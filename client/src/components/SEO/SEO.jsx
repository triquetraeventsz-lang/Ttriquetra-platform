import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, organization } from '../../data/seo'

function setMetaByName(name, content) {
  if (!content) return
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setMetaByProperty(property, content) {
  if (!content) return
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

// Structured-data <script> tags are fully swapped on every render (rather
// than merged) so stale JSON-LD from a previous route never lingers.
function setJsonLd(blocks) {
  document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove())
  blocks.filter(Boolean).forEach((block) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-jsonld', 'true')
    script.textContent = JSON.stringify(block)
    document.head.appendChild(script)
  })
}

function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: organization.name,
    legalName: organization.legalName,
    url: organization.url,
    logo: organization.logo,
    image: organization.logo,
    email: organization.email,
    telephone: organization.telephone,
    address: {
      '@type': 'PostalAddress',
      ...organization.address,
    },
    sameAs: organization.sameAs,
  }
}

/**
 * Per-page SEO: title, meta description, canonical URL, Open Graph and
 * Twitter card tags, robots directives, and structured data. The
 * Organization/ProfessionalService schema is injected on every page
 * automatically; pass `jsonLd` for page-specific structured data
 * (BreadcrumbList, FAQPage) on top of it.
 */
export default function SEO({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd = [],
}) {
  const location = useLocation()

  useEffect(() => {
    // `title` is expected to be the complete <title> text (see data/seo.js),
    // since the homepage leads with the brand name while inner pages end
    // with it, and forcing one fixed suffix pattern can't cover both.
    const fullTitle = title || `${SITE_NAME} | Event Management & Brand Experiences`
    const canonicalPath = path ?? location.pathname
    const canonicalUrl = absoluteUrl(canonicalPath)
    const absoluteOgImage = ogImage.startsWith('http') ? ogImage : absoluteUrl(ogImage)

    document.title = fullTitle
    setMetaByName('description', description)
    setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonical(canonicalUrl)

    setMetaByProperty('og:title', fullTitle)
    setMetaByProperty('og:description', description)
    setMetaByProperty('og:url', canonicalUrl)
    setMetaByProperty('og:type', ogType)
    setMetaByProperty('og:image', absoluteOgImage)
    setMetaByProperty('og:site_name', SITE_NAME)

    setMetaByName('twitter:card', 'summary_large_image')
    setMetaByName('twitter:title', fullTitle)
    setMetaByName('twitter:description', description)
    setMetaByName('twitter:image', absoluteOgImage)

    setJsonLd([organizationJsonLd(), ...jsonLd])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, ogImage, ogType, noindex, location.pathname, JSON.stringify(jsonLd)])

  return null
}
