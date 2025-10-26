import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../utils/api'

/**
 * Custom hook for real-time ESG compliance validation
 * Debounces input and validates against selected framework
 * 
 * @param {string} framework - ESG framework (GRI, TCFD, CDP, SASB, SDG)
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 2000)
 * @returns {Object} - Validation state and methods
 */
export const useComplianceValidation = (framework, debounceMs = 2000) => {
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [error, setError] = useState(null)
  const debounceTimer = useRef(null)

  /**
   * Validate ESG data against framework
   */
  const validate = useCallback(async (data) => {
    if (!data || !framework) return

    setIsValidating(true)
    setError(null)

    try {
      const response = await apiClient.compliance.analyze({
        framework,
        data,
        realtime: true // Flag for real-time validation
      })

      setValidationResult(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      console.error('Compliance validation error:', err)
      return null
    } finally {
      setIsValidating(false)
    }
  }, [framework])

  /**
   * Debounced validation - waits for user to stop typing
   */
  const validateDebounced = useCallback((data) => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      validate(data)
    }, debounceMs)
  }, [validate, debounceMs])

  /**
   * Clear validation results
   */
  const clearValidation = useCallback(() => {
    setValidationResult(null)
    setError(null)
    setIsValidating(false)
    
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    isValidating,
    validationResult,
    error,
    validate,
    validateDebounced,
    clearValidation
  }
}

/**
 * Hook for managing compliance proof uploads
 */
export const useComplianceProof = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)

  const uploadProof = useCallback(async (metricId, file, documentType) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metricId', metricId)
      formData.append('documentType', documentType)

      const response = await apiClient.compliance.uploadProof(formData)
      
      setUploadProgress(100)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setUploadError(errorMessage)
      console.error('Proof upload error:', err)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadProof
  }
}

/**
 * Hook for managing draft/published workflow
 */
export const useComplianceWorkflow = () => {
  const [drafts, setDrafts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchDrafts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.compliance.getDrafts()
      setDrafts(response.data)
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      console.error('Fetch drafts error:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const publishMetric = useCallback(async (metricId) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.compliance.publish(metricId)
      
      // Remove from drafts
      setDrafts(prev => prev.filter(draft => draft.id !== metricId))
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      console.error('Publish metric error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reanalyze = useCallback(async (metricId, data) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.compliance.reanalyze(metricId, data)
      
      // Update draft in list
      setDrafts(prev => prev.map(draft => 
        draft.id === metricId ? response.data : draft
      ))
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message
      setError(errorMessage)
      console.error('Reanalyze error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    drafts,
    isLoading,
    error,
    fetchDrafts,
    publishMetric,
    reanalyze
  }
}

export default useComplianceValidation
