// Cache bust 2025-10-23
import { useState, useRef } from 'react'
import { AlertCircle, TrendingUp, DollarSign, Users, Grid, Download, Save, X, FileImage, FileSpreadsheet, Mail, Plus, Check } from '@atoms/Icon'
import html2canvas from 'html2canvas'

export default function MaterialityAssessment() {
  const [selectedTopics, setSelectedTopics] = useState([])
  const [showExportModal, setShowExportModal] = useState(false)
  const [showStakeholderModal, setShowStakeholderModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const matrixRef = useRef(null)

  // Sample materiality topics based on CSRD double materiality
  const topics = [
    { id: 1, name: 'Climate Change Mitigation', category: 'E', impactScore: 9, financialScore: 8, x: 80, y: 90 },
    { id: 2, name: 'Climate Change Adaptation', category: 'E', impactScore: 7, financialScore: 6, x: 60, y: 70 },
    { id: 3, name: 'Water & Marine Resources', category: 'E', impactScore: 6, financialScore: 5, x: 50, y: 60 },
    { id: 4, name: 'Biodiversity & Ecosystems', category: 'E', impactScore: 8, financialScore: 4, x: 40, y: 80 },
    { id: 5, name: 'Circular Economy', category: 'E', impactScore: 7, financialScore: 7, x: 70, y: 70 },
    { id: 6, name: 'Pollution Prevention', category: 'E', impactScore: 6, financialScore: 3, x: 30, y: 60 },
    { id: 7, name: 'Own Workforce', category: 'S', impactScore: 9, financialScore: 9, x: 90, y: 90 },
    { id: 8, name: 'Workers in Value Chain', category: 'S', impactScore: 8, financialScore: 6, x: 60, y: 80 },
    { id: 9, name: 'Affected Communities', category: 'S', impactScore: 7, financialScore: 5, x: 50, y: 70 },
    { id: 10, name: 'Consumers & End-Users', category: 'S', impactScore: 8, financialScore: 8, x: 80, y: 80 },
    { id: 11, name: 'Business Conduct', category: 'G', impactScore: 9, financialScore: 9, x: 90, y: 90 },
    { id: 12, name: 'Board Diversity', category: 'G', impactScore: 6, financialScore: 7, x: 70, y: 60 },
    { id: 13, name: 'Data Privacy & Security', category: 'G', impactScore: 8, financialScore: 9, x: 90, y: 80 },
    { id: 14, name: 'Anti-Corruption', category: 'G', impactScore: 8, financialScore: 8, x: 80, y: 80 },
  ]

  const getCategoryColor = (category) => {
    switch (category) {
      case 'E': return 'bg-green-500'
      case 'S': return 'bg-blue-500'
      case 'G': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getMaterialityLevel = (topic) => {
    const avg = (topic.impactScore + topic.financialScore) / 2
    if (avg >= 8) return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' }
    if (avg >= 6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' }
  }

  // Save Assessment Function
  const handleSaveAssessment = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, this would be:
      // await apiClient.post('/api/esg/materiality', {
      //   topics: topics,
      //   selectedTopics: selectedTopics,
      //   assessmentDate: new Date().toISOString(),
      //   assessmentType: 'CSRD_DOUBLE_MATERIALITY'
      // })
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to save assessment. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Export to Excel
  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Topic', 'Category', 'Impact Score', 'Financial Score', 'Materiality Level', 'Average Score']
    const rows = topics.map(topic => {
      const materiality = getMaterialityLevel(topic)
      const avg = ((topic.impactScore + topic.financialScore) / 2).toFixed(1)
      return [
        topic.name,
        topic.category === 'E' ? 'Environmental' : topic.category === 'S' ? 'Social' : 'Governance',
        topic.impactScore,
        topic.financialScore,
        materiality.level,
        avg
      ]
    })

    let csvContent = headers.join(',') + '\n'
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
    })

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `materiality-assessment-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setShowExportModal(false)
  }

  // Export to Image
  const exportToImage = async () => {
    if (!matrixRef.current) return

    try {
      const canvas = await html2canvas(matrixRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      })

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `materiality-matrix-${new Date().toISOString().split('T')[0]}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      })
      
      setShowExportModal(false)
    } catch (error) {
      console.error('Export to image failed:', error)
      alert('Failed to export image. Please try again.')
    }
  }

  // Stakeholder Input
  const [stakeholderForm, setStakeholderForm] = useState({
    name: '',
    email: '',
    organization: '',
    stakeholderType: 'customer',
    selectedTopics: [],
    comments: ''
  })

  const handleStakeholderSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In production:
      // await apiClient.post('/api/esg/stakeholder-input', stakeholderForm)
      
      alert(`Thank you ${stakeholderForm.name}! Your input has been recorded.`)
      setShowStakeholderModal(false)
      setStakeholderForm({
        name: '',
        email: '',
        organization: '',
        stakeholderType: 'customer',
        selectedTopics: [],
        comments: ''
      })
    } catch (error) {
      console.error('Submission failed:', error)
      alert('Failed to submit. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cd-midnight">Double Materiality Assessment</h1>
        <p className="mt-2 text-cd-muted">
          CSRD-compliant materiality assessment combining impact and financial perspectives
        </p>
      </div>

      {/* Information Banner */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium">About Double Materiality</p>
            <p className="mt-1">
              <strong>Impact Materiality (Y-axis):</strong> How your operations affect environment & society (inside-out)
            </p>
            <p className="mt-1">
              <strong>Financial Materiality (X-axis):</strong> How sustainability issues affect your business (outside-in)
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button 
          onClick={handleSaveAssessment}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-cd-teal px-4 py-2 text-white hover:bg-cd-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          {isSaving ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saveSuccess ? (
            <>
              <Check className="h-5 w-5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Assessment
            </>
          )}
        </button>
        <button 
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-midnight hover:bg-gray-50 transition-all hover:scale-105"
        >
                  <Mail className="h-5 w-5" />
          <Download className="h-5 w-5" />
          Export Matrix
        </button>
        <button 
          onClick={() => setShowStakeholderModal(true)}
          className="flex items-center gap-2 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-midnight hover:bg-gray-50 transition-all hover:scale-105"
        >
          <Users className="h-5 w-5" />
          Stakeholder Input
        </button>
      </div>

      {/* Materiality Matrix */}
      <div className="rounded-lg bg-white p-6 shadow-cd-md">
        <h2 className="text-xl font-bold text-cd-midnight mb-4">Materiality Matrix</h2>
        
        {/* Wrapper for Matrix + Legend (for image export) */}
        <div ref={matrixRef} className="px-8 py-10">
          <div className="relative aspect-square bg-gradient-to-tr from-green-50 via-yellow-50 to-red-50 rounded-lg border-2 border-cd-border">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="border border-gray-200/50" />
              ))}
            </div>

            {/* Axis Labels */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-cd-midnight">
              Financial Materiality →
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 -rotate-90 text-sm font-medium text-cd-midnight">
              Impact Materiality →
            </div>

            {/* Quadrant Labels */}
            <div className="absolute top-2 right-2 text-xs font-medium text-red-600 bg-white/80 px-2 py-1 rounded">
              High Priority
            </div>
            <div className="absolute bottom-2 left-2 text-xs font-medium text-green-600 bg-white/80 px-2 py-1 rounded">
              Low Priority
            </div>

            {/* Topics */}
            {topics.map(topic => {
              const materiality = getMaterialityLevel(topic)
              return (
                <button
                  key={topic.id}
                  className={`absolute group transition-transform hover:scale-110 ${
                    selectedTopics.includes(topic.id) ? 'ring-2 ring-cd-teal ring-offset-2' : ''
                  }`}
                  style={{
                    left: `${topic.x}%`,
                    top: `${100 - topic.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => {
                    setSelectedTopics(prev =>
                      prev.includes(topic.id)
                        ? prev.filter(id => id !== topic.id)
                        : [...prev, topic.id]
                    )
                  }}
                >
                  <div className={`w-4 h-4 rounded-full ${getCategoryColor(topic.category)} shadow-lg`} />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block whitespace-nowrap bg-cd-midnight text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                    {topic.name}
                    <div className="text-xs opacity-75 mt-0.5">
                      Impact: {topic.impactScore}/10 | Financial: {topic.financialScore}/10
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-cd-muted">Environmental</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-cd-muted">Social</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm text-cd-muted">Governance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic List */}
      <div className="rounded-lg bg-white shadow-cd-md overflow-hidden">
        <div className="p-6 border-b border-cd-border">
          <h2 className="text-xl font-bold text-cd-midnight">Material Topics</h2>
        </div>
        <div className="divide-y divide-cd-border">
          {topics.map(topic => {
            const materiality = getMaterialityLevel(topic)
            return (
              <div key={topic.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getCategoryColor(topic.category)}`} />
                    <span className="font-medium text-cd-midnight">{topic.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-cd-muted">
                      Impact: <span className="font-medium text-cd-midnight">{topic.impactScore}/10</span>
                    </div>
                    <div className="text-sm text-cd-muted">
                      Financial: <span className="font-medium text-cd-midnight">{topic.financialScore}/10</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${materiality.bg} ${materiality.color}`}>
                      {materiality.level}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cd-midnight">Export Materiality Matrix</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-cd-muted mb-6">
              Choose your preferred export format for the materiality assessment data and visualization.
            </p>

            <div className="space-y-3">
              <button
                onClick={exportToImage}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-cd-teal hover:bg-cd-teal/5 transition-all group"
              >
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <FileImage className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-cd-midnight">Export as Image</div>
                  <div className="text-sm text-cd-muted">PNG format, high resolution (2x)</div>
                </div>
              </button>

              <button
                onClick={exportToExcel}
                className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-cd-teal hover:bg-cd-teal/5 transition-all group"
              >
                <div className="p-3 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-cd-midnight">Export as Excel/CSV</div>
                  <div className="text-sm text-cd-muted">Spreadsheet with all topic scores</div>
                </div>
              </button>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-cd-midnight hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stakeholder Input Modal */}
      {showStakeholderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cd-midnight">Stakeholder Input Form</h3>
              <button 
                onClick={() => setShowStakeholderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-cd-muted mb-6">
              Your input is valuable for our materiality assessment. Please share which topics you believe are most material to our organization.
            </p>

            <form onSubmit={handleStakeholderSubmit} className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={stakeholderForm.name}
                    onChange={(e) => setStakeholderForm({...stakeholderForm, name: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={stakeholderForm.email}
                    onChange={(e) => setStakeholderForm({...stakeholderForm, email: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={stakeholderForm.organization}
                    onChange={(e) => setStakeholderForm({...stakeholderForm, organization: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                    placeholder="Your company/organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cd-midnight mb-2">
                    Stakeholder Type *
                  </label>
                  <select
                    required
                    value={stakeholderForm.stakeholderType}
                    onChange={(e) => setStakeholderForm({...stakeholderForm, stakeholderType: e.target.value})}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                  >
                    <option value="customer">Customer</option>
                    <option value="supplier">Supplier</option>
                    <option value="employee">Employee</option>
                    <option value="investor">Investor</option>
                    <option value="community">Community Member</option>
                    <option value="ngo">NGO/Advocacy Group</option>
                    <option value="regulator">Regulator</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Topic Selection */}
              <div>
                <label className="block text-sm font-medium text-cd-midnight mb-2">
                  Which topics do you consider most material? (Select all that apply)
                </label>
                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                  {topics.map(topic => (
                    <label key={topic.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={stakeholderForm.selectedTopics.includes(topic.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setStakeholderForm({
                              ...stakeholderForm,
                              selectedTopics: [...stakeholderForm.selectedTopics, topic.id]
                            })
                          } else {
                            setStakeholderForm({
                              ...stakeholderForm,
                              selectedTopics: stakeholderForm.selectedTopics.filter(id => id !== topic.id)
                            })
                          }
                        }}
                        className="rounded border-gray-300 text-cd-teal focus:ring-cd-teal"
                      />
                      <div className={`w-2 h-2 rounded-full ${getCategoryColor(topic.category)}`} />
                      <span className="text-sm text-cd-midnight">{topic.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-cd-midnight mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={stakeholderForm.comments}
                  onChange={(e) => setStakeholderForm({...stakeholderForm, comments: e.target.value})}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                  placeholder="Share any additional insights or concerns about materiality topics..."
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStakeholderModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-cd-midnight hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-cd-teal px-4 py-2 text-white hover:bg-cd-teal/90 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Submit Input
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

