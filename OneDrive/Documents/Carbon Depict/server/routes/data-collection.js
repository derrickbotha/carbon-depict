/**
 * Framework-Specific Data Collection Routes
 * Handles data collection for all ESG frameworks and data entry forms
 */

const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth')
const { ESGMetric, ESGTarget, MaterialityAssessment, ActivityLog } = require('../models/mongodb')
const { AppError } = require('../utils/errorHandler')

// Apply authentication to all routes
router.use(authenticate)

// Environmental Data Collection Routes
router.get('/environmental/ghg-inventory', async (req, res, next) => {
  try {
    const { reportingPeriod, scope, facilityId } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'ghg_inventory' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (scope) filter.scope = scope
    if (facilityId) filter.facilityId = facilityId

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/ghg-inventory', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'emissions',
      sourceType: 'ghg_inventory'
    })

    await metric.save()

    // Log activity
    await ActivityLog.create({
      action: 'ghg_inventory_data_created',
      userId: req.user.id.toString(),
      companyId: req.user.companyId.toString(),
      resourceType: 'esg_metric',
      resourceId: metric._id.toString(),
      metadata: { scope: req.body.scope, reportingPeriod: req.body.reportingPeriod }
    })

    res.status(201).json({
      success: true,
      data: metric,
      message: 'GHG inventory data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/ghg-inventory/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('GHG inventory data not found', 404)
    }

    // Log activity
    await ActivityLog.create({
      action: 'ghg_inventory_data_updated',
      userId: req.user.id.toString(),
      companyId: req.user.companyId.toString(),
      resourceType: 'esg_metric',
      resourceId: metric._id.toString(),
      metadata: { scope: req.body.scope, reportingPeriod: req.body.reportingPeriod }
    })

    res.json({
      success: true,
      data: metric,
      message: 'GHG inventory data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/environmental/energy-management', async (req, res, next) => {
  try {
    const { reportingPeriod, energyType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'energy_management' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (energyType) filter['metadata.energyType'] = energyType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/energy-management', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'energy',
      sourceType: 'energy_management'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Energy management data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/energy-management/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Energy management data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Energy management data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/environmental/water-management', async (req, res, next) => {
  try {
    const { reportingPeriod, waterType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'water_management' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (waterType) filter['metadata.waterType'] = waterType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/water-management', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'water',
      sourceType: 'water_management'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Water management data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/water-management/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Water management data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Water management data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/environmental/waste-management', async (req, res, next) => {
  try {
    const { reportingPeriod, wasteType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'waste_management' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (wasteType) filter['metadata.wasteType'] = wasteType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/waste-management', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'waste',
      sourceType: 'waste_management'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Waste management data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/waste-management/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Waste management data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Waste management data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/environmental/biodiversity-land-use', async (req, res, next) => {
  try {
    const { reportingPeriod, landUseType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'biodiversity_land_use' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (landUseType) filter['metadata.landUseType'] = landUseType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/biodiversity-land-use', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'biodiversity',
      sourceType: 'biodiversity_land_use'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Biodiversity and land use data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/biodiversity-land-use/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Biodiversity and land use data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Biodiversity and land use data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/environmental/materials-circular-economy', async (req, res, next) => {
  try {
    const { reportingPeriod, materialType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'materials_circular_economy' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (materialType) filter['metadata.materialType'] = materialType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/environmental/materials-circular-economy', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'materials',
      sourceType: 'materials_circular_economy'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Materials and circular economy data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/environmental/materials-circular-economy/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Materials and circular economy data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Materials and circular economy data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Social Data Collection Routes
router.get('/social/employee-demographics', async (req, res, next) => {
  try {
    const { reportingPeriod, demographicType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'employee_demographics' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (demographicType) filter['metadata.demographicType'] = demographicType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/social/employee-demographics', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'social',
      topic: 'employment',
      sourceType: 'employee_demographics'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Employee demographics data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/social/employee-demographics/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Employee demographics data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Employee demographics data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/social/health-safety', async (req, res, next) => {
  try {
    const { reportingPeriod, incidentType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'health_safety' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (incidentType) filter['metadata.incidentType'] = incidentType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/social/health-safety', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'social',
      topic: 'occupational_health_safety',
      sourceType: 'health_safety'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Health and safety data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/social/health-safety/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Health and safety data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Health and safety data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/social/training-development', async (req, res, next) => {
  try {
    const { reportingPeriod, trainingType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'training_development' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (trainingType) filter['metadata.trainingType'] = trainingType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/social/training-development', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'social',
      topic: 'training_education',
      sourceType: 'training_development'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Training and development data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/social/training-development/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Training and development data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Training and development data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/social/diversity-inclusion', async (req, res, next) => {
  try {
    const { reportingPeriod, diversityType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'diversity_inclusion' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (diversityType) filter['metadata.diversityType'] = diversityType

    const data = await ESGMetric.find(filter)
      .populate('facilityId', 'name')
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/social/diversity-inclusion', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'social',
      topic: 'non_discrimination',
      sourceType: 'diversity_inclusion'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Diversity and inclusion data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/social/diversity-inclusion/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Diversity and inclusion data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Diversity and inclusion data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Governance Data Collection Routes
router.get('/governance/board-composition', async (req, res, next) => {
  try {
    const { reportingPeriod, compositionType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'board_composition' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (compositionType) filter['metadata.compositionType'] = compositionType

    const data = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/governance/board-composition', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'governance',
      topic: 'governance_structure',
      sourceType: 'board_composition'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Board composition data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/governance/board-composition/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Board composition data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Board composition data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/governance/ethics-anti-corruption', async (req, res, next) => {
  try {
    const { reportingPeriod, ethicsType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'ethics_anti_corruption' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (ethicsType) filter['metadata.ethicsType'] = ethicsType

    const data = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/governance/ethics-anti-corruption', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI',
      pillar: 'governance',
      topic: 'anti_corruption',
      sourceType: 'ethics_anti_corruption'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Ethics and anti-corruption data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/governance/ethics-anti-corruption/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Ethics and anti-corruption data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Ethics and anti-corruption data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/governance/risk-management', async (req, res, next) => {
  try {
    const { reportingPeriod, riskType } = req.query
    const filter = { companyId: req.user.companyId, sourceType: 'risk_management' }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (riskType) filter['metadata.riskType'] = riskType

    const data = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: data
    })
  } catch (error) {
    next(error)
  }
})

router.post('/governance/risk-management', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'TCFD',
      pillar: 'governance',
      topic: 'risk_management',
      sourceType: 'risk_management'
    })

    await metric.save()

    res.status(201).json({
      success: true,
      data: metric,
      message: 'Risk management data saved successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/governance/risk-management/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!metric) {
      throw new AppError('Risk management data not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'Risk management data updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
