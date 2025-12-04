/**
 * API Interceptors - Phase 3 Week 12: Frontend API Integration
 *
 * Advanced interceptors for:
 * - Request/response logging
 * - Retry mechanism
 * - Request caching
 * - Error handling
 * - Token refresh
 */

/**
 * Request logger interceptor
 */
export const requestLoggerInterceptor = {
  onFulfilled: (config) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }
    return config
  },
  onRejected: (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
}

/**
 * Response logger interceptor
 */
export const responseLoggerInterceptor = {
  onFulfilled: (response) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    return response
  },
  onRejected: (error) => {
    if (error.response) {
      console.error(`[API Response Error] ${error.response.status} ${error.config?.url}`, {
        data: error.response.data
      })
    }
    return Promise.reject(error)
  }
}

/**
 * Retry interceptor with exponential backoff
 */
export const createRetryInterceptor = (maxRetries = 3, retryDelay = 1000) => {
  return {
    onRejected: async (error) => {
      const config = error.config

      // Don't retry if already retried max times
      if (!config || !config.retry || config.__retryCount >= maxRetries) {
        return Promise.reject(error)
      }

      // Don't retry on client errors (4xx except 429) or auth errors
      const status = error.response?.status
      if (status && status >= 400 && status < 500 && status !== 429) {
        return Promise.reject(error)
      }

      // Increment retry count
      config.__retryCount = config.__retryCount || 0
      config.__retryCount += 1

      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, config.__retryCount - 1)

      console.log(`[API Retry] Attempt ${config.__retryCount}/${maxRetries} after ${delay}ms`)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))

      // Retry the request
      return error.config.axios.request(config)
    }
  }
}

/**
 * Token refresh interceptor
 */
export const createTokenRefreshInterceptor = (refreshTokenFn) => {
  let isRefreshing = false
  let failedQueue = []

  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })

    failedQueue = []
  }

  return {
    onRejected: async (error) => {
      const originalRequest = error.config

      // If error is 401 and we haven't tried refreshing yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return error.config.axios.request(originalRequest)
            })
            .catch(err => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const token = await refreshTokenFn()
          processQueue(null, token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          return error.config.axios.request(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError, null)
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  }
}

/**
 * Cache interceptor for GET requests
 */
export const createCacheInterceptor = (cacheDuration = 60000) => {
  const cache = new Map()

  return {
    request: {
      onFulfilled: (config) => {
        // Only cache GET requests
        if (config.method?.toLowerCase() === 'get' && config.cache !== false) {
          const cacheKey = `${config.url}:${JSON.stringify(config.params)}`
          const cachedResponse = cache.get(cacheKey)

          if (cachedResponse && Date.now() - cachedResponse.timestamp < cacheDuration) {
            console.log('[API Cache] Hit:', cacheKey)
            // Return cached response as a resolved promise
            config.adapter = () => Promise.resolve(cachedResponse.data)
          }
        }

        return config
      }
    },
    response: {
      onFulfilled: (response) => {
        // Cache successful GET responses
        if (response.config.method?.toLowerCase() === 'get' && response.config.cache !== false) {
          const cacheKey = `${response.config.url}:${JSON.stringify(response.config.params)}`
          cache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
          })
          console.log('[API Cache] Set:', cacheKey)
        }

        return response
      }
    }
  }
}

/**
 * Offline queue interceptor
 */
export const createOfflineQueueInterceptor = () => {
  const queue = []
  let isOnline = navigator.onLine

  // Listen for online/offline events
  window.addEventListener('online', () => {
    isOnline = true
    processQueue()
  })

  window.addEventListener('offline', () => {
    isOnline = false
  })

  const processQueue = async () => {
    while (queue.length > 0 && isOnline) {
      const { config, resolve, reject } = queue.shift()

      try {
        const response = await config.axios.request(config)
        resolve(response)
      } catch (error) {
        reject(error)
      }
    }
  }

  return {
    onRejected: (error) => {
      // If network error and offline, queue the request
      if (!error.response && !isOnline && error.config.offlineQueue !== false) {
        console.log('[API Offline] Queuing request:', error.config.url)

        return new Promise((resolve, reject) => {
          queue.push({
            config: error.config,
            resolve,
            reject
          })
        })
      }

      return Promise.reject(error)
    }
  }
}

/**
 * Rate limit interceptor
 */
export const createRateLimitInterceptor = (maxRequests = 100, windowMs = 60000) => {
  const requests = []

  return {
    onFulfilled: async (config) => {
      const now = Date.now()

      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < now - windowMs) {
        requests.shift()
      }

      // Check if rate limit exceeded
      if (requests.length >= maxRequests) {
        const oldestRequest = requests[0]
        const waitTime = oldestRequest + windowMs - now

        console.warn(`[API Rate Limit] Waiting ${waitTime}ms`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }

      // Add current request
      requests.push(now)

      return config
    }
  }
}

/**
 * Performance monitoring interceptor
 */
export const createPerformanceInterceptor = () => {
  return {
    request: {
      onFulfilled: (config) => {
        config.metadata = { startTime: Date.now() }
        return config
      }
    },
    response: {
      onFulfilled: (response) => {
        if (response.config.metadata) {
          const duration = Date.now() - response.config.metadata.startTime
          console.log(`[API Performance] ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`)

          // Store performance data
          if (window.apiPerformance) {
            window.apiPerformance.push({
              url: response.config.url,
              method: response.config.method,
              duration,
              timestamp: Date.now()
            })
          }
        }

        return response
      },
      onRejected: (error) => {
        if (error.config?.metadata) {
          const duration = Date.now() - error.config.metadata.startTime
          console.log(`[API Performance] ${error.config.method?.toUpperCase()} ${error.config.url}: ${duration}ms (failed)`)
        }

        return Promise.reject(error)
      }
    }
  }
}

export default {
  requestLoggerInterceptor,
  responseLoggerInterceptor,
  createRetryInterceptor,
  createTokenRefreshInterceptor,
  createCacheInterceptor,
  createOfflineQueueInterceptor,
  createRateLimitInterceptor,
  createPerformanceInterceptor
}
