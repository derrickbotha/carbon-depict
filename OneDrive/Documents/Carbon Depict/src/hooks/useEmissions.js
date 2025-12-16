/**
 * Emissions Management Hook - Phase 3 Week 11: Frontend State Management (Enhanced)
 *
 * Enhanced with:
 * - Query cache integration
 * - State normalization
 * - Optimistic updates with rollback
 * - Automatic cache invalidation
 * - Request deduplication
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../utils/api'
import queryCache, { CacheDependencies, invalidateEntityCache } from '../utils/queryCache'
import {
  normalize,
  denormalize,
  addEntity,
  updateEntity,
  removeEntity,
  createEmptyNormalizedState,
  applyOptimisticUpdate,
  revertOptimisticUpdate
} from '../utils/stateNormalization'

/**
 * Hook for managing emissions data with advanced state management
 */
export const useEmissions = (filters = {}) => {
  // Normalized state
  const [normalizedEmissions, setNormalizedEmissions] = useState(createEmptyNormalizedState())
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    pages: 0
  })

  // Store original data for rollback on failed optimistic updates
  const originalData = useRef(null)
  const abortController = useRef(null)

  // Denormalize for component consumption
  const emissions = denormalize(normalizedEmissions)

  /**
   * Fetch emissions data with caching
   */
  const fetchEmissions = useCallback(async (customFilters = {}, options = {}) => {
    const cacheKey = 'emissions_list'
    const params = { ...filters, ...customFilters, ...pagination }

    // Check cache first unless forceRefresh is true
    if (!options.forceRefresh) {
      const cached = queryCache.get(cacheKey, params)
      if (cached) {
        setNormalizedEmissions(normalize(cached.data))
        setPagination(prev => ({
          ...prev,
          total: cached.total,
          pages: cached.pages,
        }))
        return cached
      }
    }

    setLoading(true)
    setError(null)

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    try {
      const response = await apiClient.emissions.getAll({
        ...params,
        signal: abortController.current.signal
      })

      if (response.data.success) {
        const emissionsData = response.data.data

        // Normalize and set state
        setNormalizedEmissions(normalize(emissionsData))
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          pages: response.data.pages,
        }))

        // Cache the response
        queryCache.set(cacheKey, {
          data: emissionsData,
          total: response.data.total,
          pages: response.data.pages
        }, {
          params,
          dependencies: [CacheDependencies.EMISSIONS],
          ttl: 5 * 60 * 1000 // 5 minutes
        })

        return response.data
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.response?.data?.error || 'Failed to fetch emissions')
        console.error('Error fetching emissions:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.page, pagination.limit])

  /**
   * Fetch emissions summary with caching
   */
  const fetchSummary = useCallback(async (customFilters = {}, options = {}) => {
    const cacheKey = 'emissions_summary'
    const params = { ...filters, ...customFilters }

    // Check cache first
    if (!options.forceRefresh) {
      const cached = queryCache.get(cacheKey, params)
      if (cached) {
        setSummary(cached)
        return cached
      }
    }

    try {
      const response = await apiClient.emissions.getSummary(params)

      if (response.data.success) {
        const summaryData = response.data.data
        setSummary(summaryData)

        // Cache summary
        queryCache.set(cacheKey, summaryData, {
          params,
          dependencies: [CacheDependencies.EMISSIONS_SUMMARY],
          ttl: 5 * 60 * 1000
        })

        return summaryData
      }
    } catch (err) {
      console.error('Error fetching emissions summary:', err)
    }
  }, [filters])

  /**
   * Create new emission record with optimistic update
   */
  const createEmission = async (data) => {
    // Generate temporary ID for optimistic update
    const tempId = `temp_${Date.now()}`
    const optimisticEmission = {
      _id: tempId,
      ...data,
      createdAt: new Date().toISOString(),
      __optimistic: true
    }

    // Optimistic update
    setNormalizedEmissions(prev => addEntity(prev, optimisticEmission, '_id', true))
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.create(data)

      if (response.data.success) {
        const newEmission = response.data.data

        // Replace temp with real data
        setNormalizedEmissions(prev => {
          const withoutTemp = removeEntity(prev, tempId)
          return addEntity(withoutTemp, newEmission, '_id', true)
        })

        // Invalidate cache and refresh summary
        invalidateEntityCache('emission')
        await fetchSummary({}, { forceRefresh: true })

        return newEmission
      }
    } catch (err) {
      // Rollback optimistic update
      setNormalizedEmissions(prev => removeEntity(prev, tempId))
      setError(err.response?.data?.error || 'Failed to create emission')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update emission record with optimistic update
   */
  const updateEmission = async (id, data) => {
    // Store original for rollback
    originalData.current = normalizedEmissions.entities[id]

    if (!originalData.current) {
      throw new Error(`Emission with id ${id} not found`)
    }

    // Optimistic update
    setNormalizedEmissions(prev =>
      applyOptimisticUpdate(prev, id, data)
    )
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.update(id, data)

      if (response.data.success) {
        const updatedEmission = response.data.data

        // Confirm optimistic update with real data
        setNormalizedEmissions(prev =>
          updateEntity(prev, id, updatedEmission)
        )

        // Invalidate cache and refresh summary
        invalidateEntityCache('emission')
        await fetchSummary({}, { forceRefresh: true })

        originalData.current = null
        return updatedEmission
      }
    } catch (err) {
      // Rollback optimistic update
      if (originalData.current) {
        setNormalizedEmissions(prev =>
          revertOptimisticUpdate(prev, id, originalData.current)
        )
      }

      setError(err.response?.data?.error || 'Failed to update emission')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete emission record with optimistic update
   */
  const deleteEmission = async (id) => {
    // Store original for rollback
    originalData.current = normalizedEmissions.entities[id]

    if (!originalData.current) {
      throw new Error(`Emission with id ${id} not found`)
    }

    // Optimistic delete
    setNormalizedEmissions(prev => removeEntity(prev, id))
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.delete(id)

      if (response.data.success) {
        // Invalidate cache and refresh summary
        invalidateEntityCache('emission')
        await fetchSummary({}, { forceRefresh: true })

        originalData.current = null
      }
    } catch (err) {
      // Rollback delete
      if (originalData.current) {
        setNormalizedEmissions(prev =>
          addEntity(prev, originalData.current, '_id', false)
        )
      }

      setError(err.response?.data?.error || 'Failed to delete emission')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Calculate and save emissions
   */
  const calculateAndSave = async (type, data) => {
    setLoading(true)
    setError(null)

    try {
      let response
      const payload = { ...data, save: true }

      switch (type) {
        case 'fuel':
          response = await apiClient.calculate.fuels(payload)
          break
        case 'electricity':
          response = await apiClient.calculate.electricity(payload)
          break
        case 'transport':
          response = await apiClient.calculate.transport(payload)
          break
        case 'air-travel':
          response = await apiClient.calculate.airTravel(payload)
          break
        case 'waste':
          response = await apiClient.calculate.waste(payload)
          break
        case 'water':
          response = await apiClient.calculate.water(payload)
          break
        default:
          throw new Error(`Unknown calculation type: ${type}`)
      }

      if (response.data.success) {
        // Invalidate cache and refresh
        invalidateEntityCache('emission')
        await fetchEmissions({}, { forceRefresh: true })
        await fetchSummary({}, { forceRefresh: true })

        return response.data.data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to calculate emissions')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Change page
   */
  const setPage = (page) => {
    setPagination(prev => ({ ...prev, page }))
  }

  /**
   * Refresh data (force reload from API)
   */
  const refresh = useCallback(() => {
    fetchEmissions({}, { forceRefresh: true })
    fetchSummary({}, { forceRefresh: true })
  }, [fetchEmissions, fetchSummary])

  /**
   * Clear local cache
   */
  const clearCache = useCallback(() => {
    invalidateEntityCache('emission')
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchEmissions()
    fetchSummary()
  }, [fetchEmissions, fetchSummary])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return {
    emissions,
    summary,
    loading,
    error,
    pagination,
    fetchEmissions,
    fetchSummary,
    createEmission,
    updateEmission,
    deleteEmission,
    calculateAndSave,
    setPage,
    refresh,
    clearCache,
  }
}

export default useEmissions
