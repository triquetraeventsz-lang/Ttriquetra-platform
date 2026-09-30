import { useEffect, useState } from 'react'
import { useApi } from '../../lib/useApi.js'
import { api } from '../../lib/api.js'
import { FormField, TextInput, TextArea } from '../../components/FormField.jsx'

const EMPTY_FORM = {
  siteTitle: '',
  defaultDescription: '',
  defaultOgImage: '',
  canonicalDomain: '',
  organizationName: '',
  organizationLogo: '',
  organizationAddress: '',
  organizationPhone: '',
  organizationEmail: '',
  socialLinks: { instagram: '', linkedin: '' },
}

export function SiteSettings() {
  const { data, loading, error } = useApi('/api/admin/seo')
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (data) setForm({ ...EMPTY_FORM, ...data, socialLinks: { ...EMPTY_FORM.socialLinks, ...data.socialLinks } })
  }, [data])

  if (loading || !form) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function setSocial(field, value) {
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [field]: value } }))
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      await api.put('/api/admin/seo', form)
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
        <h1 className="font-display text-2xl font-semibold text-ink-soft">Site Settings</h1>
        <p className="text-sm text-stone">Global SEO defaults and organization details used across the public site.</p>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">SEO Defaults</h2>
        <FormField label="Site Title" htmlFor="siteTitle">
          <TextInput id="siteTitle" value={form.siteTitle} onChange={(e) => set('siteTitle', e.target.value)} />
        </FormField>
        <FormField label="Default Description" htmlFor="defaultDescription">
          <TextArea id="defaultDescription" rows={3} value={form.defaultDescription} onChange={(e) => set('defaultDescription', e.target.value)} />
        </FormField>
        <FormField label="Default OG Image" htmlFor="defaultOgImage">
          <TextInput id="defaultOgImage" value={form.defaultOgImage} onChange={(e) => set('defaultOgImage', e.target.value)} />
        </FormField>
        <FormField label="Canonical Domain" htmlFor="canonicalDomain">
          <TextInput id="canonicalDomain" value={form.canonicalDomain} onChange={(e) => set('canonicalDomain', e.target.value)} />
        </FormField>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Organization</h2>
        <FormField label="Name" htmlFor="organizationName">
          <TextInput id="organizationName" value={form.organizationName} onChange={(e) => set('organizationName', e.target.value)} />
        </FormField>
        <FormField label="Logo URL" htmlFor="organizationLogo">
          <TextInput id="organizationLogo" value={form.organizationLogo} onChange={(e) => set('organizationLogo', e.target.value)} />
        </FormField>
        <FormField label="Address" htmlFor="organizationAddress">
          <TextArea id="organizationAddress" rows={2} value={form.organizationAddress} onChange={(e) => set('organizationAddress', e.target.value)} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Phone" htmlFor="organizationPhone">
            <TextInput id="organizationPhone" value={form.organizationPhone} onChange={(e) => set('organizationPhone', e.target.value)} />
          </FormField>
          <FormField label="Email" htmlFor="organizationEmail">
            <TextInput id="organizationEmail" value={form.organizationEmail} onChange={(e) => set('organizationEmail', e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-cream p-5">
        <h2 className="text-sm font-semibold text-ink-soft">Social Links</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Instagram" htmlFor="instagram">
            <TextInput id="instagram" value={form.socialLinks.instagram} onChange={(e) => setSocial('instagram', e.target.value)} />
          </FormField>
          <FormField label="LinkedIn" htmlFor="linkedin">
            <TextInput id="linkedin" value={form.socialLinks.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {saved && <p className="text-sm text-green-700">Saved.</p>}
        {saveError && <p className="text-sm text-red-600">{saveError}</p>}
      </div>
    </div>
  )
}
