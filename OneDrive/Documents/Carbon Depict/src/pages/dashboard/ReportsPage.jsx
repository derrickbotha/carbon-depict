// Cache bust 2025-11-26
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Download, FileText, Calendar, ChevronRight, Database, FileArchive, Eye, X, CheckCircle } from 'lucide-react'
import esgDataManager from '../../utils/esgDataManager'
import { generateReportPreview, downloadFrameworkReport } from '../../utils/reportGenerator'

// --- HOOK ---
const useReportsPage = () => {
  const [scores] = useState(() => esgDataManager.getScores())
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const emissionsReports = useMemo(
    () => [
      {
        id: 1,
        title: 'Monthly Emissions Report - October 2025',
        date: '2025-10-20',
        type: 'Monthly',
        totalEmissions: 1247.5,
        status: 'Ready',
      },
      {
        id: 2,
        title: 'Quarterly Report - Q3 2025',
        date: '2025-09-30',
        type: 'Quarterly',
        totalEmissions: 3642.8,
        status: 'Ready',
      },
      {
        id: 3,
        title: 'Annual Report - 2024',
        date: '2024-12-31',
        type: 'Annual',
        totalEmissions: 14587.2,
        status: 'Archived',
      },
    ],
    []
  )

  const esgFrameworks = useMemo(
    () => [
      {
        id: 'gri',
        name: 'GRI Standards 2021',
        description: 'Global Reporting Initiative framework data',
        progress: Math.round(scores.frameworks.gri.progress),
      },
      {
        id: 'tcfd',
        name: 'TCFD Recommendations',
        description: 'Task Force on Climate-related Financial Disclosures',
        progress: Math.round(scores.frameworks.tcfd.progress),
      },
      {
        id: 'sbti',
        name: 'Science Based Targets',
        description: 'Science Based Targets initiative data',
        progress: Math.round(scores.frameworks.sbti.progress),
      },
      {
        id: 'csrd',
        name: 'CSRD (ESRS)',
        description: 'Corporate Sustainability Reporting Directive',
        progress: Math.round(scores.frameworks.csrd.progress),
      },
      {
        id: 'cdp',
        name: 'CDP Disclosure',
        description: 'Carbon Disclosure Project data',
        progress: Math.round(scores.frameworks.cdp.progress),
      },
      {
        id: 'sdg',
        name: 'UN SDG Alignment',
        description: 'Sustainable Development Goals tracking',
        progress: Math.round(scores.frameworks.sdg.progress),
      },
      {
        id: 'sasb',
        name: 'SASB Standards',
        description: 'Sustainability Accounting Standards Board',
        progress: Math.round(scores.frameworks.sasb.progress),
      },
      {
        id: 'issb',
        name: 'ISSB Standards',
        description: 'International Sustainability Standards Board',
        progress: Math.round(scores.frameworks.issb.progress),
      },
      {
        id: 'pcaf',
        name: 'PCAF Standard',
        description: 'Partnership for Carbon Accounting Financials',
        progress: Math.round(scores.frameworks.pcaf.progress),
      },
    ],
    [scores]
  )

  const downloadFrameworkData = (frameworkId) => {
    const data = esgDataManager.getFrameworkData(frameworkId)
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${frameworkId}_data_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const downloadAllESGData = () => {
    const allData = esgDataManager.exportData()
    const dataStr = JSON.stringify(allData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `esg_complete_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePreview = (frameworkId) => {
    const preview = generateReportPreview(frameworkId)
    setPreviewData(preview)
    setShowPreview(true)
  }

  const handleDownloadPDF = async (frameworkId) => {
    try {
      await downloadFrameworkReport(frameworkId)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF report. Please try again.')
    }
  }

  return {
    emissionsReports,
    esgFrameworks,
    downloadFrameworkData,
    downloadAllESGData,
    handlePreview,
    handleDownloadPDF,
    previewData,
    showPreview,
    setShowPreview,
  }
}

// --- SUB-COMPONENTS ---

const Header = ({ onExportAll }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-4xl font-bold text-greenly-midnight">Reports & Exports</h1>
      <p className="mt-2 text-lg text-greenly-slate">
        Generate reports and download your raw ESG data.
      </p>
    </div>
    <div className="flex gap-3">
      <button
        onClick={onExportAll}
        className="flex items-center gap-2 rounded-xl bg-white border border-greenly-light px-4 py-2.5 text-sm font-semibold text-greenly-midnight hover:bg-greenly-off-white transition-all shadow-sm"
      >
        <Database className="h-5 w-5" />
        Export All Data
      </button>
      <Link
        to="/dashboard/report-generator"
        className="flex items-center gap-2 rounded-xl bg-greenly-midnight px-4 py-2.5 text-sm font-semibold text-white hover:bg-greenly-midnight/90 transition-all shadow-sm"
      >
        <FileText className="h-5 w-5" />
        Generate Report
      </Link>
    </div>
  </div>
)

const FrameworkDownloads = ({ frameworks, onDownload, onPreview, onDownloadPDF }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-greenly-light">
    <div className="p-6 border-b border-greenly-light">
      <h2 className="text-xl font-bold text-greenly-midnight">ESG Framework Reports</h2>
      <p className="text-sm text-greenly-slate mt-1">
        Preview and download comprehensive PDF reports for each framework.
      </p>
    </div>
    <div className="divide-y divide-greenly-light">
      {frameworks.map((framework) => (
        <div
          key={framework.id}
          className="flex items-center justify-between px-6 py-4 hover:bg-greenly-off-white transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-semibold text-greenly-midnight">{framework.name}</h3>
            <p className="text-sm text-greenly-slate">{framework.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-greenly-light rounded-full">
                <div
                  className="h-full bg-greenly-teal rounded-full"
                  style={{ width: `${framework.progress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-greenly-slate">
                {framework.progress}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPreview(framework.id)}
                disabled={framework.progress === 0}
                className="flex items-center gap-2 rounded-lg bg-white border-2 border-greenly-light px-3 py-2 text-xs font-semibold text-greenly-midnight hover:bg-greenly-off-white hover:border-greenly-teal transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Preview Report"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => onDownloadPDF(framework.id)}
                disabled={framework.progress === 0}
                className="flex items-center gap-2 rounded-lg bg-greenly-midnight border-2 border-greenly-midnight px-3 py-2 text-xs font-semibold text-white hover:bg-greenly-midnight/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download PDF Report"
              >
                <Download className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => onDownload(framework.id)}
                disabled={framework.progress === 0}
                className="flex items-center gap-2 rounded-lg bg-white border-2 border-greenly-light px-3 py-2 text-xs font-semibold text-greenly-midnight hover:bg-greenly-off-white hover:border-greenly-teal transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Download Raw JSON Data"
              >
                <Database className="h-4 w-4" />
                JSON
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const EmissionsReportsList = ({ reports }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-greenly-light">
    <div className="p-6 border-b border-greenly-light">
      <h2 className="text-xl font-bold text-greenly-midnight">Generated Emissions Reports</h2>
      <p className="text-sm text-greenly-slate mt-1">
        Your history of generated emissions summary reports.
      </p>
    </div>
    <div className="divide-y divide-greenly-light">
      {reports.map((report) => (
        <div
          key={report.id}
          className="flex items-center justify-between px-6 py-4 hover:bg-greenly-off-white transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-greenly-off-white rounded-lg border border-greenly-light">
              <FileArchive className="h-6 w-6 text-greenly-slate" />
            </div>
            <div>
              <h3 className="font-semibold text-greenly-midnight">{report.title}</h3>
              <div className="flex items-center gap-3 text-sm text-greenly-slate">
                <span>{report.date}</span>
                <span>&bull;</span>
                <span>{report.totalEmissions.toLocaleString()} tCO₂e</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${report.status === 'Ready'
                  ? 'bg-greenly-success/10 text-greenly-success border border-greenly-success/20'
                  : 'bg-greenly-slate/10 text-greenly-slate border border-greenly-slate/20'
                }`}
            >
              {report.status}
            </span>
            <button className="flex items-center gap-2 rounded-lg bg-white border border-greenly-light px-3 py-1.5 text-xs font-semibold text-greenly-midnight hover:bg-greenly-off-white transition-all shadow-sm">
              <Download className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ReportPreviewModal = ({ previewData, onClose, onDownloadPDF }) => {
  if (!previewData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border-2 border-greenly-light flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-greenly-light flex justify-between items-center bg-greenly-midnight text-white">
          <div>
            <h2 className="text-2xl font-bold">{previewData.framework}</h2>
            <p className="text-sm text-greenly-mint mt-1">Report Preview - Generated: {previewData.generatedDate}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-greenly-mint">Progress</div>
              <div className="text-xl font-bold">{previewData.progress}%</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-greenly-mint">Score</div>
              <div className="text-xl font-bold">{previewData.score}/100</div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-greenly-mint transition-colors ml-4"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-greenly-off-white">
          <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-greenly-success" />
              <h3 className="text-xl font-bold text-greenly-midnight">Executive Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-greenly-off-white p-4 rounded-lg border border-greenly-light">
                <div className="text-sm text-greenly-slate">Total Sections</div>
                <div className="text-2xl font-bold text-greenly-midnight">{previewData.sections.length}</div>
              </div>
              <div className="bg-greenly-off-white p-4 rounded-lg border border-greenly-light">
                <div className="text-sm text-greenly-slate">Data Progress</div>
                <div className="text-2xl font-bold text-greenly-teal">{previewData.progress}%</div>
              </div>
              <div className="bg-greenly-off-white p-4 rounded-lg border border-greenly-light">
                <div className="text-sm text-greenly-slate">Quality Score</div>
                <div className="text-2xl font-bold text-greenly-midnight">{previewData.score}/100</div>
              </div>
            </div>
          </div>

          {/* Sections */}
          {previewData.sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-greenly-light p-6 mb-4">
              <h3 className="text-lg font-bold text-greenly-midnight mb-4 flex items-center gap-2">
                <span className="bg-greenly-midnight text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <div className="space-y-3">
                {section.subsections.map((subsection, subIdx) => (
                  <div key={subIdx} className="border-l-4 border-greenly-teal pl-4 py-2">
                    <div className="font-semibold text-greenly-midnight text-sm mb-1">
                      {subsection.name}
                    </div>
                    <div className="text-sm text-greenly-slate">
                      {subsection.data && typeof subsection.data === 'object' ? (
                        <pre className="bg-greenly-off-white p-3 rounded text-xs overflow-x-auto border border-greenly-light">
                          {JSON.stringify(subsection.data, null, 2)}
                        </pre>
                      ) : subsection.data && subsection.data !== 'No data available' ? (
                        <span className="text-greenly-midnight">{subsection.data}</span>
                      ) : (
                        <span className="text-greenly-slate italic">No data available for this subsection</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-2 border-greenly-light bg-white flex justify-between items-center">
          <p className="text-sm text-greenly-slate">
            This preview shows the exact content that will appear in your PDF report.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border-2 border-greenly-light text-greenly-midnight font-semibold hover:bg-greenly-off-white transition-all"
            >
              Close Preview
            </button>
            <button
              onClick={onDownloadPDF}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-greenly-midnight text-white font-semibold hover:bg-greenly-midnight/90 transition-all shadow-lg"
            >
              <Download className="h-5 w-5" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ReportsPage() {
  const {
    emissionsReports,
    esgFrameworks,
    downloadFrameworkData,
    downloadAllESGData,
    handlePreview,
    handleDownloadPDF,
    previewData,
    showPreview,
    setShowPreview,
  } = useReportsPage()

  const handleDownloadFromPreview = async () => {
    if (previewData) {
      // Extract framework ID from the preview data
      const framework = esgFrameworks.find(f => f.name === previewData.framework);
      if (framework) {
        await handleDownloadPDF(framework.id);
        setShowPreview(false);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-greenly-secondary min-h-screen space-y-8">
      <Header onExportAll={downloadAllESGData} />
      <FrameworkDownloads 
        frameworks={esgFrameworks} 
        onDownload={downloadFrameworkData}
        onPreview={handlePreview}
        onDownloadPDF={handleDownloadPDF}
      />
      <EmissionsReportsList reports={emissionsReports} />
      
      {showPreview && (
        <ReportPreviewModal 
          previewData={previewData}
          onClose={() => setShowPreview(false)}
          onDownloadPDF={handleDownloadFromPreview}
        />
      )}
    </div>
  )
}
