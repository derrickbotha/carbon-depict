// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import {
  Users,
  Heart,
  GraduationCap,
  Shield,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react'
import SkeletonLoader from '@components/atoms/SkeletonLoader'

export default function SocialDashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({
        totalEmployees: 2847,
        womenLeadership: 42,
        trainingHours: 18450,
        safetyIncidents: 3,
        diversityScore: 78,
        kpis: [
          { name: 'Employee Turnover', value: '12.3%', trend: 'down', good: true },
          { name: 'Gender Pay Gap', value: '8.5%', trend: 'down', good: true },
          { name: 'Training Hours/Employee', value: '6.5', trend: 'up', good: true },
          { name: 'Lost Time Injury Rate', value: '0.3', trend: 'down', good: true },
        ],
        diversity: { gender: 48, age: [35, 40, 25], ethnic: 32 },
      })
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <Header />
      <SummaryCards metrics={metrics} isLoading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KpiList kpis={metrics?.kpis} isLoading={loading} />
        <DiversityBreakdown diversity={metrics?.diversity} isLoading={loading} />
      </div>
      <CategoryList />
    </div>
  )
}

const Header = () => (
  <div>
    <h1 className="text-3xl font-bold text-greenly-charcoal">Social Performance</h1>
    <p className="mt-1 text-greenly-gray">
      Track workforce, health & safety, diversity, and human rights metrics.
    </p>
  </div>
)

const SummaryCards = ({ metrics, isLoading }) => {
  const summaryData = [
    { title: 'Total Employees', value: metrics?.totalEmployees, icon: Users, color: 'blue' },
    { title: 'Women in Leadership', value: metrics?.womenLeadership, unit: '%', icon: Shield, color: 'purple' },
    { title: 'Training Hours', value: metrics?.trainingHours, icon: GraduationCap, color: 'green' },
    { title: 'Safety Incidents', value: metrics?.safetyIncidents, icon: Heart, color: 'red' },
    { title: 'Diversity Score', value: metrics?.diversityScore, unit: '/100', icon: TrendingUp, color: 'yellow' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {summaryData.map((item, i) => (
        <SummaryCard key={i} {...item} isLoading={isLoading} />
      ))}
    </div>
  )
}

const SummaryCard = ({ title, value, unit, icon: Icon, color, isLoading }) => (
  <div className="rounded-xl border border-greenly-light bg-white p-4 shadow-sm">
    {isLoading ? (
      <>
        <SkeletonLoader className="h-8 w-8 rounded-lg mb-3" />
        <SkeletonLoader className="h-4 w-3/4 mb-2" />
        <SkeletonLoader className="h-7 w-1/2" />
      </>
    ) : (
      <>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${color}-100 text-${color}-600 mb-3`}>
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-greenly-gray">{title}</p>
        <p className="text-2xl font-bold text-greenly-charcoal">
          {value?.toLocaleString()}
          {unit && <span className="text-sm font-medium text-greenly-gray">{unit}</span>}
        </p>
      </>
    )}
  </div>
)

const KpiList = ({ kpis, isLoading }) => (
  <div className="rounded-xl border border-greenly-light bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-greenly-charcoal mb-4">Key Performance Indicators</h2>
    <div className="space-y-4">
      {isLoading ? Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center">
          <SkeletonLoader className="h-4 w-1/3" />
          <SkeletonLoader className="h-5 w-1/4" />
        </div>
      )) : kpis.map((kpi, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-sm text-greenly-gray">{kpi.name}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-greenly-charcoal">{kpi.value}</span>
            <span className={`flex items-center text-xs font-bold ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const DiversityBreakdown = ({ diversity, isLoading }) => (
  <div className="rounded-xl border border-greenly-light bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-greenly-charcoal mb-4">Diversity Breakdown</h2>
    <div className="space-y-4">
      {isLoading ? Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <SkeletonLoader className="h-4 w-1/4" />
            <SkeletonLoader className="h-4 w-1/5" />
          </div>
          <SkeletonLoader className="h-2 w-full rounded-full" />
        </div>
      )) : (
        <>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-greenly-gray">Gender Diversity</span>
              <span className="font-medium text-greenly-charcoal">{diversity?.gender}% Women</span>
            </div>
            <div className="h-2 bg-greenly-light rounded-full">
              <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${diversity?.gender}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-greenly-gray">Age Diversity</span>
              <span className="font-medium text-greenly-charcoal">Balanced</span>
            </div>
            <div className="h-2 bg-greenly-light rounded-full flex">
              <div className="h-2 bg-blue-400" style={{ width: `${diversity?.age[0]}%` }} />
              <div className="h-2 bg-blue-500" style={{ width: `${diversity?.age[1]}%` }} />
              <div className="h-2 bg-blue-600" style={{ width: `${diversity?.age[2]}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-greenly-gray">Ethnic Diversity</span>
              <span className="font-medium text-greenly-charcoal">{diversity?.ethnic}% Minorities</span>
            </div>
            <div className="h-2 bg-greenly-light rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: `${diversity?.ethnic}%` }} />
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)

const CategoryList = () => {
  const categories = [
    { title: 'Workforce & Labor', items: ['Demographics', 'Turnover', 'Fair Compensation'] },
    { title: 'Health & Safety', items: ['Incident Reporting', 'Safety Training', 'Near-Miss Tracking'] },
    { title: 'Human Rights', items: ['Risk Assessments', 'Supply Chain Audits', 'Grievance Mechanisms'] },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map((cat, i) => (
        <div key={i} className="rounded-xl border border-greenly-light bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-greenly-charcoal mb-3">{cat.title}</h3>
          <ul className="space-y-2 text-sm text-greenly-gray">
            {cat.items.map((item, j) => (
              <li key={j} className="flex items-center">
                <ChevronRight className="h-4 w-4 text-greenly-primary mr-1" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

