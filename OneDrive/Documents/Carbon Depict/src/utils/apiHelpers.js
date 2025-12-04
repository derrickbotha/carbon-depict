/**
 * API Helper Functions - Phase 3 Week 12: Frontend API Integration
 *
 * Utility functions for API operations:
 * - Request builders
 * - Response transformers
 * - Query param builders
 * - File upload helpers
 */

/**
 * Build query string from object
 */
export const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) {
    return ''
  }

  const query = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&')
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')

  return query ? `?${query}` : ''
}

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {}

  const params = {}
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString

  query.split('&').forEach(param => {
    const [key, value] = param.split('=')
    if (key) {
      const decodedKey = decodeURIComponent(key)
      const decodedValue = decodeURIComponent(value || '')

      // Handle array parameters
      if (params[decodedKey]) {
        if (Array.isArray(params[decodedKey])) {
          params[decodedKey].push(decodedValue)
        } else {
          params[decodedKey] = [params[decodedKey], decodedValue]
        }
      } else {
        params[decodedKey] = decodedValue
      }
    }
  })

  return params
}

/**
 * Build form data for file upload
 */
export const buildFormData = (data, files = []) => {
  const formData = new FormData()

  // Append regular data
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item)
        })
      } else {
        formData.append(key, value)
      }
    }
  })

  // Append files
  files.forEach((file, index) => {
    if (file instanceof File) {
      formData.append(`files[${index}]`, file, file.name)
    }
  })

  return formData
}

/**
 * Transform response data
 */
export const transformResponse = (response, transformer) => {
  if (!transformer) return response

  try {
    return transformer(response.data)
  } catch (error) {
    console.error('Response transformation error:', error)
    return response
  }
}

/**
 * Extract pagination data from response
 */
export const extractPagination = (response) => {
  const data = response.data

  return {
    page: data.page || data.pagination?.page || 1,
    limit: data.limit || data.pagination?.limit || 20,
    total: data.total || data.pagination?.total || 0,
    totalPages: data.pages || data.pagination?.pages || 0,
    hasNextPage: data.hasNextPage || data.pagination?.hasNextPage || false,
    hasPrevPage: data.hasPrevPage || data.pagination?.hasPrevPage || false
  }
}

/**
 * Build filter params
 */
export const buildFilterParams = (filters) => {
  const params = {}

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      // Handle date ranges
      if (key.endsWith('_from') || key.endsWith('_to')) {
        params[key] = value instanceof Date ? value.toISOString() : value
      }
      // Handle arrays
      else if (Array.isArray(value)) {
        params[key] = value.join(',')
      }
      // Handle objects
      else if (typeof value === 'object') {
        params[key] = JSON.stringify(value)
      }
      // Handle primitives
      else {
        params[key] = value
      }
    }
  })

  return params
}

/**
 * Download file from blob response
 */
export const downloadFile = (response, filename) => {
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * Create cancel token
 */
export const createCancelToken = () => {
  const controller = new AbortController()

  return {
    signal: controller.signal,
    cancel: (reason) => controller.abort(reason)
  }
}

/**
 * Batch requests
 */
export const batchRequests = async (requests, options = {}) => {
  const {
    batchSize = 5,
    delay = 100,
    onProgress = null
  } = options

  const results = []
  const total = requests.length

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize)

    // Execute batch in parallel
    const batchResults = await Promise.allSettled(
      batch.map(req => req())
    )

    results.push(...batchResults)

    // Report progress
    if (onProgress) {
      onProgress({
        completed: Math.min(i + batchSize, total),
        total,
        percentage: Math.round((Math.min(i + batchSize, total) / total) * 100)
      })
    }

    // Delay between batches
    if (i + batchSize < requests.length && delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return results
}

/**
 * Retry request with exponential backoff
 */
export const retryRequest = async (requestFn, options = {}) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry = null
  } = options

  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error) {
      lastError = error

      // Don't retry on client errors (except 429)
      if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
        throw error
      }

      // No more retries
      if (attempt === maxRetries) {
        break
      }

      // Calculate delay
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      )

      // Notify retry
      if (onRetry) {
        onRetry({ attempt: attempt + 1, maxRetries, delay, error })
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Debounce API call
 */
export const debounceAPI = (fn, delay = 300) => {
  let timeoutId

  return (...args) => {
    clearTimeout(timeoutId)

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
}

/**
 * Throttle API call
 */
export const throttleAPI = (fn, limit = 1000) => {
  let lastCall = 0
  let timeout

  return (...args) => {
    const now = Date.now()

    return new Promise((resolve, reject) => {
      if (now - lastCall >= limit) {
        lastCall = now
        fn(...args).then(resolve).catch(reject)
      } else {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          lastCall = Date.now()
          fn(...args).then(resolve).catch(reject)
        }, limit - (now - lastCall))
      }
    })
  }
}

/**
 * Merge API responses
 */
export const mergeResponses = (responses, mergeKey = 'data') => {
  return responses.reduce((acc, response) => {
    if (response.status === 'fulfilled') {
      const data = response.value.data[mergeKey]

      if (Array.isArray(data)) {
        acc.push(...data)
      } else if (typeof data === 'object') {
        Object.assign(acc, data)
      }
    }

    return acc
  }, Array.isArray(responses[0]?.value?.data?.[mergeKey]) ? [] : {})
}

/**
 * Poll API endpoint
 */
export const pollAPI = async (requestFn, options = {}) => {
  const {
    interval = 5000,
    maxAttempts = 10,
    shouldStop = null,
    onPoll = null
  } = options

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await requestFn()

      if (onPoll) {
        onPoll({ attempt, response })
      }

      if (shouldStop && shouldStop(response)) {
        return response
      }

      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }

  throw new Error('Max polling attempts reached')
}

export default {
  buildQueryString,
  parseQueryString,
  buildFormData,
  transformResponse,
  extractPagination,
  buildFilterParams,
  downloadFile,
  createCancelToken,
  batchRequests,
  retryRequest,
  debounceAPI,
  throttleAPI,
  mergeResponses,
  pollAPI
}
