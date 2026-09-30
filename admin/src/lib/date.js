export function toDateTimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function fromDateTimeLocal(value) {
  return value ? new Date(value).toISOString() : undefined
}
