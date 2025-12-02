// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import {
  Leaf,
  Droplets,
  Zap,
  Trash2,
  Recycle,
  TrendingDown,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

// --- MOCK DATA & HOOK ---
const useEnvironmentalData = () => {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({
        totalEmissions: 38450,
        emissionsChange: -12.3,
        renewableEnergy: 45,
        waterIntensity: 2.8,
        wasteRecycled: 68,
        biodiversityScore: 72,
        emissionsBreakdown: { scope1: 32, scope2: 22, scope3: 46 },
        energyMix: { renewable: 45, gas: 30, grid: 25 },
        resourceTrends: {
          water: { value: 45890, change: -8.5 },
          waste: { value: 2340, change: -12 },
          recycled: { value: 1590, change: 18 },
        },
      })
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return { loading, metrics }
}

// --- MAIN COMPONENT ---
export default function EnvironmentalDashboard() {
  const { loading, metrics } = useEnvironmentalData()

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <Header />
      <SummaryCards metrics={metrics} isLoading={loading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <BreakdownChart
            title="GHG Emissions by Scope"
            data={metrics?.emissionsBreakdown}
            isLoading={loading}
            colors={{ scope1: 'bg-greenly-red', scope2: 'bg-greenly-yellow', scope3: 'bg-greenly-primary' }}
            labels={{ scope1: 'Scope 1', scope2: 'Scope 2', scope3: 'Scope 3' }}
          />
          <BreakdownChart
            title="Energy Mix"
            data={metrics?.energyMix}
            isLoading={loading}
            colors={{ renewable: 'bg-greenly-primary', gas: 'bg-greenly-teal', grid: 'bg-greenly-slate' }}
            labels={{ renewable: 'Renewable', gas: 'Natural Gas', grid: 'Grid' }}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ResourceTrends trends={metrics?.resourceTrends} isLoading={loading} />
          <CategoryList />
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTS ---

const Header = () => (
  <div>
    <h1 className="text-2xl font-bold text-greenly-charcoal sm:text-3xl">Environmental Performance</h1>
    <p className="mt-1 text-sm text-greenly-slate sm:text-base">
      Track emissions, energy, water, waste, and biodiversity impacts.
    </p>
  </div>
)

const SummaryCards = ({ metrics, isLoading }) => {
  const summaryData = [
    { title: 'Total Emissions', value: metrics?.totalEmissions, unit: 'tCO₂e', icon: Leaf, color: 'greenly-primary' },
    { title: 'YoY Change', value: metrics?.emissionsChange, unit: '%', icon: TrendingDown, color: 'greenly-blue' },
    { title: 'Renewable Energy', value: metrics?.renewableEnergy, unit: '%', icon: Zap, color: 'greenly-yellow' },
    { title: 'Water Intensity', value: metrics?.waterIntensity, unit: 'm³/unit', icon: Droplets, color: 'greenly-cyan' },
    { title: 'Waste Recycled', value: metrics?.wasteRecycled, unit: '%', icon: Trash2, color: 'greenly-orange' },
    { title: 'Biodiversity Score', value: metrics?.biodiversityScore, unit: '/100', icon: Recycle, color: 'greenly-indigo' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {isLoading ? Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-36 animate-pulse bg-gray-200"></div>
      )) : summaryData.map((item, i) => (
        <SummaryCard key={i} {...item} />
      ))}
    </div>
  )
}

const SummaryCard = ({ title, value, unit, icon: Icon, color }) => (
  <div className="card">
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${color}/10 text-${color} mb-3`}>
      <Icon className="h-6 w-6" />
    </div>
    <p className="text-sm font-medium text-greenly-slate">{title}</p>
    <p className="text-2xl font-bold text-greenly-charcoal">
      {value?.toLocaleString()}
      <span className="text-sm font-medium text-greenly-slate">{unit}</span>
    </p>
  </div>
)

const BreakdownChart = ({ title, data, isLoading, colors, labels }) => (
  <div className="card p-6">
    <h2 className="text-lg font-semibold text-greenly-charcoal mb-4">{title}</h2>
    <div className="space-y-4">
      {isLoading ? Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-1/5 rounded bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      )) : Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-greenly-slate">{labels[key]}</span>
            <span className="font-medium text-greenly-charcoal">{value}%</span>
          </div>
          <div className="h-2 bg-greenly-light-gray rounded-full">
            <div className={`h-2 ${colors[key]} rounded-full`} style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ResourceTrends = ({ trends, isLoading }) => {
  const trendData = [
    { title: 'Water Withdrawal', value: trends?.water.value, unit: 'm³', change: trends?.water.change, color: 'greenly-blue' },
    { title: 'Waste Generated', value: trends?.waste.value, unit: 'tonnes', change: trends?.waste.change, color: 'greenly-orange' },
    { title: 'Materials Recycled', value: trends?.recycled.value, unit: 'tonnes', change: trends?.recycled.change, color: 'greenly-primary' },
  ]

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-greenly-charcoal mb-4">Resource Trends</h2>
      <div className="space-y-4">
        {isLoading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-lg bg-gray-200 animate-pulse h-20"></div>
        )) : trendData.map((item, i) => (
          <div key={i} className={`p-3 rounded-lg bg-${item.color}/10 border-l-4 border-${item.color}`}>
            <p className={`text-sm font-medium text-${item.color}`}>{item.title}</p>
            <p className={`text-xl font-bold text-greenly-charcoal`}>
              {item.value?.toLocaleString()} {item.unit}
            </p>
            <p className={`text-xs font-semibold flex items-center ${item.change >= 0 ? 'text-greenly-primary' : 'text-greenly-red'}`}>
              {item.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(item.change)}% vs last year
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

const CategoryList = () => {
  const categories = [
    { title: 'Climate Action', items: ['GHG Inventory', 'Reduction Targets', 'Renewable Energy'] },
    { title: 'Resource Management', items: ['Water Stewardship', 'Waste Reduction', 'Circular Economy'] },
    { title: 'Nature & Biodiversity', items: ['Land Use', 'Habitat Protection', 'Pollution Prevention'] },
  ]

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-greenly-charcoal mb-4">Focus Areas</h2>
      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={i}>
            <h3 className="font-semibold text-greenly-charcoal mb-2">{cat.title}</h3>
            <ul className="space-y-1 text-sm text-greenly-slate">
              {cat.items.map((item, j) => (
                <li key={j} className="flex items-center hover:text-greenly-primary transition-colors cursor-pointer">
                  <ChevronRight className="h-4 w-4 text-greenly-primary mr-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

