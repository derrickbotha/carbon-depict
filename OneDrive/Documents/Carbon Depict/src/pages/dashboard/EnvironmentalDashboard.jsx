// Cache bust 2025-10-23
import { Leaf, Droplets, Zap, Trash2, TreePine, TrendingDown } from '@atoms/Icon'

export default function EnvironmentalDashboard() {
  const metrics = {
    totalEmissions: 38450,
    emissionsChange: -12.3,
    renewableEnergy: 45,
    waterIntensity: 2.8,
    wasteRecycled: 68,
    biodiversityScore: 72
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cd-midnight">Environmental Performance</h1>
        <p className="mt-2 text-cd-muted">
          Track emissions, energy, water, waste, and biodiversity impacts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-green-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Total Emissions</p>
              <p className="text-2xl font-bold">{metrics.totalEmissions.toLocaleString()}</p>
              <p className="text-xs text-cd-muted">tCO2e</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-8 w-8 text-blue-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">YoY Change</p>
              <p className="text-2xl font-bold text-green-600">{metrics.emissionsChange}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Renewable Energy</p>
              <p className="text-2xl font-bold">{metrics.renewableEnergy}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Droplets className="h-8 w-8 text-cyan-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Water Intensity</p>
              <p className="text-2xl font-bold">{metrics.waterIntensity}</p>
              <p className="text-xs text-cd-muted">m³/unit</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <Trash2 className="h-8 w-8 text-orange-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Waste Recycled</p>
              <p className="text-2xl font-bold">{metrics.wasteRecycled}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <div className="flex items-center gap-3">
            <TreePine className="h-8 w-8 text-emerald-600" strokeWidth={2} />
            <div>
              <p className="text-sm text-cd-muted">Biodiversity</p>
              <p className="text-2xl font-bold">{metrics.biodiversityScore}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emissions Breakdown */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">GHG Emissions by Scope</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Scope 1 (Direct)</span>
                <span className="font-medium">12,340 tCO2e (32%)</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: '32%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Scope 2 (Energy)</span>
                <span className="font-medium">8,560 tCO2e (22%)</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: '22%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Scope 3 (Value Chain)</span>
                <span className="font-medium">17,550 tCO2e (46%)</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: '46%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h2 className="text-lg font-semibold text-cd-midnight mb-4">Energy Mix</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Renewable (Solar, Wind)</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Natural Gas</span>
                <span className="font-medium">30%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-cd-muted">Grid Electricity</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Consumption */}
      <div className="rounded-lg bg-white p-6 shadow-cd-sm">
        <h2 className="text-lg font-semibold text-cd-midnight mb-4">Resource Consumption Trends</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">Water Withdrawal</p>
            <p className="text-2xl font-bold text-blue-600">45,890 m³</p>
            <p className="text-xs text-blue-700 mt-1">↓ 8.5% vs last year</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-900 font-medium mb-2">Waste Generated</p>
            <p className="text-2xl font-bold text-orange-600">2,340 tonnes</p>
            <p className="text-xs text-orange-700 mt-1">↓ 12% vs last year</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-900 font-medium mb-2">Materials Recycled</p>
            <p className="text-2xl font-bold text-green-600">1,590 tonnes</p>
            <p className="text-xs text-green-700 mt-1">↑ 18% vs last year</p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Climate Action</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• GHG inventory (Scope 1/2/3)</li>
            <li>• Carbon reduction targets</li>
            <li>• Renewable energy transition</li>
            <li>• Climate risk assessment</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Resource Management</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Water stewardship</li>
            <li>• Waste reduction</li>
            <li>• Circular economy</li>
            <li>• Material efficiency</li>
          </ul>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-cd-sm">
          <h3 className="font-semibold text-cd-midnight mb-3">Nature & Biodiversity</h3>
          <ul className="space-y-2 text-sm text-cd-muted">
            <li>• Land use impacts</li>
            <li>• Habitat protection</li>
            <li>• Pollution prevention</li>
            <li>• Ecosystem services</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

