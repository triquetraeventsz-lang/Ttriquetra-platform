import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { FormField, TextInput, TextArea, Select } from '../components/FormField.jsx'
import { ImageField } from '../components/MediaPicker.jsx'
import { RepeatingList } from '../components/RepeatingList.jsx'
import { Toggle } from '../components/Toggle.jsx'

const EMPTY_FORM = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  heroImage: '',
  gallery: [],
  capabilities: [],
  processSteps: [],
  seo: { title: '', description: '', ogImage: '', canonical: '', indexable: true },
  status: 'DRAFT',
  displayOrder: 0,
}

export function ServiceEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data, loading } = useApi(`/api/admin/services/${id}`, { skip: isNew })
  const [form, setForm] = useState(isNew ? EMPTY_FORM : null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (data) setForm({ ...EMPTY_FORM, ...data, seo: { ...EMPTY_FORM.seo, ...data.seo } })
  }, [data])

  if (!isNew && (loading || !form)) return <p className="text-sm text-stone">Loading…</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function setSeo(field, value) {
    setForm((f) => ({ ...f, seo: { ...f.seo, [field]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        const created = await api.post('/api/admin/services', form)
        navigate(`/services/${created._id}`, { replace: true })
      } else {
        await api.put(`/api/admin/services/${id}`, form)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => navigate('/services')} className="flex items-center gap-1.5 text-sm text-stone hover:text-ink-soft">
        <ArrowLeft size={14} /> Back to Services
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">{isNew ? 'New Service' : form.name}</h1>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" htmlFor="name">
            <TextInput id="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" hint="Leave blank to auto-generate from the name.">
            <TextInput id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Short Description" htmlFor="shortDescription">
          <TextArea id="shortDescription" rows={2} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} />
        </FormField>
        <FormField label="Full Description" htmlFor="fullDescription">
          <TextArea id="fullDescription" rows={5} value={form.fullDescription} onChange={(e) => set('fullDescription', e.target.value)} />
        </FormField>
        <ImageField label="Hero Image" value={form.heroImage} onChange={(url) => set('heroImage', url)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status" htmlFor="status">
            <Select id="status" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </FormField>
          <FormField label="Display Order" htmlFor="displayOrder">
            <TextInput
              id="displayOrder"
              type="number"
              value={form.displayOrder}
              onChange={(e) => set('displayOrder', Number(e.target.value))}
            />
          </FormField>
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

      <div className="space-y-3 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Capabilities</h2>
        <RepeatingList
          items={form.capabilities}
          onChange={(capabilities) => set('capabilities', capabilities)}
          newItem={() => ({ title: '', description: '' })}
          addLabel="Add capability"
          renderItem={(item, update) => (
            <div className="space-y-2">
              <TextInput placeholder="Title" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} />
              <TextArea
                placeholder="Description"
                rows={2}
                value={item.description || ''}
                onChange={(e) => update({ ...item, description: e.target.value })}
              />
            </div>
          )}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Process Steps</h2>
        <RepeatingList
          items={form.processSteps}
          onChange={(processSteps) => set('processSteps', processSteps)}
          newItem={() => ({ title: '', description: '', hidden: false })}
          addLabel="Add step"
          renderItem={(item, update) => (
            <div className="space-y-2">
              <TextInput placeholder="Title" value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} />
              <TextArea
                placeholder="Description"
                rows={2}
                value={item.description || ''}
                onChange={(e) => update({ ...item, description: e.target.value })}
              />
              <Toggle label="Hidden from public site" checked={!!item.hidden} onChange={(v) => update({ ...item, hidden: v })} />
            </div>
          )}
        />
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
        <FormField label="Canonical URL" htmlFor="canonical">
          <TextInput id="canonical" value={form.seo.canonical} onChange={(e) => setSeo('canonical', e.target.value)} />
        </FormField>
        <Toggle label="Indexable" checked={form.seo.indexable} onChange={(v) => setSeo('indexable', v)} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create service' : 'Save changes'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
