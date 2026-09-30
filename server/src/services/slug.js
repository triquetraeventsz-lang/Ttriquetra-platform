export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generates a unique slug for `model`, appending -2, -3, ... on collision.
 * `excludeId` lets an update keep its own existing slug without colliding
 * with itself.
 */
export async function uniqueSlug(model, text, excludeId = null) {
  const base = slugify(text)
  let candidate = base
  let suffix = 2

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug: candidate }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await model.findOne(query).select('_id').lean()
    if (!existing) return candidate
    candidate = `${base}-${suffix}`
    suffix += 1
  }
}
