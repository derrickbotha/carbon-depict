/**
 * Optimistic Mutation Hook - Phase 3 Week 11: Frontend State Management
 *
 * Reusable hook for implementing optimistic updates with automatic rollback:
 * - Apply optimistic update immediately
 * - Execute mutation
 * - Confirm or rollback based on result
 * - Handle errors gracefully
 */
import { useState, useCallback, useRef } from 'react'
import { useAppState } from '../contexts/AppStateContext'

/**
 * Hook for performing mutations with optimistic updates
 *
 * @param {Function} mutationFn - The async function to execute the mutation
 * @param {Object} options - Configuration options
 * @returns {Object} Mutation state and execute function
 *
 * @example
 * const updateTodo = useOptimisticMutation(
 *   async (id, updates) => api.updateTodo(id, updates),
 *   {
 *     onOptimisticUpdate: (id, updates) => {
 *       setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
 *     },
 *     onSuccess: (result) => {
 *       setTodos(prev => prev.map(t => t.id === result.id ? result : t))
 *     },
 *     onError: (error, originalData) => {
 *       setTodos(prev => prev.map(t => t.id === originalData.id ? originalData : t))
 *     },
 *     successMessage: 'Todo updated successfully',
 *     errorMessage: 'Failed to update todo'
 *   }
 * )
 */
export const useOptimisticMutation = (mutationFn, options = {}) => {
  const {
    onOptimisticUpdate = null,
    onSuccess = null,
    onError = null,
    onSettled = null,
    successMessage = null,
    errorMessage = null,
    showSuccessToast = true,
    showErrorToast = true,
  } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const { showSuccess, showError } = useAppState() || {}
  const originalDataRef = useRef(null)
  const abortController = useRef(null)

  /**
   * Execute mutation with optimistic update
   */
  const mutate = useCallback(async (...args) => {
    setIsLoading(true)
    setError(null)

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    try {
      // Apply optimistic update if provided
      if (onOptimisticUpdate) {
        originalDataRef.current = onOptimisticUpdate(...args)
      }

      // Execute mutation
      const result = await mutationFn(...args, {
        signal: abortController.current.signal
      })

      setData(result)

      // Confirm optimistic update with real data
      if (onSuccess) {
        onSuccess(result, ...args)
      }

      // Show success message
      if (showSuccessToast && successMessage && showSuccess) {
        showSuccess(successMessage)
      }

      return result
    } catch (err) {
      // Ignore abort errors
      if (err.name === 'AbortError') {
        return
      }

      setError(err)

      // Rollback optimistic update
      if (onError && originalDataRef.current) {
        onError(err, originalDataRef.current, ...args)
      }

      // Show error message
      if (showErrorToast && showError) {
        const message = errorMessage || err.response?.data?.error || err.message || 'Operation failed'
        showError(message)
      }

      throw err
    } finally {
      setIsLoading(false)

      // Cleanup
      if (onSettled) {
        onSettled(data, error, ...args)
      }

      originalDataRef.current = null
    }
  }, [
    mutationFn,
    onOptimisticUpdate,
    onSuccess,
    onError,
    onSettled,
    successMessage,
    errorMessage,
    showSuccessToast,
    showErrorToast,
    showSuccess,
    showError,
    data,
    error
  ])

  /**
   * Reset mutation state
   */
  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setData(null)
    originalDataRef.current = null

    if (abortController.current) {
      abortController.current.abort()
    }
  }, [])

  /**
   * Cancel ongoing mutation
   */
  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort()
    }
    setIsLoading(false)
  }, [])

  return {
    mutate,
    reset,
    cancel,
    isLoading,
    isError: !!error,
    isSuccess: !error && data !== null,
    isIdle: !isLoading && !error && data === null,
    error,
    data
  }
}

/**
 * Hook for performing multiple mutations in sequence with optimistic updates
 *
 * @param {Array} mutations - Array of mutation configurations
 * @returns {Object} Batch mutation state and execute function
 *
 * @example
 * const batchUpdate = useBatchOptimisticMutation([
 *   { fn: api.updateTodo, onOptimistic: updateTodoOptimistically },
 *   { fn: api.updateUser, onOptimistic: updateUserOptimistically }
 * ])
 */
export const useBatchOptimisticMutation = (mutations = []) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [results, setResults] = useState([])

  const { showSuccess, showError } = useAppState() || {}

  const executeBatch = useCallback(async (args) => {
    setIsLoading(true)
    setErrors([])
    setResults([])

    const batchResults = []
    const batchErrors = []
    const rollbacks = []

    try {
      // Execute mutations in sequence
      for (let i = 0; i < mutations.length; i++) {
        const { fn, onOptimistic, onSuccess, onError } = mutations[i]
        const mutationArgs = Array.isArray(args[i]) ? args[i] : [args[i]]

        try {
          // Apply optimistic update
          let originalData = null
          if (onOptimistic) {
            originalData = onOptimistic(...mutationArgs)
            rollbacks.push({ onError, originalData, args: mutationArgs })
          }

          // Execute mutation
          const result = await fn(...mutationArgs)
          batchResults.push(result)

          // Confirm optimistic update
          if (onSuccess) {
            onSuccess(result, ...mutationArgs)
          }
        } catch (err) {
          batchErrors.push({ index: i, error: err })
          throw err // Stop batch on first error
        }
      }

      setResults(batchResults)

      if (showSuccess) {
        showSuccess('Batch operation completed successfully')
      }

      return batchResults
    } catch (err) {
      // Rollback all optimistic updates
      rollbacks.reverse().forEach(({ onError, originalData, args }) => {
        if (onError && originalData) {
          onError(err, originalData, ...args)
        }
      })

      setErrors(batchErrors)

      if (showError) {
        showError(`Batch operation failed: ${batchErrors.length} error(s)`)
      }

      throw err
    } finally {
      setIsLoading(false)
    }
  }, [mutations, showSuccess, showError])

  return {
    executeBatch,
    isLoading,
    errors,
    results,
    isError: errors.length > 0,
    isSuccess: results.length > 0 && errors.length === 0
  }
}

/**
 * Hook for debounced optimistic mutations (useful for auto-save)
 *
 * @param {Function} mutationFn - The async function to execute
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @param {Object} options - Mutation options
 * @returns {Object} Debounced mutation state and execute function
 */
export const useDebouncedOptimisticMutation = (mutationFn, debounceMs = 500, options = {}) => {
  const mutation = useOptimisticMutation(mutationFn, options)
  const timeoutRef = useRef(null)

  const debouncedMutate = useCallback((...args) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      mutation.mutate(...args)
    }, debounceMs)
  }, [mutation, debounceMs])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    mutation.cancel()
  }, [mutation])

  return {
    ...mutation,
    mutate: debouncedMutate,
    cancel
  }
}

export default useOptimisticMutation
