import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Factory, Zap, Globe } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

export default function EmissionsDashboard() {
  // Mock data - replace with actual API data
  const totalEmissions = 8542.6 // kgCO₂e
  const scope1Emissions = 3245.8
  const scope2Emissions = 2156.4
  const scope3Emissions = 3140.4
  
  const scope1Progress = 68 // % data collected
  const scope2Progress = 85
  const scope3Progress = 42

  const monthlyTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Scope 1',
        data: [2800, 2950, 3100, 3050, 3200, 3150, 3100, 3250, 3200, 3245],
        borderColor: '#07393C',
        backgroundColor: 'rgba(7, 57, 60, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Scope 2',
        data: [1900, 2000, 2100, 2050, 2150, 2100, 2080, 2120, 2140, 2156],
        borderColor: '#1B998B',
        backgroundColor: 'rgba(27, 153, 139, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Scope 3',
        data: [2500, 2650, 2800, 2900, 3000, 2950, 3050, 3100, 3120, 3140],
        borderColor: '#A15E49',
        backgroundColor: 'rgba(161, 94, 73, 0.1)',
        tension: 0.4,
      },
    ],
  }

  const scopePieData = {
    labels: ['Scope 1: Direct', 'Scope 2: Energy', 'Scope 3: Indirect'],
    datasets: [
      {
        data: [scope1Emissions, scope2Emissions, scope3Emissions],
        backgroundColor: ['#07393C', '#1B998B', '#A15E49'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  }

  const categoryBreakdown = {
    labels: ['Fuels', 'Electricity', 'Transport', 'Waste', 'Water', 'Refrigerants', 'Other'],
    datasets: [
      {
        label: 'Emissions (kgCO₂e)',
        data: [1850, 2156, 2340, 680, 420, 890, 206],
        backgroundColor: '#1B998B',
        borderColor: '#1B998B',
        borderWidth: 1,
      },
    ],
  }

  const scopeCards = [
    {
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'Emissions from sources owned or controlled by your organization',
      emissions: scope1Emissions,
      progress: scope1Progress,
      color: 'midnight',
      icon: Factory,
      route: '/dashboard/emissions/scope1',
      categories: [
        'Stationary Combustion',
        'Mobile Combustion',
        'Process Emissions',
        'Fugitive Emissions',
      ],
    },
    {
      scope: 'Scope 2',
      title: 'Energy Indirect',
      description: 'Emissions from purchased electricity, steam, heating, and cooling',
      emissions: scope2Emissions,
      progress: scope2Progress,
      color: 'teal',
      icon: Zap,
      route: '/dashboard/emissions/scope2',
      categories: [
        'Purchased Electricity',
        'Purchased Heat/Steam',
        'Purchased Cooling',
        'Renewable Energy',
      ],
    },
    {
      scope: 'Scope 3',
      title: 'Value Chain Indirect',
      description: 'All other indirect emissions in your value chain (upstream & downstream)',
      emissions: scope3Emissions,
      progress: scope3Progress,
      color: 'cedar',
      icon: Globe,
      route: '/dashboard/emissions/scope3',
      categories: [
        'Purchased Goods & Services',
        'Business Travel',
        'Employee Commuting',
        'Waste Disposal',
        'Transportation & Distribution',
        'Investments',
      ],
    },
  ]

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-cd-mint'
    if (progress >= 50) return 'bg-cd-teal'
    if (progress >= 25) return 'bg-cd-cedar'
    return 'bg-gray-300'
  }

  const getProgressTextColor = (progress) => {
    if (progress >= 80) return 'text-cd-mint'
    if (progress >= 50) return 'text-cd-teal'
    if (progress >= 25) return 'text-cd-cedar'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cd-border bg-white text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-midnight"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cd-text">Emissions Dashboard</h1>
            <p className="text-cd-muted">Track and analyze your carbon footprint across all scopes</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Total Emissions */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-2 text-sm font-medium text-cd-muted">Total Emissions</div>
          <div className="mb-1 text-3xl font-bold text-cd-midnight">
            {totalEmissions.toLocaleString()}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="text-green-600">-12% vs last month</span>
          </div>
        </div>

        {/* Scope 1 */}
        <div className="rounded-lg border border-cd-midnight/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 1</div>
            <Factory className="h-5 w-5 text-cd-midnight" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-midnight">
            {scope1Emissions.toLocaleString()}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">{(scope1Emissions/totalEmissions*100).toFixed(1)}% of total</div>
        </div>

        {/* Scope 2 */}
        <div className="rounded-lg border border-cd-teal/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 2</div>
            <Zap className="h-5 w-5 text-cd-teal" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-teal">
            {scope2Emissions.toLocaleString()}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">{(scope2Emissions/totalEmissions*100).toFixed(1)}% of total</div>
        </div>

        {/* Scope 3 */}
        <div className="rounded-lg border border-cd-cedar/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 3</div>
            <Globe className="h-5 w-5 text-cd-cedar" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-cedar">
            {scope3Emissions.toLocaleString()}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">{(scope3Emissions/totalEmissions*100).toFixed(1)}% of total</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Scope Distribution Pie Chart */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <h2 className="mb-4 text-lg font-semibold text-cd-text">Emissions by Scope</h2>
          <div className="mx-auto" style={{ maxWidth: '300px', maxHeight: '300px' }}>
            <Pie data={scopePieData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <h2 className="mb-4 text-lg font-semibold text-cd-text">Emissions by Category</h2>
          <Bar 
            data={categoryBreakdown} 
            options={{ 
              maintainAspectRatio: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, title: { display: true, text: 'kgCO₂e' } } }
            }} 
          />
        </div>
      </div>

      {/* Monthly Trend Line Chart */}
      <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
        <h2 className="mb-4 text-lg font-semibold text-cd-text">Monthly Emissions Trend</h2>
        <Line 
          data={monthlyTrend} 
          options={{ 
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } },
            scales: { 
              y: { 
                beginAtZero: true, 
                title: { display: true, text: 'kgCO₂e' } 
              },
              x: {
                title: { display: true, text: 'Month (2025)' }
              }
            }
          }} 
        />
      </div>

      {/* Scope Data Collection Cards */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-semibold text-cd-text">Data Collection by Scope</h2>
          <AlertCircle className="h-5 w-5 text-cd-muted" />
          <span className="text-sm text-cd-muted">Click to enter detailed emissions data</span>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {scopeCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.scope}
                to={card.route}
                className={`group rounded-lg border-2 border-cd-${card.color}/20 bg-white p-6 shadow-cd-sm transition-all duration-200 hover:border-cd-${card.color} hover:shadow-lg hover:-translate-y-1`}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`mb-1 text-sm font-semibold text-cd-${card.color}`}>
                      {card.scope}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-cd-text">{card.title}</h3>
                    <p className="text-sm text-cd-muted">{card.description}</p>
                  </div>
                  <div className={`rounded-lg bg-cd-${card.color}/10 p-3`}>
                    <Icon className={`h-6 w-6 text-cd-${card.color}`} />
                  </div>
                </div>

                {/* Emissions */}
                <div className="mb-4 rounded-lg bg-cd-surface p-4">
                  <div className="text-sm text-cd-muted">Current Emissions</div>
                  <div className={`text-2xl font-bold text-cd-${card.color}`}>
                    {card.emissions.toLocaleString()} <span className="text-base font-normal">kgCO₂e</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-cd-muted">Data Collection Progress</span>
                    <span className={`font-semibold ${getProgressTextColor(card.progress)}`}>
                      {card.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(card.progress)}`}
                      style={{ width: `${card.progress}%` }}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-4 border-t border-cd-border pt-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cd-muted">
                    Key Categories
                  </div>
                  <div className="space-y-1">
                    {card.categories.slice(0, 4).map((category, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-cd-muted">
                        <div className="h-1.5 w-1.5 rounded-full bg-cd-muted" />
                        <span>{category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t border-cd-border pt-4">
                  <div className="flex items-center justify-between text-sm font-medium text-cd-midnight group-hover:text-cd-teal">
                    <span>Click to enter data</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* DEFRA Info */}
      <div className="rounded-lg border border-cd-teal/20 bg-cd-teal/5 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-cd-teal" />
          <div>
            <div className="mb-1 font-semibold text-cd-midnight">DEFRA 2025 Emission Factors</div>
            <p className="text-sm text-cd-muted">
              All calculations use the latest UK Government DEFRA emission factors (2025) and follow 
              the GHG Protocol methodology for accurate, auditable carbon accounting. Data collection 
              forms are structured to match DEFRA categories for seamless reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
