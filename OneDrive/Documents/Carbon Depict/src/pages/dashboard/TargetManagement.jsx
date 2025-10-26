// Cache bust 2025-10-23
import { Link } from 'react-router-dom'
import { Plus, Target, TrendingUp, Calendar, CheckCircle2 } from '@atoms/Icon'

export default function TargetManagement() {
  const targets = [
    {
      id: 1,
      name: 'Net-Zero by 2050',
      type: 'SBTi',
      baseline: '2020: 50,000 tCO2e',
      target: '2050: 5,000 tCO2e (90% reduction)',
      progress: 25,
      status: 'on-track',
      deadline: '2050-12-31'
    },
    {
      id: 2,
      name: 'Near-term Emissions Reduction',
      type: 'SBTi',
      baseline: '2020: 50,000 tCO2e',
      target: '2030: 27,500 tCO2e (45% reduction)',
      progress: 40,
      status: 'on-track',
      deadline: '2030-12-31'
    },
    {
      id: 3,
      name: '100% Renewable Energy',
      type: 'SDG 7',
      baseline: '2023: 35% renewable',
      target: '2030: 100% renewable',
      progress: 45,
      status: 'on-track',
      deadline: '2030-12-31'
    },
    {
      id: 4,
      name: 'Gender Equality in Leadership',
      type: 'SDG 5',
      baseline: '2023: 30% women',
      target: '2027: 50% women',
      progress: 38,
      status: 'at-risk',
      deadline: '2027-12-31'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cd-midnight">Target Management</h1>
          <p className="mt-2 text-cd-muted">
            Science-based targets and ESG goals aligned with SBTi, SDGs, and company strategy
          </p>
        </div>
        <Link
          to="/dashboard/esg/targets/create"
          className="flex items-center gap-2 rounded-lg bg-cd-teal px-4 py-2 text-white hover:bg-cd-teal/90"
        >
          <Plus className="h-5 w-5" />
          New Target
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-cd-muted">Total Targets</p>
              <p className="text-2xl font-bold">{targets.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-cd-muted">On Track</p>
              <p className="text-2xl font-bold">{targets.filter(t => t.status === 'on-track').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-cd-muted">At Risk</p>
              <p className="text-2xl font-bold">{targets.filter(t => t.status === 'at-risk').length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-cd-muted">Avg Progress</p>
              <p className="text-2xl font-bold">
                {Math.round(targets.reduce((sum, t) => sum + t.progress, 0) / targets.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Targets List */}
      <div className="space-y-4">
        {targets.map(target => (
          <div key={target.id} className="rounded-lg bg-white p-6 shadow-cd-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-cd-midnight">{target.name}</h3>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {target.type}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    target.status === 'on-track' 
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {target.status === 'on-track' ? 'On Track' : 'At Risk'}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <span className="text-cd-muted">Baseline:</span>
                    <span className="ml-2 font-medium text-cd-midnight">{target.baseline}</span>
                  </div>
                  <div>
                    <span className="text-cd-muted">Target:</span>
                    <span className="ml-2 font-medium text-cd-midnight">{target.target}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-cd-muted">Progress</span>
                    <span className="font-medium text-cd-midnight">{target.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full ${
                        target.status === 'on-track' ? 'bg-green-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: `${target.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

