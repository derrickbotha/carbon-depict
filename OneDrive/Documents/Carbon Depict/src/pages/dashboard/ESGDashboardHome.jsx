// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf,
  Users,
  Shield,
  Target,
  TrendingUp,
  FileText,
  AlertCircle,
  Award,
  ChevronRight,
  BarChart3,
  Globe,
  User,
} from '@atoms/Icon'
import esgDataManager from '../../utils/esgDataManager'

/**
 * ESG Dashboard Home
 * Overview of Environmental, Social, and Governance performance
 */
export default function ESGDashboardHome() {
  const [timeframe, setTimeframe] = useState('year') // month, quarter, year

  // Live data from esgDataManager
  const [scores, setScores] = useState(() => esgDataManager.getScores())

  // Refresh scores every 5 seconds to reflect real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setScores(esgDataManager.getScores())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const esgScore = {
    overall: Math.round(scores.overall),
    environmental: Math.round(scores.environmental),
    social: Math.round(scores.social),
    governance: Math.round(scores.governance),
    trend: '+5',
  }

  const frameworks = [
    { 
      name: 'GRI', 
      status: scores.frameworks.gri.progress > 0 ? 'active' : 'not-started', 
      progress: Math.round(scores.frameworks.gri.progress), 
      score: scores.frameworks.gri.score,
      color: 'teal' 
    },
    { 
      name: 'TCFD', 
      status: scores.frameworks.tcfd.progress > 0 ? 'active' : 'not-started', 
      progress: Math.round(scores.frameworks.tcfd.progress),
      score: scores.frameworks.tcfd.score, 
      color: 'mint' 
    },
    { 
      name: 'SBTi', 
      status: scores.frameworks.sbti.progress > 0 ? 'committed' : 'not-started', 
      progress: Math.round(scores.frameworks.sbti.progress),
      score: scores.frameworks.sbti.score, 
      color: 'cedar' 
    },
    { 
      name: 'CSRD', 
      status: scores.frameworks.csrd.progress > 0 ? 'in-progress' : 'not-started', 
      progress: Math.round(scores.frameworks.csrd.progress),
      score: scores.frameworks.csrd.score, 
      color: 'desert' 
    },
    { 
      name: 'CDP', 
      status: scores.frameworks.cdp.progress > 0 ? 'active' : 'not-started', 
      progress: Math.round(scores.frameworks.cdp.progress),
      score: scores.frameworks.cdp.score, 
      color: 'midnight' 
    },
  ]

  const metrics = {
    environmental: [
      { label: 'GHG Emissions', value: '12,450', unit: 'tCO2e', change: '-12%', positive: true },
      { label: 'Energy Consumption', value: '45,680', unit: 'MWh', change: '-8%', positive: true },
      { label: 'Water Use', value: '18,900', unit: 'm³', change: '+3%', positive: false },
      { label: 'Waste Recycled', value: '68', unit: '%', change: '+15%', positive: true },
    ],
    social: [
      { label: 'Employee Turnover', value: '12.5', unit: '%', change: '-2%', positive: true },
      { label: 'Women in Leadership', value: '42', unit: '%', change: '+5%', positive: true },
      { label: 'Training Hours', value: '35', unit: 'hrs/employee', change: '+18%', positive: true },
      { label: 'Safety Incidents', value: '0.8', unit: 'per 100 FTE', change: '-25%', positive: true },
    ],
    governance: [
      { label: 'Board Independence', value: '65', unit: '%', change: '+5%', positive: true },
      { label: 'Ethics Violations', value: '2', unit: 'cases', change: '0%', positive: true },
      { label: 'Supplier Audits', value: '85', unit: '%', change: '+10%', positive: true },
      { label: 'Data Breaches', value: '0', unit: 'incidents', change: '0%', positive: true },
    ],
  }

  const targets = [
    {
      id: 1,
      name: 'Net Zero by 2050',
      framework: 'SBTi',
      progress: 32,
      status: 'on-track',
      deadline: '2050',
    },
    {
      id: 2,
      name: 'Gender Parity (40-60%)',
      framework: 'Internal',
      progress: 68,
      status: 'on-track',
      deadline: '2025',
    },
    {
      id: 3,
      name: '100% Renewable Energy',
      framework: 'SDG 7',
      progress: 55,
      status: 'at-risk',
      deadline: '2030',
    },
    {
      id: 4,
      name: 'Zero Waste to Landfill',
      framework: 'Internal',
      progress: 72,
      status: 'on-track',
      deadline: '2027',
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: 'GRI Sustainability Report 2024',
      framework: 'GRI',
      date: '2025-03-15',
      status: 'published',
    },
    {
      id: 2,
      name: 'TCFD Climate Disclosure 2024',
      framework: 'TCFD',
      date: '2025-03-10',
      status: 'published',
    },
    {
      id: 3,
      name: 'CDP Climate Change Response',
      framework: 'CDP',
      date: '2025-04-01',
      status: 'draft',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight">ESG Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your Environmental, Social, and Governance performance
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cd-teal"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Link
            to="/dashboard/esg/reports/generate"
            className="px-4 py-2 bg-cd-midnight text-white rounded-lg hover:bg-cd-cedar transition"
          >
            Generate Report
          </Link>
        </div>
      </div>

      {/* ESG Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-cd-md border-l-4 border-cd-midnight">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Overall ESG Score</h3>
            <Award className="w-5 h-5 text-cd-midnight" />
          </div>
          <p className="text-3xl font-bold text-cd-midnight">{esgScore.overall}</p>
          <p className="text-sm text-cd-teal mt-1">
            {esgScore.trend} vs last period
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-cd-md border-l-4 border-cd-teal">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Environmental</h3>
            <Leaf className="w-5 h-5 text-cd-teal" />
          </div>
          <p className="text-3xl font-bold text-cd-midnight">{esgScore.environmental}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-cd-teal h-2 rounded-full"
              style={{ width: `${esgScore.environmental}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-cd-md border-l-4 border-cd-cedar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Social</h3>
            <Users className="w-5 h-5 text-cd-cedar" />
          </div>
          <p className="text-3xl font-bold text-cd-midnight">{esgScore.social}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-cd-cedar h-2 rounded-full"
              style={{ width: `${esgScore.social}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-cd-md border-l-4 border-cd-desert">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Governance</h3>
            <Shield className="w-5 h-5 text-cd-desert" />
          </div>
          <p className="text-3xl font-bold text-cd-midnight">{esgScore.governance}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-cd-desert h-2 rounded-full"
              style={{ width: `${esgScore.governance}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Frameworks Compliance */}
      <div className="bg-white p-6 rounded-lg shadow-cd-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cd-midnight">Framework Compliance</h2>
          <Link to="/dashboard/esg/frameworks" className="text-cd-teal hover:underline flex items-center">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {frameworks.map((framework) => (
            <Link
              key={framework.name}
              to={`/dashboard/esg/${framework.name.toLowerCase()}`}
              className="border border-gray-200 rounded-lg p-4 hover:border-cd-teal hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-cd-midnight group-hover:text-cd-teal transition-colors">
                  {framework.name}
                </h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    framework.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : framework.status === 'committed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {framework.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`bg-cd-${framework.color} h-2 rounded-full transition-all`}
                  style={{ width: `${framework.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">{framework.progress}% complete</p>
              <p className="text-xs text-cd-teal mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to enter data →
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Environmental Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-cd-md">
          <div className="flex items-center mb-4">
            <Leaf className="w-6 h-6 text-cd-teal mr-2" />
            <h2 className="text-lg font-semibold text-cd-midnight">Environmental</h2>
          </div>
          <div className="space-y-4">
            {metrics.environmental.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-semibold text-cd-midnight">
                    {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/esg/environmental"
            className="mt-4 block text-center text-cd-teal hover:underline"
          >
            View Environmental Dashboard →
          </Link>
        </div>

        {/* Social Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-cd-md">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-cd-cedar mr-2" />
            <h2 className="text-lg font-semibold text-cd-midnight">Social</h2>
          </div>
          <div className="space-y-4">
            {metrics.social.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-semibold text-cd-midnight">
                    {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/esg/social"
            className="mt-4 block text-center text-cd-teal hover:underline"
          >
            View Social Dashboard →
          </Link>
        </div>

        {/* Governance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-cd-md">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-cd-desert mr-2" />
            <h2 className="text-lg font-semibold text-cd-midnight">Governance</h2>
          </div>
          <div className="space-y-4">
            {metrics.governance.map((metric, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-lg font-semibold text-cd-midnight">
                    {metric.value} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
                  </p>
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.positive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/dashboard/esg/governance"
            className="mt-4 block text-center text-cd-teal hover:underline"
          >
            View Governance Dashboard →
          </Link>
        </div>
      </div>

      {/* Targets Progress */}
      <div className="bg-white p-6 rounded-lg shadow-cd-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Target className="w-6 h-6 text-cd-midnight mr-2" />
            <h2 className="text-xl font-semibold text-cd-midnight">Active Targets</h2>
          </div>
          <Link to="/dashboard/esg/targets" className="text-cd-teal hover:underline flex items-center">
            Manage Targets <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="space-y-4">
          {targets.map((target) => (
            <div key={target.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-cd-midnight">{target.name}</h3>
                  <p className="text-sm text-gray-600">
                    {target.framework} · Target: {target.deadline}
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    target.status === 'on-track'
                      ? 'bg-green-100 text-green-700'
                      : target.status === 'at-risk'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {target.status === 'on-track' ? 'On Track' : target.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      target.status === 'on-track'
                        ? 'bg-cd-teal'
                        : target.status === 'at-risk'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${target.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">{target.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-white p-6 rounded-lg shadow-cd-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-cd-midnight mr-2" />
              <h2 className="text-xl font-semibold text-cd-midnight">Recent Reports</h2>
            </div>
            <Link to="/dashboard/esg/reports" className="text-cd-teal hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className="flex-1">
                  <h3 className="font-medium text-cd-midnight">{report.name}</h3>
                  <p className="text-sm text-gray-600">
                    {report.framework} · {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    report.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-cd-md">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-6 h-6 text-cd-midnight mr-2" />
            <h2 className="text-xl font-semibold text-cd-midnight">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/dashboard/esg/data-entry"
              className="p-4 border-2 border-cd-teal rounded-lg hover:bg-cd-mint/10 transition text-center"
            >
              <Globe className="w-8 h-8 text-cd-teal mx-auto mb-2" />
              <p className="font-medium text-cd-midnight">Enter Data</p>
            </Link>
            <Link
              to="/dashboard/esg/materiality"
              className="p-4 border-2 border-cd-cedar rounded-lg hover:bg-cd-cedar/10 transition text-center"
            >
              <AlertCircle className="w-8 h-8 text-cd-cedar mx-auto mb-2" />
              <p className="font-medium text-cd-midnight">Materiality</p>
            </Link>
            <Link
              to="/dashboard/esg/targets/create"
              className="p-4 border-2 border-cd-desert rounded-lg hover:bg-cd-desert/10 transition text-center"
            >
              <Target className="w-8 h-8 text-cd-desert mx-auto mb-2" />
              <p className="font-medium text-cd-midnight">Set Target</p>
            </Link>
            <Link
              to="/dashboard/esg/reports/generate"
              className="p-4 border-2 border-cd-midnight rounded-lg hover:bg-cd-midnight/10 transition text-center"
            >
              <FileText className="w-8 h-8 text-cd-midnight mx-auto mb-2" />
              <p className="font-medium text-cd-midnight">Generate Report</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
