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
  Users,
  Shield,
  Globe,
  BarChart3,
  Filter,
  Calendar,
  RefreshCw,
  ChevronDown,
} from 'lucide-react'
import SkeletonLoader from '@components/atoms/SkeletonLoader'
import EmptyState from '@components/molecules/EmptyState'

const frameworks = [
  { id: 'GRI', name: 'GRI' },
  { id: 'TCFD', name: 'TCFD' },
  { id: 'CDP', name: 'CDP' },
  { id: 'CSRD', name: 'CSRD' },
  { id: 'SBTi', name: 'SBTi' },
  { id: 'SDG', name: 'SDGs' },
]

const timeRanges = [
  { id: '1Y', name: 'Last Year' },
  { id: '3Y', name: 'Last 3 Years' },
  { id: '5Y', name: 'Last 5 Years' },
]

const Header = ({ loading, lastUpdated, timeRange, setTimeRange, onRefresh }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-3xl font-bold text-greenly-charcoal">Executive ESG Dashboard</h1>
      <p className="mt-1 text-greenly-gray">
        Comprehensive view across all sustainability frameworks
      </p>
    </div>
    <div className="flex items-center gap-2">
      <Dropdown
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        options={timeRanges}
      />
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-greenly-light bg-white px-3 py-2 text-sm font-semibold text-greenly-charcoal hover:bg-greenly-light disabled:opacity-50 transition-colors"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>
      <p className="text-xs text-greenly-gray hidden md:block">
        Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}
      </p>
    </div>
  </div>
);

const FrameworkSelector = ({ selectedFramework, setSelectedFramework, description }) => (
  <div className="rounded-xl border border-greenly-light bg-white p-4 shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-greenly-primary" />
        <span className="text-sm font-semibold text-greenly-charcoal">Filter by Framework:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {frameworks.map((framework) => (
          <button
            key={framework.id}
            onClick={() => setSelectedFramework(framework.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              selectedFramework === framework.id
                ? 'bg-greenly-primary text-white shadow-sm'
                : 'bg-greenly-light text-greenly-charcoal hover:bg-greenly-light-gray'
            }`}
          >
            {framework.name}
          </button>
        ))}
      </div>
    </div>
    <p className="text-sm text-greenly-gray">{description}</p>
  </div>
);

const EmissionsSummary = ({ stats, isLoading }) => (
  <div className="rounded-xl border border-greenly-light bg-gradient-to-r from-greenly-light to-white p-6 shadow-sm">
    {isLoading ? (
      <div className="flex justify-between items-center">
        <div>
          <SkeletonLoader className="h-5 w-48 mb-3" />
          <SkeletonLoader className="h-10 w-64 mb-2" />
          <SkeletonLoader className="h-4 w-80" />
        </div>
        <SkeletonLoader className="h-16 w-16 rounded-full" />
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-greenly-charcoal">Total GHG Emissions</h3>
          <p className="text-3xl font-bold text-greenly-primary mt-2">
            {stats.totalEmissions} <span className="text-lg font-medium text-greenly-gray">tCO₂e</span>
          </p>
          <p className="text-sm text-greenly-gray mt-1">
            Scope 1: {stats.scopeBreakdown.scope1} | Scope 2: {stats.scopeBreakdown.scope2} | Scope 3: {stats.scopeBreakdown.scope3}
          </p>
        </div>
        <Globe className="h-16 w-16 text-greenly-primary opacity-10 mt-4 sm:mt-0" />
      </div>
    )}
  </div>
);

const SummaryCards = ({ summary, isLoading }) => {
  const cards = [
    { title: 'Total KPIs', value: summary.totalKPIs, icon: BarChart3, color: 'blue' },
    { title: 'On Track', value: summary.onTrack, icon: CheckCircle2, color: 'green' },
    { title: 'At Risk', value: summary.atRisk, icon: AlertCircle, color: 'yellow' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl border border-greenly-light bg-white p-5 shadow-sm">
          {isLoading ? (
            <>
              <SkeletonLoader className="h-10 w-10 rounded-full mb-3" />
              <SkeletonLoader className="h-4 w-3/4 mb-2" />
              <SkeletonLoader className="h-8 w-1/2" />
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-greenly-gray">{card.title}</p>
                <p className={`mt-2 text-3xl font-bold text-greenly-charcoal`}>{card.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-full bg-${card.color}-100 flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 text-${card.color}-600`} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
};

const MetricCard = ({ metric, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-greenly-light bg-white p-4 shadow-sm space-y-3">
        <SkeletonLoader className="h-5 w-2/3" />
        <SkeletonLoader className="h-4 w-1/3" />
        <div className="flex items-baseline gap-2">
          <SkeletonLoader className="h-8 w-1/2" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
        <SkeletonLoader className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <SkeletonLoader className="h-4 w-1/3" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
      </div>
    )
  }

  const { metricName, topic, value, unit, target, trend, reportingPeriod, dataQuality } = metric
  const variance = target ? ((value / target) - 1) * 100 : null

  const getStatus = () => {
    if (variance === null) return null
    if (variance <= 5) return { text: 'On Track', color: 'green' }
    if (variance <= 15) return { text: 'Needs Attention', color: 'yellow' }
    return { text: 'At Risk', color: 'red' }
  }
  const status = getStatus()

  return (
    <div className="flex flex-col rounded-xl border border-greenly-light bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-greenly-charcoal text-sm leading-tight">{metricName}</h4>
          <p className="text-xs text-greenly-gray mt-1">{topic}</p>
        </div>
        {trend && (
          trend > 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-greenly-charcoal">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm text-greenly-gray">{unit}</span>}
      </div>

      {target && (
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-greenly-gray">Target: {target.toLocaleString()}</span>
            {status && (
              <span className={`font-semibold text-${status.color}-600`}>{status.text}</span>
            )}
          </div>
          <div className="w-full bg-greenly-light rounded-full h-1.5">
            <div
              className={`bg-${status.color}-500 h-1.5 rounded-full`}
              style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-grow" />

      <div className="mt-3 flex items-center justify-between text-xs text-greenly-gray border-t border-greenly-light pt-2">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {reportingPeriod || 'N/A'}
        </span>
        {dataQuality && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            dataQuality === 'high' ? 'bg-green-100 text-green-700' :
            dataQuality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {dataQuality}
          </span>
        )}
      </div>
    </div>
  )
};

const Dropdown = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="appearance-none rounded-lg border border-greenly-light bg-white pl-3 pr-8 py-2 text-sm font-semibold text-greenly-charcoal hover:bg-greenly-light focus:outline-none focus:ring-2 focus:ring-greenly-primary transition-colors"
    >
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
    <ChevronDown className="h-4 w-4 text-greenly-gray absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

export default function ESGExecutiveDashboard() {
  const [selectedFramework, setSelectedFramework] = useState('GRI')
  const [metrics, setMetrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [timeRange, setTimeRange] = useState('1Y')
  const [emissionsData, setEmissionsData] = useState([])

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      try {
        const [metricsResponse, emissionsResponse] = await Promise.all([
          enterpriseAPI.esgMetrics.getAll({
            framework: selectedFramework,
            sort: '-createdAt',
            limit: 100,
          }),
          enterpriseAPI.emissions.getAll({ limit: 50 }),
        ])

        if (metricsResponse.data?.success && Array.isArray(metricsResponse.data.data)) {
          setMetrics(metricsResponse.data.data)
        } else {
          setMetrics([])
        }

        if (emissionsResponse.data?.success) {
          setEmissionsData(emissionsResponse.data.data || [])
        }

        setLastUpdated(new Date())
      } catch (error) {
        console.error('Error loading ESG dashboard data:', error)
        setMetrics([])
        setEmissionsData([])
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
    const interval = setInterval(loadAllData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [selectedFramework, timeRange])

  const groupedMetrics = useMemo(() => {
    const env = metrics.filter((m) => m.pillar === 'Environmental')
    const social = metrics.filter((m) => m.pillar === 'Social')
    const governance = metrics.filter((m) => m.pillar === 'Governance')
    return { env, social, governance }
  }, [metrics])

  const summary = useMemo(() => {
    const totalKPIs = metrics.length
    const onTrack = metrics.filter(
      (m) => m.target && m.value <= m.target * 1.1
    ).length
    const atRisk = metrics.filter(
      (m) => m.target && m.value > m.target * 1.1
    ).length
    return { totalKPIs, onTrack, atRisk }
  }, [metrics])

  const frameworkStats = useMemo(() => {
    const totalEmissions = emissionsData.reduce((sum, e) => sum + (e.co2e || 0), 0)
    const scopeBreakdown = emissionsData.reduce((acc, e) => {
      acc[e.scope] = (acc[e.scope] || 0) + (e.co2e || 0)
      return acc
    }, {})
    return {
      totalEmissions: totalEmissions.toFixed(2),
      scopeBreakdown: {
        scope1: (scopeBreakdown.scope1 || 0).toFixed(2),
        scope2: (scopeBreakdown.scope2 || 0).toFixed(2),
        scope3: (scopeBreakdown.scope3 || 0).toFixed(2),
      },
    }
  }, [emissionsData])

  const getFrameworkDescription = (frameworkId) => {
    const descriptions = {
      GRI: 'Global Reporting Initiative - Comprehensive ESG reporting standards.',
      TCFD: 'Task Force on Climate-related Financial Disclosures - Climate risk focus.',
      CDP: 'Carbon Disclosure Project - Environmental impact disclosure system.',
      CSRD: 'Corporate Sustainability Reporting Directive - EU compliance framework.',
      SBTi: 'Science Based Targets initiative - Climate goal validation and tracking.',
      SDG: 'Sustainable Development Goals - UN global sustainability blueprint.',
    }
    return descriptions[frameworkId] || 'ESG Reporting Framework'
  }

  const renderPillarSection = (title, icon, metrics, color, isLoading) => (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-greenly-charcoal">{title}</h2>
        <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded-md text-xs font-medium`}>
          {isLoading ? '...' : metrics.length} metrics
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <MetricCard key={i} isLoading />)
          : metrics.map((metric) => <MetricCard key={metric._id} metric={metric} />)}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Header
        loading={loading}
        lastUpdated={lastUpdated}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onRefresh={() => window.location.reload()}
      />

      <FrameworkSelector
        selectedFramework={selectedFramework}
        setSelectedFramework={setSelectedFramework}
        description={getFrameworkDescription(selectedFramework)}
      />

      {emissionsData.length > 0 && (
        <EmissionsSummary stats={frameworkStats} isLoading={loading} />
      )}

      <SummaryCards summary={summary} isLoading={loading} />

      {loading && !metrics.length ? (
        <div className="space-y-8">
          {renderPillarSection('Environmental (E)', <Globe className="h-5 w-5" />, [], 'green', true)}
          {renderPillarSection('Social (S)', <Users className="h-5 w-5" />, [], 'blue', true)}
          {renderPillarSection('Governance (G)', <Shield className="h-5 w-5" />, [], 'purple', true)}
        </div>
      ) : !metrics.length ? (
        <EmptyState
          icon={BarChart3}
          title="No Data for this Framework"
          message="Start collecting ESG data to populate your dashboard, or select a different framework."
        />
      ) : (
        <div className="space-y-8">
          {renderPillarSection('Environmental (E)', <Globe className="h-5 w-5" />, groupedMetrics.env, 'green', loading)}
          {renderPillarSection('Social (S)', <Users className="h-5 w-5" />, groupedMetrics.social, 'blue', loading)}
          {renderPillarSection('Governance (G)', <Shield className="h-5 w-5" />, groupedMetrics.governance, 'purple', loading)}
        </div>
      )}
    </div>
  )
}

