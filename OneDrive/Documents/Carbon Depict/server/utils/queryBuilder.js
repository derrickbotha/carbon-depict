/**
 * Advanced Query Builder Utility
 * Phase 1 Week 2: Database Optimization & Pagination
 *
 * Provides reusable pagination, filtering, and sorting functionality
 * with performance optimizations and caching support.
 */

/**
 * Parse query parameters and build MongoDB filter
 * Supports advanced filtering operators:
 * - field=value (exact match)
 * - field[gt]=value (greater than)
 * - field[gte]=value (greater than or equal)
 * - field[lt]=value (less than)
 * - field[lte]=value (less than or equal)
 * - field[in]=value1,value2 (in array)
 * - field[contains]=value (regex search)
 *
 * @param {Object} queryParams - Express req.query object
 * @param {Array} allowedFilters - Array of allowed filter field names
 * @param {Object} baseFilter - Base filter to merge with (e.g., { companyId })
 * @returns {Object} MongoDB filter object
 */
function buildFilter(queryParams, allowedFilters = [], baseFilter = {}) {
  const filter = { ...baseFilter }

  Object.keys(queryParams).forEach(key => {
    // Skip pagination and sorting params
    if (['page', 'limit', 'sort', 'sortBy', 'order'].includes(key)) {
      return
    }

    // Parse field[operator] syntax
    const match = key.match(/^([a-zA-Z0-9_]+)(\[([a-z]+)\])?$/)
    if (!match) return

    const field = match[1]
    const operator = match[3]
    const value = queryParams[key]

    // Check if field is allowed
    if (allowedFilters.length > 0 && !allowedFilters.includes(field)) {
      return
    }

    // Build filter based on operator
    if (!operator) {
      // Simple equality
      filter[field] = value
    } else if (operator === 'gt') {
      filter[field] = { ...filter[field], $gt: parseValue(value) }
    } else if (operator === 'gte') {
      filter[field] = { ...filter[field], $gte: parseValue(value) }
    } else if (operator === 'lt') {
      filter[field] = { ...filter[field], $lt: parseValue(value) }
    } else if (operator === 'lte') {
      filter[field] = { ...filter[field], $lte: parseValue(value) }
    } else if (operator === 'in') {
      filter[field] = { $in: value.split(',').map(v => v.trim()) }
    } else if (operator === 'nin') {
      filter[field] = { $nin: value.split(',').map(v => v.trim()) }
    } else if (operator === 'contains') {
      filter[field] = { $regex: value, $options: 'i' }
    } else if (operator === 'ne') {
      filter[field] = { $ne: parseValue(value) }
    }
  })

  return filter
}

/**
 * Parse sort parameters
 * Supports: sort=field:asc or sort=field:desc or sort=-field (desc)
 *
 * @param {String} sortParam - Sort query parameter
 * @param {String} defaultSort - Default sort field (e.g., '-createdAt')
 * @returns {Object} MongoDB sort object
 */
function buildSort(sortParam, defaultSort = '-createdAt') {
  const sort = {}

  if (!sortParam) {
    // Use default sort
    const field = defaultSort.startsWith('-') ? defaultSort.slice(1) : defaultSort
    const order = defaultSort.startsWith('-') ? -1 : 1
    sort[field] = order
    return sort
  }

  // Parse sort parameter
  const parts = sortParam.split(',')
  parts.forEach(part => {
    if (part.includes(':')) {
      // Format: field:asc or field:desc
      const [field, order] = part.split(':')
      sort[field.trim()] = order === 'desc' ? -1 : 1
    } else if (part.startsWith('-')) {
      // Format: -field (descending)
      sort[part.slice(1)] = -1
    } else {
      // Format: field (ascending)
      sort[part.trim()] = 1
    }
  })

  return sort
}

/**
 * Parse pagination parameters
 *
 * @param {Number|String} page - Page number (1-indexed)
 * @param {Number|String} limit - Items per page
 * @param {Number} maxLimit - Maximum allowed limit (default: 100)
 * @returns {Object} { page, limit, skip }
 */
function buildPagination(page = 1, limit = 20, maxLimit = 100) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1)
  const limitNum = Math.min(maxLimit, Math.max(1, parseInt(limit, 10) || 20))
  const skip = (pageNum - 1) * limitNum

  return {
    page: pageNum,
    limit: limitNum,
    skip
  }
}

/**
 * Build pagination metadata for response
 *
 * @param {Number} total - Total number of documents
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
function buildPaginationMeta(total, page, limit) {
  const pages = Math.ceil(total / limit)
  const hasNextPage = page < pages
  const hasPrevPage = page > 1

  return {
    total,
    count: Math.min(limit, total - (page - 1) * limit),
    page,
    pages,
    limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  }
}

/**
 * Execute a paginated query with optimizations
 *
 * @param {Model} Model - Mongoose model
 * @param {Object} filter - MongoDB filter object
 * @param {Object} options - Query options
 * @returns {Object} { data, pagination }
 */
async function executePaginatedQuery(Model, filter, options = {}) {
  const {
    sort = { createdAt: -1 },
    page = 1,
    limit = 20,
    populate = [],
    select = null,
    lean = true
  } = options

  const pagination = buildPagination(page, limit)

  // Execute query and count in parallel for performance
  const [data, total] = await Promise.all([
    Model.find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .select(select)
      .populate(populate)
      .lean(lean),
    Model.countDocuments(filter)
  ])

  return {
    data,
    pagination: buildPaginationMeta(total, pagination.page, pagination.limit)
  }
}

/**
 * Parse value to appropriate type
 *
 * @param {String} value - Value to parse
 * @returns {*} Parsed value (Number, Date, Boolean, or String)
 */
function parseValue(value) {
  // Try to parse as number
  if (!isNaN(value) && value !== '') {
    return parseFloat(value)
  }

  // Try to parse as date
  const date = new Date(value)
  if (date.toString() !== 'Invalid Date') {
    return date
  }

  // Parse boolean
  if (value === 'true') return true
  if (value === 'false') return false

  // Return as string
  return value
}

/**
 * Generate cache key for query
 *
 * @param {String} prefix - Cache key prefix (e.g., 'emissions')
 * @param {Object} params - Query parameters
 * @returns {String} Cache key
 */
function generateCacheKey(prefix, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|')

  return `${prefix}:${sortedParams}`
}

/**
 * Alias for buildPaginationMeta (for backward compatibility)
 */
function paginate(total, page, limit) {
  return buildPaginationMeta(total, page, limit)
}

module.exports = {
  buildFilter,
  buildSort,
  buildPagination,
  buildPaginationMeta,
  paginate,
  executePaginatedQuery,
  parseValue,
  generateCacheKey
}
