/**
 * Async State Management Hook - Phase 3 Week 11: Frontend State Management
 *
 * Custom hook for managing async operations with:
 * - Loading, error, and data states
 * - Automatic request cancellation
 * - Retry mechanism
 * - Debouncing support
 */
import { useState, useCallback, useRef, useEffect } from 'react'

export const useAsync = (asyncFunction, immediate = false, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    retry = 0,
    debounce = 0
  } = options

  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const abortController = useRef(null)
  const debounceTimeout = useRef(null)

  /**
   * Execute the async function
   */
  const execute = useCallback(async (...args) => {
    // Clear existing debounce timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort()
    }

    const executeRequest = async () => {
      setStatus('pending')
      setData(null)
      setError(null)

      // Create new abort controller
      abortController.current = new AbortController()

      try {
        const response = await asyncFunction(...args, {
          signal: abortController.current.signal
        })

        setData(response)
        setStatus('success')
        setRetryCount(0)

        if (onSuccess) {
          onSuccess(response)
        }

        return response
      } catch (err) {
        // Ignore abort errors
        if (err.name === 'AbortError') {
          return
        }

        setError(err)
        setStatus('error')

        // Retry logic
        if (retryCount < retry) {
          setRetryCount(prev => prev + 1)
          return execute(...args)
        }

        if (onError) {
          onError(err)
        }

        throw err
      }
    }

    if (debounce > 0) {
      return new Promise((resolve, reject) => {
        debounceTimeout.current = setTimeout(async () => {
          try {
            const result = await executeRequest()
            resolve(result)
          } catch (err) {
            reject(err)
          }
        }, debounce)
      })
    }

    return executeRequest()
  }, [asyncFunction, onSuccess, onError, retry, retryCount, debounce])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setStatus('idle')
    setData(null)
    setError(null)
    setRetryCount(0)

    if (abortController.current) {
      abortController.current.abort()
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }
  }, [])

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort()
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    setStatus('idle')
  }, [])

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute()
    }

    // Cleanup on unmount
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [immediate, execute])

  return {
    execute,
    reset,
    cancel,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isPending: status === 'pending',
    isSuccess: status === 'success',
    isError: status === 'error',
    retryCount
  }
}

export default useAsync
