import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MetricCard from '@molecules/MetricCard'
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
import esgDataManager from '../../utils/esgDataManager'

/**
 * Executive Summary Dashboard
 * High-level overview of ESG and emissions performance against targets
 * Following EU standards (CSRD/ESRS) and global best practices (GRI, TCFD, SBTi)
 */
export default function DashboardHome() {
  // Load live ESG scores
  const [scores] = useState(() => esgDataManager.getScores())
  
  // EU Taxonomy Alignment & CSRD Compliance
  const euCompliance = {
    taxonomy: {
      eligible: 78, // % of activities eligible for EU Taxonomy
      aligned: 45, // % of activities aligned with EU Taxonomy
      status: 'on-track',
    },
    csrd: {
      progress: Math.round(scores.frameworks.csrd.progress),
      status: scores.frameworks.csrd.progress > 50 ? 'on-track' : 'action-needed',
    },
    esrs: {
      environmental: Math.round(scores.environmental),
      social: Math.round(scores.social),
      governance: Math.round(scores.governance),
    }
  }

  // Emissions Performance vs Science-Based Targets (SBTi)
  const emissionsPerformance = {
    current: {
      scope1: 498.2,
      scope2: 374.8,
      scope3: 374.5,
      total: 1247.5,
    },
    baseline: {
      year: 2019,
      total: 1850.0,
    },
    targets: {
      nearTerm2030: {
        target: 925.0, // 50% reduction by 2030
        progress: 67.4, // % progress toward target
        status: 'on-track',
        aligned: 'SBTi 1.5°C',
      },
      netZero2050: {
        target: 92.5, // 95% reduction by 2050 
        progress: 32.6,
        status: 'on-track',
        aligned: 'SBTi Net-Zero',
      },
    },
    yearOverYear: {
      change: -12.5, // % change vs last year
      positive: true,
    }
  }

  // ESG Performance Summary (EU ESRS Framework)
  const esgPerformance = {
    environmental: {
      score: Math.round(scores.environmental),
      target: 85,
      status: scores.environmental >= 70 ? 'excellent' : scores.environmental >= 50 ? 'good' : 'needs-improvement',
      metrics: [
        { label: 'GHG Emissions Reduction', value: 32.6, target: 50, unit: '%' },
        { label: 'Renewable Energy', value: 68, target: 100, unit: '%' },
        { label: 'Circular Economy', value: 42, target: 60, unit: '%' },
        { label: 'Biodiversity Impact', value: 'Low Risk', target: 'No Net Loss', status: 'good' },
      ]
    },
    social: {
      score: Math.round(scores.social),
      target: 85,
      status: scores.social >= 70 ? 'excellent' : scores.social >= 50 ? 'good' : 'needs-improvement',
      metrics: [
        { label: 'Gender Parity (40-60%)', value: 48, target: 50, unit: '%' },
        { label: 'Employee Engagement', value: 82, target: 85, unit: '%' },
        { label: 'Living Wage Compliance', value: 100, target: 100, unit: '%' },
        { label: 'Safety Incidents', value: 0.8, target: 0.5, unit: 'per 100 FTE', inverse: true },
      ]
    },
    governance: {
      score: Math.round(scores.governance),
      target: 90,
      status: scores.governance >= 80 ? 'excellent' : scores.governance >= 60 ? 'good' : 'needs-improvement',
      metrics: [
        { label: 'Board Independence', value: 75, target: 66, unit: '%' },
        { label: 'Ethics Compliance', value: 100, target: 100, unit: '%' },
        { label: 'Supplier Audits', value: 92, target: 85, unit: '%' },
        { label: 'Data Privacy Compliance', value: 'GDPR Certified', target: 'GDPR', status: 'excellent' },
      ]
    }
  }

  // Key Compliance Frameworks Status
  const frameworksStatus = [
    {
      id: 'csrd',
      name: 'CSRD/ESRS',
      description: 'EU Corporate Sustainability Reporting Directive',
      progress: Math.round(scores.frameworks.csrd.progress),
      mandatory: true,
      deadline: '2025-01-01',
      status: scores.frameworks.csrd.progress > 80 ? 'compliant' : scores.frameworks.csrd.progress > 50 ? 'on-track' : 'action-needed',
      priority: 'critical',
    },
    {
      id: 'taxonomy',
      name: 'EU Taxonomy',
      description: 'Sustainable Activities Classification',
      progress: 78,
      mandatory: true,
      deadline: '2024-12-31',
      status: 'compliant',
      priority: 'critical',
    },
    {
      id: 'sbti',
      name: 'SBTi Targets',
      description: 'Science-Based Targets (1.5°C pathway)',
      progress: Math.round(scores.frameworks.sbti.progress),
      mandatory: false,
      deadline: '2030-12-31',
      status: scores.frameworks.sbti.progress > 40 ? 'on-track' : 'needs-attention',
      priority: 'high',
    },
    {
      id: 'gri',
      name: 'GRI Standards',
      description: 'Global Reporting Initiative 2021',
      progress: Math.round(scores.frameworks.gri.progress),
      mandatory: false,
      deadline: null,
      status: scores.frameworks.gri.progress > 70 ? 'compliant' : scores.frameworks.gri.progress > 30 ? 'in-progress' : 'not-started',
      priority: 'medium',
    },
    {
      id: 'tcfd',
      name: 'TCFD',
      description: 'Climate-related Financial Disclosures',
      progress: Math.round(scores.frameworks.tcfd.progress),
      mandatory: false,
      deadline: '2024-12-31',
      status: scores.frameworks.tcfd.progress > 60 ? 'on-track' : 'needs-attention',
      priority: 'high',
    },
  ]

  // Critical Actions & Alerts
  const criticalActions = [
    {
      id: 1,
      title: 'CSRD Reporting Deadline Approaching',
      description: 'First CSRD report due January 1, 2026 for FY2025',
      priority: 'critical',
      daysRemaining: 73,
      action: 'Complete ESRS data collection',
      link: '/dashboard/esg/csrd',
    },
    {
      id: 2,
      title: 'Scope 3 Emissions Above Trend',
      description: 'Scope 3 emissions increased 3.4% vs last month',
      priority: 'high',
      impact: 'May affect SBTi target achievement',
      action: 'Review supplier engagement',
      link: '/dashboard/emissions/scope3',
    },
    {
      id: 3,
      title: 'Gender Parity Target at Risk',
      description: 'Current: 48% women in leadership, Target: 50% by 2025',
      priority: 'medium',
      daysRemaining: 73,
      action: 'Accelerate diversity initiatives',
      link: '/dashboard/esg',
    },
  ]

  // Performance against EU Benchmarks
  const euBenchmarks = {
    emissions: {
      yourIntensity: 0.85, // tCO2e per €M revenue
      sectorAverage: 1.2,
      topQuartile: 0.6,
      performance: 'above-average',
    },
    renewable: {
      yourShare: 68, // %
      euTarget2030: 42.5,
      topPerformers: 90,
      performance: 'excellent',
    },
    social: {
      genderPay: 2.5, // % gap
      euAverage: 12.7,
      best: 0,
      performance: 'excellent',
    }
  }

  const recentActivities = [
    { id: 1, action: 'CSRD data updated', category: 'Compliance', date: '2 hours ago', status: 'info' },
    { id: 2, action: 'SBTi validation submitted', category: 'Climate', date: '5 hours ago', status: 'success' },
    { id: 3, action: 'Q3 ESG report generated', category: 'Reporting', date: '1 day ago', status: 'success' },
    { id: 4, action: 'Supplier audit completed', category: 'Governance', date: '2 days ago', status: 'info' },
  ]

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-cd-text">Executive Summary</h1>
          <p className="text-cd-muted">
            ESG & Emissions Performance against EU Standards and Science-Based Targets
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-cd-muted">Reporting Period</div>
          <div className="font-semibold text-cd-text">FY 2025 (YTD)</div>
          <div className="mt-1 text-xs text-cd-muted">Updated: {new Date().toLocaleDateString()}</div>
        </div>
      </div>

      {/* Critical Actions & Alerts */}
      {criticalActions.length > 0 && (
        <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h2 className="font-semibold text-orange-900">Action Required</h2>
          </div>
          <div className="space-y-3">
            {criticalActions.map((action) => (
              <div key={action.id} className="flex items-start justify-between rounded-md bg-white p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${
                      action.priority === 'critical' ? 'bg-red-500' :
                      action.priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    {action.daysRemaining && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
                        {action.daysRemaining} days
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{action.description}</p>
                  {action.impact && (
                    <p className="mt-1 text-xs text-gray-500">Impact: {action.impact}</p>
                  )}
                </div>
                <Link
                  to={action.link}
                  className="ml-4 flex items-center gap-1 rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700"
                >
                  {action.action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Performance Indicators - EU ESRS Framework */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Environmental (E) */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cd-mint/20">
                <Leaf className="h-6 w-6 text-cd-midnight" />
              </div>
              <div>
                <h3 className="font-semibold text-cd-text">Environmental</h3>
                <p className="text-xs text-cd-muted">ESRS E1-E5</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cd-text">{esgPerformance.environmental.score}</div>
              <div className="text-xs text-cd-muted">/ 100</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className={`h-full transition-all ${
                esgPerformance.environmental.status === 'excellent' ? 'bg-green-500' :
                esgPerformance.environmental.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(esgPerformance.environmental.score / esgPerformance.environmental.target) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {esgPerformance.environmental.metrics.slice(0, 3).map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-medium text-gray-900">
                  {typeof metric.value === 'number' ? `${metric.value}${metric.unit}` : metric.value}
                </span>
              </div>
            ))}
          </div>
          
          <Link
            to="/dashboard/esg"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-cd-midnight hover:text-cd-cedar"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Social (S) */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-cd-text">Social</h3>
                <p className="text-xs text-cd-muted">ESRS S1-S4</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cd-text">{esgPerformance.social.score}</div>
              <div className="text-xs text-cd-muted">/ 100</div>
            </div>
          </div>
          
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className={`h-full transition-all ${
                esgPerformance.social.status === 'excellent' ? 'bg-green-500' :
                esgPerformance.social.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(esgPerformance.social.score / esgPerformance.social.target) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {esgPerformance.social.metrics.slice(0, 3).map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-medium text-gray-900">
                  {typeof metric.value === 'number' ? `${metric.value}${metric.unit}` : metric.value}
                </span>
              </div>
            ))}
          </div>
          
          <Link
            to="/dashboard/esg"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-cd-midnight hover:text-cd-cedar"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Governance (G) */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-cd-text">Governance</h3>
                <p className="text-xs text-cd-muted">ESRS G1</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-cd-text">{esgPerformance.governance.score}</div>
              <div className="text-xs text-cd-muted">/ 100</div>
            </div>
          </div>
          
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className={`h-full transition-all ${
                esgPerformance.governance.status === 'excellent' ? 'bg-green-500' :
                esgPerformance.governance.status === 'good' ? 'bg-blue-500' : 'bg-orange-500'
              }`}
              style={{ width: `${(esgPerformance.governance.score / esgPerformance.governance.target) * 100}%` }}
            />
          </div>

          <div className="space-y-2">
            {esgPerformance.governance.metrics.slice(0, 3).map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-medium text-gray-900">
                  {typeof metric.value === 'number' ? `${metric.value}${metric.unit}` : metric.value}
                </span>
              </div>
            ))}
          </div>
          
          <Link
            to="/dashboard/esg"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-cd-midnight hover:text-cd-cedar"
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Emissions Performance vs SBTi Targets */}
      <div className="rounded-lg border border-cd-border bg-white shadow-cd-sm">
        <div className="border-b border-cd-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-cd-text">Climate Performance vs Science-Based Targets</h2>
              <p className="mt-1 text-sm text-cd-muted">Aligned with SBTi 1.5°C pathway and Net-Zero Standard</p>
            </div>
            <Link
              to="/dashboard/emissions"
              className="flex items-center gap-1 rounded-md bg-cd-midnight px-4 py-2 text-sm font-medium text-white hover:bg-cd-cedar"
            >
              View Emissions Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Emissions vs Baseline */}
            <div>
              <h3 className="mb-4 font-semibold text-cd-text">Current Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <div className="text-sm text-gray-600">Total GHG Emissions</div>
                    <div className="mt-1 text-2xl font-bold text-cd-text">
                      {emissionsPerformance.current.total.toLocaleString()} 
                      <span className="ml-1 text-base font-normal text-gray-500">tCO₂e</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-600">
                        {Math.abs(emissionsPerformance.yearOverYear.change)}% vs {emissionsPerformance.baseline.year}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-cd-border p-3">
                    <div className="text-xs text-gray-500">Scope 1</div>
                    <div className="mt-1 font-semibold text-cd-text">{emissionsPerformance.current.scope1}</div>
                    <div className="text-xs text-gray-500">tCO₂e</div>
                  </div>
                  <div className="rounded-lg border border-cd-border p-3">
                    <div className="text-xs text-gray-500">Scope 2</div>
                    <div className="mt-1 font-semibold text-cd-text">{emissionsPerformance.current.scope2}</div>
                    <div className="text-xs text-gray-500">tCO₂e</div>
                  </div>
                  <div className="rounded-lg border border-cd-border p-3">
                    <div className="text-xs text-gray-500">Scope 3</div>
                    <div className="mt-1 font-semibold text-cd-text">{emissionsPerformance.current.scope3}</div>
                    <div className="text-xs text-gray-500">tCO₂e</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SBTi Targets Progress */}
            <div>
              <h3 className="mb-4 font-semibold text-cd-text">Progress vs SBTi Targets</h3>
              <div className="space-y-4">
                {/* Near-term 2030 Target */}
                <div className="rounded-lg border border-cd-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-cd-text">2030 Target (50% reduction)</div>
                      <div className="text-xs text-cd-muted">{emissionsPerformance.targets.nearTerm2030.aligned}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      On Track
                    </div>
                  </div>
                  <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${emissionsPerformance.targets.nearTerm2030.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{emissionsPerformance.targets.nearTerm2030.progress}% achieved</span>
                    <span>Target: {emissionsPerformance.targets.nearTerm2030.target} tCO₂e</span>
                  </div>
                </div>

                {/* Net-Zero 2050 Target */}
                <div className="rounded-lg border border-cd-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-cd-text">2050 Net-Zero (95% reduction)</div>
                      <div className="text-xs text-cd-muted">{emissionsPerformance.targets.netZero2050.aligned}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                      <Target className="h-4 w-4" />
                      On Track
                    </div>
                  </div>
                  <div className="mb-2 h-3 overflow-hidden rounded-full bg-gray-200">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${emissionsPerformance.targets.netZero2050.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{emissionsPerformance.targets.netZero2050.progress}% achieved</span>
                    <span>Target: {emissionsPerformance.targets.netZero2050.target} tCO₂e</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EU Compliance & Framework Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* EU Taxonomy & CSRD */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-cd-text">EU Compliance Status</h3>
          </div>

          <div className="space-y-4">
            {/* EU Taxonomy */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-gray-900">EU Taxonomy Alignment</div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                  Compliant
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600">Eligible Activities</div>
                  <div className="mt-1 text-2xl font-bold text-blue-600">{euCompliance.taxonomy.eligible}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Aligned Activities</div>
                  <div className="mt-1 text-2xl font-bold text-green-600">{euCompliance.taxonomy.aligned}%</div>
                </div>
              </div>
            </div>

            {/* CSRD/ESRS */}
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-semibold text-gray-900">CSRD Readiness</div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  euCompliance.csrd.status === 'on-track' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {euCompliance.csrd.progress}% Complete
                </span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-gray-200">
                <div 
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${euCompliance.csrd.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                First report due: January 1, 2026 (FY2025)
              </div>
            </div>

            {/* ESRS Pillars */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-cd-border p-2 text-center">
                <Leaf className="mx-auto h-5 w-5 text-green-600" />
                <div className="mt-1 text-xs text-gray-600">Environmental</div>
                <div className="font-semibold text-cd-text">{euCompliance.esrs.environmental}</div>
              </div>
              <div className="rounded-lg border border-cd-border p-2 text-center">
                <Users className="mx-auto h-5 w-5 text-blue-600" />
                <div className="mt-1 text-xs text-gray-600">Social</div>
                <div className="font-semibold text-cd-text">{euCompliance.esrs.social}</div>
              </div>
              <div className="rounded-lg border border-cd-border p-2 text-center">
                <Shield className="mx-auto h-5 w-5 text-purple-600" />
                <div className="mt-1 text-xs text-gray-600">Governance</div>
                <div className="font-semibold text-cd-text">{euCompliance.esrs.governance}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Framework Compliance Status */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-cd-midnight" />
            <h3 className="font-semibold text-cd-text">Framework Compliance</h3>
          </div>

          <div className="space-y-3">
            {frameworksStatus.map((framework) => (
              <div key={framework.id} className="rounded-lg border border-cd-border p-3 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-cd-text">{framework.name}</span>
                      {framework.mandatory && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-600">{framework.description}</p>
                    {framework.deadline && (
                      <p className="mt-1 text-xs text-gray-500">Deadline: {framework.deadline}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="font-semibold text-cd-text">{framework.progress}%</div>
                    <span className={`text-xs font-medium ${
                      framework.status === 'compliant' ? 'text-green-600' :
                      framework.status === 'on-track' ? 'text-blue-600' :
                      framework.status === 'in-progress' ? 'text-purple-600' : 'text-orange-600'
                    }`}>
                      {framework.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className={`h-full transition-all ${
                      framework.status === 'compliant' ? 'bg-green-500' :
                      framework.status === 'on-track' ? 'bg-blue-500' :
                      framework.status === 'in-progress' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${framework.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance vs EU Benchmarks */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-cd-midnight" />
          <h3 className="font-semibold text-cd-text">Performance vs EU Sector Benchmarks</h3>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Emissions Intensity */}
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-700">Emissions Intensity</div>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-green-600">{euBenchmarks.emissions.yourIntensity}</span>
              <span className="text-sm text-gray-600">tCO₂e/€M revenue</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Performance</span>
                <span className="font-semibold text-green-600">{euBenchmarks.emissions.yourIntensity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sector Average</span>
                <span className="text-gray-700">{euBenchmarks.emissions.sectorAverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top Quartile</span>
                <span className="text-gray-700">{euBenchmarks.emissions.topQuartile}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-4 w-4" />
              Above Average Performance
            </div>
          </div>

          {/* Renewable Energy */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-700">Renewable Energy Share</div>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{euBenchmarks.renewable.yourShare}%</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Performance</span>
                <span className="font-semibold text-blue-600">{euBenchmarks.renewable.yourShare}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EU 2030 Target</span>
                <span className="text-gray-700">{euBenchmarks.renewable.euTarget2030}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top Performers</span>
                <span className="text-gray-700">{euBenchmarks.renewable.topPerformers}%</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600">
              <CheckCircle className="h-4 w-4" />
              Exceeds EU 2030 Target
            </div>
          </div>

          {/* Gender Pay Gap */}
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-700">Gender Pay Gap</div>
            <div className="mb-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-purple-600">{euBenchmarks.social.genderPay}%</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Your Gap</span>
                <span className="font-semibold text-purple-600">{euBenchmarks.social.genderPay}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EU Average</span>
                <span className="text-gray-700">{euBenchmarks.social.euAverage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Best Practice</span>
                <span className="text-gray-700">{euBenchmarks.social.best}%</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-600">
              <Award className="h-4 w-4" />
              Excellent Performance
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <h2 className="mb-4 text-lg font-semibold text-cd-text">Recent ESG Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b border-cd-border pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium text-cd-text">{activity.action}</p>
                  <p className="text-sm text-cd-muted">{activity.category}</p>
                </div>
              </div>
              <span className="text-sm text-cd-muted">{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
