const TONES = {
  green: 'bg-green-100 text-green-800',
  gray: 'bg-stone/10 text-stone-dark',
  gold: 'bg-gold/15 text-gold-dark',
  red: 'bg-red-100 text-red-700',
}

const STATUS_TONE = {
  ACTIVE: 'green',
  PUBLISHED: 'green',
  INACTIVE: 'gray',
  DRAFT: 'gray',
  SCHEDULED: 'gold',
  ARCHIVED: 'gray',
  EXPIRED: 'red',
  COMPLETED: 'gray',
}

export function Badge({ children, tone }) {
  const resolved = tone || STATUS_TONE[children] || 'gray'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[resolved]}`}>
      {children}
    </span>
  )
}
