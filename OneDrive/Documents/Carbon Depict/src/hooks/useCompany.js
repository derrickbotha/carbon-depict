/**
 * Company Management Hook - Phase 3 Week 11: Frontend State Management
 *
 * Custom hook for managing company data with advanced features:
 * - CRUD operations with optimistic updates
 * - Caching and automatic refetching
 * - Search and filtering
 * - Pagination support
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../utils/api'

export const useCompany = (companyId = null) => {
  const [company, setCompany] = useState(null)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Cache for preventing duplicate requests
  const cache = useRef({})
  const abortController = useRef(null)

  /**
   * Fetch single company by ID
   */
  const fetchCompany = useCallback(async (id = companyId, options = {}) => {
    if (!id) return

    const cacheKey = `company_${id}`

    // Return cached data if available and not forced refresh
    if (cache.current[cacheKey] && !options.forceRefresh) {
      setCompany(cache.current[cacheKey])
      return cache.current[cacheKey]
    }

    setLoading(true)
    setError(null)

    // Cancel previous request if it exists
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    try {
      const response = await apiClient.companies.getById(id, {
        signal: abortController.current.signal,
        ...options
      })

      if (response.data.success) {
        const companyData = response.data.data
        setCompany(companyData)
        cache.current[cacheKey] = companyData
        return companyData
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        const errorMsg = err.response?.data?.error || 'Failed to fetch company'
        setError(errorMsg)
        console.error('Error fetching company:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [companyId])

  /**
   * Fetch all companies with filters and pagination
   */
  const fetchCompanies = useCallback(async (filters = {}, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...options
      }

      const response = await apiClient.companies.getAll(params)

      if (response.data.success) {
        setCompanies(response.data.data)
        setPagination(response.data.pagination)
        return response.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch companies'
      setError(errorMsg)
      console.error('Error fetching companies:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  /**
   * Create new company
   */
  const createCompany = useCallback(async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.companies.create(data)

      if (response.data.success) {
        const newCompany = response.data.data

        // Optimistic update
        setCompanies(prev => [newCompany, ...prev])
        cache.current[`company_${newCompany._id}`] = newCompany

        return newCompany
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create company'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Update company
   */
  const updateCompany = useCallback(async (id, updates) => {
    setLoading(true)
    setError(null)

    // Optimistic update
    const originalCompany = company
    if (company && company._id === id) {
      setCompany({ ...company, ...updates })
    }

    try {
      const response = await apiClient.companies.update(id, updates)

      if (response.data.success) {
        const updatedCompany = response.data.data

        setCompany(updatedCompany)
        setCompanies(prev =>
          prev.map(c => c._id === id ? updatedCompany : c)
        )

        // Update cache
        cache.current[`company_${id}`] = updatedCompany

        return updatedCompany
      }
    } catch (err) {
      // Rollback optimistic update on error
      if (originalCompany) {
        setCompany(originalCompany)
      }

      const errorMsg = err.response?.data?.error || 'Failed to update company'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [company])

  /**
   * Delete company
   */
  const deleteCompany = useCallback(async (id) => {
    setLoading(true)
    setError(null)

    // Store for rollback
    const originalCompanies = companies

    // Optimistic update
    setCompanies(prev => prev.filter(c => c._id !== id))

    try {
      const response = await apiClient.companies.delete(id)

      if (response.data.success) {
        // Remove from cache
        delete cache.current[`company_${id}`]

        if (company && company._id === id) {
          setCompany(null)
        }

        return response.data
      }
    } catch (err) {
      // Rollback on error
      setCompanies(originalCompanies)

      const errorMsg = err.response?.data?.error || 'Failed to delete company'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [company, companies])

  /**
   * Fetch company statistics
   */
  const fetchStats = useCallback(async (id = companyId) => {
    if (!id) return

    try {
      const response = await apiClient.companies.getStats(id)

      if (response.data.success) {
        setStats(response.data.data)
        return response.data.data
      }
    } catch (err) {
      console.error('Error fetching company stats:', err)
    }
  }, [companyId])

  /**
   * Search companies
   */
  const searchCompanies = useCallback(async (searchTerm, options = {}) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.companies.search(searchTerm, options)

      if (response.data.success) {
        return response.data.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to search companies'
      setError(errorMsg)
      console.error('Error searching companies:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Pagination handlers
   */
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }))
    }
  }, [pagination.hasNextPage])

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }))
    }
  }, [pagination.hasPrevPage])

  const setPage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }))
  }, [])

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cache.current = {}
  }, [])

  /**
   * Refresh company data
   */
  const refresh = useCallback(() => {
    if (companyId) {
      fetchCompany(companyId, { forceRefresh: true })
      fetchStats(companyId)
    }
  }, [companyId, fetchCompany, fetchStats])

  // Initial fetch
  useEffect(() => {
    if (companyId) {
      fetchCompany(companyId)
      fetchStats(companyId)
    }
  }, [companyId, fetchCompany, fetchStats])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return {
    // State
    company,
    companies,
    loading,
    error,
    stats,
    pagination,

    // Actions
    fetchCompany,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    fetchStats,
    searchCompanies,
    refresh,
    clearCache,

    // Pagination
    nextPage,
    prevPage,
    setPage,
  }
}

export default useCompany
