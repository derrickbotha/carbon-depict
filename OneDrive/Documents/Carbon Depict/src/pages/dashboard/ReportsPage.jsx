// Cache bust 2025-10-23
import { PrimaryButton, OutlineButton } from '@atoms/Button'
import { Download, FileText, Calendar } from '@atoms/Icon'
import esgDataManager from '../../utils/esgDataManager'
import { useState } from 'react'

export default function ReportsPage() {
  const [scores] = useState(() => esgDataManager.getScores())
  
  const reports = [
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
  ]

  // ESG Frameworks with download capabilities
  const esgFrameworks = [
    {
      id: 'gri',
      name: 'GRI Standards 2021',
      description: 'Global Reporting Initiative framework data',
      progress: Math.round(scores.frameworks.gri.progress),
      score: scores.frameworks.gri.score,
      color: 'teal',
      lastUpdated: scores.frameworks.gri.lastUpdated,
    },
    {
      id: 'tcfd',
      name: 'TCFD Recommendations',
      description: 'Task Force on Climate-related Financial Disclosures',
      progress: Math.round(scores.frameworks.tcfd.progress),
      score: scores.frameworks.tcfd.score,
      color: 'mint',
      lastUpdated: scores.frameworks.tcfd.lastUpdated,
    },
    {
      id: 'sbti',
      name: 'Science Based Targets',
      description: 'Science Based Targets initiative data',
      progress: Math.round(scores.frameworks.sbti.progress),
      score: scores.frameworks.sbti.score,
      color: 'cedar',
      lastUpdated: scores.frameworks.sbti.lastUpdated,
    },
    {
      id: 'csrd',
      name: 'CSRD (ESRS)',
      description: 'Corporate Sustainability Reporting Directive',
      progress: Math.round(scores.frameworks.csrd.progress),
      score: scores.frameworks.csrd.score,
      color: 'desert',
      lastUpdated: scores.frameworks.csrd.lastUpdated,
    },
    {
      id: 'cdp',
      name: 'CDP Disclosure',
      description: 'Carbon Disclosure Project data',
      progress: Math.round(scores.frameworks.cdp.progress),
      score: scores.frameworks.cdp.score,
      color: 'midnight',
      lastUpdated: scores.frameworks.cdp.lastUpdated,
    },
    {
      id: 'sdg',
      name: 'UN SDG Alignment',
      description: 'Sustainable Development Goals tracking',
      progress: Math.round(scores.frameworks.sdg.progress),
      score: scores.frameworks.sdg.score,
      color: 'teal',
      lastUpdated: scores.frameworks.sdg.lastUpdated,
    },
  ]

  // Download ESG framework data as JSON
  const downloadFrameworkData = (frameworkId, frameworkName) => {
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

  // Download all ESG data
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-cd-text">Reports</h1>
          <p className="text-cd-muted">
            Generate and download emission reports and ESG framework data
          </p>
        </div>
        <div className="flex gap-3">
          <OutlineButton 
            onClick={downloadAllESGData}
            className="flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            Export All ESG Data
          </OutlineButton>
          <PrimaryButton className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate New Report
          </PrimaryButton>
        </div>
      </div>

      {/* Report Generator Card */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-md">
        <h2 className="mb-4 text-xl font-semibold text-cd-text">Quick Report Generator</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-cd-border p-4 text-center hover:border-cd-midnight hover:shadow-cd-sm cursor-pointer transition-all">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-cd-midnight" />
            <h3 className="font-semibold text-cd-text">Monthly</h3>
            <p className="text-sm text-cd-muted">Last 30 days</p>
          </div>
          <div className="rounded-md border border-cd-border p-4 text-center hover:border-cd-midnight hover:shadow-cd-sm cursor-pointer transition-all">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-cd-midnight" />
            <h3 className="font-semibold text-cd-text">Quarterly</h3>
            <p className="text-sm text-cd-muted">Last 3 months</p>
          </div>
          <div className="rounded-md border border-cd-border p-4 text-center hover:border-cd-midnight hover:shadow-cd-sm cursor-pointer transition-all">
            <Calendar className="mx-auto mb-2 h-8 w-8 text-cd-midnight" />
            <h3 className="font-semibold text-cd-text">Annual</h3>
            <p className="text-sm text-cd-muted">Last 12 months</p>
          </div>
        </div>
      </div>

      {/* ESG Framework Downloads */}
      <div className="rounded-lg border border-cd-border bg-white shadow-cd-sm">
        <div className="border-b border-cd-border px-6 py-4">
          <h2 className="text-lg font-semibold text-cd-text">ESG Framework Data</h2>
          <p className="text-sm text-cd-muted mt-1">
            Download your collected ESG data by framework
          </p>
        </div>
        <div className="divide-y divide-cd-border">
          {esgFrameworks.map((framework) => (
            <div
              key={framework.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-cd-surface"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-md bg-cd-${framework.color}/10`}>
                  <FileText className={`h-6 w-6 text-cd-${framework.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-cd-text">{framework.name}</h3>
                  <p className="text-sm text-cd-muted">{framework.description}</p>
                  <div className="flex gap-3 text-xs text-cd-muted mt-1">
                    <span>Progress: {framework.progress}%</span>
                    {framework.score > 0 && (
                      <>
                        <span>•</span>
                        <span>AI Score: {framework.score}/100</span>
                      </>
                    )}
                    {framework.lastUpdated && (
                      <>
                        <span>•</span>
                        <span>Updated: {new Date(framework.lastUpdated).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Progress indicator */}
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-cd-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-cd-${framework.color} transition-all duration-300`}
                      style={{ width: `${framework.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-cd-muted w-10 text-right">
                    {framework.progress}%
                  </span>
                </div>
                <OutlineButton 
                  onClick={() => downloadFrameworkData(framework.id, framework.name)}
                  className="flex items-center gap-2 px-4 py-2"
                  disabled={framework.progress === 0}
                >
                  <Download className="h-4 w-4" />
                  Download JSON
                </OutlineButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emissions Reports List */}
      <div className="rounded-lg border border-cd-border bg-white shadow-cd-sm">
        <div className="border-b border-cd-border px-6 py-4">
          <h2 className="text-lg font-semibold text-cd-text">Emissions Reports</h2>
        </div>
        <div className="divide-y divide-cd-border">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between px-6 py-4 hover:bg-cd-surface"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cd-surface">
                  <FileText className="h-6 w-6 text-cd-midnight" />
                </div>
                <div>
                  <h3 className="font-semibold text-cd-text">{report.title}</h3>
                  <div className="flex gap-3 text-sm text-cd-muted">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.totalEmissions.toLocaleString()} tCO₂e</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    report.status === 'Ready'
                      ? 'bg-cd-mint/20 text-cd-midnight'
                      : 'bg-cd-surface text-cd-muted'
                  }`}
                >
                  {report.status}
                </span>
                <OutlineButton className="flex items-center gap-2 px-4 py-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </OutlineButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

