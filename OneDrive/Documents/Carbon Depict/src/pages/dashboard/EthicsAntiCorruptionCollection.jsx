// Cache bust 2025-10-23
import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle2, Shield, FileText, Users,
  AlertTriangle, BookOpen, Target, TrendingUp, Eye, Info
} from '@atoms/Icon'

export default function EthicsAntiCorruptionCollection() {
  const navigate = useNavigate()
  
  // Form state organized by category
  const [formData, setFormData] = useState({
    // Policies & Procedures
    codeOfConductExists: '',
    codeOfConductLastUpdated: '',
    antiCorruptionPolicyExists: '',
    antiCorruptionPolicyScope: '',
    whistleblowerPolicyExists: '',
    conflictOfInterestPolicyExists: '',
    giftsPolicyExists: '',
    
    // Training & Communication
    ethicsTrainingEmployees: '',
    ethicsTrainingHours: '',
    ethicsTrainingCompletion: '',
    antiCorruptionTrainingManagement: '',
    antiCorruptionTrainingBoard: '',
    communicationFrequency: '',
    
    // Risk Assessment
    corruptionRiskAssessmentConducted: '',
    corruptionRiskAssessmentDate: '',
    highRiskOperations: '',
    highRiskCountries: '',
    dueDiligenceOnPartners: '',
    
    // Incidents & Cases
    corruptionIncidents: '',
    corruptionIncidentsConfirmed: '',
    employeesDismissed: '',
    contractsTerminated: '',
    legalActions: '',
    finesMonetary: '',
    
    // Whistleblowing
    whistleblowerReports: '',
    whistleblowerReportsSubstantiated: '',
    whistleblowerReportsResolved: '',
    whistleblowerRetaliation: '',
    anonymousReportingAvailable: '',
    
    // Political Contributions
    politicalContributionsAllowed: '',
    politicalContributionsAmount: '',
    politicalContributionsRecipients: '',
    lobbyingActivities: '',
    lobbyingExpenditure: '',
    
    // Supply Chain
    supplierCodeOfConduct: '',
    suppliersAssessed: '',
    suppliersHighRisk: '',
    supplierAudits: '',
    supplierTraining: '',
  })

  const [showCalculations, setShowCalculations] = useState(false)

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculation Functions
  const calculateTrainingCoverage = useCallback((trained, total) => {
    if (!trained || !total || parseFloat(total) === 0) return null
    const coverage = (parseFloat(trained) / parseFloat(total)) * 100
    return coverage.toFixed(1)
  }, [])

  const calculateIncidentRate = useCallback((incidents, employees) => {
    if (!incidents || !employees || parseFloat(employees) === 0) return null
    const rate = (parseFloat(incidents) / parseFloat(employees)) * 1000
    return rate.toFixed(2)
  }, [])

  const calculateResolutionRate = useCallback((resolved, total) => {
    if (!resolved || !total || parseFloat(total) === 0) return null
    const rate = (parseFloat(resolved) / parseFloat(total)) * 100
    return rate.toFixed(1)
  }, [])

  const calculateSupplierRiskPercentage = useCallback((highRisk, assessed) => {
    if (!highRisk || !assessed || parseFloat(assessed) === 0) return null
    const percentage = (parseFloat(highRisk) / parseFloat(assessed)) * 100
    return percentage.toFixed(1)
  }, [])

  // Progress calculation
  const progress = useMemo(() => {
    const totalFields = Object.keys(formData).length
    const filledFields = Object.values(formData).filter(v => v !== '').length
    return Math.round((filledFields / totalFields) * 100)
  }, [formData])

  const handleSave = useCallback(() => {
    console.log('Saving Ethics & Anti-Corruption data:', formData)
    alert('Data saved successfully! (This would save to backend in production)')
  }, [formData])

  const handleSubmit = useCallback(() => {
    if (progress < 100) {
      alert('Please complete all fields before submitting.')
      return
    }
    console.log('Submitting Ethics & Anti-Corruption data:', formData)
    alert('Data submitted successfully! (This would submit to backend in production)')
  }, [progress, formData])

  // Field categories for organization
  const categories = [
    {
      id: 'policies',
      name: 'Policies & Procedures',
      icon: Shield,
      description: 'Core ethics and anti-corruption policies',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      fields: [
        { key: 'codeOfConductExists', label: 'Code of Conduct in Place', type: 'select', options: ['Yes', 'No', 'In Development'], framework: 'GRI 2-23, 2-24', required: true },
        { key: 'codeOfConductLastUpdated', label: 'Code of Conduct Last Updated', type: 'date', framework: 'GRI 2-24', required: false },
        { key: 'antiCorruptionPolicyExists', label: 'Anti-Corruption Policy Exists', type: 'select', options: ['Yes', 'No', 'Under Review'], framework: 'GRI 205-2, CSRD G1-4', required: true },
        { key: 'antiCorruptionPolicyScope', label: 'Anti-Corruption Policy Scope', type: 'select', options: ['All employees', 'Employees + Board', 'Entire value chain', 'Limited scope'], framework: 'GRI 205-2', required: true },
        { key: 'whistleblowerPolicyExists', label: 'Whistleblower Protection Policy', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-26, CSRD G1-1', required: true },
        { key: 'conflictOfInterestPolicyExists', label: 'Conflict of Interest Policy', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-15', required: true },
        { key: 'giftsPolicyExists', label: 'Gifts & Hospitality Policy', type: 'select', options: ['Yes', 'No'], framework: 'GRI 205-2', required: false },
      ]
    },
    {
      id: 'training',
      name: 'Training & Communication',
      icon: BookOpen,
      description: 'Ethics training programs and communication',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      fields: [
        { key: 'ethicsTrainingEmployees', label: 'Employees Receiving Ethics Training (number)', type: 'number', framework: 'GRI 205-2', required: true, unit: 'employees' },
        { key: 'ethicsTrainingHours', label: 'Average Training Hours per Employee', type: 'number', framework: 'GRI 205-2', required: false, unit: 'hours', step: '0.1' },
        { key: 'ethicsTrainingCompletion', label: 'Training Completion Rate', type: 'number', framework: 'GRI 205-2', required: false, unit: '%', max: 100 },
        { key: 'antiCorruptionTrainingManagement', label: 'Management Trained on Anti-Corruption', type: 'number', framework: 'GRI 205-2', required: true, unit: '%', max: 100 },
        { key: 'antiCorruptionTrainingBoard', label: 'Board Members Trained on Anti-Corruption', type: 'number', framework: 'GRI 205-2, CSRD G1-1', required: true, unit: '%', max: 100 },
        { key: 'communicationFrequency', label: 'Ethics Communication Frequency', type: 'select', options: ['Continuous', 'Quarterly', 'Annually', 'As needed'], framework: 'GRI 2-24', required: false },
      ]
    },
    {
      id: 'riskAssessment',
      name: 'Risk Assessment',
      icon: AlertTriangle,
      description: 'Corruption risk assessment and due diligence',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      fields: [
        { key: 'corruptionRiskAssessmentConducted', label: 'Corruption Risk Assessment Conducted', type: 'select', options: ['Yes', 'No', 'In Progress'], framework: 'GRI 205-1, CSRD G1-4', required: true },
        { key: 'corruptionRiskAssessmentDate', label: 'Most Recent Assessment Date', type: 'date', framework: 'GRI 205-1', required: false },
        { key: 'highRiskOperations', label: 'Number of High-Risk Operations Identified', type: 'number', framework: 'GRI 205-1', required: false, unit: 'operations' },
        { key: 'highRiskCountries', label: 'Operations in High-Risk Countries', type: 'number', framework: 'GRI 205-1', required: false, unit: 'countries' },
        { key: 'dueDiligenceOnPartners', label: 'Due Diligence on Business Partners', type: 'select', options: ['Yes - All partners', 'Yes - High-risk only', 'No', 'Partial'], framework: 'GRI 205-1, CSRD G1-4', required: true },
      ]
    },
    {
      id: 'incidents',
      name: 'Incidents & Cases',
      icon: AlertCircle,
      description: 'Corruption incidents and disciplinary actions',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      fields: [
        { key: 'corruptionIncidents', label: 'Corruption Incidents Reported', type: 'number', framework: 'GRI 205-3, CSRD G1-4', required: true, unit: 'incidents' },
        { key: 'corruptionIncidentsConfirmed', label: 'Incidents Confirmed After Investigation', type: 'number', framework: 'GRI 205-3', required: true, unit: 'incidents' },
        { key: 'employeesDismissed', label: 'Employees Dismissed for Corruption', type: 'number', framework: 'GRI 205-3', required: true, unit: 'employees' },
        { key: 'contractsTerminated', label: 'Contracts Terminated Due to Corruption', type: 'number', framework: 'GRI 205-3', required: false, unit: 'contracts' },
        { key: 'legalActions', label: 'Legal Actions for Anti-Competitive Behavior', type: 'number', framework: 'GRI 206-1', required: true, unit: 'actions' },
        { key: 'finesMonetary', label: 'Monetary Value of Fines (USD)', type: 'number', framework: 'GRI 206-1, CSRD G1-4', required: false, unit: 'USD' },
      ]
    },
    {
      id: 'whistleblowing',
      name: 'Whistleblowing & Grievances',
      icon: Eye,
      description: 'Whistleblower mechanisms and case management',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      fields: [
        { key: 'whistleblowerReports', label: 'Whistleblower Reports Received', type: 'number', framework: 'GRI 2-26, CSRD G1-1', required: true, unit: 'reports' },
        { key: 'whistleblowerReportsSubstantiated', label: 'Reports Substantiated', type: 'number', framework: 'GRI 2-26', required: false, unit: 'reports' },
        { key: 'whistleblowerReportsResolved', label: 'Reports Resolved', type: 'number', framework: 'GRI 2-26', required: false, unit: 'reports' },
        { key: 'whistleblowerRetaliation', label: 'Cases of Whistleblower Retaliation', type: 'number', framework: 'GRI 2-26', required: true, unit: 'cases' },
        { key: 'anonymousReportingAvailable', label: 'Anonymous Reporting Mechanism Available', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-26, CSRD G1-1', required: true },
      ]
    },
    {
      id: 'political',
      name: 'Political Contributions',
      icon: Target,
      description: 'Political contributions and lobbying activities',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      fields: [
        { key: 'politicalContributionsAllowed', label: 'Political Contributions Allowed', type: 'select', options: ['Yes', 'No', 'With restrictions'], framework: 'GRI 415-1', required: true },
        { key: 'politicalContributionsAmount', label: 'Total Political Contributions (USD)', type: 'number', framework: 'GRI 415-1', required: false, unit: 'USD' },
        { key: 'politicalContributionsRecipients', label: 'Number of Recipients', type: 'number', framework: 'GRI 415-1', required: false, unit: 'recipients' },
        { key: 'lobbyingActivities', label: 'Lobbying Activities Conducted', type: 'select', options: ['Yes', 'No'], framework: 'GRI 415-1', required: false },
        { key: 'lobbyingExpenditure', label: 'Lobbying Expenditure (USD)', type: 'number', framework: 'GRI 415-1', required: false, unit: 'USD' },
      ]
    },
    {
      id: 'supplyChain',
      name: 'Supply Chain Ethics',
      icon: Users,
      description: 'Supplier ethics assessment and management',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      fields: [
        { key: 'supplierCodeOfConduct', label: 'Supplier Code of Conduct Required', type: 'select', options: ['Yes', 'No', 'For critical suppliers'], framework: 'GRI 205-2, CSRD G1-4', required: true },
        { key: 'suppliersAssessed', label: 'Suppliers Assessed for Corruption Risk', type: 'number', framework: 'GRI 205-2', required: false, unit: 'suppliers' },
        { key: 'suppliersHighRisk', label: 'Suppliers Identified as High-Risk', type: 'number', framework: 'GRI 205-2', required: false, unit: 'suppliers' },
        { key: 'supplierAudits', label: 'Supplier Ethics Audits Conducted', type: 'number', framework: 'GRI 205-2', required: false, unit: 'audits' },
        { key: 'supplierTraining', label: 'Suppliers Receiving Ethics Training', type: 'number', framework: 'GRI 205-2', required: false, unit: 'suppliers' },
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard/esg/data-entry')}
            className="flex items-center gap-2 text-purple-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            <span>Back to Data Entry Hub</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-10 w-10" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Ethics & Anti-Corruption</h1>
              </div>
              <p className="text-purple-100 text-lg max-w-3xl">
                Comprehensive data collection for ethics policies, anti-corruption measures, and integrity management
              </p>
              <div className="flex gap-4 mt-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 205 (Anti-corruption)</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 206 (Anti-competitive)</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 415 (Political)</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CSRD G1</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SDG 16</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{progress}%</div>
              <div className="text-purple-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Progress</h2>
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
                        className={`h-full transition-all duration-500 ${cat.progress === 100 ? 'bg-green-500' : 'bg-purple-500'}`}
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
              <div className={`${category.bgColor} px-6 py-4 border-l-4 border-purple-500`}>
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
                          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                            {field.framework}
                          </span>
                        </div>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                          >
                            <option value="">Select...</option>
                            {field.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'date' ? (
                          <input
                            type="date"
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                          />
                        ) : (
                          <div className="relative">
                            <input
                              type="number"
                              step={field.step || '1'}
                              min="0"
                              max={field.max}
                              value={formData[field.key]}
                              onChange={(e) => handleInputChange(field.key, e.target.value)}
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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

        {/* Automated Calculations */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
          <button
            onClick={() => setShowCalculations(!showCalculations)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-purple-600" strokeWidth={2} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Automated Analytics & Calculations</h3>
                <p className="text-sm text-gray-600">Industry-standard ethics and compliance metrics</p>
              </div>
            </div>
            <div className="text-purple-600">
              {showCalculations ? '▼' : '▶'}
            </div>
          </button>

          {showCalculations && (
            <div className="p-6 space-y-6 border-t">
              {/* Training Coverage */}
              {formData.ethicsTrainingEmployees && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-6 w-6 text-blue-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Ethics Training Coverage</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Employees Trained:</span>
                          <span className="font-semibold text-blue-600">{formData.ethicsTrainingEmployees}</span>
                        </div>
                        {formData.ethicsTrainingCompletion && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Completion Rate:</span>
                            <span className="font-semibold text-blue-600">{formData.ethicsTrainingCompletion}%</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <p className="text-xs text-gray-600">
                            <strong>Best Practice:</strong> 100% of employees should receive ethics training annually. 
                            Management and board should receive specialized anti-corruption training.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Incident Rate */}
              {formData.corruptionIncidents !== '' && (
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Corruption Incidents Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Total Incidents Reported:</span>
                          <span className="font-semibold text-red-600">{formData.corruptionIncidents || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Confirmed Cases:</span>
                          <span className="font-semibold text-red-600">{formData.corruptionIncidentsConfirmed || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Employees Dismissed:</span>
                          <span className="font-semibold text-red-600">{formData.employeesDismissed || 0}</span>
                        </div>
                        {formData.finesMonetary && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Fines Paid:</span>
                            <span className="font-semibold text-red-600">${parseFloat(formData.finesMonetary).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-red-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <p className="text-xs text-gray-600">
                            <strong>Target:</strong> Zero confirmed corruption incidents. Any confirmed case requires 
                            immediate investigation, disciplinary action, and remedial measures.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Whistleblower Resolution */}
              {formData.whistleblowerReports && formData.whistleblowerReportsResolved && (
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Eye className="h-6 w-6 text-teal-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Whistleblower Case Resolution</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Total Reports:</span>
                          <span className="font-semibold text-teal-600">{formData.whistleblowerReports}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Resolved Cases:</span>
                          <span className="font-semibold text-teal-600">{formData.whistleblowerReportsResolved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Resolution Rate:</span>
                          <span className="font-semibold text-teal-600">
                            {calculateResolutionRate(formData.whistleblowerReportsResolved, formData.whistleblowerReports)}%
                          </span>
                        </div>
                        {formData.whistleblowerRetaliation !== '' && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Retaliation Cases:</span>
                            <span className={`font-semibold ${formData.whistleblowerRetaliation === '0' ? 'text-green-600' : 'text-red-600'}`}>
                              {formData.whistleblowerRetaliation}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-teal-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <p className="text-xs text-gray-600">
                            <strong>Best Practice:</strong> {'>'} 90% resolution rate within 60 days. Zero tolerance 
                            for whistleblower retaliation. Anonymous reporting mechanism essential.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Supply Chain Risk */}
              {formData.suppliersAssessed && formData.suppliersHighRisk && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-6 w-6 text-green-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Supply Chain Ethics Risk</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Suppliers Assessed:</span>
                          <span className="font-semibold text-green-600">{formData.suppliersAssessed}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">High-Risk Suppliers:</span>
                          <span className="font-semibold text-green-600">{formData.suppliersHighRisk}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">High-Risk Percentage:</span>
                          <span className="font-semibold text-green-600">
                            {calculateSupplierRiskPercentage(formData.suppliersHighRisk, formData.suppliersAssessed)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-green-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <p className="text-xs text-gray-600">
                            <strong>Target:</strong> {'<'} 10% high-risk suppliers. All high-risk suppliers should 
                            undergo enhanced due diligence and regular audits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SDG 16 Alignment */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-indigo-600 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">SDG 16: Peace, Justice & Strong Institutions</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Your ethics and anti-corruption data contributes to SDG Target 16.5: "Substantially reduce 
                      corruption and bribery in all their forms"
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-indigo-200">
                        <div className="text-xs text-gray-600 mb-1">Key Indicators:</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Zero corruption incidents</li>
                          <li>• 100% anti-corruption training</li>
                          <li>• Effective whistleblower protection</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded p-3 border border-indigo-200">
                        <div className="text-xs text-gray-600 mb-1">Alignment Actions:</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Regular risk assessments</li>
                          <li>• Transparent reporting</li>
                          <li>• Supply chain due diligence</li>
                        </ul>
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
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all font-semibold"
          >
            <Save className="h-5 w-5" strokeWidth={2} />
            Save Progress
          </button>
          <button
            onClick={handleSubmit}
            disabled={progress < 100}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              progress === 100
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            Submit Data
          </button>
        </div>

        {/* Framework Information */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-purple-600 flex-shrink-0" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Framework Compliance</h3>
              <p className="text-sm text-gray-700 mb-3">
                This form collects data required for multiple ESG reporting frameworks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded p-3 border border-purple-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">GRI Standards</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• GRI 2-15: Conflicts of interest</li>
                    <li>• GRI 2-23, 2-24: Policy commitments</li>
                    <li>• GRI 2-26: Mechanisms for seeking advice</li>
                    <li>• GRI 205: Anti-corruption (205-1, 205-2, 205-3)</li>
                    <li>• GRI 206: Anti-competitive behavior</li>
                    <li>• GRI 415: Political contributions</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-purple-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">CSRD & SDG</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• CSRD G1-1: Business conduct governance</li>
                    <li>• CSRD G1-4: Anti-corruption & bribery</li>
                    <li>• SDG 16.5: Reduce corruption and bribery</li>
                    <li>• SDG 16.6: Effective, accountable institutions</li>
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

