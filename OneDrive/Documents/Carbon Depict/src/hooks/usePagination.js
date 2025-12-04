/**
 * Pagination Hook - Phase 3 Week 11: Frontend State Management
 *
 * Custom hook for managing paginated data with:
 * - Page navigation
 * - Items per page control
 * - Total pages calculation
 * - Pagination metadata
 */
import { useState, useCallback, useMemo } from 'react'

export const usePagination = (initialPage = 1, initialLimit = 20) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)

  /**
   * Calculate pagination metadata
   */
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    const startIndex = (page - 1) * limit
    const endIndex = Math.min(startIndex + limit, total)

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startIndex,
      endIndex,
      currentCount: endIndex - startIndex
    }
  }, [page, limit, total])

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage(prev => prev + 1)
    }
  }, [pagination.hasNextPage])

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPage(prev => prev - 1)
    }
  }, [pagination.hasPrevPage])

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    setPage(1)
  }, [])

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    setPage(pagination.totalPages)
  }, [pagination.totalPages])

  /**
   * Go to specific page
   */
  const goToPage = useCallback((pageNum) => {
    const validPage = Math.max(1, Math.min(pageNum, pagination.totalPages))
    setPage(validPage)
  }, [pagination.totalPages])

  /**
   * Change items per page
   */
  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }, [])

  /**
   * Update total count
   */
  const updateTotal = useCallback((newTotal) => {
    setTotal(newTotal)
  }, [])

  /**
   * Reset pagination
   */
  const reset = useCallback(() => {
    setPage(initialPage)
    setLimit(initialLimit)
    setTotal(0)
  }, [initialPage, initialLimit])

  /**
   * Get page numbers for pagination controls
   */
  const getPageNumbers = useCallback((maxVisible = 5) => {
    const { totalPages } = pagination
    const pages = []

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show limited pages with ellipsis
      const half = Math.floor(maxVisible / 2)
      let start = Math.max(1, page - half)
      let end = Math.min(totalPages, start + maxVisible - 1)

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }

      // Add first page
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('...')
        }
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add last page
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...')
        }
        pages.push(totalPages)
      }
    }

    return pages
  }, [page, pagination])

  /**
   * Calculate offset for API requests
   */
  const getOffset = useCallback(() => {
    return (page - 1) * limit
  }, [page, limit])

  /**
   * Get query params for API requests
   */
  const getQueryParams = useCallback(() => {
    return {
      page,
      limit,
      offset: getOffset()
    }
  }, [page, limit, getOffset])

  return {
    // State
    ...pagination,

    // Actions
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    goToPage,
    changeLimit,
    updateTotal,
    reset,

    // Utilities
    getPageNumbers,
    getOffset,
    getQueryParams,

    // Setters (for manual control)
    setPage,
    setLimit,
    setTotal
  }
}

export default usePagination
