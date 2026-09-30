import { useEffect, useState } from 'react'
import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'
import { useApi } from '../lib/useApi.js'
import { api } from '../lib/api.js'
import { reorder, move } from '../lib/array.js'
import { Toggle } from '../components/Toggle.jsx'
import { FormField, TextInput } from '../components/FormField.jsx'

function ItemRow({ item, onChange, onRemove, onMove, isFirst, isLast, depth = 0 }) {
  return (
    <div className={`flex items-center gap-2 ${depth ? 'ml-6' : ''}`}>
      <div className="flex flex-col">
        <button type="button" disabled={isFirst} onClick={() => onMove(-1)} className="text-stone hover:text-ink disabled:opacity-30">
          <ChevronUp size={14} />
        </button>
        <button type="button" disabled={isLast} onClick={() => onMove(1)} className="text-stone hover:text-ink disabled:opacity-30">
          <ChevronDown size={14} />
        </button>
      </div>
      <TextInput
        className="w-40"
        value={item.label}
        onChange={(e) => onChange({ ...item, label: e.target.value })}
        placeholder="Label"
      />
      <TextInput className="w-40" value={item.to} onChange={(e) => onChange({ ...item, to: e.target.value })} placeholder="/path" />
      <Toggle checked={item.enabled !== false} onChange={(v) => onChange({ ...item, enabled: v })} />
      <button type="button" onClick={onRemove} className="ml-auto text-stone hover:text-red-600">
        <Trash2 size={15} />
      </button>
    </div>
  )
}

export function Navigation() {
  const { data, loading, error } = useApi('/api/admin/navigation')
  const [items, setItems] = useState(null)
  const [ctaLabel, setCtaLabel] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) {
      setItems(data.items || [])
      setCtaLabel(data.ctaLabel || '')
      setCtaUrl(data.ctaUrl || '')
    }
  }, [data])

  if (loading || !items) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  function updateItem(index, next) {
    setItems((prev) => prev.map((it, i) => (i === index ? next : it)))
  }

  function updateChild(itemIndex, childIndex, next) {
    setItems((prev) =>
      prev.map((it, i) => (i === itemIndex ? { ...it, children: it.children.map((c, ci) => (ci === childIndex ? next : c)) } : it)),
    )
  }

  function addItem() {
    setItems((prev) => reorder([...prev, { label: 'New Item', to: '/', enabled: true, children: [] }]))
  }

  function addChild(itemIndex) {
    setItems((prev) =>
      prev.map((it, i) =>
        i === itemIndex ? { ...it, children: reorder([...(it.children || []), { label: 'New Item', to: '/', enabled: true }]) } : it,
      ),
    )
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      await api.put('/api/admin/navigation', { items, ctaLabel, ctaUrl })
      setSaved(true)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Navigation</h1>
        <p className="text-sm text-stone">Reorder, rename or disable the main site menu. Changes apply to the live site immediately on save.</p>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        {items.map((item, i) => (
          <div key={i} className="space-y-2">
            <ItemRow
              item={item}
              isFirst={i === 0}
              isLast={i === items.length - 1}
              onChange={(next) => updateItem(i, next)}
              onRemove={() => setItems((prev) => reorder(prev.filter((_, idx) => idx !== i)))}
              onMove={(dir) => setItems((prev) => move(prev, i, dir))}
            />
            {(item.children || []).map((child, ci) => (
              <ItemRow
                key={ci}
                depth={1}
                item={child}
                isFirst={ci === 0}
                isLast={ci === item.children.length - 1}
                onChange={(next) => updateChild(i, ci, next)}
                onRemove={() => updateItem(i, { ...item, children: reorder(item.children.filter((_, idx) => idx !== ci)) })}
                onMove={(dir) => updateItem(i, { ...item, children: move(item.children, ci, dir) })}
              />
            ))}
            <button
              type="button"
              onClick={() => addChild(i)}
              className="ml-6 flex items-center gap-1 text-xs text-stone hover:text-gold-dark"
            >
              <Plus size={12} /> Add sub-item
            </button>
          </div>
        ))}

        <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-stone hover:text-gold-dark">
          <Plus size={14} /> Add menu item
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-line bg-cream p-5">
        <FormField label="CTA Label" htmlFor="ctaLabel">
          <TextInput id="ctaLabel" value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} />
        </FormField>
        <FormField label="CTA URL" htmlFor="ctaUrl">
          <TextInput id="ctaUrl" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} />
        </FormField>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save navigation'}
        </button>
        {saved && <p className="text-sm text-green-700">Saved.</p>}
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      </div>
    </div>
  )
}
