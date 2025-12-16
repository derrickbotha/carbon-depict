/**
 * SBTi Target Routes
 * Handles CRUD operations for Science Based Targets initiative commitments
 */

const express = require('express')
const router = express.Router()
const SBTiTarget = require('../models/mongodb/SBTiTarget')
const { authenticate, authorize } = require('../middleware/auth')
const { buildFilter, buildSort, buildPagination, buildPaginationMeta } = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')
const ActivityLog = require('../models/mongodb/ActivityLog')
const exportService = require('../services/exportService')

router.use(authenticate)

// GET /api/sbti - Get company's SBTi target (only one per company)
router.get('/', async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOne({ companyId: req.companyId })
      .populate('createdBy updatedBy', 'firstName lastName email')
      .populate('nearTerm.scope1.targetId nearTerm.scope2.targetId nearTerm.scope3.targetId')
      .populate('longTerm.targetId')
      .lean()

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'No SBTi target found for this company'
      })
    }

    res.json({
      success: true,
      data: sbtiTarget
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/sbti/validated - Get all validated SBTi targets (public data)
router.get('/validated', async (req, res, next) => {
  try {
    const targets = await SBTiTarget.getValidatedTargets()

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/sbti - Create SBTi target
router.post('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    // Check if SBTi target already exists
    const existing = await SBTiTarget.findOne({ companyId: req.companyId })

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'SBTi target already exists for this company. Use PUT to update.'
      })
    }

    const sbtiTarget = new SBTiTarget({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.userId
    })

    // Validate against SBTi criteria
    const validation = sbtiTarget.validateSBTiCriteria()
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'SBTi validation failed',
        validationErrors: validation.errors
      })
    }

    await sbtiTarget.save()

    await ActivityLog.create({
      action: 'sbti_target_created',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString(),
      metadata: {
        submissionStatus: sbtiTarget.submissionStatus,
        nearTermYear: sbtiTarget.nearTerm?.targetYear
      }
    })

    await cache.invalidate('sbti', req.companyId)

    res.status(201).json({
      success: true,
      data: sbtiTarget,
      message: 'SBTi target created successfully',
      validation
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/sbti - Update SBTi target
router.put('/', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOneAndUpdate(
      { companyId: req.companyId },
      {
        $set: {
          ...req.body,
          updatedBy: req.userId
        }
      },
      { new: true, runValidators: true }
    )

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'SBTi target not found. Use POST to create.'
      })
    }

    // Recalculate scope 3 coverage
    sbtiTarget.calculateScope3Coverage()

    // Validate against SBTi criteria
    const validation = sbtiTarget.validateSBTiCriteria()

    await sbtiTarget.save()

    await ActivityLog.create({
      action: 'sbti_target_updated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString()
    })

    await cache.invalidate('sbti', req.companyId)

    res.json({
      success: true,
      data: sbtiTarget,
      message: 'SBTi target updated successfully',
      validation
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/sbti/submit - Submit SBTi target for validation
router.put('/submit', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOne({ companyId: req.companyId })

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'SBTi target not found'
      })
    }

    // Validate before submission
    const validation = sbtiTarget.validateSBTiCriteria()
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Cannot submit. SBTi validation failed.',
        validationErrors: validation.errors
      })
    }

    sbtiTarget.submissionStatus = 'submitted'
    sbtiTarget.submissionDate = new Date()
    sbtiTarget.updatedBy = req.userId

    await sbtiTarget.save()

    await ActivityLog.create({
      action: 'sbti_target_submitted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString()
    })

    await cache.invalidate('sbti', req.companyId)

    res.json({
      success: true,
      data: sbtiTarget,
      message: 'SBTi target submitted for validation'
    })
  } catch (error) {
    next(error)
  }
})

// PUT /api/sbti/validate - Mark as validated (admin only)
router.put('/validate', authorize('admin'), async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOneAndUpdate(
      { companyId: req.companyId },
      {
        $set: {
          submissionStatus: 'validated',
          validationDate: new Date(),
          validationComments: req.body.comments || [],
          updatedBy: req.userId
        }
      },
      { new: true }
    )

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'SBTi target not found'
      })
    }

    await ActivityLog.create({
      action: 'sbti_target_validated',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString()
    })

    await cache.invalidate('sbti', req.companyId)

    res.json({
      success: true,
      data: sbtiTarget,
      message: 'SBTi target validated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/sbti/progress - Add annual progress report
router.post('/progress', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOne({ companyId: req.companyId })

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'SBTi target not found'
      })
    }

    sbtiTarget.annualProgress.push({
      year: req.body.year,
      scope1: req.body.scope1,
      scope2: req.body.scope2,
      scope3: req.body.scope3,
      totalEmissions: (req.body.scope1 || 0) + (req.body.scope2 || 0) + (req.body.scope3 || 0),
      verified: req.body.verified || false
    })

    await sbtiTarget.save()

    await ActivityLog.create({
      action: 'sbti_progress_reported',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString(),
      metadata: {
        year: req.body.year
      }
    })

    await cache.invalidate('sbti', req.companyId)

    res.json({
      success: true,
      data: sbtiTarget,
      message: 'Annual progress reported successfully'
    })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/sbti - Delete SBTi target
router.delete('/', authorize('admin'), async (req, res, next) => {
  try {
    const sbtiTarget = await SBTiTarget.findOneAndDelete({ companyId: req.companyId })

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'SBTi target not found'
      })
    }

    await ActivityLog.create({
      action: 'sbti_target_deleted',
      userId: req.userId.toString(),
      companyId: req.companyId.toString(),
      resourceType: 'sbti_target',
      resourceId: sbtiTarget._id.toString()
    })

    await cache.invalidate('sbti', req.companyId)

    res.json({
      success: true,
      message: 'SBTi target deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// GET /api/sbti/export/:format - Export SBTi target
router.get('/export/:format', async (req, res, next) => {
  try {
    const format = req.params.format

    if (!['csv', 'excel', 'xlsx', 'json', 'pdf'].includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid export format'
      })
    }

    const sbtiTarget = await SBTiTarget.findOne({ companyId: req.companyId }).lean()

    if (!sbtiTarget) {
      return res.status(404).json({
        success: false,
        error: 'No SBTi target found'
      })
    }

    const exported = await exportService.exportSBTiTargets([sbtiTarget], format)

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
