// Enhanced Scope 3 with Full CRUD + Export + Dedicated Model
import { useState, useEffect } from 'react'
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope3Config } from '../../config/dataCollections/scope3'
import { Globe } from 'lucide-react'
import { useDedicatedModelForm } from '@hooks/useDedicatedModelForm'

export default function Scope3DataCollection() {
  const [reportingPeriod] = useState(new Date().getFullYear().toString())
  const [existingId, setExistingId] = useState(null)
  const [loadedData, setLoadedData] = useState(null)

  // Use dedicated Scope3Emission model
  const {
    data: emissions,
    loading,
    saving,
    error,
    createResource,
    updateResource,
    deleteResource,
    exportData,
    refetch
  } = useDedicatedModelForm('/api/scope3', reportingPeriod, false)

  useEffect(() => {
    if (emissions && emissions.length > 0) {
      const latestEmission = emissions[0]
      setExistingId(latestEmission._id)
      if (latestEmission.activityData) {
        setLoadedData(latestEmission.activityData)
      }
    }
  }, [emissions])

  const handleSave = async (formData) => {
    try {
      // Calculate total CO2e from all form data
      const totalCO2e = calculateTotalCO2e(formData)

      // Prepare Scope3Emission data matching the model schema
      const scope3Data = {
        // Required fields
        reportingPeriod,
        category: 'business_travel', // Default category (can be made dynamic later)
        categoryName: 'Scope 3 Value Chain Emissions',
        activityData: {
          description: 'Scope 3 value chain emissions across all categories',
          quantity: totalCO2e,
          unit: 'tCO2e',
          source: 'Internal Data Collection',
          dataCollectionMethod: 'Activity-based calculation'
        },
        calculationMethod: 'average_data', // Valid enum value
        emissionFactor: 0.2, // Placeholder emission factor
        emissionFactorSource: 'GHG Protocol Scope 3 Standard',
        co2e: totalCO2e, // Required field for total emissions

        // Optional but recommended fields
        dataQuality: 'medium',
        dataQualityScore: 3,
        verificationStatus: 'unverified',
        primaryData: false,

        // Additional metadata
        metadata: {
          calculationDate: new Date().toISOString(),
          formData,
          categoryBreakdown: calculateBreakdown(formData)
        },

        notes: 'Comprehensive Scope 3 emissions data collection'
      }

      let result
      if (existingId) {
        result = await updateResource(existingId, scope3Data)
      } else {
        result = await createResource(scope3Data)
        if (result.success && result.data._id) {
          setExistingId(result.data._id)
        }
      }

      if (result.success) {
        alert('Scope 3 data saved successfully!')
        await refetch()
        return { success: true, data: result.data }
      } else {
        alert('Error saving data: ' + (result.error || 'Unknown error'))
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error saving Scope 3 data:', error)
      alert('Error saving data: ' + error.message)
      return { success: false, error: error.message }
    }
  }

  const handleDelete = async () => {
    if (!existingId) return

    if (confirm('Are you sure you want to delete all Scope 3 data? This cannot be undone.')) {
      const result = await deleteResource(existingId)
      if (result.success) {
        alert('Scope 3 data deleted successfully')
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
          total += parseFloat(field.value) * 0.2 // Placeholder factor
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
          breakdown[category] += parseFloat(field.value) * 0.2
        }
      })
    })
    return breakdown
  }

  return (
    <DataCollectionTemplate
      {...scope3Config}
      headerIcon={Globe}
      initialData={loadedData || scope3Config.initialData}
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
