// Cache bust 2025-12-02
import DataCollectionTemplate from '../../components/templates/DataCollectionTemplate'
import { scope1Config } from '../../config/dataCollections/scope1'

export default function Scope1DataCollection() {
  const handleSave = (data) => {
    console.log('Saving Scope 1 data:', data)
    // TODO: Implement API call
    alert('Data saved! (API integration pending)')
  }

  return (
    <DataCollectionTemplate
      {...scope1Config}
      onSave={handleSave}
      backLink="/dashboard/emissions"
    />
  )
}
