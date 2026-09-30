import { useState } from 'react'
import { Drawer } from './Drawer.jsx'
import { FormField, TextInput, TextArea, Select } from './FormField.jsx'
import { ImageField } from './MediaPicker.jsx'
import { Toggle } from './Toggle.jsx'
import { toDateTimeLocal, fromDateTimeLocal } from '../lib/date.js'

const EMPTY_FORM = {
  name: '',
  internalDescription: '',
  publicHeadline: '',
  publicMessage: '',
  image: '',
  video: '',
  ctaLabel: '',
  ctaUrl: '',
  startAt: '',
  endAt: '',
  status: 'DRAFT',
  priority: 0,
  showOnMainWebsite: false,
  showOnLandingPage: true,
}

/**
 * Add/edit a single CampaignPhase, scoped to one event. `phase` is null for
 * "add new", or an existing phase object for editing. The parent keys this
 * component by `phase?._id ?? 'new'` so React remounts it (fresh form
 * state) whenever the target phase changes, instead of diffing/re-seeding
 * state in place.
 */
export function CampaignPhaseDrawer({ open, phase, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(() =>
    phase
      ? { ...EMPTY_FORM, ...phase, startAt: toDateTimeLocal(phase.startAt), endAt: toDateTimeLocal(phase.endAt) }
      : EMPTY_FORM,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await onSave({ ...form, startAt: fromDateTimeLocal(form.startAt), endAt: fromDateTimeLocal(form.endAt) })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={phase ? 'Edit Phase' : 'New Phase'}
      footer={
        <div className="flex items-center justify-between gap-3">
          {phase && (
            <button onClick={() => onDelete(phase)} className="text-sm text-red-600 hover:underline">
              Delete
            </button>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
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
        <FormField label="Name" htmlFor="phase-name" hint="Internal name, for the admin list only.">
          <TextInput id="phase-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
        </FormField>
        <FormField label="Internal Description" htmlFor="phase-internalDescription">
          <TextArea
            id="phase-internalDescription"
            rows={2}
            value={form.internalDescription}
            onChange={(e) => set('internalDescription', e.target.value)}
          />
        </FormField>
        <FormField label="Public Headline" htmlFor="phase-publicHeadline">
          <TextInput id="phase-publicHeadline" value={form.publicHeadline} onChange={(e) => set('publicHeadline', e.target.value)} />
        </FormField>
        <FormField label="Public Message" htmlFor="phase-publicMessage">
          <TextArea id="phase-publicMessage" rows={3} value={form.publicMessage} onChange={(e) => set('publicMessage', e.target.value)} />
        </FormField>
        <ImageField label="Image" value={form.image} onChange={(url) => set('image', url)} />
        <FormField label="Video URL" htmlFor="phase-video">
          <TextInput id="phase-video" value={form.video} onChange={(e) => set('video', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="CTA Label" htmlFor="phase-ctaLabel">
            <TextInput id="phase-ctaLabel" value={form.ctaLabel} onChange={(e) => set('ctaLabel', e.target.value)} />
          </FormField>
          <FormField label="CTA URL" htmlFor="phase-ctaUrl">
            <TextInput id="phase-ctaUrl" value={form.ctaUrl} onChange={(e) => set('ctaUrl', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Starts At" htmlFor="phase-startAt">
            <TextInput id="phase-startAt" type="datetime-local" value={form.startAt} onChange={(e) => set('startAt', e.target.value)} />
          </FormField>
          <FormField label="Ends At" htmlFor="phase-endAt">
            <TextInput id="phase-endAt" type="datetime-local" value={form.endAt} onChange={(e) => set('endAt', e.target.value)} />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Status" htmlFor="phase-status">
            <Select id="phase-status" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </FormField>
          <FormField label="Priority" htmlFor="phase-priority" hint="Higher wins if windows overlap.">
            <TextInput
              id="phase-priority"
              type="number"
              value={form.priority}
              onChange={(e) => set('priority', Number(e.target.value))}
            />
          </FormField>
        </div>
        <Toggle label="Show on main website" checked={form.showOnMainWebsite} onChange={(v) => set('showOnMainWebsite', v)} />
        <Toggle label="Show on event landing page" checked={form.showOnLandingPage} onChange={(v) => set('showOnLandingPage', v)} />
      </div>
    </Drawer>
  )
}
