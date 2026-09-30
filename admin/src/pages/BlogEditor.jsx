import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../lib/api.js'
import { useApi } from '../lib/useApi.js'
import { FormField, TextInput, TextArea } from '../components/FormField.jsx'
import { ImageField } from '../components/MediaPicker.jsx'
import { RichTextEditor } from '../components/RichTextEditor.jsx'
import { Badge } from '../components/Badge.jsx'
import { toDateTimeLocal, fromDateTimeLocal } from '../lib/date.js'

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: '',
  publishAt: '',
  seoTitle: '',
  metaDescription: '',
  ogImage: '',
  canonicalUrl: '',
}

export function BlogEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { data, loading, refetch } = useApi(`/api/admin/blogs/${id}`, { skip: isNew })
  const [form, setForm] = useState(isNew ? EMPTY_FORM : null)
  const [status, setStatus] = useState('DRAFT')
  const [saving, setSaving] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY_FORM,
        ...data,
        tags: (data.tags || []).join(', '),
        publishAt: toDateTimeLocal(data.publishAt),
      })
      setStatus(data.status)
    }
  }, [data])

  if (!isNew && (loading || !form)) return <p className="text-sm text-stone">Loading…</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function buildPayload() {
    return {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      publishAt: fromDateTimeLocal(form.publishAt),
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        const created = await api.post('/api/admin/blogs', buildPayload())
        navigate(`/blogs/${created._id}`, { replace: true })
      } else {
        await api.put(`/api/admin/blogs/${id}`, buildPayload())
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
      const updated = await api.post(`/api/admin/blogs/${id}/${action}`)
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
      <button onClick={() => navigate('/blogs')} className="flex items-center gap-1.5 text-sm text-stone hover:text-ink-soft">
        <ArrowLeft size={14} /> Back to Blogs
      </button>

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-soft">{isNew ? 'New Post' : form.title}</h1>
        {!isNew && <Badge>{status}</Badge>}
      </div>

      {!isNew && (
        <div className="flex gap-2">
          {status !== 'PUBLISHED' && (
            <button
              onClick={() => handleTransition('publish')}
              disabled={transitioning}
              className="rounded-lg bg-gold px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
            >
              Publish
            </button>
          )}
          {status === 'PUBLISHED' && (
            <button
              onClick={() => handleTransition('unpublish')}
              disabled={transitioning}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-paper disabled:opacity-60"
            >
              Unpublish
            </button>
          )}
          {status !== 'ARCHIVED' && (
            <button
              onClick={() => handleTransition('archive')}
              disabled={transitioning}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-stone hover:bg-paper disabled:opacity-60"
            >
              Archive
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
        <FormField label="Excerpt" htmlFor="excerpt">
          <TextArea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
        </FormField>
        <FormField label="Content">
          <RichTextEditor value={form.content} onChange={(html) => set('content', html)} />
        </FormField>
        <ImageField label="Featured Image" value={form.featuredImage} onChange={(url) => set('featuredImage', url)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" htmlFor="category">
            <TextInput id="category" value={form.category} onChange={(e) => set('category', e.target.value)} />
          </FormField>
          <FormField label="Tags" htmlFor="tags" hint="Comma separated.">
            <TextInput id="tags" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
          </FormField>
        </div>
        <FormField label="Publish At" htmlFor="publishAt" hint="Used when status is Scheduled.">
          <TextInput id="publishAt" type="datetime-local" value={form.publishAt} onChange={(e) => set('publishAt', e.target.value)} />
        </FormField>
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
        <FormField label="Canonical URL" htmlFor="canonicalUrl">
          <TextInput id="canonicalUrl" value={form.canonicalUrl} onChange={(e) => set('canonicalUrl', e.target.value)} />
        </FormField>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create post' : 'Save changes'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
