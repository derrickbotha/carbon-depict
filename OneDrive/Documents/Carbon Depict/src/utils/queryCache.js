/**
 * Query Cache Manager - Phase 3 Week 11: Frontend State Management
 *
 * Centralized cache management for API responses with:
 * - TTL (Time To Live) based expiration
 * - Cache invalidation strategies
 * - Query key management
 * - Memory management
 * - Garbage collection
 */

class QueryCache {
  constructor(options = {}) {
    this.cache = new Map()
    this.timestamps = new Map()
    this.dependencies = new Map()
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000 // 5 minutes default
    this.maxSize = options.maxSize || 100 // Maximum number of cached entries
    this.gcInterval = options.gcInterval || 60 * 1000 // Garbage collection interval (1 minute)

    // Start garbage collection
    this.startGarbageCollection()
  }

  /**
   * Generate cache key from query parameters
   */
  generateKey(queryKey, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${JSON.stringify(params[key])}`)
      .join('|')

    return sortedParams ? `${queryKey}::${sortedParams}` : queryKey
  }

  /**
   * Set cache entry
   */
  set(queryKey, data, options = {}) {
    const key = typeof queryKey === 'string' ? queryKey : this.generateKey(queryKey.key, queryKey.params)
    const ttl = options.ttl || this.defaultTTL

    // Enforce max size
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, data)
    this.timestamps.set(key, Date.now() + ttl)

    // Store dependencies for invalidation
    if (options.dependencies) {
      options.dependencies.forEach(dep => {
        if (!this.dependencies.has(dep)) {
          this.dependencies.set(dep, new Set())
        }
        this.dependencies.get(dep).add(key)
      })
    }

    return data
  }

  /**
   * Get cache entry
   */
  get(queryKey, params = {}) {
    const key = typeof queryKey === 'string' ? queryKey : this.generateKey(queryKey, params)

    if (!this.cache.has(key)) {
      return null
    }

    // Check if expired
    const expiresAt = this.timestamps.get(key)
    if (expiresAt && Date.now() > expiresAt) {
      this.delete(key)
      return null
    }

    return this.cache.get(key)
  }

  /**
   * Check if cache has valid entry
   */
  has(queryKey, params = {}) {
    const data = this.get(queryKey, params)
    return data !== null
  }

  /**
   * Delete cache entry
   */
  delete(queryKey, params = {}) {
    const key = typeof queryKey === 'string' ? queryKey : this.generateKey(queryKey, params)

    this.cache.delete(key)
    this.timestamps.delete(key)

    // Remove from dependencies
    this.dependencies.forEach((keys, dep) => {
      keys.delete(key)
      if (keys.size === 0) {
        this.dependencies.delete(dep)
      }
    })
  }

  /**
   * Invalidate cache by dependency
   */
  invalidate(dependency) {
    const keys = this.dependencies.get(dependency)

    if (keys) {
      keys.forEach(key => {
        this.cache.delete(key)
        this.timestamps.delete(key)
      })
      this.dependencies.delete(dependency)
    }
  }

  /**
   * Invalidate multiple dependencies
   */
  invalidateMultiple(dependencies) {
    dependencies.forEach(dep => this.invalidate(dep))
  }

  /**
   * Invalidate by prefix (e.g., 'emissions::' invalidates all emissions queries)
   */
  invalidateByPrefix(prefix) {
    const keysToDelete = []

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.cache.delete(key)
      this.timestamps.delete(key)
    })
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear()
    this.timestamps.clear()
    this.dependencies.clear()
  }

  /**
   * Get cache statistics
   */
  getStats() {
    let validEntries = 0
    let expiredEntries = 0
    const now = Date.now()

    this.timestamps.forEach(expiresAt => {
      if (now > expiresAt) {
        expiredEntries++
      } else {
        validEntries++
      }
    })

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      dependencies: this.dependencies.size,
      maxSize: this.maxSize,
      usage: `${((this.cache.size / this.maxSize) * 100).toFixed(1)}%`
    }
  }

  /**
   * Evict oldest entry
   */
  evictOldest() {
    let oldestKey = null
    let oldestTime = Infinity

    this.timestamps.forEach((expiresAt, key) => {
      if (expiresAt < oldestTime) {
        oldestTime = expiresAt
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  /**
   * Garbage collection - remove expired entries
   */
  runGarbageCollection() {
    const now = Date.now()
    const keysToDelete = []

    this.timestamps.forEach((expiresAt, key) => {
      if (now > expiresAt) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.delete(key))

    return keysToDelete.length
  }

  /**
   * Start automatic garbage collection
   */
  startGarbageCollection() {
    if (this.gcTimer) {
      clearInterval(this.gcTimer)
    }

    this.gcTimer = setInterval(() => {
      this.runGarbageCollection()
    }, this.gcInterval)
  }

  /**
   * Stop garbage collection
   */
  stopGarbageCollection() {
    if (this.gcTimer) {
      clearInterval(this.gcTimer)
      this.gcTimer = null
    }
  }

  /**
   * Update cache entry without changing TTL
   */
  update(queryKey, updater, params = {}) {
    const key = typeof queryKey === 'string' ? queryKey : this.generateKey(queryKey, params)
    const currentData = this.cache.get(key)

    if (currentData) {
      const newData = typeof updater === 'function' ? updater(currentData) : updater
      this.cache.set(key, newData)
      return newData
    }

    return null
  }

  /**
   * Prefetch data (set with longer TTL)
   */
  prefetch(queryKey, data, params = {}) {
    return this.set(queryKey, data, {
      ...params,
      ttl: this.defaultTTL * 2 // Double TTL for prefetched data
    })
  }
}

// Create singleton instance
const queryCache = new QueryCache({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 200, // 200 cached queries
  gcInterval: 60 * 1000 // Run GC every minute
})

export default queryCache

/**
 * Utility functions for common cache operations
 */

// Standard cache dependencies
export const CacheDependencies = {
  EMISSIONS: 'emissions',
  EMISSIONS_SUMMARY: 'emissions_summary',
  ESG_METRICS: 'esg_metrics',
  ESG_SUMMARY: 'esg_summary',
  ESG_REPORTS: 'esg_reports',
  COMPANIES: 'companies',
  COMPANY: 'company',
  USERS: 'users',
  USER: 'user'
}

// Helper to invalidate all related caches when an entity is modified
export const invalidateEntityCache = (entity, id = null) => {
  switch (entity) {
    case 'emission':
      queryCache.invalidateMultiple([
        CacheDependencies.EMISSIONS,
        CacheDependencies.EMISSIONS_SUMMARY
      ])
      break

    case 'esg_metric':
      queryCache.invalidateMultiple([
        CacheDependencies.ESG_METRICS,
        CacheDependencies.ESG_SUMMARY
      ])
      break

    case 'esg_report':
      queryCache.invalidate(CacheDependencies.ESG_REPORTS)
      break

    case 'company':
      queryCache.invalidateMultiple([
        CacheDependencies.COMPANIES,
        CacheDependencies.COMPANY
      ])
      if (id) {
        queryCache.delete(`company_${id}`)
      }
      break

    case 'user':
      queryCache.invalidateMultiple([
        CacheDependencies.USERS,
        CacheDependencies.USER
      ])
      break

    default:
      break
  }
}
