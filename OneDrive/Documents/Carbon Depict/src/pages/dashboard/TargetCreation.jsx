// Cache bust 2025-10-23
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle } from '@atoms/Icon'

export default function TargetCreation() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: 'sbti',
    category: 'emissions',
    baselineYear: new Date().getFullYear() - 3,
    baselineValue: '',
    targetYear: new Date().getFullYear() + 7,
    targetValue: '',
    unit: 'tCO2e',
    ambition: '1.5C',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Target created! (API integration pending)')
    navigate('/dashboard/esg/targets')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/esg/targets')}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <ArrowLeft strokeWidth={2} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight">Create New Target</h1>
          <p className="mt-2 text-cd-muted">
            Set science-based targets aligned with SBTi methodology
          </p>
        </div>
      </div>

      {/* SBTi Info Banner */}
      <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle strokeWidth={2} />
          <div className="text-sm text-blue-900">
            <strong>Science-Based Targets Initiative (SBTi):</strong> Targets should align with limiting 
            global warming to 1.5°C or well-below 2°C. Near-term targets (5-10 years) require at least 
            42% reduction for 1.5°C pathway.
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm space-y-6">
          {/* Target Name */}
          <div>
            <label className="block text-sm font-medium text-cd-midnight mb-2">
              Target Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
              placeholder="e.g., Net-Zero by 2050"
              required
            />
          </div>

          {/* Target Type */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Target Framework *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
              >
                <option value="sbti">SBTi (Science Based Targets)</option>
                <option value="sdg">UN SDG Goal</option>
                <option value="gri">GRI-aligned Target</option>
                <option value="custom">Custom Target</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
              >
                <option value="emissions">GHG Emissions</option>
                <option value="energy">Energy</option>
                <option value="water">Water</option>
                <option value="waste">Waste</option>
                <option value="diversity">Diversity & Inclusion</option>
                <option value="safety">Health & Safety</option>
                <option value="governance">Governance</option>
              </select>
            </div>
          </div>

          {/* Baseline */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Baseline Year *
              </label>
              <input
                type="number"
                value={formData.baselineYear}
                onChange={(e) => setFormData({...formData, baselineYear: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Baseline Value *
              </label>
              <input
                type="number"
                value={formData.baselineValue}
                onChange={(e) => setFormData({...formData, baselineValue: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                placeholder="50000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Unit *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
              >
                <option value="tCO2e">tCO2e</option>
                <option value="MWh">MWh</option>
                <option value="m3">m³</option>
                <option value="tonnes">Tonnes</option>
                <option value="%">Percentage</option>
              </select>
            </div>
          </div>

          {/* Target */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Target Year *
              </label>
              <input
                type="number"
                value={formData.targetYear}
                onChange={(e) => setFormData({...formData, targetYear: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                Target Value *
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
                placeholder="27500"
                required
              />
            </div>
          </div>

          {/* SBTi Specific */}
          {formData.type === 'sbti' && (
            <div>
              <label className="block text-sm font-medium text-cd-midnight mb-2">
                SBTi Ambition Level *
              </label>
              <select
                value={formData.ambition}
                onChange={(e) => setFormData({...formData, ambition: e.target.value})}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none"
              >
                <option value="1.5C">1.5°C (Net-Zero - 42% reduction by 2030)</option>
                <option value="2C">Well-below 2°C (25% reduction by 2030)</option>
              </select>
            </div>
          )}

          {/* Reduction Calculation */}
          {formData.baselineValue && formData.targetValue && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="text-sm text-green-900">
                <strong>Reduction:</strong>{' '}
                {Math.round(((formData.baselineValue - formData.targetValue) / formData.baselineValue) * 100)}%
                {' '}({formData.baselineValue - formData.targetValue} {formData.unit})
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/esg/targets')}
            className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-cd-teal px-6 py-2 text-white hover:bg-cd-teal/90"
          >
            <Save strokeWidth={2} />
            Create Target
          </button>
        </div>
      </form>
    </div>
  )
}

