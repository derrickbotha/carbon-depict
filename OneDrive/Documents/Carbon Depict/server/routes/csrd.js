/**
 * CSRD Disclosure Routes
 * Handles CRUD operations for CSRD (Corporate Sustainability Reporting Directive) disclosures
 */

const express = require('express')
const router = express.Router()
const CSRDDisclosure = require('../models/mongodb/CSRDDisclosure')
const { authenticate, authorize } = require('../middleware/auth')
const {
  buildFilter,
  buildSort,
  buildPagination,
  buildPaginationMeta
} = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

// Apply authentication to all routes
router.use(authenticate)

/**
 * GET /api/csrd
 * List CSRD disclosures with pagination, filtering, and sorting
 */
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, reportingPeriod, status } = req.query

    const allowedFilters = ['reportingPeriod', 'status']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, '-createdAt')
    const pagination = buildPagination(page, limit, 100)

    // Check cache
    const cacheKey = `csrd:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        CSRDDisclosure.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('userId', 'firstName lastName email')
          .populate('submittedBy approvedBy reviewedBy', 'firstName lastName')
          .lean(),
        CSRDDisclosure.countDocuments(filter)
      ])

      result = {
        success: true,
        data,
        pagination: buildPaginationMeta(total, pagination.page, pagination.limit)
      }

      // Cache for 5 minutes
      await cache.set(cacheKey, result, 300)
    }

    res.json(result)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/csrd/:id
 * Get single CSRD disclosure by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('submittedBy approvedBy reviewedBy', 'firstName lastName email')
      .populate('generalDisclosures.materialityAssessmentId')
      .lean()

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    // Verify company access
    if (disclosure.companyId.toString() !== req.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: disclosure
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/csrd/period/:reportingPeriod
 * Get CSRD disclosure by company and reporting period
 */
router.get('/period/:reportingPeriod', async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findByCompanyAndPeriod(
      req.companyId,
      req.params.reportingPeriod
    )

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'No CSRD disclosure found for this period'
      })
    }

    res.json({
      success: true,
      data: disclosure
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/csrd
 * Create new CSRD disclosure
 */
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    // Check if disclosure already exists for this period
    const existing = await CSRDDisclosure.findOne({
      companyId: req.companyId,
      reportingPeriod: req.body.reportingPeriod
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'CSRD disclosure already exists for this reporting period'
      })
    }

    const disclosure = new CSRDDisclosure({
      ...req.body,
      companyId: req.companyId,
      userId: req.userId,
      createdBy: req.userId
    })

    await disclosure.save()

    // Log activity
    await ActivityLog.create({
      action: 'csrd_disclosure_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'csrd_disclosure',
      resourceId: disclosure._id.toString(),
      metadata: {
        reportingPeriod: disclosure.reportingPeriod,
        status: disclosure.status
      }
    })

    // Invalidate cache
    await cache.invalidate('csrd', req.companyId)

    res.status(201).json({
      success: true,
      data: disclosure,
      message: 'CSRD disclosure created successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/csrd/:id
 * Update CSRD disclosure
 */
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          ...req.body,
          updatedBy: req.userId
        }
      },
      { new: true, runValidators: true }
    )

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    // Recalculate completion status
    disclosure.calculateCompletionStatus()
    await disclosure.save()

    // Log activity
    await ActivityLog.create({
      action: 'csrd_disclosure_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'csrd_disclosure',
      resourceId: disclosure._id.toString(),
      metadata: {
        reportingPeriod: disclosure.reportingPeriod,
        status: disclosure.status,
        completionPercentage: disclosure.completionStatus.overall
      }
    })

    // Invalidate cache
    await cache.invalidate('csrd', req.companyId)

    res.json({
      success: true,
      data: disclosure,
      message: 'CSRD disclosure updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/csrd/:id/submit
 * Submit CSRD disclosure for review
 */
router.put('/:id/submit', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          status: 'under_review',
          submittedBy: req.userId,
          submittedAt: new Date(),
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    await ActivityLog.create({
      action: 'csrd_disclosure_submitted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'csrd_disclosure',
      resourceId: disclosure._id.toString()
    })

    await cache.invalidate('csrd', req.companyId)

    res.json({
      success: true,
      data: disclosure,
      message: 'CSRD disclosure submitted for review'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/csrd/:id/approve
 * Approve CSRD disclosure
 */
router.put('/:id/approve', authorize('admin'), async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          status: 'published',
          approvedBy: req.userId,
          approvedAt: new Date(),
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    await ActivityLog.create({
      action: 'csrd_disclosure_approved',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'csrd_disclosure',
      resourceId: disclosure._id.toString()
    })

    await cache.invalidate('csrd', req.companyId)

    res.json({
      success: true,
      data: disclosure,
      message: 'CSRD disclosure approved and published'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/csrd/:id
 * Delete CSRD disclosure
 */
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    await ActivityLog.create({
      action: 'csrd_disclosure_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'csrd_disclosure',
      resourceId: disclosure._id.toString(),
      metadata: {
        reportingPeriod: disclosure.reportingPeriod
      }
    })

    await cache.invalidate('csrd', req.companyId)

    res.json({
      success: true,
      message: 'CSRD disclosure deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/csrd/:id/completion
 * Get completion status for CSRD disclosure
 */
router.get('/:id/completion', async (req, res, next) => {
  try {
    const disclosure = await CSRDDisclosure.findById(req.params.id)

    if (!disclosure) {
      return res.status(404).json({
        success: false,
        error: 'CSRD disclosure not found'
      })
    }

    if (disclosure.companyId.toString() !== req.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    const completionStats = disclosure.calculateCompletionStatus()

    res.json({
      success: true,
      data: completionStats
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/csrd/export/:format
 * Export CSRD disclosures with filtering
 */
router.get('/export/:format', async (req, res, next) => {
  try {
    const { reportingPeriod, status, startDate, endDate } = req.query
    const format = req.params.format

    // Validate format
    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format. Supported: csv, excel, json, pdf'
      })
    }

    const filter = { companyId: req.companyId }
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (status) filter.status = status
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const disclosures = await CSRDDisclosure.find(filter)
      .populate('userId', 'firstName lastName')
      .lean()

    const exported = await exportService.exportCSRDDisclosures(
      disclosures,
      format
    )

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
