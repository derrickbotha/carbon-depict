const express = require('express')
const router = express.Router()
const GHGEmission = require('../models/mongodb/GHGEmission')
const { authenticate } = require('../middleware/auth')

// Apply auth middleware
router.use(authenticate)

/**
 * @route   GET /api/emissions
 * @desc    Get all emissions for a company
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const { 
      scope, 
      reportingPeriod, 
      facilityId, 
      locationId,
      startDate,
      endDate,
      limit = 100,
      page = 1
    } = req.query

    const filter = { companyId: req.user.company }
    
    if (scope) filter.scope = scope
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (facilityId) filter.facilityId = facilityId
    if (locationId) filter.locationId = locationId
    
    // Date range filter
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [emissions, total] = await Promise.all([
      GHGEmission.find(filter)
        .populate('facilityId', 'name')
        .populate('locationId', 'name')
        .sort({ recordedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      GHGEmission.countDocuments(filter)
    ])

    res.json({
      success: true,
      count: emissions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: emissions,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/summary
 * @desc    Get emissions summary by scope
 * @access  Private
 */
router.get('/summary', async (req, res) => {
  try {
    const { reportingPeriod } = req.query
    const filter = { companyId: req.user.company }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod

    const summary = await GHGEmission.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$scope',
          totalEmissions: { $sum: '$co2e' },
          count: { $sum: 1 },
          avgEmissionFactor: { $avg: '$emissionFactor' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    // Calculate totals
    const totals = summary.reduce((acc, item) => {
      acc[item._id] = {
        emissions: parseFloat(item.totalEmissions.toFixed(3)),
        count: item.count,
        avgFactor: parseFloat(item.avgEmissionFactor.toFixed(3))
      }
      acc.total = (acc.total || 0) + item.totalEmissions
      return acc
    }, {})

    totals.total = parseFloat((totals.total || 0).toFixed(3))

    res.json({
      success: true,
      data: totals,
    })
  } catch (error) {
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
    const filter = { companyId: req.user.company }
    
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
    const filter = { companyId: req.user.company }
    
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
    if (emission.companyId._id.toString() !== req.user.company.toString()) {
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
      companyId: req.user.company,
    })

    await emission.save()

    res.status(201).json({
      success: true,
      data: emission,
    })
  } catch (error) {
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

    res.json({
      success: true,
      data: emission,
    })
  } catch (error) {
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

    res.json({
      success: true,
      message: 'Emission record deleted',
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
