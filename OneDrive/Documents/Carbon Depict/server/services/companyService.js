/**
 * Company Service - Phase 3 Week 10: Service Layer Refactoring
 *
 * Business logic layer for company management
 */
const Company = require('../models/mongodb/Company')
const logger = require('../utils/logger')
const { buildFilter, buildSort, paginate } = require('../utils/queryBuilder')

class CompanyService {
  /**
   * Create a new company
   */
  async createCompany(data, userId) {
    try {
      const company = new Company({
        ...data,
        createdBy: userId,
      })

      await company.save()
      logger.info(`Company created: ${company._id}`, { companyId: company._id, userId })

      return company
    } catch (error) {
      logger.error('Error creating company:', error)
      throw error
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(companyId, options = {}) {
    try {
      let query = Company.findById(companyId)

      if (options.populate) {
        options.populate.forEach(field => {
          query = query.populate(field)
        })
      }

      const company = await query.exec()

      if (!company) {
        const error = new Error('Company not found')
        error.statusCode = 404
        throw error
      }

      return company
    } catch (error) {
      logger.error('Error fetching company:', error)
      throw error
    }
  }

  /**
   * Get all companies with filters
   */
  async getCompanies(filters = {}, options = {}) {
    try {
      const query = buildFilter(filters)
      const sort = buildSort(options.sortBy, options.sortOrder)

      const { page = 1, limit = 50 } = options
      const skip = (page - 1) * limit

      const [companies, total] = await Promise.all([
        Company.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Company.countDocuments(query)
      ])

      return {
        data: companies,
        pagination: paginate(total, page, limit)
      }
    } catch (error) {
      logger.error('Error fetching companies:', error)
      throw error
    }
  }

  /**
   * Update company
   */
  async updateCompany(companyId, updates, userId) {
    try {
      const company = await Company.findById(companyId)

      if (!company) {
        const error = new Error('Company not found')
        error.statusCode = 404
        throw error
      }

      Object.assign(company, updates)
      company.updatedBy = userId

      await company.save()
      logger.info(`Company updated: ${companyId}`, { companyId, userId })

      return company
    } catch (error) {
      logger.error('Error updating company:', error)
      throw error
    }
  }

  /**
   * Delete company
   */
  async deleteCompany(companyId, userId) {
    try {
      const company = await Company.findById(companyId)

      if (!company) {
        const error = new Error('Company not found')
        error.statusCode = 404
        throw error
      }

      await company.remove()
      logger.info(`Company deleted: ${companyId}`, { companyId, userId })

      return { message: 'Company deleted successfully' }
    } catch (error) {
      logger.error('Error deleting company:', error)
      throw error
    }
  }

  /**
   * Get company statistics
   */
  async getCompanyStats(companyId) {
    try {
      const [emissionsCount, metricsCount, reportsCount] = await Promise.all([
        require('../models/mongodb/GHGEmission').countDocuments({ companyId }),
        require('../models/mongodb/ESGMetric').countDocuments({ companyId }),
        require('../models/mongodb/Report').countDocuments({ companyId })
      ])

      return {
        totalEmissions: emissionsCount,
        totalMetrics: metricsCount,
        totalReports: reportsCount
      }
    } catch (error) {
      logger.error('Error fetching company stats:', error)
      throw error
    }
  }

  /**
   * Search companies by name or industry
   */
  async searchCompanies(searchTerm, options = {}) {
    try {
      const query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { industry: { $regex: searchTerm, $options: 'i' } }
        ]
      }

      const { page = 1, limit = 20 } = options
      const skip = (page - 1) * limit

      const [companies, total] = await Promise.all([
        Company.find(query)
          .select('name industry location')
          .sort({ name: 1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Company.countDocuments(query)
      ])

      return {
        data: companies,
        pagination: paginate(total, page, limit)
      }
    } catch (error) {
      logger.error('Error searching companies:', error)
      throw error
    }
  }
}

module.exports = new CompanyService()
