/**
 * PCAF Assessment Routes
 * Handles CRUD operations for Portfolio Carbon Accounting Financials assessments
 */

const express = require('express')
const router = express.Router()
const PCAFAssessment = require('../models/mongodb/PCAFAssessment')
const { authenticate, authorize } = require('../middleware/auth')
const { buildFilter, buildSort, buildPagination, buildPaginationMeta } = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

router.use(authenticate)

// GET /api/pcaf - List PCAF assessments
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, reportingPeriod, portfolioType, status } = req.query

    const allowedFilters = ['reportingPeriod', 'portfolioType', 'status']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, '-reportingPeriod')
    const pagination = buildPagination(page, limit, 100)

    const cacheKey = `pcaf:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        PCAFAssessment.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('createdBy', 'firstName lastName')
          .lean(),
        PCAFAssessment.countDocuments(filter)
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

// GET /api/pcaf/trend - Get emissions trend over time
router.get('/trend', async (req, res, next) => {
  try {
    const trend = await PCAFAssessment.getEmissionsTrend(req.companyId)

    res.json({
      success: true,
      data: trend
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/pcaf/:id - Get single assessment
router.get('/:id', async (req, res, next) => {
  try {
    const assessment = await PCAFAssessment.findById(req.params.id)
      .populate('createdBy updatedBy', 'firstName lastName email')
      .lean()

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'PCAF assessment not found'
      })
    }

    if (assessment.companyId.toString() !== req.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/pcaf - Create new assessment
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = new PCAFAssessment({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.userId
    })

    await assessment.save()

    await ActivityLog.create({
      action: 'pcaf_assessment_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'pcaf_assessment',
      resourceId: assessment._id.toString(),
      metadata: {
        reportingPeriod: assessment.reportingPeriod,
        portfolioType: assessment.portfolioType,
        totalFinancedEmissions: assessment.totals.totalFinancedEmissions
      }
    })

    await cache.invalidate('pcaf', req.companyId)

    res.status(201).json({
      success: true,
      data: assessment,
      message: 'PCAF assessment created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/pcaf/:id - Update assessment
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = await PCAFAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          ...req.body,
          updatedBy: req.userId
        }
      },
      { new: true, runValidators: true }
    )

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'PCAF assessment not found'
      })
    }

    // Recalculate aggregates
    assessment.calculateAggregates()
    await assessment.save()

    await ActivityLog.create({
      action: 'pcaf_assessment_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'pcaf_assessment',
      resourceId: assessment._id.toString()
    })

    await cache.invalidate('pcaf', req.companyId)

    res.json({
      success: true,
      data: assessment,
      message: 'PCAF assessment updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/pcaf/:id/verify - Verify assessment
router.put('/:id/verify', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await PCAFAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          verified: true,
          verifiedBy: req.body.verifiedBy,
          verifiedAt: new Date(),
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'PCAF assessment not found'
      })
    }

    await ActivityLog.create({
      action: 'pcaf_assessment_verified',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'pcaf_assessment',
      resourceId: assessment._id.toString()
    })

    await cache.invalidate('pcaf', req.companyId)

    res.json({
      success: true,
      data: assessment,
      message: 'PCAF assessment verified successfully'
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/pcaf/:id - Delete assessment
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await PCAFAssessment.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'PCAF assessment not found'
      })
    }

    await ActivityLog.create({
      action: 'pcaf_assessment_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'pcaf_assessment',
      resourceId: assessment._id.toString()
    })

    await cache.invalidate('pcaf', req.companyId)

    res.json({
      success: true,
      message: 'PCAF assessment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/pcaf/export/:format - Export assessments
router.get('/export/:format', async (req, res, next) => {
  try {
    const { reportingPeriod, portfolioType, status, startDate, endDate } = req.query
    const format = req.params.format

    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format'
      })
    }

    const filter = { companyId: req.companyId }
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (portfolioType) filter.portfolioType = portfolioType
    if (status) filter.status = status
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const assessments = await PCAFAssessment.find(filter).lean()

    const exported = await exportService.exportPCAFAssessments(assessments, format)

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
