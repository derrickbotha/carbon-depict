const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const ESGFrameworkData = require('../models/mongodb/ESGFrameworkData');
const ESGMetric = require('../models/mongodb/ESGMetric');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authenticate);

// Framework metadata used to enrich responses
const FRAMEWORK_DEFINITIONS = [
  {
    id: 'gri',
    name: 'GRI Standards 2021',
    description: 'Global Reporting Initiative framework data',
    metricKey: 'GRI'
  },
  {
    id: 'tcfd',
    name: 'TCFD Recommendations',
    description: 'Task Force on Climate-related Financial Disclosures',
    metricKey: 'TCFD'
  },
  {
    id: 'sbti',
    name: 'Science Based Targets',
    description: 'Science Based Targets initiative data',
    metricKey: 'SBTi'
  },
  {
    id: 'csrd',
    name: 'CSRD (ESRS)',
    description: 'Corporate Sustainability Reporting Directive',
    metricKey: 'CSRD'
  },
  {
    id: 'cdp',
    name: 'CDP Disclosure',
    description: 'Carbon Disclosure Project data',
    metricKey: 'CDP'
  },
  {
    id: 'sdg',
    name: 'UN SDG Alignment',
    description: 'Sustainable Development Goals tracking',
    metricKey: 'SDG'
  },
  {
    id: 'sasb',
    name: 'SASB Standards',
    description: 'Sustainability Accounting Standards Board',
    metricKey: 'SASB'
  },
  {
    id: 'issb',
    name: 'ISSB Standards',
    description: 'International Sustainability Standards Board',
    metricKey: 'ISSB'
  },
  {
    id: 'pcaf',
    name: 'PCAF Standard',
    description: 'Partnership for Carbon Accounting Financials',
    metricKey: 'PCAF'
  }
];

const FRAMEWORK_LOOKUP = FRAMEWORK_DEFINITIONS.reduce((acc, def) => {
  acc[def.id] = def;
  return acc;
}, {});

const normaliseFrameworkId = (framework = '') => framework.toString().trim().toLowerCase();

router.param('framework', (req, res, next, rawFramework) => {
  const frameworkId = normaliseFrameworkId(rawFramework);

  if (!FRAMEWORK_LOOKUP[frameworkId]) {
    return res.status(400).json({
      success: false,
      error: `Unsupported framework: ${rawFramework}`
    });
  }

  req.frameworkId = frameworkId;
  req.frameworkDefinition = FRAMEWORK_LOOKUP[frameworkId];
  next();
});

/**
 * Helper to ensure company context exists
 */
const ensureCompany = (req, res) => {
  if (!req.companyId) {
    res.status(400).json({ success: false, error: 'Company ID not found' });
    return false;
  }
  return true;
};

/**
 * ESG Framework Data Routes
 * Handles CRUD operations for framework-specific data collection
 */

// @route   GET /api/esg/framework-data
// @desc    Get all framework data for a company
// @access  Private
router.get('/', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const frameworkData = await ESGFrameworkData.find({ companyId: req.companyId })
      .populate('userId', 'firstName lastName email')
      .sort({ framework: 1 })
      .lean();

    const grouped = frameworkData.reduce((acc, item) => {
      acc[item.framework] = item;
      return acc;
    }, {});

    res.json({
      success: true,
      count: frameworkData.length,
      data: grouped
    });
  } catch (error) {
    console.error('Error fetching framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/esg/framework-data/overview
// @desc    Get per-framework progress and compliance summary
// @access  Private
router.get('/overview', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const companyObjectId = new Types.ObjectId(req.companyId);

    const [frameworkDocs, metricSummary] = await Promise.all([
      ESGFrameworkData.find({ companyId: req.companyId }).lean(),
      ESGMetric.aggregate([
        {
          $match: {
            companyId: companyObjectId
          }
        },
        {
          $group: {
            _id: '$framework',
            totalMetrics: { $sum: 1 },
            publishedMetrics: {
              $sum: {
                $cond: [{ $eq: ['$status', 'published'] }, 1, 0]
              }
            },
            compliantMetrics: {
              $sum: {
                $cond: [{ $eq: ['$complianceStatus', 'compliant'] }, 1, 0]
              }
            },
            averageComplianceScore: { $avg: '$complianceScore' }
          }
        }
      ])
    ]);

    const frameworkMap = frameworkDocs.reduce((acc, doc) => {
      acc[doc.framework] = doc;
      return acc;
    }, {});

    const metricMap = metricSummary.reduce((acc, doc) => {
      if (doc._id) {
        acc[doc._id.toLowerCase()] = doc;
      }
      return acc;
    }, {});

    const overview = FRAMEWORK_DEFINITIONS.map((definition) => {
      const frameworkId = definition.id;
      const stored = frameworkMap[frameworkId] || null;
      const metrics = metricMap[definition.metricKey?.toLowerCase()] || {};

      const requirementTotal = stored?.totalFields || metrics.totalMetrics || 0;
      const requirementMet = stored?.completedFields || metrics.compliantMetrics || metrics.publishedMetrics || 0;
      const complianceRate = requirementTotal > 0
        ? Math.round((requirementMet / requirementTotal) * 100)
        : 0;

      const averageComplianceScore = metrics.averageComplianceScore ?? 0;
      const roundedAverageScore = Number.isFinite(averageComplianceScore)
        ? Math.round(averageComplianceScore)
        : 0;
      const finalScore = stored?.score ?? roundedAverageScore;

      return {
        id: frameworkId,
        name: definition.name,
        description: definition.description,
        progress: complianceRate,
        dataProgress: Math.round(stored?.progress ?? 0),
        score: Number.isFinite(finalScore) ? finalScore : 0,
        metrics: {
          total: requirementTotal,
          completed: requirementMet,
          published: metrics.publishedMetrics || 0,
          compliant: metrics.compliantMetrics || 0
        },
        lastUpdated: stored?.updatedAt || stored?.lastUpdated || null
      };
    });

    res.json({ success: true, data: overview });
  } catch (error) {
    console.error('Error building framework overview:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/esg/framework-data/framework/:framework
// @desc    Get specific framework data
// @access  Private
router.get('/framework/:framework', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const frameworkData = await ESGFrameworkData.findOne({
      companyId: req.companyId,
      framework: req.frameworkId
    }).lean();

    if (!frameworkData) {
      return res.json({
        success: true,
        data: {
          framework: req.frameworkId,
          data: {},
          progress: 0,
          score: 0,
          completedFields: 0,
          totalFields: 0,
          status: 'draft'
        }
      });
    }

    res.json({ success: true, data: frameworkData });
  } catch (error) {
    console.error('Error fetching framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/esg/framework-data/framework/:framework
// @desc    Create or update framework data
// @access  Private
router.put('/framework/:framework', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const { data, score, status } = req.body;

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Framework data payload is required and must be an object'
      });
    }

    let frameworkData = await ESGFrameworkData.findOne({
      companyId: req.companyId,
      framework: req.frameworkId
    });

    if (!frameworkData) {
      frameworkData = new ESGFrameworkData({
        companyId: req.companyId,
        userId: req.userId,
        framework: req.frameworkId,
        data
      });
    } else {
      frameworkData.data = data;
      frameworkData.userId = req.userId;
      frameworkData.version += 1;
    }

    if (typeof score === 'number') {
      frameworkData.score = score;
    }

    if (status) {
      frameworkData.status = status;
    }

    frameworkData.calculateProgress();

    if (frameworkData.progress === 100) {
      frameworkData.status = 'completed';
    } else if (frameworkData.progress > 0 && frameworkData.status === 'draft') {
      frameworkData.status = 'in-progress';
    }

    await frameworkData.save();

    if (req.app.get('io')) {
      req.app.get('io').to(`company_${req.companyId}`).emit('framework_data_updated', {
        framework: req.frameworkId,
        progress: frameworkData.progress,
        score: frameworkData.score,
        updatedBy: req.user?.firstName || req.user?.email
      });
    }

    res.json({ success: true, data: frameworkData.toObject() });
  } catch (error) {
    console.error('Error saving framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/esg/framework-data/framework/:framework
// @desc    Delete framework data
// @access  Private
router.delete('/framework/:framework', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const result = await ESGFrameworkData.deleteOne({
      companyId: req.companyId,
      framework: req.frameworkId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Framework data not found'
      });
    }

    if (req.app.get('io')) {
      req.app.get('io').to(`company_${req.companyId}`).emit('framework_data_deleted', {
        framework: req.frameworkId,
        deletedBy: req.user?.firstName || req.user?.email
      });
    }

    res.json({
      success: true,
      message: 'Framework data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/esg/framework-data/framework/:framework/scores
// @desc    Get framework progress & scores
// @access  Private
router.get('/framework/:framework/scores', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const frameworkData = await ESGFrameworkData.findOne({
      companyId: req.companyId,
      framework: req.frameworkId
    }).lean();

    if (!frameworkData) {
      return res.json({
        success: true,
        data: {
          framework: req.frameworkId,
          score: 0,
          progress: 0,
          completedFields: 0,
          totalFields: 0,
          lastUpdated: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        framework: req.frameworkId,
        score: frameworkData.score,
        progress: frameworkData.progress,
        completedFields: frameworkData.completedFields,
        totalFields: frameworkData.totalFields,
        lastUpdated: frameworkData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching framework scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/esg/framework-data/scores/all
// @desc    Get all framework scores for dashboard usage
// @access  Private
router.get('/scores/all', async (req, res) => {
  if (!ensureCompany(req, res)) return;

  try {
    const allFrameworkData = await ESGFrameworkData.find({ companyId: req.companyId })
      .select('framework score progress completedFields totalFields lastUpdated')
      .lean();

    const frameworks = allFrameworkData.reduce((acc, fw) => {
      acc[fw.framework] = {
        score: fw.score,
        progress: fw.progress,
        completedFields: fw.completedFields,
        totalFields: fw.totalFields,
        lastUpdated: fw.lastUpdated
      };
      return acc;
    }, {});

    const environmentalFrameworks = ['gri', 'tcfd', 'sbti', 'cdp', 'sdg', 'pcaf', 'issb', 'sasb'];
    const socialFrameworks = ['gri', 'csrd', 'sdg', 'sasb'];
    const governanceFrameworks = ['gri', 'tcfd', 'csrd', 'issb', 'sasb'];

    const calculatePillarScore = (frameworkList) => {
      const scores = frameworkList
        .map((fw) => frameworks[fw]?.score || 0)
        .filter((score) => score > 0);
      return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    };

    const scores = {
      overall: 0,
      environmental: calculatePillarScore(environmentalFrameworks),
      social: calculatePillarScore(socialFrameworks),
      governance: calculatePillarScore(governanceFrameworks),
      frameworks
    };

    scores.overall = Math.round(
      (scores.environmental || 0) * 0.4 +
      (scores.social || 0) * 0.3 +
      (scores.governance || 0) * 0.3
    );

    res.json({ success: true, data: scores });
  } catch (error) {
    console.error('Error fetching all framework scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
