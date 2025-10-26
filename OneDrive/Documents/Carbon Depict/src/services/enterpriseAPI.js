/**
 * Enterprise API Service Layer
 * Centralized data management for frontend-backend communication
 */

import axios from 'axios'

// Create axios instance with enterprise configuration
const apiClient = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5500/api'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with enterprise error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Enterprise API Services
export const enterpriseAPI = {
  // Authentication Services
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => apiClient.post('/auth/logout'),
    verifyToken: () => apiClient.get('/auth/me'),
    forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => apiClient.post('/auth/reset-password', { token, password }),
  },

  // Company Management
  companies: {
    getProfile: () => apiClient.get('/companies/profile'),
    updateProfile: (data) => apiClient.put('/companies/profile', data),
    getSettings: () => apiClient.get('/companies/settings'),
    updateSettings: (data) => apiClient.put('/companies/settings', data),
    getUsers: (params) => apiClient.get('/companies/users', { params }),
    inviteUser: (data) => apiClient.post('/companies/users/invite', data),
  },

  // Location Management
  locations: {
    getAll: (params) => apiClient.get('/locations', { params }),
    getById: (id) => apiClient.get(`/locations/${id}`),
    create: (data) => apiClient.post('/locations', data),
    update: (id, data) => apiClient.put(`/locations/${id}`, data),
    delete: (id) => apiClient.delete(`/locations/${id}`),
  },

  // Facility Management
  facilities: {
    getAll: (params) => apiClient.get('/facilities', { params }),
    getById: (id) => apiClient.get(`/facilities/${id}`),
    create: (data) => apiClient.post('/facilities', data),
    update: (id, data) => apiClient.put(`/facilities/${id}`, data),
    delete: (id) => apiClient.delete(`/facilities/${id}`),
    getByLocation: (locationId) => apiClient.get(`/facilities/location/${locationId}`),
  },

  // GHG Emissions Management
  emissions: {
    getAll: (params) => apiClient.get('/emissions', { params }),
    getById: (id) => apiClient.get(`/emissions/${id}`),
    create: (data) => apiClient.post('/emissions', data),
    update: (id, data) => apiClient.put(`/emissions/${id}`, data),
    delete: (id) => apiClient.delete(`/emissions/${id}`),
    getSummary: (params) => apiClient.get('/emissions/summary', { params }),
    getBySource: (params) => apiClient.get('/emissions/by-source', { params }),
    getByCategory: (scope, reportingPeriod) => apiClient.get('/emissions/by-category', { 
      params: { scope, reportingPeriod } 
    }),
    getTrends: (params) => apiClient.get('/emissions/trends', { params }),
    getByScope: (scope, params) => apiClient.get(`/emissions/scope/${scope}`, { params }),
    bulkImport: (data) => apiClient.post('/emissions/bulk', data),
    bulkSave: (formData, scope, reportingPeriod) => apiClient.post('/emissions/bulk-save', {
      formData,
      scope,
      reportingPeriod
    }),
    calculate: (formData, scope, reportingPeriod) => apiClient.post('/emissions/calculate', {
      formData,
      scope,
      reportingPeriod
    }),
    calculateAndSave: (formData, scope, reportingPeriod) => apiClient.post('/emissions/calculate-and-save', {
      formData,
      scope,
      reportingPeriod
    }),
    export: (params) => apiClient.get('/emissions/export', { params, responseType: 'blob' }),
  },

  // ESG Metrics Management
  esgMetrics: {
    getAll: (params) => apiClient.get('/esg/metrics', { params }),
    getById: (id) => apiClient.get(`/esg/metrics/${id}`),
    create: (data) => apiClient.post('/esg/metrics', data),
    update: (id, data) => apiClient.put(`/esg/metrics/${id}`, data),
    delete: (id) => apiClient.delete(`/esg/metrics/${id}`),
    getByFramework: (framework, params) => apiClient.get(`/esg/metrics/framework/${framework}`, { params }),
    getByPillar: (pillar, params) => apiClient.get(`/esg/metrics/pillar/${pillar}`, { params }),
    getSummary: (params) => apiClient.get('/esg/metrics/summary', { params }),
    bulkImport: (data) => apiClient.post('/esg/metrics/bulk', data),
    publish: (id) => apiClient.put(`/esg/metrics/${id}/publish`),
    archive: (id) => apiClient.put(`/esg/metrics/${id}/archive`),
  },

  // ESG Targets Management
  esgTargets: {
    getAll: (params) => apiClient.get('/esg/targets', { params }),
    getById: (id) => apiClient.get(`/esg/targets/${id}`),
    create: (data) => apiClient.post('/esg/targets', data),
    update: (id, data) => apiClient.put(`/esg/targets/${id}`, data),
    delete: (id) => apiClient.delete(`/esg/targets/${id}`),
    getByFramework: (framework, params) => apiClient.get(`/esg/targets/framework/${framework}`, { params }),
    getProgress: (id) => apiClient.get(`/esg/targets/${id}/progress`),
    updateProgress: (id, data) => apiClient.put(`/esg/targets/${id}/progress`, data),
    submitForApproval: (id) => apiClient.post(`/esg/targets/${id}/submit`),
  },

  // Materiality Assessment
  materiality: {
    getCurrent: () => apiClient.get('/materiality/current'),
    getByYear: (year) => apiClient.get(`/materiality/year/${year}`),
    create: (data) => apiClient.post('/materiality', data),
    update: (id, data) => apiClient.put(`/materiality/${id}`, data),
    addStakeholderInput: (data) => apiClient.post('/materiality/stakeholder-input', data),
    generateMatrix: (id) => apiClient.post(`/materiality/${id}/generate-matrix`),
    publish: (id) => apiClient.put(`/materiality/${id}/publish`),
  },

  // Framework-Specific Data Collection
  frameworks: {
    // GRI Standards
    gri: {
      getStandards: () => apiClient.get('/frameworks/gri/standards'),
      getDisclosures: (params) => apiClient.get('/frameworks/gri/disclosures', { params }),
      createDisclosure: (data) => apiClient.post('/frameworks/gri/disclosures', data),
      updateDisclosure: (id, data) => apiClient.put(`/frameworks/gri/disclosures/${id}`, data),
    },

    // TCFD
    tcfd: {
      getRecommendations: () => apiClient.get('/frameworks/tcfd/recommendations'),
      getDisclosures: (params) => apiClient.get('/frameworks/tcfd/disclosures', { params }),
      createDisclosure: (data) => apiClient.post('/frameworks/tcfd/disclosures', data),
      updateDisclosure: (id, data) => apiClient.put(`/frameworks/tcfd/disclosures/${id}`, data),
    },

    // SBTi
    sbti: {
      getTargets: (params) => apiClient.get('/frameworks/sbti/targets', { params }),
      createTarget: (data) => apiClient.post('/frameworks/sbti/targets', data),
      updateTarget: (id, data) => apiClient.put(`/frameworks/sbti/targets/${id}`, data),
      submitForValidation: (id) => apiClient.post(`/frameworks/sbti/targets/${id}/submit`),
    },

    // CSRD
    csrd: {
      getESRS: () => apiClient.get('/frameworks/csrd/esrs'),
      getDisclosures: (params) => apiClient.get('/frameworks/csrd/disclosures', { params }),
      createDisclosure: (data) => apiClient.post('/frameworks/csrd/disclosures', data),
      updateDisclosure: (id, data) => apiClient.put(`/frameworks/csrd/disclosures/${id}`, data),
    },

    // CDP
    cdp: {
      getQuestionnaire: (year) => apiClient.get(`/frameworks/cdp/questionnaire/${year}`),
      getResponses: (params) => apiClient.get('/frameworks/cdp/responses', { params }),
      createResponse: (data) => apiClient.post('/frameworks/cdp/responses', data),
      updateResponse: (id, data) => apiClient.put(`/frameworks/cdp/responses/${id}`, data),
    },

    // SDG
    sdg: {
      getGoals: () => apiClient.get('/frameworks/sdg/goals'),
      getTargets: (goalId) => apiClient.get(`/frameworks/sdg/goals/${goalId}/targets`),
      getContributions: (params) => apiClient.get('/frameworks/sdg/contributions', { params }),
      createContribution: (data) => apiClient.post('/frameworks/sdg/contributions', data),
      updateContribution: (id, data) => apiClient.put(`/frameworks/sdg/contributions/${id}`, data),
    },
  },

  // Data Collection Forms
  dataCollection: {
    // Environmental Data
    environmental: {
      ghgInventory: {
        getData: (params) => apiClient.get('/data-collection/environmental/ghg-inventory', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/ghg-inventory', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/ghg-inventory/${id}`, data),
      },
      energyManagement: {
        getData: (params) => apiClient.get('/data-collection/environmental/energy-management', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/energy-management', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/energy-management/${id}`, data),
      },
      waterManagement: {
        getData: (params) => apiClient.get('/data-collection/environmental/water-management', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/water-management', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/water-management/${id}`, data),
      },
      wasteManagement: {
        getData: (params) => apiClient.get('/data-collection/environmental/waste-management', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/waste-management', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/waste-management/${id}`, data),
      },
      biodiversityLandUse: {
        getData: (params) => apiClient.get('/data-collection/environmental/biodiversity-land-use', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/biodiversity-land-use', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/biodiversity-land-use/${id}`, data),
      },
      materialsCircularEconomy: {
        getData: (params) => apiClient.get('/data-collection/environmental/materials-circular-economy', { params }),
        saveData: (data) => apiClient.post('/data-collection/environmental/materials-circular-economy', data),
        updateData: (id, data) => apiClient.put(`/data-collection/environmental/materials-circular-economy/${id}`, data),
      },
    },

    // Social Data
    social: {
      employeeDemographics: {
        getData: (params) => apiClient.get('/data-collection/social/employee-demographics', { params }),
        saveData: (data) => apiClient.post('/data-collection/social/employee-demographics', data),
        updateData: (id, data) => apiClient.put(`/data-collection/social/employee-demographics/${id}`, data),
      },
      healthSafety: {
        getData: (params) => apiClient.get('/data-collection/social/health-safety', { params }),
        saveData: (data) => apiClient.post('/data-collection/social/health-safety', data),
        updateData: (id, data) => apiClient.put(`/data-collection/social/health-safety/${id}`, data),
      },
      trainingDevelopment: {
        getData: (params) => apiClient.get('/data-collection/social/training-development', { params }),
        saveData: (data) => apiClient.post('/data-collection/social/training-development', data),
        updateData: (id, data) => apiClient.put(`/data-collection/social/training-development/${id}`, data),
      },
      diversityInclusion: {
        getData: (params) => apiClient.get('/data-collection/social/diversity-inclusion', { params }),
        saveData: (data) => apiClient.post('/data-collection/social/diversity-inclusion', data),
        updateData: (id, data) => apiClient.put(`/data-collection/social/diversity-inclusion/${id}`, data),
      },
    },

    // Governance Data
    governance: {
      boardComposition: {
        getData: (params) => apiClient.get('/data-collection/governance/board-composition', { params }),
        saveData: (data) => apiClient.post('/data-collection/governance/board-composition', data),
        updateData: (id, data) => apiClient.put(`/data-collection/governance/board-composition/${id}`, data),
      },
      ethicsAntiCorruption: {
        getData: (params) => apiClient.get('/data-collection/governance/ethics-anti-corruption', { params }),
        saveData: (data) => apiClient.post('/data-collection/governance/ethics-anti-corruption', data),
        updateData: (id, data) => apiClient.put(`/data-collection/governance/ethics-anti-corruption/${id}`, data),
      },
      riskManagement: {
        getData: (params) => apiClient.get('/data-collection/governance/risk-management', { params }),
        saveData: (data) => apiClient.post('/data-collection/governance/risk-management', data),
        updateData: (id, data) => apiClient.put(`/data-collection/governance/risk-management/${id}`, data),
      },
    },
  },

  // Reports and Analytics
  reports: {
    getAll: (params) => apiClient.get('/reports', { params }),
    getById: (id) => apiClient.get(`/reports/${id}`),
    create: (data) => apiClient.post('/reports', data),
    update: (id, data) => apiClient.put(`/reports/${id}`, data),
    delete: (id) => apiClient.delete(`/reports/${id}`),
    generate: (data) => apiClient.post('/reports/generate', data),
    generateWithDates: (data) => apiClient.post('/reports/generate-with-dates', data),
    download: (id, format, params) => apiClient.get(`/reports/${id}/download/${format}`, { 
      responseType: 'blob',
      params 
    }),
    getTemplates: () => apiClient.get('/reports/templates'),
  },

  // Analytics and Dashboards
  analytics: {
    getDashboardData: (params) => apiClient.get('/analytics/dashboard', { params }),
    getEmissionsAnalytics: (params) => apiClient.get('/analytics/emissions', { params }),
    getESGAnalytics: (params) => apiClient.get('/analytics/esg', { params }),
    getComplianceAnalytics: (params) => apiClient.get('/analytics/compliance', { params }),
    getTrends: (params) => apiClient.get('/analytics/trends', { params }),
    getBenchmarks: (params) => apiClient.get('/analytics/benchmarks', { params }),
  },

  // File Management
  files: {
    upload: (formData) => apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    download: (id) => apiClient.get(`/files/${id}/download`, { responseType: 'blob' }),
    delete: (id) => apiClient.delete(`/files/${id}`),
    getByType: (type, params) => apiClient.get(`/files/type/${type}`, { params }),
  },

  // System Health
  system: {
    health: () => apiClient.get('/health'),
    detailedHealth: () => apiClient.get('/health/detailed'),
    getStats: () => apiClient.get('/system/stats'),
    getLogs: (params) => apiClient.get('/system/logs', { params }),
  },
}

export default enterpriseAPI
