// Cache bust 2025-12-02
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope3Config } from '../../config/dataCollections/scope3'
import { Globe } from 'lucide-react'

export default function Scope3DataCollection() {
  const handleSave = (data) => {
    console.log('Saving Scope 3 data:', data)
    // TODO: Implement API call
    alert('Data saved! (API integration pending)')
  }

  return (
    <DataCollectionTemplate
      {...scope3Config}
      headerIcon={Globe}
      onSave={handleSave}
      backLink="/dashboard/emissions"
    />
  )
}
