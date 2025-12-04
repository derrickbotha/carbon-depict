/**
 * Import Service - Phase 4 Week 19: Data Import
 *
 * Handles data import from various formats:
 * - CSV, Excel, JSON
 * - Validation and error handling
 * - Bulk operations
 */
const ExcelJS = require('exceljs')
const csv = require('csv-parser')
const { Readable } = require('stream')
const GHGEmission = require('../models/mongodb/GHGEmission')
const ESGMetric = require('../models/mongodb/ESGMetric')
const logger = require('../utils/logger')

class ImportService {
  /**
   * Import emissions data
   */
  async importEmissions(companyId, file, format, options = {}) {
    try {
      let data

      switch (format.toLowerCase()) {
        case 'csv':
          data = await this._parseCSV(file.buffer)
          break
        case 'excel':
        case 'xlsx':
          data = await this._parseExcel(file.buffer)
          break
        case 'json':
          data = JSON.parse(file.buffer.toString())
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      // Validate and import
      const results = await this._importEmissionsData(companyId, data, options)

      return results
    } catch (error) {
      logger.error('Error importing emissions:', error)
      throw error
    }
  }

  /**
   * Import ESG metrics
   */
  async importESGMetrics(companyId, file, format, options = {}) {
    try {
      let data

      switch (format.toLowerCase()) {
        case 'csv':
          data = await this._parseCSV(file.buffer)
          break
        case 'excel':
        case 'xlsx':
          data = await this._parseExcel(file.buffer)
          break
        case 'json':
          data = JSON.parse(file.buffer.toString())
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      // Validate and import
      const results = await this._importESGMetricsData(companyId, data, options)

      return results
    } catch (error) {
      logger.error('Error importing ESG metrics:', error)
      throw error
    }
  }

  // ============ Private Methods ============

  async _parseCSV(buffer) {
    return new Promise((resolve, reject) => {
      const results = []
      const stream = Readable.from(buffer)

      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject)
    })
  }

  async _parseExcel(buffer) {
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(buffer)

    const worksheet = workbook.worksheets[0]
    const data = []

    const headers = []
    worksheet.getRow(1).eachCell((cell) => {
      headers.push(cell.value)
    })

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const rowData = {}
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value
        })
        data.push(rowData)
      }
    })

    return data
  }

  async _importEmissionsData(companyId, data, options) {
    const { validate = true, skipErrors = false } = options

    const results = {
      success: 0,
      failed: 0,
      errors: []
    }

    for (const item of data) {
      try {
        // Map and validate data
        const emissionData = this._mapEmissionData(item, companyId)

        if (validate) {
          this._validateEmissionData(emissionData)
        }

        // Create emission record
        await GHGEmission.create(emissionData)
        results.success++

      } catch (error) {
        results.failed++
        results.errors.push({
          item,
          error: error.message
        })

        if (!skipErrors) {
          throw error
        }
      }
    }

    return results
  }

  async _importESGMetricsData(companyId, data, options) {
    const { validate = true, skipErrors = false } = options

    const results = {
      success: 0,
      failed: 0,
      errors: []
    }

    for (const item of data) {
      try {
        // Map and validate data
        const metricData = this._mapESGMetricData(item, companyId)

        if (validate) {
          this._validateESGMetricData(metricData)
        }

        // Create metric record
        await ESGMetric.create(metricData)
        results.success++

      } catch (error) {
        results.failed++
        results.errors.push({
          item,
          error: error.message
        })

        if (!skipErrors) {
          throw error
        }
      }
    }

    return results
  }

  _mapEmissionData(item, companyId) {
    return {
      companyId,
      scope: item.scope || item.Scope,
      source: item.source || item.Source,
      category: item.category || item.Category,
      activity: item.activity || item.Activity,
      value: parseFloat(item.value || item.Value),
      unit: item.unit || item.Unit,
      co2e: parseFloat(item.co2e || item.CO2e),
      date: new Date(item.date || item.Date),
      reportingPeriod: item.reportingPeriod || item['Reporting Period'],
      dataQuality: item.dataQuality || item['Data Quality'] || 'estimated',
      notes: item.notes || item.Notes || ''
    }
  }

  _mapESGMetricData(item, companyId) {
    return {
      companyId,
      framework: item.framework || item.Framework,
      pillar: item.pillar || item.Pillar,
      topic: item.topic || item.Topic,
      metricName: item.metricName || item['Metric Name'],
      value: parseFloat(item.value || item.Value),
      unit: item.unit || item.Unit,
      reportingPeriod: item.reportingPeriod || item['Reporting Period'],
      startDate: new Date(item.startDate || item['Start Date']),
      endDate: new Date(item.endDate || item['End Date']),
      dataSource: item.dataSource || item['Data Source'],
      status: item.status || 'draft'
    }
  }

  _validateEmissionData(data) {
    if (!data.scope) throw new Error('Scope is required')
    if (!data.source) throw new Error('Source is required')
    if (!data.value) throw new Error('Value is required')
    if (!data.unit) throw new Error('Unit is required')
    if (!data.date) throw new Error('Date is required')
  }

  _validateESGMetricData(data) {
    if (!data.pillar) throw new Error('Pillar is required')
    if (!data.metricName) throw new Error('Metric name is required')
    if (data.value === undefined) throw new Error('Value is required')
    if (!data.unit) throw new Error('Unit is required')
  }
}

module.exports = new ImportService()
