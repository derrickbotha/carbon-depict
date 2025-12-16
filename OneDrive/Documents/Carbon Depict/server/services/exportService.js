/**
 * Export Service - Phase 4 Week 19: Data Export/Import
 *
 * Handles data export in multiple formats:
 * - CSV, Excel, JSON, PDF
 * - Bulk exports
 * - Custom templates
 */
const ExcelJS = require('exceljs')
const { createObjectCsvStringifier } = require('csv-writer')
const PDFDocument = require('pdfkit')
const GHGEmission = require('../models/mongodb/GHGEmission')
const ESGMetric = require('../models/mongodb/ESGMetric')
const logger = require('../utils/logger')

class ExportService {
  /**
   * Export emissions data
   */
  async exportEmissions(companyId, format, options = {}) {
    try {
      const { reportingPeriod, startDate, endDate } = options

      const query = { companyId }
      if (reportingPeriod) query.reportingPeriod = reportingPeriod
      if (startDate && endDate) {
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
      }

      const emissions = await GHGEmission.find(query).lean()

      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(emissions, 'emissions')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(emissions, 'emissions')
        case 'json':
          return this._exportToJSON(emissions)
        case 'pdf':
          return await this._exportToPDF(emissions, 'Emissions Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting emissions:', error)
      throw error
    }
  }

  /**
   * Export ESG metrics
   */
  async exportESGMetrics(companyId, format, options = {}) {
    try {
      const { reportingPeriod, framework, pillar } = options

      const query = { companyId, status: { $ne: 'archived' } }
      if (reportingPeriod) query.reportingPeriod = reportingPeriod
      if (framework) query.framework = framework
      if (pillar) query.pillar = pillar

      const metrics = await ESGMetric.find(query).lean()

      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(metrics, 'esg-metrics')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(metrics, 'esg-metrics')
        case 'json':
          return this._exportToJSON(metrics)
        case 'pdf':
          return await this._exportToPDF(metrics, 'ESG Metrics Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting ESG metrics:', error)
      throw error
    }
  }

  /**
   * Export CSRD Disclosures
   */
  async exportCSRDDisclosures(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'csrd-disclosures')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'csrd-disclosures')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'CSRD Disclosures Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting CSRD disclosures:', error)
      throw error
    }
  }

  /**
   * Export Materiality Assessments
   */
  async exportMaterialityAssessments(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'materiality-assessments')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'materiality-assessments')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'Materiality Assessments Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting materiality assessments:', error)
      throw error
    }
  }

  /**
   * Export Scope 3 Emissions
   */
  async exportScope3Emissions(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'scope3-emissions')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'scope3-emissions')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'Scope 3 Emissions Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting Scope 3 emissions:', error)
      throw error
    }
  }

  /**
   * Export Risk Register
   */
  async exportRisks(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'risk-register')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'risk-register')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'Risk Register Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting risks:', error)
      throw error
    }
  }

  /**
   * Export ESG Targets
   */
  async exportTargets(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'esg-targets')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'esg-targets')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'ESG Targets Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting targets:', error)
      throw error
    }
  }

  /**
   * Export SBTi Targets
   */
  async exportSBTiTargets(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'sbti-targets')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'sbti-targets')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'SBTi Targets Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting SBTi targets:', error)
      throw error
    }
  }

  /**
   * Export PCAF Assessments
   */
  async exportPCAFAssessments(data, format) {
    try {
      switch (format.toLowerCase()) {
        case 'csv':
          return await this._exportToCSV(data, 'pcaf-assessments')
        case 'excel':
        case 'xlsx':
          return await this._exportToExcel(data, 'pcaf-assessments')
        case 'json':
          return this._exportToJSON(data)
        case 'pdf':
          return await this._exportToPDF(data, 'PCAF Assessments Report')
        default:
          throw new Error(`Unsupported format: ${format}`)
      }
    } catch (error) {
      logger.error('Error exporting PCAF assessments:', error)
      throw error
    }
  }

  // ============ Private Export Methods ============

  async _exportToCSV(data, type) {
    const csvStringifier = createObjectCsvStringifier({
      header: this._getCSVHeaders(type, data[0])
    })

    const header = csvStringifier.getHeaderString()
    const records = csvStringifier.stringifyRecords(data)

    return {
      data: header + records,
      contentType: 'text/csv',
      filename: `${type}-${Date.now()}.csv`
    }
  }

  async _exportToExcel(data, type) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(type)

    // Add headers
    const headers = this._getExcelHeaders(type, data[0])
    worksheet.columns = headers

    // Add data
    data.forEach(item => {
      worksheet.addRow(this._flattenObject(item))
    })

    // Style header
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    }

    const buffer = await workbook.xlsx.writeBuffer()

    return {
      data: buffer,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `${type}-${Date.now()}.xlsx`
    }
  }

  _exportToJSON(data) {
    return {
      data: JSON.stringify(data, null, 2),
      contentType: 'application/json',
      filename: `export-${Date.now()}.json`
    }
  }

  async _exportToPDF(data, title) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument()
      const chunks = []

      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => {
        resolve({
          data: Buffer.concat(chunks),
          contentType: 'application/pdf',
          filename: `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`
        })
      })
      doc.on('error', reject)

      // Add title
      doc.fontSize(20).text(title, { align: 'center' })
      doc.moveDown()

      // Add data summary
      doc.fontSize(12).text(`Total Records: ${data.length}`)
      doc.text(`Generated: ${new Date().toLocaleString()}`)
      doc.moveDown()

      // Add data table (simplified)
      data.slice(0, 50).forEach((item, index) => {
        doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(item).substring(0, 100)}...`)
      })

      doc.end()
    })
  }

  _getCSVHeaders(type, sampleData) {
    if (!sampleData) return []

    return Object.keys(this._flattenObject(sampleData)).map(key => ({
      id: key,
      title: key.replace(/([A-Z])/g, ' $1').trim()
    }))
  }

  _getExcelHeaders(type, sampleData) {
    if (!sampleData) return []

    return Object.keys(this._flattenObject(sampleData)).map(key => ({
      header: key.replace(/([A-Z])/g, ' $1').trim(),
      key,
      width: 15
    }))
  }

  _flattenObject(obj, prefix = '') {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        Object.assign(acc, this._flattenObject(value, newKey))
      } else {
        acc[newKey] = value
      }

      return acc
    }, {})
  }
}

module.exports = new ExportService()
