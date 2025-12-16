/**
 * ESG Metrics Management Hook - Phase 3 Week 11: Frontend State Management (Enhanced)
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
  revertOptimisticUpdate,
  filterEntities,
  groupEntities
} from '../utils/stateNormalization'

/**
 * Hook for managing ESG metrics with advanced state management
 */
export const useESGMetrics = (filters = {}) => {
  // Normalized state
  const [normalizedMetrics, setNormalizedMetrics] = useState(createEmptyNormalizedState())
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Store original data for rollback on failed optimistic updates
  const originalData = useRef(null)
  const abortController = useRef(null)

  // Denormalize for component consumption
  const metrics = denormalize(normalizedMetrics)

  /**
   * Fetch ESG metrics with caching
   */
  const fetchMetrics = useCallback(async (customFilters = {}, options = {}) => {
    const cacheKey = 'esg_metrics_list'
    const params = { ...filters, ...customFilters }

    // Check cache first unless forceRefresh is true
    if (!options.forceRefresh) {
      const cached = queryCache.get(cacheKey, params)
      if (cached) {
        setNormalizedMetrics(normalize(cached))
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
      const response = await apiClient.esgMetrics.getAll({
        ...params,
        signal: abortController.current.signal
      })

      if (response.data.success) {
        const metricsData = response.data.data

        // Normalize and set state
        setNormalizedMetrics(normalize(metricsData))

        // Cache the response
        queryCache.set(cacheKey, metricsData, {
          params,
          dependencies: [CacheDependencies.ESG_METRICS],
          ttl: 5 * 60 * 1000 // 5 minutes
        })

        return metricsData
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.response?.data?.error || 'Failed to fetch ESG metrics')
        console.error('Error fetching ESG metrics:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [filters])

  /**
   * Fetch ESG summary for dashboard with caching
   */
  const fetchSummary = useCallback(async (customFilters = {}, options = {}) => {
    const cacheKey = 'esg_summary'
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
      const response = await apiClient.compliance.getStats(params)

      if (response.data.success) {
        const summaryData = response.data.data
        setSummary(summaryData)

        // Cache summary
        queryCache.set(cacheKey, summaryData, {
          params,
          dependencies: [CacheDependencies.ESG_SUMMARY],
          ttl: 5 * 60 * 1000
        })

        return summaryData
      }
    } catch (err) {
      console.error('Error fetching ESG summary:', err)
    }
  }, [filters])

  /**
   * Create new ESG metric with optimistic update
   */
  const createMetric = async (data) => {
    // Generate temporary ID for optimistic update
    const tempId = `temp_${Date.now()}`
    const optimisticMetric = {
      _id: tempId,
      ...data,
      createdAt: new Date().toISOString(),
      __optimistic: true
    }

    // Optimistic update
    setNormalizedMetrics(prev => addEntity(prev, optimisticMetric, '_id', true))
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.create(data)

      if (response.data.success) {
        const newMetric = response.data.data

        // Replace temp with real data
        setNormalizedMetrics(prev => {
          const withoutTemp = removeEntity(prev, tempId)
          return addEntity(withoutTemp, newMetric, '_id', true)
        })

        // Invalidate cache and refresh summary
        invalidateEntityCache('esg_metric')
        await fetchSummary({}, { forceRefresh: true })

        return newMetric
      }
    } catch (err) {
      // Rollback optimistic update
      setNormalizedMetrics(prev => removeEntity(prev, tempId))
      setError(err.response?.data?.error || 'Failed to create metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update ESG metric with optimistic update
   */
  const updateMetric = async (id, data) => {
    // Store original for rollback
    originalData.current = normalizedMetrics.entities[id]

    if (!originalData.current) {
      throw new Error(`Metric with id ${id} not found`)
    }

    // Optimistic update
    setNormalizedMetrics(prev =>
      applyOptimisticUpdate(prev, id, data)
    )
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.update(id, data)

      if (response.data.success) {
        const updatedMetric = response.data.data

        // Confirm optimistic update with real data
        setNormalizedMetrics(prev =>
          updateEntity(prev, id, updatedMetric)
        )

        // Invalidate cache and refresh summary
        invalidateEntityCache('esg_metric')
        await fetchSummary({}, { forceRefresh: true })

        originalData.current = null
        return updatedMetric
      }
    } catch (err) {
      // Rollback optimistic update
      if (originalData.current) {
        setNormalizedMetrics(prev =>
          revertOptimisticUpdate(prev, id, originalData.current)
        )
      }

      setError(err.response?.data?.error || 'Failed to update metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete ESG metric with optimistic update
   */
  const deleteMetric = async (id) => {
    // Store original for rollback
    originalData.current = normalizedMetrics.entities[id]

    if (!originalData.current) {
      throw new Error(`Metric with id ${id} not found`)
    }

    // Optimistic delete
    setNormalizedMetrics(prev => removeEntity(prev, id))
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.delete(id)

      if (response.data.success) {
        // Invalidate cache and refresh summary
        invalidateEntityCache('esg_metric')
        await fetchSummary({}, { forceRefresh: true })

        originalData.current = null
      }
    } catch (err) {
      // Rollback delete
      if (originalData.current) {
        setNormalizedMetrics(prev =>
          addEntity(prev, originalData.current, '_id', false)
        )
      }

      setError(err.response?.data?.error || 'Failed to delete metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Publish metric (change from draft to published) with optimistic update
   */
  const publishMetric = async (id) => {
    return updateMetric(id, { status: 'published', isDraft: false })
  }

  /**
   * Get metrics by pillar (using normalized state for efficient filtering)
   */
  const getMetricsByPillar = useCallback((pillar) => {
    return filterEntities(normalizedMetrics, m => m.pillar === pillar)
  }, [normalizedMetrics])

  /**
   * Get metrics by framework (using normalized state for efficient filtering)
   */
  const getMetricsByFramework = useCallback((framework) => {
    return filterEntities(normalizedMetrics, m => m.framework === framework)
  }, [normalizedMetrics])

  /**
   * Group metrics by pillar
   */
  const getMetricsGroupedByPillar = useCallback(() => {
    return groupEntities(normalizedMetrics, 'pillar')
  }, [normalizedMetrics])

  /**
   * Group metrics by framework
   */
  const getMetricsGroupedByFramework = useCallback(() => {
    return groupEntities(normalizedMetrics, 'framework')
  }, [normalizedMetrics])

  /**
   * Refresh data (force reload from API)
   */
  const refresh = useCallback(() => {
    fetchMetrics({}, { forceRefresh: true })
    fetchSummary({}, { forceRefresh: true })
  }, [fetchMetrics, fetchSummary])

  /**
   * Clear local cache
   */
  const clearCache = useCallback(() => {
    invalidateEntityCache('esg_metric')
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
    fetchSummary()
  }, [fetchMetrics, fetchSummary])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return {
    metrics,
    summary,
    loading,
    error,
    fetchMetrics,
    fetchSummary,
    createMetric,
    updateMetric,
    deleteMetric,
    publishMetric,
    getMetricsByPillar,
    getMetricsByFramework,
    getMetricsGroupedByPillar,
    getMetricsGroupedByFramework,
    refresh,
    clearCache,
  }
}

export default useESGMetrics
