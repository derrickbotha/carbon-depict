import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Zap, CheckCircle2, Circle, AlertCircle, Info } from 'lucide-react'

export default function Scope2DataCollection() {
  const [currentCategory, setCurrentCategory] = useState('purchasedElectricity')
  const [formData, setFormData] = useState({
    // Purchased Electricity (6 fields)
    purchasedElectricity: {
      'grid-electricity-kwh': { name: 'Grid Electricity (kWh)', value: '', unit: 'kWh', completed: false },
      'renewable-tariff': { name: 'Renewable Tariff (kWh)', value: '', unit: 'kWh', completed: false },
      'green-certificates': { name: 'Green Energy Certificates (kWh)', value: '', unit: 'kWh', completed: false },
      'supplier-name': { name: 'Electricity Supplier', value: '', unit: 'text', completed: false },
      'location-based': { name: 'Location-Based Method (kWh)', value: '', unit: 'kWh', completed: false },
      'market-based': { name: 'Market-Based Method (kWh)', value: '', unit: 'kWh', completed: false },
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
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-6 w-6 text-cd-teal" />
              <span className="text-sm font-semibold text-cd-teal">SCOPE 2</span>
            </div>
            <h1 className="text-3xl font-bold text-cd-text">Energy Indirect Emissions Data Collection</h1>
            <p className="text-cd-muted">
              Enter emissions from purchased electricity, heat, steam, and cooling
            </p>
          </div>
        </div>
      </div>

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
          <CheckCircle2 className="h-4 w-4" />
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
                <Info className="h-4 w-4" />
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
                <AlertCircle className="h-4 w-4" />
                <span>Refer to your utility bills or energy invoices for consumption data</span>
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
                      {field.unit === 'text' ? (
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                          className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                          placeholder="Enter supplier name"
                        />
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
                  <Info className="h-4 w-4" />
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
                  <Info className="h-4 w-4" />
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
                  <Info className="h-4 w-4" />
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
                  <Info className="h-4 w-4" />
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

            {/* Action Buttons */}
            <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
              <button
                className="flex-1 rounded-lg bg-cd-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-cd-teal/90"
                onClick={() => alert('Data saved! (API integration pending)')}
              >
                Save Progress
              </button>
              <button
                className="flex-1 rounded-lg border border-cd-border bg-white px-6 py-3 font-semibold text-cd-teal transition-colors hover:bg-cd-surface"
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
