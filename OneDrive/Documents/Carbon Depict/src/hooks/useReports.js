/**
 * Reports Management Hook - Phase 3 Week 11: Frontend State Management
 *
 * Custom hook for managing ESG reports with:
 * - Report CRUD operations
 * - Report generation from metrics
 * - Publishing workflow
 * - Export functionality
 */
import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/api'

export const useReports = (companyId = null) => {
  const [report, setReport] = useState(null)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  /**
   * Fetch single report by ID
   */
  const fetchReport = useCallback(async (reportId, options = {}) => {
    if (!reportId) return

    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.reports.getById(reportId, options)

      if (response.data.success) {
        setReport(response.data.data)
        return response.data.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch report'
      setError(errorMsg)
      console.error('Error fetching report:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch all reports with filters
   */
  const fetchReports = useCallback(async (filters = {}, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = {
        companyId,
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...options
      }

      const response = await apiClient.reports.getAll(params)

      if (response.data.success) {
        setReports(response.data.data)
        setPagination(response.data.pagination)
        return response.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch reports'
      setError(errorMsg)
      console.error('Error fetching reports:', err)
    } finally {
      setLoading(false)
    }
  }, [companyId, pagination.page, pagination.limit])

  /**
   * Create new report
   */
  const createReport = useCallback(async (data) => {
    setLoading(true)
    setError(null)

    try {
      const reportData = {
        ...data,
        companyId: companyId || data.companyId
      }

      const response = await apiClient.reports.create(reportData)

      if (response.data.success) {
        const newReport = response.data.data
        setReports(prev => [newReport, ...prev])
        return newReport
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [companyId])

  /**
   * Update report
   */
  const updateReport = useCallback(async (reportId, updates) => {
    setLoading(true)
    setError(null)

    // Optimistic update
    const originalReport = report
    if (report && report._id === reportId) {
      setReport({ ...report, ...updates })
    }

    try {
      const response = await apiClient.reports.update(reportId, updates)

      if (response.data.success) {
        const updatedReport = response.data.data
        setReport(updatedReport)
        setReports(prev =>
          prev.map(r => r._id === reportId ? updatedReport : r)
        )
        return updatedReport
      }
    } catch (err) {
      // Rollback on error
      if (originalReport) {
        setReport(originalReport)
      }

      const errorMsg = err.response?.data?.error || 'Failed to update report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [report])

  /**
   * Delete report
   */
  const deleteReport = useCallback(async (reportId) => {
    setLoading(true)
    setError(null)

    const originalReports = reports
    setReports(prev => prev.filter(r => r._id !== reportId))

    try {
      const response = await apiClient.reports.delete(reportId)

      if (response.data.success) {
        if (report && report._id === reportId) {
          setReport(null)
        }
        return response.data
      }
    } catch (err) {
      setReports(originalReports)
      const errorMsg = err.response?.data?.error || 'Failed to delete report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [report, reports])

  /**
   * Generate report data from metrics
   */
  const generateReport = useCallback(async (options = {}) => {
    setGenerating(true)
    setError(null)

    try {
      const params = {
        companyId: companyId || options.companyId,
        reportingPeriod: options.reportingPeriod,
        framework: options.framework
      }

      const response = await apiClient.reports.generate(params)

      if (response.data.success) {
        return response.data.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to generate report'
      setError(errorMsg)
      throw err
    } finally {
      setGenerating(false)
    }
  }, [companyId])

  /**
   * Publish report
   */
  const publishReport = useCallback(async (reportId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.reports.publish(reportId)

      if (response.data.success) {
        const publishedReport = response.data.data

        setReport(publishedReport)
        setReports(prev =>
          prev.map(r => r._id === reportId ? publishedReport : r)
        )

        return publishedReport
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to publish report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Archive report
   */
  const archiveReport = useCallback(async (reportId) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.reports.archive(reportId)

      if (response.data.success) {
        const archivedReport = response.data.data

        setReport(archivedReport)
        setReports(prev =>
          prev.map(r => r._id === reportId ? archivedReport : r)
        )

        return archivedReport
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to archive report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Export report to various formats
   */
  const exportReport = useCallback(async (reportId, format = 'pdf') => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.reports.export(reportId, format, {
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${reportId}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      return true
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to export report'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch reports by company
   */
  const fetchCompanyReports = useCallback(async (compId = companyId, options = {}) => {
    if (!compId) return

    setLoading(true)
    setError(null)

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...options
      }

      const response = await apiClient.reports.getByCompany(compId, params)

      if (response.data.success) {
        setReports(response.data.data)
        setPagination(response.data.pagination)
        return response.data
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch company reports'
      setError(errorMsg)
      console.error('Error fetching company reports:', err)
    } finally {
      setLoading(false)
    }
  }, [companyId, pagination.page, pagination.limit])

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
   * Refresh current data
   */
  const refresh = useCallback(() => {
    if (companyId) {
      fetchCompanyReports()
    } else {
      fetchReports()
    }
  }, [companyId, fetchCompanyReports, fetchReports])

  // Initial fetch
  useEffect(() => {
    if (companyId) {
      fetchCompanyReports()
    }
  }, [companyId, fetchCompanyReports])

  return {
    // State
    report,
    reports,
    loading,
    error,
    generating,
    pagination,

    // Actions
    fetchReport,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    publishReport,
    archiveReport,
    exportReport,
    fetchCompanyReports,
    refresh,

    // Pagination
    nextPage,
    prevPage,
    setPage,
  }
}

export default useReports
