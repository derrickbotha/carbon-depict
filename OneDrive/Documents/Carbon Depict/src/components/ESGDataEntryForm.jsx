// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader, Upload, FileText, TrendingUp } from '@atoms/Icon'
import { useComplianceValidation, useComplianceProof } from '../hooks/useComplianceValidation'

/**
 * Enhanced ESG Data Entry Form with Real-time Compliance Validation
 * Supports multiple frameworks with AI-powered validation
 */
const ESGDataEntryForm = ({ framework = 'GRI', onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    category: initialData.category || 'Environmental',
    pillar: initialData.pillar || '',
    disclosure: initialData.disclosure || '',
    value: initialData.value || '',
    unit: initialData.unit || '',
    period: initialData.period || new Date().toISOString().slice(0, 7), // YYYY-MM
    methodology: initialData.methodology || '',
    dataSource: initialData.dataSource || '',
    verified: initialData.verified || false,
    notes: initialData.notes || '',
  })

  const [proofFile, setProofFile] = useState(null)
  const [savedMetricId, setSavedMetricId] = useState(initialData.id || null)

  // Compliance validation hook
  const {
    isValidating,
    validationResult,
    error: validationError,
    validateDebounced,
    clearValidation
  } = useComplianceValidation(framework)

  // Proof upload hook
  const {
    isUploading,
    uploadProgress,
    uploadError,
    uploadProof
  } = useComplianceProof()

  // Trigger validation when form data changes
  useEffect(() => {
    if (formData.disclosure && formData.value) {
      validateDebounced({
        ...formData,
        framework
      })
    } else {
      clearValidation()
    }
  }, [formData, framework, validateDebounced, clearValidation])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      setProofFile(file)
    }
  }

  const handleProofUpload = async () => {
    if (!proofFile || !savedMetricId) return

    const result = await uploadProof(savedMetricId, proofFile, 'supporting_document')
    
    if (result) {
      alert('Proof uploaded successfully!')
      setProofFile(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      framework,
      complianceAnalysis: validationResult
    }

    if (onSubmit) {
      const result = await onSubmit(submitData)
      if (result?.id) {
        setSavedMetricId(result.id)
      }
    }
  }

  const getComplianceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Framework Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-800">
              {framework} Framework
            </span>
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader className="h-4 w-4 animate-spin" />
                Validating...
              </div>
            )}
          </div>
        </div>

        {/* Real-time Compliance Score */}
        {validationResult && (
          <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Compliance Analysis</h3>
              <div className={`rounded-full px-4 py-2 text-2xl font-bold ${getComplianceColor(validationResult.complianceScore)}`}>
                {validationResult.complianceScore}%
              </div>
            </div>

            {/* Missing Elements */}
            {validationResult.missingElements?.length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  Missing Required Elements
                </h4>
                <ul className="space-y-1">
                  {validationResult.missingElements.map((element, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {element}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {validationResult.recommendations?.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {validationResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">Validation Error:</span>
              <span>{validationError}</span>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="Environmental">Environmental</option>
              <option value="Social">Social</option>
              <option value="Governance">Governance</option>
            </select>
          </div>

          {/* Pillar */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Pillar <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pillar"
              value={formData.pillar}
              onChange={handleInputChange}
              placeholder="e.g., Climate Change, Human Rights"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Disclosure */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Disclosure ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="disclosure"
              value={formData.disclosure}
              onChange={handleInputChange}
              placeholder="e.g., 305-1, TCFD-2.1"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Value */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g., 15000"
              required
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              placeholder="e.g., tCO2e, hours, employees"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Period */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Period <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              name="period"
              value={formData.period}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        {/* Methodology */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Methodology
          </label>
          <input
            type="text"
            name="methodology"
            value={formData.methodology}
            onChange={handleInputChange}
            placeholder="e.g., GHG Protocol, Lifecycle Assessment"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Data Source */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Data Source
          </label>
          <input
            type="text"
            name="dataSource"
            value={formData.dataSource}
            onChange={handleInputChange}
            placeholder="e.g., Internal monitoring system, Supplier data"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            placeholder="Additional context or assumptions..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {/* Verified Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            This data has been verified by an external auditor
          </label>
        </div>

        {/* Proof Upload Section */}
        {savedMetricId && (
          <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
              <FileText className="h-5 w-5" />
              Upload Supporting Documentation
            </h3>
            
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  className="w-full"
                />
                {proofFile && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {proofFile.name} ({(proofFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {isUploading && (
                <div className="w-full rounded-lg bg-gray-200">
                  <div
                    className="rounded-lg bg-indigo-600 py-1 text-center text-xs text-white"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-sm text-red-600">{uploadError}</p>
              )}

              <button
                type="button"
                onClick={handleProofUpload}
                disabled={!proofFile || isUploading}
                className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Proof'}
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                category: 'Environmental',
                pillar: '',
                disclosure: '',
                value: '',
                unit: '',
                period: new Date().toISOString().slice(0, 7),
                methodology: '',
                dataSource: '',
                verified: false,
                notes: '',
              })
              clearValidation()
            }}
            className="rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Clear Form
          </button>
          
          <button
            type="submit"
            disabled={isValidating || !formData.disclosure || !formData.value}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <CheckCircle className="h-5 w-5" />
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  )
}

export default ESGDataEntryForm
