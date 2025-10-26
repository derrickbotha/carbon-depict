// Cache bust 2025-10-23
import { Users, Heart, GraduationCap, Shield, TrendingUp } from '@atoms/Icon'

export default function SocialDashboard() {
  const metrics = {
    totalEmployees: 2847,
    womenLeadership: 42,
    trainingHours: 18450,
    safetyIncidents: 3,
    diversityScore: 78
  }

  const kpis = [
    { name: 'Employee Turnover', value: '12.3%', trend: 'down', good: true },
    { name: 'Gender Pay Gap', value: '8.5%', trend: 'down', good: true },
    { name: 'Training Hours/Employee', value: '6.5', trend: 'up', good: true },
    { name: 'Lost Time Injury Rate', value: '0.3', trend: 'down', good: true },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cd-midnight">Social Performance</h1>
        <p className="mt-2 text-cd-muted">
          Track workforce, health & safety, diversity, and human rights metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Employees</p>
              <p className="text-2xl font-bold">{metrics.totalEmployees.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Women in Leadership</p>
              <p className="text-2xl font-bold">{metrics.womenLeadership}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-green-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Training Hours</p>
              <p className="text-2xl font-bold">{metrics.trainingHours.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Safety Incidents</p>
              <p className="text-2xl font-bold">{metrics.safetyIncidents}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-yellow-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Diversity Score</p>
              <p className="text-2xl font-bold">{metrics.diversityScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">Key Performance Indicators</h2>
          <div className="space-y-4">
            {kpis.map((kpi, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-cd-muted">{kpi.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-cd-midnight">{kpi.value}</span>
                  <span className={`text-xs ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">Diversity Breakdown</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Gender Diversity</span>
                <span className="font-medium">48% Women</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: '48%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Age Diversity</span>
                <span className="font-medium">Balanced</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-blue-400" style={{ width: '35%' }} />
                <div className="h-full bg-blue-500" style={{ width: '40%' }} />
                <div className="h-full bg-blue-600" style={{ width: '25%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Ethnic Diversity</span>
                <span className="font-medium">32% Minorities</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '32%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Workforce & Labor</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Employee demographics</li>
            <li>• Turnover & retention rates</li>
            <li>• Labor relations</li>
            <li>• Fair compensation</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Health & Safety</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Incident reporting</li>
            <li>• Lost time injury rate</li>
            <li>• Safety training compliance</li>
            <li>• Near-miss tracking</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Human Rights</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Risk assessments</li>
            <li>• Supply chain audits</li>
            <li>• Grievance mechanisms</li>
            <li>• Community impact</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

