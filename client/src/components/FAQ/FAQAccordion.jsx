import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight } from 'lucide-react'
import Reveal from '../Reveal/Reveal'

/**
 * Accessible accordion: button semantics, aria-expanded/aria-controls,
 * keyboard operable by default (native <button>), smooth open/close.
 */
export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const panelId = `faq-panel-${i}-${item.question.slice(0, 10).replace(/\s+/g, '-')}`
        const buttonId = `faq-button-${i}-${item.question.slice(0, 10).replace(/\s+/g, '-')}`

        return (
          <Reveal key={item.question} delay={Math.min(i, 6) * 0.04}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink sm:text-lg"
              >
                {item.question}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid overflow-hidden transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-2xl text-sm leading-relaxed text-stone-dark sm:text-base">{item.answer}</p>
                {item.link && (
                  <Link
                    to={item.link.to}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark hover:text-ink"
                  >
                    {item.link.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
