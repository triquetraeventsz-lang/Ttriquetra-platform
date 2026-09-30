import { absoluteUrl } from '../data/seo'

/**
 * Builds BreadcrumbList structured data from the same {label, to} trail
 * rendered visibly by PageHero, so the schema always matches what's on
 * the page.
 */
export function breadcrumbJsonLd(trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.to),
    })),
  }
}
