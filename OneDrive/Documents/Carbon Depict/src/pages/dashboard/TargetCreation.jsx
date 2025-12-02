// Cache bust 2025-10-23
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Info, Target as TargetIcon, Percent } from 'lucide-react'

// --- HOOK ---
const useTargetCreation = () => {
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

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const reduction = useMemo(() => {
    const baseline = parseFloat(formData.baselineValue)
    const target = parseFloat(formData.targetValue)
    if (!isNaN(baseline) && !isNaN(target) && baseline > 0) {
      const percentage = ((baseline - target) / baseline) * 100
      return {
        percentage: percentage.toFixed(1),
        absolute: (baseline - target).toLocaleString(),
      }
    }
    return null
  }, [formData.baselineValue, formData.targetValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Creating target:', formData)
    // API call would go here
    navigate('/dashboard/target-management')
  }

  return {
    formData,
    reduction,
    handleFormChange,
    handleSubmit,
    navigate,
  }
}

// --- SUB-COMPONENTS ---

const Header = ({ onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <ArrowLeft className="h-6 w-6 text-greenly-charcoal" />
    </button>
    <div>
      <h1 className="text-4xl font-bold text-greenly-charcoal">Create New Target</h1>
      <p className="mt-2 text-lg text-greenly-slate">Define your organization's sustainability goals.</p>
    </div>
  </div>
)

const InfoBanner = () => (
  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 flex items-start gap-4">
    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
    <p className="text-sm text-blue-800">
      <strong>Science-Based Targets (SBTi):</strong> Ensure your targets align with climate science. For a 1.5°C pathway, near-term targets (5-10 years) typically require a 42% reduction in emissions.
    </p>
  </div>
)

const FormCard = ({ children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
    {children}
  </div>
)

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-greenly-charcoal mb-1">{label}</label>
    <input {...props} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-greenly-primary focus:ring-greenly-primary" />
  </div>
)

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-greenly-charcoal mb-1">{label}</label>
    <select {...props} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-greenly-primary focus:ring-greenly-primary">
      {children}
    </select>
  </div>
)

const ReductionIndicator = ({ reduction, unit }) => (
  <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center justify-center gap-6 text-center">
    <div>
      <p className="text-sm font-semibold text-green-700">Absolute Reduction</p>
      <p className="text-2xl font-bold text-green-900 flex items-center gap-2">
        <TargetIcon className="h-6 w-6" />
        {reduction.absolute} <span className="text-base font-medium">{unit}</span>
      </p>
    </div>
    <div className="border-l border-green-200 h-12"></div>
    <div>
      <p className="text-sm font-semibold text-green-700">Percentage Reduction</p>
      <p className="text-2xl font-bold text-green-900 flex items-center gap-2">
        <Percent className="h-6 w-6" />
        {reduction.percentage}%
      </p>
    </div>
  </div>
)

// --- MAIN COMPONENT ---
export default function TargetCreation() {
  const { formData, reduction, handleFormChange, handleSubmit, navigate } = useTargetCreation()

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header onBack={() => navigate('/dashboard/target-management')} />
      
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InfoBanner />

          <FormCard>
            <Input label="Target Name *" name="name" type="text" value={formData.name} onChange={handleFormChange} placeholder="e.g., Reduce Scope 1 & 2 Emissions" required />
            
            <div className="grid sm:grid-cols-2 gap-6">
              <Select label="Target Framework *" name="type" value={formData.type} onChange={handleFormChange}>
                <option value="sbti">SBTi (Science Based Targets)</option>
                <option value="custom">Custom Company Target</option>
              </Select>
              <Select label="Category *" name="category" value={formData.category} onChange={handleFormChange}>
                <option value="emissions">GHG Emissions</option>
                <option value="energy">Energy</option>
                <option value="water">Water</option>
                <option value="waste">Waste</option>
              </Select>
            </div>
          </FormCard>

          <FormCard>
            <h3 className="text-lg font-bold text-greenly-charcoal -mb-2">Baseline</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <Input label="Baseline Year *" name="baselineYear" type="number" value={formData.baselineYear} onChange={handleFormChange} required />
              <Input label="Baseline Value *" name="baselineValue" type="number" value={formData.baselineValue} onChange={handleFormChange} placeholder="e.g., 50000" required />
              <Select label="Unit *" name="unit" value={formData.unit} onChange={handleFormChange}>
                <option value="tCO2e">tCO2e</option>
                <option value="MWh">MWh</option>
                <option value="m³">m³</option>
                <option value="tonnes">Tonnes</option>
              </Select>
            </div>
          </FormCard>

          <FormCard>
            <h3 className="text-lg font-bold text-greenly-charcoal -mb-2">Target</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <Input label="Target Year *" name="targetYear" type="number" value={formData.targetYear} onChange={handleFormChange} required />
              <Input label="Target Value *" name="targetValue" type="number" value={formData.targetValue} onChange={handleFormChange} placeholder="e.g., 29000" required />
            </div>
            {formData.type === 'sbti' && (
              <Select label="SBTi Ambition Level *" name="ambition" value={formData.ambition} onChange={handleFormChange}>
                <option value="1.5C">1.5°C (Net-Zero Aligned)</option>
                <option value="2C">Well-below 2°C</option>
              </Select>
            )}
          </FormCard>

          {reduction && <ReductionIndicator reduction={reduction} unit={formData.unit} />}

          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/dashboard/target-management')} className="rounded-xl bg-white border border-gray-300 px-6 py-2.5 text-sm font-semibold text-greenly-charcoal hover:bg-gray-50 transition-all shadow-sm">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-greenly-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-greenly-primary/90 transition-all shadow-sm">
              <Save className="h-5 w-5" />
              Create Target
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

