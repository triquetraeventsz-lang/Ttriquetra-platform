import { ApiError } from './ApiError.js'
import { asyncHandler } from './asyncHandler.js'
import { logActivity } from '../services/activityLog.js'

/**
 * Generic admin CRUD handlers for a Mongoose model. Services, Blogs,
 * CaseStudies and FAQs all share the same list/get/create/update/delete
 * shape — this avoids writing that shape out four separate times.
 * Resource-specific behavior (publish/unpublish, slugging) is layered on
 * top in each resource's own route file, not here.
 */
export function createCrudController(Model, { entityType, searchFields = [] }) {
  const list = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status, search } = req.query
    const filter = {}
    if (status) filter.status = status
    if (search && searchFields.length) {
      filter.$or = searchFields.map((f) => ({ [f]: { $regex: search, $options: 'i' } }))
    }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const [items, total] = await Promise.all([
      Model.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Model.countDocuments(filter),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  })

  const getById = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id).lean()
    if (!item) throw new ApiError(404, `${entityType} not found.`)
    res.json(item)
  })

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create({ ...req.body, createdBy: req.user.id, updatedBy: req.user.id })
    await logActivity({
      userId: req.user.id,
      action: `${entityType.toLowerCase()}.created`,
      entityType,
      entityId: item._id,
      description: `Created ${entityType.toLowerCase()} "${item.title || item.name || item._id}"`,
    })
    res.status(201).json(item)
  })

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true },
    )
    if (!item) throw new ApiError(404, `${entityType} not found.`)
    await logActivity({
      userId: req.user.id,
      action: `${entityType.toLowerCase()}.updated`,
      entityType,
      entityId: item._id,
      description: `Updated ${entityType.toLowerCase()} "${item.title || item.name || item._id}"`,
    })
    res.json(item)
  })

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id)
    if (!item) throw new ApiError(404, `${entityType} not found.`)
    await logActivity({
      userId: req.user.id,
      action: `${entityType.toLowerCase()}.deleted`,
      entityType,
      entityId: item._id,
      description: `Deleted ${entityType.toLowerCase()} "${item.title || item.name || item._id}"`,
    })
    res.status(204).end()
  })

  return { list, getById, create, update, remove }
}
