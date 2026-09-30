import CampaignPhase from '../models/CampaignPhase.js'

/**
 * The currently-active phase for an event, computed purely from the
 * database server's own clock against each phase's startAt/endAt —
 * never a stored "is active" flag, never the client's clock (Section 25
 * and 32). Scheduling a phase in the admin panel is enough; nothing else
 * needs to change for it to go live at the right moment.
 */
export async function getActivePhase(eventId) {
  const now = new Date()
  return CampaignPhase.findOne({
    eventId,
    startAt: { $lte: now },
    endAt: { $gte: now },
  })
    .sort({ priority: -1, startAt: -1 })
    .lean()
}
