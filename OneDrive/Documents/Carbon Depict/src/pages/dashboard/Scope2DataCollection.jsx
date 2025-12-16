// Enhanced Scope 2 with Full CRUD + Export + Calculations
import { useState, useEffect } from 'react'
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope2Config } from '../../config/dataCollections/scope2'
import { Zap } from 'lucide-react'
import { useESGMetricForm } from '@hooks/useESGMetricForm'

export default function Scope2DataCollection() {
  const [reportingPeriod] = useState(new Date().getFullYear().toString())
  const [existingId, setExistingId] = useState(null)
  const [loadedData, setLoadedData] = useState(null)

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
  } = useESGMetricForm('scope2_emissions', reportingPeriod)

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
        subTopic: 'Scope 2 Emissions',
        metricName: 'Scope 2 Indirect Emissions',
        value: calculateTotalCO2e(formData),
        unit: 'tCO2e',
        reportingPeriod: reportingPeriod,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dataSource: 'Internal Data Collection',
        dataQuality: 'measured',
        methodology: 'GHG Protocol Corporate Standard - Scope 2 Indirect Emissions',
        sourceType: 'scope2',
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
        alert('Scope 2 data saved successfully!')
        await refetch()
        return { success: true, data: result.data }
      } else {
        alert('Error saving data: ' + (result.error || 'Unknown error'))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error saving Scope 2 data:', error)
      alert('Error saving data: ' + error.message)
      return { success: false, error: error.message }
    }
  }

  const handleDelete = async () => {
    if (!existingId) return

    if (confirm('Are you sure you want to delete all Scope 2 data? This cannot be undone.')) {
      const result = await deleteMetric(existingId)
      if (result.success) {
        alert('Scope 2 data deleted successfully')
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

  const calculateTotalCO2e = (formData) => {
    let total = 0
    Object.values(formData).forEach(category => {
      Object.values(category).forEach(field => {
        if (field.value && !isNaN(field.value)) {
          total += parseFloat(field.value) * 0.15 // Placeholder grid factor
        }
      })
    })
    return total
  }

  const calculateBreakdown = (formData) => {
    const breakdown = {}
    Object.keys(formData).forEach(category => {
      breakdown[category] = 0
      Object.values(formData[category]).forEach(field => {
        if (field.value && !isNaN(field.value)) {
          breakdown[category] += parseFloat(field.value) * 0.15
        }
      })
    })
    return breakdown
  }

  return (
    <DataCollectionTemplate
      {...scope2Config}
      headerIcon={Zap}
      initialData={loadedData || scope2Config.initialData}
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
