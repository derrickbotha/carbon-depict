/**
 * Materiality Assessment Routes
 * Handles CRUD operations for materiality assessments
 */

const express = require('express')
const router = express.Router()
const MaterialityAssessment = require('../models/mongodb/MaterialityAssessment')
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
 * GET /api/materiality
 * List materiality assessments with pagination, filtering, and sorting
 */
router.get('/', async (req, res, next) => {
  try {
    const { page, limit, sort, assessmentYear, status, methodology } = req.query

    const allowedFilters = ['assessmentYear', 'status', 'methodology']
    const baseFilter = { companyId: req.companyId }
    const filter = buildFilter(req.query, allowedFilters, baseFilter)
    const sortObj = buildSort(sort, '-assessmentYear')
    const pagination = buildPagination(page, limit, 100)

    // Check cache
    const cacheKey = `materiality:${req.companyId}:${JSON.stringify(req.query)}`
    let result = await cache.get(cacheKey)

    if (!result) {
      const [data, total] = await Promise.all([
        MaterialityAssessment.find(filter)
          .sort(sortObj)
          .limit(pagination.limit)
          .skip(pagination.skip)
          .populate('userId', 'firstName lastName email')
          .populate('approvedBy reviewedBy publishedBy', 'firstName lastName')
          .lean(),
        MaterialityAssessment.countDocuments(filter)
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
 * GET /api/materiality/:id
 * Get single materiality assessment by ID
 */
router.get('/:id', async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('approvedBy reviewedBy publishedBy', 'firstName lastName email')
      .lean()

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Materiality assessment not found'
      })
    }

    // Verify company access
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

/**
 * GET /api/materiality/year/:assessmentYear
 * Get materiality assessment by year
 */
router.get('/year/:assessmentYear', async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findByCompanyAndYear(
      req.companyId,
      req.params.assessmentYear
    )

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'No materiality assessment found for this year'
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

/**
 * GET /api/materiality/latest
 * Get latest materiality assessment
 */
router.get('/latest/current', async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findLatestByCompany(req.companyId)

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'No materiality assessment found'
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

/**
 * GET /api/materiality/material-topics/:assessmentYear
 * Get material topics for a specific year
 */
router.get('/material-topics/:assessmentYear', async (req, res, next) => {
  try {
    const topics = await MaterialityAssessment.getMaterialTopics(
      req.companyId,
      req.params.assessmentYear
    )

    res.json({
      success: true,
      data: topics
    })
  } catch (error) {
    next(error)
  }
})

/**
 * POST /api/materiality
 * Create new materiality assessment
 */
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    // Check if assessment already exists for this year
    const existing = await MaterialityAssessment.findOne({
      companyId: req.companyId,
      assessmentYear: req.body.assessmentYear
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Materiality assessment already exists for this year'
      })
    }

    const assessment = new MaterialityAssessment({
      ...req.body,
      companyId: req.companyId,
      userId: req.userId,
      createdBy: req.userId
    })

    await assessment.save()

    // Log activity
    await ActivityLog.create({
      action: 'materiality_assessment_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'materiality_assessment',
      resourceId: assessment._id.toString(),
      metadata: {
        assessmentYear: assessment.assessmentYear,
        methodology: assessment.methodology
      }
    })

    // Invalidate cache
    await cache.invalidate('materiality', req.companyId)

    res.status(201).json({
      success: true,
      data: assessment,
      message: 'Materiality assessment created successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/materiality/:id
 * Update materiality assessment
 */
router.put('/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndUpdate(
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
        error: 'Materiality assessment not found'
      })
    }

    // Update materiality matrix
    assessment.updateMaterialityMatrix()
    await assessment.save()

    // Log activity
    await ActivityLog.create({
      action: 'materiality_assessment_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'materiality_assessment',
      resourceId: assessment._id.toString(),
      metadata: {
        assessmentYear: assessment.assessmentYear,
        materialTopicsCount: assessment.materialTopicsCount
      }
    })

    // Invalidate cache
    await cache.invalidate('materiality', req.companyId)

    res.json({
      success: true,
      data: assessment,
      message: 'Materiality assessment updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/materiality/:id/approve
 * Approve materiality assessment
 */
router.put('/:id/approve', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          status: 'approved',
          approvedBy: req.userId,
          approvedAt: new Date(),
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Materiality assessment not found'
      })
    }

    await ActivityLog.create({
      action: 'materiality_assessment_approved',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'materiality_assessment',
      resourceId: assessment._id.toString()
    })

    await cache.invalidate('materiality', req.companyId)

    res.json({
      success: true,
      data: assessment,
      message: 'Materiality assessment approved'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * PUT /api/materiality/:id/publish
 * Publish materiality assessment
 */
router.put('/:id/publish', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      {
        $set: {
          status: 'published',
          publishedBy: req.userId,
          publishedAt: new Date(),
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Materiality assessment not found'
      })
    }

    await ActivityLog.create({
      action: 'materiality_assessment_published',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'materiality_assessment',
      resourceId: assessment._id.toString()
    })

    await cache.invalidate('materiality', req.companyId)

    res.json({
      success: true,
      data: assessment,
      message: 'Materiality assessment published'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * DELETE /api/materiality/:id
 * Delete materiality assessment
 */
router.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    })

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Materiality assessment not found'
      })
    }

    await ActivityLog.create({
      action: 'materiality_assessment_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'materiality_assessment',
      resourceId: assessment._id.toString(),
      metadata: {
        assessmentYear: assessment.assessmentYear
      }
    })

    await cache.invalidate('materiality', req.companyId)

    res.json({
      success: true,
      message: 'Materiality assessment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

/**
 * GET /api/materiality/export/:format
 * Export materiality assessments with filtering
 */
router.get('/export/:format', async (req, res, next) => {
  try {
    const { assessmentYear, status, startDate, endDate } = req.query
    const format = req.params.format

    // Validate format
    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format. Supported: csv, excel, json, pdf'
      })
    }

    const filter = { companyId: req.companyId }
    if (assessmentYear) filter.assessmentYear = assessmentYear
    if (status) filter.status = status
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    const assessments = await MaterialityAssessment.find(filter)
      .populate('userId', 'firstName lastName')
      .lean()

    const exported = await exportService.exportMaterialityAssessments(
      assessments,
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
