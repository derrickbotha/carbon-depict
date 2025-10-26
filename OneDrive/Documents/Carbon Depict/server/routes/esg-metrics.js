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

    const filters = { companyId: companyId || req.user.company }
    if (framework) filters.framework = framework
    if (pillar) filters.pillar = pillar
    if (reportingPeriod) filters.reportingPeriod = reportingPeriod
    if (isMaterial !== undefined) filters['metadata.isMaterial'] = isMaterial === 'true'
    if (status) filters.status = status

    const metrics = await ESGMetric.find(filters)
      .populate('userId', 'name email')
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId || req.user?.company?._id || req.user?.company
    const userId = req.user?._id || req.user?.id
    
    // Create new metric
    const newMetric = new ESGMetric({
      companyId: companyId,
      userId: userId,
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

// @route   GET /api/esg/metrics/:id
// @desc    Get a single ESG metric
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const metric = await ESGMetric.findById(id)
      .populate('userId', 'name email')
      .populate('companyId', 'name')
      .lean()

    if (!metric) {
      return res.status(404).json({
        success: false,
        error: 'Metric not found'
      })
    }

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId
    
    // Check access - ensure user can only view their company's metrics
    const metricCompanyId = metric.companyId?._id?.toString() || metric.companyId?.toString() || metric.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString() || req.user?.company?.toString()

    if (metricCompanyId !== userCompanyId) {
      console.error('Get metric access denied:', {
        metricCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId
    
    // Check access - ensure user can only update their company's metrics
    const metricCompanyId = metric.companyId?.toString() || metric.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString() || req.user?.company?.toString()

    if (metricCompanyId !== userCompanyId) {
      console.error('Update metric access denied:', {
        metricCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId
    
    // Check access - ensure user can only delete their company's metrics
    const metricCompanyId = metric.companyId?.toString() || metric.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString()

    if (metricCompanyId !== userCompanyId) {
      console.error('Delete metric access denied:', {
        metricCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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
    console.error('Error deleting metric:', error)
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

// @route   GET /api/esg/metrics/summary
// @desc    Get ESG metrics summary for dashboard
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const { reportingPeriod } = req.query
    const companyId = req.user.company

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

module.exports = router
