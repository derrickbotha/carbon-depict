/**
 * Enterprise API Routes
 * Comprehensive backend API endpoints for all frontend pages
 */

const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth')
const { Company, User, Location, Facility, GHGEmission, ESGMetric, ESGTarget, MaterialityAssessment } = require('../models/mongodb')
const { AppError } = require('../utils/errorHandler')

// Apply authentication to all routes
router.use(authenticate)

// Company Management Routes
router.get('/companies/profile', async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.companyId)
      .populate('users', 'firstName lastName email role isActive')
      .lean()

    if (!company) {
      throw new AppError('Company not found', 404)
    }

    res.json({
      success: true,
      data: company
    })
  } catch (error) {
    next(error)
  }
})

router.put('/companies/profile', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { name, industry, address, country, size, subscription } = req.body

    const company = await Company.findByIdAndUpdate(
      req.user.companyId,
      { name, industry, address, country, size, subscription },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      data: company,
      message: 'Company profile updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/companies/settings', async (req, res, next) => {
  try {
    const company = await Company.findById(req.user.companyId).select('settings')
    
    res.json({
      success: true,
      data: company.settings
    })
  } catch (error) {
    next(error)
  }
})

router.put('/companies/settings', authorize('admin'), async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.user.companyId,
      { settings: req.body },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      data: company.settings,
      message: 'Company settings updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/companies/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, isActive } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await User.countDocuments(filter)

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

// Location Management Routes
router.get('/locations', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const locations = await Location.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await Location.countDocuments(filter)

    res.json({
      success: true,
      data: locations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/locations/:id', async (req, res, next) => {
  try {
    const location = await Location.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    }).lean()

    if (!location) {
      throw new AppError('Location not found', 404)
    }

    res.json({
      success: true,
      data: location
    })
  } catch (error) {
    next(error)
  }
})

router.post('/locations', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const location = new Location({
      ...req.body,
      companyId: req.user.companyId
    })

    await location.save()

    res.status(201).json({
      success: true,
      data: location,
      message: 'Location created successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/locations/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const location = await Location.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!location) {
      throw new AppError('Location not found', 404)
    }

    res.json({
      success: true,
      data: location,
      message: 'Location updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/locations/:id', authorize('admin'), async (req, res, next) => {
  try {
    const location = await Location.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    })

    if (!location) {
      throw new AppError('Location not found', 404)
    }

    res.json({
      success: true,
      message: 'Location deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Facility Management Routes
router.get('/facilities', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, locationId, facilityType, isActive } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (locationId) filter.locationId = locationId
    if (facilityType) filter.facilityType = facilityType
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const facilities = await Facility.find(filter)
      .populate('locationId', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await Facility.countDocuments(filter)

    res.json({
      success: true,
      data: facilities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/facilities/:id', async (req, res, next) => {
  try {
    const facility = await Facility.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    })
      .populate('locationId', 'name address coordinates')
      .lean()

    if (!facility) {
      throw new AppError('Facility not found', 404)
    }

    res.json({
      success: true,
      data: facility
    })
  } catch (error) {
    next(error)
  }
})

router.get('/facilities/location/:locationId', async (req, res, next) => {
  try {
    const facilities = await Facility.find({
      locationId: req.params.locationId,
      companyId: req.user.companyId
    })
      .populate('locationId', 'name address')
      .sort({ name: 1 })
      .lean()

    res.json({
      success: true,
      data: facilities
    })
  } catch (error) {
    next(error)
  }
})

router.post('/facilities', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const facility = new Facility({
      ...req.body,
      companyId: req.user.companyId
    })

    await facility.save()
    await facility.populate('locationId', 'name address')

    res.status(201).json({
      success: true,
      data: facility,
      message: 'Facility created successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/facilities/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const facility = await Facility.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    ).populate('locationId', 'name address')

    if (!facility) {
      throw new AppError('Facility not found', 404)
    }

    res.json({
      success: true,
      data: facility,
      message: 'Facility updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/facilities/:id', authorize('admin'), async (req, res, next) => {
  try {
    const facility = await Facility.findOneAndDelete({
      _id: req.params.id,
      companyId: req.user.companyId
    })

    if (!facility) {
      throw new AppError('Facility not found', 404)
    }

    res.json({
      success: true,
      message: 'Facility deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Enhanced GHG Emissions Routes
router.get('/emissions/scope/:scope', async (req, res, next) => {
  try {
    const { scope } = req.params
    const { page = 1, limit = 20, reportingPeriod, facilityId, startDate, endDate } = req.query
    
    const filter = { 
      companyId: req.user.companyId,
      scope: scope
    }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (facilityId) filter.facilityId = facilityId
    
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    const emissions = await GHGEmission.find(filter)
      .populate('facilityId', 'name')
      .populate('locationId', 'name')
      .sort({ recordedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await GHGEmission.countDocuments(filter)

    res.json({
      success: true,
      data: emissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/emissions/bulk', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { emissions } = req.body

    if (!Array.isArray(emissions) || emissions.length === 0) {
      throw new AppError('Emissions array is required', 400)
    }

    const emissionsWithCompanyId = emissions.map(emission => ({
      ...emission,
      companyId: req.user.companyId
    }))

    const result = await GHGEmission.insertMany(emissionsWithCompanyId)

    res.status(201).json({
      success: true,
      data: result,
      message: `${result.length} emissions created successfully`
    })
  } catch (error) {
    next(error)
  }
})

router.get('/emissions/export', async (req, res, next) => {
  try {
    const { format = 'csv', reportingPeriod, scope, startDate, endDate } = req.query
    
    const filter = { companyId: req.user.companyId }
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (scope) filter.scope = scope
    if (startDate || endDate) {
      filter.recordedAt = {}
      if (startDate) filter.recordedAt.$gte = new Date(startDate)
      if (endDate) filter.recordedAt.$lte = new Date(endDate)
    }

    const emissions = await GHGEmission.find(filter)
      .populate('facilityId', 'name')
      .populate('locationId', 'name')
      .sort({ recordedAt: -1 })
      .lean()

    // Convert to CSV format
    if (format === 'csv') {
      const csv = convertToCSV(emissions)
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="emissions.csv"')
      res.send(csv)
    } else {
      res.json({
        success: true,
        data: emissions
      })
    }
  } catch (error) {
    next(error)
  }
})

// ESG Metrics Routes
router.post('/esg/metrics/bulk', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { metrics } = req.body

    if (!Array.isArray(metrics) || metrics.length === 0) {
      throw new AppError('Metrics array is required', 400)
    }

    const metricsWithCompanyId = metrics.map(metric => ({
      ...metric,
      companyId: req.user.companyId,
      userId: req.user.id
    }))

    const result = await ESGMetric.insertMany(metricsWithCompanyId)

    res.status(201).json({
      success: true,
      data: result,
      message: `${result.length} ESG metrics created successfully`
    })
  } catch (error) {
    next(error)
  }
})

router.put('/esg/metrics/:id/publish', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status: 'published', isDraft: false },
      { new: true }
    )

    if (!metric) {
      throw new AppError('ESG metric not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'ESG metric published successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/esg/metrics/:id/archive', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const metric = await ESGMetric.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status: 'archived' },
      { new: true }
    )

    if (!metric) {
      throw new AppError('ESG metric not found', 404)
    }

    res.json({
      success: true,
      data: metric,
      message: 'ESG metric archived successfully'
    })
  } catch (error) {
    next(error)
  }
})

// ESG Targets Routes
router.get('/esg/targets', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, framework, status } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (framework) filter.framework = framework
    if (status) filter.status = status

    const targets = await ESGTarget.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await ESGTarget.countDocuments(filter)

    res.json({
      success: true,
      data: targets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

router.get('/esg/targets/:id', async (req, res, next) => {
  try {
    const target = await ESGTarget.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    }).lean()

    if (!target) {
      throw new AppError('ESG target not found', 404)
    }

    res.json({
      success: true,
      data: target
    })
  } catch (error) {
    next(error)
  }
})

router.get('/esg/targets/framework/:framework', async (req, res, next) => {
  try {
    const { framework } = req.params
    const { status } = req.query
    
    const filter = { 
      companyId: req.user.companyId,
      framework: framework
    }
    
    if (status) filter.status = status

    const targets = await ESGTarget.find(filter)
      .sort({ targetYear: 1 })
      .lean()

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

router.post('/esg/targets', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = new ESGTarget({
      ...req.body,
      companyId: req.user.companyId
    })

    await target.save()

    res.status(201).json({
      success: true,
      data: target,
      message: 'ESG target created successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/esg/targets/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!target) {
      throw new AppError('ESG target not found', 404)
    }

    res.json({
      success: true,
      data: target,
      message: 'ESG target updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.get('/esg/targets/:id/progress', async (req, res, next) => {
  try {
    const target = await ESGTarget.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    }).lean()

    if (!target) {
      throw new AppError('ESG target not found', 404)
    }

    // Calculate progress based on current year and target year
    const currentYear = new Date().getFullYear()
    const yearsElapsed = currentYear - target.baselineYear
    const totalYears = target.targetYear - target.baselineYear
    const progressPercentage = Math.min((yearsElapsed / totalYears) * 100, 100)

    res.json({
      success: true,
      data: {
        ...target,
        progressPercentage: Math.round(progressPercentage),
        yearsElapsed,
        totalYears,
        isOnTrack: progressPercentage <= 100
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/esg/targets/:id/progress', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { currentValue, notes } = req.body

    const target = await ESGTarget.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { 
        $push: { 
          progressUpdates: {
            year: new Date().getFullYear(),
            currentValue,
            notes,
            updatedBy: req.user.id,
            updatedAt: new Date()
          }
        }
      },
      { new: true }
    )

    if (!target) {
      throw new AppError('ESG target not found', 404)
    }

    res.json({
      success: true,
      data: target,
      message: 'ESG target progress updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/esg/targets/:id/submit', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status: 'submitted' },
      { new: true }
    )

    if (!target) {
      throw new AppError('ESG target not found', 404)
    }

    res.json({
      success: true,
      data: target,
      message: 'ESG target submitted for approval successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Materiality Assessment Routes
router.get('/materiality/current', async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear()
    const assessment = await MaterialityAssessment.findOne({
      companyId: req.user.companyId,
      assessmentYear: currentYear
    }).lean()

    res.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
})

router.get('/materiality/year/:year', async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOne({
      companyId: req.user.companyId,
      assessmentYear: parseInt(req.params.year)
    }).lean()

    res.json({
      success: true,
      data: assessment
    })
  } catch (error) {
    next(error)
  }
})

router.post('/materiality', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = new MaterialityAssessment({
      ...req.body,
      companyId: req.user.companyId
    })

    await assessment.save()

    res.status(201).json({
      success: true,
      data: assessment,
      message: 'Materiality assessment created successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/materiality/:id', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true, runValidators: true }
    )

    if (!assessment) {
      throw new AppError('Materiality assessment not found', 404)
    }

    res.json({
      success: true,
      data: assessment,
      message: 'Materiality assessment updated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/materiality/stakeholder-input', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const { assessmentId, stakeholderType, input } = req.body

    const assessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: assessmentId, companyId: req.user.companyId },
      {
        $push: {
          stakeholderInput: {
            stakeholderType,
            input,
            submittedBy: req.user.id,
            submittedAt: new Date()
          }
        }
      },
      { new: true }
    )

    if (!assessment) {
      throw new AppError('Materiality assessment not found', 404)
    }

    res.json({
      success: true,
      data: assessment,
      message: 'Stakeholder input added successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/materiality/:id/generate-matrix', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOne({
      _id: req.params.id,
      companyId: req.user.companyId
    })

    if (!assessment) {
      throw new AppError('Materiality assessment not found', 404)
    }

    // Generate materiality matrix based on stakeholder input
    const matrix = generateMaterialityMatrix(assessment.topics, assessment.stakeholderInput)

    const updatedAssessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { materialityMatrix: matrix },
      { new: true }
    )

    res.json({
      success: true,
      data: updatedAssessment,
      message: 'Materiality matrix generated successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.put('/materiality/:id/publish', authorize('admin'), async (req, res, next) => {
  try {
    const assessment = await MaterialityAssessment.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status: 'published' },
      { new: true }
    )

    if (!assessment) {
      throw new AppError('Materiality assessment not found', 404)
    }

    res.json({
      success: true,
      data: assessment,
      message: 'Materiality assessment published successfully'
    })
  } catch (error) {
    next(error)
  }
})

// Utility functions
function convertToCSV(data) {
  if (!data || data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n')

  return csvContent
}

function generateMaterialityMatrix(topics, stakeholderInput) {
  // Simple materiality matrix generation logic
  // In a real implementation, this would be more sophisticated
  return topics.map(topic => ({
    topic,
    impactMateriality: Math.random() * 5,
    financialMateriality: Math.random() * 5,
    stakeholderImportance: Math.random() * 5
  }))
}

module.exports = router
