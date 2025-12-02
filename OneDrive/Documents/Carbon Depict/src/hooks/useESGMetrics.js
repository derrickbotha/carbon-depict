import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/api'

/**
 * Hook for managing ESG metrics
 */
export const useESGMetrics = (filters = {}) => {
  const [metrics, setMetrics] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch ESG metrics
   */
  const fetchMetrics = useCallback(async (customFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = { ...filters, ...customFilters }
      const response = await apiClient.esgMetrics.getAll(params)

      if (response.data.success) {
        setMetrics(response.data.data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch ESG metrics')
      console.error('Error fetching ESG metrics:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  /**
   * Fetch ESG summary for dashboard
   */
  const fetchSummary = useCallback(async (customFilters = {}) => {
    try {
      const params = { ...filters, ...customFilters }
      const response = await apiClient.compliance.getStats(params)

      if (response.data.success) {
        setSummary(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching ESG summary:', err)
    }
  }, [filters])

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
