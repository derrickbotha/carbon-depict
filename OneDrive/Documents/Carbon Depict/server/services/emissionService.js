/**
 * Emission Service - Phase 3 Week 10: Service Layer Refactoring
 *
 * Business logic layer for GHG emissions management
 * Separates business logic from route handlers for better testability and reusability
 */

const GHGEmission = require('../models/mongodb/GHGEmission')
const logger = require('../utils/logger')
const { buildFilter, buildSort, paginate } = require('../utils/queryBuilder')
const { getOrSet, invalidate } = require('../utils/cacheManager')

class EmissionService {
  /**
   * Create a new emission record
   */
  async create(emissionData, userId) {
    try {
      logger.info('Creating emission record', {
        companyId: emissionData.companyId,
        scope: emissionData.scope,
        userId
      })

      // Add audit fields
      emissionData.createdBy = userId

      // Calculate CO2e if not provided
      if (!emissionData.co2e && emissionData.activityValue && emissionData.emissionFactor) {
        emissionData.co2e = emissionData.activityValue * emissionData.emissionFactor
      }

      const emission = new GHGEmission(emissionData)
      await emission.save()

      // Invalidate cache for this company
      await this.invalidateCompanyCache(emissionData.companyId)

      logger.info('Emission record created successfully', {
        id: emission._id,
        scope: emission.scope,
        co2e: emission.co2e
      })

      return emission
    } catch (error) {
      logger.error('Failed to create emission record', {
        error: error.message,
        stack: error.stack,
        data: emissionData
      })
      throw error
    }
  }

  /**
   * Get emission by ID
   */
  async getById(id, options = {}) {
    try {
      const cacheKey = `emission:${id}`

      if (!options.skipCache) {
        const cached = await getOrSet(
          cacheKey,
          async () => {
            let query = GHGEmission.findById(id)

            if (options.populate) {
              const populateFields = options.populate.split(',')
              populateFields.forEach(field => {
                query = query.populate(field.trim())
              })
            }

            return query.lean()
          },
          300 // 5 minutes
        )

        return cached.data
      }

      let query = GHGEmission.findById(id)
      if (options.populate) {
        query = query.populate(options.populate)
      }

      return query.lean()
    } catch (error) {
      logger.error('Failed to get emission by ID', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Get emissions with filtering, sorting, and pagination
   */
  async getAll(queryParams, userId) {
    try {
      logger.info('Fetching emissions', {
        userId,
        params: queryParams
      })

      // Build filter based on query parameters
      const allowedFilters = [
        'companyId',
        'facilityId',
        'locationId',
        'scope',
        'sourceType',
        'reportingPeriod',
        'verificationStatus',
        'recordedAt[gte]',
        'recordedAt[lte]',
        'co2e[gte]',
        'co2e[lte]'
      ]

      const filter = buildFilter(queryParams, allowedFilters)

      // Build sort
      const sort = buildSort(queryParams, '-recordedAt')

      // Execute query with pagination
      const result = await paginate(
        GHGEmission,
        filter,
        {
          page: parseInt(queryParams.page) || 1,
          limit: parseInt(queryParams.limit) || 50,
          sort,
          populate: queryParams.populate
        }
      )

      logger.info('Emissions fetched successfully', {
        count: result.data.length,
        total: result.pagination.total
      })

      return result
    } catch (error) {
      logger.error('Failed to fetch emissions', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  /**
   * Update emission record
   */
  async update(id, updateData, userId) {
    try {
      logger.info('Updating emission record', { id, userId })

      const emission = await GHGEmission.findById(id)
      if (!emission) {
        throw new Error('Emission record not found')
      }

      // Add audit field
      emission._updateUserId = userId

      // Update fields
      Object.assign(emission, updateData)

      // Recalculate CO2e if relevant fields changed
      if (updateData.activityValue !== undefined || updateData.emissionFactor !== undefined) {
        emission.co2e = emission.activityValue * emission.emissionFactor
      }

      await emission.save()

      // Invalidate cache
      await this.invalidateCache(id, emission.companyId)

      logger.info('Emission record updated successfully', {
        id: emission._id,
        co2e: emission.co2e
      })

      return emission
    } catch (error) {
      logger.error('Failed to update emission record', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Delete emission record
   */
  async delete(id, userId) {
    try {
      logger.info('Deleting emission record', { id, userId })

      const emission = await GHGEmission.findById(id)
      if (!emission) {
        throw new Error('Emission record not found')
      }

      const companyId = emission.companyId
      await emission.remove()

      // Invalidate cache
      await this.invalidateCache(id, companyId)

      logger.info('Emission record deleted successfully', { id })

      return { success: true, message: 'Emission record deleted successfully' }
    } catch (error) {
      logger.error('Failed to delete emission record', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Get emissions by period with aggregation
   */
  async getByPeriod(companyId, reportingPeriod) {
    try {
      const cacheKey = `emissions:period:${companyId}:${reportingPeriod}`

      const result = await getOrSet(
        cacheKey,
        async () => GHGEmission.getEmissionsByPeriod(companyId, reportingPeriod),
        600 // 10 minutes
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get emissions by period', {
        error: error.message,
        companyId,
        reportingPeriod
      })
      throw error
    }
  }

  /**
   * Get total emissions by scope
   */
  async getTotalByScope(companyId, startDate, endDate) {
    try {
      const cacheKey = `emissions:scope:${companyId}:${startDate}:${endDate}`

      const result = await getOrSet(
        cacheKey,
        async () => GHGEmission.getTotalEmissionsByScope(companyId, startDate, endDate),
        600 // 10 minutes
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get emissions by scope', {
        error: error.message,
        companyId
      })
      throw error
    }
  }

  /**
   * Verify emission record
   */
  async verify(id, userId) {
    try {
      logger.info('Verifying emission record', { id, userId })

      const emission = await GHGEmission.findById(id)
      if (!emission) {
        throw new Error('Emission record not found')
      }

      await emission.verify(userId)

      // Invalidate cache
      await this.invalidateCache(id, emission.companyId)

      logger.info('Emission record verified successfully', { id })

      return emission
    } catch (error) {
      logger.error('Failed to verify emission record', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Reject emission record
   */
  async reject(id, userId) {
    try {
      logger.info('Rejecting emission record', { id, userId })

      const emission = await GHGEmission.findById(id)
      if (!emission) {
        throw new Error('Emission record not found')
      }

      await emission.reject(userId)

      // Invalidate cache
      await this.invalidateCache(id, emission.companyId)

      logger.info('Emission record rejected successfully', { id })

      return emission
    } catch (error) {
      logger.error('Failed to reject emission record', {
        error: error.message,
        id
      })
      throw error
    }
  }

  /**
   * Get pending verification emissions
   */
  async getPendingVerification(companyId, limit = 50) {
    try {
      const cacheKey = `emissions:pending:${companyId}`

      const result = await getOrSet(
        cacheKey,
        async () => GHGEmission.findPendingVerification(companyId, limit),
        300 // 5 minutes
      )

      return result.data
    } catch (error) {
      logger.error('Failed to get pending verification emissions', {
        error: error.message,
        companyId
      })
      throw error
    }
  }

  /**
   * Bulk create emissions
   */
  async bulkCreate(emissionsData, userId) {
    try {
      logger.info('Bulk creating emissions', {
        count: emissionsData.length,
        userId
      })

      // Add audit fields to all records
      const dataWithAudit = emissionsData.map(data => ({
        ...data,
        createdBy: userId,
        co2e: data.co2e || (data.activityValue * data.emissionFactor)
      }))

      const emissions = await GHGEmission.insertMany(dataWithAudit, { ordered: false })

      // Invalidate cache for all affected companies
      const companyIds = [...new Set(emissionsData.map(e => e.companyId))]
      for (const companyId of companyIds) {
        await this.invalidateCompanyCache(companyId)
      }

      logger.info('Bulk emissions created successfully', {
        count: emissions.length
      })

      return emissions
    } catch (error) {
      logger.error('Failed to bulk create emissions', {
        error: error.message,
        count: emissionsData.length
      })
      throw error
    }
  }

  /**
   * Invalidate cache for specific emission
   */
  async invalidateCache(emissionId, companyId) {
    await invalidate(`emission:${emissionId}`)
    await this.invalidateCompanyCache(companyId)
  }

  /**
   * Invalidate all cache for a company
   */
  async invalidateCompanyCache(companyId) {
    await invalidate(`emissions:period:${companyId}:*`)
    await invalidate(`emissions:scope:${companyId}:*`)
    await invalidate(`emissions:pending:${companyId}`)
  }
}

module.exports = new EmissionService()
