import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Factory, CheckCircle2, Circle, AlertCircle, Info } from 'lucide-react'

export default function Scope1DataCollection() {
  const [currentCategory, setCurrentCategory] = useState('stationaryCombustion')
  const [formData, setFormData] = useState({
    // Stationary Combustion (10 fuel types)
    stationaryCombustion: {
      'natural-gas': { name: 'Natural Gas (kWh)', value: '', unit: 'kWh', completed: false },
      'gas-oil': { name: 'Gas Oil (litres)', value: '', unit: 'litres', completed: false },
      'diesel': { name: 'Diesel (litres)', value: '', unit: 'litres', completed: false },
      'fuel-oil': { name: 'Fuel Oil (litres)', value: '', unit: 'litres', completed: false },
      'lpg': { name: 'LPG (litres)', value: '', unit: 'litres', completed: false },
      'coal': { name: 'Coal (tonnes)', value: '', unit: 'tonnes', completed: false },
      'wood-pellets': { name: 'Wood Pellets (tonnes)', value: '', unit: 'tonnes', completed: false },
      'wood-chips': { name: 'Wood Chips (tonnes)', value: '', unit: 'tonnes', completed: false },
      'burning-oil': { name: 'Burning Oil (litres)', value: '', unit: 'litres', completed: false },
      'biofuel-blend': { name: 'Biofuel Blend %', value: '', unit: '%', completed: false },
    },
    // Mobile Combustion (8 vehicle types)
    mobileCombustion: {
      'petrol-cars': { name: 'Petrol Cars (litres)', value: '', unit: 'litres', completed: false },
      'diesel-cars': { name: 'Diesel Cars (litres)', value: '', unit: 'litres', completed: false },
      'hybrid-cars': { name: 'Hybrid Cars (litres)', value: '', unit: 'litres', completed: false },
      'lpg-cars': { name: 'LPG Cars (litres)', value: '', unit: 'litres', completed: false },
      'petrol-vans': { name: 'Petrol Vans (litres)', value: '', unit: 'litres', completed: false },
      'diesel-vans': { name: 'Diesel Vans (litres)', value: '', unit: 'litres', completed: false },
      'hgv-diesel': { name: 'HGV Diesel (litres)', value: '', unit: 'litres', completed: false },
      'motorcycles': { name: 'Motorcycles (litres)', value: '', unit: 'litres', completed: false },
    },
    // Process Emissions (5 types)
    processEmissions: {
      'cement-production': { name: 'Cement Production (tonnes)', value: '', unit: 'tonnes', completed: false },
      'lime-production': { name: 'Lime Production (tonnes)', value: '', unit: 'tonnes', completed: false },
      'glass-production': { name: 'Glass Production (tonnes)', value: '', unit: 'tonnes', completed: false },
      'ammonia-production': { name: 'Ammonia Production (tonnes)', value: '', unit: 'tonnes', completed: false },
      'nitric-acid': { name: 'Nitric Acid (tonnes)', value: '', unit: 'tonnes', completed: false },
    },
    // Fugitive Emissions (6 refrigerant types)
    fugitiveEmissions: {
      'r404a': { name: 'R-404A (kg)', value: '', unit: 'kg', completed: false },
      'r410a': { name: 'R-410A (kg)', value: '', unit: 'kg', completed: false },
      'r134a': { name: 'R-134a (kg)', value: '', unit: 'kg', completed: false },
      'r407c': { name: 'R-407C (kg)', value: '', unit: 'kg', completed: false },
      'r32': { name: 'R-32 (kg)', value: '', unit: 'kg', completed: false },
      'co2-refrigerant': { name: 'CO₂ Refrigerant (kg)', value: '', unit: 'kg', completed: false },
    },
  })

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
      id: 'stationaryCombustion',
      name: 'Stationary Combustion',
      description: 'Emissions from burning fuels in stationary equipment (boilers, furnaces, generators)',
      icon: '🔥',
      fields: 10,
    },
    {
      id: 'mobileCombustion',
      name: 'Mobile Combustion',
      description: 'Emissions from company-owned or controlled vehicles',
      icon: '🚗',
      fields: 8,
    },
    {
      id: 'processEmissions',
      name: 'Process Emissions',
      description: 'Emissions from industrial processes (not from combustion)',
      icon: '⚙️',
      fields: 5,
    },
    {
      id: 'fugitiveEmissions',
      name: 'Fugitive Emissions',
      description: 'Leaks of refrigerants, gases, or other emissions',
      icon: '💨',
      fields: 6,
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
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Factory className="h-6 w-6 text-cd-midnight" />
              <span className="text-sm font-semibold text-cd-midnight">SCOPE 1</span>
            </div>
            <h1 className="text-3xl font-bold text-cd-text">Direct Emissions Data Collection</h1>
            <p className="text-cd-muted">
              Enter emissions from sources owned or controlled by your organization
            </p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="rounded-lg border border-cd-midnight/20 bg-white p-6 shadow-cd-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cd-text">Overall Progress</h3>
            <p className="text-sm text-cd-muted">29 total fields across 4 categories</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cd-midnight">{totalProgress}%</div>
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
            {Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter((f) => f.completed).length, 0)} of 29 fields completed
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
                      ? 'border-cd-midnight bg-cd-midnight text-white shadow-cd-md'
                      : 'border-cd-border bg-white text-cd-text hover:border-cd-midnight/30 hover:shadow-cd-sm'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl">{cat.icon}</span>
                    <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-cd-midnight'}`}>
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
                      className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-cd-midnight'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </button>
              )
            })}

            {/* DEFRA Info */}
            <div className="mt-6 rounded-lg border border-cd-teal/20 bg-cd-teal/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cd-midnight">
                <Info className="h-4 w-4" />
                DEFRA 2025
              </div>
              <p className="text-xs text-cd-muted">
                All fields use UK Government DEFRA 2025 emission factors for accurate carbon accounting.
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
                <AlertCircle className="h-4 w-4" />
                <span>Enter consumption data for the reporting period (e.g., monthly, quarterly, annually)</span>
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
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value}
                        onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                        className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                        placeholder={`Enter amount in ${field.unit}`}
                      />
                      <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                        {field.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category-Specific Guidance */}
            {currentCategory === 'stationaryCombustion' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" />
                  Stationary Combustion Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• Include all fuel used in boilers, furnaces, ovens, generators, and heaters</li>
                  <li>• Natural gas is typically measured in kWh on utility bills</li>
                  <li>• Liquid fuels (diesel, gas oil) are measured in litres</li>
                  <li>• Solid fuels (coal, wood) are measured in tonnes</li>
                  <li>• If using biofuel blends, enter the percentage (e.g., B20 = 20%)</li>
                </ul>
              </div>
            )}

            {currentCategory === 'mobileCombustion' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" />
                  Mobile Combustion Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• Include all company-owned or leased vehicles</li>
                  <li>• Use fuel purchase records or fuel card data</li>
                  <li>• Separate petrol and diesel consumption</li>
                  <li>• HGVs include lorries, trucks, and heavy goods vehicles</li>
                  <li>• Don't include employee-owned vehicles (that's Scope 3)</li>
                </ul>
              </div>
            )}

            {currentCategory === 'processEmissions' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" />
                  Process Emissions Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• These are chemical reactions, not fuel combustion</li>
                  <li>• Cement: CO₂ released from limestone during production</li>
                  <li>• Lime: CO₂ from calcination of limestone</li>
                  <li>• Glass: CO₂ from soda ash and limestone</li>
                  <li>• Only complete if you have industrial manufacturing processes</li>
                </ul>
              </div>
            )}

            {currentCategory === 'fugitiveEmissions' && (
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                  <Info className="h-4 w-4" />
                  Fugitive Emissions Guidance
                </div>
                <ul className="space-y-1 text-xs text-blue-800">
                  <li>• Include refrigerant leaks from air conditioning and refrigeration</li>
                  <li>• Check service records for refrigerant top-ups (kg)</li>
                  <li>• Different refrigerants have different GWP (Global Warming Potential)</li>
                  <li>• R-404A has very high GWP (use R-32 or R-134a for lower impact)</li>
                  <li>• Include fire suppression systems if applicable</li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
              <button
                className="flex-1 rounded-lg bg-cd-midnight px-6 py-3 font-semibold text-white transition-colors hover:bg-cd-midnight/90"
                onClick={() => alert('Data saved! (API integration pending)')}
              >
                Save Progress
              </button>
              <button
                className="flex-1 rounded-lg border border-cd-border bg-white px-6 py-3 font-semibold text-cd-midnight transition-colors hover:bg-cd-surface"
                onClick={() => alert('Calculate emissions (API integration pending)')}
              >
                Calculate Emissions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
