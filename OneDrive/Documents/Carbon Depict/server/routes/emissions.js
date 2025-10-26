const express = require('express')
const router = express.Router()
const GHGEmission = require('../models/mongodb/GHGEmission')
const { authenticate } = require('../middleware/auth')
const emissionFactorsService = require('../services/emissionFactorsService')

// Apply auth middleware
router.use(authenticate)

// DEFRA 2025 Emission Factors (kg CO2e per unit)
const getEmissionFactor = (fuelType, unit) => {
  const factors = {
    // Stationary Combustion
    'natural-gas': { 'kWh': 0.202 }, // Natural gas
    'gas-oil': { 'litres': 2.68 }, // Gas oil
    'diesel': { 'litres': 2.68 }, // Diesel
    'fuel-oil': { 'litres': 2.68 }, // Fuel oil
    'lpg': { 'litres': 1.51 }, // LPG
    'coal': { 'tonnes': 2410 }, // Coal
    'wood-pellets': { 'tonnes': 0 }, // Wood pellets (carbon neutral)
    'wood-chips': { 'tonnes': 0 }, // Wood chips (carbon neutral)
    'burning-oil': { 'litres': 2.68 }, // Burning oil
    'biofuel-blend': { '%': 0 }, // Biofuel blend percentage
    
    // Mobile Combustion
    'petrol-cars': { 'litres': 2.31 }, // Petrol cars
    'diesel-cars': { 'litres': 2.68 }, // Diesel cars
    'hybrid-cars': { 'litres': 1.5 }, // Hybrid cars (average)
    'lpg-cars': { 'litres': 1.51 }, // LPG cars
    'petrol-vans': { 'litres': 2.31 }, // Petrol vans
    'diesel-vans': { 'litres': 2.68 }, // Diesel vans
    'hgv-diesel': { 'litres': 2.68 }, // HGV diesel
    'motorcycles': { 'litres': 2.31 }, // Motorcycles
    
    // Process Emissions
    'cement-production': { 'tonnes': 842 }, // Cement production
    'lime-production': { 'tonnes': 1200 }, // Lime production
    'glass-production': { 'tonnes': 0.5 }, // Glass production
    'ammonia-production': { 'tonnes': 1.6 }, // Ammonia production
    'nitric-acid': { 'tonnes': 0.2 }, // Nitric acid
    
    // Fugitive Emissions
    'r404a': { 'kg': 3922 }, // R-404A refrigerant
    'r410a': { 'kg': 2088 }, // R-410A refrigerant
    'r134a': { 'kg': 1430 }, // R-134a refrigerant
    'r22': { 'kg': 1810 }, // R-22 refrigerant
    'r407c': { 'kg': 1774 }, // R-407C refrigerant
    'r507': { 'kg': 3985 }, // R-507 refrigerant
    
    // Scope 2 - Purchased Electricity
    'grid-electricity-kwh': { 'kWh': 0.212 }, // UK Grid electricity
    'renewable-tariff': { 'kWh': 0.0 }, // Renewable tariff
    'green-certificates': { 'kWh': 0.0 }, // Green certificates
    'location-based': { 'kWh': 0.212 }, // Location-based method
    'market-based': { 'kWh': 0.0 }, // Market-based method (depends on supplier)
    
    // Scope 2 - Purchased Heat/Steam
    'district-heating': { 'kWh': 0.202 }, // District heating
    'purchased-steam': { 'kWh': 0.202 }, // Purchased steam
    'biomass-heating': { 'kWh': 0.0 }, // Biomass district heating
    
    // Scope 2 - Purchased Cooling
    'district-cooling': { 'kWh': 0.212 }, // District cooling
    'chilled-water': { 'kWh': 0.212 }, // Chilled water
    
    // Scope 2 - Transmission & Distribution Losses
    'td-losses-electricity': { 'kWh': 0.212 }, // T&D losses electricity
    'td-losses-heat': { 'kWh': 0.202 }, // T&D losses heat
    
    // Scope 3 - Purchased Goods & Services
    'office-supplies': { 'kg': 0.5 }, // Office supplies
    'it-equipment': { 'kg': 2.0 }, // IT equipment
    'furniture': { 'kg': 1.5 }, // Furniture
    'cleaning-supplies': { 'kg': 0.3 }, // Cleaning supplies
    
    // Scope 3 - Business Travel
    'car-travel': { 'km': 0.2 }, // Car travel
    'train-travel': { 'km': 0.05 }, // Train travel
    'flight-domestic': { 'km': 0.3 }, // Domestic flight
    'flight-international': { 'km': 0.4 }, // International flight
    'hotel-stay': { 'night': 15 }, // Hotel stay
    
    // Scope 3 - Employee Commuting
    'employee-car': { 'km': 0.2 }, // Employee car
    'employee-train': { 'km': 0.05 }, // Employee train
    'employee-bus': { 'km': 0.1 }, // Employee bus
    'employee-cycle': { 'km': 0.0 }, // Employee cycle
    
    // Scope 3 - Waste Disposal
    'general-waste': { 'kg': 0.5 }, // General waste
    'recyclable-waste': { 'kg': 0.1 }, // Recyclable waste
    'hazardous-waste': { 'kg': 2.0 }, // Hazardous waste
    'food-waste': { 'kg': 0.3 }, // Food waste
    
    // Scope 3 - Transportation & Distribution
    'freight-truck': { 'km': 0.15 }, // Freight truck
    'freight-train': { 'km': 0.03 }, // Freight train
    'freight-ship': { 'km': 0.01 }, // Freight ship
    'freight-air': { 'km': 0.5 }, // Freight air
    
    // Scope 3 - Investments
    'equity-investments': { 'GBP': 0.0005 }, // Equity investments
    'bond-investments': { 'GBP': 0.0003 }, // Bond investments
    'property-investments': { 'GBP': 0.001 }, // Property investments
  }
  
  return factors[fuelType]?.[unit] || 0
}

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

    const companyId = req.user.companyId || req.user.company?._id
    const filter = { companyId: companyId }
    
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
 * @route   GET /api/emissions/by-category
 * @desc    Get emissions data grouped by category for form population
 * @access  Private
 */
router.get('/by-category', async (req, res) => {
  try {
    const { scope, reportingPeriod } = req.query
    const companyId = req.user.companyId || req.user.company?._id
    const filter = { companyId: companyId }
    
    if (scope) filter.scope = scope
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod

    const emissions = await GHGEmission.find(filter)
      .sort({ recordedAt: -1 })
      .lean()

    // Group emissions by category and field
    const groupedData = {}
    
    emissions.forEach(emission => {
      const category = emission.metadata?.category
      const fieldKey = emission.metadata?.fieldKey
      
      if (category && fieldKey) {
        if (!groupedData[category]) {
          groupedData[category] = {}
        }
        
        // Use the most recent value for each field
        if (!groupedData[category][fieldKey] || 
            new Date(emission.recordedAt) > new Date(groupedData[category][fieldKey].recordedAt)) {
          groupedData[category][fieldKey] = {
            name: emission.activityType,
            value: emission.activityValue.toString(),
            unit: emission.activityUnit,
            completed: true,
            recordedAt: emission.recordedAt,
            co2e: emission.co2e
          }
        }
      }
    })

    res.json({
      success: true,
      data: groupedData,
      count: emissions.length
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})
router.get('/by-source', async (req, res) => {
  try {
    const { reportingPeriod, scope } = req.query
    const companyId = req.user.companyId || req.user.company?._id
    const filter = { companyId: companyId }
    
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
    const companyId = req.user.companyId || req.user.company?._id
    const filter = { companyId: companyId }
    
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId
    
    // Check access - ensure user can only access their company's emissions
    const emissionCompanyId = emission.companyId?._id?.toString() || emission.companyId?.toString() || emission.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString()

    if (emissionCompanyId !== userCompanyId) {
      console.error('Get access denied:', {
        emissionCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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
      companyId: req.user.companyId || req.user.company?._id,
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
 * @route   POST /api/emissions/bulk-save
 * @desc    Save multiple emission records from form data
 * @access  Private
 */
router.post('/bulk-save', async (req, res) => {
  try {
    const { formData, scope, reportingPeriod } = req.body
    
    if (!formData || !scope) {
      return res.status(400).json({
        success: false,
        error: 'Form data and scope are required'
      })
    }

    const emissionsToSave = []
    const currentDate = new Date()
    
    // Process each category in the form data
    Object.entries(formData).forEach(([category, fields]) => {
      Object.entries(fields).forEach(([fieldKey, fieldData]) => {
        if (fieldData.value && fieldData.value.trim() !== '') {
          const activityValue = parseFloat(fieldData.value)
          
          if (!isNaN(activityValue) && activityValue > 0) {
            // Map category to source type and activity type
            const sourceMapping = {
              // Scope 1 Categories
              'stationaryCombustion': {
                sourceType: 'Stationary Combustion',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'mobileCombustion': {
                sourceType: 'Mobile Combustion',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'processEmissions': {
                sourceType: 'Process Emissions',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'fugitiveEmissions': {
                sourceType: 'Fugitive Emissions',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              // Scope 2 Categories
              'purchasedElectricity': {
                sourceType: 'Purchased Electricity',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'purchasedHeat': {
                sourceType: 'Purchased Heat/Steam',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'purchasedCooling': {
                sourceType: 'Purchased Cooling',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'transmissionLosses': {
                sourceType: 'Transmission & Distribution Losses',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              // Scope 3 Categories
              'purchasedGoodsServices': {
                sourceType: 'Purchased Goods & Services',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'businessTravel': {
                sourceType: 'Business Travel',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'employeeCommuting': {
                sourceType: 'Employee Commuting',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'wasteDisposal': {
                sourceType: 'Waste Disposal',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'transportationDistribution': {
                sourceType: 'Transportation & Distribution',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              },
              'investments': {
                sourceType: 'Investments',
                activityType: fieldData.name,
                emissionFactor: getEmissionFactor(fieldKey, fieldData.unit)
              }
            }

            const mapping = sourceMapping[category]
            if (mapping) {
              const co2e = activityValue * mapping.emissionFactor
              
              emissionsToSave.push({
                companyId: req.user.companyId || req.user.company?._id,
                scope: scope,
                sourceType: mapping.sourceType,
                activityType: mapping.activityType,
                activityValue: activityValue,
                activityUnit: fieldData.unit,
                emissionFactor: mapping.emissionFactor,
                co2e: co2e,
                reportingPeriod: reportingPeriod || new Date().getFullYear().toString(),
                recordedAt: currentDate,
                createdBy: req.user.id,
                metadata: {
                  category: category,
                  fieldKey: fieldKey,
                  completed: fieldData.completed || false
                }
              })
            }
          }
        }
      })
    })

    if (emissionsToSave.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid emission data to save'
      })
    }

    // Save all emissions
    const savedEmissions = await GHGEmission.insertMany(emissionsToSave)

    res.status(201).json({
      success: true,
      message: `Successfully saved ${savedEmissions.length} emission records`,
      count: savedEmissions.length,
      data: savedEmissions
    })
  } catch (error) {
    console.error('Bulk save error:', error)
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId
    
    // Check access - ensure user can only update their company's emissions
    const emissionCompanyId = emission.companyId?.toString() || emission.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString()

    if (emissionCompanyId !== userCompanyId) {
      console.error('Update access denied:', {
        emissionCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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
    console.error('Error updating emission:', error)
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

    // Get companyId from auth middleware
    const companyId = req.companyId || req.user?.companyId

    // Check access - ensure user can only delete their company's emissions
    const emissionCompanyId = emission.companyId?.toString() || emission.companyId
    const userCompanyId = companyId || req.user?.company?._id?.toString()

    if (emissionCompanyId !== userCompanyId) {
      console.error('Delete access denied:', {
        emissionCompanyId,
        userCompanyId,
        reqCompanyId: companyId
      })
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
    console.error('Error deleting emission:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/emissions/calculate
 * @desc    Calculate emissions using DEFRA factors and GHG Protocol
 * @access  Private
 */
router.post('/calculate', async (req, res) => {
  try {
    const { scope, formData, reportingPeriod } = req.body

    if (!scope || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: scope and formData'
      })
    }

    const calculations = []
    const errors = []
    let totalEmissions = 0

    // Process each category in the form data
    Object.keys(formData).forEach(category => {
      const categoryData = formData[category]
      
      Object.keys(categoryData).forEach(fieldKey => {
        const field = categoryData[fieldKey]
        
        if (field.value && field.value.trim() !== '') {
          // Calculate emissions for this field
          const calculation = emissionFactorsService.calculateEmissions(
            scope,
            category,
            fieldKey,
            field.value,
            field.unit
          )

          if (calculation.success) {
            calculations.push({
              ...calculation,
              fieldKey,
              fieldName: field.name,
              metadata: {
                category,
                fieldKey,
                reportingPeriod: reportingPeriod || new Date().getFullYear().toString()
              }
            })
            totalEmissions += calculation.emissions
          } else {
            errors.push({
              category,
              fieldKey,
              fieldName: field.name,
              error: calculation.error
            })
          }
        }
      })
    })

    // Round total emissions
    totalEmissions = Math.round(totalEmissions * 1000) / 1000

    res.json({
      success: true,
      data: {
        scope,
        totalEmissions,
        calculations,
        errors,
        summary: {
          totalFields: calculations.length,
          totalErrors: errors.length,
          reportingPeriod: reportingPeriod || new Date().getFullYear().toString(),
          calculatedAt: new Date().toISOString()
        }
      },
      message: `Calculated ${calculations.length} emission sources for ${scope}`
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   POST /api/emissions/calculate-and-save
 * @desc    Calculate emissions and save to database
 * @access  Private
 */
router.post('/calculate-and-save', async (req, res) => {
  try {
    const { scope, formData, reportingPeriod } = req.body

    if (!scope || !formData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: scope and formData'
      })
    }

    const calculations = []
    const errors = []
    let totalEmissions = 0
    const savedEmissions = []

    // Process each category in the form data
    Object.keys(formData).forEach(category => {
      const categoryData = formData[category]
      
      Object.keys(categoryData).forEach(fieldKey => {
        const field = categoryData[fieldKey]
        
        if (field.value && field.value.trim() !== '') {
          // Calculate emissions for this field
          const calculation = emissionFactorsService.calculateEmissions(
            scope,
            category,
            fieldKey,
            field.value,
            field.unit
          )

          if (calculation.success) {
            calculations.push({
              ...calculation,
              fieldKey,
              fieldName: field.name,
              metadata: {
                category,
                fieldKey,
                reportingPeriod: reportingPeriod || new Date().getFullYear().toString()
              }
            })
            totalEmissions += calculation.emissions

            // Save to database
            const emissionRecord = new GHGEmission({
              companyId: req.user.companyId || req.user.company?._id,
              userId: req.user.id,
              scope: scope,
              activityType: field.name,
              activityValue: parseFloat(field.value),
              activityUnit: field.unit,
              emissionFactor: calculation.factor,
              emissionFactorUnit: calculation.factorUnit,
              co2e: calculation.emissions,
              recordedAt: new Date(),
              reportingPeriod: reportingPeriod || new Date().getFullYear().toString(),
              metadata: {
                category,
                fieldKey,
                factorSource: calculation.source,
                calculatedAt: new Date().toISOString()
              }
            })

            savedEmissions.push(emissionRecord)
          } else {
            errors.push({
              category,
              fieldKey,
              fieldName: field.name,
              error: calculation.error
            })
          }
        }
      })
    })

    // Save all emissions to database
    if (savedEmissions.length > 0) {
      await GHGEmission.insertMany(savedEmissions)
    }

    // Round total emissions
    totalEmissions = Math.round(totalEmissions * 1000) / 1000

    res.json({
      success: true,
      data: {
        scope,
        totalEmissions,
        calculations,
        errors,
        savedCount: savedEmissions.length,
        summary: {
          totalFields: calculations.length,
          totalErrors: errors.length,
          savedRecords: savedEmissions.length,
          reportingPeriod: reportingPeriod || new Date().getFullYear().toString(),
          calculatedAt: new Date().toISOString()
        }
      },
      message: `Calculated and saved ${savedEmissions.length} emission records for ${scope}`
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/emissions/summary
 * @desc    Get emissions summary for dashboard
 * @access  Private
 */
router.get('/summary', async (req, res) => {
  try {
    console.log('📊 /api/emissions/summary called')
    const { reportingPeriod, startDate, endDate } = req.query
    const companyId = req.user.companyId || req.user.company?._id
    
    if (!companyId) {
      console.error('❌ No companyId found in req.user:', req.user)
      return res.status(400).json({ 
        success: false, 
        error: 'Company ID not found' 
      })
    }
    
    const filter = { companyId: companyId }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (startDate && endDate) {
      filter.recordedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }

    console.log('🔍 Querying emissions with filter:', JSON.stringify(filter))
    const emissions = await GHGEmission.find(filter).lean()
    console.log(`✅ Found ${emissions.length} emissions`)

    // Group by scope
    const scopeSummary = {
      scope1: { total: 0, count: 0, categories: {} },
      scope2: { total: 0, count: 0, categories: {} },
      scope3: { total: 0, count: 0, categories: {} }
    }

    emissions.forEach(emission => {
      const scope = emission.scope
      const co2e = emission.co2e || 0
      if (scopeSummary[scope]) {
        scopeSummary[scope].total += co2e
        scopeSummary[scope].count += 1
        
        const category = emission.metadata?.category || 'unknown'
        if (!scopeSummary[scope].categories[category]) {
          scopeSummary[scope].categories[category] = { total: 0, count: 0 }
        }
        scopeSummary[scope].categories[category].total += co2e
        scopeSummary[scope].categories[category].count += 1
      }
    })

    // Calculate totals
    const totalEmissions = Object.values(scopeSummary).reduce((sum, scope) => sum + scope.total, 0)
    const totalRecords = Object.values(scopeSummary).reduce((sum, scope) => sum + scope.count, 0)

    // Round values
    Object.keys(scopeSummary).forEach(scope => {
      scopeSummary[scope].total = Math.round(scopeSummary[scope].total * 1000) / 1000
      Object.keys(scopeSummary[scope].categories).forEach(category => {
        scopeSummary[scope].categories[category].total = Math.round(scopeSummary[scope].categories[category].total * 1000) / 1000
      })
    })

    const response = {
      success: true,
      data: {
        totalEmissions: Math.round(totalEmissions * 1000) / 1000,
        totalRecords,
        scopeSummary,
        reportingPeriod: reportingPeriod || new Date().getFullYear().toString(),
        generatedAt: new Date().toISOString()
      }
    }
    
    console.log('✅ Returning summary:', JSON.stringify(response).substring(0, 200))
    res.json(response)
  } catch (error) {
    console.error('❌ Error in /summary:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
