/**
 * Database Optimization Script - Phase 3 Week 9
 *
 * This script optimizes the database by:
 * 1. Creating/updating indexes
 * 2. Analyzing query performance
 * 3. Providing optimization recommendations
 * 4. Cleaning up unused indexes
 */

const mongoose = require('mongoose')
require('dotenv').config()
const logger = require('../utils/logger')

// Import models to ensure indexes are registered
const GHGEmission = require('../models/mongodb/GHGEmission')
const ESGMetric = require('../models/mongodb/ESGMetric')
const User = require('../models/mongodb/User')
const Company = require('../models/mongodb/Company')

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-depict', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    logger.info('Connected to MongoDB for optimization')
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message })
    throw error
  }
}

/**
 * Get collection statistics
 */
async function getCollectionStats(collectionName) {
  try {
    const stats = await mongoose.connection.db.command({ collStats: collectionName })
    return {
      name: collectionName,
      count: stats.count,
      size: Math.round(stats.size / 1024 / 1024 * 100) / 100, // MB
      avgObjSize: Math.round(stats.avgObjSize),
      storageSize: Math.round(stats.storageSize / 1024 / 1024 * 100) / 100, // MB
      indexes: stats.nindexes,
      totalIndexSize: Math.round(stats.totalIndexSize / 1024 / 1024 * 100) / 100, // MB
    }
  } catch (error) {
    logger.warn(`Failed to get stats for ${collectionName}`, { error: error.message })
    return null
  }
}

/**
 * Analyze index usage
 */
async function analyzeIndexUsage(collectionName) {
  try {
    const indexStats = await mongoose.connection.db
      .collection(collectionName)
      .aggregate([{ $indexStats: {} }])
      .toArray()

    const analysis = indexStats.map(index => ({
      name: index.name,
      operations: index.accesses.ops,
      since: index.accesses.since
    }))

    return analysis
  } catch (error) {
    logger.warn(`Failed to analyze indexes for ${collectionName}`, { error: error.message })
    return []
  }
}

/**
 * Sync all indexes (create missing, remove orphaned)
 */
async function syncIndexes() {
  logger.info('Syncing indexes for all models...')

  const models = [
    { name: 'GHGEmission', model: GHGEmission },
    { name: 'ESGMetric', model: ESGMetric },
    { name: 'User', model: User },
    { name: 'Company', model: Company },
  ]

  const results = []

  for (const { name, model } of models) {
    try {
      logger.info(`Syncing indexes for ${name}...`)
      await model.syncIndexes()

      const indexes = await model.collection.getIndexes()
      results.push({
        model: name,
        indexCount: Object.keys(indexes).length,
        indexes: Object.keys(indexes)
      })

      logger.info(`${name} indexes synced successfully`, {
        count: Object.keys(indexes).length
      })
    } catch (error) {
      logger.error(`Failed to sync indexes for ${name}`, {
        error: error.message,
        stack: error.stack
      })
      results.push({
        model: name,
        error: error.message
      })
    }
  }

  return results
}

/**
 * Get slow query recommendations
 */
async function getSlowQueryRecommendations() {
  const recommendations = []

  // Check if profiler is enabled
  try {
    const profile = await mongoose.connection.db.command({ profile: -1 })

    if (profile.was === 0) {
      recommendations.push({
        type: 'profiler',
        message: 'Database profiler is disabled. Enable it to track slow queries.',
        command: 'db.setProfilingLevel(1, { slowms: 100 })'
      })
    } else {
      // Get slow queries from system.profile
      const slowQueries = await mongoose.connection.db
        .collection('system.profile')
        .find({ millis: { $gt: 100 } })
        .sort({ millis: -1 })
        .limit(10)
        .toArray()

      if (slowQueries.length > 0) {
        recommendations.push({
          type: 'slow_queries',
          count: slowQueries.length,
          queries: slowQueries.map(q => ({
            ns: q.ns,
            op: q.op,
            millis: q.millis,
            command: q.command
          }))
        })
      }
    }
  } catch (error) {
    logger.warn('Failed to check profiler status', { error: error.message })
  }

  return recommendations
}

/**
 * Generate optimization report
 */
async function generateOptimizationReport() {
  logger.info('Generating database optimization report...')

  const report = {
    timestamp: new Date().toISOString(),
    database: mongoose.connection.name,
    collections: [],
    indexAnalysis: [],
    recommendations: [],
    summary: {}
  }

  // Get stats for all collections
  const collectionNames = ['ghgemissions', 'esgmetrics', 'users', 'companies', 'reports']

  for (const name of collectionNames) {
    const stats = await getCollectionStats(name)
    if (stats) {
      report.collections.push(stats)
    }
  }

  // Analyze index usage
  for (const name of collectionNames) {
    const usage = await analyzeIndexUsage(name)
    if (usage.length > 0) {
      report.indexAnalysis.push({
        collection: name,
        indexes: usage
      })
    }
  }

  // Get recommendations
  report.recommendations = await getSlowQueryRecommendations()

  // Calculate summary
  report.summary = {
    totalCollections: report.collections.length,
    totalDocuments: report.collections.reduce((sum, c) => sum + c.count, 0),
    totalDataSize: report.collections.reduce((sum, c) => sum + c.size, 0).toFixed(2) + ' MB',
    totalIndexSize: report.collections.reduce((sum, c) => sum + c.totalIndexSize, 0).toFixed(2) + ' MB',
    totalIndexes: report.collections.reduce((sum, c) => sum + c.indexes, 0),
    indexToDataRatio: (
      report.collections.reduce((sum, c) => sum + c.totalIndexSize, 0) /
      report.collections.reduce((sum, c) => sum + c.size, 0) * 100
    ).toFixed(2) + '%'
  }

  return report
}

/**
 * Main optimization function
 */
async function optimizeDatabase() {
  try {
    logger.info('Starting database optimization...')

    // Connect to database
    await connectDatabase()

    // Generate pre-optimization report
    logger.info('Generating pre-optimization report...')
    const preReport = await generateOptimizationReport()

    logger.info('Pre-optimization summary:', preReport.summary)

    // Sync indexes
    logger.info('Syncing indexes...')
    const indexResults = await syncIndexes()

    logger.info('Index sync results:', {
      total: indexResults.length,
      successful: indexResults.filter(r => !r.error).length,
      failed: indexResults.filter(r => r.error).length
    })

    // Generate post-optimization report
    logger.info('Generating post-optimization report...')
    const postReport = await generateOptimizationReport()

    logger.info('Post-optimization summary:', postReport.summary)

    // Print recommendations
    if (postReport.recommendations.length > 0) {
      logger.info('Optimization recommendations:')
      postReport.recommendations.forEach(rec => {
        logger.info(`- ${rec.type}: ${rec.message || JSON.stringify(rec)}`)
      })
    }

    // Print unused indexes
    logger.info('Checking for unused indexes...')
    postReport.indexAnalysis.forEach(analysis => {
      const unusedIndexes = analysis.indexes.filter(idx => idx.operations === 0)
      if (unusedIndexes.length > 0) {
        logger.warn(`Unused indexes in ${analysis.collection}:`, {
          indexes: unusedIndexes.map(idx => idx.name)
        })
      }
    })

    logger.info('Database optimization completed successfully!')

    return {
      success: true,
      preReport,
      postReport,
      indexResults
    }
  } catch (error) {
    logger.error('Database optimization failed', {
      error: error.message,
      stack: error.stack
    })
    return {
      success: false,
      error: error.message
    }
  } finally {
    await mongoose.disconnect()
    logger.info('Disconnected from MongoDB')
  }
}

// Run if called directly
if (require.main === module) {
  optimizeDatabase()
    .then(result => {
      if (result.success) {
        console.log('\n✅ Database optimization completed successfully!')
        console.log('\nSummary:')
        console.log(`- Total documents: ${result.postReport.summary.totalDocuments}`)
        console.log(`- Total data size: ${result.postReport.summary.totalDataSize}`)
        console.log(`- Total indexes: ${result.postReport.summary.totalIndexes}`)
        console.log(`- Index/Data ratio: ${result.postReport.summary.indexToDataRatio}`)
        process.exit(0)
      } else {
        console.error('\n❌ Database optimization failed:', result.error)
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error.message)
      process.exit(1)
    })
}

module.exports = {
  optimizeDatabase,
  generateOptimizationReport,
  syncIndexes,
  analyzeIndexUsage
}
