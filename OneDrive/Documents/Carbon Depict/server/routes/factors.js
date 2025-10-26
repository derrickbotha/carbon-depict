const express = require('express')
const router = express.Router()
const { EmissionFactor } = require('../models/mongodb')
const { authenticate } = require('../middleware/auth')

// Apply auth middleware
router.use(authenticate)

/**
 * @route   GET /api/factors
 * @desc    Get all emission factors or filter by category
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, region, year } = req.query

    const filters = {}
    if (category) filters.category = category
    if (subcategory) filters.subcategory = subcategory
    if (region) filters.region = region
    if (year) filters.year = parseInt(year)

    const factors = await EmissionFactor.find(filters)
      .sort({ year: -1, category: 1, subcategory: 1 })
      .lean()

    res.json({
      success: true,
      count: factors.length,
      data: factors,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/factors/:id
 * @desc    Get specific emission factor
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const factor = await EmissionFactor.findById(id).lean()
    
    if (!factor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Emission factor not found' 
      })
    }
    
    res.json({ success: true, data: factor })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/factors
 * @desc    Add or update emission factor (Admin only)
 * @access  Private/Admin
 */
router.post('/', async (req, res) => {
  try {
    const { category, subcategory, factor, unit, scope, source, region, year, gwp } = req.body

    // Validate required fields
    if (!category || !subcategory || !factor || !unit) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: category, subcategory, factor, unit'
      })
    }

    const emissionFactor = new EmissionFactor({
      category,
      subcategory,
      factor: parseFloat(factor),
      unit,
      scope: scope || 'scope1',
      source: source || 'DEFRA 2025',
      region: region || 'uk',
      year: year || new Date().getFullYear(),
      gwp: gwp || 'AR5',
      createdBy: req.user.id
    })

    await emissionFactor.save()

    res.status(201).json({
      success: true,
      data: emissionFactor,
      message: 'Emission factor added successfully'
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
