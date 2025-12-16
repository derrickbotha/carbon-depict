/**
 * ESG Targets Routes
 * Handles CRUD operations for ESG targets with progress tracking
 */

const express = require('express')
const router = express.Router()
const ESGTarget = require('../models/mongodb/ESGTarget')
const { authenticate, authorize } = require('../middleware/auth')
const { buildFilter, buildSort, buildPagination, buildPaginationMeta } = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

router.use(authenticate)

// GET /api/targets - List with pagination/filtering
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, targetType, category, status } = req.query

    const allowedFilters = ['targetType', 'category', 'status', 'owner', 'isScienceBased']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, 'targetYear')
    const pagination = buildPagination(page, limit, 100)

    const cacheKey = `targets:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        ESGTarget.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('owner', 'firstName lastName')
          .populate('createdBy', 'firstName lastName')
          .lean(),
        ESGTarget.countDocuments(filter)
      ])

      result = {
        success: true,
        data,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit)
      }

      await cache.set(cacheKey, result, 300)
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
})

// GET /api/targets/category/:category - Get targets by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const targets = await ESGTarget.getByCategory(req.companyId, req.params.category)

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/targets/on-track - Get on-track targets
router.get('/on-track/status', async (req, res, next) => {
  try {
    const targets = await ESGTarget.getOnTrack(req.companyId)

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/targets/:id - Get single record
router.get('/:id', async (req, res, next) => {
  try {
    const target = await ESGTarget.findById(req.params.id)
      .populate('owner createdBy updatedBy', 'firstName lastName email')
      .populate('stakeholders', 'firstName lastName')
      .lean()

    if (!target) {
      return res.status(404).json({ success: false, error: 'Target not found' })
    }

    if (target.companyId.toString() !== req.companyId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({ success: true, data: target })
  } catch (error) {
    next(error)
  }
})

// POST /api/targets - Create new
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = new ESGTarget({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.userId
    })

    await target.save()

    await ActivityLog.create({
      action: 'target_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'esg_target',
      resourceId: target._id.toString(),
      metadata: {
        targetName: target.targetName,
        targetYear: target.targetYear,
        category: target.category
      }
    })

    await cache.invalidate('targets', req.companyId)

    res.status(201).json({
      success: true,
      data: target,
      message: 'Target created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/targets/:id - Update
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      { $set: { ...req.body, updatedBy: req.userId } },
      { new: true, runValidators: true }
    )

    if (!target) {
      return res.status(404).json({ success: false, error: 'Target not found' })
    }

    // Recalculate progress
    target.calculateProgress()
    await target.save()

    await ActivityLog.create({
      action: 'target_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'esg_target',
      resourceId: target._id.toString()
    })

    await cache.invalidate('targets', req.companyId)

    res.json({ success: true, data: target, message: 'Target updated successfully' })
  } catch (error) {
    next(error)
  }
})

// PUT /api/targets/:id/progress - Update progress
router.put('/:id/progress', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOne({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!target) {
      return res.status(404).json({ success: false, error: 'Target not found' })
    }

    target.currentValue = req.body.currentValue
    target.currentYear = req.body.currentYear || new Date().getFullYear()
    target.progressUpdates.push({
      value: req.body.currentValue,
      comment: req.body.comment,
      updatedBy: req.userId
    })

    target.calculateProgress()
    await target.save()

    await ActivityLog.create({
      action: 'target_progress_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'esg_target',
      resourceId: target._id.toString(),
      metadata: {
        progress: target.progress,
        status: target.status
      }
    })

    await cache.invalidate('targets', req.companyId)

    res.json({ success: true, data: target, message: 'Progress updated successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/targets/:id - Delete
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!target) {
      return res.status(404).json({ success: false, error: 'Target not found' })
    }

    await ActivityLog.create({
      action: 'target_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'esg_target',
      resourceId: target._id.toString()
    })

    await cache.invalidate('targets', req.companyId)

    res.json({ success: true, message: 'Target deleted successfully' })
  } catch (error) {
    next(error)
  }
})

// GET /api/targets/export/:format - Export with filtering
router.get('/export/:format', async (req, res, next) => {
  try {
    const { category, status, targetType, startDate, endDate } = req.query
    const format = req.params.format

    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid export format' })
    }

    const filter = { companyId: req.companyId }
    if (category) filter.category = category
    if (status) filter.status = status
    if (targetType) filter.targetType = targetType
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const targets = await ESGTarget.find(filter).lean()

    const exported = await exportService.exportTargets(targets, format)

    res.set({
      'Content-Type': exported.contentType,
      'Content-Disposition': `attachment; filename="${exported.filename}"`
    })

    res.send(exported.data)
  } catch (error) {
    next(error)
  }
})

module.exports = router
