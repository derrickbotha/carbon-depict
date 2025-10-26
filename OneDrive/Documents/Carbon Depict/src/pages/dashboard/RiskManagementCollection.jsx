import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Save, AlertCircle, CheckCircle2, Shield, FileText, TrendingDown,
  AlertTriangle, Activity, Thermometer, Lock, Cloud, Target, Info, BarChart3
} from '@atoms/Icon'
import useESGMetrics from '../../hooks/useESGMetrics'

// Icon mapping to resolve string names to actual icon components
const iconMap = {
  'Shield': Shield,
  'Cloud': Cloud,
  'Target': Target,
  'Activity': Activity,
  'TrendingDown': TrendingDown,
  'Lock': Lock,
  'Thermometer': Thermometer,
  'CheckCircle2': CheckCircle2,
  'BarChart3': BarChart3,
  'AlertTriangle': AlertTriangle
}

// Field categories for organization - defined outside component to avoid initialization order issues
const riskCategories = [
  {
    id: 'framework',
    name: 'Enterprise Risk Management Framework',
    icon: 'Shield',
    description: 'Overall risk management structure and governance',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    fields: [
      { key: 'ermFrameworkExists', label: 'ERM Framework Established', type: 'select', options: ['Yes', 'No', 'In Development'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'ermFrameworkStandard', label: 'Framework Standard', type: 'select', options: ['COSO ERM', 'ISO 31000', 'Custom', 'Other'], framework: 'GRI 2-12', required: false },
      { key: 'ermLastReview', label: 'Framework Last Reviewed', type: 'date', framework: 'GRI 2-12', required: false },
      { key: 'boardOversightFrequency', label: 'Board Risk Oversight Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually'], framework: 'GRI 2-13, TCFD Governance', required: true },
      { key: 'riskCommitteeExists', label: 'Dedicated Risk Committee', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-13, CSRD GOV-1', required: true },
      { key: 'chiefRiskOfficer', label: 'Chief Risk Officer Appointed', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-13', required: false },
    ]
  },
  {
    id: 'climate',
    name: 'Climate-Related Risks (TCFD)',
    icon: 'Cloud',
    description: 'Physical and transition climate risks',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    fields: [
      { key: 'climateRiskAssessmentConducted', label: 'Climate Risk Assessment Conducted', type: 'select', options: ['Yes', 'No', 'In Progress'], framework: 'TCFD, GRI 201-2, CSRD E1', required: true },
      { key: 'climateRiskAssessmentDate', label: 'Most Recent Assessment Date', type: 'date', framework: 'TCFD, CSRD E1', required: false },
      { key: 'physicalRisksIdentified', label: 'Number of Physical Risks Identified', type: 'number', framework: 'TCFD, CSRD E1-1', required: false, unit: 'risks' },
      { key: 'transitionRisksIdentified', label: 'Number of Transition Risks Identified', type: 'number', framework: 'TCFD, CSRD E1-1', required: false, unit: 'risks' },
      { key: 'climateScenarioAnalysis', label: 'Climate Scenario Analysis Performed', type: 'select', options: ['Yes - Multiple scenarios', 'Yes - Single scenario', 'No', 'Planned'], framework: 'TCFD, SBTi, CSRD E1-1', required: true },
      { key: 'climateRiskHorizon', label: 'Climate Risk Time Horizon', type: 'select', options: ['Short-term (0-3 years)', 'Medium-term (3-10 years)', 'Long-term (10+ years)', 'Multiple horizons'], framework: 'TCFD, CSRD E1', required: false },
      { key: 'climateRiskIntegration', label: 'Climate Risks Integrated into ERM', type: 'select', options: ['Fully integrated', 'Partially integrated', 'Separate process', 'Not integrated'], framework: 'TCFD, GRI 2-12', required: true },
    ]
  },
  {
    id: 'strategic',
    name: 'Strategic & Business Risks',
    icon: 'Target',
    description: 'Market, regulatory, and competitive risks',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    fields: [
      { key: 'strategicRisksIdentified', label: 'Strategic Risks Identified', type: 'number', framework: 'GRI 2-12, CSRD GOV-1', required: false, unit: 'risks' },
      { key: 'marketRisksAssessed', label: 'Market Risks Regularly Assessed', type: 'select', options: ['Yes', 'No', 'Ad hoc'], framework: 'GRI 2-12', required: true },
      { key: 'reputationalRisksMonitored', label: 'Reputational Risk Monitoring', type: 'select', options: ['Continuous', 'Periodic', 'Reactive', 'None'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'competitiveRisksTracked', label: 'Competitive Risks Tracked', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-12', required: false },
      { key: 'regulatoryRisksEvaluated', label: 'Regulatory Risk Assessment', type: 'select', options: ['Comprehensive', 'Partial', 'Minimal', 'None'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'geopoliticalRisksConsidered', label: 'Geopolitical Risks Considered', type: 'select', options: ['Yes - Systematically', 'Yes - Ad hoc', 'No'], framework: 'GRI 2-12', required: false },
    ]
  },
  {
    id: 'operational',
    name: 'Operational Risks',
    icon: 'Activity',
    description: 'Supply chain, technology, and process risks',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    fields: [
      { key: 'operationalRiskRegister', label: 'Operational Risk Register Maintained', type: 'select', options: ['Yes - Updated regularly', 'Yes - Static', 'No'], framework: 'GRI 2-12', required: true },
      { key: 'supplyChainRisksAssessed', label: 'Supply Chain Risk Assessment', type: 'select', options: ['Comprehensive', 'Critical suppliers only', 'Limited', 'None'], framework: 'GRI 2-12, CSRD E1, CDP', required: true },
      { key: 'technologyRisksEvaluated', label: 'Technology & IT Risks Evaluated', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'processFailureRisks', label: 'Process Failure Risks Identified', type: 'number', framework: 'GRI 2-12', required: false, unit: 'risks' },
      { key: 'humanResourceRisks', label: 'HR & Talent Risks Assessed', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-12, CSRD S1', required: false },
      { key: 'facilityRisks', label: 'Facility & Infrastructure Risks', type: 'select', options: ['Assessed', 'Partially assessed', 'Not assessed'], framework: 'GRI 2-12', required: false },
    ]
  },
  {
    id: 'financial',
    name: 'Financial Risks',
    icon: 'TrendingDown',
    description: 'Credit, liquidity, and market risks',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    fields: [
      { key: 'financialRiskFramework', label: 'Financial Risk Management Framework', type: 'select', options: ['Comprehensive', 'Basic', 'None'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'creditRiskManagement', label: 'Credit Risk Management Process', type: 'select', options: ['Formal process', 'Informal process', 'None'], framework: 'GRI 2-12', required: false },
      { key: 'liquidityRiskMonitoring', label: 'Liquidity Risk Monitoring', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'None'], framework: 'GRI 2-12', required: false },
      { key: 'marketRiskExposure', label: 'Market Risk Exposure Assessment', type: 'select', options: ['Regular', 'Periodic', 'Rare', 'None'], framework: 'GRI 2-12', required: false },
      { key: 'currencyRiskHedging', label: 'Currency Risk Hedging Strategy', type: 'select', options: ['Yes', 'No', 'Partial'], framework: 'GRI 2-12', required: false },
      { key: 'interestRateRisk', label: 'Interest Rate Risk Management', type: 'select', options: ['Yes', 'No', 'Not applicable'], framework: 'GRI 2-12', required: false },
    ]
  },
  {
    id: 'cyber',
    name: 'Cybersecurity & Data Risks',
    icon: 'Lock',
    description: 'Cyber threats, data privacy, and security',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    fields: [
      { key: 'cyberRiskFramework', label: 'Cybersecurity Risk Framework', type: 'select', options: ['NIST', 'ISO 27001', 'Custom', 'None'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'dataPrivacyCompliance', label: 'Data Privacy Compliance', type: 'select', options: ['GDPR compliant', 'Other regulations', 'Partial', 'None'], framework: 'GRI 418-1, CSRD GOV-1', required: true },
      { key: 'cyberIncidentsReported', label: 'Cyber Incidents Reported (past year)', type: 'number', framework: 'GRI 2-27, CSRD GOV-1', required: true, unit: 'incidents' },
      { key: 'cyberInsuranceCoverage', label: 'Cyber Insurance Coverage', type: 'select', options: ['Yes - Comprehensive', 'Yes - Basic', 'No'], framework: 'GRI 2-12', required: false },
      { key: 'securityAuditsFrequency', label: 'Security Audits Frequency', type: 'select', options: ['Continuous', 'Quarterly', 'Annually', 'None'], framework: 'GRI 2-12', required: true },
      { key: 'incidentResponsePlan', label: 'Cyber Incident Response Plan', type: 'select', options: ['Yes - Tested', 'Yes - Not tested', 'In development', 'No'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'dataBreaches', label: 'Data Breaches (past year)', type: 'number', framework: 'GRI 418-1', required: true, unit: 'breaches' },
    ]
  },
  {
    id: 'esg',
    name: 'ESG & Sustainability Risks',
    icon: 'Thermometer',
    description: 'Environmental, social, and governance risks',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    fields: [
      { key: 'esgRiskAssessment', label: 'ESG Risk Assessment Conducted', type: 'select', options: ['Comprehensive', 'Partial', 'Planned', 'None'], framework: 'GRI 2-12, CSRD, SBTi', required: true },
      { key: 'environmentalRisksTracked', label: 'Environmental Risks Tracked', type: 'number', framework: 'GRI 2-12, CSRD E1, CDP', required: false, unit: 'risks' },
      { key: 'socialRisksEvaluated', label: 'Social Risks Evaluated', type: 'number', framework: 'GRI 2-12, CSRD S1, SDG', required: false, unit: 'risks' },
      { key: 'governanceRisksMonitored', label: 'Governance Risks Monitored', type: 'number', framework: 'GRI 2-12, CSRD G1', required: false, unit: 'risks' },
      { key: 'biodiversityRisks', label: 'Biodiversity Risks Assessed', type: 'select', options: ['Yes', 'No', 'Not applicable'], framework: 'CSRD E4, CDP, SDG 15', required: false },
      { key: 'humanRightsRisks', label: 'Human Rights Risks Evaluated', type: 'select', options: ['Yes', 'No', 'In progress'], framework: 'GRI 2-12, CSRD S1, SDG 8', required: true },
      { key: 'stakeholderRisks', label: 'Stakeholder-Related Risks', type: 'select', options: ['Identified', 'Partially identified', 'Not identified'], framework: 'GRI 2-12, CSRD', required: false },
    ]
  },
  {
    id: 'mitigation',
    name: 'Risk Mitigation & Controls',
    icon: 'CheckCircle2',
    description: 'Risk response strategies and business continuity',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    fields: [
      { key: 'riskMitigationStrategies', label: 'Risk Mitigation Strategies Documented', type: 'select', options: ['All risks', 'Critical risks only', 'Some risks', 'None'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'insuranceCoverage', label: 'Insurance Coverage Assessment', type: 'select', options: ['Comprehensive', 'Adequate', 'Limited', 'None'], framework: 'GRI 2-12', required: false },
      { key: 'businessContinuityPlan', label: 'Business Continuity Plan', type: 'select', options: ['Yes - Tested regularly', 'Yes - Not tested', 'In development', 'No'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'disasterRecoveryPlan', label: 'Disaster Recovery Plan', type: 'select', options: ['Yes - Tested', 'Yes - Not tested', 'No'], framework: 'GRI 2-12', required: true },
      { key: 'crisisManagementTeam', label: 'Crisis Management Team Established', type: 'select', options: ['Yes', 'No'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'emergencyResponseProcedures', label: 'Emergency Response Procedures', type: 'select', options: ['Comprehensive', 'Basic', 'None'], framework: 'GRI 2-12', required: false },
    ]
  },
  {
    id: 'monitoring',
    name: 'Risk Monitoring & Reporting',
    icon: 'BarChart3',
    description: 'KRIs, reporting, and early warning systems',
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    fields: [
      { key: 'riskMonitoringFrequency', label: 'Risk Monitoring Frequency', type: 'select', options: ['Continuous', 'Monthly', 'Quarterly', 'Annually'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'riskReportingToBoard', label: 'Risk Reporting to Board', type: 'select', options: ['Monthly', 'Quarterly', 'Annually', 'Ad hoc'], framework: 'GRI 2-13, TCFD', required: true },
      { key: 'keyRiskIndicators', label: 'Key Risk Indicators (KRIs) Defined', type: 'number', framework: 'GRI 2-12, CSRD GOV-1', required: false, unit: 'KRIs' },
      { key: 'riskAppetiteStatement', label: 'Risk Appetite Statement Defined', type: 'select', options: ['Yes', 'No', 'In development'], framework: 'GRI 2-12, CSRD GOV-1', required: true },
      { key: 'riskToleranceLevels', label: 'Risk Tolerance Levels Set', type: 'select', options: ['All categories', 'Key categories', 'Some categories', 'None'], framework: 'GRI 2-12', required: false },
      { key: 'earlyWarningSystem', label: 'Early Warning System for Risks', type: 'select', options: ['Yes', 'Partial', 'No'], framework: 'GRI 2-12, CSRD GOV-1', required: false },
    ]
  },
  {
    id: 'emerging',
    name: 'Emerging Risks',
    icon: 'AlertTriangle',
    description: 'Future and evolving risk landscape',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    fields: [
      { key: 'emergingRisksProcess', label: 'Emerging Risk Identification Process', type: 'select', options: ['Formal process', 'Informal process', 'None'], framework: 'GRI 2-12, TCFD', required: true },
      { key: 'aiRelatedRisks', label: 'AI & Automation-Related Risks Assessed', type: 'select', options: ['Yes', 'No', 'Planned'], framework: 'GRI 2-12, CSRD GOV-1', required: false },
      { key: 'pandemicPreparedness', label: 'Pandemic Preparedness Plan', type: 'select', options: ['Yes', 'No', 'Under review'], framework: 'GRI 2-12', required: false },
      { key: 'supplyChainResilience', label: 'Supply Chain Resilience Program', type: 'select', options: ['Comprehensive', 'Basic', 'None'], framework: 'GRI 2-12, CDP, CSRD', required: true },
      { key: 'climateAdaptationPlanning', label: 'Climate Adaptation Planning', type: 'select', options: ['Yes', 'In development', 'No'], framework: 'TCFD, CSRD E1, SBTi', required: true },
      { key: 'energyTransitionRisks', label: 'Energy Transition Risks Evaluated', type: 'select', options: ['Yes', 'Partial', 'No'], framework: 'TCFD, CSRD E1, SBTi', required: true },
    ]
  },
]

export default function RiskManagementCollection() {
  const navigate = useNavigate()
  const { createMetric, updateMetric, fetchMetrics, metrics, loading } = useESGMetrics({ 
    topic: 'Risk Management',
    pillar: 'Governance'
  })
  
  const [saveStatus, setSaveStatus] = useState('')
  const [existingMetricId, setExistingMetricId] = useState(null)
  
  // Form state organized by category
  const [formData, setFormData] = useState({
    // Enterprise Risk Management Framework
    ermFrameworkExists: '',
    ermFrameworkStandard: '',
    ermLastReview: '',
    boardOversightFrequency: '',
    riskCommitteeExists: '',
    chiefRiskOfficer: '',
    
    // Climate-Related Risks (TCFD)
    climateRiskAssessmentConducted: '',
    climateRiskAssessmentDate: '',
    physicalRisksIdentified: '',
    transitionRisksIdentified: '',
    climateScenarioAnalysis: '',
    climateRiskHorizon: '',
    climateRiskIntegration: '',
    
    // Strategic & Business Risks
    strategicRisksIdentified: '',
    marketRisksAssessed: '',
    reputationalRisksMonitored: '',
    competitiveRisksTracked: '',
    regulatoryRisksEvaluated: '',
    geopoliticalRisksConsidered: '',
    
    // Operational Risks
    operationalRiskRegister: '',
    supplyChainRisksAssessed: '',
    technologyRisksEvaluated: '',
    processFailureRisks: '',
    humanResourceRisks: '',
    facilityRisks: '',
    
    // Financial Risks
    financialRiskFramework: '',
    creditRiskManagement: '',
    liquidityRiskMonitoring: '',
    marketRiskExposure: '',
    currencyRiskHedging: '',
    interestRateRisk: '',
    
    // Cybersecurity & Data Risks
    cyberRiskFramework: '',
    dataPrivacyCompliance: '',
    cyberIncidentsReported: '',
    cyberInsuranceCoverage: '',
    securityAuditsFrequency: '',
    incidentResponsePlan: '',
    dataBreaches: '',
    
    // ESG & Sustainability Risks
    esgRiskAssessment: '',
    environmentalRisksTracked: '',
    socialRisksEvaluated: '',
    governanceRisksMonitored: '',
    biodiversityRisks: '',
    humanRightsRisks: '',
    stakeholderRisks: '',
    
    // Risk Mitigation & Controls
    riskMitigationStrategies: '',
    insuranceCoverage: '',
    businessContinuityPlan: '',
    disasterRecoveryPlan: '',
    crisisManagementTeam: '',
    emergencyResponseProcedures: '',
    
    // Risk Monitoring & Reporting
    riskMonitoringFrequency: '',
    riskReportingToBoard: '',
    keyRiskIndicators: '',
    riskAppetiteStatement: '',
    riskToleranceLevels: '',
    earlyWarningSystem: '',
    
    // Emerging Risks
    emergingRisksProcess: '',
    aiRelatedRisks: '',
    pandemicPreparedness: '',
    supplyChainResilience: '',
    climateAdaptationPlanning: '',
    energyTransitionRisks: '',
  })

  const [showCalculations, setShowCalculations] = useState(false)

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // Calculation Functions
  const calculateRiskCoverage = useCallback((risksIdentified, totalCategories) => {
    if (!risksIdentified || !totalCategories || parseFloat(totalCategories) === 0) return null
    const coverage = (parseFloat(risksIdentified) / parseFloat(totalCategories)) * 100
    return coverage.toFixed(1)
  }, [])

  const calculateRiskMaturity = useCallback(() => {
    let score = 0
    let maxScore = 0

    // Framework existence (20 points)
    if (formData.ermFrameworkExists === 'Yes') score += 20
    maxScore += 20

    // Board oversight (15 points)
    if (formData.boardOversightFrequency === 'Quarterly' || formData.boardOversightFrequency === 'Monthly') score += 15
    else if (formData.boardOversightFrequency === 'Semi-annually') score += 10
    maxScore += 15

    // Risk committee (10 points)
    if (formData.riskCommitteeExists === 'Yes') score += 10
    maxScore += 10

    // Climate risk assessment (15 points)
    if (formData.climateRiskAssessmentConducted === 'Yes') score += 15
    maxScore += 15

    // Scenario analysis (15 points)
    if (formData.climateScenarioAnalysis === 'Yes - Multiple scenarios') score += 15
    else if (formData.climateScenarioAnalysis === 'Yes - Single scenario') score += 10
    maxScore += 15

    // Business continuity (10 points)
    if (formData.businessContinuityPlan === 'Yes - Tested regularly') score += 10
    else if (formData.businessContinuityPlan === 'Yes - Not tested') score += 5
    maxScore += 10

    // Risk monitoring (15 points)
    if (formData.riskMonitoringFrequency === 'Continuous') score += 15
    else if (formData.riskMonitoringFrequency === 'Monthly') score += 12
    else if (formData.riskMonitoringFrequency === 'Quarterly') score += 8
    maxScore += 15

    const maturity = maxScore > 0 ? (score / maxScore) * 100 : 0
    return maturity.toFixed(1)
  }, [formData])

  const getRiskMaturityLevel = (score) => {
    if (score >= 80) return { level: 'Advanced', color: 'text-green-600', bg: 'bg-green-50', desc: 'Comprehensive risk management with proactive monitoring' }
    if (score >= 60) return { level: 'Developing', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Established framework with room for enhancement' }
    if (score >= 40) return { level: 'Basic', color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Foundational practices in place' }
    return { level: 'Initial', color: 'text-red-600', bg: 'bg-red-50', desc: 'Risk management practices need development' }
  }

  const calculateClimateRiskExposure = useCallback(() => {
    let exposure = 0
    
    if (formData.physicalRisksIdentified) exposure += parseInt(formData.physicalRisksIdentified) || 0
    if (formData.transitionRisksIdentified) exposure += parseInt(formData.transitionRisksIdentified) || 0
    
    if (exposure === 0) return null
    
    let level = 'Low'
    if (exposure > 10) level = 'High'
    else if (exposure > 5) level = 'Moderate'
    
    return { total: exposure, level }
  }, [formData])

  // Progress calculation - count all individual fields across all categories
  const progress = useMemo(() => {
    let totalFields = 0
    let filledFields = 0
    
    // Count all fields in all categories
    riskCategories.forEach(category => {
      category.fields.forEach(field => {
        totalFields++
        const value = formData[field.key]
        // Consider a field filled if it has any value
        if (value !== undefined && value !== null && value !== '') {
          filledFields++
        }
      })
    })
    
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }, [formData])

  // Load existing data on mount
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0]
      setExistingMetricId(latestMetric._id)
      
      // Parse the metadata back into form fields
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setFormData(latestMetric.metadata.formData)
      }
    }
  }, [metrics])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    try {
      const metricData = {
        framework: 'GRI,TCFD,CSRD',
        pillar: 'Governance',
        topic: 'Risk Management',
        metricName: 'Risk Management Assessment',
        reportingPeriod: new Date().getFullYear().toString(),
        value: progress,
        unit: '% complete',
        dataQuality: 'self-declared',
        status: 'draft', // Save as draft
        isDraft: true, // Mark as draft
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
        if (newMetric && newMetric._id) {
          setExistingMetricId(newMetric._id)
        }
      }
      
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error saving Risk Management data:', error)
      setSaveStatus('error')
      alert('Failed to save progress. Please try again.')
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
        framework: 'GRI,TCFD,CSRD',
        pillar: 'Governance',
        topic: 'Risk Management',
        metricName: 'Risk Management Assessment',
        reportingPeriod: new Date().getFullYear().toString(),
        value: 100,
        unit: '% complete',
        dataQuality: 'self-declared',
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
      alert('Risk Management data submitted successfully and saved to database!')
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry')
      }, 1500)
    } catch (error) {
      console.error('Error submitting Risk Management data:', error)
      setSaveStatus('error')
      alert('Error submitting data. Please try again.')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }, [progress, formData, existingMetricId, createMetric, updateMetric, navigate])

  // Calculate field counts per category
  const categoryProgress = useMemo(() => {
    return riskCategories.map(cat => {
      const fields = cat.fields
      const filled = fields.filter(f => formData[f.key] !== '').length
      return {
        ...cat,
        // Resolve icon string to actual icon component
        icon: typeof cat.icon === 'string' ? iconMap[cat.icon] : cat.icon,
        progress: Math.round((filled / fields.length) * 100),
        filled,
        total: fields.length
      }
    })
  }, [formData])

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard/esg/data-entry')}
            className="flex items-center gap-2 text-indigo-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
            <span>Back to Data Entry Hub</span>
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-10 w-10" strokeWidth={2} />
                <h1 className="text-4xl font-bold">Risk Management</h1>
              </div>
              <p className="text-indigo-100 text-lg max-w-3xl">
                Comprehensive enterprise risk assessment covering climate, strategic, operational, financial, cyber, and ESG risks
              </p>
              <div className="flex gap-4 mt-4 flex-wrap">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">GRI 2-12, 2-13</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">TCFD</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CSRD (All ESRSs)</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">CDP</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SBTi</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">SDG 13</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{progress}%</div>
              <div className="text-indigo-100">Complete</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Risk Category Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryProgress.map(cat => {
              const CatIcon = typeof cat.icon === 'string' ? iconMap[cat.icon] : cat.icon
              return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                  <CatIcon className={`h-6 w-6 ${cat.color}`} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${cat.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`}
                        style={{ width: `${cat.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{cat.filled}/{cat.total}</span>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>

        {/* Data Collection Forms */}
        <div className="space-y-6">
          {riskCategories.map(category => {
            // Resolve icon string to actual icon component
            const Icon = typeof category.icon === 'string' ? iconMap[category.icon] : category.icon
            return (
            <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className={`${category.bgColor} px-6 py-4 border-l-4 border-indigo-500`}>
                <div className="flex items-center gap-3">
                  <Icon className={`h-6 w-6 ${category.color}`} strokeWidth={2} />
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
                          <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {field.framework}
                          </span>
                        </div>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
                              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
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
            )
          })}
        </div>

        {/* Automated Analytics */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6">
          <button
            onClick={() => setShowCalculations(!showCalculations)}
            className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-indigo-600" strokeWidth={2} />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">Risk Analytics & Maturity Assessment</h3>
                <p className="text-sm text-gray-600">Industry benchmarks and risk maturity scoring</p>
              </div>
            </div>
            <div className="text-indigo-600">
              {showCalculations ? '▼' : '▶'}
            </div>
          </button>

          {showCalculations && (
            <div className="p-6 space-y-6 border-t">
              {/* Risk Maturity Score */}
              {(() => {
                const maturityScore = parseFloat(calculateRiskMaturity())
                const maturity = getRiskMaturityLevel(maturityScore)
                return (
                  <div className={`${maturity.bg} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <Shield className={`h-6 w-6 ${maturity.color} mt-0.5`} strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Risk Management Maturity Score</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-700">Overall Maturity:</span>
                              <span className={`font-bold text-lg ${maturity.color}`}>{maturityScore}%</span>
                            </div>
                            <div className="h-3 bg-white rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${maturityScore >= 80 ? 'bg-green-500' : maturityScore >= 60 ? 'bg-blue-500' : maturityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${maturityScore}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Maturity Level:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${maturity.bg} ${maturity.color}`}>
                              {maturity.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{maturity.desc}</p>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-indigo-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <div className="text-xs text-gray-600">
                              <strong>Maturity Levels:</strong>
                              <ul className="mt-1 space-y-1">
                                <li>• <strong>Advanced (80-100%):</strong> Leading practice with comprehensive framework</li>
                                <li>• <strong>Developing (60-79%):</strong> Established processes with enhancement opportunities</li>
                                <li>• <strong>Basic (40-59%):</strong> Foundational practices in place</li>
                                <li>• <strong>Initial ({'<'}40%):</strong> Risk management needs significant development</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Climate Risk Exposure */}
              {(() => {
                const exposure = calculateClimateRiskExposure()
                if (!exposure) return null
                return (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Cloud className="h-6 w-6 text-blue-600 mt-0.5" strokeWidth={2} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Climate Risk Exposure (TCFD)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Total Climate Risks Identified:</span>
                            <span className="font-semibold text-blue-600">{exposure.total}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Physical Risks:</span>
                            <span className="font-semibold text-blue-600">{formData.physicalRisksIdentified || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Transition Risks:</span>
                            <span className="font-semibold text-blue-600">{formData.transitionRisksIdentified || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Exposure Level:</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              exposure.level === 'High' ? 'bg-red-100 text-red-700' :
                              exposure.level === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {exposure.level}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                          <div className="flex items-start gap-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                            <p className="text-xs text-gray-600">
                              <strong>TCFD Recommendation:</strong> Identify and assess physical risks (extreme weather, sea-level rise) 
                              and transition risks (policy, technology, market, reputation). Conduct scenario analysis using 2°C or lower scenarios.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Cybersecurity Dashboard */}
              {formData.cyberIncidentsReported !== '' && (
                <div className="bg-teal-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-6 w-6 text-teal-600 mt-0.5" strokeWidth={2} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Cybersecurity Risk Profile</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Cyber Incidents (past year):</span>
                          <span className={`font-semibold ${formData.cyberIncidentsReported === '0' ? 'text-green-600' : 'text-red-600'}`}>
                            {formData.cyberIncidentsReported}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700">Data Breaches:</span>
                          <span className={`font-semibold ${formData.dataBreaches === '0' ? 'text-green-600' : 'text-red-600'}`}>
                            {formData.dataBreaches || 0}
                          </span>
                        </div>
                        {formData.cyberRiskFramework && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Framework:</span>
                            <span className="font-semibold text-teal-600">{formData.cyberRiskFramework}</span>
                          </div>
                        )}
                        {formData.incidentResponsePlan && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Incident Response Plan:</span>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              formData.incidentResponsePlan === 'Yes - Tested' ? 'bg-green-100 text-green-700' :
                              formData.incidentResponsePlan === 'Yes - Not tested' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {formData.incidentResponsePlan}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 p-3 bg-white rounded border border-teal-200">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" strokeWidth={2} />
                          <p className="text-xs text-gray-600">
                            <strong>Best Practice:</strong> Zero incidents target. Implement NIST Cybersecurity Framework or ISO 27001. 
                            Test incident response plan annually. Maintain cyber insurance coverage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Framework Alignment */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-indigo-600 mt-0.5" strokeWidth={2} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Multi-Framework Alignment</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Your risk management data supports disclosure requirements across 6 major ESG frameworks
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded p-3 border border-indigo-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">Climate & Carbon</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ TCFD - Climate risk governance</li>
                          <li>✓ SBTi - Transition risk assessment</li>
                          <li>✓ CDP - Climate risk disclosure</li>
                        </ul>
                      </div>
                      <div className="bg-white rounded p-3 border border-indigo-200">
                        <div className="text-xs font-semibold text-gray-900 mb-2">ESG Reporting</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>✓ GRI 2-12, 2-13 - Risk management</li>
                          <li>✓ CSRD - All ESRS risk disclosures</li>
                          <li>✓ SDG 13 - Climate action</li>
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
            disabled={loading || saveStatus === 'saving' || saveStatus === 'submitting'}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" strokeWidth={2} />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved to Database' : 'Save Progress'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={progress < 100 || loading || saveStatus === 'submitting' || saveStatus === 'saving'}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              progress === 100 && !loading && saveStatus !== 'submitting' && saveStatus !== 'saving'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500'
            }`}
          >
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
            {saveStatus === 'submitting' ? 'Submitting...' : saveStatus === 'submitted' ? '✓ Submitted' : 'Submit Data'}
          </button>
        </div>

        {/* Framework Information */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-start gap-3">
            <FileText className="h-6 w-6 text-indigo-600 flex-shrink-0" strokeWidth={2} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Framework Coverage</h3>
              <p className="text-sm text-gray-700 mb-3">
                This risk management form addresses requirements across all major ESG and climate reporting frameworks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white rounded p-3 border border-indigo-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">GRI Standards</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• GRI 2-12: Role of highest governance body in overseeing impact management</li>
                    <li>• GRI 2-13: Delegation of responsibility for managing impacts</li>
                    <li>• GRI 201-2: Financial implications and risks due to climate change</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-indigo-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">TCFD & Climate</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Governance: Board oversight of climate risks</li>
                    <li>• Strategy: Climate scenario analysis</li>
                    <li>• Risk Management: Climate risk integration</li>
                    <li>• SBTi: Transition risk assessment</li>
                    <li>• CDP: Climate risk disclosure</li>
                  </ul>
                </div>
                <div className="bg-white rounded p-3 border border-indigo-200">
                  <div className="font-semibold text-sm text-gray-900 mb-1">CSRD (ESRS)</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• GOV-1: Governance, risk management and internal control</li>
                    <li>• E1: Climate change risks and opportunities</li>
                    <li>• S1: Own workforce risks</li>
                    <li>• All ESRS: Materiality assessment and risk identification</li>
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
