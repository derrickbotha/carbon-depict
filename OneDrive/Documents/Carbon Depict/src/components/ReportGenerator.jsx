import { useState } from 'react'
import { Calendar, Download, FileText } from '@atoms/Icon'
import { enterpriseAPI } from '../services/enterpriseAPI'

const ReportGenerator = ({ dateRange, onReportGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedFramework, setSelectedFramework] = useState('GRI')
  const [selectedType, setSelectedType] = useState('annual')

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const reportData = {
        type: selectedType,
        framework: selectedFramework,
        period: new Date().getFullYear().toString(),
        startDate: dateRange?.startDate?.toISOString().split('T')[0],
        endDate: dateRange?.endDate?.toISOString().split('T')[0],
        data: {
          // This would contain the actual report data
          summary: 'Report generated with date range filtering',
          metrics: 'Various ESG metrics',
          compliance: 'Compliance status'
        }
      }

      const response = await enterpriseAPI.reports.generateWithDates(reportData)
      
      if (response.data.success) {
        onReportGenerated?.(response.data.data)
        alert(`Report generated successfully for period: ${response.data.data.dateRange}`)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadReport = async (reportId) => {
    try {
      const params = {
        startDate: dateRange?.startDate?.toISOString().split('T')[0],
        endDate: dateRange?.endDate?.toISOString().split('T')[0]
      }

      const response = await enterpriseAPI.reports.download(reportId, selectedFormat, params)
      
      // Create blob and download
      const blob = new Blob([response.data], { 
        type: selectedFormat === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `report-${reportId}.${selectedFormat}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Error downloading report. Please try again.')
    }
  }

  const formatDateRange = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return 'No date range selected'
    return `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
      </div>

      {/* Date Range Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Selected Date Range:</span>
        </div>
        <p className="text-sm text-gray-600">{formatDateRange()}</p>
      </div>

      {/* Report Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Framework
          </label>
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="GRI">GRI (Global Reporting Initiative)</option>
            <option value="TCFD">TCFD (Task Force on Climate-related Financial Disclosures)</option>
            <option value="SBTi">SBTi (Science Based Targets initiative)</option>
            <option value="CSRD">CSRD (Corporate Sustainability Reporting Directive)</option>
            <option value="SDG">SDG (Sustainable Development Goals)</option>
            <option value="CDP">CDP (Carbon Disclosure Project)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="annual">Annual Report</option>
            <option value="quarterly">Quarterly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="custom">Custom Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Download Format
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || !dateRange?.startDate || !dateRange?.endDate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <FileText className="h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Report Addendum Preview */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Report Addendum Preview</h4>
        <div className="text-xs text-blue-800 space-y-1">
          <p><strong>Report Period:</strong> {formatDateRange()}</p>
          <p><strong>Generated On:</strong> {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>Framework:</strong> {selectedFramework}</p>
          <p><strong>Report Type:</strong> {selectedType}</p>
          <p><strong>Format:</strong> {selectedFormat.toUpperCase()}</p>
        </div>
        <p className="text-xs text-blue-700 mt-2 italic">
          This addendum will be automatically included at the bottom of your downloaded report.
        </p>
      </div>
    </div>
  )
}

export default ReportGenerator
