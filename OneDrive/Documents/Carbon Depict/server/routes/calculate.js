const express = require('express')
const router = express.Router()

/**
 * @route   POST /api/calculate/fuels
 * @desc    Calculate emissions from fuel combustion
 * @access  Private
 */
router.post('/fuels', async (req, res) => {
  try {
    const { fuelType, quantity, biofuelBlend = 0 } = req.body

    // Emission factors (DEFRA 2025)
    const fuelFactors = {
      diesel: 2.546, // kgCO2e/litre
      petrol: 2.315, // kgCO2e/litre
      'natural-gas': 0.185, // kgCO2e/kWh
      coal: 0.323, // kgCO2e/kWh
    }

    const factor = fuelFactors[fuelType]
    if (!factor) {
      return res.status(400).json({ success: false, error: 'Invalid fuel type' })
    }

    // Calculate emissions
    const emissions = quantity * factor * (1 - biofuelBlend / 100)

    res.json({
      success: true,
      data: {
        emissions: parseFloat(emissions.toFixed(2)),
        unit: 'kgCO2e',
        scope: 'Scope 1',
        factor,
        quantity,
        biofuelBlend,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/electricity
 * @desc    Calculate emissions from electricity consumption
 * @access  Private
 */
router.post('/electricity', async (req, res) => {
  try {
    const { consumption, region = 'uk' } = req.body

    // Emission factors by region (kgCO2e/kWh)
    const electricityFactors = {
      uk: 0.20898,
      asia: 0.55, // Placeholder - should be country-specific
      africa: 0.45, // Placeholder
      eu: 0.35,
      us: 0.42,
    }

    const factor = electricityFactors[region]
    const emissions = consumption * factor

    res.json({
      success: true,
      data: {
        emissions: parseFloat(emissions.toFixed(2)),
        unit: 'kgCO2e',
        scope: 'Scope 2',
        factor,
        consumption,
        region,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/calculate/transport
 * @desc    Calculate emissions from passenger transport
 * @access  Private
 */
router.post('/transport', async (req, res) => {
  try {
    const { vehicleType, distance, passengers = 1 } = req.body

    // Vehicle emission factors (kgCO2e/km)
    const vehicleFactors = {
      'car-small': 0.118,
      'car-medium': 0.145,
      'van-class-1': 0.12,
      'van-class-2': 0.15,
    }

    const factor = vehicleFactors[vehicleType]
    if (!factor) {
      return res.status(400).json({ success: false, error: 'Invalid vehicle type' })
    }

    const emissions = distance * factor

    res.json({
      success: true,
      data: {
        emissions: parseFloat(emissions.toFixed(2)),
        unit: 'kgCO2e',
        scope: 'Scope 3',
        factor,
        distance,
        vehicleType,
      },
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
    const { entries } = req.body

    // Process multiple entries
    const results = [] // TODO: Process each entry

    res.json({
      success: true,
      data: {
        totalEmissions: 0,
        entries: results,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
