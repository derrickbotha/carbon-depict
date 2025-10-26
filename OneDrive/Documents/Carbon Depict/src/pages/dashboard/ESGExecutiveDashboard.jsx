/**
 * Executive ESG Dashboard
 * Multi-framework dashboard with KPI tracking for C-suite decision-making
 */

import { useState, useEffect, useMemo } from 'react'
import { enterpriseAPI } from '../../services/enterpriseAPI'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Target,
  Activity,
  Users,
  Shield,
  Globe,
  Award,
  BarChart3,
  Filter,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react'

const frameworks = [
  { id: 'GRI', name: 'GRI Standards', color: 'bg-blue-500' },
  { id: 'TCFD', name: 'TCFD', color: 'bg-green-500' },
  { id: 'CDP', name: 'CDP', color: 'bg-purple-500' },
  { id: 'CSRD', name: 'CSRD', color: 'bg-yellow-500' },
  { id: 'SBTi', name: 'SBTi', color: 'bg-indigo-500' },
  { id: 'SDG', name: 'SDGs', color: 'bg-teal-500' }
]

export default function ESGExecutiveDashboard() {
  const [selectedFramework, setSelectedFramework] = useState('GRI')
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [timeRange, setTimeRange] = useState('1Y')

  useEffect(() => {
    loadDashboardData()
  }, [selectedFramework, timeRange])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch ESG metrics for the selected framework
      const response = await enterpriseAPI.esgMetrics.getAll({
        framework: selectedFramework,
        limit: 100
      })

      if (response.data.success) {
        setMetrics(response.data.data)
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading ESG dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group metrics by pillar (E, S, G)
  const groupedMetrics = useMemo(() => {
    const env = metrics.filter(m => m.pillar === 'Environmental')
    const social = metrics.filter(m => m.pillar === 'Social')
    const governance = metrics.filter(m => m.pillar === 'Governance')
    return { env, social, governance }
  }, [metrics])

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalKPIs = metrics.length
    const withTargets = metrics.filter(m => m.target).length
    const onTrack = metrics.filter(m => {
      if (!m.value || !m.target) return false
      return m.value <= m.target * 1.1 // Within 10% of target
    }).length
    const atRisk = metrics.filter(m => {
      if (!m.value || !m.target) return false
      return m.value > m.target * 1.2 // More than 20% over target
    }).length

    return { totalKPIs, withTargets, onTrack, atRisk }
  }, [metrics])

  const getTrendIndicator = (metric) => {
    if (!metric.trend) return null
    return metric.trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : metric.trend < 0 ? (
      <TrendingDown className="h-4 w-4 text-red-500" />
    ) : null
  }

  const getStatusBadge = (metric) => {
    if (!metric.target) return null
    
    const variance = ((metric.value / metric.target) - 1) * 100
    
    if (variance <= 10) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">On Track</span>
    } else if (variance <= 20) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">At Risk</span>
    } else {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Critical</span>
    }
  }

  const MetricCard = ({ metric }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">{metric.metricName}</h4>
          <p className="text-xs text-gray-500 mt-1">{metric.topic}</p>
        </div>
        {getTrendIndicator(metric)}
      </div>
      
      <div className="flex items-end gap-2 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
        </span>
        {metric.unit && (
          <span className="text-sm text-gray-500">{metric.unit}</span>
        )}
      </div>

      {metric.target && (
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Target: {metric.target.toLocaleString()}</span>
          {getStatusBadge(metric)}
        </div>
      )}

      {metric.target && metric.value && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((metric.value / metric.target) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        {metric.reportingPeriod && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {metric.reportingPeriod}
          </span>
        )}
        {metric.dataQuality && (
          <span className={`px-2 py-0.5 rounded ${
            metric.dataQuality === 'high' ? 'bg-green-100 text-green-700' :
            metric.dataQuality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {metric.dataQuality}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive ESG Dashboard</h1>
          <p className="mt-1 text-gray-600">Comprehensive view across all sustainability frameworks</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="1Y">Last Year</option>
            <option value="3Y">Last 3 Years</option>
            <option value="5Y">Last 5 Years</option>
          </select>
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Framework Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Framework:</span>
          </div>
          <div className="flex gap-2">
            {frameworks.map((framework) => (
              <button
                key={framework.id}
                onClick={() => setSelectedFramework(framework.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFramework === framework.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {framework.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total KPIs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{summary.totalKPIs}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Track</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{summary.onTrack}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">At Risk</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{summary.atRisk}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      )}

      {/* Metrics by Pillar */}
      {!loading && (
        <>
          {/* Environmental */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Environmental (E)</h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {groupedMetrics.env.length} metrics
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupedMetrics.env.map((metric) => (
                <MetricCard key={metric._id} metric={metric} />
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Social (S)</h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {groupedMetrics.social.length} metrics
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupedMetrics.social.map((metric) => (
                <MetricCard key={metric._id} metric={metric} />
              ))}
            </div>
          </div>

          {/* Governance */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Governance (G)</h2>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                {groupedMetrics.governance.length} metrics
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupedMetrics.governance.map((metric) => (
                <MetricCard key={metric._id} metric={metric} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && metrics.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <BarChart3 className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start collecting ESG data to populate your dashboard
          </p>
        </div>
      )}
    </div>
  )
}

