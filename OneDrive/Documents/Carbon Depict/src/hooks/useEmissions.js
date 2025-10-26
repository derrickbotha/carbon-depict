import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/api'

/**
 * Hook for managing emissions data
 */
export const useEmissions = (filters = {}) => {
  const [emissions, setEmissions] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    pages: 0
  })

  /**
   * Fetch emissions data
   */
  const fetchEmissions = useCallback(async (customFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = { ...filters, ...customFilters, ...pagination }
      const response = await apiClient.emissions.getAll(params)

      if (response.data.success) {
        setEmissions(response.data.data)
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          pages: response.data.pages,
        }))
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch emissions')
      console.error('Error fetching emissions:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  /**
   * Fetch emissions summary
   */
  const fetchSummary = useCallback(async (customFilters = {}) => {
    try {
      const params = { ...filters, ...customFilters }
      const response = await apiClient.emissions.getSummary(params)

      if (response.data.success) {
        setSummary(response.data.data)
      }
    } catch (err) {
      console.error('Error fetching emissions summary:', err)
    }
  }, [filters])

  /**
   * Create new emission record
   */
  const createEmission = async (data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.create(data)

      if (response.data.success) {
        setEmissions(prev => [response.data.data, ...prev])
        await fetchSummary()
        return response.data.data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create emission')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update emission record
   */
  const updateEmission = async (id, data) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.update(id, data)

      if (response.data.success) {
        setEmissions(prev =>
          prev.map(e => e._id === id ? response.data.data : e)
        )
        await fetchSummary()
        return response.data.data
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update emission')
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete emission record
   */
  const deleteEmission = async (id) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.emissions.delete(id)

      if (response.data.success) {
        setEmissions(prev => prev.filter(e => e._id !== id))
        await fetchSummary()
      }
    } catch (err) {
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
        await fetchEmissions()
        await fetchSummary()
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

  // Initial fetch
  useEffect(() => {
    fetchEmissions()
    fetchSummary()
  }, [fetchEmissions, fetchSummary])

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
  }
}

export default useEmissions
