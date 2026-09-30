import { useState } from 'react'
import { useApi } from '../lib/useApi.js'
import { api } from '../lib/api.js'
import { Table } from '../components/Table.jsx'
import { Badge } from '../components/Badge.jsx'
import { Drawer } from '../components/Drawer.jsx'
import { Toggle } from '../components/Toggle.jsx'
import { FormField, TextInput, TextArea } from '../components/FormField.jsx'

const EMPTY_FORM = {
  status: 'ACTIVE',
  visible: true,
  showInNavigation: true,
  indexable: true,
  title: '',
  metaDescription: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  canonicalUrl: '',
}

export function Pages() {
  const { data: pages, loading, error, refetch } = useApi('/api/admin/pages')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  function openPage(page) {
    setSelected(page)
    setForm({ ...EMPTY_FORM, ...page })
    setSaveError('')
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      await api.put(`/api/admin/pages/${selected.slug}`, form)
      setSelected(null)
      await refetch()
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function quickToggle(page, field) {
    await api.put(`/api/admin/pages/${page.slug}`, { [field]: !page[field] })
    await refetch()
  }

  if (loading) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Pages</h1>
        <p className="text-sm text-stone">Visibility and SEO for the site's existing pages. No content editor here — page layouts live in code.</p>
      </div>

      <Table
        rows={pages}
        keyField="slug"
        onRowClick={openPage}
        columns={[
          { key: 'name', header: 'Page' },
          { key: 'status', header: 'Status', render: (p) => <Badge>{p.status}</Badge> },
          {
            key: 'showInNavigation',
            header: 'In Navigation',
            render: (p) => (
              <span onClick={(e) => e.stopPropagation()}>
                <Toggle checked={p.showInNavigation} onChange={() => quickToggle(p, 'showInNavigation')} />
              </span>
            ),
          },
          {
            key: 'indexable',
            header: 'Indexable',
            render: (p) => (
              <span onClick={(e) => e.stopPropagation()}>
                <Toggle checked={p.indexable} onChange={() => quickToggle(p, 'indexable')} />
              </span>
            ),
          },
          { key: 'title', header: 'SEO Title' },
        ]}
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name}
        footer={
          <div className="flex items-center justify-between gap-3">
            {saveError && <p className="text-xs text-red-600">{saveError}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="ml-auto rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Toggle
              label="Active"
              checked={form.status === 'ACTIVE'}
              onChange={(v) => setForm((f) => ({ ...f, status: v ? 'ACTIVE' : 'INACTIVE' }))}
            />
            <Toggle
              label="Show in navigation"
              checked={form.showInNavigation}
              onChange={(v) => setForm((f) => ({ ...f, showInNavigation: v }))}
            />
            <Toggle label="Indexable" checked={form.indexable} onChange={(v) => setForm((f) => ({ ...f, indexable: v }))} />
          </div>

          <FormField label="SEO Title" htmlFor="title">
            <TextInput id="title" value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>
          <FormField label="Meta Description" htmlFor="metaDescription">
            <TextArea
              id="metaDescription"
              rows={3}
              value={form.metaDescription || ''}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
            />
          </FormField>
          <FormField label="OG Title" htmlFor="ogTitle">
            <TextInput id="ogTitle" value={form.ogTitle || ''} onChange={(e) => setForm((f) => ({ ...f, ogTitle: e.target.value }))} />
          </FormField>
          <FormField label="OG Description" htmlFor="ogDescription">
            <TextArea
              id="ogDescription"
              rows={2}
              value={form.ogDescription || ''}
              onChange={(e) => setForm((f) => ({ ...f, ogDescription: e.target.value }))}
            />
          </FormField>
          <FormField label="OG Image URL" htmlFor="ogImage">
            <TextInput id="ogImage" value={form.ogImage || ''} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} />
          </FormField>
          <FormField label="Canonical URL" htmlFor="canonicalUrl">
            <TextInput
              id="canonicalUrl"
              value={form.canonicalUrl || ''}
              onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))}
            />
          </FormField>
        </div>
      </Drawer>
    </div>
  )
}
