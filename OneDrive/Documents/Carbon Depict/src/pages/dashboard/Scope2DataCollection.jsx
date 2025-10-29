// Cache bust 2025-10-23
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, CheckCircle2, Circle, AlertCircle, Info } from '@atoms/Icon'
import { enterpriseAPI } from '../../services/enterpriseAPI'
import DataEntryManager from '../../components/molecules/DataEntryManager'

export default function Scope2DataCollection() {
  const [currentCategory, setCurrentCategory] = useState('purchasedElectricity')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')
  const [formData, setFormData] = useState({
    // Purchased Electricity - IMPROVED FOR GHG PROTOCOL DUAL REPORTING
    purchasedElectricity: {
      consumption: { name: 'Total Electricity Consumption (kWh)', value: '', unit: 'kWh', completed: false },
      region: { name: 'Region', value: 'uk', unit: 'select', options: ['uk', 'eu', 'us', 'china', 'india', 'global'], completed: false },
      method: { name: 'Calculation Method', value: 'location', unit: 'select', options: ['location', 'market'], completed: false },
      supplierName: { name: 'Electricity Supplier', value: '', unit: 'text', completed: false },
      // Certificate fields for market-based method
      certificateValid: { name: 'Certificate Valid?', value: 'false', unit: 'boolean', completed: false },
      certificateRetired: { name: 'Certificate Retired?', value: 'false', unit: 'boolean', completed: false },
      certificateFactor: { name: 'Certificate Factor (kgCO2e/kWh)', value: '', unit: 'number', completed: false },
      certificateSource: { name: 'Certificate Source', value: '', unit: 'text', completed: false },
    },
    // Purchased Heat/Steam (4 fields)
    purchasedHeat: {
      'district-heating': { name: 'District Heating (kWh)', value: '', unit: 'kWh', completed: false },
      'purchased-steam': { name: 'Purchased Steam (kWh)', value: '', unit: 'kWh', completed: false },
      'biomass-heating': { name: 'Biomass District Heating (kWh)', value: '', unit: 'kWh', completed: false },
      'heat-supplier': { name: 'Heat/Steam Supplier', value: '', unit: 'text', completed: false },
    },
    // Purchased Cooling (3 fields)
    purchasedCooling: {
      'district-cooling': { name: 'District Cooling (kWh)', value: '', unit: 'kWh', completed: false },
      'chilled-water': { name: 'Chilled Water (kWh)', value: '', unit: 'kWh', completed: false },
      'cooling-supplier': { name: 'Cooling Supplier', value: '', unit: 'text', completed: false },
    },
    // Transmission & Distribution Losses (2 fields)
    transmissionLosses: {
      'td-losses-electricity': { name: 'T&D Losses - Electricity (kWh)', value: '', unit: 'kWh', completed: false },
      'td-losses-heat': { name: 'T&D Losses - Heat (kWh)', value: '', unit: 'kWh', completed: false },
    },
  })

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        setIsLoading(true)
        const response = await enterpriseAPI.emissions.getByCategory('scope2', new Date().getFullYear().toString())
        
        if (response.data.success && response.data.data) {
          const savedData = response.data.data
          
          // Merge saved data with form structure
          setFormData(prev => {
            const mergedData = { ...prev }
            
            Object.keys(savedData).forEach(category => {
              if (mergedData[category]) {
                Object.keys(savedData[category]).forEach(fieldKey => {
                  if (mergedData[category][fieldKey]) {
                    mergedData[category][fieldKey] = {
                      ...mergedData[category][fieldKey],
                      value: savedData[category][fieldKey].value,
                      completed: savedData[category][fieldKey].completed
                    }
                  }
                })
              }
            })
            
            return mergedData
          })
        }
      } catch (error) {
        console.error('Error loading saved data:', error)
        // Don't show error to user, just continue with empty form
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedData()
  }, [])

  const handleInputChange = (category, fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [fieldKey]: {
          ...prev[category][fieldKey],
          value: value,
          completed: value && String(value).trim() !== '',
        },
      },
    }))
  }

  const handleCalculateEmissions = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await enterpriseAPI.emissions.calculateAndSave(
        formData,
        'scope2',
        new Date().getFullYear().toString()
      )
      
      if (response.data.success) {
        const { totalEmissions, calculations, errors } = response.data.data
        
        if (errors.length > 0) {
          setSaveMessage(`⚠️ Calculated ${calculations.length} emissions (${errors.length} errors). Total: ${totalEmissions} kg CO2e`)
        } else {
          setSaveMessage(`✅ Successfully calculated ${calculations.length} emissions! Total: ${totalEmissions} kg CO2e`)
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSaveMessage('')
        }, 5000)
      } else {
        setSaveMessage('❌ Failed to calculate emissions. Please try again.')
      }
    } catch (error) {
      console.error('Calculation error:', error)
      setSaveMessage(`❌ Error calculating emissions: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveProgress = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      const response = await enterpriseAPI.emissions.bulkSave(
        formData,
        'scope2',
        new Date().getFullYear().toString()
      )
      
      if (response.data.success) {
        setSaveMessage(`✅ Successfully saved ${response.data.count} emission records!`)
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveMessage('')
        }, 3000)
      } else {
        setSaveMessage('❌ Failed to save data. Please try again.')
      }
    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage(`❌ Error saving data: ${error.response?.data?.error || error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const calculateCategoryProgress = (category) => {
    const fields = Object.values(formData[category])
    const completedFields = fields.filter((f) => f.completed).length
    return fields.length > 0 ? Math.round((completedFields / fields.length) * 100) : 0
  }

  const totalProgress = useMemo(() => {
    let totalFields = 0
    let completedFields = 0
    Object.values(formData).forEach((category) => {
      const fields = Object.values(category)
      totalFields += fields.length
      completedFields += fields.filter((f) => f.completed).length
    })
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
  }, [formData])

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-cd-mint'
    if (progress >= 50) return 'bg-cd-teal'
    if (progress >= 25) return 'bg-cd-cedar'
    return 'bg-gray-300'
  }

  const categories = [
    {
      id: 'purchasedElectricity',
      name: 'Purchased Electricity',
      description: 'Electricity purchased from the grid or suppliers',
      icon: '⚡',
      fields: 6,
    },
    {
      id: 'purchasedHeat',
      name: 'Purchased Heat/Steam',
      description: 'Heat or steam purchased from district systems or suppliers',
      icon: '♨️',
      fields: 4,
    },
    {
      id: 'purchasedCooling',
      name: 'Purchased Cooling',
      description: 'Cooling purchased from district cooling systems',
      icon: '❄️',
      fields: 3,
    },
    {
      id: 'transmissionLosses',
      name: 'T&D Losses',
      description: 'Transmission and distribution losses (optional)',
      icon: '🔌',
      fields: 2,
    },
  ]

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/emissions"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cd-border bg-white text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-midnight"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-6 w-6 text-cd-teal" strokeWidth={2} />
              <span className="text-sm font-semibold text-cd-teal">SCOPE 2</span>
            </div>
            <h1 className="text-3xl font-bold text-cd-text">Energy Indirect Emissions Data Collection</h1>
            <p className="text-cd-muted">
              Enter emissions from purchased electricity, heat, steam, and cooling
            </p>
          </div>
        </div>
      </div>

      {/* Data Entry Manager */}
      <DataEntryManager
        formType="emissions"
        scope="scope2"
        formData={formData}
        setFormData={setFormData}
        onSave={handleCalculateEmissions}
        isLoading={isSaving}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cd-teal mx-auto mb-4"></div>
            <p className="text-cd-muted">Loading saved data...</p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Overall Progress */}
      <div className="rounded-lg border border-cd-teal/20 bg-white p-6 shadow-cd-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cd-text">Overall Progress</h3>
            <p className="text-sm text-cd-muted">15 total fields across 4 categories</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cd-teal">{totalProgress}%</div>
            <div className="text-sm text-cd-muted">Complete</div>
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(totalProgress)}`}
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-cd-muted">
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
          <span>
            {Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter((f) => f.completed).length, 0)} of 15 fields completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar - Category Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-cd-muted">
              Categories
            </h3>
            {categories.map((cat) => {
              const progress = calculateCategoryProgress(cat.id)
              const isActive = currentCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentCategory(cat.id)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    isActive
                      ? 'border-cd-teal bg-cd-teal text-white shadow-cd-md'
                      : 'border-cd-border bg-white text-cd-text hover:border-cd-teal/30 hover:shadow-cd-sm'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-cd-teal'}`}>
                      {progress}%
                    </span>
                  </div>
                  <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>
                    {cat.name}
                  </div>
                  <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>
                    {cat.fields} fields
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                    <div
                      className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-cd-teal'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              )
            })}

            {/* Location vs Market-Based Info */}
            <div className="mt-6 rounded-lg border border-cd-teal/20 bg-cd-teal/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cd-midnight">
                <Info className="h-4 w-4" strokeWidth={2} />
                Dual Reporting
              </div>
              <p className="text-xs text-cd-muted">
                GHG Protocol requires both location-based (grid average) and market-based (supplier-specific) methods.
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
            {/* Category Header */}
            <div className="mb-6 border-b border-cd-border pb-4">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-3xl">{currentCategoryData.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-cd-text">{currentCategoryData.name}</h2>
                  <p className="text-sm text-cd-muted">{currentCategoryData.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-cd-muted">
                <AlertCircle className="h-4 w-4" strokeWidth={2} />
                <span>Refer to your utility bills or energy invoices for consumption data</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {Object.entries(formData[currentCategory]).map(([fieldKey, field]) => (
                <div key={fieldKey} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {field.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-cd-mint" strokeWidth={2} />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-medium text-cd-text">
                      {field.name}
                    </label>
                    <div className="flex gap-2">
                      {field.unit === 'text' ? (
                        <input
                          id={`${currentCategory}-${fieldKey}`}
                          name={`${currentCategory}-${fieldKey}`}
                          type="text"
                          value={field.value}
                          onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                          className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                          placeholder="Enter supplier name"
                        />
                      ) : field.unit === 'select' ? (
                        <select
                          value={field.value}
                          onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                          className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                        >
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      ) : field.unit === 'boolean' ? (
                        <select
                          value={field.value}
                          onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                          className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      ) : (
                        <>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.value}
                            onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                            className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                            placeholder={`Enter amount in ${field.unit}`}
                          />
                          <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                            {field.unit}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category-Specific Guidance */}
            {currentCategory === 'purchasedElectricity' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" strokeWidth={2} />
                  Purchased Electricity Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• <strong>Location-based:</strong> Uses average grid emission factor for your region</li>
                  <li>• <strong>Market-based:</strong> Uses supplier-specific emission factor or renewable tariff</li>
                  <li>• If on a 100% renewable tariff, enter kWh in "Renewable Tariff" field</li>
                  <li>• Green certificates (RECs, GOs) reduce market-based emissions to zero for certified kWh</li>
                  <li>• Most organizations report both methods for transparency</li>
                  <li>• Check your electricity bill for kWh consumed (usually monthly or quarterly)</li>
                </ul>
              </div>
            )}

            {currentCategory === 'purchasedHeat' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" strokeWidth={2} />
                  Purchased Heat/Steam Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• District heating systems provide heat to multiple buildings from a central source</li>
                  <li>• Check invoices from your district heating/steam provider</li>
                  <li>• Heat is typically measured in kWh or GJ (gigajoules)</li>
                  <li>• Biomass district heating has lower emission factors than fossil fuel systems</li>
                  <li>• If you generate your own heat, that's Scope 1 (not Scope 2)</li>
                </ul>
              </div>
            )}

            {currentCategory === 'purchasedCooling' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" strokeWidth={2} />
                  Purchased Cooling Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• District cooling systems provide chilled water for air conditioning</li>
                  <li>• Common in hot climates and dense urban areas</li>
                  <li>• Check your cooling provider's invoices for kWh or cooling tons</li>
                  <li>• If you use on-site chillers with purchased electricity, that's already in "Purchased Electricity"</li>
                  <li>• Only include if you purchase cooling as a service (not electricity to run your own AC)</li>
                </ul>
              </div>
            )}

            {currentCategory === 'transmissionLosses' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" strokeWidth={2} />
                  Transmission & Distribution Losses Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• T&D losses account for electricity lost during transmission from power plant to your site</li>
                  <li>• GHG Protocol allows (but doesn't require) reporting T&D losses separately</li>
                  <li>• DEFRA provides T&D loss factors (typically ~5-10% of purchased electricity)</li>
                  <li>• Simply enter the same kWh as "Purchased Electricity" - system will apply loss factors</li>
                  <li>• This is optional but recommended for comprehensive Scope 2 reporting</li>
                </ul>
              </div>
            )}

            {/* Save Message */}
            {saveMessage && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                saveMessage.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {saveMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
              <button
                className="flex-1 rounded-lg bg-cd-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-cd-teal/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={handleSaveProgress}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Progress'}
              </button>
              <button
                className="flex-1 rounded-lg border border-cd-border bg-white px-6 py-3 font-semibold text-cd-teal transition-colors hover:bg-cd-surface disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={handleCalculateEmissions}
                disabled={isSaving}
              >
                {isSaving ? 'Calculating...' : 'Calculate Emissions'}
              </button>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
