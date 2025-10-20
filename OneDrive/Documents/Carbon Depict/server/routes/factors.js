const express = require('express')
const router = express.Router()

/**
 * @route   GET /api/factors
 * @desc    Get all emission factors or filter by category
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category, subcategory } = req.query

    // TODO: Replace with actual database query
    const mockFactors = [
      {
        id: '1',
        category: 'fuels',
        subcategory: 'diesel',
        factor: 2.546,
        unit: 'kgCO2e/litre',
        scope: 'Scope 1',
        source: 'DEFRA 2025',
        gwp: 'AR5',
      },
      {
        id: '2',
        category: 'electricity',
        subcategory: 'uk-grid',
        factor: 0.20898,
        unit: 'kgCO2e/kWh',
        scope: 'Scope 2',
        source: 'DEFRA 2025',
        gwp: 'AR5',
      },
    ]

    res.json({ success: true, data: mockFactors })
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
    // TODO: Fetch from database
    res.json({ success: true, data: { id, factor: 2.546 } })
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
    const { category, subcategory, factor, unit, scope, source } = req.body
    // TODO: Save to database with versioning
    res.json({ success: true, message: 'Factor added successfully' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
