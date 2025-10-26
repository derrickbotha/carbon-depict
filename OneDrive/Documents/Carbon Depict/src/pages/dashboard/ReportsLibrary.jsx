// Cache bust 2025-10-26
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Download, FileText, Calendar, Loader2 } from '@atoms/Icon'
import { enterpriseAPI } from '../../services/enterpriseAPI'

export default function ReportsLibrary() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Load reports from database
  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch reports from API
        const response = await enterpriseAPI.reports.getAll()
        
        if (response.data.success) {
          setReports(response.data.data)
        }
      } catch (err) {
        console.error('Error loading reports:', err)
        setError('Failed to load reports')
        
        // Fallback to default reports if API fails
        setReports([
          {
            _id: 1,
            name: 'GRI Standards Sustainability Report 2024',
            framework: 'GRI',
            reportType: 'Annual',
            status: 'Published',
            publishDate: '2024-03-15',
            fileSize: 2516582, // bytes
            description: 'Comprehensive sustainability report following GRI Standards'
          },
          {
            _id: 2,
            name: 'TCFD Climate-Related Financial Disclosures 2024',
            framework: 'TCFD',
            reportType: 'Annual',
            status: 'Published',
            publishDate: '2024-02-20',
            fileSize: 1887436,
            description: 'Climate risk and opportunity disclosure report'
          },
          {
            _id: 3,
            name: 'CDP Climate Change Questionnaire 2024',
            framework: 'CDP',
            reportType: 'Questionnaire',
            status: 'Draft',
            publishDate: '2024-06-01',
            fileSize: 3250585,
            description: 'Carbon disclosure project climate questionnaire'
          },
          {
            _id: 4,
            name: 'CSRD ESG Report Q1 2024',
            framework: 'CSRD',
            reportType: 'Quarterly',
            status: 'In Progress',
            publishDate: '2024-04-30',
            fileSize: 1258291,
            description: 'EU Corporate Sustainability Reporting Directive compliance'
          },
          {
            _id: 5,
            name: 'SBTi Science-Based Targets Verification 2024',
            framework: 'SBTi',
            reportType: 'Annual',
            status: 'Published',
            publishDate: '2024-01-10',
            fileSize: 1572864,
            description: 'Science-based targets initiative verification report'
          },
          {
            _id: 6,
            name: 'SDG Progress Report 2024',
            framework: 'SDG',
            reportType: 'Annual',
            status: 'In Progress',
            publishDate: '2024-05-01',
            fileSize: 2936012,
            description: 'United Nations Sustainable Development Goals progress report'
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadReports()
  }, [])
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    if (typeof date === 'string') return date
    return new Date(date).toISOString().split('T')[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight">Reports Library</h1>
          <p className="mt-2 text-cd-muted">
            Generated ESG and sustainability reports across multiple frameworks
          </p>
        </div>
        <Link
          to="/dashboard/esg/reports/generate"
          className="flex items-center gap-2 rounded-lg bg-cd-teal px-4 py-2 text-white hover:bg-cd-teal/90"
        >
          <Plus strokeWidth={2} />
          Generate Report
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cd-teal" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <FileText strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <p className="text-sm text-cd-muted">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'Published').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <p className="text-sm text-cd-muted">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'In Progress').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <p className="text-sm text-cd-muted">Drafts</p>
          <p className="text-2xl font-bold text-gray-600">
            {reports.filter(r => r.status === 'Draft').length}
          </p>
        </div>
        </div>
      )}

      {/* Reports List */}
      {!isLoading && (
        <div className="rounded-lg bg-white shadow-cd-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Report Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Framework</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-cd-midnight">Size</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-cd-midnight">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map(report => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText strokeWidth={2} />
                      <span className="font-medium text-cd-midnight">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {report.framework}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cd-muted">{report.description}</td>
                  <td className="px-6 py-4 text-sm text-cd-muted">{report.type}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      report.status === 'Published' 
                        ? 'bg-green-50 text-green-700'
                        : report.status === 'In Progress'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-cd-muted">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(report.publishDate || report.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-cd-muted">{formatFileSize(report.fileSize || report.size)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-cd-teal hover:text-cd-teal/80">
                      <Download strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  )
}

