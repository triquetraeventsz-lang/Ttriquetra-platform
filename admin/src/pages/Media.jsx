import { useRef, useState } from 'react'
import { UploadCloud, Trash2 } from 'lucide-react'
import { useApi } from '../lib/useApi.js'
import { api } from '../lib/api.js'

function isImage(item) {
  return item.fileType?.startsWith('image/')
}

export function Media() {
  const { data, loading, error, refetch } = useApi('/api/admin/media?limit=60')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const form = new FormData()
      form.append('file', file)
      await api.post('/api/admin/media', form, { isForm: true })
      await refetch()
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.filename}"?`)) return
    await api.del(`/api/admin/media/${item._id}`)
    await refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-soft">Media</h1>
          <p className="text-sm text-stone">Images and videos used across services, blogs and case studies.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
        >
          <UploadCloud size={15} /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,video/mp4" className="hidden" onChange={handleUpload} />
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : data.items.length === 0 ? (
        <p className="rounded-xl border border-line bg-cream/50 p-8 text-center text-sm text-stone">
          No media uploaded yet. Files you upload here can be picked from any image field.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {data.items.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl border border-line bg-cream">
              <div className="aspect-square bg-paper">
                {isImage(item) ? (
                  <img src={item.url} alt={item.altText || item.filename} className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center p-2 text-center text-xs text-stone">{item.filename}</span>
                )}
              </div>
              <p className="truncate px-2 py-1.5 text-xs text-stone">{item.filename}</p>
              <button
                onClick={() => handleDelete(item)}
                className="absolute right-1.5 top-1.5 rounded-full bg-ink/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
