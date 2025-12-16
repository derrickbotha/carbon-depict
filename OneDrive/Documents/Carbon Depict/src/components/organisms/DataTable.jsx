/**
 * DataTable Component - Phase 3 Week 12: Component Architecture
 *
 * Compound component pattern to eliminate prop drilling:
 * - Context-based state sharing
 * - Flexible composition
 * - Performance optimized with memo and useMemo
 * - Sorting, filtering, pagination support
 */
import { memo, createContext, useContext, useMemo, useCallback, useState } from 'react'
import clsx from 'clsx'
import { ChevronUp, ChevronDown, ChevronUpDown } from 'lucide-react'

// DataTable Context
const DataTableContext = createContext(null)

const useDataTable = () => {
  const context = useContext(DataTableContext)
  if (!context) {
    throw new Error('DataTable components must be used within DataTable')
  }
  return context
}

/**
 * Main DataTable Component
 */
export const DataTable = memo(({
  data = [],
  children,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  sortable = true,
  hoverable = true,
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [selectedRows, setSelectedRows] = useState(new Set())

  // Memoized sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortable) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [data, sortConfig, sortable])

  // Handle sort
  const handleSort = useCallback((key) => {
    if (!sortable) return

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [sortable])

  // Handle row selection
  const toggleRowSelection = useCallback((rowId) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(rowId)) {
        newSet.delete(rowId)
      } else {
        newSet.add(rowId)
      }
      return newSet
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(data.map((_, index) => index)))
    }
  }, [data, selectedRows.size])

  const contextValue = useMemo(() => ({
    data: sortedData,
    sortConfig,
    handleSort,
    selectedRows,
    toggleRowSelection,
    toggleAllRows,
    onRowClick,
    loading,
    hoverable
  }), [sortedData, sortConfig, handleSort, selectedRows, toggleRowSelection, toggleAllRows, onRowClick, loading, hoverable])

  if (loading) {
    return (
      <div className={clsx('rounded-lg border border-greenly-light overflow-hidden', className)}>
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-greenly-primary border-r-transparent" />
          <p className="mt-4 text-sm text-greenly-gray">Loading...</p>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={clsx('rounded-lg border border-greenly-light overflow-hidden', className)}>
        <div className="p-8 text-center">
          <p className="text-sm text-greenly-gray">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={clsx('rounded-lg border border-greenly-light overflow-hidden', className)} {...props}>
        <div className="overflow-x-auto">
          <table className="w-full">
            {children}
          </table>
        </div>
      </div>
    </DataTableContext.Provider>
  )
})

DataTable.displayName = 'DataTable'

/**
 * Table Header
 */
export const TableHeader = memo(({ children }) => {
  return (
    <thead className="bg-greenly-light/50 border-b border-greenly-light">
      {children}
    </thead>
  )
})

TableHeader.displayName = 'TableHeader'

/**
 * Table Header Row
 */
export const TableHeaderRow = memo(({ children }) => {
  return (
    <tr>
      {children}
    </tr>
  )
})

TableHeaderRow.displayName = 'TableHeaderRow'

/**
 * Table Header Cell
 */
export const TableHeaderCell = memo(({
  children,
  sortKey,
  align = 'left',
  className = '',
  ...props
}) => {
  const { sortConfig, handleSort } = useDataTable()

  const isSortable = !!sortKey
  const isSorted = sortConfig.key === sortKey
  const direction = isSorted ? sortConfig.direction : null

  const handleClick = useCallback(() => {
    if (isSortable) {
      handleSort(sortKey)
    }
  }, [isSortable, handleSort, sortKey])

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <th
      onClick={handleClick}
      className={clsx(
        'px-6 py-3 text-xs font-medium text-greenly-gray uppercase tracking-wider',
        alignClasses[align],
        isSortable && 'cursor-pointer hover:bg-greenly-light/70 select-none',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {isSortable && (
          <span className="flex-shrink-0">
            {!isSorted && <ChevronUpDown className="h-4 w-4 text-greenly-gray/50" />}
            {isSorted && direction === 'asc' && <ChevronUp className="h-4 w-4 text-greenly-primary" />}
            {isSorted && direction === 'desc' && <ChevronDown className="h-4 w-4 text-greenly-primary" />}
          </span>
        )}
      </div>
    </th>
  )
})

TableHeaderCell.displayName = 'TableHeaderCell'

/**
 * Table Body
 */
export const TableBody = memo(({ children }) => {
  return (
    <tbody className="bg-white divide-y divide-greenly-light">
      {children}
    </tbody>
  )
})

TableBody.displayName = 'TableBody'

/**
 * Table Row
 */
export const TableRow = memo(({
  children,
  rowIndex,
  onClick,
  className = '',
  ...props
}) => {
  const { onRowClick, hoverable, selectedRows, toggleRowSelection } = useDataTable()

  const isSelected = selectedRows.has(rowIndex)
  const isClickable = !!onClick || !!onRowClick

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()
    } else if (onRowClick) {
      onRowClick(rowIndex)
    }
  }, [onClick, onRowClick, rowIndex])

  return (
    <tr
      onClick={handleClick}
      className={clsx(
        hoverable && 'hover:bg-greenly-light/30',
        isClickable && 'cursor-pointer',
        isSelected && 'bg-greenly-primary/10',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
})

TableRow.displayName = 'TableRow'

/**
 * Table Cell
 */
export const TableCell = memo(({
  children,
  align = 'left',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <td
      className={clsx(
        'px-6 py-4 text-sm text-greenly-charcoal',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
})

TableCell.displayName = 'TableCell'

/**
 * Table Footer (for pagination, etc.)
 */
export const TableFooter = memo(({ children, className = '' }) => {
  return (
    <div className={clsx('px-6 py-4 bg-greenly-light/30 border-t border-greenly-light', className)}>
      {children}
    </div>
  )
})

TableFooter.displayName = 'TableFooter'

/**
 * Compound DataTable with all sub-components
 */
DataTable.Header = TableHeader
DataTable.HeaderRow = TableHeaderRow
DataTable.HeaderCell = TableHeaderCell
DataTable.Body = TableBody
DataTable.Row = TableRow
DataTable.Cell = TableCell
DataTable.Footer = TableFooter

export default DataTable
