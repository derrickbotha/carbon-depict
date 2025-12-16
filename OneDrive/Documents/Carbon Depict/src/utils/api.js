import axios from 'axios'

// Create axios instance with default config
// In development, use '/api' to go through Vite proxy
// In production, use the full API URL
const api = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5500/api'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
})

// Request interceptor - add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle common errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken')
          window.location.href = '/login'
          break
        case 403:
          console.error('Access forbidden:', error.response.data)
          break
        case 404:
          console.error('Resource not found:', error.response.data)
          break
        case 500:
          console.error('Server error:', error.response.data)
          break
        default:
          console.error('API error:', error.response.data)
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server:', error.message)
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API methods
export const apiClient = {
  // Health check
  health: () => api.get('/health'),
  detailedHealth: () => api.get('/health/detailed'),

  // Auth endpoints
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    verifyToken: () => api.get('/auth/me'),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    getCurrentUser: () => api.get('/auth/me'),
  },

  // User endpoints
  users: {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Compliance endpoints
  compliance: {
    analyze: (data) => api.post('/compliance/analyze', data),
    batchAnalyze: (data) => api.post('/compliance/batch-analyze', data),
    reanalyze: (id, data) => api.put(`/compliance/reanalyze/${id}`, data),
    uploadProof: (formData) => 
      api.post('/compliance/upload-proof', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    getFrameworks: () => api.get('/compliance/frameworks'),
    getFramework: (framework) => api.get(`/compliance/framework/${framework}`),
    getDrafts: () => api.get('/compliance/metrics/drafts'),
    publish: (id) => api.put(`/compliance/metrics/${id}/publish`),
    getStats: () => api.get('/compliance/stats'),
  },

  // ESG Metrics endpoints
  esgMetrics: {
    getAll: (params) => api.get('/esg/metrics', { params }),
    getById: (id) => api.get(`/esg/metrics/${id}`),
    create: (data) => api.post('/esg/metrics', data),
    update: (id, data) => api.put(`/esg/metrics/${id}`, data),
    delete: (id) => api.delete(`/esg/metrics/${id}`),
    getSummary: (params) => api.get('/esg/metrics/summary', { params }),
    getByPillar: (pillar) => api.get(`/esg/metrics/pillar/${pillar}`),
  },

  // ESG Framework Data endpoints
  esgFrameworkData: {
    getAll: () => api.get('/esg/framework-data'),
    getOverview: () => api.get('/esg/framework-data/overview'),
    getByFramework: (framework) => api.get(`/esg/framework-data/framework/${framework}`),
    save: (framework, payload) => api.put(`/esg/framework-data/framework/${framework}`, payload),
    delete: (framework) => api.delete(`/esg/framework-data/framework/${framework}`),
    getScores: (framework) => api.get(`/esg/framework-data/framework/${framework}/scores`),
    getAllScores: () => api.get('/esg/framework-data/scores/all'),
  },

  // ESG Reports endpoints
  esgReports: {
    getAll: (params) => api.get('/esg/reports', { params }),
    getById: (id) => api.get(`/esg/reports/${id}`),
    create: (data) => api.post('/esg/reports', data),
    generate: (id) => api.post(`/esg/reports/${id}/generate`),
    download: (id, format) => api.get(`/esg/reports/${id}/download/${format}`, {
      responseType: 'blob'
    }),
  },

  // Emission Factors endpoints
  factors: {
    getAll: (params) => api.get('/factors', { params }),
    getById: (id) => api.get(`/factors/${id}`),
    search: (query) => api.get('/factors/search', { params: { q: query } }),
  },

  // Calculations endpoints
  calculate: {
    emissions: (data) => api.post('/calculate/emissions', data),
    batch: (data) => api.post('/calculate/batch', data),
    fuels: (data) => api.post('/calculate/fuels', data),
    electricity: (data) => api.post('/calculate/electricity', data),
    transport: (data) => api.post('/calculate/transport', data),
    airTravel: (data) => api.post('/calculate/air-travel', data),
    waste: (data) => api.post('/calculate/waste', data),
    water: (data) => api.post('/calculate/water', data),
    getEmissionFactors: (category) => api.get('/calculate/emission-factors', { params: { category } }),
  },

  // Emissions data endpoints
  emissions: {
    getAll: (params) => api.get('/emissions', { params }),
    getById: (id) => api.get(`/emissions/${id}`),
    getSummary: (params) => api.get('/emissions/summary', { params }),
    getBySource: (params) => api.get('/emissions/by-source', { params }),
    getTrends: (params) => api.get('/emissions/trends', { params }),
    create: (data) => api.post('/emissions', data),
    update: (id, data) => api.put(`/emissions/${id}`, data),
    delete: (id) => api.delete(`/emissions/${id}`),
  },

  // Reports endpoints
  reports: {
    getAll: (params) => api.get('/reports', { params }),
    getById: (id) => api.get(`/reports/${id}`),
    create: (data) => api.post('/reports', data),
    download: (id, format) => api.get(`/reports/${id}/download/${format}`, {
      responseType: 'blob'
    }),
  },

  // AI endpoints
  ai: {
    predict: (data) => api.post('/ai/predict', data),
    analyze: (data) => api.post('/ai/analyze', data),
    recommendations: (companyId) => api.get(`/ai/recommendations/${companyId}`),
  },

  // Admin endpoints
  admin: {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
  },

  // Messages endpoints
  messages: {
    getConversations: () => api.get('/messages/conversations'),
    getConversation: (id) => api.get(`/messages/conversations/${id}`),
    createConversation: (data) => api.post('/messages/conversations', data),
    sendMessage: (conversationId, data) => api.post(`/messages/conversations/${conversationId}`, data),
    deleteConversation: (id) => api.delete(`/messages/conversations/${id}`),
  },

  // Notifications endpoints
  notifications: {
    getAll: (params) => api.get('/notifications', { params }),
    create: (data) => api.post('/notifications', data),
    broadcast: (data) => api.post('/notifications/broadcast', data),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
    deleteAll: () => api.delete('/notifications'),
  },

  // Generic methods for direct API access
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
}

export default api
