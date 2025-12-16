const express = require('express')
const router = express.Router()
const EmissionsCalculator = require('../services/emissionsCalculator')
const { authenticate } = require('../middleware/auth')

// Apply auth middleware to all routes
router.use(authenticate)

/**
 * @route   POST /api/calculate/fuels
 * @desc    Calculate emissions from fuel combustion (Scope 1)
 * @access  Private
 */
router.post('/fuels', async (req, res) => {
  try {
    const { fuelType, quantity, biofuelBlend = 0, save = false } = req.body

    if (!fuelType || !quantity) {
      return res.status(400).json({ 
        success: false, 
        error: 'fuelType and quantity are required' 
      })
    }

    const result = EmissionsCalculator.calculateStationaryCombustion({
      fuelType,
      quantity,
      biofuelBlend
    })
    
    // Optionally save to database
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/electricity
 * @desc    Calculate emissions from electricity consumption (Scope 2)
 * @access  Private
 */
router.post('/electricity', async (req, res) => {
  try {
    const { consumption, region = 'uk', isRenewable = false, save = false } = req.body

    if (!consumption) {
      return res.status(400).json({ 
        success: false, 
        error: 'consumption is required' 
      })
    }

    const result = EmissionsCalculator.calculateElectricity({
      consumption,
      region,
      isRenewable
    })
    
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/transport
 * @desc    Calculate emissions from road transport (Scope 3)
 * @access  Private
 */
router.post('/transport', async (req, res) => {
  try {
    const { vehicleType, distance, save = false } = req.body

    if (!vehicleType || !distance) {
      return res.status(400).json({ 
        success: false, 
        error: 'vehicleType and distance are required' 
      })
    }

    const result = EmissionsCalculator.calculateRoadTransport({
      vehicleType,
      distance
    })
    
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/air-travel
 * @desc    Calculate emissions from air travel (Scope 3)
 * @access  Private
 */
router.post('/air-travel', async (req, res) => {
  try {
    const { flightClass, distance, save = false } = req.body

    if (!flightClass || !distance) {
      return res.status(400).json({ 
        success: false, 
        error: 'flightClass and distance are required' 
      })
    }

    const result = EmissionsCalculator.calculateAirTravel({
      flightClass,
      distance
    })
    
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/waste
 * @desc    Calculate emissions from waste disposal (Scope 3)
 * @access  Private
 */
router.post('/waste', async (req, res) => {
  try {
    const { wasteType, weight, save = false } = req.body

    if (!wasteType || !weight) {
      return res.status(400).json({ 
        success: false, 
        error: 'wasteType and weight are required' 
      })
    }

    const result = EmissionsCalculator.calculateWaste({
      wasteType,
      weight
    })
    
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/water
 * @desc    Calculate emissions from water consumption (Scope 3)
 * @access  Private
 */
router.post('/water', async (req, res) => {
  try {
    const { volume, includeWastewater = true, save = false } = req.body

    if (!volume) {
      return res.status(400).json({ 
        success: false, 
        error: 'volume is required' 
      })
    }

    const result = EmissionsCalculator.calculateWater({
      volume,
      includeWastewater
    })
    
    if (save && req.user) {
      const saved = await EmissionsCalculator.saveEmission(
        req.companyId,
        result,
        { reportingPeriod: req.body.reportingPeriod }
      )
      result.id = saved._id
    }

    res.json({
      success: true,
      data: result,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/batch
 * @desc    Calculate emissions for multiple entries
 * @access  Private
 */
router.post('/batch', async (req, res) => {
  try {
    const { entries, save = false } = req.body

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'entries array is required' 
      })
    }

    const results = []
    let totalEmissions = 0
    const errors = []

    for (const entry of entries) {
      try {
        let result = null
        
        // Determine calculation type and execute
        if (entry.type === 'fuel') {
          result = EmissionsCalculator.calculateStationaryCombustion(entry)
        } else if (entry.type === 'electricity') {
          result = EmissionsCalculator.calculateElectricity(entry)
        } else if (entry.type === 'transport') {
          result = EmissionsCalculator.calculateRoadTransport(entry)
        } else if (entry.type === 'air-travel') {
          result = EmissionsCalculator.calculateAirTravel(entry)
        } else if (entry.type === 'waste') {
          result = EmissionsCalculator.calculateWaste(entry)
        } else if (entry.type === 'water') {
          result = EmissionsCalculator.calculateWater(entry)
        } else {
          throw new Error(`Unknown entry type: ${entry.type}`)
        }
        
        // Save if requested
        if (save && req.user) {
          const saved = await EmissionsCalculator.saveEmission(
            req.companyId,
            result,
            { 
              reportingPeriod: entry.reportingPeriod || req.body.reportingPeriod,
              facilityId: entry.facilityId,
              locationId: entry.locationId
            }
          )
          result.id = saved._id
        }
        
        results.push(result)
        totalEmissions += result.co2e
      } catch (error) {
        errors.push({
          entry,
          error: error.message
        })
      }
    }

    res.json({
      success: true,
      data: {
        totalEmissions: parseFloat(totalEmissions.toFixed(3)),
        unit: 'kgCO2e',
        processed: results.length,
        failed: errors.length,
        entries: results,
        errors: errors.length > 0 ? errors : undefined
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/calculate/emission-factors
 * @desc    Get available emission factors
 * @access  Private
 */
router.get('/emission-factors', async (req, res) => {
  try {
    const { category } = req.query
    
    // Return available factor types
    const factors = {
      fuels: ['diesel', 'petrol', 'natural-gas', 'lpg', 'coal', 'heating-oil'],
      electricity: ['uk', 'uk-renewable', 'eu', 'us', 'china', 'india', 'global'],
      transport: ['car-small-petrol', 'car-medium-petrol', 'car-large-petrol', 'car-small-diesel', 
                 'car-medium-diesel', 'car-large-diesel', 'car-electric', 'van-class-1', 'van-class-2', 
                 'van-class-3', 'bus', 'rail-national', 'rail-international', 'taxi'],
      airTravel: ['domestic-economy', 'domestic-business', 'short-haul-economy', 'short-haul-business',
                  'long-haul-economy', 'long-haul-premium', 'long-haul-business', 'long-haul-first'],
      waste: ['landfill', 'incineration', 'recycling', 'composting'],
      water: ['supply', 'treatment'],
      refrigerants: ['r-134a', 'r-404a', 'r-410a', 'r-32'],
    }
    
    res.json({
      success: true,
      data: category ? { [category]: factors[category] } : factors
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
