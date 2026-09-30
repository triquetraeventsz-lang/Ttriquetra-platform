import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useApi } from '../lib/useApi.js'
import { api } from '../lib/api.js'
import { Badge } from '../components/Badge.jsx'
import { Drawer } from '../components/Drawer.jsx'
import { FormField, TextArea, Select } from '../components/FormField.jsx'

const PAGE_OPTIONS = ['home', 'events', 'brand-activation', 'mice', 'online-marketing', 'other']
const PAGE_LABELS = {
  home: 'Home',
  events: 'Events',
  'brand-activation': 'Brand Activation',
  mice: 'MICE',
  'online-marketing': 'Online Marketing',
  other: 'Other',
}

const EMPTY_FORM = { question: '', answer: '', page: 'home', service: '', order: 0, status: 'PUBLISHED' }

export function FAQs() {
  const { data, loading, error, refetch } = useApi('/api/admin/faqs?limit=200')
  const { data: servicesData } = useApi('/api/admin/services?limit=100')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function openEdit(faq) {
    setSelected(faq)
    setForm({ ...EMPTY_FORM, ...faq, service: faq.service || '' })
    setSaveError('')
  }

  function openCreate() {
    setSelected('new')
    setForm(EMPTY_FORM)
    setSaveError('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const payload = { ...form, service: form.service || undefined }
      if (selected === 'new') {
        await api.post('/api/admin/faqs', payload)
      } else {
        await api.put(`/api/admin/faqs/${selected._id}`, payload)
      }
      setSelected(null)
      await refetch()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this FAQ?')) return
    await api.del(`/api/admin/faqs/${selected._id}`)
    setSelected(null)
    await refetch()
  }

  if (loading) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  const grouped = PAGE_OPTIONS.map((page) => ({
    page,
    items: data.items.filter((f) => f.page === page).sort((a, b) => a.order - b.order),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-soft">FAQs</h1>
          <p className="text-sm text-stone">Grouped by which page they appear on.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark"
        >
          <Plus size={15} /> New FAQ
        </button>
      </div>

      {grouped.length === 0 && <p className="rounded-xl border border-line bg-cream/50 p-8 text-center text-sm text-stone">No FAQs yet.</p>}

      {grouped.map(({ page, items }) => (
        <div key={page} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone">{PAGE_LABELS[page]}</h2>
          <div className="divide-y divide-line rounded-xl border border-line bg-cream">
            {items.map((faq) => (
              <button
                key={faq._id}
                onClick={() => openEdit(faq)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-paper"
              >
                <span className="text-sm text-ink-soft">{faq.question}</span>
                <Badge>{faq.status}</Badge>
              </button>
            ))}
          </div>
        </div>
      ))}

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected === 'new' ? 'New FAQ' : 'Edit FAQ'}
        footer={
          <div className="flex items-center justify-between gap-3">
            {selected && selected !== 'new' && (
              <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            )}
            {saveError && <p className="text-xs text-red-600">{saveError}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="ml-auto rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Question" htmlFor="question">
            <TextArea id="question" rows={2} value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
          </FormField>
          <FormField label="Answer" htmlFor="answer">
            <TextArea id="answer" rows={4} value={form.answer} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
          </FormField>
          <FormField label="Page" htmlFor="page">
            <Select id="page" value={form.page} onChange={(e) => setForm((f) => ({ ...f, page: e.target.value }))}>
              {PAGE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {PAGE_LABELS[p]}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Related Service (optional)" htmlFor="service">
            <Select id="service" value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}>
              <option value="">None</option>
              {(servicesData?.items || []).map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Order" htmlFor="order">
              <input
                id="order"
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm outline-none focus:border-gold"
              />
            </FormField>
            <FormField label="Status" htmlFor="status">
              <Select id="status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </FormField>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
