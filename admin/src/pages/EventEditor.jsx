import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Download } from 'lucide-react'
import { api, API_URL } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { FormField, TextInput, TextArea, Select } from '../components/FormField.jsx'
import { ImageField } from '../components/MediaPicker.jsx'
import { RepeatingList } from '../components/RepeatingList.jsx'
import { Toggle } from '../components/Toggle.jsx'
import { Table } from '../components/Table.jsx'
import { Badge } from '../components/Badge.jsx'
import { CampaignPhaseDrawer } from '../components/CampaignPhaseDrawer.jsx'

const SECTION_ROWS = [
  { key: 'hero', label: 'Hero' },
  { key: 'eventDetails', label: 'Event Details' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'timeline', label: 'Timeline', unimplemented: true },
  { key: 'cta', label: 'Call to Action' },
  { key: 'leadForm', label: 'Lead Form' },
  { key: 'faq', label: 'FAQ', unimplemented: true },
  { key: 'footer', label: 'Footer' },
]

const EMPTY_FORM = {
  name: '',
  internalName: '',
  slug: '',
  publicName: '',
  description: '',
  heroImage: '',
  gallery: [],
  venue: '',
  city: '',
  eventDate: '',
  eventTime: '',
  status: 'DRAFT',
  landingPageEnabled: false,
  mainWebsiteEnabled: false,
  sections: Object.fromEntries(SECTION_ROWS.map((s, i) => [s.key, { enabled: true, order: i }])),
  leadForm: { enabled: false, fields: ['name', 'email'], notificationEmail: '', successMessage: "You're on the list." },
  seo: { title: '', description: '', ogImage: '', canonical: '', indexable: true },
}

export function EventEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data, loading } = useApi(`/api/admin/events/${id}`, { skip: isNew })
  const [form, setForm] = useState(isNew ? EMPTY_FORM : null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY_FORM,
        ...data,
        eventDate: data.eventDate ? data.eventDate.slice(0, 10) : '',
        sections: { ...EMPTY_FORM.sections, ...data.sections },
        leadForm: { ...EMPTY_FORM.leadForm, ...data.leadForm },
        seo: { ...EMPTY_FORM.seo, ...data.seo },
      })
    }
  }, [data])

  if (!isNew && (loading || !form)) return <p className="text-sm text-stone">Loading…</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function setSection(key, field, value) {
    setForm((f) => ({ ...f, sections: { ...f.sections, [key]: { ...f.sections[key], [field]: value } } }))
  }

  function setLeadForm(field, value) {
    setForm((f) => ({ ...f, leadForm: { ...f.leadForm, [field]: value } }))
  }

  function toggleLeadField(field) {
    setForm((f) => ({
      ...f,
      leadForm: {
        ...f.leadForm,
        fields: f.leadForm.fields.includes(field) ? f.leadForm.fields.filter((x) => x !== field) : [...f.leadForm.fields, field],
      },
    }))
  }

  function setSeo(field, value) {
    setForm((f) => ({ ...f, seo: { ...f.seo, [field]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : undefined }
      if (isNew) {
        const created = await api.post('/api/admin/events', payload)
        navigate(`/events/${created._id}`, { replace: true })
      } else {
        await api.put(`/api/admin/events/${id}`, payload)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/events')} className="flex items-center gap-1.5 text-sm text-stone hover:text-ink-soft">
        <ArrowLeft size={14} /> Back to Events
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-soft">{isNew ? 'New Event' : form.name}</h1>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Basics</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" htmlFor="name" hint="Internal name, for the admin only.">
            <TextInput id="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" hint="Leave blank to auto-generate. Public URL: /events/:slug">
            <TextInput id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Public Name" htmlFor="publicName" hint="Shown on the public site, if different from the internal name.">
          <TextInput id="publicName" value={form.publicName} onChange={(e) => set('publicName', e.target.value)} />
        </FormField>
        <FormField label="Description" htmlFor="description">
          <TextArea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </FormField>
        <ImageField label="Hero Image" value={form.heroImage} onChange={(url) => set('heroImage', url)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Venue" htmlFor="venue" hint="Leave blank until confirmed — never shown as a placeholder.">
            <TextInput id="venue" value={form.venue} onChange={(e) => set('venue', e.target.value)} />
          </FormField>
          <FormField label="City" htmlFor="city">
            <TextInput id="city" value={form.city} onChange={(e) => set('city', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Event Date" htmlFor="eventDate">
            <TextInput id="eventDate" type="date" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} />
          </FormField>
          <FormField label="Event Time" htmlFor="eventTime" hint="Free text, e.g. 7:00 PM onwards.">
            <TextInput id="eventTime" value={form.eventTime} onChange={(e) => set('eventTime', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <FormField label="Status" htmlFor="status">
            <Select id="status" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </FormField>
          <div className="flex items-end pb-2">
            <Toggle label="Landing page" checked={form.landingPageEnabled} onChange={(v) => set('landingPageEnabled', v)} />
          </div>
          <div className="flex items-end pb-2">
            <Toggle label="Main website" checked={form.mainWebsiteEnabled} onChange={(v) => set('mainWebsiteEnabled', v)} />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Gallery</h2>
        <RepeatingList
          items={form.gallery}
          onChange={(gallery) => set('gallery', gallery)}
          newItem={() => ''}
          addLabel="Add image"
          renderItem={(url, update) => <ImageField value={url} onChange={update} />}
        />
      </div>

      <div className="space-y-2 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Landing Page Sections</h2>
        <p className="text-xs text-stone">Which sections appear on the event landing page, and in what order.</p>
        <div className="divide-y divide-line">
          {SECTION_ROWS.map(({ key, label, unimplemented }) => (
            <div key={key} className="flex items-center gap-3 py-2.5">
              <Toggle checked={form.sections[key]?.enabled ?? true} onChange={(v) => setSection(key, 'enabled', v)} />
              <span className="flex-1 text-sm text-ink-soft">
                {label}
                {unimplemented && <span className="ml-2 text-xs text-stone">(not yet rendered on the public site)</span>}
              </span>
              <input
                type="number"
                value={form.sections[key]?.order ?? 0}
                onChange={(e) => setSection(key, 'order', Number(e.target.value))}
                className="w-16 rounded-lg border border-line bg-white px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Lead Form</h2>
        <Toggle label="Enabled" checked={form.leadForm.enabled} onChange={(v) => setLeadForm('enabled', v)} />
        <FormField label="Fields to collect">
          <div className="flex gap-4">
            {['name', 'email', 'phone'].map((f) => (
              <label key={f} className="flex items-center gap-1.5 text-sm capitalize text-ink-soft">
                <input type="checkbox" checked={form.leadForm.fields.includes(f)} onChange={() => toggleLeadField(f)} />
                {f}
              </label>
            ))}
          </div>
        </FormField>
        <FormField label="Notification Email" htmlFor="notificationEmail" hint="Not exposed publicly.">
          <TextInput
            id="notificationEmail"
            type="email"
            value={form.leadForm.notificationEmail}
            onChange={(e) => setLeadForm('notificationEmail', e.target.value)}
          />
        </FormField>
        <FormField label="Success Message" htmlFor="successMessage">
          <TextInput id="successMessage" value={form.leadForm.successMessage} onChange={(e) => setLeadForm('successMessage', e.target.value)} />
        </FormField>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">SEO</h2>
        <FormField label="SEO Title" htmlFor="seoTitle">
          <TextInput id="seoTitle" value={form.seo.title} onChange={(e) => setSeo('title', e.target.value)} />
        </FormField>
        <FormField label="SEO Description" htmlFor="seoDescription">
          <TextArea id="seoDescription" rows={2} value={form.seo.description} onChange={(e) => setSeo('description', e.target.value)} />
        </FormField>
        <ImageField label="OG Image" value={form.seo.ogImage} onChange={(url) => setSeo('ogImage', url)} />
        <Toggle label="Indexable" checked={form.seo.indexable} onChange={(v) => setSeo('indexable', v)} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create event' : 'Save changes'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {isNew ? (
        <p className="rounded-xl border border-dashed border-line p-5 text-center text-sm text-stone">
          Save the event first to manage campaign phases and leads.
        </p>
      ) : (
        <>
          <CampaignPhases eventId={id} />
          <Leads eventId={id} />
        </>
      )}
    </div>
  )
}

function CampaignPhases({ eventId }) {
  const { data: phases, loading, refetch } = useApi(`/api/admin/events/${eventId}/campaign`)
  const [selected, setSelected] = useState(undefined) // undefined = closed, null = new, object = editing

  async function handleSave(payload) {
    if (selected) {
      await api.put(`/api/admin/campaign/${selected._id}`, payload)
    } else {
      await api.post(`/api/admin/events/${eventId}/campaign`, payload)
    }
    setSelected(undefined)
    await refetch()
  }

  async function handleDelete(phase) {
    if (!confirm(`Delete phase "${phase.name}"?`)) return
    await api.del(`/api/admin/campaign/${phase._id}`)
    setSelected(undefined)
    await refetch()
  }

  return (
    <div className="space-y-3 rounded-xl border border-line bg-cream p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-soft">Campaign Phases</h2>
        <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-sm text-stone hover:text-gold-dark">
          <Plus size={14} /> Add phase
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : (
        <Table
          rows={phases}
          onRowClick={(row) => setSelected(row)}
          emptyMessage="No phases scheduled yet."
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'publicHeadline', header: 'Headline' },
            { key: 'startAt', header: 'Starts', render: (p) => new Date(p.startAt).toLocaleString() },
            { key: 'endAt', header: 'Ends', render: (p) => new Date(p.endAt).toLocaleString() },
            { key: 'status', header: 'Status', render: (p) => <Badge>{p.status}</Badge> },
          ]}
        />
      )}

      <CampaignPhaseDrawer
        key={selected?._id ?? (selected === null ? 'new' : 'closed')}
        open={selected !== undefined}
        phase={selected || null}
        onClose={() => setSelected(undefined)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

function Leads({ eventId }) {
  const { data, loading } = useApi(`/api/admin/events/${eventId}/submissions?limit=50`)

  return (
    <div className="space-y-3 rounded-xl border border-line bg-cream p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink-soft">Leads</h2>
        <a
          href={`${API_URL}/api/admin/events/${eventId}/submissions/export.csv`}
          className="flex items-center gap-1 text-sm text-stone hover:text-gold-dark"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : (
        <Table
          rows={data.items}
          keyField="_id"
          emptyMessage="No leads yet."
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
            { key: 'phone', header: 'Phone' },
            { key: 'createdAt', header: 'Submitted', render: (r) => new Date(r.createdAt).toLocaleString() },
          ]}
        />
      )}
    </div>
  )
}
