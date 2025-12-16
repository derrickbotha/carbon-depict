/**
 * Risk Register Routes
 * Handles CRUD operations for ESG and climate-related risks
 */

const express = require('express')
const router = express.Router()
const RiskRegister = require('../models/mongodb/RiskRegister')
const { authenticate, authorize } = require('../middleware/auth')
const { buildFilter, buildSort, buildPagination, buildPaginationMeta } = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

router.use(authenticate)

// GET /api/risks - List with pagination/filtering
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, riskType, category, status } = req.query

    const allowedFilters = ['riskType', 'category', 'status', 'owner', 'likelihood', 'impact']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, '-inherentRiskScore')
    const pagination = buildPagination(page, limit, 100)

    const cacheKey = `risks:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        RiskRegister.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('owner', 'firstName lastName')
          .populate('createdBy', 'firstName lastName')
          .lean(),
        RiskRegister.countDocuments(filter)
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

// GET /api/risks/matrix - Get risk matrix
router.get('/matrix', async (req, res, next) => {
  try {
    const riskMatrix = await RiskRegister.getRiskMatrix(req.companyId)

    res.json({
      success: true,
      data: riskMatrix
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/risks/:id - Get single record
router.get('/:id', async (req, res, next) => {
  try {
    const risk = await RiskRegister.findById(req.params.id)
      .populate('owner createdBy updatedBy', 'firstName lastName email')
      .populate('controls.owner', 'firstName lastName')
      .lean()

    if (!risk) {
      return res.status(404).json({ success: false, error: 'Risk not found' })
    }

    if (risk.companyId.toString() !== req.companyId) {
      return res.status(403).json({ success: false, error: 'Access denied' })
    }

    res.json({ success: true, data: risk })
  } catch (error) {
    next(error)
  }
})

// POST /api/risks - Create new
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const risk = new RiskRegister({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.userId
    })

    await risk.save()

    await ActivityLog.create({
      action: 'risk_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'risk_register',
      resourceId: risk._id.toString(),
      metadata: {
        riskType: risk.riskType,
        inherentRiskScore: risk.inherentRiskScore
      }
    })

    await cache.invalidate('risks', req.companyId)

    res.status(201).json({
      success: true,
      data: risk,
      message: 'Risk created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/risks/:id - Update
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const risk = await RiskRegister.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      { $set: { ...req.body, updatedBy: req.userId } },
      { new: true, runValidators: true }
    )

    if (!risk) {
      return res.status(404).json({ success: false, error: 'Risk not found' })
    }

    await ActivityLog.create({
      action: 'risk_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'risk_register',
      resourceId: risk._id.toString()
    })

    await cache.invalidate('risks', req.companyId)

    res.json({ success: true, data: risk, message: 'Risk updated successfully' })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/risks/:id - Delete
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const risk = await RiskRegister.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!risk) {
      return res.status(404).json({ success: false, error: 'Risk not found' })
    }

    await ActivityLog.create({
      action: 'risk_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'risk_register',
      resourceId: risk._id.toString()
    })

    await cache.invalidate('risks', req.companyId)

    res.json({ success: true, message: 'Risk deleted successfully' })
  } catch (error) {
    next(error)
  }
})

// GET /api/risks/export/:format - Export with filtering
router.get('/export/:format', async (req, res, next) => {
  try {
    const { riskType, category, status, startDate, endDate } = req.query
    const format = req.params.format

    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({ success: false, error: 'Invalid export format' })
    }

    const filter = { companyId: req.companyId }
    if (riskType) filter.riskType = riskType
    if (category) filter.category = category
    if (status) filter.status = status
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }

    const risks = await RiskRegister.find(filter).lean()

    const exported = await exportService.exportRisks(risks, format)

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
