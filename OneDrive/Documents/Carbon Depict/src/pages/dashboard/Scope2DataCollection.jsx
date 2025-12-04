// Cache bust 2025-12-02
import { useState } from 'react'
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope2Config } from '../../config/dataCollections/scope2'
import { Zap } from 'lucide-react'
import { enterpriseAPI } from '../../services/enterpriseAPI'

export default function Scope2DataCollection() {
  const [saving, setSaving] = useState(false)

  const handleSave = async (data) => {
    setSaving(true)
    try {
      // Save Scope 2 emissions data
      const response = await enterpriseAPI.emissions.create({
        ...data,
        scope: 'scope2',
        reportingPeriod: data.reportingPeriod || new Date().getFullYear(),
      })

      if (response.data.success) {
        alert('Scope 2 data saved successfully!')
        return { success: true, data: response.data.data }
      }
    } catch (error) {
      console.error('Error saving Scope 2 data:', error)
      alert('Error saving data: ' + (error.response?.data?.error || error.message))
      return { success: false, error: error.message }
    } finally {
      setSaving(false)
    }
  }

  return (
    <DataCollectionTemplate
      {...scope2Config}
      headerIcon={Zap}
      onSave={handleSave}
      saving={saving}
      backLink="/dashboard/emissions"
    />
  )
}
