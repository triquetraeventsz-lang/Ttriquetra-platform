import { useEffect, useState } from 'react'
import { useApi } from '../lib/useApi.js'
import { api } from '../lib/api.js'
import { FormField, TextInput, TextArea, Select } from '../components/FormField.jsx'
import { Toggle } from '../components/Toggle.jsx'
import { toDateTimeLocal, fromDateTimeLocal } from '../lib/date.js'

const EMPTY_FORM = {
  enabled: false,
  eventId: '',
  displayType: 'bar',
  headline: '',
  message: '',
  ctaLabel: '',
  ctaUrl: '',
  startAt: '',
  endAt: '',
  frequency: 'once-per-session',
}

export function Announcement() {
  const { data, loading, error } = useApi('/api/admin/announcement')
  const { data: eventsData } = useApi('/api/admin/events?limit=100')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY_FORM,
        ...data,
        eventId: data.eventId || '',
        startAt: toDateTimeLocal(data.startAt),
        endAt: toDateTimeLocal(data.endAt),
      })
    }
  }, [data])

  if (loading || !form) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      await api.put('/api/admin/announcement', {
        ...form,
        eventId: form.eventId || undefined,
        startAt: fromDateTimeLocal(form.startAt),
        endAt: fromDateTimeLocal(form.endAt),
      })
      setSaved(true)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Announcement</h1>
        <p className="text-sm text-stone">A site-wide bar or modal on the main website — usually tied to an event campaign phase.</p>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <Toggle label="Enabled" checked={form.enabled} onChange={(v) => set('enabled', v)} />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Display Type" htmlFor="displayType">
            <Select id="displayType" value={form.displayType} onChange={(e) => set('displayType', e.target.value)}>
              <option value="bar">Bar</option>
              <option value="modal">Modal</option>
            </Select>
          </FormField>
          <FormField label="Frequency" htmlFor="frequency" hint="How often a dismissing visitor sees it again.">
            <Select id="frequency" value={form.frequency} onChange={(e) => set('frequency', e.target.value)}>
              <option value="always">Always</option>
              <option value="once-per-session">Once per session</option>
              <option value="once-per-day">Once per day</option>
            </Select>
          </FormField>
        </div>

        <FormField label="Related Event (optional)" htmlFor="eventId">
          <Select id="eventId" value={form.eventId} onChange={(e) => set('eventId', e.target.value)}>
            <option value="">None</option>
            {(eventsData?.items || []).map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Headline" htmlFor="headline">
          <TextInput id="headline" value={form.headline} onChange={(e) => set('headline', e.target.value)} />
        </FormField>
        <FormField label="Message" htmlFor="message">
          <TextArea id="message" rows={2} value={form.message} onChange={(e) => set('message', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA Label" htmlFor="ctaLabel">
            <TextInput id="ctaLabel" value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} />
          </FormField>
          <FormField label="CTA URL" htmlFor="ctaUrl">
            <TextInput id="ctaUrl" value={form.ctaUrl} onChange={(e) => set('ctaUrl', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Starts At" htmlFor="startAt" hint="Leave blank to start immediately.">
            <TextInput id="startAt" type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </FormField>
          <FormField label="Ends At" htmlFor="endAt" hint="Leave blank for no end date.">
            <TextInput id="endAt" type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save announcement'}
        </button>
        {saved && <p className="text-sm text-green-700">Saved.</p>}
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      </div>
    </div>
  )
}
