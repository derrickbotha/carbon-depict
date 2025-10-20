/**
 * ESG Data Manager
 * Centralized state management for ESG framework data
 * Handles localStorage persistence and API integration (future)
 */

const ESG_STORAGE_KEY = 'carbondepict_esg_data';
const EMISSIONS_STORAGE_KEY = 'carbondepict_emissions_data';
const SCORES_STORAGE_KEY = 'carbondepict_framework_scores';

/**
 * ESG Data Manager Class
 */
class ESGDataManager {
  constructor() {
    this.data = this.loadData();
    this.scores = this.loadScores();
  }

  /**
   * Load data from localStorage
   */
  loadData() {
    try {
      const stored = localStorage.getItem(ESG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getInitialData();
    } catch (error) {
      console.error('Error loading ESG data:', error);
      return this.getInitialData();
    }
  }

  /**
   * Load framework scores from localStorage
   */
  loadScores() {
    try {
      const stored = localStorage.getItem(SCORES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getInitialScores();
    } catch (error) {
      console.error('Error loading scores:', error);
      return this.getInitialScores();
    }
  }

  /**
   * Initial data structure for all frameworks
   */
  getInitialData() {
    return {
      gri: {},
      tcfd: {},
      sbti: {},
      csrd: {},
      cdp: {},
      sdg: {},
      lastUpdated: null,
    };
  }

  /**
   * Initial scores structure
   */
  getInitialScores() {
    return {
      overall: 0,
      environmental: 0,
      social: 0,
      governance: 0,
      frameworks: {
        gri: { score: 0, progress: 0, lastUpdated: null },
        tcfd: { score: 0, progress: 0, lastUpdated: null },
        sbti: { score: 0, progress: 0, lastUpdated: null },
        csrd: { score: 0, progress: 0, lastUpdated: null },
        cdp: { score: 0, progress: 0, lastUpdated: null },
        sdg: { score: 0, progress: 0, lastUpdated: null },
      },
    };
  }

  /**
   * Save framework data
   */
  saveFrameworkData(framework, data) {
    this.data[framework] = data;
    this.data.lastUpdated = new Date().toISOString();
    
    try {
      localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
      
      // Calculate and update progress
      const progress = this.calculateProgress(framework, data);
      this.updateFrameworkProgress(framework, progress);
      
      // Trigger recalculation of overall scores
      this.calculateOverallScores();
      
      return { success: true, data: this.data[framework] };
    } catch (error) {
      console.error('Error saving framework data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get framework data
   */
  getFrameworkData(framework) {
    return this.data[framework] || {};
  }

  /**
   * Calculate progress for a framework
   */
  calculateProgress(framework, data) {
    let totalFields = 0;
    let completedFields = 0;

    const countFields = (obj) => {
      Object.values(obj).forEach((section) => {
        if (section && typeof section === 'object') {
          if (section.hasOwnProperty('completed')) {
            // It's a field
            totalFields++;
            if (section.completed) completedFields++;
          } else {
            // It's a category, recurse
            countFields(section);
          }
        }
      });
    };

    countFields(data);

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }

  /**
   * Update framework progress
   */
  updateFrameworkProgress(framework, progress) {
    this.scores.frameworks[framework].progress = progress;
    this.scores.frameworks[framework].lastUpdated = new Date().toISOString();
    this.saveScores();
  }

  /**
   * Update framework score (from AI analysis)
   */
  updateFrameworkScore(framework, score) {
    this.scores.frameworks[framework].score = score;
    this.scores.frameworks[framework].lastUpdated = new Date().toISOString();
    this.calculateOverallScores();
  }

  /**
   * Calculate overall E/S/G scores
   */
  calculateOverallScores() {
    // Map frameworks to E/S/G categories
    const frameworkMapping = {
      environmental: ['gri', 'tcfd', 'sbti', 'cdp', 'sdg'],
      social: ['gri', 'csrd', 'sdg'],
      governance: ['gri', 'tcfd', 'csrd'],
    };

    // Calculate average score for each pillar
    Object.entries(frameworkMapping).forEach(([pillar, frameworks]) => {
      const scores = frameworks.map((fw) => this.scores.frameworks[fw].score);
      const validScores = scores.filter((s) => s > 0);
      this.scores[pillar] = validScores.length > 0
        ? Math.round(validScores.reduce((sum, s) => sum + s, 0) / validScores.length)
        : 0;
    });

    // Calculate overall score (weighted average)
    const weights = { environmental: 0.4, social: 0.3, governance: 0.3 };
    this.scores.overall = Math.round(
      this.scores.environmental * weights.environmental +
      this.scores.social * weights.social +
      this.scores.governance * weights.governance
    );

    this.saveScores();
  }

  /**
   * Save scores to localStorage
   */
  saveScores() {
    try {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));
    } catch (error) {
      console.error('Error saving scores:', error);
    }
  }

  /**
   * Get all scores
   */
  getScores() {
    return this.scores;
  }

  /**
   * Get framework score
   */
  getFrameworkScore(framework) {
    return this.scores.frameworks[framework];
  }

  /**
   * Prepare data for AI analysis
   */
  prepareForAIAnalysis(framework, data) {
    return {
      framework,
      timestamp: new Date().toISOString(),
      data: this.flattenData(data),
      metadata: {
        totalFields: this.countTotalFields(data),
        completedFields: this.countCompletedFields(data),
        progress: this.calculateProgress(framework, data),
      },
    };
  }

  /**
   * Flatten nested data structure for AI
   */
  flattenData(obj, prefix = '') {
    const flattened = {};
    
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value && typeof value === 'object' && !value.hasOwnProperty('completed')) {
        // Recurse into nested objects
        Object.assign(flattened, this.flattenData(value, newKey));
      } else if (value && value.hasOwnProperty('value')) {
        // It's a field
        flattened[newKey] = {
          name: value.name,
          value: value.value,
          completed: value.completed,
        };
      }
    });

    return flattened;
  }

  /**
   * Count total fields
   */
  countTotalFields(obj) {
    let count = 0;
    
    const countRecursive = (data) => {
      Object.values(data).forEach((value) => {
        if (value && typeof value === 'object') {
          if (value.hasOwnProperty('completed')) {
            count++;
          } else {
            countRecursive(value);
          }
        }
      });
    };

    countRecursive(obj);
    return count;
  }

  /**
   * Count completed fields
   */
  countCompletedFields(obj) {
    let count = 0;
    
    const countRecursive = (data) => {
      Object.values(data).forEach((value) => {
        if (value && typeof value === 'object') {
          if (value.completed === true) {
            count++;
          } else if (!value.hasOwnProperty('completed')) {
            countRecursive(value);
          }
        }
      });
    };

    countRecursive(obj);
    return count;
  }

  /**
   * Clear all data (for testing)
   */
  clearAllData() {
    localStorage.removeItem(ESG_STORAGE_KEY);
    localStorage.removeItem(SCORES_STORAGE_KEY);
    this.data = this.getInitialData();
    this.scores = this.getInitialScores();
  }

  /**
   * Export data (for reporting or API sync)
   */
  exportData() {
    return {
      data: this.data,
      scores: this.scores,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Import data (from backup or API sync)
   */
  importData(imported) {
    if (imported.data) {
      this.data = imported.data;
      localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
    }
    if (imported.scores) {
      this.scores = imported.scores;
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));
    }
  }
}

// Create singleton instance
const esgDataManager = new ESGDataManager();

// Export for use in React components
export default esgDataManager;

// Helper hooks for React components
export const useESGData = (framework) => {
  const [data, setData] = React.useState(() => esgDataManager.getFrameworkData(framework));
  
  const saveData = React.useCallback((newData) => {
    const result = esgDataManager.saveFrameworkData(framework, newData);
    if (result.success) {
      setData(result.data);
    }
    return result;
  }, [framework]);

  return [data, saveData];
};

export const useESGScores = () => {
  const [scores, setScores] = React.useState(() => esgDataManager.getScores());
  
  const refreshScores = React.useCallback(() => {
    setScores(esgDataManager.getScores());
  }, []);

  return [scores, refreshScores];
};
