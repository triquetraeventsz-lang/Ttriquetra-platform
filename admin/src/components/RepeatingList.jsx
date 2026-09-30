import { ChevronUp, ChevronDown, Trash2, Plus } from 'lucide-react'
import { reorder, move } from '../lib/array.js'

/**
 * Generic add/remove/reorder list, shared by every field shaped like an
 * array of small records (Service capabilities, process steps, galleries).
 * The caller supplies `renderItem` for the row body and `newItem` for what
 * gets appended — this file only owns the list mechanics.
 */
export function RepeatingList({ items, onChange, renderItem, newItem, addLabel = 'Add item' }) {
  function updateItem(index, next) {
    onChange(items.map((it, i) => (i === index ? next : it)))
  }

  function removeItem(index) {
    onChange(reorder(items.filter((_, i) => i !== index)))
  }

  function addItem() {
    onChange(reorder([...items, newItem()]))
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg border border-line bg-cream p-3">
          <div className="flex flex-col pt-1">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => onChange(move(items, i, -1))}
              className="text-stone hover:text-ink disabled:opacity-30"
            >
              <ChevronUp size={14} />
            </button>
            <button
              type="button"
              disabled={i === items.length - 1}
              onClick={() => onChange(move(items, i, 1))}
              className="text-stone hover:text-ink disabled:opacity-30"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <div className="flex-1">{renderItem(item, (next) => updateItem(i, next))}</div>
          <button type="button" onClick={() => removeItem(i)} className="pt-1 text-stone hover:text-red-600">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem} className="flex items-center gap-1 text-sm text-stone hover:text-gold-dark">
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  )
}
