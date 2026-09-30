import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { FormField, TextInput, TextArea } from '../components/FormField.jsx'
import { ImageField } from '../components/MediaPicker.jsx'
import { RepeatingList } from '../components/RepeatingList.jsx'
import { Toggle } from '../components/Toggle.jsx'
import { Badge } from '../components/Badge.jsx'

const EMPTY_FORM = {
  title: '',
  slug: '',
  client: '',
  industry: '',
  services: [],
  challenge: '',
  approach: '',
  execution: '',
  outcome: '',
  gallery: [],
  featuredImage: '',
  video: '',
  featured: false,
  seoTitle: '',
  metaDescription: '',
  ogImage: '',
}

export function CaseStudyEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data, loading, refetch } = useApi(`/api/admin/case-studies/${id}`, { skip: isNew })
  const { data: servicesData } = useApi('/api/admin/services?limit=100')
  const [form, setForm] = useState(isNew ? EMPTY_FORM : null)
  const [status, setStatus] = useState('DRAFT')
  const [saving, setSaving] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (data) {
      setForm({ ...EMPTY_FORM, ...data, services: (data.services || []).map((s) => (typeof s === 'string' ? s : s._id)) })
      setStatus(data.status)
    }
  }, [data])

  if (!isNew && (loading || !form)) return <p className="text-sm text-stone">Loading…</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleService(serviceId) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(serviceId) ? f.services.filter((s) => s !== serviceId) : [...f.services, serviceId],
    }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        const created = await api.post('/api/admin/case-studies', form)
        navigate(`/case-studies/${created._id}`, { replace: true })
      } else {
        await api.put(`/api/admin/case-studies/${id}`, form)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTransition(action) {
    setTransitioning(true)
    setError('')
    try {
      const updated = await api.post(`/api/admin/case-studies/${id}/${action}`)
      setStatus(updated.status)
      await refetch()
    } catch (err) {
      setError(err.message)
    } finally {
      setTransitioning(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/case-studies')} className="flex items-center gap-1.5 text-sm text-stone hover:text-ink-soft">
        <ArrowLeft size={14} /> Back to Case Studies
      </button>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-soft">{isNew ? 'New Case Study' : form.title}</h1>
        {!isNew && <Badge>{status}</Badge>}
      </div>

      {!isNew && (
        <div className="flex gap-2">
          {status !== 'PUBLISHED' ? (
            <button
              onClick={() => handleTransition('publish')}
              disabled={transitioning}
              className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
            >
              Publish
            </button>
          ) : (
            <button
              onClick={() => handleTransition('unpublish')}
              disabled={transitioning}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-paper disabled:opacity-60"
            >
              Unpublish
            </button>
          )}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Title" htmlFor="title">
            <TextInput id="title" value={form.title} onChange={(e) => set('title', e.target.value)} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the title.">
            <TextInput id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Client" htmlFor="client">
            <TextInput id="client" value={form.client} onChange={(e) => set('client', e.target.value)} />
          </FormField>
          <FormField label="Industry" htmlFor="industry">
            <TextInput id="industry" value={form.industry} onChange={(e) => set('industry', e.target.value)} />
          </FormField>
        </div>

        <FormField label="Related Services">
          <div className="flex flex-wrap gap-3">
            {(servicesData?.items || []).map((s) => (
              <label key={s._id} className="flex items-center gap-1.5 text-sm text-ink-soft">
                <input type="checkbox" checked={form.services.includes(s._id)} onChange={() => toggleService(s._id)} />
                {s.name}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Challenge" htmlFor="challenge">
          <TextArea id="challenge" rows={3} value={form.challenge} onChange={(e) => set('challenge', e.target.value)} />
        </FormField>
        <FormField label="Approach" htmlFor="approach">
          <TextArea id="approach" rows={3} value={form.approach} onChange={(e) => set('approach', e.target.value)} />
        </FormField>
        <FormField label="Execution" htmlFor="execution">
          <TextArea id="execution" rows={3} value={form.execution} onChange={(e) => set('execution', e.target.value)} />
        </FormField>
        <FormField label="Outcome" htmlFor="outcome">
          <TextArea id="outcome" rows={3} value={form.outcome} onChange={(e) => set('outcome', e.target.value)} />
        </FormField>

        <ImageField label="Featured Image" value={form.featuredImage} onChange={(url) => set('featuredImage', url)} />
        <FormField label="Video URL" htmlFor="video">
          <TextInput id="video" value={form.video} onChange={(e) => set('video', e.target.value)} />
        </FormField>
        <Toggle label="Featured case study" checked={form.featured} onChange={(v) => set('featured', v)} />
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

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">SEO</h2>
        <FormField label="SEO Title" htmlFor="seoTitle">
          <TextInput id="seoTitle" value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
        </FormField>
        <FormField label="Meta Description" htmlFor="metaDescription">
          <TextArea id="metaDescription" rows={2} value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
        </FormField>
        <ImageField label="OG Image" value={form.ogImage} onChange={(url) => set('ogImage', url)} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create case study' : 'Save changes'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
