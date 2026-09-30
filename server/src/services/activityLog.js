import ActivityLog from '../models/ActivityLog.js'

/**
 * Fire-and-log helper called from controllers after any write. Never
 * throws — a logging failure must not fail the actual request.
 */
export async function logActivity({ userId, action, entityType, entityId, description }) {
  try {
    await ActivityLog.create({ userId, action, entityType, entityId, description })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to write activity log:', err.message)
  }
}
