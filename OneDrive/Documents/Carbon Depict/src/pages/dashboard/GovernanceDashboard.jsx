// Cache bust 2025-10-23
import { Building2, Users2, Scale, AlertTriangle, CheckCircle2 } from '@atoms/Icon'

export default function GovernanceDashboard() {
  const metrics = {
    boardIndependence: 67,
    womenOnBoard: 40,
    ethicsTraining: 98,
    complianceViolations: 0,
    riskScore: 23
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cd-midnight">Governance Performance</h1>
        <p className="mt-2 text-cd-muted">
          Monitor board composition, ethics, compliance, and risk management
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Board Independence</p>
              <p className="text-2xl font-bold">{metrics.boardIndependence}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Users2 className="h-8 w-8 text-purple-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Women on Board</p>
              <p className="text-2xl font-bold">{metrics.womenOnBoard}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-green-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Ethics Training</p>
              <p className="text-2xl font-bold">{metrics.ethicsTraining}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-teal-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Violations</p>
              <p className="text-2xl font-bold">{metrics.complianceViolations}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Risk Score</p>
              <p className="text-2xl font-bold">{metrics.riskScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Board Composition */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">Board Composition</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Independent Directors</span>
                <span className="font-medium">8 of 12 (67%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '67%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Women Directors</span>
                <span className="font-medium">5 of 12 (40%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: '40%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Diverse Backgrounds</span>
                <span className="font-medium">4 of 12 (33%)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '33%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">Committee Structure</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Audit Committee</span>
              <span className="text-xs text-cd-muted">4 members</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Compensation Committee</span>
              <span className="text-xs text-cd-muted">3 members</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Risk Committee</span>
              <span className="text-xs text-cd-muted">4 members</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Sustainability Committee</span>
              <span className="text-xs text-cd-muted">3 members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Heatmap */}
      <div className="rounded-lg bg-white p-6 shadow-cd-sm">
        <h2 className="text-lg font-semibold text-cd-midnight mb-4">Risk Heatmap</h2>
        <div className="grid grid-cols-5 gap-2">
          {['Cyber Security', 'Regulatory', 'Climate', 'Supply Chain', 'Reputation'].map((risk, i) => (
            <div key={i} className="text-center">
              <div className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium ${
                i === 0 ? 'bg-red-100 text-red-700' :
                i === 1 ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {i === 0 ? 'High' : i === 1 ? 'Med' : 'Low'}
              </div>
              <p className="mt-2 text-xs text-cd-muted">{risk}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Ethics & Compliance</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Code of conduct</li>
            <li>• Anti-corruption policies</li>
            <li>• Whistleblower protection</li>
            <li>• Training completion</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Risk Management</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Risk identification</li>
            <li>• Mitigation strategies</li>
            <li>• Internal controls</li>
            <li>• Audit findings</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Stakeholder Engagement</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Investor relations</li>
            <li>• Community consultations</li>
            <li>• Employee feedback</li>
            <li>• Transparency reporting</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

