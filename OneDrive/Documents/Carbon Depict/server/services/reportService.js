/**
 * Report Service - Phase 3 Week 10: Service Layer Refactoring
 *
 * Business logic layer for ESG report generation and management
 */
const Report = require('../models/mongodb/Report')
const ESGMetric = require('../models/mongodb/ESGMetric')
const GHGEmission = require('../models/mongodb/GHGEmission')
const logger = require('../utils/logger')
const { buildFilter, buildSort, paginate } = require('../utils/queryBuilder')

class ReportService {
  /**
   * Create a new report
   */
  async createReport(data, userId) {
    try {
      const report = new Report({
        ...data,
        createdBy: userId,
        status: 'draft'
      })

      await report.save()
      logger.info(`Report created: ${report._id}`, { reportId: report._id, userId })

      return report
    } catch (error) {
      logger.error('Error creating report:', error)
      throw error
    }
  }

  /**
   * Get report by ID
   */
  async getReportById(reportId, options = {}) {
    try {
      let query = Report.findById(reportId)

      if (options.populate) {
        query = query
          .populate('companyId', 'name industry')
          .populate('createdBy', 'name email')
      }

      const report = await query.exec()

      if (!report) {
        const error = new Error('Report not found')
        error.statusCode = 404
        throw error
      }

      return report
    } catch (error) {
      logger.error('Error fetching report:', error)
      throw error
    }
  }

  /**
   * Get all reports with filters
   */
  async getReports(filters = {}, options = {}) {
    try {
      const query = buildFilter(filters)
      const sort = buildSort(options.sortBy, options.sortOrder)

      const { page = 1, limit = 20 } = options
      const skip = (page - 1) * limit

      const [reports, total] = await Promise.all([
        Report.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('companyId', 'name industry')
          .populate('createdBy', 'name email')
          .lean(),
        Report.countDocuments(query)
      ])

      return {
        data: reports,
        pagination: paginate(total, page, limit)
      }
    } catch (error) {
      logger.error('Error fetching reports:', error)
      throw error
    }
  }

  /**
   * Update report
   */
  async updateReport(reportId, updates, userId) {
    try {
      const report = await Report.findById(reportId)

      if (!report) {
        const error = new Error('Report not found')
        error.statusCode = 404
        throw error
      }

      Object.assign(report, updates)
      report.updatedBy = userId

      await report.save()
      logger.info(`Report updated: ${reportId}`, { reportId, userId })

      return report
    } catch (error) {
      logger.error('Error updating report:', error)
      throw error
    }
  }

  /**
   * Delete report
   */
  async deleteReport(reportId, userId) {
    try {
      const report = await Report.findById(reportId)

      if (!report) {
        const error = new Error('Report not found')
        error.statusCode = 404
        throw error
      }

      await report.remove()
      logger.info(`Report deleted: ${reportId}`, { reportId, userId })

      return { message: 'Report deleted successfully' }
    } catch (error) {
      logger.error('Error deleting report:', error)
      throw error
    }
  }

  /**
   * Generate report data
   */
  async generateReportData(companyId, reportingPeriod, framework = null) {
    try {
      const query = {
        companyId,
        reportingPeriod,
        status: 'published'
      }

      if (framework) {
        query.framework = framework
      }

      // Fetch all metrics and emissions for the period
      const [metrics, emissions] = await Promise.all([
        ESGMetric.find(query)
          .populate('userId', 'name email')
          .lean(),
        GHGEmission.find({ companyId, reportingPeriod })
          .lean()
      ])

      // Calculate summary statistics
      const summary = this._calculateSummary(metrics, emissions)

      return {
        metrics,
        emissions,
        summary
      }
    } catch (error) {
      logger.error('Error generating report data:', error)
      throw error
    }
  }

  /**
   * Publish report
   */
  async publishReport(reportId, userId) {
    try {
      const report = await Report.findById(reportId)

      if (!report) {
        const error = new Error('Report not found')
        error.statusCode = 404
        throw error
      }

      if (report.status === 'published') {
        const error = new Error('Report is already published')
        error.statusCode = 400
        throw error
      }

      report.status = 'published'
      report.publishedAt = new Date()
      report.publishedBy = userId

      await report.save()
      logger.info(`Report published: ${reportId}`, { reportId, userId })

      return report
    } catch (error) {
      logger.error('Error publishing report:', error)
      throw error
    }
  }

  /**
   * Archive report
   */
  async archiveReport(reportId, userId) {
    try {
      const report = await Report.findById(reportId)

      if (!report) {
        const error = new Error('Report not found')
        error.statusCode = 404
        throw error
      }

      report.status = 'archived'
      report.archivedAt = new Date()
      report.archivedBy = userId

      await report.save()
      logger.info(`Report archived: ${reportId}`, { reportId, userId })

      return report
    } catch (error) {
      logger.error('Error archiving report:', error)
      throw error
    }
  }

  /**
   * Calculate summary statistics (private method)
   */
  _calculateSummary(metrics, emissions) {
    const summary = {
      totalMetrics: metrics.length,
      totalEmissions: emissions.length,
      pillars: {
        environmental: 0,
        social: 0,
        governance: 0
      },
      compliance: {
        compliant: 0,
        non_compliant: 0,
        pending: 0,
        not_applicable: 0
      },
      avgComplianceScore: 0
    }

    // Count by pillar
    metrics.forEach(metric => {
      if (summary.pillars[metric.pillar] !== undefined) {
        summary.pillars[metric.pillar]++
      }

      if (summary.compliance[metric.complianceStatus] !== undefined) {
        summary.compliance[metric.complianceStatus]++
      }
    })

    // Calculate average compliance score
    const scores = metrics
      .map(m => m.complianceScore)
      .filter(s => s !== null && s !== undefined)

    if (scores.length > 0) {
      summary.avgComplianceScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length
    }

    return summary
  }

  /**
   * Get reports by company
   */
  async getReportsByCompany(companyId, options = {}) {
    try {
      const { page = 1, limit = 20, status } = options

      const query = { companyId }
      if (status) {
        query.status = status
      }

      const skip = (page - 1) * limit

      const [reports, total] = await Promise.all([
        Report.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('createdBy', 'name email')
          .lean(),
        Report.countDocuments(query)
      ])

      return {
        data: reports,
        pagination: paginate(total, page, limit)
      }
    } catch (error) {
      logger.error('Error fetching company reports:', error)
      throw error
    }
  }
}

module.exports = new ReportService()
