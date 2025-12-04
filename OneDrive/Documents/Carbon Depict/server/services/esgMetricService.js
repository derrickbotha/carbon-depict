/**
 * ESG Metric Service - Phase 3 Week 10: Service Layer Refactoring
 *
 * Business logic layer for ESG metrics management
 */

const ESGMetric = require('../models/mongodb/ESGMetric')
const logger = require('../utils/logger')
const { buildFilter, buildSort, paginate } = require('../utils/queryBuilder')
const { getOrSet, invalidate } = require('../utils/cacheManager')

class ESGMetricService {
  /**
   * Create a new ESG metric
   */
  async create(metricData, userId) {
    try {
      logger.info('Creating ESG metric', {
        companyId: metricData.companyId,
        pillar: metricData.pillar,
        topic: metricData.topic,
        userId
      })

      // Add user ID
      metricData.userId = userId

      const metric = new ESGMetric(metricData)
      await metric.save()

      // Invalidate cache
      await this.invalidateCompanyCache(metricData.companyId)

      logger.info('ESG metric created successfully', {
        id: metric._id,
        topic: metric.topic
      })

      return metric
    } catch (error) {
      logger.error('Failed to create ESG metric', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /**
   * Get metric by ID
   */
  async getById(id, options = {}) {
    try {
      const cacheKey = `esg:metric:${id}`

      if (!options.skipCache) {
        const cached = await getOrSet(
          cacheKey,
          async () => {
            let query = ESGMetric.findById(id)
            if (options.populate) {
              query = query.populate(options.populate)
            }
            return query.lean()
          },
          300
        )
        return cached.data
      }

      let query = ESGMetric.findById(id)
      if (options.populate) {
        query = query.populate(options.populate)
      }
      return query.lean()
    } catch (error) {
      logger.error('Failed to get ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Get all metrics with filtering, sorting, and pagination
   */
  async getAll(queryParams, userId) {
    try {
      logger.info('Fetching ESG metrics', { userId, params: queryParams })

      const allowedFilters = [
        'companyId',
        'framework',
        'pillar',
        'topic',
        'subTopic',
        'status',
        'reportingPeriod',
        'dataQuality',
        'complianceStatus',
        'approvalStatus'
      ]

      const filter = buildFilter(queryParams, allowedFilters)
      const sort = buildSort(queryParams, '-createdAt')

      const result = await paginate(
        ESGMetric,
        filter,
        {
          page: parseInt(queryParams.page) || 1,
          limit: parseInt(queryParams.limit) || 50,
          sort,
          populate: queryParams.populate
        }
      )

      logger.info('ESG metrics fetched', {
        count: result.data.length,
        total: result.pagination.total
      })

      return result
    } catch (error) {
      logger.error('Failed to fetch ESG metrics', {
        error: error.message
      })
      throw error
    }
  }

  /**
   * Update ESG metric
   */
  async update(id, updateData, userId) {
    try {
      logger.info('Updating ESG metric', { id, userId })

      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      Object.assign(metric, updateData)
      await metric.save()

      // Invalidate cache
      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric updated', { id })

      return metric
    } catch (error) {
      logger.error('Failed to update ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Delete ESG metric
   */
  async delete(id, userId) {
    try {
      logger.info('Deleting ESG metric', { id, userId })

      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      const companyId = metric.companyId
      await metric.remove()

      // Invalidate cache
      await this.invalidateCache(id, companyId)

      logger.info('ESG metric deleted', { id })

      return { success: true, message: 'ESG metric deleted successfully' }
    } catch (error) {
      logger.error('Failed to delete ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Publish metric
   */
  async publish(id, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      await metric.publish()

      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric published', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to publish ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Archive metric
   */
  async archive(id, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      await metric.archive()

      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric archived', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to archive ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Approve metric
   */
  async approve(id, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      await metric.approve(userId)

      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric approved', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to approve ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Reject metric
   */
  async reject(id, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      await metric.reject(userId)

      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric rejected', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to reject ESG metric', { error: error.message, id })
      throw error
    }
  }

  /**
   * Request changes for metric
   */
  async requestChanges(id, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      await metric.requestChanges(userId)

      await this.invalidateCache(id, metric.companyId)

      logger.info('ESG metric changes requested', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to request changes for ESG metric', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Add proof to metric
   */
  async addProof(id, proofData, userId) {
    try {
      const metric = await ESGMetric.findById(id)
      if (!metric) {
        throw new Error('ESG metric not found')
      }

      proofData.uploadedBy = userId
      await metric.addProof(proofData)

      await this.invalidateCache(id, metric.companyId)

      logger.info('Proof added to ESG metric', { id, userId })

      return metric
    } catch (error) {
      logger.error('Failed to add proof to ESG metric', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Get metrics by pillar
   */
  async getByPillar(companyId, pillar, reportingPeriod) {
    try {
      const cacheKey = `esg:pillar:${companyId}:${pillar}:${reportingPeriod}`

      const result = await getOrSet(
        cacheKey,
        async () => ESGMetric.getByPillar(companyId, pillar, reportingPeriod),
        600
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get metrics by pillar', {
        error: error.message,
        companyId,
        pillar
      })
      throw error
    }
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(companyId, reportingPeriod) {
    try {
      const cacheKey = `esg:dashboard:${companyId}:${reportingPeriod}`

      const result = await getOrSet(
        cacheKey,
        async () => ESGMetric.getDashboardSummary(companyId, reportingPeriod),
        600
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get dashboard summary', {
        error: error.message,
        companyId
      })
      throw error
    }
  }

  /**
   * Get pending approval metrics
   */
  async getPendingApproval(companyId, limit = 50) {
    try {
      const cacheKey = `esg:pending:${companyId}`

      const result = await getOrSet(
        cacheKey,
        async () => ESGMetric.findPendingApproval(companyId, limit),
        300
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get pending approval metrics', {
        error: error.message,
        companyId
      })
      throw error
    }
  }

  /**
   * Get compliance summary
   */
  async getComplianceSummary(companyId, framework, reportingPeriod) {
    try {
      const cacheKey = `esg:compliance:${companyId}:${framework}:${reportingPeriod}`

      const result = await getOrSet(
        cacheKey,
        async () => ESGMetric.getComplianceSummary(companyId, framework, reportingPeriod),
        600
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get compliance summary', {
        error: error.message,
        companyId,
        framework
      })
      throw error
    }
  }

  /**
   * Bulk create metrics
   */
  async bulkCreate(metricsData, userId) {
    try {
      logger.info('Bulk creating ESG metrics', {
        count: metricsData.length,
        userId
      })

      const dataWithUserId = metricsData.map(data => ({
        ...data,
        userId
      }))

      const metrics = await ESGMetric.insertMany(dataWithUserId, { ordered: false })

      // Invalidate cache for all affected companies
      const companyIds = [...new Set(metricsData.map(m => m.companyId))]
      for (const companyId of companyIds) {
        await this.invalidateCompanyCache(companyId)
      }

      logger.info('Bulk ESG metrics created', { count: metrics.length })

      return metrics
    } catch (error) {
      logger.error('Failed to bulk create ESG metrics', {
        error: error.message
      })
      throw error
    }
  }

  /**
   * Invalidate cache for specific metric
   */
  async invalidateCache(metricId, companyId) {
    await invalidate(`esg:metric:${metricId}`)
    await this.invalidateCompanyCache(companyId)
  }

  /**
   * Invalidate all cache for a company
   */
  async invalidateCompanyCache(companyId) {
    await invalidate(`esg:pillar:${companyId}:*`)
    await invalidate(`esg:dashboard:${companyId}:*`)
    await invalidate(`esg:pending:${companyId}`)
    await invalidate(`esg:compliance:${companyId}:*`)
  }
}

module.exports = new ESGMetricService()
