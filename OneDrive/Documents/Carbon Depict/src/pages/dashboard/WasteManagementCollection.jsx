// Cache bust 2025-10-23
import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle2, Trash2, FileText, TrendingUp,
  Factory, Recycle, RefreshCw, Package, Target, Info, BarChart3, Droplet
} from '@atoms/Icon'
import useESGMetrics from '../../hooks/useESGMetrics'

export default function WasteManagementCollection() {
  const navigate = useNavigate()
  const { createMetric, updateMetric, fetchMetrics, metrics, loading } = useESGMetrics({ 
    topic: 'Waste Management',
    pillar: 'Environmental'
  })
  
  const [saveStatus, setSaveStatus] = useState('')
  const [existingMetricId, setExistingMetricId] = useState(null)
  
  // Form state organized by category
  const [formData, setFormData] = useState({
    // Waste Generation
    totalWasteGenerated: '',
    hazardousWaste: '',
    nonHazardousWaste: '',
    wasteGenerationChange: '',
    
    // Waste by Type
    organicWaste: '',
    plasticWaste: '',
    paperCardboardWaste: '',
    metalWaste: '',
    glassWaste: '',
    electronicWaste: '',
    constructionWaste: '',
    textileWaste: '',
    
    // Waste Diversion
    wasteRecycled: '',
    wasteComposted: '',
    wasteReused: '',
    wasteRecovered: '',
    wasteIncinerated: '',
    wasteLandfilled: '',
    
    // Hazardous Waste Management
    hazardousWasteIncinerated: '',
    hazardousWasteLandfilled: '',
    hazardousWasteRecovered: '',
    hazardousWasteTransferred: '',
    hazardousWasteTreated: '',
    
    // Circular Economy
    productDesignCircularity: '',
    recyclableContentProducts: '',
    recycledInputMaterials: '',
    productTakeBackProgram: '',
    packagingReduction: '',
    
    // Waste Intensity
    wasteIntensityRevenue: '',
    wasteIntensityProduction: '',
    wasteIntensityEmployee: '',
    baselineYear: '',
    intensityReductionTarget: '',
    
    // Waste Prevention
    wastePreventionPolicy: '',
    wasteReductionTargets: '',
    zeroWasteCommitment: '',
    wasteAuditsCompleted: '',
    wasteMinimizationInvestment: '',
    
    // Food Waste (if applicable)
    foodWasteGenerated: '',
    foodWasteDiverted: '',
    foodDonated: '',
    foodComposted: '',
    
    // Plastic Management
    singleUsePlasticGenerated: '',
    singleUsePlasticEliminated: '',
    plasticPackagingUsed: '',
    recycledPlasticContent: '',
    plasticReductionTarget: '',
    
    // Extended Producer Responsibility
    eprCompliancePrograms: '',
    productTakeBackRate: '',
    eprFeesInvestment: '',
    packagingRecoveryRate: '',
    
    // Supply Chain Waste
    supplierWasteAssessment: '',
    suppliersWithWasteTargets: '',
    supplierWasteDiversionRate: '',
    supplyChainWasteRisk: '',
  })

  const [showCalculations, setShowCalculations] = useState(false)

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculation Functions
  const calculateWasteDiversionRate = useCallback(() => {
    const total = parseFloat(formData.totalWasteGenerated) || 0
    const recycled = parseFloat(formData.wasteRecycled) || 0
    const composted = parseFloat(formData.wasteComposted) || 0
    const reused = parseFloat(formData.wasteReused) || 0
    const recovered = parseFloat(formData.wasteRecovered) || 0
    
    if (total === 0) return null
    
    const diverted = recycled + composted + reused + recovered
    const diversionRate = (diverted / total) * 100
    
    return {
      total,
      diverted,
      diversionRate: diversionRate.toFixed(1),
      level: diversionRate >= 90 ? 'Zero Waste' : 
             diversionRate >= 75 ? 'Excellent' : 
             diversionRate >= 50 ? 'Good' : 
             diversionRate >= 25 ? 'Fair' : 'Poor'
    }
  }, [formData])

  const calculateWasteByDisposal = useCallback(() => {
    const total = parseFloat(formData.totalWasteGenerated) || 0
    const recycled = parseFloat(formData.wasteRecycled) || 0
    const composted = parseFloat(formData.wasteComposted) || 0
    const reused = parseFloat(formData.wasteReused) || 0
    const recovered = parseFloat(formData.wasteRecovered) || 0
    const incinerated = parseFloat(formData.wasteIncinerated) || 0
    const landfilled = parseFloat(formData.wasteLandfilled) || 0
    
    if (total === 0) return null
    
    return {
      recycled: { value: recycled, percent: ((recycled / total) * 100).toFixed(1) },
      composted: { value: composted, percent: ((composted / total) * 100).toFixed(1) },
      reused: { value: reused, percent: ((reused / total) * 100).toFixed(1) },
      recovered: { value: recovered, percent: ((recovered / total) * 100).toFixed(1) },
      incinerated: { value: incinerated, percent: ((incinerated / total) * 100).toFixed(1) },
      landfilled: { value: landfilled, percent: ((landfilled / total) * 100).toFixed(1) },
      total
    }
  }, [formData])

  const calculateCircularityScore = useCallback(() => {
    const recycledInput = parseFloat(formData.recycledInputMaterials) || 0
    const recyclableContent = parseFloat(formData.recyclableContentProducts) || 0
    const packagingReduction = parseFloat(formData.packagingReduction) || 0
    const takeBackRate = parseFloat(formData.productTakeBackRate) || 0
    
    // Circularity score out of 100
    const score = (
      (recycledInput / 100 * 25) + // 25% weight
      (recyclableContent / 100 * 25) + // 25% weight
      (packagingReduction / 100 * 25) + // 25% weight
      (takeBackRate / 100 * 25) // 25% weight
    )
    
    return {
      score: score.toFixed(1),
      level: score >= 80 ? 'Leading' : 
             score >= 60 ? 'Advanced' : 
             score >= 40 ? 'Developing' : 
             score >= 20 ? 'Basic' : 'Initial',
      metrics: {
        recycledInput,
        recyclableContent,
        packagingReduction,
        takeBackRate
      }
    }
  }, [formData])

  const calculateWasteIntensity = useCallback(() => {
    const waste = parseFloat(formData.totalWasteGenerated) || 0
    const revenue = parseFloat(formData.wasteIntensityRevenue) || 0
    const production = parseFloat(formData.wasteIntensityProduction) || 0
    
    if (waste === 0) return null
    
    const results = {}
    
    if (revenue > 0) {
      results.revenueIntensity = (waste / revenue).toFixed(2)
    }
    
    if (production > 0) {
      results.productionIntensity = (waste / production).toFixed(2)
    }
    
    return Object.keys(results).length > 0 ? results : null
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
        topic: 'Waste Management',
        metricName: 'Waste Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: parseFloat(formData.totalWasteGenerated) || 0,
        unit: 'metric tonnes',
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
      console.error('Error saving Waste Management data:', error)
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
        topic: 'Waste Management',
        metricName: 'Waste Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: parseFloat(formData.totalWasteGenerated) || 0,
        unit: 'metric tonnes',
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
      alert('Waste Management data submitted successfully and saved to database!')
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry')
      }, 1500)
    } catch (error) {
      console.error('Error submitting Waste Management data:', error)
      setSaveStatus('error')
      alert('Error submitting data. Please try again.')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }, [progress, formData, existingMetricId, createMetric, updateMetric, navigate])

  // Field categories for organization
  const categories = [
    {
      id: 'generation',
      name: 'Waste Generation',
      icon: Trash2,
      description: 'Total waste generated by type and classification',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      fields: [
        { key: 'totalWasteGenerated', label: 'Total Waste Generated (metric tonnes)', type: 'number', framework: 'GRI 306-3, CSRD E5-5, CDP W6', required: true, unit: 'tonnes', step: '0.01' },
        { key: 'hazardousWaste', label: 'Hazardous Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: true, unit: 'tonnes', step: '0.01' },
        { key: 'nonHazardousWaste', label: 'Non-Hazardous Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: true, unit: 'tonnes', step: '0.01' },
        { key: 'wasteGenerationChange', label: 'Change from Previous Year (%)', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: '%', step: '0.1' },
      ]
    },
    {
      id: 'wasteTypes',
      name: 'Waste by Material Type',
      icon: Package,
      description: 'Breakdown of waste by material composition',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      fields: [
        { key: 'organicWaste', label: 'Organic/Food Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'plasticWaste', label: 'Plastic Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'paperCardboardWaste', label: 'Paper & Cardboard', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'metalWaste', label: 'Metal Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'glassWaste', label: 'Glass Waste', type: 'number', framework: 'GRI 306-3', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'electronicWaste', label: 'Electronic Waste (E-Waste)', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'constructionWaste', label: 'Construction & Demolition Waste', type: 'number', framework: 'GRI 306-3', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'textileWaste', label: 'Textile Waste', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
      ]
    },
    {
      id: 'diversion',
      name: 'Waste Diversion & Recovery',
      icon: Recycle,
      description: 'Waste diverted from landfill through recovery operations',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fields: [
        { key: 'wasteRecycled', label: 'Waste Recycled', type: 'number', framework: 'GRI 306-4, CSRD E5-5, CDP W6', required: true, unit: 'tonnes', step: '0.01' },
        { key: 'wasteComposted', label: 'Waste Composted', type: 'number', framework: 'GRI 306-4, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'wasteReused', label: 'Waste Reused', type: 'number', framework: 'GRI 306-4, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'wasteRecovered', label: 'Waste Recovered (energy recovery)', type: 'number', framework: 'GRI 306-4, CDP W6', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'wasteIncinerated', label: 'Waste Incinerated (without energy recovery)', type: 'number', framework: 'GRI 306-5, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'wasteLandfilled', label: 'Waste Landfilled', type: 'number', framework: 'GRI 306-5, CSRD E5-5, CDP W6', required: true, unit: 'tonnes', step: '0.01' },
      ]
    },
    {
      id: 'hazardous',
      name: 'Hazardous Waste Management',
      icon: AlertCircle,
      description: 'Specialized handling of hazardous waste streams',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      fields: [
        { key: 'hazardousWasteIncinerated', label: 'Hazardous Waste Incinerated', type: 'number', framework: 'GRI 306-5, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'hazardousWasteLandfilled', label: 'Hazardous Waste Landfilled', type: 'number', framework: 'GRI 306-5, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'hazardousWasteRecovered', label: 'Hazardous Waste Recovered', type: 'number', framework: 'GRI 306-4, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'hazardousWasteTransferred', label: 'Hazardous Waste Transferred Off-Site', type: 'number', framework: 'GRI 306-5, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'hazardousWasteTreated', label: 'Hazardous Waste Treated On-Site', type: 'number', framework: 'GRI 306-4, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
      ]
    },
    {
      id: 'circular',
      name: 'Circular Economy',
      icon: RefreshCw,
      description: 'Product design and material circularity metrics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fields: [
        { key: 'productDesignCircularity', label: 'Product Design for Circularity', type: 'select', options: ['All products', 'Most products', 'Some products', 'None'], framework: 'CSRD E5-5, SBTi', required: false },
        { key: 'recyclableContentProducts', label: 'Products with Recyclable Content (%)', type: 'number', framework: 'CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
        { key: 'recycledInputMaterials', label: 'Recycled Input Materials (%)', type: 'number', framework: 'GRI 301-2, CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
        { key: 'productTakeBackProgram', label: 'Product Take-Back Program', type: 'select', options: ['Yes - Comprehensive', 'Yes - Limited', 'Pilot program', 'No'], framework: 'GRI 306-2, CSRD E5-5', required: false },
        { key: 'packagingReduction', label: 'Packaging Material Reduction (%)', type: 'number', framework: 'CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
      ]
    },
    {
      id: 'intensity',
      name: 'Waste Intensity',
      icon: TrendingUp,
      description: 'Waste generation efficiency metrics',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fields: [
        { key: 'wasteIntensityRevenue', label: 'Revenue (million USD)', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'M USD', step: '0.01' },
        { key: 'wasteIntensityProduction', label: 'Production Volume (units)', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'units', step: '1' },
        { key: 'wasteIntensityEmployee', label: 'Number of Employees', type: 'number', framework: 'GRI 306-3', required: false, unit: 'employees' },
        { key: 'baselineYear', label: 'Baseline Year for Intensity', type: 'number', framework: 'GRI 306-3, CSRD E5-5', required: false, unit: 'year', min: '2000', max: '2025' },
        { key: 'intensityReductionTarget', label: 'Intensity Reduction Target (%)', type: 'number', framework: 'CSRD E5-5, SBTi', required: false, unit: '%', step: '0.1' },
      ]
    },
    {
      id: 'prevention',
      name: 'Waste Prevention & Reduction',
      icon: Target,
      description: 'Policies, targets, and waste minimization initiatives',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      fields: [
        { key: 'wastePreventionPolicy', label: 'Waste Prevention Policy', type: 'select', options: ['Yes - Board approved', 'Yes - Management approved', 'In development', 'No'], framework: 'GRI 306-2, CSRD E5-5', required: true },
        { key: 'wasteReductionTargets', label: 'Waste Reduction Targets Set', type: 'select', options: ['Yes - Absolute', 'Yes - Intensity', 'Yes - Both', 'No'], framework: 'GRI 306-2, CSRD E5-5, SBTi', required: true },
        { key: 'zeroWasteCommitment', label: 'Zero Waste Commitment', type: 'select', options: ['Yes - Certified', 'Yes - Committed', 'Planned', 'No'], framework: 'CDP W6, CSRD E5-5', required: false },
        { key: 'wasteAuditsCompleted', label: 'Waste Audits Completed (last year)', type: 'number', framework: 'GRI 306-2, CSRD E5-5', required: false, unit: 'audits' },
        { key: 'wasteMinimizationInvestment', label: 'Investment in Waste Minimization (USD)', type: 'number', framework: 'CSRD E5-5', required: false, unit: 'USD', step: '1' },
      ]
    },
    {
      id: 'foodWaste',
      name: 'Food Waste (if applicable)',
      icon: Droplet,
      description: 'Food loss and waste management',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      fields: [
        { key: 'foodWasteGenerated', label: 'Food Waste Generated', type: 'number', framework: 'GRI 306-3, SDG 12.3, CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'foodWasteDiverted', label: 'Food Waste Diverted from Landfill', type: 'number', framework: 'GRI 306-4, SDG 12.3', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'foodDonated', label: 'Food Donated', type: 'number', framework: 'GRI 306-4, SDG 12.3', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'foodComposted', label: 'Food Waste Composted', type: 'number', framework: 'GRI 306-4, SDG 12.3', required: false, unit: 'tonnes', step: '0.01' },
      ]
    },
    {
      id: 'plastic',
      name: 'Plastic Management',
      icon: Package,
      description: 'Single-use plastic reduction and management',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      fields: [
        { key: 'singleUsePlasticGenerated', label: 'Single-Use Plastic Generated', type: 'number', framework: 'CSRD E5-5, CDP W6', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'singleUsePlasticEliminated', label: 'Single-Use Plastic Eliminated', type: 'number', framework: 'CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'plasticPackagingUsed', label: 'Total Plastic Packaging Used', type: 'number', framework: 'CSRD E5-5', required: false, unit: 'tonnes', step: '0.01' },
        { key: 'recycledPlasticContent', label: 'Recycled Plastic Content (%)', type: 'number', framework: 'CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
        { key: 'plasticReductionTarget', label: 'Plastic Reduction Target (%)', type: 'number', framework: 'CSRD E5-5', required: false, unit: '%', step: '0.1' },
      ]
    },
    {
      id: 'epr',
      name: 'Extended Producer Responsibility',
      icon: RefreshCw,
      description: 'EPR compliance and product stewardship',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      fields: [
        { key: 'eprCompliancePrograms', label: 'EPR Compliance Programs', type: 'number', framework: 'GRI 306-2, CSRD E5-5', required: false, unit: 'programs' },
        { key: 'productTakeBackRate', label: 'Product Take-Back Rate (%)', type: 'number', framework: 'GRI 306-2, CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
        { key: 'eprFeesInvestment', label: 'EPR Fees Investment (USD)', type: 'number', framework: 'CSRD E5-5', required: false, unit: 'USD', step: '1' },
        { key: 'packagingRecoveryRate', label: 'Packaging Recovery Rate (%)', type: 'number', framework: 'GRI 306-2, CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
      ]
    },
    {
      id: 'supplyChain',
      name: 'Supply Chain Waste',
      icon: Factory,
      description: 'Supplier waste management and risks',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      fields: [
        { key: 'supplierWasteAssessment', label: 'Supplier Waste Assessment', type: 'select', options: ['Yes - All suppliers', 'Yes - Critical suppliers', 'No', 'Planned'], framework: 'CSRD E5-5', required: false },
        { key: 'suppliersWithWasteTargets', label: 'Suppliers with Waste Targets', type: 'number', framework: 'CSRD E5-5', required: false, unit: 'suppliers' },
        { key: 'supplierWasteDiversionRate', label: 'Supplier Avg. Waste Diversion Rate (%)', type: 'number', framework: 'CSRD E5-5', required: false, unit: '%', max: 100, step: '0.1' },
        { key: 'supplyChainWasteRisk', label: 'Supply Chain Waste Risk Level', type: 'select', options: ['High', 'Medium', 'Low', 'Unknown'], framework: 'CSRD E5-5', required: false },
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
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard/esg/data-entry')}
            className="flex items-center gap-2 text-red-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            <span>Back to Data Entry Hub</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trash2 className="h-10 w-10" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Waste Management</h1>
              </div>
              <p className="text-red-100 text-lg max-w-3xl">
                Comprehensive waste data covering generation, diversion, circular economy, and zero waste initiatives
              </p>
              <div className="flex gap-4 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 306</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CSRD E5</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CDP Waste</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SDG 12</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">TCFD</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SBTi</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{progress}%</div>
              <div className="text-red-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Waste Category Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        className={`h-full transition-all duration-500 ${cat.progress === 100 ? 'bg-green-500' : 'bg-red-500'}`}
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
              <div className={`${category.bgColor} px-6 py-4 border-l-4 border-red-500`}>
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
                          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            {field.framework}
                          </span>
                        </div>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
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
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
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
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-red-600" strokeWidth={2} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Waste Analytics & Performance Metrics</h3>
                <p className="text-sm text-gray-600">Zero waste goals, circular economy, and diversion rates</p>
              </div>
            </div>
            <div className="text-red-600">
              {showCalculations ? '▼' : '▶'}
            </div>
          </button>

          {showCalculations && (
            <div className="p-6 space-y-6 border-t">
              {/* Waste Diversion Rate */}
              {(() => {
                const diversion = calculateWasteDiversionRate()
                if (!diversion) return null
                return (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Recycle className="h-6 w-6 text-green-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Waste Diversion Rate (Zero Waste Goal)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Waste Generated:</span>
                            <span className="font-semibold text-green-600">{diversion.total.toFixed(2)} tonnes</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Waste Diverted from Landfill:</span>
                            <span className="font-semibold text-green-600">{diversion.diverted.toFixed(2)} tonnes</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Diversion Rate:</span>
                            <span className="font-semibold text-green-600">{diversion.diversionRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Performance Level:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              diversion.level === 'Zero Waste' ? 'bg-green-700 text-white' :
                              diversion.level === 'Excellent' ? 'bg-green-100 text-green-700' :
                              diversion.level === 'Good' ? 'bg-blue-100 text-blue-700' :
                              diversion.level === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {diversion.level}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-green-200">
                          <div className="flex items-start gap-2">
                        <Target className="h-6 w-6 text-orange-600 mt-0.5" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Zero Waste Certification:</strong> ≥90% diversion. Excellent: 75-89%, Good: 50-74%, Fair: 25-49%, Poor: {'<'}25%. 
                              Diversion includes recycling, composting, reuse, and energy recovery.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Waste by Disposal Method */}
              {(() => {
                const disposal = calculateWasteByDisposal()
                if (!disposal) return null
                return (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-6 w-6 text-blue-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Waste Hierarchy Performance (GRI 306-4/306-5)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">♻️ Recycled:</span>
                            <span className="font-semibold text-blue-600">{disposal.recycled.value.toFixed(2)} t ({disposal.recycled.percent}%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">🌱 Composted:</span>
                            <span className="font-semibold text-blue-600">{disposal.composted.value.toFixed(2)} t ({disposal.composted.percent}%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">🔄 Reused:</span>
                            <span className="font-semibold text-blue-600">{disposal.reused.value.toFixed(2)} t ({disposal.reused.percent}%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">⚡ Recovered (energy):</span>
                            <span className="font-semibold text-blue-600">{disposal.recovered.value.toFixed(2)} t ({disposal.recovered.percent}%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">🔥 Incinerated (no energy):</span>
                            <span className="font-semibold text-orange-600">{disposal.incinerated.value.toFixed(2)} t ({disposal.incinerated.percent}%)</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">🚮 Landfilled:</span>
                            <span className="font-semibold text-red-600">{disposal.landfilled.value.toFixed(2)} t ({disposal.landfilled.percent}%)</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Waste Hierarchy:</strong> Prioritize prevention, reuse, recycling, recovery, then disposal. 
                              Minimize landfill and incineration without energy recovery.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Circularity Score */}
              {(() => {
                const circular = calculateCircularityScore()
                if (!circular || circular.score === '0.0') return null
                return (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="h-6 w-6 text-purple-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Circular Economy Performance Score</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Overall Circularity Score:</span>
                            <span className="font-semibold text-purple-600">{circular.score}/100</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Maturity Level:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              circular.level === 'Leading' ? 'bg-purple-700 text-white' :
                              circular.level === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                              circular.level === 'Developing' ? 'bg-blue-100 text-blue-700' :
                              circular.level === 'Basic' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {circular.level}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <div className="bg-white rounded p-2 border border-purple-200">
                            <div className="text-xs text-gray-600">Recycled Input Materials</div>
                            <div className="text-lg font-semibold text-purple-600">{circular.metrics.recycledInput}%</div>
                          </div>
                          <div className="bg-white rounded p-2 border border-purple-200">
                            <div className="text-xs text-gray-600">Recyclable Content</div>
                            <div className="text-lg font-semibold text-purple-600">{circular.metrics.recyclableContent}%</div>
                          </div>
                          <div className="bg-white rounded p-2 border border-purple-200">
                            <div className="text-xs text-gray-600">Packaging Reduction</div>
                            <div className="text-lg font-semibold text-purple-600">{circular.metrics.packagingReduction}%</div>
                          </div>
                          <div className="bg-white rounded p-2 border border-purple-200">
                            <div className="text-xs text-gray-600">Product Take-Back Rate</div>
                            <div className="text-lg font-semibold text-purple-600">{circular.metrics.takeBackRate}%</div>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Circular Economy:</strong> Leading (80-100), Advanced (60-79), Developing (40-59), Basic (20-39), Initial ({'<'}20). 
                              Score based on 4 equal components: recycled inputs, recyclable products, packaging reduction, take-back programs.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Waste Intensity */}
              {(() => {
                const intensity = calculateWasteIntensity()
                if (!intensity) return null
                return (
                  <div className="bg-teal-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-teal-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Waste Intensity Metrics</h4>
                        <div className="space-y-2">
                          {intensity.revenueIntensity && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Waste per Revenue:</span>
                              <span className="font-semibold text-teal-600">{intensity.revenueIntensity} tonnes/M USD</span>
                            </div>
                          )}
                          {intensity.productionIntensity && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">Waste per Production Unit:</span>
                              <span className="font-semibold text-teal-600">{intensity.productionIntensity} tonnes/unit</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-teal-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>Usage:</strong> Track intensity over time to measure efficiency improvements. 
                              Set reduction targets aligned with SBTi or CSRD requirements (e.g., 30% intensity reduction by 2030).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* SDG 12 Alignment */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-orange-600 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">SDG 12: Responsible Consumption & Production</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Your waste management data contributes to multiple SDG 12 targets:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-orange-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 12.3</div>
                        <p className="text-xs text-gray-700">Halve per capita food waste, reduce food losses (food waste reporting)</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-orange-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 12.4</div>
                        <p className="text-xs text-gray-700">Responsible management of chemicals and wastes (hazardous waste tracking)</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-orange-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 12.5</div>
                        <p className="text-xs text-gray-700">Reduce waste generation through prevention, reduction, recycling, reuse (diversion rate)</p>
                      </div>
                      <div className="bg-white rounded p-3 border border-orange-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Target 12.6</div>
                        <p className="text-xs text-gray-700">Encourage companies to adopt sustainable practices and reporting (waste disclosure)</p>
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
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-all font-semibold"
          >
            <Save className="h-5 w-5" strokeWidth={2} />
            Save Progress
          </button>
          <button
            onClick={handleSubmit}
            disabled={progress < 100}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              progress === 100
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            Submit Data
          </button>
        </div>

        {/* Framework Information */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-red-600 flex-shrink-0" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Framework Coverage</h3>
              <p className="text-sm text-gray-700 mb-3">
                This waste management form addresses requirements across all major ESG frameworks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded p-3 border border-red-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">GRI 306 (2020)</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• 306-1: Waste generation and impacts</li>
                    <li>• 306-2: Management of waste impacts</li>
                    <li>• 306-3: Waste generated</li>
                    <li>• 306-4: Waste diverted from disposal</li>
                    <li>• 306-5: Waste directed to disposal</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-red-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">CSRD & CDP</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• CSRD E5: Resource use and circular economy</li>
                    <li>• CDP W6: Waste management</li>
                    <li>• Circular economy metrics</li>
                    <li>• Extended Producer Responsibility</li>
                    <li>• Supply chain waste tracking</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-red-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">SDG & Other</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• SDG 12: Responsible consumption</li>
                    <li>• TCFD: Waste-related transition risks</li>
                    <li>• SBTi: Waste intensity targets</li>
                    <li>• Zero Waste certification alignment</li>
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

