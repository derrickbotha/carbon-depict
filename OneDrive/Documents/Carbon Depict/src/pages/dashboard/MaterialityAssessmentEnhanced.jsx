// Enhanced ESG Materiality Assessment - Comprehensive Stakeholder Engagement
// Implements best practices from GRI, SASB, TCFD, CSRD, CDP, and ISSB frameworks
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Download, Share2, Save, Users, TrendingUp, 
  AlertCircle, CheckCircle, Filter, Search, Plus, X,
  BarChart3, PieChart, FileText, Mail, MessageSquare,
  Building2, Leaf, Globe, Shield, Heart, DollarSign
} from '@atoms/Icon'
import { Button } from '@atoms/Button'

export default function MaterialityAssessmentEnhanced() {
  const [activeTab, setActiveTab] = useState('matrix') // matrix, stakeholders, issues, engagement, report
  const [selectedFrameworks, setSelectedFrameworks] = useState(['GRI', 'CSRD', 'SASB'])
  const [materialityType, setMaterialityType] = useState('double') // single, double, dynamic
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddIssue, setShowAddIssue] = useState(false)
  const [showAddStakeholder, setShowAddStakeholder] = useState(false)
  const matrixRef = useRef(null)

  // Comprehensive ESG Issues across all 6 frameworks
  const [esgIssues, setEsgIssues] = useState([
    // Environmental
    { id: 1, name: 'Climate Change & GHG Emissions', category: 'Environmental', impactScore: 9, financialScore: 9, frameworks: ['GRI', 'CSRD', 'TCFD', 'CDP', 'SASB', 'ISSB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'High' },
    { id: 2, name: 'Energy Management', category: 'Environmental', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB', 'CDP'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'High' },
    { id: 3, name: 'Water & Effluents', category: 'Environmental', impactScore: 6, financialScore: 5, frameworks: ['GRI', 'CSRD', 'CDP'], stakeholderConcern: 'Medium', riskLevel: 'Medium', opportunityLevel: 'Medium' },
    { id: 4, name: 'Waste Management', category: 'Environmental', impactScore: 6, financialScore: 4, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'Medium' },
    { id: 5, name: 'Biodiversity & Ecosystems', category: 'Environmental', impactScore: 8, financialScore: 6, frameworks: ['GRI', 'CSRD', 'TCFD'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'Low' },
    { id: 6, name: 'Circular Economy', category: 'Environmental', impactScore: 7, financialScore: 7, frameworks: ['CSRD', 'GRI'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 7, name: 'Air Quality & Emissions', category: 'Environmental', impactScore: 6, financialScore: 5, frameworks: ['GRI', 'CSRD', 'CDP'], stakeholderConcern: 'Medium', riskLevel: 'Medium', opportunityLevel: 'Low' },
    
    // Social
    { id: 8, name: 'Labor Practices & Working Conditions', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 9, name: 'Diversity, Equity & Inclusion (DEI)', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'High' },
    { id: 10, name: 'Employee Health & Safety', category: 'Social', impactScore: 9, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 11, name: 'Human Rights', category: 'Social', impactScore: 9, financialScore: 6, frameworks: ['GRI', 'CSRD', 'ISSB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 12, name: 'Community Engagement & Investment', category: 'Social', impactScore: 7, financialScore: 5, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 13, name: 'Supply Chain Labor Standards', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 14, name: 'Employee Training & Development', category: 'Social', impactScore: 6, financialScore: 6, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 15, name: 'Data Privacy & Security', category: 'Social', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    
    // Governance
    { id: 16, name: 'Board Composition & Independence', category: 'Governance', impactScore: 6, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'Medium' },
    { id: 17, name: 'Business Ethics & Anti-Corruption', category: 'Governance', impactScore: 8, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 18, name: 'ESG Governance Structure', category: 'Governance', impactScore: 7, financialScore: 7, frameworks: ['GRI', 'CSRD', 'TCFD', 'ISSB'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'High' },
    { id: 19, name: 'Risk Management', category: 'Governance', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'TCFD', 'ISSB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 20, name: 'Regulatory Compliance', category: 'Governance', impactScore: 7, financialScore: 9, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 21, name: 'Stakeholder Engagement', category: 'Governance', impactScore: 6, financialScore: 6, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 22, name: 'Executive Compensation Linkage to ESG', category: 'Governance', impactScore: 5, financialScore: 6, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'Medium' },
  ])

  // Stakeholder Groups
  const [stakeholderGroups, setStakeholderGroups] = useState([
    { id: 1, name: 'Investors & Shareholders', type: 'External', size: 'Large', engagement: 'Quarterly', priority: 'Critical', contactCount: 45, lastEngagement: '2024-10-15' },
    { id: 2, name: 'Employees', type: 'Internal', size: 'Large', engagement: 'Monthly', priority: 'Critical', contactCount: 250, lastEngagement: '2024-10-20' },
    { id: 3, name: 'Board of Directors', type: 'Internal', size: 'Small', engagement: 'Monthly', priority: 'Critical', contactCount: 12, lastEngagement: '2024-10-18' },
    { id: 4, name: 'Customers', type: 'External', size: 'Large', engagement: 'Quarterly', priority: 'High', contactCount: 180, lastEngagement: '2024-09-30' },
    { id: 5, name: 'Suppliers', type: 'External', size: 'Medium', engagement: 'Bi-Annual', priority: 'High', contactCount: 65, lastEngagement: '2024-08-15' },
    { id: 6, name: 'Local Communities', type: 'External', size: 'Medium', engagement: 'Quarterly', priority: 'Medium', contactCount: 35, lastEngagement: '2024-10-10' },
    { id: 7, name: 'Regulators', type: 'External', size: 'Small', engagement: 'As-Needed', priority: 'Critical', contactCount: 8, lastEngagement: '2024-09-20' },
    { id: 8, name: 'NGOs & Advocacy Groups', type: 'External', size: 'Small', engagement: 'Quarterly', priority: 'Medium', contactCount: 15, lastEngagement: '2024-10-05' },
  ])

  const getMaterialityLevel = (issue) => {
    const avg = (issue.impactScore + issue.financialScore) / 2
    if (avg >= 8) return { level: 'Critical', color: 'bg-red-500', textColor: 'text-red-600' }
    if (avg >= 6) return { level: 'High', color: 'bg-orange-500', textColor: 'text-orange-600' }
    if (avg >= 4) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-600' }
    return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-600' }
  }

  const exportToCSV = () => {
    const headers = ['Topic', 'Category', 'Impact Score', 'Financial Score', 'Materiality Level', 'Frameworks', 'Risk Level', 'Opportunity Level']
    const rows = esgIssues.map(issue => {
      const materiality = getMaterialityLevel(issue)
      return [
        issue.name,
        issue.category,
        issue.impactScore,
        issue.financialScore,
        materiality.level,
        issue.frameworks.join('; '),
        issue.riskLevel,
        issue.opportunityLevel
      ]
    })

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `materiality-assessment-${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  const exportMatrixImage = () => {
    if (!matrixRef.current) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const rect = matrixRef.current.getBoundingClientRect()
    
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    
    // This is simplified - in production, use html2canvas or similar library
    alert('Matrix export feature would use html2canvas library in production')
  }

  const filteredIssues = esgIssues.filter(issue => 
    issue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categoryStats = {
    Environmental: esgIssues.filter(i => i.category === 'Environmental').length,
    Social: esgIssues.filter(i => i.category === 'Social').length,
    Governance: esgIssues.filter(i => i.category === 'Governance').length,
  }

  const criticalIssues = esgIssues.filter(issue => {
    const mat = getMaterialityLevel(issue)
    return mat.level === 'Critical'
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/esg"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cd-border bg-white text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-midnight"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cd-midnight">ESG Materiality Assessment</h1>
            <p className="text-cd-muted">
              Comprehensive stakeholder-driven materiality analysis across 6 frameworks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" onClick={exportMatrixImage}>
            <Download className="mr-2 h-4 w-4" />
            Export Matrix
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Assessment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-cd-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cd-muted">Total ESG Issues</p>
              <p className="text-3xl font-bold text-cd-midnight">{esgIssues.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cd-mint/20">
              <BarChart3 className="h-6 w-6 text-cd-midnight" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-cd-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cd-muted">Critical Issues</p>
              <p className="text-3xl font-bold text-red-600">{criticalIssues.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-cd-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cd-muted">Stakeholder Groups</p>
              <p className="text-3xl font-bold text-cd-midnight">{stakeholderGroups.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cd-teal/20">
              <Users className="h-6 w-6 text-cd-midnight" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-cd-border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-cd-muted">Frameworks Applied</p>
              <p className="text-3xl font-bold text-cd-midnight">{selectedFrameworks.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cd-cedar/20">
              <FileText className="h-6 w-6 text-cd-midnight" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-cd-border bg-white">
        <div className="flex gap-4 px-6">
          {[
            { id: 'matrix', label: 'Materiality Matrix', icon: PieChart },
            { id: 'issues', label: 'ESG Issues', icon: BarChart3 },
            { id: 'stakeholders', label: 'Stakeholders', icon: Users },
            { id: 'engagement', label: 'Engagement', icon: MessageSquare },
            { id: 'report', label: 'Report', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-cd-midnight text-cd-midnight'
                  : 'border-transparent text-cd-muted hover:text-cd-midnight'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Framework Selection */}
          <div className="rounded-lg border border-cd-border bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-cd-midnight">Selected Frameworks</h3>
            <div className="flex flex-wrap gap-2">
              {['GRI', 'CSRD', 'TCFD', 'CDP', 'SASB', 'ISSB', 'PCAF'].map(fw => (
                <button
                  key={fw}
                  onClick={() => {
                    if (selectedFrameworks.includes(fw)) {
                      setSelectedFrameworks(selectedFrameworks.filter(f => f !== fw))
                    } else {
                      setSelectedFrameworks([...selectedFrameworks, fw])
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedFrameworks.includes(fw)
                      ? 'bg-cd-midnight text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {fw}
                </button>
              ))}
            </div>
          </div>

          {/* Materiality Matrix Visualization */}
          <div className="rounded-lg border border-cd-border bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-cd-midnight">Double Materiality Matrix</h2>
            
            <div ref={matrixRef} className="relative aspect-square max-w-4xl mx-auto border-2 border-gray-300 rounded-lg bg-gradient-to-tr from-green-50 via-yellow-50 to-red-50">
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
              </div>

              {/* Axis Labels */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-cd-muted">
                Financial Materiality (Impact on Business) →
              </div>
              <div className="absolute -left-28 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-cd-muted">
                Impact Materiality (Impact on Society & Environment) →
              </div>

              {/* Quadrant Labels */}
              <div className="absolute left-4 top-4 text-xs font-medium text-gray-500">Low Impact / Low Financial</div>
              <div className="absolute right-4 top-4 text-xs font-medium text-red-600">Low Impact / High Financial</div>
              <div className="absolute left-4 bottom-4 text-xs font-medium text-orange-600">High Impact / Low Financial</div>
              <div className="absolute right-4 bottom-4 text-xs font-medium text-red-700 font-bold">Critical: High Impact / High Financial</div>

              {/* Plot Issues */}
              {filteredIssues.map((issue) => {
                const x = (issue.financialScore / 10) * 100
                const y = 100 - (issue.impactScore / 10) * 100 // Inverted for top-left origin
                const materiality = getMaterialityLevel(issue)
                
                return (
                  <div
                    key={issue.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className={`h-4 w-4 rounded-full border-2 border-white ${materiality.color} shadow-md group-hover:scale-150 transition-transform`}></div>
                    <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-10 whitespace-nowrap rounded-md bg-cd-midnight px-3 py-2 text-sm text-white shadow-lg">
                      <div className="font-semibold">{issue.name}</div>
                      <div className="text-xs text-cd-desert">
                        Impact: {issue.impactScore}/10 | Financial: {issue.financialScore}/10
                      </div>
                      <div className="text-xs text-cd-mint">{materiality.level} Materiality</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-12 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-500 border-2 border-white"></div>
                <span className="text-sm text-cd-muted">Critical (8-10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-orange-500 border-2 border-white"></div>
                <span className="text-sm text-cd-muted">High (6-7.9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-yellow-500 border-2 border-white"></div>
                <span className="text-sm text-cd-muted">Medium (4-5.9)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
                <span className="text-sm text-cd-muted">Low (&lt;4)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issues' && (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cd-muted" />
              <input
                type="text"
                placeholder="Search ESG issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-cd-border bg-white py-2 pl-10 pr-4 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
              />
            </div>
            <Button variant="outline" onClick={() => setShowAddIssue(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Issue
            </Button>
          </div>

          {/* Issues Table */}
          <div className="rounded-lg border border-cd-border bg-white overflow-hidden">
            <table className="w-full">
              <thead className="bg-cd-surface">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Issue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Financial</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Materiality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Frameworks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-cd-muted">Risk/Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cd-border">
                {filteredIssues.map((issue) => {
                  const materiality = getMaterialityLevel(issue)
                  return (
                    <tr key={issue.id} className="hover:bg-cd-surface transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-cd-midnight">{issue.name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                          issue.category === 'Environmental' ? 'bg-green-100 text-green-700' :
                          issue.category === 'Social' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {issue.category === 'Environmental' && <Leaf className="h-3 w-3" />}
                          {issue.category === 'Social' && <Heart className="h-3 w-3" />}
                          {issue.category === 'Governance' && <Shield className="h-3 w-3" />}
                          {issue.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-cd-muted">{issue.impactScore}/10</td>
                      <td className="px-6 py-4 text-sm text-cd-muted">{issue.financialScore}/10</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${materiality.color} text-white`}>
                          {materiality.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {issue.frameworks.slice(0, 3).map(fw => (
                            <span key={fw} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{fw}</span>
                          ))}
                          {issue.frameworks.length > 3 && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">+{issue.frameworks.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className={`text-xs ${issue.riskLevel === 'High' ? 'text-red-600' : issue.riskLevel === 'Medium' ? 'text-orange-600' : 'text-green-600'}`}>
                            Risk: {issue.riskLevel}
                          </span>
                          <span className={`text-xs ${issue.opportunityLevel === 'High' ? 'text-green-600' : issue.opportunityLevel === 'Medium' ? 'text-orange-600' : 'text-gray-600'}`}>
                            Opp: {issue.opportunityLevel}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'stakeholders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-cd-midnight">Stakeholder Groups</h2>
            <Button onClick={() => setShowAddStakeholder(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Stakeholder Group
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {stakeholderGroups.map((group) => (
              <div key={group.id} className="rounded-lg border border-cd-border bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-cd-midnight">{group.name}</h3>
                    <p className="text-sm text-cd-muted">{group.type} Stakeholder</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    group.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    group.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {group.priority}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cd-muted">Group Size:</span>
                    <span className="font-medium text-cd-midnight">{group.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cd-muted">Contacts:</span>
                    <span className="font-medium text-cd-midnight">{group.contactCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cd-muted">Engagement:</span>
                    <span className="font-medium text-cd-midnight">{group.engagement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cd-muted">Last Contact:</span>
                    <span className="font-medium text-cd-midnight">{new Date(group.lastEngagement).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="mr-2 h-3 w-3" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="mr-2 h-3 w-3" />
                    Survey
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'engagement' && (
        <div className="rounded-lg border border-cd-border bg-white p-6">
          <h2 className="mb-6 text-xl font-bold text-cd-midnight">Stakeholder Engagement Plan</h2>
          
          <div className="space-y-6">
            <div className="rounded-lg bg-cd-mint/10 border border-cd-mint/30 p-6">
              <h3 className="mb-2 font-semibold text-cd-midnight">Engagement Methods</h3>
              <ul className="space-y-2 text-sm text-cd-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cd-mint" />
                  <span><strong>Surveys & Questionnaires:</strong> Digital surveys for broad stakeholder input collection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cd-mint" />
                  <span><strong>Workshops & Focus Groups:</strong> In-depth discussions with key stakeholder groups</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cd-mint" />
                  <span><strong>One-on-One Interviews:</strong> Detailed conversations with critical stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cd-mint" />
                  <span><strong>Public Forums:</strong> Open discussions for community and external stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-cd-mint" />
                  <span><strong>Continuous Feedback:</strong> Ongoing channels for stakeholder input</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-cd-midnight">Planned Engagement Activities</h3>
              <div className="space-y-3">
                {[
                  { date: '2024-11-15', type: 'Survey', stakeholders: 'All Employees', topic: 'Working Conditions & DEI', status: 'Scheduled' },
                  { date: '2024-11-20', type: 'Workshop', stakeholders: 'Board of Directors', topic: 'Climate Strategy Review', status: 'Scheduled' },
                  { date: '2024-12-01', type: 'Interview', stakeholders: 'Key Investors', topic: 'ESG Performance & Goals', status: 'Scheduled' },
                  { date: '2024-12-10', type: 'Forum', stakeholders: 'Local Communities', topic: 'Environmental Impact & Community Investment', status: 'Planning' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-lg border border-cd-border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-cd-midnight">{activity.type}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          activity.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm text-cd-muted">{activity.stakeholders} • {activity.topic}</p>
                    </div>
                    <div className="text-sm font-medium text-cd-midnight">{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-cd-border bg-white p-6">
            <h2 className="mb-6 text-xl font-bold text-cd-midnight">Materiality Assessment Report</h2>
            
            <div className="prose max-w-none space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-cd-midnight mb-2">Executive Summary</h3>
                <p className="text-cd-muted">
                  This materiality assessment identified {esgIssues.length} ESG topics across Environmental, Social, and Governance categories.
                  Of these, {criticalIssues.length} were rated as critically material, requiring immediate attention and resource allocation.
                  The assessment engaged {stakeholderGroups.length} distinct stakeholder groups representing over {stakeholderGroups.reduce((sum, g) => sum + g.contactCount, 0)} individual stakeholders.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cd-midnight mb-2">Critical Material Topics</h3>
                <div className="space-y-2">
                  {criticalIssues.map((issue) => (
                    <div key={issue.id} className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <h4 className="font-semibold text-red-900">{issue.name}</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Impact Score: {issue.impactScore}/10 | Financial Score: {issue.financialScore}/10
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        Risk Level: {issue.riskLevel} | Opportunity Level: {issue.opportunityLevel}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {issue.frameworks.map(fw => (
                          <span key={fw} className="rounded bg-red-200 px-2 py-0.5 text-xs text-red-900">{fw}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cd-midnight mb-2">Framework Alignment</h3>
                <p className="text-cd-muted">
                  This assessment aligns with the requirements of {selectedFrameworks.join(', ')}, ensuring comprehensive
                  coverage of material topics relevant to multiple reporting standards. The double materiality approach
                  considers both the impact of ESG issues on the business (financial materiality) and the impact of the
                  business on society and the environment (impact materiality).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cd-midnight mb-2">Next Steps</h3>
                <ul className="list-disc pl-5 space-y-1 text-cd-muted">
                  <li>Develop action plans for critical material topics</li>
                  <li>Allocate resources based on materiality priorities</li>
                  <li>Establish KPIs and targets for material ESG issues</li>
                  <li>Integrate findings into ESG reporting across all frameworks</li>
                  <li>Schedule follow-up stakeholder engagement in 12 months</li>
                  <li>Monitor regulatory developments and update assessment as needed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
