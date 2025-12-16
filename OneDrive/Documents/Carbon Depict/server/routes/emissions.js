const express = require('express')
const router = express.Router()
const GHGEmission = require('../models/mongodb/GHGEmission')
const { authenticate } = require('../middleware/auth')
const {
  buildFilter,
  buildSort,
  buildPagination,
  buildPaginationMeta,
  executePaginatedQuery
} = require('../utils/queryBuilder')
const cache = require('../utils/cacheManager')

// Apply auth middleware
router.use(authenticate)

/**
 * @route   GET /api/emissions
 * @desc    Get all emissions for a company with advanced filtering, sorting, and pagination
 * @access  Private
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - sort: Sort field(s) (e.g., 'recordedAt:desc' or '-recordedAt')
 * - scope: Filter by scope (exact match)
 * - reportingPeriod: Filter by reporting period
 * - facilityId, locationId: Filter by facility or location
 * - startDate, endDate: Date range filters
 * - co2e[gt], co2e[gte], co2e[lt], co2e[lte]: Emissions value filters
 * - sourceType[contains]: Text search in sourceType
 * - activityType[in]: Multiple activity types (comma-separated)
 */
router.get('/', async (req, res) => {
  try {
    const { page, limit, sort: sortParam, startDate, endDate } = req.query

    // Define allowed filter fields
    const allowedFilters = [
      'scope',
      'reportingPeriod',
      'facilityId',
      'locationId',
      'sourceType',
      'activityType',
      'co2e',
      'activityValue'
    ]

    // Build base filter (company-specific)
    const baseFilter = { companyId: req.companyId }

    // Build advanced filter from query params
    let filter = buildFilter(req.query, allowedFilters, baseFilter)

    // Handle date range specially (for better readability)
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    // Build sort object
    const sort = buildSort(sortParam, '-recordedAt')

    // Build pagination
    const pagination = buildPagination(page, limit, 100)

    // Generate cache key
    const cacheKey = cache.isAvailable()
      ? `emissions:${req.companyId}:${JSON.stringify(req.query)}`
      : null

    // Try to get from cache
    let result
    if (cacheKey) {
      result = await cache.get(cacheKey)
      if (result) {
        return res.json({
          ...result,
          fromCache: true
        })
      }
    }

    // Cache miss - execute query
    const [emissions, total] = await Promise.all([
      GHGEmission.find(filter)
        .populate('facilityId', 'name')
        .populate('locationId', 'name')
        .sort(sort)
        .limit(pagination.limit)
        .skip(pagination.skip)
        .lean(),
      GHGEmission.countDocuments(filter)
    ])

    // Build response
    const paginationMeta = buildPaginationMeta(total, pagination.page, pagination.limit)

    result = {
      success: true,
      data: emissions,
      pagination: paginationMeta,
      fromCache: false
    }

    // Cache the result (5 minutes TTL)
    if (cacheKey) {
      cache.set(cacheKey, result, 300).catch(err => {
        console.error('Cache set error:', err.message)
      })
    }

    res.json(result)
  } catch (error) {
    console.error('GET /api/emissions error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/summary
 * @desc    Get emissions summary by scope with caching
 * @access  Private
 */
router.get('/summary', async (req, res) => {
  try {
    const { reportingPeriod } = req.query
    const filter = { companyId: req.companyId }

    if (reportingPeriod) filter.reportingPeriod = reportingPeriod

    // Generate cache key
    const cacheKey = cache.isAvailable()
      ? `emissions:summary:${req.companyId}:${reportingPeriod || 'all'}`
      : null

    // Try to get from cache
    if (cacheKey) {
      const cached = await cache.get(cacheKey)
      if (cached) {
        return res.json({
          ...cached,
          fromCache: true
        })
      }
    }

    // Optimized aggregation pipeline
    const summary = await GHGEmission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$scope',
          totalEmissions: { $sum: '$co2e' },
          count: { $sum: 1 },
          avgEmissionFactor: { $avg: '$emissionFactor' },
          minEmissions: { $min: '$co2e' },
          maxEmissions: { $max: '$co2e' },
          avgEmissions: { $avg: '$co2e' }
        }
      },
      {
        $project: {
          _id: 1,
          totalEmissions: { $round: ['$totalEmissions', 3] },
          count: 1,
          avgEmissionFactor: { $round: ['$avgEmissionFactor', 3] },
          minEmissions: { $round: ['$minEmissions', 3] },
          maxEmissions: { $round: ['$maxEmissions', 3] },
          avgEmissions: { $round: ['$avgEmissions', 3] }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Calculate totals
    const totals = summary.reduce((acc, item) => {
      acc[item._id] = {
        emissions: item.totalEmissions,
        count: item.count,
        avgFactor: item.avgEmissionFactor,
        min: item.minEmissions,
        max: item.maxEmissions,
        avg: item.avgEmissions
      }
      acc.total = (acc.total || 0) + item.totalEmissions
      return acc
    }, {})

    totals.total = parseFloat((totals.total || 0).toFixed(3))

    const result = {
      success: true,
      data: totals,
      fromCache: false
    }

    // Cache the result (10 minutes TTL for summaries)
    if (cacheKey) {
      cache.set(cacheKey, result, 600).catch(err => {
        console.error('Cache set error:', err.message)
      })
    }

    res.json(result)
  } catch (error) {
    console.error('GET /api/emissions/summary error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/by-source
 * @desc    Get emissions grouped by source type
 * @access  Private
 */
router.get('/by-source', async (req, res) => {
  try {
    const { reportingPeriod, scope } = req.query
    const filter = { companyId: req.companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (scope) filter.scope = scope

    const bySource = await GHGEmission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            sourceType: '$sourceType',
            activityType: '$activityType',
            scope: '$scope'
          },
          totalEmissions: { $sum: '$co2e' },
          totalActivity: { $sum: '$activityValue' },
          count: { $sum: 1 }
        }
      },
      { 
        $project: {
          _id: 0,
          sourceType: '$_id.sourceType',
          activityType: '$_id.activityType',
          scope: '$_id.scope',
          totalEmissions: { $round: ['$totalEmissions', 3] },
          totalActivity: { $round: ['$totalActivity', 2] },
          count: 1
        }
      },
      { $sort: { totalEmissions: -1 } }
    ])

    res.json({
      success: true,
      count: bySource.length,
      data: bySource,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/trends
 * @desc    Get emissions trends over time
 * @access  Private
 */
router.get('/trends', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query
    const filter = { companyId: req.companyId }
    
    if (startDate) filter.recordedAt = { $gte: new Date(startDate) }
    if (endDate) filter.recordedAt = { ...filter.recordedAt, $lte: new Date(endDate) }

    // Group by period
    const dateGrouping = groupBy === 'month' 
      ? { year: { $year: '$recordedAt' }, month: { $month: '$recordedAt' } }
      : { year: { $year: '$recordedAt' }, week: { $week: '$recordedAt' } }

    const trends = await GHGEmission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: dateGrouping,
          totalEmissions: { $sum: '$co2e' },
          scope1: { 
            $sum: { $cond: [{ $eq: ['$scope', 'scope1'] }, '$co2e', 0] }
          },
          scope2: { 
            $sum: { $cond: [{ $eq: ['$scope', 'scope2'] }, '$co2e', 0] }
          },
          scope3: { 
            $sum: { $cond: [{ $eq: ['$scope', 'scope3'] }, '$co2e', 0] }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    res.json({
      success: true,
      data: trends,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/:id
 * @desc    Get a single emission record
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const emission = await GHGEmission.findById(req.params.id)
      .populate('companyId', 'name')
      .populate('facilityId', 'name address')
      .populate('locationId', 'name country')
      .lean()

    if (!emission) {
      return res.status(404).json({
        success: false,
        error: 'Emission record not found'
      })
    }

    // Check access
    if (emission.companyId._id.toString() !== req.companyId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    res.json({
      success: true,
      data: emission,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/emissions
 * @desc    Create a new emission record
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const emission = new GHGEmission({
      ...req.body,
      companyId: req.companyId,
      createdBy: req.user._id,
    })

    await emission.save()

    // Invalidate cache for this company's emissions
    cache.invalidate('emissions', req.companyId).catch(err => {
      console.error('Cache invalidation error:', err.message)
    })

    res.status(201).json({
      success: true,
      data: emission,
    })
  } catch (error) {
    console.error('POST /api/emissions error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   PUT /api/emissions/:id
 * @desc    Update an emission record
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const emission = await GHGEmission.findById(req.params.id)

    if (!emission) {
      return res.status(404).json({
        success: false,
        error: 'Emission record not found'
      })
    }

    // Check access
    if (emission.companyId.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    Object.assign(emission, req.body)
    await emission.save()

    // Invalidate cache for this company's emissions
    cache.invalidate('emissions', req.user.company).catch(err => {
      console.error('Cache invalidation error:', err.message)
    })

    res.json({
      success: true,
      data: emission,
    })
  } catch (error) {
    console.error('PUT /api/emissions/:id error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   DELETE /api/emissions/:id
 * @desc    Delete an emission record
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const emission = await GHGEmission.findById(req.params.id)

    if (!emission) {
      return res.status(404).json({
        success: false,
        error: 'Emission record not found'
      })
    }

    // Check access
    if (emission.companyId.toString() !== req.user.company.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }

    await GHGEmission.deleteOne({ _id: req.params.id })

    // Invalidate cache for this company's emissions
    cache.invalidate('emissions', req.user.company).catch(err => {
      console.error('Cache invalidation error:', err.message)
    })

    res.json({
      success: true,
      message: 'Emission record deleted',
    })
  } catch (error) {
    console.error('DELETE /api/emissions/:id error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
