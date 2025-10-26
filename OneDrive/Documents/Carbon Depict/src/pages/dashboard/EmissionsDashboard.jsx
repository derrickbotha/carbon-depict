// Cache bust 2025-10-25
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Factory, Zap, Globe, Loader2 } from '@atoms/Icon'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js'
import { Pie, Bar, Line } from 'react-chartjs-2'
import { enterpriseAPI } from '../../services/enterpriseAPI'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement)

export default function EmissionsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [emissionsData, setEmissionsData] = useState({
    totalEmissions: 0,
    scope1Emissions: 0,
    scope2Emissions: 0,
    scope3Emissions: 0,
    scope1Progress: 0,
    scope2Progress: 0,
    scope3Progress: 0,
    trends: [],
    categoryBreakdown: []
  })
  const [error, setError] = useState(null)

  // Load emissions data from API
  useEffect(() => {
    const loadEmissionsData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const currentYear = new Date().getFullYear().toString()
        
        // Get emissions data directly
        const emissionsResponse = await enterpriseAPI.emissions.getAll({ 
          reportingPeriod: currentYear,
          limit: 1000
        })
        
        if (emissionsResponse.data.success) {
          const emissions = emissionsResponse.data.data
          
          // Calculate totals by scope and round to 2 decimal places
          const scope1Emissions = parseFloat(emissions.filter(e => e.scope === 'scope1').reduce((sum, e) => sum + (e.co2e || 0), 0).toFixed(2))
          const scope2Emissions = parseFloat(emissions.filter(e => e.scope === 'scope2').reduce((sum, e) => sum + (e.co2e || 0), 0).toFixed(2))
          const scope3Emissions = parseFloat(emissions.filter(e => e.scope === 'scope3').reduce((sum, e) => sum + (e.co2e || 0), 0).toFixed(2))
          const totalEmissions = parseFloat((scope1Emissions + scope2Emissions + scope3Emissions).toFixed(2))
          
          setEmissionsData({
            totalEmissions,
            scope1Emissions,
            scope2Emissions,
            scope3Emissions,
            scope1Progress: calculateProgress(emissions.filter(e => e.scope === 'scope1').length, 29), // 29 total fields in Scope 1
            scope2Progress: calculateProgress(emissions.filter(e => e.scope === 'scope2').length, 16), // 16 total fields in Scope 2
            scope3Progress: calculateProgress(emissions.filter(e => e.scope === 'scope3').length, 45), // 45 total fields in Scope 3
            trends: [],
            categoryBreakdown: []
          })
        }
        
        // Get trends data
        try {
          const trendsResponse = await enterpriseAPI.emissions.getTrends({
            groupBy: 'month',
            startDate: `${currentYear}-01-01`,
            endDate: `${currentYear}-12-31`
          })
          
          if (trendsResponse.data.success) {
            setEmissionsData(prev => ({
              ...prev,
              trends: trendsResponse.data.data || []
            }))
          }
        } catch (trendsError) {
          console.warn('Could not load trends data:', trendsError)
        }
        
      } catch (error) {
        console.error('Error loading emissions data:', error)
        setError('Failed to load emissions data')
        
        // Set zero data on error
        setEmissionsData({
          totalEmissions: 0,
          scope1Emissions: 0,
          scope2Emissions: 0,
          scope3Emissions: 0,
          scope1Progress: 0,
          scope2Progress: 0,
          scope3Progress: 0,
          trends: [],
          categoryBreakdown: []
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEmissionsData()
    
    // Refresh data every 2 minutes to reduce API calls and prevent rate limiting
    const interval = setInterval(loadEmissionsData, 120000)
    
    return () => clearInterval(interval)
  }, [])

  // Calculate progress percentage
  const calculateProgress = (completedFields, totalFields) => {
    if (totalFields === 0) return 0
    return Math.min(Math.round((completedFields / totalFields) * 100), 100)
  }

  // Generate chart data based on real data
  const scopePieData = {
    labels: ['Scope 1: Direct', 'Scope 2: Energy', 'Scope 3: Indirect'],
    datasets: [
      {
        data: [
          emissionsData.scope1Emissions, 
          emissionsData.scope2Emissions, 
          emissionsData.scope3Emissions
        ],
        backgroundColor: ['#07393C', '#1B998B', '#A15E49'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2,
      },
    ],
  }

  // Generate monthly trend data
  const monthlyTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Scope 1',
        data: emissionsData.trends.map(t => t.scope1 || 0),
        borderColor: '#07393C',
        backgroundColor: 'rgba(7, 57, 60, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Scope 2',
        data: emissionsData.trends.map(t => t.scope2 || 0),
        borderColor: '#1B998B',
        backgroundColor: 'rgba(27, 153, 139, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Scope 3',
        data: emissionsData.trends.map(t => t.scope3 || 0),
        borderColor: '#A15E49',
        backgroundColor: 'rgba(161, 94, 73, 0.1)',
        tension: 0.4,
      },
    ],
  }

  // Generate category breakdown (placeholder for now)
  const categoryBreakdown = {
    labels: ['Stationary Combustion', 'Mobile Combustion', 'Process Emissions', 'Fugitive Emissions', 'Electricity', 'Transport', 'Waste'],
    datasets: [
      {
        label: 'Emissions (kgCO₂e)',
        data: [0, 0, 0, 0, 0, 0, 0], // Will be populated from real data
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
      emissions: emissionsData.scope1Emissions,
      progress: emissionsData.scope1Progress,
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
      emissions: emissionsData.scope2Emissions,
      progress: emissionsData.scope2Progress,
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
      emissions: emissionsData.scope3Emissions,
      progress: emissionsData.scope3Progress,
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

  // Show loading state
  if (isLoading) {
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
        
        {/* Loading State */}
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-cd-teal" />
            <span className="text-lg text-cd-muted">Loading emissions data...</span>
          </div>
        </div>
      </div>
    )
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
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Total Emissions */}
        <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
          <div className="mb-2 text-sm font-medium text-cd-muted">Total Emissions</div>
          <div className="mb-1 text-3xl font-bold text-cd-midnight">
            {emissionsData.totalEmissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            {emissionsData.totalEmissions > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-cd-teal" />
                <span className="text-cd-teal">Real-time data</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">No data yet</span>
              </>
            )}
          </div>
        </div>

        {/* Scope 1 */}
        <div className="rounded-lg border border-cd-midnight/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 1</div>
            <Factory className="h-5 w-5 text-cd-midnight" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-midnight">
            {emissionsData.scope1Emissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">
            {emissionsData.totalEmissions > 0 
              ? `${(emissionsData.scope1Emissions/emissionsData.totalEmissions*100).toFixed(1)}% of total`
              : '0% of total'
            }
          </div>
        </div>

        {/* Scope 2 */}
        <div className="rounded-lg border border-cd-teal/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 2</div>
            <Zap className="h-5 w-5 text-cd-teal" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-teal">
            {emissionsData.scope2Emissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">
            {emissionsData.totalEmissions > 0 
              ? `${(emissionsData.scope2Emissions/emissionsData.totalEmissions*100).toFixed(1)}% of total`
              : '0% of total'
            }
          </div>
        </div>

        {/* Scope 3 */}
        <div className="rounded-lg border border-cd-cedar/20 bg-white p-6 shadow-cd-sm">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-medium text-cd-muted">Scope 3</div>
            <Globe className="h-5 w-5 text-cd-cedar" />
          </div>
          <div className="mb-1 text-2xl font-bold text-cd-cedar">
            {emissionsData.scope3Emissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-cd-muted">kgCO₂e</div>
          <div className="mt-2 text-xs text-cd-muted">
            {emissionsData.totalEmissions > 0 
              ? `${(emissionsData.scope3Emissions/emissionsData.totalEmissions*100).toFixed(1)}% of total`
              : '0% of total'
            }
          </div>
        </div>
      </div>

      {/* No Data Message */}
      {emissionsData.totalEmissions === 0 && (
        <div className="rounded-lg border border-cd-teal/20 bg-cd-teal/5 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cd-teal/10">
            <Factory className="h-8 w-8 text-cd-teal" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-cd-midnight">No Emissions Data Yet</h3>
          <p className="mb-6 text-cd-muted">
            Start tracking your carbon footprint by entering data in the Scope 1, 2, and 3 forms below. 
            Your dashboard will update in real-time as you add emissions data.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/dashboard/emissions/scope1"
              className="rounded-lg bg-cd-midnight px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cd-midnight/90"
            >
              Start with Scope 1
            </Link>
            <Link
              to="/dashboard/emissions/scope2"
              className="rounded-lg border border-cd-teal bg-white px-6 py-3 text-sm font-medium text-cd-teal transition-colors hover:bg-cd-teal/5"
            >
              Add Scope 2 Data
            </Link>
          </div>
        </div>
      )}

      {/* Charts Row - Only show if there's data */}
      {emissionsData.totalEmissions > 0 && (
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
      )}

      {/* Monthly Trend Line Chart - Only show if there's data */}
      {emissionsData.totalEmissions > 0 && (
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
      )}

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
                    {card.emissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-base font-normal">kgCO₂e</span>
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
