/**
 * Frameworks Routes
 * Handles framework-specific operations (GRI, TCFD, SBTi, CSRD, CDP, SDG)
 */

const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth')
const { ESGMetric, ESGTarget, MaterialityAssessment } = require('../models/mongodb')
const { AppError } = require('../utils/errorHandler')

// Apply authentication to all routes
router.use(authenticate)

// GRI Routes
router.get('/gri/standards', async (req, res, next) => {
  try {
    const standards = [
      { id: 'GRI-2', name: 'General Disclosures', description: 'General organizational information' },
      { id: 'GRI-3', name: 'Material Topics', description: 'Material topics identification and management' },
      { id: 'GRI-305', name: 'Emissions', description: 'Greenhouse gas emissions' },
      { id: 'GRI-306', name: 'Waste', description: 'Waste management' },
      { id: 'GRI-401', name: 'Employment', description: 'Employment and labor relations' },
      { id: 'GRI-405', name: 'Diversity and Equal Opportunity', description: 'Diversity and inclusion' }
    ]

    res.json({
      success: true,
      data: standards
    })
  } catch (error) {
    next(error)
  }
})

router.get('/gri/disclosures', async (req, res, next) => {
  try {
    const { reportingPeriod, status } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'GRI'
    }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (status) filter.status = status

    const disclosures = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: disclosures
    })
  } catch (error) {
    next(error)
  }
})

router.post('/gri/disclosures', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const disclosure = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'GRI'
    })

    await disclosure.save()

    res.status(201).json({
      success: true,
      data: disclosure,
      message: 'GRI disclosure created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// TCFD Routes
router.get('/tcfd/recommendations', async (req, res, next) => {
  try {
    const recommendations = [
      { id: 'TCFD-G1', name: 'Governance', description: 'Governance around climate-related risks and opportunities' },
      { id: 'TCFD-S1', name: 'Strategy', description: 'Actual and potential impacts of climate-related risks and opportunities' },
      { id: 'TCFD-R1', name: 'Risk Management', description: 'Processes for identifying, assessing, and managing climate-related risks' },
      { id: 'TCFD-M1', name: 'Metrics and Targets', description: 'Metrics and targets used to assess and manage climate-related risks' }
    ]

    res.json({
      success: true,
      data: recommendations
    })
  } catch (error) {
    next(error)
  }
})

router.get('/tcfd/disclosures', async (req, res, next) => {
  try {
    const { reportingPeriod, pillar } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'TCFD'
    }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (pillar) filter.pillar = pillar

    const disclosures = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: disclosures
    })
  } catch (error) {
    next(error)
  }
})

router.post('/tcfd/disclosures', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const disclosure = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'TCFD'
    })

    await disclosure.save()

    res.status(201).json({
      success: true,
      data: disclosure,
      message: 'TCFD disclosure created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// SBTi Routes
router.get('/sbti/targets', async (req, res, next) => {
  try {
    const { status, targetType } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'SBTi'
    }
    
    if (status) filter.status = status
    if (targetType) filter.targetType = targetType

    const targets = await ESGTarget.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

router.post('/sbti/targets', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = new ESGTarget({
      ...req.body,
      companyId: req.user.companyId,
      framework: 'SBTi'
    })

    await target.save()

    res.status(201).json({
      success: true,
      data: target,
      message: 'SBTi target created successfully'
    })
  } catch (error) {
    next(error)
  }
})

router.post('/sbti/targets/:id/submit', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const target = await ESGTarget.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status: 'submitted' },
      { new: true }
    )

    if (!target) {
      throw new AppError('SBTi target not found', 404)
    }

    res.json({
      success: true,
      data: target,
      message: 'SBTi target submitted for validation successfully'
    })
  } catch (error) {
    next(error)
  }
})

// CSRD Routes
router.get('/csrd/esrs', async (req, res, next) => {
  try {
    const esrs = [
      { id: 'ESRS-1', name: 'General Requirements', description: 'General requirements for sustainability reporting' },
      { id: 'ESRS-E1', name: 'Climate Change', description: 'Climate change impacts and adaptation' },
      { id: 'ESRS-E2', name: 'Pollution', description: 'Pollution prevention and control' },
      { id: 'ESRS-E3', name: 'Water and Marine Resources', description: 'Water and marine resource management' },
      { id: 'ESRS-S1', name: 'Own Workforce', description: 'Own workforce conditions' },
      { id: 'ESRS-S2', name: 'Workers in Value Chain', description: 'Workers in the value chain' },
      { id: 'ESRS-G1', name: 'Business Conduct', description: 'Business conduct and corporate culture' }
    ]

    res.json({
      success: true,
      data: esrs
    })
  } catch (error) {
    next(error)
  }
})

router.get('/csrd/disclosures', async (req, res, next) => {
  try {
    const { reportingPeriod, esrs } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'CSRD'
    }
    
    if (reportingPeriod) filter.reportingPeriod = reportingPeriod
    if (esrs) filter['metadata.esrs'] = esrs

    const disclosures = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: disclosures
    })
  } catch (error) {
    next(error)
  }
})

router.post('/csrd/disclosures', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const disclosure = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'CSRD'
    })

    await disclosure.save()

    res.status(201).json({
      success: true,
      data: disclosure,
      message: 'CSRD disclosure created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// CDP Routes
router.get('/cdp/questionnaire/:year', async (req, res, next) => {
  try {
    const year = req.params.year
    const questionnaire = {
      year: year,
      sections: [
        { id: 'C0', name: 'Introduction', description: 'Introduction and company overview' },
        { id: 'C1', name: 'Governance', description: 'Governance and strategy' },
        { id: 'C2', name: 'Risks and Opportunities', description: 'Climate-related risks and opportunities' },
        { id: 'C3', name: 'Business Strategy', description: 'Business strategy and financial planning' },
        { id: 'C4', name: 'Targets and Performance', description: 'Targets and performance tracking' },
        { id: 'C5', name: 'Emissions', description: 'Emissions data and methodology' }
      ]
    }

    res.json({
      success: true,
      data: questionnaire
    })
  } catch (error) {
    next(error)
  }
})

router.get('/cdp/responses', async (req, res, next) => {
  try {
    const { year, status } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'CDP'
    }
    
    if (year) filter['metadata.year'] = year
    if (status) filter.status = status

    const responses = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: responses
    })
  } catch (error) {
    next(error)
  }
})

router.post('/cdp/responses', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const response = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'CDP'
    })

    await response.save()

    res.status(201).json({
      success: true,
      data: response,
      message: 'CDP response created successfully'
    })
  } catch (error) {
    next(error)
  }
})

// SDG Routes
router.get('/sdg/goals', async (req, res, next) => {
  try {
    const goals = [
      { id: 'SDG-1', name: 'No Poverty', description: 'End poverty in all its forms everywhere' },
      { id: 'SDG-2', name: 'Zero Hunger', description: 'End hunger, achieve food security and improved nutrition' },
      { id: 'SDG-3', name: 'Good Health and Well-being', description: 'Ensure healthy lives and promote well-being' },
      { id: 'SDG-4', name: 'Quality Education', description: 'Ensure inclusive and equitable quality education' },
      { id: 'SDG-5', name: 'Gender Equality', description: 'Achieve gender equality and empower all women and girls' },
      { id: 'SDG-6', name: 'Clean Water and Sanitation', description: 'Ensure availability and sustainable management of water' },
      { id: 'SDG-7', name: 'Affordable and Clean Energy', description: 'Ensure access to affordable, reliable, sustainable energy' },
      { id: 'SDG-8', name: 'Decent Work and Economic Growth', description: 'Promote sustained, inclusive economic growth' },
      { id: 'SDG-9', name: 'Industry, Innovation and Infrastructure', description: 'Build resilient infrastructure and promote innovation' },
      { id: 'SDG-10', name: 'Reduced Inequalities', description: 'Reduce inequality within and among countries' },
      { id: 'SDG-11', name: 'Sustainable Cities and Communities', description: 'Make cities and human settlements inclusive' },
      { id: 'SDG-12', name: 'Responsible Consumption and Production', description: 'Ensure sustainable consumption and production patterns' },
      { id: 'SDG-13', name: 'Climate Action', description: 'Take urgent action to combat climate change' },
      { id: 'SDG-14', name: 'Life Below Water', description: 'Conserve and sustainably use oceans and marine resources' },
      { id: 'SDG-15', name: 'Life on Land', description: 'Protect, restore and promote sustainable use of terrestrial ecosystems' },
      { id: 'SDG-16', name: 'Peace, Justice and Strong Institutions', description: 'Promote peaceful and inclusive societies' },
      { id: 'SDG-17', name: 'Partnerships for the Goals', description: 'Strengthen the means of implementation and revitalize partnerships' }
    ]

    res.json({
      success: true,
      data: goals
    })
  } catch (error) {
    next(error)
  }
})

router.get('/sdg/goals/:goalId/targets', async (req, res, next) => {
  try {
    const goalId = req.params.goalId
    // This would typically fetch from a database or external API
    const targets = [
      { id: `${goalId}.1`, name: 'Target 1', description: 'First target for this goal' },
      { id: `${goalId}.2`, name: 'Target 2', description: 'Second target for this goal' },
      { id: `${goalId}.3`, name: 'Target 3', description: 'Third target for this goal' }
    ]

    res.json({
      success: true,
      data: targets
    })
  } catch (error) {
    next(error)
  }
})

router.get('/sdg/contributions', async (req, res, next) => {
  try {
    const { goalId, targetId } = req.query
    const filter = { 
      companyId: req.user.companyId,
      framework: 'SDG'
    }
    
    if (goalId) filter['metadata.goalId'] = goalId
    if (targetId) filter['metadata.targetId'] = targetId

    const contributions = await ESGMetric.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      data: contributions
    })
  } catch (error) {
    next(error)
  }
})

router.post('/sdg/contributions', authorize('admin', 'manager'), async (req, res, next) => {
  try {
    const contribution = new ESGMetric({
      ...req.body,
      companyId: req.user.companyId,
      userId: req.user.id,
      framework: 'SDG'
    })

    await contribution.save()

    res.status(201).json({
      success: true,
      data: contribution,
      message: 'SDG contribution created successfully'
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
