import { X } from 'lucide-react'

export function Drawer({ open, onClose, title, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-soft">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-stone hover:bg-paper" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-line px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}
