// Cache bust 2025-10-23
import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Globe, CheckCircle2, Circle, AlertCircle, Info } from '@atoms/Icon'
import { enterpriseAPI } from '../../services/enterpriseAPI'
import DataEntryManager from '../../components/molecules/DataEntryManager'

export default function Scope3DataCollection() {
  const [currentCategory, setCurrentCategory] = useState('purchasedGoodsServices')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')
  const [formData, setFormData] = useState({
    // Category 1: Purchased Goods & Services (5 fields)
    purchasedGoodsServices: {
      'raw-materials-spend': { name: 'Raw Materials (£)', value: '', unit: '£', completed: false },
      'packaging-materials': { name: 'Packaging Materials (£)', value: '', unit: '£', completed: false },
      'professional-services': { name: 'Professional Services (£)', value: '', unit: '£', completed: false },
      'it-equipment': { name: 'IT Equipment (£)', value: '', unit: '£', completed: false },
      'office-supplies': { name: 'Office Supplies (£)', value: '', unit: '£', completed: false },
    },
    // Category 2: Transportation & Distribution (4 fields)
    transportationDistribution: {
      'supplier-deliveries-km': { name: 'Supplier Deliveries (tonne-km)', value: '', unit: 'tonne-km', completed: false },
      'inbound-freight': { name: 'Inbound Freight (£)', value: '', unit: '£', completed: false },
      'courier-services': { name: 'Courier Services (£)', value: '', unit: '£', completed: false },
      'shipping-containers': { name: 'Shipping Containers (number)', value: '', unit: 'containers', completed: false },
    },
    // Category 3: Waste Disposal (4 fields)
    wasteDisposal: {
      'general-waste': { name: 'General Waste (tonnes)', value: '', unit: 'tonnes', completed: false },
      'recyclable-waste': { name: 'Recyclable Waste (tonnes)', value: '', unit: 'tonnes', completed: false },
      'hazardous-waste': { name: 'Hazardous Waste (tonnes)', value: '', unit: 'tonnes', completed: false },
      'food-waste': { name: 'Food Waste (tonnes)', value: '', unit: 'tonnes', completed: false },
    },
    // Category 6: Business Travel - IMPROVED WITH AIR TRAVEL CLASSES
    businessTravel: {
      // Domestic air travel
      'air-domestic-economy': { name: 'Air Travel - Domestic Economy (km)', value: '', unit: 'km', completed: false },
      'air-domestic-business': { name: 'Air Travel - Domestic Business (km)', value: '', unit: 'km', completed: false },
      // Short haul (<3700km)
      'air-short-haul-economy': { name: 'Air Travel - Short Haul Economy (km)', value: '', unit: 'km', completed: false },
      'air-short-haul-business': { name: 'Air Travel - Short Haul Business (km)', value: '', unit: 'km', completed: false },
      // Long haul (>3700km)
      'air-long-haul-economy': { name: 'Air Travel - Long Haul Economy (km)', value: '', unit: 'km', completed: false },
      'air-long-haul-premium': { name: 'Air Travel - Long Haul Premium (km)', value: '', unit: 'km', completed: false },
      'air-long-haul-business': { name: 'Air Travel - Long Haul Business (km)', value: '', unit: 'km', completed: false },
      'air-long-haul-first': { name: 'Air Travel - Long Haul First (km)', value: '', unit: 'km', completed: false },
      // Other travel
      'rail-travel': { name: 'Rail Travel (km)', value: '', unit: 'km', completed: false },
      'hotel-nights': { name: 'Hotel Nights (number)', value: '', unit: 'nights', completed: false },
    },
    // Category 7: Employee Commuting (4 fields)
    employeeCommuting: {
      'employee-car': { name: 'Employee Car Commute (km)', value: '', unit: 'km', completed: false },
      'employee-train': { name: 'Employee Train Commute (km)', value: '', unit: 'km', completed: false },
      'employee-bus': { name: 'Employee Bus Commute (km)', value: '', unit: 'km', completed: false },
      'employee-cycle': { name: 'Employee Cycle/Walk (km)', value: '', unit: 'km', completed: false },
    },
    // Category 8: Investments (3 fields)
    investments: {
      'equity-investments': { name: 'Equity Investments (£)', value: '', unit: '£', completed: false },
      'bond-investments': { name: 'Bond Investments (£)', value: '', unit: '£', completed: false },
      'property-investments': { name: 'Property Investments (£)', value: '', unit: '£', completed: false },
    },
  })

  // Load saved data on component mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        setIsLoading(true)
        const response = await enterpriseAPI.emissions.getByCategory('scope3', new Date().getFullYear().toString())
        
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
          completed: value.trim() !== '',
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
        'scope3',
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
        'scope3',
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
    { id: 'purchasedGoodsServices', name: 'Cat 1: Purchased Goods & Services', description: 'Upstream emissions from purchased goods and services', icon: '📦', fields: 5 },
    { id: 'transportationDistribution', name: 'Cat 2: Transportation & Distribution', description: 'Inbound and outbound logistics', icon: '🚚', fields: 4 },
    { id: 'wasteDisposal', name: 'Cat 3: Waste Disposal', description: 'Waste generated in operations', icon: '🗑️', fields: 4 },
    { id: 'businessTravel', name: 'Cat 4: Business Travel', description: 'Employee travel for business', icon: '✈️', fields: 5 },
    { id: 'employeeCommuting', name: 'Cat 5: Employee Commuting', description: 'Employee commuting to work', icon: '🚗', fields: 4 },
    { id: 'investments', name: 'Cat 6: Investments', description: 'Investment portfolio emissions', icon: '💼', fields: 3 },
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
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Globe className="h-6 w-6 text-cd-cedar" />
              <span className="text-sm font-semibold text-cd-cedar">SCOPE 3</span>
            </div>
            <h1 className="text-3xl font-bold text-cd-text">Value Chain Indirect Emissions</h1>
            <p className="text-cd-muted">
              Enter emissions from your value chain (15 GHG Protocol categories)
            </p>
          </div>
        </div>
      </div>

      {/* Data Entry Manager */}
      <DataEntryManager
        formType="emissions"
        scope="scope3"
        formData={formData}
        setFormData={setFormData}
        onSave={handleCalculateEmissions}
        isLoading={isSaving}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cd-cedar mx-auto mb-4"></div>
            <p className="text-cd-muted">Loading saved data...</p>
          </div>
        </div>
      )}

      {/* Main Content - Only show when not loading */}
      {!isLoading && (
        <>
          {/* Overall Progress */}
      <div className="rounded-lg border border-cd-cedar/20 bg-white p-6 shadow-cd-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cd-text">Overall Progress</h3>
            <p className="text-sm text-cd-muted">48 total fields across 15 categories</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cd-cedar">{totalProgress}%</div>
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
          <CheckCircle2 className="h-4 w-4" />
          <span>
            {Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter((f) => f.completed).length, 0)} of 48 fields completed
          </span>
        </div>
      </div>

      {/* Category Grid Navigation */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cd-muted">
          Select Category (15 GHG Protocol Categories)
        </h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {categories.map((cat) => {
            const progress = calculateCategoryProgress(cat.id)
            const isActive = currentCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`rounded-lg border p-4 text-left transition-all ${
                  isActive
                    ? 'border-cd-cedar bg-cd-cedar text-white shadow-cd-md'
                    : 'border-cd-border bg-white text-cd-text hover:border-cd-cedar/30 hover:shadow-cd-sm'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xl">{cat.icon}</span>
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-cd-cedar'}`}>
                    {progress}%
                  </span>
                </div>
                <div className={`mb-1 text-sm font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>
                  {cat.name}
                </div>
                <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>
                  {cat.fields} fields
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Form */}
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
            <AlertCircle className="h-4 w-4" />
            <span>Most Scope 3 data comes from financial records, supplier data, or estimates</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {Object.entries(formData[currentCategory]).map(([fieldKey, field]) => (
            <div key={fieldKey} className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {field.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-cd-mint" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-cd-text">
                  {field.name}
                </label>
                <div className="flex gap-2">
                  <input
                    id={`${currentCategory}-${fieldKey}`}
                    name={`${currentCategory}-${fieldKey}`}
                    type={field.unit === 'text' ? 'text' : 'number'}
                    step={field.unit === 'text' ? undefined : '0.01'}
                    min={field.unit === 'text' ? undefined : '0'}
                    value={field.value}
                    onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                    className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-cedar focus:outline-none focus:ring-2 focus:ring-cd-cedar/20"
                    placeholder={field.unit === 'text' ? 'Enter text' : `Enter amount in ${field.unit}`}
                  />
                  <div className="flex w-32 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                    {field.unit}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category-Specific Guidance */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
            <Info className="h-4 w-4" />
            {currentCategoryData.name} - DEFRA Guidance
          </div>
          <div className="text-xs text-blue-800">
            {currentCategory === 'purchasedGoods' && (
              <ul className="space-y-1">
                <li>• Use spend-based method: Total spend (£) × DEFRA emission factor for product category</li>
                <li>• Get data from procurement records and invoices</li>
                <li>• Separate by material type for accuracy (metals, plastics, paper, etc.)</li>
                <li>• Don't include capital goods (buildings, machinery) - use Category 2</li>
              </ul>
            )}
            {currentCategory === 'businessTravel' && (
              <ul className="space-y-1">
                <li>• Domestic flights: &lt;500 km one-way</li>
                <li>• Short-haul: 500-3700 km (e.g., within Europe)</li>
                <li>• Long-haul: &gt;3700 km (intercontinental)</li>
                <li>• Get data from travel booking systems or expense reports</li>
                <li>• Include hotel nights using DEFRA hotel emission factors</li>
              </ul>
            )}
            {currentCategory === 'commuting' && (
              <ul className="space-y-1">
                <li>• Survey employees for commute distance and mode</li>
                <li>• Multiply by working days (e.g., 220 days/year)</li>
                <li>• Remote working reduces commuting emissions</li>
                <li>• Include working from home emissions for remote workers</li>
              </ul>
            )}
            {currentCategory === 'waste' && (
              <ul className="space-y-1">
                <li>• Get data from waste contractor invoices (tonnes per waste stream)</li>
                <li>• Separate by disposal method: landfill, recycling, incineration, composting</li>
                <li>• Recycling has lower emissions than landfill</li>
                <li>• Include wastewater treatment if applicable</li>
              </ul>
            )}
            {(currentCategory === 'useOfProducts' || currentCategory === 'endOfLife') && (
              <ul className="space-y-1">
                <li>• Estimate based on product units sold and typical usage patterns</li>
                <li>• Get average product lifespan from manufacturer specs</li>
                <li>• For electrical products, estimate annual kWh usage</li>
                <li>• Consider end-of-life disposal (landfill vs recycling)</li>
                <li>• This category often requires assumptions - document methodology</li>
              </ul>
            )}
            {currentCategory === 'investments' && (
              <ul className="space-y-1">
                <li>• For financial institutions: emissions from investment portfolio</li>
                <li>• Use PCAF (Partnership for Carbon Accounting Financials) methodology</li>
                <li>• Equity share approach: (Your investment / Total equity) × Investee emissions</li>
                <li>• Request emissions data from investee companies</li>
              </ul>
            )}
            {!['purchasedGoods', 'businessTravel', 'commuting', 'waste', 'useOfProducts', 'endOfLife', 'investments'].includes(currentCategory) && (
              <p>Complete these fields based on your financial records, supplier data, or activity metrics. DEFRA provides emission factors for most categories using spend-based or activity-based methods.</p>
            )}
          </div>
        </div>

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
            className="flex-1 rounded-lg bg-cd-cedar px-6 py-3 font-semibold text-white transition-colors hover:bg-cd-cedar/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSaveProgress}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Progress'}
          </button>
              <button
                className="flex-1 rounded-lg border border-cd-border bg-white px-6 py-3 font-semibold text-cd-cedar transition-colors hover:bg-cd-surface disabled:bg-gray-100 disabled:cursor-not-allowed"
                onClick={handleCalculateEmissions}
                disabled={isSaving}
              >
                {isSaving ? 'Calculating...' : 'Calculate Emissions'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
