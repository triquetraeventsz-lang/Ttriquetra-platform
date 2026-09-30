import SectionHeading from '../SectionHeading/SectionHeading'
import FAQAccordion from './FAQAccordion'

export default function FAQSection({ items, title = 'Frequently Asked Questions', eyebrow = 'FAQs' }) {
  if (!items || items.length === 0) return null

  return (
    <section className="bg-cream py-20 sm:py-24">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-10" />
        <FAQAccordion items={items} />
      </div>
    </section>
  )
}
