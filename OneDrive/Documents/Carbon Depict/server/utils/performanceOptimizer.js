/**
 * Performance Optimizer - Phase 4 Week 24
 *
 * Production optimization utilities:
 * - Query optimization
 * - Connection pooling
 * - Memory management
 * - Performance monitoring
 */
const logger = require('./logger')

class PerformanceOptimizer {
  constructor() {
    this.queryMetrics = []
    this.memorySnapshots = []
  }

  /**
   * Optimize MongoDB queries
   */
  async optimizeQuery(Model, query, options = {}) {
    const startTime = Date.now()

    try {
      // Use lean() for read-only queries
      if (options.lean !== false) {
        query = query.lean()
      }

      // Add projection if specified
      if (options.select) {
        query = query.select(options.select)
      }

      // Add limit for safety
      if (!options.noLimit && !query._mongooseOptions.limit) {
        query = query.limit(1000)
      }

      // Execute with explain in development
      if (process.env.NODE_ENV === 'development' && options.explain) {
        const explained = await query.explain()
        this._analyzeExplain(explained)
      }

      const result = await query.exec()

      // Track metrics
      const duration = Date.now() - startTime
      this._trackQueryMetrics(Model.modelName, duration, query)

      // Warn on slow queries
      if (duration > 1000) {
        logger.warn('Slow query detected:', {
          model: Model.modelName,
          duration: `${duration}ms`,
          query: query.getQuery()
        })
      }

      return result
    } catch (error) {
      logger.error('Query optimization error:', error)
      throw error
    }
  }

  /**
   * Batch operations for better performance
   */
  async batchOperation(Model, operations, batchSize = 100) {
    const results = []

    for (let i = 0; i < operations.length; i += batchSize) {
      const batch = operations.slice(i, i + batchSize)

      try {
        const batchResults = await Model.bulkWrite(batch, {
          ordered: false
        })

        results.push(batchResults)

        logger.info(`Batch operation completed: ${i + batch.length}/${operations.length}`)
      } catch (error) {
        logger.error('Batch operation error:', error)
        throw error
      }
    }

    return results
  }

  /**
   * Optimize aggregation pipeline
   */
  optimizeAggregation(pipeline) {
    const optimized = [...pipeline]

    // Move $match to the beginning
    const matchIndex = optimized.findIndex(stage => stage.$match)
    if (matchIndex > 0) {
      const matchStage = optimized.splice(matchIndex, 1)[0]
      optimized.unshift(matchStage)
    }

    // Add $limit early if not present
    const hasLimit = optimized.some(stage => stage.$limit)
    if (!hasLimit) {
      const sortIndex = optimized.findIndex(stage => stage.$sort)
      if (sortIndex >= 0) {
        optimized.splice(sortIndex + 1, 0, { $limit: 1000 })
      }
    }

    return optimized
  }

  /**
   * Memory usage monitoring
   */
  monitorMemory() {
    const usage = process.memoryUsage()

    const snapshot = {
      timestamp: new Date(),
      rss: Math.round(usage.rss / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024)
    }

    this.memorySnapshots.push(snapshot)

    // Keep only last 100 snapshots
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift()
    }

    // Warn on high memory usage
    if (snapshot.heapUsed > 1024) { // 1GB
      logger.warn('High memory usage detected:', snapshot)
    }

    return snapshot
  }

  /**
   * Connection pool optimization
   */
  optimizeConnectionPool(mongoose) {
    const config = {
      poolSize: process.env.MONGODB_POOL_SIZE || 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 50,
      minPoolSize: 5
    }

    logger.info('Connection pool optimized:', config)

    return config
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const avgQueryTime = this.queryMetrics.length > 0
      ? this.queryMetrics.reduce((sum, m) => sum + m.duration, 0) / this.queryMetrics.length
      : 0

    const slowQueries = this.queryMetrics.filter(m => m.duration > 1000).length

    return {
      totalQueries: this.queryMetrics.length,
      avgQueryTime: Math.round(avgQueryTime),
      slowQueries,
      memoryUsage: this.memorySnapshots[this.memorySnapshots.length - 1]
    }
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.queryMetrics = []
    this.memorySnapshots = []
  }

  // ============ Private Methods ============

  _trackQueryMetrics(model, duration, query) {
    this.queryMetrics.push({
      model,
      duration,
      timestamp: Date.now(),
      query: query.getQuery()
    })

    // Keep only last 1000 queries
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics.shift()
    }
  }

  _analyzeExplain(explained) {
    const stats = explained.executionStats

    if (stats.totalDocsExamined > stats.nReturned * 10) {
      logger.warn('Query examining too many documents:', {
        examined: stats.totalDocsExamined,
        returned: stats.nReturned,
        executionTime: stats.executionTimeMillis
      })
    }
  }
}

module.exports = new PerformanceOptimizer()
