/**
 * Base Service Class - Phase 3 Week 10: Service Layer Refactoring
 *
 * Provides common CRUD operations and caching functionality
 * Other services can extend this to inherit base functionality
 */

const logger = require('../utils/logger')
const { buildFilter, buildSort, paginate } = require('../utils/queryBuilder')
const { getOrSet, invalidate } = require('../utils/cacheManager')

class BaseService {
  constructor(model, modelName) {
    this.model = model
    this.modelName = modelName
  }

  /**
   * Create a new document
   */
  async create(data, userId) {
    try {
      logger.info(`Creating ${this.modelName}`, { userId })

      if (userId) {
        data.createdBy = userId
      }

      const document = new this.model(data)
      await document.save()

      logger.info(`${this.modelName} created successfully`, {
        id: document._id
      })

      return document
    } catch (error) {
      logger.error(`Failed to create ${this.modelName}`, {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /**
   * Get document by ID
   */
  async getById(id, options = {}) {
    try {
      const cacheKey = `${this.modelName.toLowerCase()}:${id}`

      if (!options.skipCache) {
        const cached = await getOrSet(
          cacheKey,
          async () => {
            let query = this.model.findById(id)
            if (options.populate) {
              query = query.populate(options.populate)
            }
            return query.lean()
          },
          options.cacheTTL || 300
        )
        return cached.data
      }

      let query = this.model.findById(id)
      if (options.populate) {
        query = query.populate(options.populate)
      }
      return query.lean()
    } catch (error) {
      logger.error(`Failed to get ${this.modelName}`, {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Get all documents with filtering, sorting, and pagination
   */
  async getAll(queryParams, allowedFilters = [], defaultSort = '-createdAt') {
    try {
      logger.info(`Fetching ${this.modelName} list`, { params: queryParams })

      const filter = buildFilter(queryParams, allowedFilters)
      const sort = buildSort(queryParams, defaultSort)

      const result = await paginate(
        this.model,
        filter,
        {
          page: parseInt(queryParams.page) || 1,
          limit: parseInt(queryParams.limit) || 50,
          sort,
          populate: queryParams.populate
        }
      )

      logger.info(`${this.modelName} list fetched`, {
        count: result.data.length,
        total: result.pagination.total
      })

      return result
    } catch (error) {
      logger.error(`Failed to fetch ${this.modelName} list`, {
        error: error.message
      })
      throw error
    }
  }

  /**
   * Update document by ID
   */
  async update(id, updateData, userId) {
    try {
      logger.info(`Updating ${this.modelName}`, { id, userId })

      const document = await this.model.findById(id)
      if (!document) {
        throw new Error(`${this.modelName} not found`)
      }

      if (userId) {
        document._updateUserId = userId
        updateData.updatedBy = userId
      }

      Object.assign(document, updateData)
      await document.save()

      // Invalidate cache
      await this.invalidateCache(id)

      logger.info(`${this.modelName} updated successfully`, { id })

      return document
    } catch (error) {
      logger.error(`Failed to update ${this.modelName}`, {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id, userId) {
    try {
      logger.info(`Deleting ${this.modelName}`, { id, userId })

      const document = await this.model.findById(id)
      if (!document) {
        throw new Error(`${this.modelName} not found`)
      }

      await document.remove()

      // Invalidate cache
      await this.invalidateCache(id)

      logger.info(`${this.modelName} deleted successfully`, { id })

      return { success: true, message: `${this.modelName} deleted successfully` }
    } catch (error) {
      logger.error(`Failed to delete ${this.modelName}`, {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Bulk create documents
   */
  async bulkCreate(dataArray, userId) {
    try {
      logger.info(`Bulk creating ${this.modelName}`, {
        count: dataArray.length,
        userId
      })

      if (userId) {
        dataArray = dataArray.map(data => ({ ...data, createdBy: userId }))
      }

      const documents = await this.model.insertMany(dataArray, { ordered: false })

      logger.info(`Bulk ${this.modelName} created successfully`, {
        count: documents.length
      })

      return documents
    } catch (error) {
      logger.error(`Failed to bulk create ${this.modelName}`, {
        error: error.message,
        count: dataArray.length
      })
      throw error
    }
  }

  /**
   * Count documents matching filter
   */
  async count(filter = {}) {
    try {
      return await this.model.countDocuments(filter)
    } catch (error) {
      logger.error(`Failed to count ${this.modelName}`, {
        error: error.message
      })
      throw error
    }
  }

  /**
   * Check if document exists
   */
  async exists(filter) {
    try {
      const count = await this.model.countDocuments(filter).limit(1)
      return count > 0
    } catch (error) {
      logger.error(`Failed to check ${this.modelName} existence`, {
        error: error.message
      })
      throw error
    }
  }

  /**
   * Invalidate cache for a document
   */
  async invalidateCache(id) {
    const cacheKey = `${this.modelName.toLowerCase()}:${id}`
    await invalidate(cacheKey)
  }

  /**
   * Find one document by filter
   */
  async findOne(filter, options = {}) {
    try {
      let query = this.model.findOne(filter)

      if (options.populate) {
        query = query.populate(options.populate)
      }

      if (options.select) {
        query = query.select(options.select)
      }

      if (options.lean !== false) {
        query = query.lean()
      }

      return await query
    } catch (error) {
      logger.error(`Failed to find ${this.modelName}`, {
        error: error.message,
        filter
      })
      throw error
    }
  }

  /**
   * Find documents by filter
   */
  async find(filter, options = {}) {
    try {
      let query = this.model.find(filter)

      if (options.populate) {
        query = query.populate(options.populate)
      }

      if (options.select) {
        query = query.select(options.select)
      }

      if (options.sort) {
        query = query.sort(options.sort)
      }

      if (options.limit) {
        query = query.limit(options.limit)
      }

      if (options.skip) {
        query = query.skip(options.skip)
      }

      if (options.lean !== false) {
        query = query.lean()
      }

      return await query
    } catch (error) {
      logger.error(`Failed to find ${this.modelName} list`, {
        error: error.message,
        filter
      })
      throw error
    }
  }

  /**
   * Aggregate documents
   */
  async aggregate(pipeline) {
    try {
      return await this.model.aggregate(pipeline)
    } catch (error) {
      logger.error(`Failed to aggregate ${this.modelName}`, {
        error: error.message
      })
      throw error
    }
  }
}

module.exports = BaseService
