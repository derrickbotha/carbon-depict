const express = require('express');
const router = express.Router();
const ESGFrameworkData = require('../models/mongodb/ESGFrameworkData');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authenticate);

/**
 * ESG Framework Data Routes
 * Handles CRUD operations for framework-specific data collection
 */

// @route   GET /api/esg/framework-data
// @desc    Get all framework data for a company
// @access  Private
router.get('/', async (req, res) => {
  try {
    const companyId = req.companyId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }
    
    const frameworkData = await ESGFrameworkData.find({ companyId })
      .populate('userId', 'name email')
      .sort({ framework: 1 })
      .lean();

    // Group by framework
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

// @route   GET /api/esg/framework-data/:framework
// @desc    Get specific framework data
// @access  Private
router.get('/scores/:framework', async (req, res) => {
  try {
    const { framework } = req.params;
    const companyId = req.companyId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }

    let frameworkData = await ESGFrameworkData.findOne({ 
      companyId, 
      framework 
    }).lean();

    // If no data exists, return empty structure
    if (!frameworkData) {
      frameworkData = {
        companyId,
        framework,
        data: {},
        progress: 0,
        score: 0,
        completedFields: 0,
        totalFields: 0,
        status: 'draft'
      };
    }

    res.json({
      success: true,
      data: frameworkData
    });
  } catch (error) {
    console.error('Error fetching framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/esg/framework-data/:framework
// @desc    Create or update framework data
// @access  Private
router.put('/:framework', async (req, res) => {
  try {
    const { framework } = req.params;
    const { data } = req.body;
    const companyId = req.companyId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }
    const userId = req.userId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }

    // Find existing or create new
    let frameworkData = await ESGFrameworkData.findOne({ 
      companyId, 
      framework 
    });

    if (frameworkData) {
      // Update existing
      frameworkData.data = data;
      frameworkData.userId = userId;
      frameworkData.calculateProgress();
      frameworkData.version += 1;
      
      // Update status based on progress
      if (frameworkData.progress === 100) {
        frameworkData.status = 'completed';
      } else if (frameworkData.progress > 0) {
        frameworkData.status = 'in-progress';
      }
    } else {
      // Create new
      frameworkData = new ESGFrameworkData({
        companyId,
        userId,
        framework,
        data,
        status: 'draft'
      });
      frameworkData.calculateProgress();
    }

    await frameworkData.save();

    // Emit WebSocket event for real-time update
    if (req.app.get('io')) {
      req.app.get('io').to(`company_${companyId}`).emit('framework_data_updated', {
        framework,
        progress: frameworkData.progress,
        updatedBy: req.user.name
      });
    }

    res.json({
      success: true,
      data: frameworkData
    });
  } catch (error) {
    console.error('Error saving framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/esg/framework-data/:framework
// @desc    Update framework data
// @access  Private
router.put('/:framework', async (req, res) => {
  try {
    const { framework } = req.params;
    const { data, score } = req.body;
    const companyId = req.user.company;

    let frameworkData = await ESGFrameworkData.findOne({ 
      companyId, 
      framework 
    });

    if (!frameworkData) {
      return res.status(404).json({
        success: false,
        error: 'Framework data not found'
      });
    }

    // Update data
    if (data !== undefined) {
      frameworkData.data = data;
      frameworkData.calculateProgress();
    }

    if (score !== undefined) {
      frameworkData.score = score;
    }

    frameworkData.userId = req.user.id;
    frameworkData.version += 1;

    // Update status based on progress
    if (frameworkData.progress === 100) {
      frameworkData.status = 'completed';
    } else if (frameworkData.progress > 0) {
      frameworkData.status = 'in-progress';
    }

    await frameworkData.save();

    // Emit WebSocket event
    if (req.app.get('io')) {
      req.app.get('io').to(`company_${companyId}`).emit('framework_data_updated', {
        framework,
        progress: frameworkData.progress,
        score: frameworkData.score,
        updatedBy: req.user.name
      });
    }

    res.json({
      success: true,
      data: frameworkData
    });
  } catch (error) {
    console.error('Error updating framework data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/esg/framework-data/:framework
// @desc    Delete framework data
// @access  Private
router.delete('/:framework', async (req, res) => {
  try {
    const { framework } = req.params;
    const companyId = req.companyId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }

    const result = await ESGFrameworkData.deleteOne({ 
      companyId, 
      framework 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Framework data not found'
      });
    }

    // Emit WebSocket event
    if (req.app.get('io')) {
      req.app.get('io').to(`company_${companyId}`).emit('framework_data_deleted', {
        framework,
        deletedBy: req.user.name
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

// @route   GET /api/esg/framework-data/:framework/scores
// @desc    Get framework scores
// @access  Private
router.get('/:framework/scores', async (req, res) => {
  try {
    const { framework } = req.params;
    const companyId = req.user.company;

    const frameworkData = await ESGFrameworkData.findOne({ 
      companyId, 
      framework 
    }).lean();

    if (!frameworkData) {
      return res.json({
        success: true,
        data: {
          score: 0,
          progress: 0,
          lastUpdated: null
        }
      });
    }

    res.json({
      success: true,
      data: {
        score: frameworkData.score,
        progress: frameworkData.progress,
        completedFields: frameworkData.completedFields,
        totalFields: frameworkData.totalFields,
        lastUpdated: frameworkData.lastUpdated
      }
    });
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/esg/framework-data/scores/all
// @desc    Get all framework scores for dashboard
// @access  Private
router.get('/scores/all', async (req, res) => {
  try {
    const companyId = req.companyId;
    
    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID not found' });
    }

    const allFrameworkData = await ESGFrameworkData.find({ companyId })
      .select('framework score progress completedFields totalFields lastUpdated')
      .lean();

    // Calculate overall ESG scores
    const frameworks = allFrameworkData.reduce((acc, fw) => {
      acc[fw.framework] = {
        score: fw.score,
        progress: fw.progress,
        lastUpdated: fw.lastUpdated
      };
      return acc;
    }, {});

    // Calculate pillar scores
    const environmentalFrameworks = ['gri', 'tcfd', 'sbti', 'cdp', 'sdg', 'pcaf', 'issb', 'sasb'];
    const socialFrameworks = ['gri', 'csrd', 'sdg', 'sasb'];
    const governanceFrameworks = ['gri', 'tcfd', 'csrd', 'issb', 'sasb'];

    const calculatePillarScore = (frameworkList) => {
      const scores = frameworkList
        .map(fw => frameworks[fw]?.score || 0)
        .filter(s => s > 0);
      return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    };

    const scores = {
      overall: 0,
      environmental: calculatePillarScore(environmentalFrameworks),
      social: calculatePillarScore(socialFrameworks),
      governance: calculatePillarScore(governanceFrameworks),
      frameworks
    };

    // Calculate overall score (weighted average)
    scores.overall = Math.round(
      scores.environmental * 0.4 + 
      scores.social * 0.3 + 
      scores.governance * 0.3
    );

    res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error('Error fetching all scores:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
