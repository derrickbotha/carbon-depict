import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../utils/api'

/**
 * Hook for managing ESG metrics with retry logic and caching
 */
export const useESGMetrics = (filters = {}) => {
  const [metrics, setMetrics] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Cache and last fetch time tracking
  const lastFetchTime = useRef({ metrics: 0, summary: 0 })
  const CACHE_DURATION = 60000 // 1 minute cache
  const MAX_RETRIES = 3
  const INITIAL_RETRY_DELAY = 1000 // 1 second

  /**
   * Retry function with exponential backoff
   */
  const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn()
      } catch (err) {
        if (err.response?.status === 429 && i < retries - 1) {
          const delay = INITIAL_RETRY_DELAY * Math.pow(2, i)
          console.log(`Rate limited. Retrying in ${delay}ms...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw err
      }
    }
  }

  /**
   * Check if data should be fetched from cache
   */
  const shouldFetchFromCache = (type) => {
    const now = Date.now()
    return (now - lastFetchTime.current[type]) < CACHE_DURATION
  }

  /**
   * Fetch ESG metrics
   */
  const fetchMetrics = useCallback(async (customFilters = {}) => {
    // Check cache
    if (shouldFetchFromCache('metrics')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = { ...filters, ...customFilters }
      const response = await retryWithBackoff(() => 
        apiClient.esgMetrics.getAll(params)
      )

      if (response.data.success) {
        setMetrics(response.data.data)
        lastFetchTime.current.metrics = Date.now()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ESG metrics')
      console.error('Error fetching ESG metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, retryWithBackoff, shouldFetchFromCache])

  /**
   * Fetch ESG summary for dashboard
   */
  const fetchSummary = useCallback(async (customFilters = {}) => {
    // Check cache
    if (shouldFetchFromCache('summary')) {
      return
    }

    try {
      const params = { ...filters, ...customFilters }
      const response = await retryWithBackoff(() => 
        apiClient.compliance.getStats(params)
      )

      if (response.data.success) {
        setSummary(response.data.data)
        lastFetchTime.current.summary = Date.now()
      }
    } catch (err) {
      console.error('Error fetching ESG summary:', err)
    }
  }, [filters, retryWithBackoff, shouldFetchFromCache])

  /**
   * Create new ESG metric
   */
  const createMetric = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.create(data)

      if (response.data.success) {
        setMetrics(prev => [response.data.data, ...prev])
        await fetchSummary()
        return response.data.data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update ESG metric
   */
  const updateMetric = async (id, data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.update(id, data)

      if (response.data.success) {
        setMetrics(prev =>
          prev.map(m => m._id === id ? response.data.data : m)
        )
        await fetchSummary()
        return response.data.data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete ESG metric
   */
  const deleteMetric = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.esgMetrics.delete(id)

      if (response.data.success) {
        setMetrics(prev => prev.filter(m => m._id !== id))
        await fetchSummary()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete metric')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Publish metric (change from draft to published)
   */
  const publishMetric = async (id) => {
    return updateMetric(id, { status: 'published', isDraft: false })
  }

  /**
   * Get metrics by pillar
   */
  const getMetricsByPillar = (pillar) => {
    return metrics.filter(m => m.pillar === pillar)
  }

  /**
   * Get metrics by framework
   */
  const getMetricsByFramework = (framework) => {
    return metrics.filter(m => m.framework === framework)
  }

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
    fetchSummary()
  }, [fetchMetrics, fetchSummary])

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
  }
}

export default useESGMetrics
