/**
 * Scope 3 Emission Routes
 * Handles CRUD operations for Scope 3 emissions across all 15 categories
 */

const express = require('express')
const router = express.Router()
const Scope3Emission = require('../models/mongodb/Scope3Emission')
const { authenticate, authorize } = require('../middleware/auth')
const { buildFilter, buildSort, buildPagination, buildPaginationMeta } = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

router.use(authenticate)

// GET /api/scope3 - List with pagination/filtering
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, reportingPeriod, category, dataQuality } = req.query

    const allowedFilters = ['reportingPeriod', 'category', 'dataQuality', 'verificationStatus']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, '-createdAt')
    const pagination = buildPagination(page, limit, 100)

    const cacheKey = `scope3:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        Scope3Emission.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('createdBy', 'firstName lastName')
          .lean(),
        Scope3Emission.countDocuments(filter)
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

// GET /api/scope3/summary/:reportingPeriod - Get summary by category
router.get('/summary/:reportingPeriod', async (req, res, next) => {
  try {
    const summary = await Scope3Emission.getTotalByCategory(
      req.companyId,
      req.params.reportingPeriod
    )

    const total = await Scope3Emission.getScope3Total(
      req.companyId,
      req.params.reportingPeriod
    )

    res.json({
      success: true,
      data: {
        byCategory: summary,
        total
      }
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/scope3/:id - Get single record
router.get('/:id', async (req, res, next) => {
  try {
    const emission = await Scope3Emission.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('supplierId')
      .lean()

    if (!emission) {
      return res.status(404).json({ success: false, error: 'Scope 3 emission not found' })
    }

    if (emission.companyId.toString() !== req.companyId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({ success: true, data: emission })
  } catch (error) {
    next(error)
  }
})

// POST /api/scope3 - Create new
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const emission = new Scope3Emission({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.userId
    })

    await emission.save()

    await ActivityLog.create({
      action: 'scope3_emission_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'scope3_emission',
      resourceId: emission._id.toString(),
      metadata: {
        category: emission.category,
        reportingPeriod: emission.reportingPeriod,
        co2e: emission.co2e
      }
    })

    await cache.invalidate('scope3', req.companyId)

    res.status(201).json({
      success: true,
      data: emission,
      message: 'Scope 3 emission created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/scope3/:id - Update
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const emission = await Scope3Emission.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      { $set: { ...req.body, updatedBy: req.userId } },
      { new: true, runValidators: true }
    )

    if (!emission) {
      return res.status(404).json({ success: false, error: 'Scope 3 emission not found' })
    }

    await ActivityLog.create({
      action: 'scope3_emission_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'scope3_emission',
      resourceId: emission._id.toString()
    })

    await cache.invalidate('scope3', req.companyId)

    res.json({ success: true, data: emission, message: 'Scope 3 emission updated successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/scope3/:id - Delete
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const emission = await Scope3Emission.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!emission) {
      return res.status(404).json({ success: false, error: 'Scope 3 emission not found' })
    }

    await ActivityLog.create({
      action: 'scope3_emission_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'scope3_emission',
      resourceId: emission._id.toString()
    })

    await cache.invalidate('scope3', req.companyId)

    res.json({ success: true, message: 'Scope 3 emission deleted successfully' })
  } catch (error) {
    next(error)
  }
})

// GET /api/scope3/export/:format - Export with filtering
router.get('/export/:format', async (req, res, next) => {
  try {
    const { reportingPeriod, category, startDate, endDate } = req.query
    const format = req.params.format

    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid export format' })
    }

    const filter = { companyId: req.companyId }
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (category) filter.category = category
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const emissions = await Scope3Emission.find(filter).lean()

    const exported = await exportService.exportScope3Emissions(emissions, format)

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
