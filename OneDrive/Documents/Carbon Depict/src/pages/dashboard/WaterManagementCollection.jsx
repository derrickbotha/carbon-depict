// Cache bust 2025-10-23
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle2, Droplets, FileText, TrendingUp,
  Factory, Droplet, Wind, Recycle, Target, Info, BarChart3, MapPin
} from '@atoms/Icon'
import useESGMetrics from '../../hooks/useESGMetrics'

export default function WaterManagementCollection() {
  const navigate = useNavigate()
  const { createMetric, updateMetric, fetchMetrics, metrics, loading } = useESGMetrics({ 
    topic: 'Water Management',
    pillar: 'Environmental'
  })
  
  const [saveStatus, setSaveStatus] = useState('')
  const [existingMetricId, setExistingMetricId] = useState(null)
  
  // Form state organized by category
  const [formData, setFormData] = useState({
    // Water Withdrawal
    totalWaterWithdrawal: '',
    surfaceWaterWithdrawal: '',
    groundwaterWithdrawal: '',
    seawaterWithdrawal: '',
    producedWaterWithdrawal: '',
    thirdPartyWaterWithdrawal: '',
    waterStressAreas: '',
    
    // Water Discharge
    totalWaterDischarge: '',
    surfaceWaterDischarge: '',
    groundwaterDischarge: '',
    seawaterDischarge: '',
    thirdPartyWaterDischarge: '',
    dischargeQualityStandards: '',
    
    // Water Consumption
    totalWaterConsumption: '',
    waterConsumptionChange: '',
    waterRecycled: '',
    waterReused: '',
    recyclingRate: '',
    
    // Water Quality
    bodDischarge: '',
    codDischarge: '',
    tssDischarge: '',
    dischargeTemperature: '',
    phLevel: '',
    pollutantsMonitored: '',
    
    // Water Intensity
    waterIntensityRevenue: '',
    waterIntensityProduction: '',
    waterIntensityEmployee: '',
    baselineYear: '',
    intensityReductionTarget: '',
    
    // Water Risk Assessment
    waterRiskAssessmentConducted: '',
    waterRiskAssessmentTool: '',
    facilitiesInWaterStress: '',
    waterRelatedRisksIdentified: '',
    waterScarcityRisk: '',
    floodingRisk: '',
    
    // Water Management Practices
    waterManagementPolicy: '',
    waterEfficiencyTargets: '',
    waterRecyclingInvestment: '',
    rainwaterHarvesting: '',
    wastewaterTreatment: '',
    waterMeteringSystem: '',
    
    // Stakeholder Engagement
    watershedEngagement: '',
    communityWaterAccess: '',
    waterGovernanceParticipation: '',
    sharedWaterResources: '',
    conflictsOverWater: '',
    
    // Supply Chain Water
    supplierWaterAssessment: '',
    waterIntensiveSuppliers: '',
    supplierWaterTargets: '',
    supplyChainWaterRisk: '',
  })

  const [showCalculations, setShowCalculations] = useState(false)

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculation Functions
  const calculateWaterBalance = useCallback(() => {
    const withdrawal = parseFloat(formData.totalWaterWithdrawal) || 0
    const discharge = parseFloat(formData.totalWaterDischarge) || 0
    const consumption = withdrawal - discharge
    
    if (withdrawal === 0) return null
    
    return {
      withdrawal,
      discharge,
      consumption,
      consumptionRate: (consumption / withdrawal) * 100
    }
  }, [formData])

  const calculateRecyclingRate = useCallback(() => {
    const recycled = parseFloat(formData.waterRecycled) || 0
    const reused = parseFloat(formData.waterReused) || 0
    const withdrawal = parseFloat(formData.totalWaterWithdrawal) || 0
    
    if (withdrawal === 0) return null
    
    const totalRecycledReused = recycled + reused
    const rate = (totalRecycledReused / withdrawal) * 100
    
    return {
      totalRecycledReused,
      rate: rate.toFixed(1),
      level: rate >= 50 ? 'Excellent' : rate >= 30 ? 'Good' : rate >= 15 ? 'Fair' : 'Poor'
    }
  }, [formData])

  const calculateWaterIntensity = useCallback(() => {
    const withdrawal = parseFloat(formData.totalWaterWithdrawal) || 0
    const revenue = parseFloat(formData.waterIntensityRevenue) || 0
    const production = parseFloat(formData.waterIntensityProduction) || 0
    
    if (withdrawal === 0) return null
    
    const results = {}
    
    if (revenue > 0) {
      results.revenueIntensity = (withdrawal / revenue).toFixed(2)
    }
    
    if (production > 0) {
      results.productionIntensity = (withdrawal / production).toFixed(2)
    }
    
    return Object.keys(results).length > 0 ? results : null
  }, [formData])

  const calculateWaterStressExposure = useCallback(() => {
    const total = parseFloat(formData.totalWaterWithdrawal) || 0
    const stressAreas = parseFloat(formData.waterStressAreas) || 0
    
    if (total === 0) return null
    
    const exposure = (stressAreas / total) * 100
    
    return {
      withdrawal: total,
      stressAreas,
      exposurePercent: exposure.toFixed(1),
      riskLevel: exposure >= 50 ? 'High' : exposure >= 25 ? 'Medium' : 'Low'
    }
  }, [formData])

  // Progress calculation
  const progress = useMemo(() => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(v => v !== '').length
    return Math.round((filledFields / totalFields) * 100)
  }, [formData])

  // Load existing data on mount
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0]
      setExistingMetricId(latestMetric._id)
      
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setFormData(latestMetric.metadata.formData)
      }
    }
  }, [metrics])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const metricData = {
        framework: 'GRI,CSRD,CDP',
        pillar: 'Environmental',
        topic: 'Water Management',
        metricName: 'Water Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: parseFloat(formData.totalWaterWithdrawal) || 0,
        unit: 'megalitres',
        dataQuality: 'measured',
        metadata: {
          formData: formData,
          completionPercentage: progress,
          lastUpdated: new Date().toISOString()
        }
      }
      
      if (existingMetricId) {
        await updateMetric(existingMetricId, metricData)
      } else {
        const newMetric = await createMetric(metricData)
        setExistingMetricId(newMetric._id)
      }
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error saving Water Management data:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }, [formData, progress, existingMetricId, createMetric, updateMetric])

  const handleSubmit = useCallback(async () => {
    if (progress < 100) {
      alert('Please complete all fields before submitting.')
      return
    }
    
    setSaveStatus('submitting')
    try {
      const metricData = {
        framework: 'GRI,CSRD,CDP',
        pillar: 'Environmental',
        topic: 'Water Management',
        metricName: 'Water Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: parseFloat(formData.totalWaterWithdrawal) || 0,
        unit: 'megalitres',
        dataQuality: 'measured',
        status: 'published',
        isDraft: false,
        metadata: {
          formData: formData,
          completionPercentage: 100,
          submittedAt: new Date().toISOString()
        }
      }
      
      if (existingMetricId) {
        await updateMetric(existingMetricId, metricData)
      } else {
        await createMetric(metricData)
      }
      
      setSaveStatus('submitted')
      alert('Water Management data submitted successfully and saved to database!')
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry')
      }, 1500)
    } catch (error) {
      console.error('Error submitting Water Management data:', error)
      setSaveStatus('error')
      alert('Error submitting data. Please try again.')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }, [progress, formData, existingMetricId, createMetric, updateMetric, navigate])

  // Field categories for organization
  const categories = [
    {
      id: 'withdrawal',
      name: 'Water Withdrawal',
      icon: Droplets,
      description: 'Water sources and withdrawal volumes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fields: [
        { key: 'totalWaterWithdrawal', label: 'Total Water Withdrawal (megalitres)', type: 'number', framework: 'GRI 303-3, CSRD E3-4, CDP W1.2', required: true, unit: 'ML', step: '0.01' },
        { key: 'surfaceWaterWithdrawal', label: 'Surface Water (rivers, lakes)', type: 'number', framework: 'GRI 303-3, CSRD E3-4', required: false, unit: 'ML', step: '0.01' },
        { key: 'groundwaterWithdrawal', label: 'Groundwater', type: 'number', framework: 'GRI 303-3, CSRD E3-4', required: false, unit: 'ML', step: '0.01' },
        { key: 'seawaterWithdrawal', label: 'Seawater', type: 'number', framework: 'GRI 303-3, CDP W1.2', required: false, unit: 'ML', step: '0.01' },
        { key: 'producedWaterWithdrawal', label: 'Produced Water', type: 'number', framework: 'GRI 303-3', required: false, unit: 'ML', step: '0.01' },
        { key: 'thirdPartyWaterWithdrawal', label: 'Third-Party Water (municipal)', type: 'number', framework: 'GRI 303-3, CSRD E3-4, CDP W1.2', required: false, unit: 'ML', step: '0.01' },
        { key: 'waterStressAreas', label: 'Withdrawal from Water-Stressed Areas', type: 'number', framework: 'GRI 303-3, CSRD E3-4, CDP W1.2', required: true, unit: 'ML', step: '0.01' },
      ]
    },
    {
      id: 'discharge',
      name: 'Water Discharge',
      icon: Wind,
      description: 'Water discharge destinations and volumes',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      fields: [
        { key: 'totalWaterDischarge', label: 'Total Water Discharge (megalitres)', type: 'number', framework: 'GRI 303-4, CSRD E3-4, CDP W1.2', required: true, unit: 'ML', step: '0.01' },
        { key: 'surfaceWaterDischarge', label: 'To Surface Water', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'ML', step: '0.01' },
        { key: 'groundwaterDischarge', label: 'To Groundwater', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'ML', step: '0.01' },
        { key: 'seawaterDischarge', label: 'To Seawater', type: 'number', framework: 'GRI 303-4', required: false, unit: 'ML', step: '0.01' },
        { key: 'thirdPartyWaterDischarge', label: 'To Third-Party (sewage)', type: 'number', framework: 'GRI 303-4, CSRD E3-4, CDP W1.2', required: false, unit: 'ML', step: '0.01' },
        { key: 'dischargeQualityStandards', label: 'Discharge Quality Standards Met', type: 'select', options: ['All standards met', 'Most standards met', 'Some standards met', 'Standards not met'], framework: 'GRI 303-4, CSRD E3-4', required: true },
      ]
    },
    {
      id: 'consumption',
      name: 'Water Consumption & Recycling',
      icon: Recycle,
      description: 'Net consumption, recycling, and reuse',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fields: [
        { key: 'totalWaterConsumption', label: 'Total Water Consumption (megalitres)', type: 'number', framework: 'GRI 303-5, CSRD E3-4, CDP W1.2', required: true, unit: 'ML', step: '0.01' },
        { key: 'waterConsumptionChange', label: 'Change from Previous Year (%)', type: 'number', framework: 'GRI 303-5, CSRD E3-4', required: false, unit: '%', step: '0.1' },
        { key: 'waterRecycled', label: 'Water Recycled (megalitres)', type: 'number', framework: 'GRI 303-5, CDP W1.2', required: false, unit: 'ML', step: '0.01' },
        { key: 'waterReused', label: 'Water Reused (megalitres)', type: 'number', framework: 'GRI 303-5, CDP W1.2', required: false, unit: 'ML', step: '0.01' },
        { key: 'recyclingRate', label: 'Water Recycling Rate (%)', type: 'number', framework: 'CDP W1.2', required: false, unit: '%', max: 100, step: '0.1' },
      ]
    },
    {
      id: 'quality',
      name: 'Water Quality',
      icon: Droplet,
      description: 'Discharge quality and pollutant monitoring',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      fields: [
        { key: 'bodDischarge', label: 'BOD Discharge (kg/year)', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'kg', step: '0.01' },
        { key: 'codDischarge', label: 'COD Discharge (kg/year)', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'kg', step: '0.01' },
        { key: 'tssDischarge', label: 'Total Suspended Solids (kg/year)', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'kg', step: '0.01' },
        { key: 'dischargeTemperature', label: 'Average Discharge Temperature (°C)', type: 'number', framework: 'GRI 303-4', required: false, unit: '°C', step: '0.1' },
        { key: 'phLevel', label: 'pH Level Range', type: 'text', framework: 'GRI 303-4, CSRD E3-4', required: false, placeholder: 'e.g., 6.5-8.5' },
        { key: 'pollutantsMonitored', label: 'Number of Pollutants Monitored', type: 'number', framework: 'GRI 303-4, CSRD E3-4', required: false, unit: 'pollutants' },
      ]
    },
    {
      id: 'intensity',
      name: 'Water Intensity',
      icon: TrendingUp,
      description: 'Water use efficiency metrics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fields: [
        { key: 'waterIntensityRevenue', label: 'Revenue (million USD)', type: 'number', framework: 'GRI 303-5, CSRD E3-4', required: false, unit: 'M USD', step: '0.01' },
        { key: 'waterIntensityProduction', label: 'Production Volume (units)', type: 'number', framework: 'GRI 303-5, CSRD E3-4', required: false, unit: 'units', step: '1' },
        { key: 'waterIntensityEmployee', label: 'Number of Employees', type: 'number', framework: 'GRI 303-5', required: false, unit: 'employees' },
        { key: 'baselineYear', label: 'Baseline Year for Intensity', type: 'number', framework: 'GRI 303-5, CSRD E3-4', required: false, unit: 'year', min: '2000', max: '2025' },
        { key: 'intensityReductionTarget', label: 'Intensity Reduction Target (%)', type: 'number', framework: 'CSRD E3-4, SBTi', required: false, unit: '%', step: '0.1' },
      ]
    },
    {
      id: 'riskAssessment',
      name: 'Water Risk Assessment',
      icon: AlertCircle,
      description: 'Water-related risks and vulnerabilities',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      fields: [
        { key: 'waterRiskAssessmentConducted', label: 'Water Risk Assessment Conducted', type: 'select', options: ['Yes', 'No', 'In progress'], framework: 'GRI 303-1, CSRD E3-1, CDP W4.1', required: true },
        { key: 'waterRiskAssessmentTool', label: 'Risk Assessment Tool Used', type: 'select', options: ['WRI Aqueduct', 'WWF Water Risk Filter', 'CDP Water Security', 'Custom tool', 'Other'], framework: 'CDP W4.1, CSRD E3-1', required: false },
        { key: 'facilitiesInWaterStress', label: 'Facilities in Water-Stressed Areas', type: 'number', framework: 'GRI 303-1, CSRD E3-1, CDP W5.1', required: true, unit: 'facilities' },
        { key: 'waterRelatedRisksIdentified', label: 'Water-Related Risks Identified', type: 'number', framework: 'GRI 303-1, TCFD, CSRD E3-1', required: false, unit: 'risks' },
        { key: 'waterScarcityRisk', label: 'Water Scarcity Risk Level', type: 'select', options: ['High', 'Medium', 'Low', 'None'], framework: 'CDP W4.1, TCFD, CSRD E3-1', required: true },
        { key: 'floodingRisk', label: 'Flooding Risk Level', type: 'select', options: ['High', 'Medium', 'Low', 'None'], framework: 'CDP W4.1, TCFD, CSRD E3-1', required: false },
      ]
    },
    {
      id: 'management',
      name: 'Water Management Practices',
      icon: Target,
      description: 'Policies, targets, and improvement initiatives',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      fields: [
        { key: 'waterManagementPolicy', label: 'Water Management Policy Exists', type: 'select', options: ['Yes - Board approved', 'Yes - Management approved', 'In development', 'No'], framework: 'GRI 303-1, CSRD E3-1', required: true },
        { key: 'waterEfficiencyTargets', label: 'Water Efficiency Targets Set', type: 'select', options: ['Yes - Science-based', 'Yes - Absolute', 'Yes - Intensity', 'No'], framework: 'GRI 303-1, SBTi, CSRD E3-4', required: true },
        { key: 'waterRecyclingInvestment', label: 'Investment in Water Recycling (USD)', type: 'number', framework: 'CDP W1.2', required: false, unit: 'USD', step: '1' },
        { key: 'rainwaterHarvesting', label: 'Rainwater Harvesting Systems', type: 'select', options: ['Yes - Multiple sites', 'Yes - Single site', 'Planned', 'No'], framework: 'CDP W1.2, CSRD E3-4', required: false },
        { key: 'wastewaterTreatment', label: 'Wastewater Treatment Facilities', type: 'select', options: ['On-site treatment', 'Third-party treatment', 'Both', 'None'], framework: 'GRI 303-1, CSRD E3-4', required: true },
        { key: 'waterMeteringSystem', label: 'Water Metering System', type: 'select', options: ['Comprehensive', 'Partial', 'Planned', 'None'], framework: 'CDP W1.2, CSRD E3-4', required: false },
      ]
    },
    {
      id: 'stakeholder',
      name: 'Stakeholder & Community',
      icon: MapPin,
      description: 'Watershed engagement and shared resources',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      fields: [
        { key: 'watershedEngagement', label: 'Watershed Partnership/Engagement', type: 'select', options: ['Yes - Active participation', 'Yes - Observer', 'No', 'Not applicable'], framework: 'GRI 303-1, CSRD E3-1, CDP W6.1', required: false },
        { key: 'communityWaterAccess', label: 'Community Water Access Programs', type: 'select', options: ['Yes', 'No', 'Not applicable'], framework: 'GRI 303-1, SDG 6, CSRD E3-1', required: false },
        { key: 'waterGovernanceParticipation', label: 'Water Governance Participation', type: 'select', options: ['Yes - Leadership role', 'Yes - Participant', 'No'], framework: 'CDP W6.1, CSRD E3-1', required: false },
        { key: 'sharedWaterResources', label: 'Facilities Sharing Water Resources', type: 'number', framework: 'GRI 303-1, CSRD E3-1', required: false, unit: 'facilities' },
        { key: 'conflictsOverWater', label: 'Water-Related Conflicts', type: 'number', framework: 'GRI 303-1, CSRD E3-1', required: true, unit: 'conflicts' },
      ]
    },
    {
      id: 'supplyChain',
      name: 'Supply Chain Water',
      icon: Factory,
      description: 'Supplier water management and risks',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      fields: [
        { key: 'supplierWaterAssessment', label: 'Supplier Water Risk Assessment', type: 'select', options: ['Yes - All suppliers', 'Yes - Critical suppliers', 'No', 'Planned'], framework: 'CDP W1.2, CSRD E3-1', required: false },
        { key: 'waterIntensiveSuppliers', label: 'Water-Intensive Suppliers Identified', type: 'number', framework: 'CDP W1.2, CSRD E3-1', required: false, unit: 'suppliers' },
        { key: 'supplierWaterTargets', label: 'Suppliers with Water Targets', type: 'number', framework: 'CDP W1.2, CSRD E3-1', required: false, unit: 'suppliers' },
        { key: 'supplyChainWaterRisk', label: 'Supply Chain Water Risk Level', type: 'select', options: ['High', 'Medium', 'Low', 'Unknown'], framework: 'CDP W1.2, CSRD E3-1', required: false },
      ]
    },
  ]

  // Calculate field counts per category
  const categoryProgress = useMemo(() => {
    return categories.map(cat => {
      const fields = cat.fields
      const filled = fields.filter(f => formData[f.key] !== '').length
      return {
        ...cat,
        progress: Math.round((filled / fields.length) * 100),
        filled,
        total: fields.length
      }
    })
  }, [formData, categories])

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard/esg/data-entry')}
            className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            <span>Back to Data Entry Hub</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="h-10 w-10" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Water Management</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-3xl">
                Comprehensive water stewardship data covering withdrawal, discharge, consumption, quality, and risk management
              </p>
              <div className="flex gap-4 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 303</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CSRD E3</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CDP Water</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SDG 6</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">TCFD</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SBTi</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{progress}%</div>
              <div className="text-blue-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Water Category Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryProgress.map(cat => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                  <cat.icon className={`h-6 w-6 ${cat.color}`} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${cat.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{cat.filled}/{cat.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Collection Forms */}
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${category.bgColor} px-6 py-4 border-l-4 border-blue-500`}>
                <div className="flex items-center gap-3">
                  <category.icon className={`h-6 w-6 ${category.color}`} strokeWidth={2} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.fields.map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="block">
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </span>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {field.framework}
                          </span>
                        </div>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          >
                            <option value="">Select...</option>
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'text' ? (
                          <input
                            type="text"
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        ) : (
                          <div className="relative">
                            <input
                              type="number"
                              step={field.step || '1'}
                              min={field.min || '0'}
                              max={field.max}
                              value={formData[field.key]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              placeholder="Enter value..."
                            />
                            {field.unit && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                {field.unit}
                              </span>
                            )}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Automated Analytics */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
          <button
            onClick={() => setShowCalculations(!showCalculations)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" strokeWidth={2} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Water Analytics & Performance Metrics</h3>
                <p className="text-sm text-gray-600">Industry benchmarks and water stewardship indicators</p>
              </div>
            </div>
            <div className="text-blue-600">
              {showCalculations ? '▼' : '▶'}
            </div>
          </button>

          {showCalculations && (
            <div className="p-6 space-y-6 border-t">
              {/* Water Balance */}
              {(() => {
                const balance = calculateWaterBalance()
                if (!balance) return null
                return (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Droplets className="h-6 w-6 text-blue-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Water Balance Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Withdrawal:</span>
                            <span className="font-semibold text-blue-600">{balance.withdrawal.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Discharge:</span>
                            <span className="font-semibold text-blue-600">{balance.discharge.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Net Consumption:</span>
                            <span className="font-semibold text-blue-600">{balance.consumption.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Consumption Rate:</span>
                            <span className="font-semibold text-blue-600">{balance.consumptionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Formula:</strong> Water Consumption = Withdrawal - Discharge. Lower consumption rates indicate higher water return to the environment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Recycling Rate */}
              {(() => {
                const recycling = calculateRecyclingRate()
                if (!recycling) return null
                return (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Recycle className="h-6 w-6 text-green-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Water Recycling & Reuse Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Recycled/Reused:</span>
                            <span className="font-semibold text-green-600">{recycling.totalRecycledReused.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Recycling Rate:</span>
                            <span className="font-semibold text-green-600">{recycling.rate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Performance Level:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              recycling.level === 'Excellent' ? 'bg-green-100 text-green-700' :
                              recycling.level === 'Good' ? 'bg-blue-100 text-blue-700' :
                              recycling.level === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {recycling.level}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-green-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Benchmarks:</strong> Excellent ≥50%, Good 30-50%, Fair 15-30%, Poor {'<'}15%. 
                              Leading companies achieve 50%+ recycling rates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Water Intensity */}
              {(() => {
                const intensity = calculateWaterIntensity()
                if (!intensity) return null
                return (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-purple-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Water Intensity Metrics</h4>
                        <div className="space-y-2">
                          {intensity.revenueIntensity && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Water per Revenue:</span>
                              <span className="font-semibold text-purple-600">{intensity.revenueIntensity} ML/M USD</span>
                            </div>
                          )}
                          {intensity.productionIntensity && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Water per Production Unit:</span>
                              <span className="font-semibold text-purple-600">{intensity.productionIntensity} ML/unit</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Usage:</strong> Track intensity over time to measure efficiency improvements. 
                              Set reduction targets aligned with SBTi or CSRD requirements.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Water Stress Exposure */}
              {(() => {
                const stress = calculateWaterStressExposure()
                if (!stress) return null
                return (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Water Stress Exposure (CDP/TCFD)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Withdrawal:</span>
                            <span className="font-semibold text-orange-600">{stress.withdrawal.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">From Water-Stressed Areas:</span>
                            <span className="font-semibold text-orange-600">{stress.stressAreas.toFixed(2)} ML</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Exposure Percentage:</span>
                            <span className="font-semibold text-orange-600">{stress.exposurePercent}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Risk Level:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              stress.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                              stress.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {stress.riskLevel}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Water Stress Definition:</strong> Areas where {'>'} 40% of available water is withdrawn annually. 
                              Use WRI Aqueduct or WWF Water Risk Filter to identify stressed areas.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* SDG 6 Alignment */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-cyan-600 mt-0.5" strokeWidth={2} />
                    <Target className="h-6 w-6 text-cyan-600 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">SDG 6: Clean Water & Sanitation</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Your water management data contributes to multiple SDG 6 targets:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-cyan-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 6.3</div>
                        <p className="text-xs text-gray-700">Improve water quality, reduce pollution, increase recycling and safe reuse</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-cyan-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 6.4</div>
                        <p className="text-xs text-gray-700">Increase water-use efficiency, ensure sustainable withdrawals</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-cyan-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 6.5</div>
                        <p className="text-xs text-gray-700">Implement integrated water resources management</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-cyan-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 6.6</div>
                        <p className="text-xs text-gray-700">Protect and restore water-related ecosystems</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold"
          >
            <Save className="h-5 w-5" strokeWidth={2} />
            Save Progress
          </button>
          <button
            onClick={handleSubmit}
            disabled={progress < 100}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              progress === 100
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            Submit Data
          </button>
        </div>

        {/* Framework Information */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Framework Coverage</h3>
              <p className="text-sm text-gray-700 mb-3">
                This water management form addresses requirements across all major ESG and water stewardship frameworks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded p-3 border border-blue-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">GRI 303 (2018)</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 303-1: Water as a shared resource</li>
                    <li>• 303-2: Management of water impacts</li>
                    <li>• 303-3: Water withdrawal</li>
                    <li>• 303-4: Water discharge</li>
                    <li>• 303-5: Water consumption</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-blue-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">CSRD & CDP</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• CSRD E3: Water and marine resources</li>
                    <li>• CDP Water Security questionnaire</li>
                    <li>• Water risk assessment (W4.1)</li>
                    <li>• Water-stressed areas disclosure</li>
                    <li>• Supply chain water risks</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-blue-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">SDG & Climate</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• SDG 6: Clean Water & Sanitation</li>
                    <li>• TCFD: Water-related physical risks</li>
                    <li>• SBTi: Water intensity targets</li>
                    <li>• WRI Aqueduct tool alignment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

