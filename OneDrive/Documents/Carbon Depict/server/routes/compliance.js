const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const { authenticate } = require('../middleware/auth')
const { analyzeCompliance, batchAnalyzeCompliance, reanalyzeCompliance } = require('../services/aiComplianceService')
const mongoose = require('mongoose')
const { ESGMetric, GRIDisclosure, FrameworkTemplate, ActivityLog } = require('../models/mongodb')

/**
 * POST /api/compliance/analyze
 * Analyze single data entry against framework
 */
router.post('/analyze', authenticate, [
  body('framework').isIn(['GRI', 'TCFD', 'CDP', 'SASB', 'SDG']),
  body('data').isObject(),
  body('saveAs').optional().isIn(['draft', 'published'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { framework, data, saveAs = 'draft', metricId } = req.body

    // Analyze compliance
    const analysis = await analyzeCompliance(
      data,
      framework,
      req.user.id,
      req.user.companyId
    )

    // If saving, update/create the metric
    if (saveAs === 'draft' || saveAs === 'published') {
      const metricData = {
        ...data,
        companyId: req.user.companyId,
        createdBy: req.user.id,
        framework,
        complianceScore: analysis.score?.overall || 0,
        complianceStatus: analysis.score?.isCompliant ? 'compliant' : 'non_compliant',
        complianceAnalysis: {
          score: analysis.score,
          feedback: analysis.feedback,
          missingElements: analysis.feedback?.missingElements || [],
          proofRequired: analysis.feedback?.proofRequired || [],
          analyzedAt: new Date()
        },
        status: saveAs === 'draft' ? 'draft' : 'published',
        isDraft: saveAs === 'draft'
      }

      let savedMetric
      if (metricId) {
        // Update existing
        if (!mongoose.Types.ObjectId.isValid(metricId)) {
          return res.status(400).json({ error: 'Invalid metric id' })
        }

        savedMetric = await ESGMetric.findById(metricId)
        if (savedMetric && savedMetric.companyId.toString() === req.user.companyId) {
          Object.assign(savedMetric, metricData)
          await savedMetric.save()
        } else {
          return res.status(404).json({ error: 'Metric not found or access denied' })
        }
      } else {
        // Create new
        savedMetric = await ESGMetric.create(metricData)
      }

      return res.json({
        success: true,
        analysis,
        metric: {
          id: savedMetric.id,
          status: savedMetric.status,
          complianceScore: savedMetric.complianceScore,
          complianceStatus: savedMetric.complianceStatus
        },
        message: saveAs === 'draft' 
          ? 'Saved as draft. Review compliance feedback before publishing.' 
          : 'Published successfully!'
      })
    }

    // Just return analysis without saving
    res.json({
      success: true,
      analysis,
      message: 'Compliance analysis complete. Review feedback before saving.'
    })
  } catch (error) {
    console.error('Compliance analysis error:', error)
    res.status(500).json({ 
      error: 'Compliance analysis failed',
      message: error.message 
    })
  }
})

/**
 * POST /api/compliance/batch-analyze
 * Analyze multiple entries
 */
router.post('/batch-analyze', authenticate, [
  body('framework').isIn(['GRI', 'TCFD', 'CDP', 'SASB', 'SDG']),
  body('entries').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { framework, entries } = req.body

    if (entries.length > 50) {
      return res.status(400).json({ 
        error: 'Batch size too large. Maximum 50 entries per batch.' 
      })
    }

    // Start batch analysis (async)
    const results = await batchAnalyzeCompliance(
      entries,
      framework,
      req.user.id,
      req.user.companyId
    )

    res.json({
      success: true,
      total: entries.length,
      results,
      summary: {
        compliant: results.filter(r => r.score?.isCompliant).length,
        nonCompliant: results.filter(r => r.score && !r.score.isCompliant).length,
        errors: results.filter(r => !r.success).length
      }
    })
  } catch (error) {
    console.error('Batch analysis error:', error)
    res.status(500).json({ 
      error: 'Batch analysis failed',
      message: error.message 
    })
  }
})

/**
 * PUT /api/compliance/reanalyze/:id
 * Re-analyze after updates
 */
router.put('/reanalyze/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    const { data, framework } = req.body

    // Get existing metric
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Metric not found' })
    }

    const metric = await ESGMetric.findById(id)

    if (!metric) {
      return res.status(404).json({ error: 'Metric not found' })
    }

    if (metric.companyId.toString() !== req.user.companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Re-analyze
    const analysis = await reanalyzeCompliance(
      id,
      data || metric.data,
      framework || metric.framework,
      req.user.id,
      req.user.companyId
    )

    // Update metric with new analysis
    metric.complianceScore = analysis.score?.overall || 0
    metric.complianceStatus = analysis.score?.isCompliant ? 'compliant' : 'non_compliant'
    metric.complianceAnalysis = {
      score: analysis.score,
      feedback: analysis.feedback,
      missingElements: analysis.feedback?.missingElements || [],
      proofRequired: analysis.feedback?.proofRequired || [],
      analyzedAt: new Date()
    }
    await metric.save()

    res.json({
      success: true,
      analysis,
      metric: {
        id: metric.id,
        complianceScore: metric.complianceScore,
        complianceStatus: metric.complianceStatus
      },
      message: 'Re-analysis complete'
    })
  } catch (error) {
    console.error('Re-analysis error:', error)
    res.status(500).json({ 
      error: 'Re-analysis failed',
      message: error.message 
    })
  }
})

/**
 * POST /api/compliance/upload-proof
 * Upload supporting documentation
 */
router.post('/upload-proof', authenticate, async (req, res) => {
  try {
    const { metricId, proofType, fileUrl, fileName, description } = req.body
    if (!mongoose.Types.ObjectId.isValid(metricId)) {
      return res.status(400).json({ error: 'Invalid metric id' })
    }

    const metric = await ESGMetric.findById(metricId)

    if (!metric) {
      return res.status(404).json({ error: 'Metric not found' })
    }

    if (metric.companyId.toString() !== req.user.companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Add proof to metric (top-level proofs array)
    const proof = {
      type: proofType,
      fileUrl,
      fileName,
      description,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
      status: 'pending_review'
    }

    metric.proofs = metric.proofs || []
    metric.proofs.push(proof)
    await metric.save()

    // Log activity
    await ActivityLog.create({
      action: 'proof_uploaded',
      userId: req.user.id.toString(),
      companyId: req.user.companyId.toString(),
      resourceType: 'esg_metric',
      resourceId: metricId.toString(),
      metadata: {
        proofType,
        fileName
      }
    })

    res.json({
      success: true,
      proof,
      message: 'Proof uploaded successfully'
    })
  } catch (error) {
    console.error('Proof upload error:', error)
    res.status(500).json({ 
      error: 'Proof upload failed',
      message: error.message 
    })
  }
})

/**
 * GET /api/compliance/frameworks
 * Get available frameworks and their requirements
 */
router.get('/frameworks', authenticate, async (req, res) => {
  try {
    const frameworks = await FrameworkTemplate.find({
      isActive: true
    }).select('framework name description version structure requiredFields')

    res.json({
      success: true,
      frameworks
    })
  } catch (error) {
    console.error('Get frameworks error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch frameworks',
      message: error.message 
    })
  }
})

/**
 * GET /api/compliance/framework/:framework
 * Get specific framework details
 */
router.get('/framework/:framework', authenticate, async (req, res) => {
  try {
    const { framework } = req.params

    const template = await FrameworkTemplate.findOne({
      framework: framework.toUpperCase(),
      isActive: true
    })

    if (!template) {
      return res.status(404).json({ error: 'Framework not found' })
    }

    res.json({
      success: true,
      framework: template
    })
  } catch (error) {
    console.error('Get framework error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch framework',
      message: error.message 
    })
  }
})

/**
 * GET /api/compliance/metrics/drafts
 * Get all draft metrics for review
 */
router.get('/metrics/drafts', authenticate, async (req, res) => {
  try {
    const drafts = await ESGMetric.find({
      companyId: req.user.companyId,
      status: 'draft'
    }).sort({ updatedAt: -1 })

    res.json({
      success: true,
      drafts,
      count: drafts.length
    })
  } catch (error) {
    console.error('Get drafts error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch drafts',
      message: error.message 
    })
  }
})

/**
 * PUT /api/compliance/metrics/:id/publish
 * Publish a draft metric
 */
router.put('/metrics/:id/publish', authenticate, async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Metric not found' })
    }

    const metric = await ESGMetric.findById(id)

    if (!metric) {
      return res.status(404).json({ error: 'Metric not found' })
    }

    if (metric.companyId.toString() !== req.user.companyId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check compliance before publishing
    if ((metric.complianceScore || 0) < 75) {
      return res.status(400).json({
        error: 'Cannot publish non-compliant metric',
        message: `Compliance score (${metric.complianceScore}) is below threshold (75). Please address compliance feedback.`,
        complianceAnalysis: metric.complianceAnalysis
      })
    }

    // Publish
    metric.status = 'published'
    metric.isDraft = false
    metric.publishedBy = req.user.id
    metric.publishedAt = new Date()
    await metric.save()

    // Log activity
    await ActivityLog.create({
      action: 'metric_published',
      userId: req.user.id.toString(),
      companyId: req.user.companyId.toString(),
      resourceType: 'esg_metric',
      resourceId: id.toString(),
      metadata: {
        framework: metric.framework,
        complianceScore: metric.complianceScore
      }
    })

    res.json({
      success: true,
      metric,
      message: 'Metric published successfully'
    })
  } catch (error) {
    console.error('Publish metric error:', error)
    res.status(500).json({ 
      error: 'Failed to publish metric',
      message: error.message 
    })
  }
})

/**
 * GET /api/compliance/stats
 * Get compliance statistics
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await ESGMetric.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(req.user.companyId) } },
      {
        $group: {
          _id: { framework: '$framework', status: '$status', complianceStatus: '$complianceStatus' },
          count: { $sum: 1 },
          avgScore: { $avg: '$complianceScore' }
        }
      },
      {
        $project: {
          framework: '$_id.framework',
          status: '$_id.status',
          complianceStatus: '$_id.complianceStatus',
          count: 1,
          avgScore: 1,
          _id: 0
        }
      }
    ])

    res.json({ success: true, stats })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    })
  }
})

module.exports = router
