// Cache bust 2025-12-02
import { useState } from 'react'
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope3Config } from '../../config/dataCollections/scope3'
import { Globe } from 'lucide-react'
import { enterpriseAPI } from '../../services/enterpriseAPI'

export default function Scope3DataCollection() {
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      // Save Scope 3 emissions data
      const response = await enterpriseAPI.emissions.create({
        ...data,
        scope: 'scope3',
        reportingPeriod: data.reportingPeriod || new Date().getFullYear(),
      })

      if (response.data.success) {
        alert('Scope 3 data saved successfully!')
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      console.error('Error saving Scope 3 data:', error)
      alert('Error saving data: ' + (error.response?.data?.error || error.message))
      return { success: false, error: error.message }
    } finally {
      setSaving(false)
    }
  }

  return (
    <DataCollectionTemplate
      {...scope3Config}
      headerIcon={Globe}
      onSave={handleSave}
      saving={saving}
      backLink="/dashboard/emissions"
    />
  )
}
