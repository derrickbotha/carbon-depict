// Cache bust 2025-12-02
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope2Config } from '../../config/dataCollections/scope2'
import { Zap } from 'lucide-react'

export default function Scope2DataCollection() {
  const handleSave = (data) => {
    console.log('Saving Scope 2 data:', data)
    // TODO: Implement API call
    alert('Data saved! (API integration pending)')
  }

  return (
    <DataCollectionTemplate
      {...scope2Config}
      headerIcon={Zap}
      onSave={handleSave}
      backLink="/dashboard/emissions"
    />
  )
}
