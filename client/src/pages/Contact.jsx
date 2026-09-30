import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import SEO from '../components/SEO/SEO'
import PageHero from '../components/Hero/PageHero'
import Reveal from '../components/Reveal/Reveal'
import Button from '../components/Button/Button'
import { contact } from '../data/siteContent'
import { services } from '../data/services'
import { sendContactEmail } from '../lib/sendContactEmail'
import { pageSeo } from '../data/seo'
import { breadcrumbJsonLd } from '../lib/breadcrumbJsonLd'

const breadcrumb = [
  { label: 'Home', to: '/' },
  { label: 'Contact Us' },
]

const initialForm = { name: '', company: '', email: '', phone: '', service: '', message: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please enter your name.'
  if (!form.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!form.phone.trim()) {
    errors.phone = 'Please enter a phone number.'
  } else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.'
  }
  if (!form.message.trim()) errors.message = 'Tell us a little about your project.'
  return errors
}

const fieldClasses =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-stone/60 focus:border-gold focus:outline-none disabled:opacity-60'

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')

    const serviceLabel = services.find((s) => s.slug === form.service)?.title

    const result = await sendContactEmail(
      {
        name: form.name,
        company: form.company || 'Not provided',
        email: form.email,
        phone: form.phone,
        service_interested_in: serviceLabel ?? 'Not specified',
        message: form.message,
        to: contact.email,
      },
      {
        subject: `New enquiry from ${form.name}`,
        fromName: 'Triquetra Events Website',
      },
    )

    setStatus(result.success ? 'success' : 'error')
  }

  const mapQuery = encodeURIComponent(`${contact.headOffice.lines.join(', ')}`)

  return (
    <>
      <SEO
        title={pageSeo['/contact'].title}
        description={pageSeo['/contact'].description}
        path="/contact"
        jsonLd={[breadcrumbJsonLd(breadcrumb)]}
      />

      <PageHero
        eyebrow="Contact Us"
        title="Let's Talk About Your Next Project"
        description="Tell us what you're planning and our team will get back to you."
        breadcrumb={breadcrumb}
      />

      <section className="bg-cream py-20 sm:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact info */}
          <Reveal className="flex flex-col gap-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Head Office</h2>
              <p className="mt-3 flex gap-3 text-sm leading-relaxed text-stone-dark">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {contact.headOffice.lines.join(', ')}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Branch Office</h2>
              <p className="mt-3 flex gap-3 text-sm leading-relaxed text-stone-dark">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {contact.branchOffice.lines.join(', ')}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Phone</h2>
              <div className="mt-3 flex flex-col gap-2">
                {contact.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 text-sm text-stone-dark hover:text-ink"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-gold" />
                    <span className="link-underline">{phone}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Email</h2>
              <a
                href={`mailto:${contact.email}`}
                className="mt-3 flex items-center gap-3 text-sm text-stone-dark hover:text-ink"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span className="link-underline">{contact.email}</span>
              </a>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Service Areas</h2>
              <ul className="mt-3 flex flex-col gap-1.5 text-sm text-stone-dark">
                {contact.serviceAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>

            <div className="mt-2 overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Triquetra Events head office location"
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                width="100%"
                height="260"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block"
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-8 sm:p-10"
            >
              <h2 className="font-display text-2xl font-semibold text-ink">Send an Enquiry</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                    Name <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={update('name')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1.5 text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-ink">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={update('company')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
                    Email <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1.5 text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
                    Phone <span className="text-gold-dark">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1.5 text-xs text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-ink">
                  Service Interested In
                </label>
                <select
                  id="service"
                  value={form.service}
                  onChange={update('service')}
                  disabled={status === 'submitting'}
                  className={fieldClasses}
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
                  Message <span className="text-gold-dark">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  disabled={status === 'submitting'}
                  className={fieldClasses}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-xs text-red-600">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p role="alert" className="text-sm text-red-600">
                  We couldn&rsquo;t send your enquiry just yet. Please try again, or email us directly at{' '}
                  {contact.email}.
                </p>
              )}

              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-2 justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Message'}
              </Button>

              {status === 'success' && (
                <p role="status" className="text-sm text-stone-dark">
                  Thank you. Your enquiry has been sent to our team. We&rsquo;ll get back to you shortly.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}
