import { useState } from 'react'
import Reveal from '../Reveal/Reveal'
import Button from '../Button/Button'
import { submitLead } from '../../lib/api'

const fieldClasses =
  'w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-stone/60 focus:border-gold focus:outline-none disabled:opacity-60'

export default function EventLeadForm({ slug, leadForm }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [message, setMessage] = useState('')

  if (!leadForm?.enabled) return null

  const fields = leadForm.fields?.length ? leadForm.fields : ['name', 'email']
  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    try {
      const result = await submitLead(slug, form)
      setMessage(result.message)
      setStatus('success')
    } catch (err) {
      setMessage(err.message)
      setStatus('error')
    }
  }

  return (
    <section className="bg-cream py-20 sm:py-24" id="lead-form">
      <div className="container-page">
        <Reveal className="mx-auto max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-3xl border border-line bg-white p-8">
            {status === 'success' ? (
              <p role="status" className="text-center text-sm text-stone-dark">
                {message}
              </p>
            ) : (
              <>
                {fields.includes('name') && (
                  <input
                    required
                    type="text"
                    placeholder="Name"
                    value={form.name}
                    onChange={update('name')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                  />
                )}
                {fields.includes('email') && (
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={update('email')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                  />
                )}
                {fields.includes('phone') && (
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={update('phone')}
                    disabled={status === 'submitting'}
                    className={fieldClasses}
                  />
                )}
                {status === 'error' && (
                  <p role="alert" className="text-sm text-red-600">
                    {message}
                  </p>
                )}
                <Button type="submit" disabled={status === 'submitting'} className="justify-center">
                  {status === 'submitting' ? 'Sending…' : 'Notify Me'}
                </Button>
              </>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  )
}
