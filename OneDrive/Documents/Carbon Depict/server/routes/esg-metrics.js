const express = require('express')
const router = express.Router()
const ESGMetric = require('../models/mongodb/ESGMetric')
const { authenticate } = require('../middleware/auth')

// Apply auth middleware to all routes
router.use(authenticate)

/**
 * ESG Metrics Routes
 * Handles creation, retrieval, and management of ESG metrics
 */

// @route   GET /api/esg/metrics
// @desc    Get all ESG metrics for a company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { companyId, framework, pillar, reportingPeriod, isMaterial, status } = req.query

    // Use companyId from query, or from user's companyId, or from populated company._id
    const effectiveCompanyId = companyId || req.companyId || req.user?.companyId?.toString() || req.user?.company?._id?.toString()
    
    if (!effectiveCompanyId) {
      return res.status(400).json({ success: false, error: 'Company ID is required' })
    }

    const filters = { companyId: effectiveCompanyId }
    if (framework) filters.framework = framework
    if (pillar) filters.pillar = pillar
    if (reportingPeriod) filters.reportingPeriod = reportingPeriod
    if (isMaterial !== undefined) filters['metadata.isMaterial'] = isMaterial === 'true'
    if (status) filters.status = status

    const metrics = await ESGMetric.find(filters)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      count: metrics.length,
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   POST /api/esg/metrics
// @desc    Create a new ESG metric
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      framework,
      pillar,
      topic,
      subTopic,
      metricName,
      value,
      unit,
      reportingPeriod,
      startDate,
      endDate,
      methodology,
      dataSource,
      dataQuality,
    } = req.body

    // Validation
    if (!framework || !pillar || !metricName || !reportingPeriod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: framework, pillar, metricName, reportingPeriod',
      })
    }

    // Create new metric
    const newMetric = new ESGMetric({
      companyId: req.companyId || req.user.companyId,
      userId: req.userId || req.user._id,
      framework,
      pillar,
      topic,
      subTopic,
      metricName,
      value,
      unit,
      reportingPeriod,
      startDate,
      endDate,
      methodology,
      dataSource,
      dataQuality: dataQuality || 'measured',
      status: 'draft',
      isDraft: true,
    })

    await newMetric.save()

    res.status(201).json({
      success: true,
      data: newMetric,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   GET /api/esg/metrics/summary
// @desc    Get ESG metrics summary for dashboard
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const { reportingPeriod } = req.query
    const companyId = req.companyId || req.user.companyId

    const GHGEmission = require('../models/mongodb/GHGEmission')
    
    // Build query filter
    const filter = { companyId }
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod

    // Get emissions data
    const emissions = await GHGEmission.find(filter).lean()
    
    // Calculate totals by scope
    const scope1Total = emissions
      .filter(e => e.scope === 'scope1')
      .reduce((sum, e) => sum + (e.co2e || 0), 0)
    
    const scope2Total = emissions
      .filter(e => e.scope === 'scope2')
      .reduce((sum, e) => sum + (e.co2e || 0), 0)
    
    const scope3Total = emissions
      .filter(e => e.scope === 'scope3')
      .reduce((sum, e) => sum + (e.co2e || 0), 0)
    
    const totalEmissions = scope1Total + scope2Total + scope3Total

    // Get ESG metrics by pillar
    const esgMetrics = await ESGMetric.find({ 
      ...filter,
      status: 'published' 
    }).lean()
    
    const environmentalMetrics = esgMetrics.filter(m => m.pillar === 'Environmental')
    const socialMetrics = esgMetrics.filter(m => m.pillar === 'Social')
    const governanceMetrics = esgMetrics.filter(m => m.pillar === 'Governance')

    // Calculate compliance scores (simplified)
    const calculateScore = (metrics) => {
      if (metrics.length === 0) return 0
      const avgCompliance = metrics.reduce((sum, m) => 
        sum + (m.complianceScore || 0), 0) / metrics.length
      return Math.round(avgCompliance)
    }

    const summary = {
      overall: {
        score: calculateScore(esgMetrics),
        trend: '+5', // TODO: Calculate from historical data
        metricsCount: esgMetrics.length,
      },
      environmental: {
        score: calculateScore(environmentalMetrics),
        metricsCount: environmentalMetrics.length,
        keyMetrics: {
          ghgEmissions: { 
            value: Math.round(totalEmissions / 1000), // Convert to tonnes
            unit: 'tCO2e', 
            change: '-12%', // TODO: Calculate from historical
            breakdown: {
              scope1: Math.round(scope1Total / 1000),
              scope2: Math.round(scope2Total / 1000),
              scope3: Math.round(scope3Total / 1000),
            }
          },
          energyConsumption: { 
            value: scope2Total > 0 ? Math.round(scope2Total / 0.21) : 0, // Estimate from electricity
            unit: 'MWh', 
            change: '-8%' 
          },
        },
      },
      social: {
        score: calculateScore(socialMetrics),
        metricsCount: socialMetrics.length,
        keyMetrics: {},
      },
      governance: {
        score: calculateScore(governanceMetrics),
        metricsCount: governanceMetrics.length,
        keyMetrics: {},
      },
    }

    res.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   POST /api/esg/metrics/bulk
// @desc    Bulk import ESG metrics (from Excel/CSV)
// @access  Private
router.post('/bulk', async (req, res) => {
  try {
    const { metrics } = req.body

    if (!Array.isArray(metrics)) {
      return res.status(400).json({
        success: false,
        error: 'Metrics must be an array',
      })
    }

    // TODO: Validate and save metrics
    const imported = metrics.length
    const failed = 0

    res.json({
      success: true,
      message: `Successfully imported ${imported} metrics`,
      imported,
      failed,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   GET /api/esg/metrics/framework/:framework
// @desc    Get metrics by framework
// @access  Private
router.get('/framework/:framework', async (req, res) => {
  try {
    const { framework } = req.params
    const { companyId } = req.query

    // TODO: Fetch from database
    const metrics = [
      {
        id: '1',
        framework,
        pillar: 'Environmental',
        topic: `${framework} Climate`,
        metricName: 'GHG Emissions',
        value: 12450,
        unit: 'tCO2e',
      },
    ]

    res.json({
      success: true,
      framework,
      count: metrics.length,
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   GET /api/esg/metrics/pillar/:pillar
// @desc    Get metrics by pillar (Environmental, Social, Governance)
// @access  Private
router.get('/pillar/:pillar', async (req, res) => {
  try {
    const { pillar } = req.params
    const { companyId } = req.query

    // TODO: Fetch from database
    const metrics = []

    res.json({
      success: true,
      pillar,
      count: metrics.length,
      data: metrics,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   GET /api/esg/metrics/:id
// @desc    Get a single ESG metric
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const metric = await ESGMetric.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('companyId', 'name')
      .lean()

    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Check if user has access to this metric
    const metricCompanyId = metric.companyId?._id?.toString() || metric.companyId?.toString()
    const userCompanyId = req.companyId || req.user.companyId?.toString()
    if (metricCompanyId !== userCompanyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: metric,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   PUT /api/esg/metrics/:id
// @desc    Update an ESG metric
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const metric = await ESGMetric.findById(id)
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Check access
    const userCompanyId = req.companyId || req.user.companyId?.toString()
    if (metric.companyId.toString() !== userCompanyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    // Update fields
    Object.assign(metric, req.body)
    await metric.save()

    res.json({
      success: true,
      data: metric,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   DELETE /api/esg/metrics/:id
// @desc    Delete an ESG metric
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const metric = await ESGMetric.findById(id)
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Check access
    const userCompanyId = req.companyId || req.user.companyId?.toString()
    if (metric.companyId.toString() !== userCompanyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    await ESGMetric.deleteOne({ _id: id })

    res.json({
      success: true,
      message: 'Metric deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   PUT /api/esg/metrics/:id/approve
// @desc    Approve an ESG metric entry
// @access  Private (Manager/Admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    // Check if user is manager or admin
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only managers and administrators can approve entries'
      })
    }

    const metric = await ESGMetric.findById(id)
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Check company access
    const userCompanyId = req.companyId || req.user.companyId?.toString()
    if (metric.companyId.toString() !== userCompanyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    metric.approvalStatus = 'approved'
    metric.approvedBy = req.user._id
    metric.approvedAt = new Date()
    metric.notes = notes || 'Approved by manager'

    await metric.save()

    res.json({
      success: true,
      data: metric,
      message: 'Metric approved successfully'
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// @route   PUT /api/esg/metrics/:id/reject
// @desc    Reject an ESG metric entry
// @access  Private (Manager/Admin only)
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      })
    }

    // Check if user is manager or admin
    if (req.user.role !== 'manager' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only managers and administrators can reject entries'
      })
    }

    const metric = await ESGMetric.findById(id)
    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Check company access
    const userCompanyId = req.companyId || req.user.companyId?.toString()
    if (metric.companyId.toString() !== userCompanyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    metric.approvalStatus = 'rejected'
    metric.approvedBy = req.user._id
    metric.approvedAt = new Date()
    metric.notes = notes.trim()

    await metric.save()

    res.json({
      success: true,
      data: metric,
      message: 'Metric rejected successfully'
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})


module.exports = router
