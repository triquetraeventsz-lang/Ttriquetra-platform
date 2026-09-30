import { useEffect, useRef, useState } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { api } from '../lib/api.js'
import { Drawer } from './Drawer.jsx'

function isImage(item) {
  return item.fileType?.startsWith('image/')
}

/**
 * Modal for choosing an existing upload or adding a new one, used from
 * every image field across the content editors. Talks to the same
 * `/api/admin/media` endpoints as the standalone Media library page.
 */
export function MediaPicker({ open, onClose, onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError('')
    api
      .get('/api/admin/media?limit=60')
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [open])

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const media = await api.post('/api/admin/media', form, { isForm: true })
      setItems((prev) => [media, ...prev])
      onSelect(media.url)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Choose media">
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line py-4 text-sm text-stone hover:border-gold hover:text-gold-dark disabled:opacity-60"
        >
          <UploadCloud size={16} />
          {uploading ? 'Uploading…' : 'Upload new file'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,video/mp4" className="hidden" onChange={handleUpload} />

        {error && <p className="text-xs text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-stone">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-stone">No media uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {items.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  onSelect(item.url)
                  onClose()
                }}
                className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-paper"
                title={item.filename}
              >
                {isImage(item) ? (
                  <img src={item.url} alt={item.altText || item.filename} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center p-2 text-center text-[10px] text-stone">
                    {item.filename}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  )
}

/**
 * Form field pairing a thumbnail + URL with a "Choose" button that opens
 * MediaPicker — the reusable shape for every image field in the content
 * editors (hero images, featured images, gallery slots).
 */
export function ImageField({ label, value, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-ink-soft">{label}</label>}
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-0.5 top-0.5 rounded-full bg-ink/60 p-0.5 text-white"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-line text-stone">
            <UploadCloud size={16} />
          </div>
        )}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft hover:bg-paper"
        >
          {value ? 'Change' : 'Choose image'}
        </button>
      </div>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onChange} />
    </div>
  )
}
