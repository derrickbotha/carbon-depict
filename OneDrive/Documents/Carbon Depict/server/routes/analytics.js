/**
 * Analytics Routes
 * Handles analytics and dashboard data
 */

const express = require('express')
const router = express.Router()
const { authenticate } = require('../middleware/auth')
const { ESGMetric, GHGEmission, EmissionFactor } = require('../models/mongodb')
const { AppError } = require('../utils/errorHandler')

// Apply authentication to all routes
router.use(authenticate)

// Get dashboard data
router.get('/dashboard', async (req, res, next) => {
  try {
    const { reportingPeriod, startDate, endDate } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    
    // Add date range filtering
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    // Get emissions data
    const emissions = await GHGEmission.find(filter).lean()
    const emissionsByScope = {
      scope1: emissions.filter(e => e.scope === 'scope1').reduce((sum, e) => sum + (e.co2e || 0), 0),
      scope2: emissions.filter(e => e.scope === 'scope2').reduce((sum, e) => sum + (e.co2e || 0), 0),
      scope3: emissions.filter(e => e.scope === 'scope3').reduce((sum, e) => sum + (e.co2e || 0), 0)
    }
    emissionsByScope.total = emissionsByScope.scope1 + emissionsByScope.scope2 + emissionsByScope.scope3

    // Get ESG metrics
    const esgFilter = { ...filter }
    // For ESG metrics, use createdAt field for date filtering
    if (startDate || endDate) {
      esgFilter.createdAt = {}
      if (startDate) esgFilter.createdAt.$gte = new Date(startDate)
      if (endDate) esgFilter.createdAt.$lte = new Date(endDate)
    }
    const esgMetrics = await ESGMetric.find(esgFilter).lean()
    const esgByPillar = {
      environmental: esgMetrics.filter(m => m.pillar === 'environmental'),
      social: esgMetrics.filter(m => m.pillar === 'social'),
      governance: esgMetrics.filter(m => m.pillar === 'governance')
    }

    // Calculate scores (simplified)
    const scores = {
      environmental: Math.min(esgByPillar.environmental.length * 10, 100),
      social: Math.min(esgByPillar.social.length * 10, 100),
      governance: Math.min(esgByPillar.governance.length * 10, 100),
      overall: 0
    }
    scores.overall = Math.round((scores.environmental + scores.social + scores.governance) / 3)

    // Get targets (using ESGMetric instead of ESGTarget)
    const targetsFilter = { ...esgFilter, framework: 'SBTi' }
    const targets = await ESGMetric.find(targetsFilter).lean()
    const sbtiTargets = targets.filter(t => t.framework === 'SBTi')

    const dashboardData = {
      emissions: emissionsByScope,
      esg: {
        scores,
        metrics: esgByPillar
      },
      targets: {
        sbti: {
          status: sbtiTargets.length > 0 ? 'active' : 'pending',
          progress: sbtiTargets.length > 0 ? 75 : 0,
          targetYear: 2030
        }
      },
      frameworks: {
        gri: { score: 65, progress: 65 },
        tcfd: { score: 70, progress: 70 },
        sbti: { score: 75, progress: 75 },
        csrd: { score: 45, progress: 45 },
        cdp: { score: 60, progress: 60 },
        sdg: { score: 55, progress: 55 }
      }
    }

    res.json({
      success: true,
      data: dashboardData
    })
  } catch (error) {
    next(error)
  }
})

// Get emissions analytics
router.get('/emissions', async (req, res, next) => {
  try {
    const { reportingPeriod, scope, startDate, endDate } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (scope) filter.scope = scope
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    const emissions = await GHGEmission.find(filter).lean()

    const analytics = {
      total: emissions.reduce((sum, e) => sum + (e.co2e || 0), 0),
      scope1: emissions.filter(e => e.scope === 'scope1').reduce((sum, e) => sum + (e.co2e || 0), 0),
      scope2: emissions.filter(e => e.scope === 'scope2').reduce((sum, e) => sum + (e.co2e || 0), 0),
      scope3: emissions.filter(e => e.scope === 'scope3').reduce((sum, e) => sum + (e.co2e || 0), 0),
      trends: {
        scope1: 'stable',
        scope2: 'decreasing',
        scope3: 'increasing',
        total: 'stable'
      },
      bySource: emissions.reduce((acc, e) => {
        const source = e.activityType || 'Unknown'
        acc[source] = (acc[source] || 0) + (e.co2e || 0)
        return acc
      }, {})
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
})

// Get ESG analytics
router.get('/esg', async (req, res, next) => {
  try {
    const { reportingPeriod, framework, pillar } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (framework) filter.framework = framework
    if (pillar) filter.pillar = pillar

    const metrics = await ESGMetric.find(filter).lean()

    const analytics = {
      overall: {
        score: Math.min(metrics.length * 5, 100),
        metrics: metrics.length
      },
      environmental: {
        score: Math.min(metrics.filter(m => m.pillar === 'environmental').length * 10, 100),
        metrics: metrics.filter(m => m.pillar === 'environmental')
      },
      social: {
        score: Math.min(metrics.filter(m => m.pillar === 'social').length * 10, 100),
        metrics: metrics.filter(m => m.pillar === 'social')
      },
      governance: {
        score: Math.min(metrics.filter(m => m.pillar === 'governance').length * 10, 100),
        metrics: metrics.filter(m => m.pillar === 'governance')
      },
      frameworks: {
        gri: {
          score: Math.min(metrics.filter(m => m.framework === 'GRI').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'GRI')
        },
        tcfd: {
          score: Math.min(metrics.filter(m => m.framework === 'TCFD').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'TCFD')
        },
        sbti: {
          score: Math.min(metrics.filter(m => m.framework === 'SBTi').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'SBTi')
        },
        csrd: {
          score: Math.min(metrics.filter(m => m.framework === 'CSRD').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'CSRD')
        },
        cdp: {
          score: Math.min(metrics.filter(m => m.framework === 'CDP').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'CDP')
        },
        sdg: {
          score: Math.min(metrics.filter(m => m.framework === 'SDG').length * 8, 100),
          metrics: metrics.filter(m => m.framework === 'SDG')
        }
      }
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    next(error)
  }
})

// Get compliance analytics
router.get('/compliance', async (req, res, next) => {
  try {
    const { reportingPeriod, startDate, endDate } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    
    // Add date range filtering for compliance metrics
    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const metrics = await ESGMetric.find(filter).lean()
    const targetsFilter = { ...filter, framework: 'SBTi' }
    const targets = await ESGMetric.find(targetsFilter).lean()

    const compliance = {
      taxonomy: {
        eligible: 78,
        aligned: 45,
        status: 'on-track'
      },
      csrd: {
        progress: Math.min(metrics.filter(m => m.framework === 'CSRD').length * 5, 100),
        status: metrics.filter(m => m.framework === 'CSRD').length > 10 ? 'compliant' : 'partial'
      },
      overall: {
        score: Math.min(metrics.length * 3, 100),
        status: metrics.length > 20 ? 'compliant' : 'partial'
      }
    }

    res.json({
      success: true,
      data: compliance
    })
  } catch (error) {
    next(error)
  }
})

// Get trends
router.get('/trends', async (req, res, next) => {
  try {
    const { period = '12months', metric } = req.query
    const filter = { companyId: req.user.companyId }

    // This would typically calculate trends over time
    const trends = {
      emissions: {
        trend: 'decreasing',
        change: -12.5,
        period: period
      },
      esg: {
        trend: 'increasing',
        change: 8.3,
        period: period
      },
      compliance: {
        trend: 'increasing',
        change: 15.2,
        period: period
      }
    }

    res.json({
      success: true,
      data: trends
    })
  } catch (error) {
    next(error)
  }
})

// Get benchmarks
router.get('/benchmarks', async (req, res, next) => {
  try {
    const { industry, region } = req.query

    // This would typically fetch from external benchmark data
    const benchmarks = {
      industry: industry || 'manufacturing',
      region: region || 'global',
      emissions: {
        yourIntensity: 0.85,
        industryAverage: 1.2,
        topQuartile: 0.6,
        performance: 'above-average'
      },
      esg: {
        yourScore: 75,
        industryAverage: 65,
        topQuartile: 85,
        performance: 'above-average'
      }
    }

    res.json({
      success: true,
      data: benchmarks
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
