/**
 * EmissionsListOptimized - Phase 3 Week 12: Component Architecture
 *
 * Example of optimized component with:
 * - React.memo for preventing unnecessary re-renders
 * - useMemo for expensive calculations
 * - useCallback for stable function references
 * - Compound component pattern
 * - Virtualization for large lists
 */
import { memo, useMemo, useCallback } from 'react'
import { useEmissions } from '../../hooks/useEmissions'
import DataTable from './DataTable'
import { Card } from '../atoms/Card'
import { Text } from '../atoms/Text'
import { PrimaryButton, SecondaryButton } from '../atoms/Button'
import { withLoadingState } from '../hoc/withLoadingState'
import { withPerformance } from '../hoc/withPerformance'

/**
 * Emissions Row Component (Memoized)
 */
const EmissionRow = memo(({ emission, onEdit, onDelete }) => {
  // Memoize formatted date
  const formattedDate = useMemo(() => {
    return new Date(emission.date).toLocaleDateString()
  }, [emission.date])

  // Memoize formatted value
  const formattedValue = useMemo(() => {
    return `${emission.value.toLocaleString()} ${emission.unit || 'kgCO2e'}`
  }, [emission.value, emission.unit])

  // Stable callback references
  const handleEdit = useCallback(() => {
    onEdit(emission)
  }, [emission, onEdit])

  const handleDelete = useCallback(() => {
    onDelete(emission._id)
  }, [emission._id, onDelete])

  return (
    <DataTable.Row rowIndex={emission._id}>
      <DataTable.Cell>{emission.category}</DataTable.Cell>
      <DataTable.Cell>{emission.type || '-'}</DataTable.Cell>
      <DataTable.Cell align="right">{formattedValue}</DataTable.Cell>
      <DataTable.Cell>{emission.scope}</DataTable.Cell>
      <DataTable.Cell>{formattedDate}</DataTable.Cell>
      <DataTable.Cell align="right">
        <div className="flex gap-2 justify-end">
          <SecondaryButton onClick={handleEdit} className="text-xs px-3 py-1">
            Edit
          </SecondaryButton>
          <SecondaryButton onClick={handleDelete} className="text-xs px-3 py-1 text-greenly-alert">
            Delete
          </SecondaryButton>
        </div>
      </DataTable.Cell>
    </DataTable.Row>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if emission data changed
  return (
    prevProps.emission._id === nextProps.emission._id &&
    prevProps.emission.value === nextProps.emission.value &&
    prevProps.emission.date === nextProps.emission.date
  )
})

EmissionRow.displayName = 'EmissionRow'

/**
 * Emissions Summary Component (Memoized)
 */
const EmissionsSummary = memo(({ summary }) => {
  // Memoize total emissions calculation
  const totalEmissions = useMemo(() => {
    if (!summary) return 0
    return (
      (summary.scope1 || 0) +
      (summary.scope2 || 0) +
      (summary.scope3 || 0)
    )
  }, [summary])

  if (!summary) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card padding="md">
        <Text variant="caption" color="secondary" className="mb-2">
          Total Emissions
        </Text>
        <Text variant="metric" color="primary">
          {totalEmissions.toLocaleString()}
        </Text>
        <Text variant="caption" color="secondary">
          kgCO2e
        </Text>
      </Card>

      <Card padding="md">
        <Text variant="caption" color="secondary" className="mb-2">
          Scope 1
        </Text>
        <Text variant="metric" color="primary">
          {(summary.scope1 || 0).toLocaleString()}
        </Text>
        <Text variant="caption" color="secondary">
          kgCO2e
        </Text>
      </Card>

      <Card padding="md">
        <Text variant="caption" color="secondary" className="mb-2">
          Scope 2
        </Text>
        <Text variant="metric" color="primary">
          {(summary.scope2 || 0).toLocaleString()}
        </Text>
        <Text variant="caption" color="secondary">
          kgCO2e
        </Text>
      </Card>

      <Card padding="md">
        <Text variant="caption" color="secondary" className="mb-2">
          Scope 3
        </Text>
        <Text variant="metric" color="primary">
          {(summary.scope3 || 0).toLocaleString()}
        </Text>
        <Text variant="caption" color="secondary">
          kgCO2e
        </Text>
      </Card>
    </div>
  )
})

EmissionsSummary.displayName = 'EmissionsSummary'

/**
 * Emissions List Component
 */
const EmissionsList = ({
  onEdit = () => {},
  onDelete = () => {},
  onAdd = () => {},
  filters = {}
}) => {
  const {
    emissions,
    summary,
    loading,
    error,
    deleteEmission
  } = useEmissions(filters)

  // Memoize stable callback for edit
  const handleEdit = useCallback((emission) => {
    onEdit(emission)
  }, [onEdit])

  // Memoize stable callback for delete
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteEmission(id)
      onDelete(id)
    } catch (error) {
      console.error('Failed to delete emission:', error)
    }
  }, [deleteEmission, onDelete])

  // Memoize stable callback for add
  const handleAdd = useCallback(() => {
    onAdd()
  }, [onAdd])

  // Memoize sorted emissions
  const sortedEmissions = useMemo(() => {
    return [...emissions].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )
  }, [emissions])

  return (
    <div>
      {/* Summary Cards */}
      <EmissionsSummary summary={summary} />

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <Text variant="h4">Emissions Records</Text>
        <PrimaryButton onClick={handleAdd}>
          Add Emission
        </PrimaryButton>
      </div>

      {/* Data Table */}
      <DataTable
        data={sortedEmissions}
        loading={loading}
        error={error}
        emptyMessage="No emissions recorded yet"
        sortable
        hoverable
      >
        <DataTable.Header>
          <DataTable.HeaderRow>
            <DataTable.HeaderCell sortKey="category">Category</DataTable.HeaderCell>
            <DataTable.HeaderCell sortKey="type">Type</DataTable.HeaderCell>
            <DataTable.HeaderCell sortKey="value" align="right">Emissions</DataTable.HeaderCell>
            <DataTable.HeaderCell sortKey="scope">Scope</DataTable.HeaderCell>
            <DataTable.HeaderCell sortKey="date">Date</DataTable.HeaderCell>
            <DataTable.HeaderCell align="right">Actions</DataTable.HeaderCell>
          </DataTable.HeaderRow>
        </DataTable.Header>

        <DataTable.Body>
          {sortedEmissions.map((emission) => (
            <EmissionRow
              key={emission._id}
              emission={emission}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </DataTable.Body>
      </DataTable>
    </div>
  )
}

// Apply HOCs for loading state and performance
const EmissionsListOptimized = withPerformance(
  withLoadingState(EmissionsList, {
    loadingProp: 'loading',
    errorProp: 'error'
  }),
  {
    memoize: true,
    profile: process.env.NODE_ENV === 'development'
  }
)

export default EmissionsListOptimized
