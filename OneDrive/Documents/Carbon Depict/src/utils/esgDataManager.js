/**
 * ESG Data Manager
 * Centralized state management for ESG framework data
 * Handles localStorage persistence and API integration with real-time updates
 */

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from './api';
import { initializeSocket, subscribeToEvent } from './socketClient';

const ESG_STORAGE_KEY = 'carbondepict_esg_data';
const EMISSIONS_STORAGE_KEY = 'carbondepict_emissions_data';
const SCORES_STORAGE_KEY = 'carbondepict_framework_scores';
const USE_BACKEND = true; // Toggle between backend and localStorage

/**
 * ESG Data Manager Class
 */
class ESGDataManager {
  constructor() {
    this.data = this.loadData();
    this.emissionsData = this.loadEmissionsData();
    this.scores = this.loadScores();
    this.listeners = new Set();
    this.wsConnected = false;
    this.initialized = false;

    // Initialize WebSocket connection if backend is enabled
    // Note: Do NOT sync data here - wait for authentication first
    // WebSocket initialization moved to initialize() method
  }

  /**
   * Initialize data sync from backend (call after authentication)
   */
  async initialize() {
    if (this.initialized || !USE_BACKEND) return;

    try {
      // Sync from backend only after authentication
      await this.syncFromBackend();
      await this.syncScoresFromBackend();

      // Initialize WebSocket after successful authentication
      this.initializeWebSocket();

      this.initialized = true;
      console.log('✅ ESG Data Manager initialized and synced with backend');
    } catch (error) {
      console.error('Error initializing ESG Data Manager:', error);
    }
  }

  /**
   * Initialize WebSocket connection for real-time updates
   */
  initializeWebSocket() {
    try {
      // Initialize Socket.IO connection
      const socket = initializeSocket();

      // Subscribe to framework data updates
      this.unsubscribeUpdate = subscribeToEvent('framework_data_updated', (data) => {
        console.log('Framework data updated via WebSocket:', data);
        this.handleBackendUpdate(data);
      });

      // Subscribe to framework data deletions
      this.unsubscribeDelete = subscribeToEvent('framework_data_deleted', (data) => {
        console.log('Framework data deleted via WebSocket:', data);
        this.handleBackendDelete(data);
      });

      this.wsConnected = true;
      console.log('✅ ESG Data Manager WebSocket listeners initialized');
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.wsConnected = false;
    }
  }

  /**
   * Handle backend data update
   */
  handleBackendUpdate(data) {
    if (data.framework && data.frameworkData) {
      const framework = data.framework;
      const frameworkData = data.frameworkData.data;

      if (['pcaf'].includes(framework)) {
        this.emissionsData[framework] = frameworkData;
        localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
      } else {
        this.data[framework] = frameworkData;
        localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
      }

      // Update scores if provided
      if (data.frameworkData.score !== undefined) {
        this.scores[framework] = data.frameworkData.score;
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));
      }

      this.notifyListeners();
    }
  }

  /**
   * Handle backend data deletion
   */
  handleBackendDelete(data) {
    if (data.framework) {
      const framework = data.framework;

      if (['pcaf'].includes(framework)) {
        delete this.emissionsData[framework];
        localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
      } else {
        delete this.data[framework];
        localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
      }

      delete this.scores[framework];
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));

      this.notifyListeners();
    }
  }

  /**
   * Subscribe to data changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
  }

  /**
   * Unsubscribe from data changes
   */
  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of data changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Cleanup WebSocket listeners
   */
  cleanup() {
    if (this.unsubscribeUpdate) {
      this.unsubscribeUpdate();
    }
    if (this.unsubscribeDelete) {
      this.unsubscribeDelete();
    }
  }

  /**
   * Load data from localStorage or backend
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
   * Load emissions data from localStorage or backend
   */
  loadEmissionsData() {
    try {
      const stored = localStorage.getItem(EMISSIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getInitialEmissionsData();
    } catch (error) {
      console.error('Error loading emissions data:', error);
      return this.getInitialEmissionsData();
    }
  }

  /**
   * Load framework scores from localStorage or backend
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
   * Sync data from backend
   */
  async syncFromBackend() {
    if (!USE_BACKEND) return;

    try {
      const response = await apiClient.esgFrameworkData.getAll();
      if (response.data.success) {
        const backendData = response.data.data;

        // Update local data with backend data
        Object.keys(backendData).forEach(framework => {
          const frameworkData = backendData[framework];
          if (['pcaf'].includes(framework)) {
            this.emissionsData[framework] = frameworkData.data;
          } else {
            this.data[framework] = frameworkData.data;
          }
        });

        // Save to localStorage as cache
        localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
        localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
      }
    } catch (error) {
      console.error('Error syncing from backend:', error);
    }
  }

  /**
   * Sync scores from backend
   */
  async syncScoresFromBackend() {
    if (!USE_BACKEND) return;

    try {
      const response = await apiClient.esgFrameworkData.getAllScores();
      if (response.data.success) {
        this.scores = response.data.data;
        localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));
      }
    } catch (error) {
      console.error('Error syncing scores from backend:', error);
    }
  }

  /**
   * Initial data structure for ESG frameworks
   */
  getInitialData() {
    return {
      gri: {},
      tcfd: {},
      sbti: {},
      csrd: {},
      cdp: {},
      sdg: {},
      sasb: {},
      issb: {},
      lastUpdated: null,
    };
  }

  /**
   * Initial data structure for Emissions frameworks (like PCAF)
   */
  getInitialEmissionsData() {
    return {
      pcaf: {},
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
        sasb: { score: 0, progress: 0, lastUpdated: null },
        issb: { score: 0, progress: 0, lastUpdated: null },
        pcaf: { score: 0, progress: 0, lastUpdated: null },
      },
    };
  }

  /**
   * Save framework data
   */
  async saveFrameworkData(framework, data) {
    const isEmissionsFramework = ['pcaf'].includes(framework);

    if (isEmissionsFramework) {
      this.emissionsData[framework] = data;
      this.emissionsData.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
      } catch (error) {
        console.error('Error saving emissions data:', error);
        return { success: false, error: error.message };
      }
    } else {
      this.data[framework] = data;
      this.data.lastUpdated = new Date().toISOString();
      try {
        localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
      } catch (error) {
        console.error('Error saving ESG data:', error);
        return { success: false, error: error.message };
      }
    }

    // Calculate and update progress
    const progress = this.calculateProgress(framework, data);
    this.updateFrameworkProgress(framework, progress);

    // Trigger recalculation of overall scores
    this.calculateOverallScores();

    // Save to backend if enabled
    if (USE_BACKEND) {
      try {
        const response = await apiClient.esgFrameworkData.save(framework, { data });
        if (response.data.success && response.data.data.score !== undefined) {
          // Update scores from backend response
          this.scores[framework] = response.data.data.score;
          localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores));
        }
      } catch (error) {
        console.error('Error saving framework data to backend:', error);
        // Continue with local storage as fallback
      }
    }

    return { success: true, data: isEmissionsFramework ? this.emissionsData[framework] : this.data[framework] };
  }

  /**
   * Get framework data
   */
  async getFrameworkData(framework) {
    // Try backend first if enabled
    if (USE_BACKEND) {
      try {
        const response = await apiClient.esgFrameworkData.getByFramework(framework);
        if (response.data.success && response.data.data) {
          const frameworkData = response.data.data.data;

          // Update local cache
          if (['pcaf'].includes(framework)) {
            this.emissionsData[framework] = frameworkData;
            localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
          } else {
            this.data[framework] = frameworkData;
            localStorage.setItem(ESG_STORAGE_KEY, JSON.stringify(this.data));
          }

          return frameworkData;
        }
      } catch (error) {
        console.error('Error fetching framework data from backend:', error);
        // Fall through to local storage
      }
    }

    // Fallback to local storage
    if (['pcaf'].includes(framework)) {
      return this.emissionsData[framework] || {};
    }
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
    if (!this.scores.frameworks[framework]) {
      this.scores.frameworks[framework] = { score: 0, progress: 0, lastUpdated: null };
    }
    this.scores.frameworks[framework].progress = progress;
    this.scores.frameworks[framework].lastUpdated = new Date().toISOString();
    this.saveScores();
  }

  /**
   * Update framework score (from AI analysis)
   */
  updateFrameworkScore(framework, score) {
    if (!this.scores.frameworks[framework]) {
      this.scores.frameworks[framework] = { score: 0, progress: 0, lastUpdated: null };
    }
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
      environmental: ['gri', 'tcfd', 'sbti', 'cdp', 'sdg', 'pcaf', 'issb', 'sasb'],
      social: ['gri', 'csrd', 'sdg', 'sasb'],
      governance: ['gri', 'tcfd', 'csrd', 'issb', 'sasb'],
    };

    // Calculate average score for each pillar
    Object.entries(frameworkMapping).forEach(([pillar, frameworks]) => {
      const scores = frameworks.map((fw) => this.scores.frameworks[fw]?.score || 0);
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
    localStorage.removeItem(EMISSIONS_STORAGE_KEY);
    localStorage.removeItem(SCORES_STORAGE_KEY);
    this.data = this.getInitialData();
    this.emissionsData = this.getInitialEmissionsData();
    this.scores = this.getInitialScores();
  }

  /**
   * Export data (for reporting or API sync)
   */
  exportData() {
    return {
      data: this.data,
      emissionsData: this.emissionsData,
      scores: this.scores,
      exportDate: new Date().toISOString(),
      version: '1.1.0',
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
    if (imported.emissionsData) {
      this.emissionsData = imported.emissionsData;
      localStorage.setItem(EMISSIONS_STORAGE_KEY, JSON.stringify(this.emissionsData));
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
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial data from backend or local storage
    const loadInitialData = async () => {
      setLoading(true);
      const initialData = await esgDataManager.getFrameworkData(framework);
      setData(initialData);
      setLoading(false);
    };

    loadInitialData();

    // Subscribe to changes
    const listener = () => {
      const updatedData = esgDataManager.getFrameworkData(framework);
      if (updatedData instanceof Promise) {
        updatedData.then(setData);
      } else {
        setData(updatedData);
      }
    };

    esgDataManager.subscribe(listener);

    return () => {
      esgDataManager.unsubscribe(listener);
    };
  }, [framework]);

  const saveData = useCallback(async (newData) => {
    const result = await esgDataManager.saveFrameworkData(framework, newData);
    if (result.success) {
      setData(result.data);
    }
    return result;
  }, [framework]);

  return [data, saveData, loading];
};

export const useESGScores = () => {
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial scores from cache
    // Backend sync is handled by esgDataManager.initialize() after authentication
    const loadInitialScores = () => {
      setLoading(true);
      setScores(esgDataManager.getScores());
      setLoading(false);
    };

    loadInitialScores();

    // Subscribe to changes
    const listener = () => {
      setScores(esgDataManager.getScores());
    };

    esgDataManager.subscribe(listener);

    return () => {
      esgDataManager.unsubscribe(listener);
    };
  }, []);

  const refreshScores = useCallback(async () => {
    await esgDataManager.syncScoresFromBackend();
    setScores(esgDataManager.getScores());
  }, []);

  return [scores, refreshScores, loading];
};

