import { Router } from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import Media from '../../models/Media.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { uploadFile, deleteFile } from '../../services/storage.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4']
    if (!allowed.includes(file.mimetype)) return cb(new ApiError(400, 'Unsupported file type.'))
    cb(null, true)
  },
})

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 40, search } = req.query
    const filter = search ? { filename: { $regex: search, $options: 'i' } } : {}
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const [items, total] = await Promise.all([
      Media.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Media.countDocuments(filter),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  }),
)

router.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded.')

    const ext = req.file.originalname.split('.').pop()
    const key = `media/${crypto.randomUUID()}.${ext}`
    const url = await uploadFile({ buffer: req.file.buffer, key, contentType: req.file.mimetype })

    const media = await Media.create({
      filename: req.file.originalname,
      url,
      storageKey: key,
      storageProvider: 'r2',
      altText: req.body.altText || '',
      title: req.body.title || '',
      caption: req.body.caption || '',
      description: req.body.description || '',
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    })

    await logActivity({
      userId: req.user.id,
      action: 'media.uploaded',
      entityType: 'Media',
      entityId: media._id,
      description: `Uploaded "${media.filename}"`,
    })

    res.status(201).json(media)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const media = await Media.findById(req.params.id)
    if (!media) throw new ApiError(404, 'Media not found.')

    await deleteFile(media.storageKey)
    await media.deleteOne()

    await logActivity({
      userId: req.user.id,
      action: 'media.deleted',
      entityType: 'Media',
      entityId: media._id,
      description: `Deleted "${media.filename}"`,
    })

    res.status(204).end()
  }),
)

export default router
