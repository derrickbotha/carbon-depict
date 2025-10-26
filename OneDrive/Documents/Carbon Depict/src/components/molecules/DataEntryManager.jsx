/**
 * DataEntryManager Component
 * Reusable module for viewing, editing, and saving data collection entries
 * Works with all data collection forms (Scope 1/2/3, ESG metrics, etc.)
 */

import { useState, useEffect, useCallback } from 'react'
import { 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Clock,
  Trash2,
  RefreshCw
} from '@atoms/Icon'
import ConfirmDialog from './ConfirmDialog'

export default function DataEntryManager({ 
  formType = 'emissions', // 'emissions' or 'esg'
  scope = null, // For emissions: 'scope1', 'scope2', 'scope3'
  topic = null, // For ESG metrics
  pillar = null, // For ESG metrics
  formData,
  setFormData,
  onSave,
  isLoading = false
}) {
  const [lastEntry, setLastEntry] = useState(null)
  const [isLoadingEntry, setIsLoadingEntry] = useState(false)
  const [saveStatus, setSaveStatus] = useState('') // 'saving', 'saved', 'error', ''
  const [showLastEntry, setShowLastEntry] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [entryHistory, setEntryHistory] = useState([])
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, entryId: null })

  // Load last entry and entry history
  useEffect(() => {
    loadEntryHistory()
  }, [formType, scope, topic, pillar])

  const loadEntryHistory = async () => {
    try {
      setIsLoadingEntry(true)
      
      // Fetch last entry based on form type
      let response
      if (formType === 'emissions') {
        const { enterpriseAPI } = await import('../../services/enterpriseAPI')
        response = await enterpriseAPI.emissions.getByCategory(scope, new Date().getFullYear().toString())
        
        if (response.data.success && response.data.data) {
          const savedData = response.data.data
          setLastEntry(savedData)
          
          // Also fetch full history
          const historyResponse = await enterpriseAPI.emissions.getAll({ 
            scope, 
            limit: 10,
            sort: '-recordedAt'
          })
          if (historyResponse.data.success) {
            setEntryHistory(historyResponse.data.data || [])
          }
        }
      } else if (formType === 'esg') {
        const { enterpriseAPI } = await import('../../services/enterpriseAPI')
        response = await enterpriseAPI.esgMetrics.getAll({ 
          topic,
          pillar,
          limit: 1,
          sort: '-createdAt'
        })
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          const latestMetric = response.data.data[0]
          setLastEntry(latestMetric)
          setSelectedEntryId(latestMetric._id)
          
          // Fetch history
          const historyResponse = await enterpriseAPI.esgMetrics.getAll({ 
            topic,
            pillar,
            limit: 10,
            sort: '-createdAt'
          })
          if (historyResponse.data.success) {
            setEntryHistory(historyResponse.data.data || [])
          }
        }
      }
    } catch (error) {
      console.error('Error loading entry history:', error)
    } finally {
      setIsLoadingEntry(false)
    }
  }

  const handleViewLastEntry = () => {
    setShowLastEntry(true)
  }

  const handleEditLastEntry = () => {
    setIsEditing(true)
    setShowLastEntry(false)
    // Load last entry data into form
    if (lastEntry && lastEntry.metadata?.formData) {
      setFormData(lastEntry.metadata.formData)
    }
  }

  const handleLoadEntry = async (entryId) => {
    try {
      setIsLoadingEntry(true)
      
      if (formType === 'esg') {
        const { enterpriseAPI } = await import('../../services/enterpriseAPI')
        const response = await enterpriseAPI.esgMetrics.getById(entryId)
        
        if (response.data.success && response.data.data) {
          const entry = response.data.data
          setSelectedEntryId(entryId)
          
          // Load data into form
          if (entry.metadata?.formData) {
            setFormData(entry.metadata.formData)
            setIsEditing(true)
          }
        }
      }
    } catch (error) {
      console.error('Error loading entry:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    } finally {
      setIsLoadingEntry(false)
    }
  }

  const handleSaveData = async () => {
    if (!onSave) return
    
    setSaveStatus('saving')
    try {
      await onSave()
      setSaveStatus('saved')
      setIsEditing(false)
      
      // Reload entry history after save
      await loadEntryHistory()
      
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowLastEntry(false)
    setSaveStatus('')
  }

  const handleDeleteClick = (entryId) => {
    setDeleteConfirm({ isOpen: true, entryId })
  }

  const handleDeleteEntry = async () => {
    const entryId = deleteConfirm.entryId
    if (!entryId) return
    
    setSaveStatus('saving')
    try {
      if (formType === 'emissions') {
        const { enterpriseAPI } = await import('../../services/enterpriseAPI')
        await enterpriseAPI.emissions.delete(entryId)
        
        // Reload history
        await loadEntryHistory()
        
        // If this was the last entry being edited, clear it
        if (entryId === lastEntry?._id) {
          setLastEntry(null)
          setIsEditing(false)
        }
        
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 3000)
      } else if (formType === 'esg') {
        const { enterpriseAPI } = await import('../../services/enterpriseAPI')
        await enterpriseAPI.esgMetrics.delete(entryId)
        
        // Reload history
        await loadEntryHistory()
        if (selectedEntryId === entryId) {
          setSelectedEntryId(null)
          setFormData({}) // Clear form
        }
        
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      setSaveStatus('error')
      alert('Failed to delete entry. Please try again.')
      setTimeout(() => setSaveStatus(''), 3000)
    } finally {
      setDeleteConfirm({ isOpen: false, entryId: null })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saving': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'saved': return 'bg-green-100 text-green-700 border-green-300'
      case 'error': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'saved': return <CheckCircle2 className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...'
      case 'saved': return 'Saved successfully!'
      case 'error': return 'Error saving data'
      default: return ''
    }
  }

  return (
    <div className="space-y-4">
      {/* Last Entry Info Bar */}
      {lastEntry && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Clock className="h-5 w-5 text-blue-600" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Last Entry</p>
                <p className="text-xs text-gray-500">
                  {formatDate(lastEntry.createdAt || lastEntry.recordedAt)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleViewLastEntry}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye className="h-4 w-4" strokeWidth={2} />
                View
              </button>
              <button
                onClick={handleEditLastEntry}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" strokeWidth={2} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Status */}
      {saveStatus && (
        <div className={`rounded-lg border p-3 flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      )}

      {/* Entry History Dialog */}
      {showLastEntry && lastEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Entry History</h3>
                <button
                  onClick={() => setShowLastEntry(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Last Entry Details */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Last Entry Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(lastEntry.createdAt || lastEntry.recordedAt)}</span>
                  </div>
                  {lastEntry.reportingPeriod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reporting Period:</span>
                      <span className="font-medium">{lastEntry.reportingPeriod}</span>
                    </div>
                  )}
                  {lastEntry.value !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-medium">{lastEntry.value} {lastEntry.unit || ''}</span>
                    </div>
                  )}
                  {lastEntry.co2e !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">CO2e:</span>
                      <span className="font-medium">{lastEntry.co2e.toFixed(3)} kg CO2e</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Entries */}
              {entryHistory.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Entries</h4>
                  <div className="space-y-2">
                    {entryHistory.map((entry, idx) => (
                      <div
                        key={entry._id || idx}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleLoadEntry(entry._id)}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{entry.activityType || entry.metricName || 'Entry'}</p>
                          <p className="text-xs text-gray-500">{formatDate(entry.createdAt || entry.recordedAt)}</p>
                        </div>
                        <div className="flex gap-2">
                          {entry._id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClick(entry._id)
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={2} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLastEntry(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editing Mode Actions */}
      {isEditing && (
        <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-600" strokeWidth={2} />
            <span className="text-sm font-medium text-blue-900">Editing Last Entry</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveData}
              disabled={isLoading || saveStatus === 'saving'}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" strokeWidth={2} />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, entryId: null })}
        onConfirm={handleDeleteEntry}
        title="Delete Entry"
        message="Are you sure you want to delete this entry? This action cannot be undone and will permanently remove the data from your records."
        confirmText="Delete Entry"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

