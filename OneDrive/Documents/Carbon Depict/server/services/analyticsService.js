/**
 * Analytics Service - Phase 4 Week 17: Advanced Analytics
 *
 * Provides comprehensive analytics and insights:
 * - Emissions trends and forecasting
 * - ESG performance metrics
 * - Compliance analytics
 * - Comparative analysis
 * - KPI tracking
 */
const GHGEmission = require('../models/mongodb/GHGEmission')
const ESGMetric = require('../models/mongodb/ESGMetric')
const logger = require('../utils/logger')
const { getOrSet } = require('../utils/cacheManager')

class AnalyticsService {
  /**
   * Get emissions dashboard analytics
   */
  async getEmissionsDashboard(companyId, options = {}) {
    try {
      const { reportingPeriod, startDate, endDate } = options

      const cacheKey = `analytics:emissions:${companyId}:${reportingPeriod || 'all'}`

      return await getOrSet(cacheKey, async () => {
        const query = { companyId }

        if (reportingPeriod) {
          query.reportingPeriod = reportingPeriod
        }

        if (startDate && endDate) {
          query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
        }

        // Parallel queries for better performance
        const [
          totalEmissions,
          emissionsByScope,
          emissionsBySource,
          emissionsByMonth,
          topEmitters
        ] = await Promise.all([
          this._getTotalEmissions(query),
          this._getEmissionsByScope(query),
          this._getEmissionsBySource(query),
          this._getEmissionsByMonth(query),
          this._getTopEmitters(query, 10)
        ])

        return {
          summary: {
            totalEmissions: totalEmissions.total,
            scope1: totalEmissions.scope1,
            scope2: totalEmissions.scope2,
            scope3: totalEmissions.scope3,
            avgIntensity: totalEmissions.avgIntensity
          },
          byScope: emissionsByScope,
          bySource: emissionsBySource,
          trends: emissionsByMonth,
          topEmitters
        }
      }, 300) // Cache for 5 minutes
    } catch (error) {
      logger.error('Error getting emissions dashboard:', error)
      throw error
    }
  }

  /**
   * Get ESG performance analytics
   */
  async getESGPerformance(companyId, options = {}) {
    try {
      const { reportingPeriod, framework } = options

      const cacheKey = `analytics:esg:${companyId}:${reportingPeriod}:${framework || 'all'}`

      return await getOrSet(cacheKey, async () => {
        const query = { companyId, status: { $ne: 'archived' } }

        if (reportingPeriod) {
          query.reportingPeriod = reportingPeriod
        }

        if (framework) {
          query.framework = framework
        }

        const [
          pillarPerformance,
          complianceOverview,
          frameworkScores,
          topicsProgress
        ] = await Promise.all([
          this._getPillarPerformance(query),
          this._getComplianceOverview(query),
          this._getFrameworkScores(companyId, reportingPeriod),
          this._getTopicsProgress(query)
        ])

        return {
          pillars: pillarPerformance,
          compliance: complianceOverview,
          frameworks: frameworkScores,
          topics: topicsProgress
        }
      }, 300)
    } catch (error) {
      logger.error('Error getting ESG performance:', error)
      throw error
    }
  }

  /**
   * Get emissions trends with forecasting
   */
  async getEmissionsTrends(companyId, options = {}) {
    try {
      const { months = 12, forecast = false } = options

      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const emissions = await GHGEmission.aggregate([
        {
          $match: {
            companyId,
            date: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            total: { $sum: '$co2e' },
            scope1: { $sum: { $cond: [{ $eq: ['$scope', 'scope1'] }, '$co2e', 0] } },
            scope2: { $sum: { $cond: [{ $eq: ['$scope', 'scope2'] }, '$co2e', 0] } },
            scope3: { $sum: { $cond: [{ $eq: ['$scope', 'scope3'] }, '$co2e', 0] } }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ])

      const trends = emissions.map(e => ({
        period: `${e._id.year}-${String(e._id.month).padStart(2, '0')}`,
        total: Math.round(e.total * 100) / 100,
        scope1: Math.round(e.scope1 * 100) / 100,
        scope2: Math.round(e.scope2 * 100) / 100,
        scope3: Math.round(e.scope3 * 100) / 100
      }))

      // Simple linear regression forecast if requested
      if (forecast && trends.length >= 3) {
        const forecasted = this._forecastEmissions(trends, 3)
        return {
          historical: trends,
          forecast: forecasted
        }
      }

      return { historical: trends }
    } catch (error) {
      logger.error('Error getting emissions trends:', error)
      throw error
    }
  }

  /**
   * Get comparative analysis
   */
  async getComparativeAnalysis(companyId, options = {}) {
    try {
      const { compareWith = 'industry', reportingPeriod } = options

      // Get company data
      const companyData = await this.getEmissionsDashboard(companyId, { reportingPeriod })

      // Get comparison data (placeholder - would need industry benchmarks)
      const comparisonData = {
        industryAverage: {
          totalEmissions: 50000,
          scope1Percentage: 40,
          scope2Percentage: 35,
          scope3Percentage: 25
        }
      }

      return {
        company: companyData.summary,
        comparison: comparisonData,
        variance: {
          total: ((companyData.summary.totalEmissions - comparisonData.industryAverage.totalEmissions) / comparisonData.industryAverage.totalEmissions * 100).toFixed(2)
        }
      }
    } catch (error) {
      logger.error('Error getting comparative analysis:', error)
      throw error
    }
  }

  /**
   * Get KPI tracking
   */
  async getKPITracking(companyId, options = {}) {
    try {
      const { reportingPeriod } = options

      const kpis = await Promise.all([
        this._getEmissionsReductionRate(companyId, reportingPeriod),
        this._getComplianceRate(companyId, reportingPeriod),
        this._getDataQualityScore(companyId, reportingPeriod),
        this._getReportingCompleteness(companyId, reportingPeriod)
      ])

      return {
        emissionsReduction: kpis[0],
        complianceRate: kpis[1],
        dataQuality: kpis[2],
        reportingCompleteness: kpis[3]
      }
    } catch (error) {
      logger.error('Error getting KPI tracking:', error)
      throw error
    }
  }

  // ============ Private Helper Methods ============

  async _getTotalEmissions(query) {
    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: '$co2e' },
          scope1: { $sum: { $cond: [{ $eq: ['$scope', 'scope1'] }, '$co2e', 0] } },
          scope2: { $sum: { $cond: [{ $eq: ['$scope', 'scope2'] }, '$co2e', 0] } },
          scope3: { $sum: { $cond: [{ $eq: ['$scope', 'scope3'] }, '$co2e', 0] } },
          avgIntensity: { $avg: '$intensity' }
        }
      }
    ])

    return result[0] || { total: 0, scope1: 0, scope2: 0, scope3: 0, avgIntensity: 0 }
  }

  async _getEmissionsByScope(query) {
    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$scope',
          total: { $sum: '$co2e' },
          count: { $sum: 1 }
        }
      }
    ])

    return result
  }

  async _getEmissionsBySource(query) {
    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$source',
          total: { $sum: '$co2e' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ])

    return result
  }

  async _getEmissionsByMonth(query) {
    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$co2e' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    return result
  }

  async _getTopEmitters(query, limit) {
    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            source: '$source',
            category: '$category'
          },
          total: { $sum: '$co2e' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: limit }
    ])

    return result
  }

  async _getPillarPerformance(query) {
    const result = await ESGMetric.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$pillar',
          total: { $sum: 1 },
          avgComplianceScore: { $avg: '$complianceScore' },
          compliant: {
            $sum: { $cond: [{ $eq: ['$complianceStatus', 'compliant'] }, 1, 0] }
          }
        }
      }
    ])

    return result
  }

  async _getComplianceOverview(query) {
    const result = await ESGMetric.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$complianceStatus',
          count: { $sum: 1 }
        }
      }
    ])

    return result
  }

  async _getFrameworkScores(companyId, reportingPeriod) {
    const query = { companyId, status: 'published' }
    if (reportingPeriod) query.reportingPeriod = reportingPeriod

    const result = await ESGMetric.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$framework',
          avgScore: { $avg: '$complianceScore' },
          count: { $sum: 1 }
        }
      }
    ])

    return result
  }

  async _getTopicsProgress(query) {
    const result = await ESGMetric.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            pillar: '$pillar',
            topic: '$topic'
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.pillar': 1, '_id.topic': 1 } }
    ])

    return result
  }

  async _getEmissionsReductionRate(companyId, reportingPeriod) {
    // Calculate year-over-year reduction
    const currentYear = reportingPeriod || new Date().getFullYear().toString()
    const previousYear = (parseInt(currentYear) - 1).toString()

    const [current, previous] = await Promise.all([
      GHGEmission.aggregate([
        { $match: { companyId, reportingPeriod: currentYear } },
        { $group: { _id: null, total: { $sum: '$co2e' } } }
      ]),
      GHGEmission.aggregate([
        { $match: { companyId, reportingPeriod: previousYear } },
        { $group: { _id: null, total: { $sum: '$co2e' } } }
      ])
    ])

    const currentTotal = current[0]?.total || 0
    const previousTotal = previous[0]?.total || 0

    if (previousTotal === 0) return { rate: 0, status: 'N/A' }

    const rate = ((previousTotal - currentTotal) / previousTotal * 100).toFixed(2)

    return {
      rate: parseFloat(rate),
      status: rate > 0 ? 'improving' : 'declining',
      current: currentTotal,
      previous: previousTotal
    }
  }

  async _getComplianceRate(companyId, reportingPeriod) {
    const query = { companyId, status: { $ne: 'archived' } }
    if (reportingPeriod) query.reportingPeriod = reportingPeriod

    const result = await ESGMetric.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          compliant: {
            $sum: { $cond: [{ $eq: ['$complianceStatus', 'compliant'] }, 1, 0] }
          }
        }
      }
    ])

    const data = result[0] || { total: 0, compliant: 0 }
    const rate = data.total > 0 ? (data.compliant / data.total * 100).toFixed(2) : 0

    return {
      rate: parseFloat(rate),
      compliant: data.compliant,
      total: data.total
    }
  }

  async _getDataQualityScore(companyId, reportingPeriod) {
    const query = { companyId }
    if (reportingPeriod) query.reportingPeriod = reportingPeriod

    const result = await GHGEmission.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$dataQuality',
          count: { $sum: 1 }
        }
      }
    ])

    // Calculate weighted score (measured=100, estimated=80, calculated=60)
    const weights = { measured: 100, estimated: 80, calculated: 60, modeled: 40 }
    let totalScore = 0
    let totalCount = 0

    result.forEach(r => {
      const weight = weights[r._id] || 50
      totalScore += weight * r.count
      totalCount += r.count
    })

    const score = totalCount > 0 ? (totalScore / totalCount).toFixed(2) : 0

    return {
      score: parseFloat(score),
      distribution: result
    }
  }

  async _getReportingCompleteness(companyId, reportingPeriod) {
    const query = { companyId }
    if (reportingPeriod) query.reportingPeriod = reportingPeriod

    const [emissions, metrics] = await Promise.all([
      GHGEmission.countDocuments({ ...query, status: 'verified' }),
      ESGMetric.countDocuments({ ...query, status: 'published' })
    ])

    // Simple completeness calculation
    const expectedEmissions = 100 // Define expected counts based on framework
    const expectedMetrics = 50

    const emissionsCompleteness = Math.min((emissions / expectedEmissions * 100), 100)
    const metricsCompleteness = Math.min((metrics / expectedMetrics * 100), 100)

    const overall = ((emissionsCompleteness + metricsCompleteness) / 2).toFixed(2)

    return {
      overall: parseFloat(overall),
      emissions: emissionsCompleteness.toFixed(2),
      metrics: metricsCompleteness.toFixed(2)
    }
  }

  _forecastEmissions(trends, periods) {
    // Simple linear regression
    const n = trends.length
    const x = trends.map((_, i) => i)
    const y = trends.map(t => t.total)

    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Generate forecast
    const forecast = []
    const lastPeriod = trends[trends.length - 1].period
    const [year, month] = lastPeriod.split('-').map(Number)

    for (let i = 1; i <= periods; i++) {
      const nextMonth = month + i
      const nextYear = year + Math.floor((nextMonth - 1) / 12)
      const adjustedMonth = ((nextMonth - 1) % 12) + 1

      const forecastValue = slope * (n + i - 1) + intercept

      forecast.push({
        period: `${nextYear}-${String(adjustedMonth).padStart(2, '0')}`,
        total: Math.max(0, Math.round(forecastValue * 100) / 100),
        isForecast: true
      })
    }

    return forecast
  }
}

module.exports = new AnalyticsService()
