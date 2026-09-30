export function FormField({ label, htmlFor, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-stone">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold'

export function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputClass} ${props.className || ''}`} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputClass} ${props.className || ''}`}>
      {children}
    </select>
  )
}
