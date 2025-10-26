import { useState, useEffect } from 'react'
// Force cache invalidation 2025-10-23
import { Link } from 'react-router-dom'
import MetricCard from '@molecules/MetricCard'
import DateFilter from '@molecules/DateFilter'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Leaf,
  Users,
  Shield,
  ArrowRight,
  Award,
  Zap,
  Globe
} from '@atoms/Icon'
import { useDashboardData, useEmissionsAnalytics, useESGAnalytics, useComplianceAnalytics } from '../../hooks/useEnterpriseData'

/**
 * Executive Summary Dashboard
 * High-level overview of ESG and emissions performance against targets
 * Following EU standards (CSRD/ESRS) and global best practices (GRI, TCFD, SBTi)
 */
export default function DashboardHome() {
  // Date filter state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate: new Date()
  })

  // Convert date range to API parameters
  const apiParams = {
    startDate: dateRange.startDate?.toISOString().split('T')[0],
    endDate: dateRange.endDate?.toISOString().split('T')[0]
  }

  // Only use API params if we have valid dates
  const validApiParams = (apiParams.startDate && apiParams.endDate) ? apiParams : {}

  // Load live data from API with date filtering
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData(validApiParams)
  const { data: emissionsData, loading: emissionsLoading, refetch: refetchEmissions } = useEmissionsAnalytics(validApiParams)
  const { data: esgData, loading: esgLoading, refetch: refetchESG } = useESGAnalytics(validApiParams)
  const { data: complianceData, loading: complianceLoading, refetch: refetchCompliance } = useComplianceAnalytics(validApiParams)
  
  // Real-time updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchDashboard()
      refetchEmissions()
      refetchESG()
      refetchCompliance()
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [refetchDashboard, refetchEmissions, refetchESG, refetchCompliance])

  // Calculate scores from real data
  const scores = {
    environmental: esgData?.environmental?.score || 0,
    social: esgData?.social?.score || 0,
    governance: esgData?.governance?.score || 0,
    overall: esgData?.overall?.score || 0,
    frameworks: {
      gri: esgData?.frameworks?.gri?.score || 0,
      tcfd: esgData?.frameworks?.tcfd?.score || 0,
      sbti: esgData?.frameworks?.sbti?.score || 0,
      csrd: esgData?.frameworks?.csrd?.score || 0,
      cdp: esgData?.frameworks?.cdp?.score || 0,
      sdg: esgData?.frameworks?.sdg?.score || 0
    }
  }
  
  // EU Taxonomy Alignment & CSRD Compliance
  const euCompliance = {
    taxonomy: {
      eligible: complianceData?.taxonomy?.eligible || 0,
      aligned: complianceData?.taxonomy?.aligned || 0,
      status: complianceData?.taxonomy?.status || 'pending',
    },
    csrd: {
      progress: complianceData?.csrd?.progress || 0,
      status: complianceData?.csrd?.status || 'pending',
    },
    esrs: {
      environmental: scores.environmental,
      social: scores.social,
      governance: scores.governance,
    }
  }

  // Emissions Performance vs Science-Based Targets (SBTi)
  const emissionsPerformance = {
    current: {
      scope1: emissionsData?.scopeSummary?.scope1?.total || 0,
      scope2: emissionsData?.scopeSummary?.scope2?.total || 0,
      scope3: emissionsData?.scopeSummary?.scope3?.total || 0,
      total: emissionsData?.totalEmissions || 0,
    },
    targets: {
      scope1: dashboardData?.targets?.scope1 || 0,
      scope2: dashboardData?.targets?.scope2 || 0,
      scope3: dashboardData?.targets?.scope3 || 0,
      total: dashboardData?.targets?.total || 0,
    },
    trends: {
      scope1: emissionsData?.scopeSummary?.scope1?.trend || 'stable',
      scope2: emissionsData?.scopeSummary?.scope2?.trend || 'stable',
      scope3: emissionsData?.scopeSummary?.scope3?.trend || 'stable',
      total: emissionsData?.totalEmissions?.trend || 'stable',
    },
    sbti: {
      status: dashboardData?.sbti?.status || 'pending',
      progress: dashboardData?.sbti?.progress || 0,
      targetYear: dashboardData?.sbti?.targetYear || 2030,
    }
  }

  // ESG Performance Summary (EU ESRS Framework)
  const esgPerformance = {
    environmental: {
      score: Math.round(scores.environmental),
      target: 85,
      status: scores.environmental >= 70 ? 'excellent' : scores.environmental >= 50 ? 'good' : 'needs-improvement',
      metrics: esgData?.environmental?.metrics || [
        { label: 'GHG Emissions Reduction', value: 0, target: 50, unit: '%' },
        { label: 'Renewable Energy', value: 0, target: 100, unit: '%' },
        { label: 'Circular Economy', value: 0, target: 60, unit: '%' },
        { label: 'Biodiversity Impact', value: 'Pending', target: 'No Net Loss', status: 'pending' },
      ]
    },
    social: {
      score: Math.round(scores.social),
      target: 80,
      status: scores.social >= 70 ? 'excellent' : scores.social >= 50 ? 'good' : 'needs-improvement',
      metrics: esgData?.social?.metrics || [
        { label: 'Employee Satisfaction', value: 0, target: 85, unit: '%' },
        { label: 'Diversity & Inclusion', value: 0, target: 40, unit: '%' },
        { label: 'Health & Safety', value: 0, target: 0, unit: 'incidents', status: 'good' },
        { label: 'Community Impact', value: 'Pending', target: 'Positive', status: 'pending' },
      ]
    },
    governance: {
      score: Math.round(scores.governance),
      target: 90,
      status: scores.governance >= 70 ? 'excellent' : scores.governance >= 50 ? 'good' : 'needs-improvement',
      metrics: esgData?.governance?.metrics || [
        { label: 'Board Diversity', value: 0, target: 50, unit: '%' },
        { label: 'Ethics Compliance', value: 0, target: 100, unit: '%' },
        { label: 'Risk Management', value: 'Pending', target: 'Comprehensive', status: 'pending' },
        { label: 'Transparency', value: 0, target: 90, unit: '%' },
      ]
    }
  }

  // Framework Compliance Status
  const frameworkCompliance = {
    gri: {
      score: Math.round(scores.frameworks.gri),
      status: scores.frameworks.gri >= 70 ? 'compliant' : scores.frameworks.gri >= 50 ? 'partial' : 'non-compliant',
      progress: scores.frameworks.gri,
      requirements: esgData?.frameworks?.gri?.requirements || []
    },
    tcfd: {
      score: Math.round(scores.frameworks.tcfd),
      status: scores.frameworks.tcfd >= 70 ? 'compliant' : scores.frameworks.tcfd >= 50 ? 'partial' : 'non-compliant',
      progress: scores.frameworks.tcfd,
      requirements: esgData?.frameworks?.tcfd?.requirements || []
    },
    sbti: {
      score: Math.round(scores.frameworks.sbti),
      status: scores.frameworks.sbti >= 70 ? 'compliant' : scores.frameworks.sbti >= 50 ? 'partial' : 'non-compliant',
      progress: scores.frameworks.sbti,
      requirements: esgData?.frameworks?.sbti?.requirements || []
    },
    csrd: {
      score: Math.round(scores.frameworks.csrd),
      status: scores.frameworks.csrd >= 70 ? 'compliant' : scores.frameworks.csrd >= 50 ? 'partial' : 'non-compliant',
      progress: scores.frameworks.csrd,
      requirements: esgData?.frameworks?.csrd?.requirements || []
    }
  }

  // Key Compliance Frameworks Status
  const frameworksStatus = [
    {
      id: 'csrd',
      name: 'CSRD/ESRS',
      description: 'EU Corporate Sustainability Reporting Directive',
      status: frameworkCompliance.csrd.status,
      progress: frameworkCompliance.csrd.progress,
      deadline: '2025',
      priority: 'high'
    },
    {
      id: 'gri',
      name: 'GRI Standards',
      description: 'Global Reporting Initiative',
      status: frameworkCompliance.gri.status,
      progress: frameworkCompliance.gri.progress,
      deadline: 'Ongoing',
      priority: 'high'
    },
    {
      id: 'tcfd',
      name: 'TCFD',
      description: 'Task Force on Climate-related Financial Disclosures',
      status: frameworkCompliance.tcfd.status,
      progress: frameworkCompliance.tcfd.progress,
      deadline: 'Ongoing',
      priority: 'medium'
    },
    {
      id: 'sbti',
      name: 'SBTi',
      description: 'Science Based Targets initiative',
      status: frameworkCompliance.sbti.status,
      progress: frameworkCompliance.sbti.progress,
      deadline: '2030',
      priority: 'high'
    }
  ]

  // Loading state
  const isLoading = dashboardLoading || emissionsLoading || esgLoading || complianceLoading

  // Error handling
  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{dashboardError.message || 'Failed to load dashboard data'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching your ESG and emissions data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold mb-2">Executive ESG Dashboard</h1>
            <p className="text-blue-100">
              Comprehensive overview of your sustainability performance and compliance status
          </p>
        </div>
        <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(scores.overall)}</div>
            <div className="text-blue-100">Overall ESG Score</div>
          </div>
        </div>
        
        {/* Date Filter */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-blue-100 text-sm">
            Showing data from {dateRange.startDate?.toLocaleDateString() || 'N/A'} to {dateRange.endDate?.toLocaleDateString() || 'N/A'}
          </div>
          <DateFilter 
            onDateRangeChange={setDateRange}
            className="bg-white/10 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Emissions Performance */}
        <MetricCard
          title="Total Emissions"
          value={`${emissionsPerformance.current.total.toFixed(1)} tCO₂e`}
          change={emissionsPerformance.trends.total === 'decreasing' ? -12.5 : 0}
          trend={emissionsPerformance.trends.total}
          icon={Leaf}
          color="green"
        />

        {/* ESG Score */}
        <MetricCard
          title="ESG Score"
          value={`${Math.round(scores.overall)}/100`}
          change={scores.overall >= 70 ? 5.2 : 0}
          trend={scores.overall >= 70 ? 'increasing' : 'stable'}
          icon={Award}
          color="blue"
        />

        {/* Compliance Status */}
        <MetricCard
          title="CSRD Compliance"
          value={`${frameworkCompliance.csrd.progress}%`}
          change={frameworkCompliance.csrd.progress >= 70 ? 15.3 : 0}
          trend={frameworkCompliance.csrd.status === 'compliant' ? 'increasing' : 'stable'}
          icon={Shield}
          color="purple"
        />

        {/* SBTi Progress */}
        <MetricCard
          title="SBTi Progress"
          value={`${emissionsPerformance.sbti.progress}%`}
          change={emissionsPerformance.sbti.progress >= 50 ? 8.7 : 0}
          trend={emissionsPerformance.sbti.status === 'on-track' ? 'increasing' : 'stable'}
          icon={Target}
          color="orange"
            />
          </div>

      {/* ESG Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Environmental</h3>
            <Leaf className="h-6 w-6 text-green-600" />
              </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score</span>
              <span className="font-semibold">{esgPerformance.environmental.score}/100</span>
          </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${esgPerformance.environmental.score}%` }}
              ></div>
          </div>
            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                esgPerformance.environmental.status === 'excellent' ? 'text-green-600' :
                esgPerformance.environmental.status === 'good' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {esgPerformance.environmental.status}
                </span>
              </div>
        </div>
      </div>

        {/* Social */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Social</h3>
            <Users className="h-6 w-6 text-blue-600" />
            </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score</span>
              <span className="font-semibold">{esgPerformance.social.score}/100</span>
          </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${esgPerformance.social.score}%` }}
              ></div>
        </div>
            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                esgPerformance.social.status === 'excellent' ? 'text-green-600' :
                esgPerformance.social.status === 'good' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {esgPerformance.social.status}
                      </span>
                    </div>
                  </div>
                </div>

        {/* Governance */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Governance</h3>
            <Shield className="h-6 w-6 text-purple-600" />
                  </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Score</span>
              <span className="font-semibold">{esgPerformance.governance.score}/100</span>
                  </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${esgPerformance.governance.score}%` }}
              ></div>
                  </div>
            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                esgPerformance.governance.status === 'excellent' ? 'text-green-600' :
                esgPerformance.governance.status === 'good' ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {esgPerformance.governance.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Compliance Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Framework Compliance Status</h3>
          <p className="text-sm text-gray-600 mt-1">Track your progress across key ESG frameworks</p>
          </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {frameworksStatus.map((framework) => (
              <div key={framework.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{framework.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    framework.status === 'compliant' ? 'bg-green-100 text-green-800' :
                    framework.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {framework.status}
                </span>
              </div>
                <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{framework.progress}%</span>
                </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        framework.status === 'compliant' ? 'bg-green-600' :
                        framework.status === 'partial' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${framework.progress}%` }}
                    ></div>
              </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Deadline: {framework.deadline}</span>
                    <span className={`${
                      framework.priority === 'high' ? 'text-red-600' :
                      framework.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {framework.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/dashboard/emissions" 
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Leaf className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <div className="font-medium">Emissions Data</div>
              <div className="text-sm text-gray-600">Manage GHG inventory</div>
        </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>

          <Link 
            to="/dashboard/esg/frameworks" 
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Award className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <div className="font-medium">ESG Frameworks</div>
              <div className="text-sm text-gray-600">Framework compliance</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>

          <Link 
            to="/dashboard/reports" 
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Globe className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <div className="font-medium">Reports</div>
              <div className="text-sm text-gray-600">Generate reports</div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>

          <Link 
            to="/dashboard/settings" 
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Shield className="h-6 w-6 text-orange-600 mr-3" />
                <div>
              <div className="font-medium">Settings</div>
              <div className="text-sm text-gray-600">Configure system</div>
                </div>
            <ArrowRight className="h-4 w-4 text-gray-400 ml-auto" />
          </Link>
        </div>
      </div>
    </div>
  )
}