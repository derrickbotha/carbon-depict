// Enhanced Scope 1 with Full CRUD + Export + Calculations
import { useState, useEffect } from 'react'
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope1Config } from '../../config/dataCollections/scope1'
import { useESGMetricForm } from '@hooks/useESGMetricForm'

export default function Scope1DataCollection() {
  const [reportingPeriod] = useState(new Date().getFullYear().toString())
  const [existingId, setExistingId] = useState(null)
  const [loadedData, setLoadedData] = useState(null)

  // Use the ESGMetric hook for full CRUD
  const {
    data: metrics,
    loading,
    saving,
    error,
    createMetric,
    updateMetric,
    deleteMetric,
    exportData,
    refetch
  } = useESGMetricForm('scope1_emissions', reportingPeriod)

  // Load existing Scope 1 data on mount
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0]
      setExistingId(latestMetric._id)
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setLoadedData(latestMetric.metadata.formData)
      }
    }
  }, [metrics])

  const handleSave = async (formData) => {
    try {
      // Calculate start and end dates for the reporting period
      const year = parseInt(reportingPeriod)
      const startDate = new Date(year, 0, 1) // January 1st
      const endDate = new Date(year, 11, 31, 23, 59, 59) // December 31st

      const metricData = {
        // Required fields for ESGMetric
        framework: 'GHG_PROTOCOL',
        pillar: 'environmental',
        topic: 'Climate Change',
        subTopic: 'Scope 1 Emissions',
        metricName: 'Scope 1 Direct Emissions',
        value: calculateTotalCO2e(formData), // Calculate total CO2e
        unit: 'tCO2e',
        reportingPeriod: reportingPeriod,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dataSource: 'Internal Data Collection',
        dataQuality: 'measured',
        methodology: 'GHG Protocol Corporate Standard - Scope 1 Direct Emissions',
        sourceType: 'scope1',
        metadata: {
          formData,
          breakdown: calculateBreakdown(formData),
          calculationDate: new Date().toISOString()
        },
        status: 'draft'
      }

      let result
      if (existingId) {
        result = await updateMetric(existingId, metricData)
      } else {
        result = await createMetric(metricData)
        if (result.success && result.data._id) {
          setExistingId(result.data._id)
        }
      }

      if (result.success) {
        alert('Scope 1 data saved successfully!')
        await refetch()
        return { success: true, data: result.data }
      } else {
        alert('Error saving data: ' + (result.error || 'Unknown error'))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error saving Scope 1 data:', error)
      alert('Error saving data: ' + error.message)
      return { success: false, error: error.message }
    }
  }

  const handleDelete = async () => {
    if (!existingId) return

    if (confirm('Are you sure you want to delete all Scope 1 data? This cannot be undone.')) {
      const result = await deleteMetric(existingId)
      if (result.success) {
        alert('Scope 1 data deleted successfully')
        setExistingId(null)
        setLoadedData(null)
        await refetch()
      } else {
        alert('Error deleting data: ' + (result.error || 'Unknown error'))
      }
    }
  }

  const handleExport = async (format) => {
    try {
      await exportData(format)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed: ' + error.message)
    }
  }

  // Simple CO2e calculation (placeholder - will enhance later)
  const calculateTotalCO2e = (formData) => {
    // This is a simplified calculation
    // In production, use actual DEFRA emission factors
    let total = 0
    Object.values(formData).forEach(category => {
      Object.values(category).forEach(field => {
        if (field.value && !isNaN(field.value)) {
          total += parseFloat(field.value) * 0.1 // Placeholder factor
        }
      })
    })
    return total
  }

  const calculateBreakdown = (formData) => {
    return {
      stationaryCombustion: calculateCategoryCO2e(formData.stationaryCombustion),
      mobileCombustion: calculateCategoryCO2e(formData.mobileCombustion),
      processEmissions: calculateCategoryCO2e(formData.processEmissions),
      fugitiveEmissions: calculateCategoryCO2e(formData.fugitiveEmissions)
    }
  }

  const calculateCategoryCO2e = (categoryData) => {
    let total = 0
    if (categoryData) {
      Object.values(categoryData).forEach(field => {
        if (field.value && !isNaN(field.value)) {
          total += parseFloat(field.value) * 0.1 // Placeholder
        }
      })
    }
    return total
  }

  return (
    <DataCollectionTemplate
      {...scope1Config}
      initialData={loadedData || scope1Config.initialData}
      onSave={handleSave}
      onDelete={existingId ? handleDelete : null}
      onExport={handleExport}
      saving={saving}
      loading={loading}
      existingId={existingId}
      backLink="/dashboard/emissions"
    />
  )
}
