/**
 * Chart Helpers - Phase 4 Week 17: Data Visualization
 *
 * Utilities for preparing data for charts and visualizations
 */

/**
 * Format data for line chart
 */
export const formatLineChartData = (data, options = {}) => {
  const {
    xKey = 'period',
    yKeys = ['total'],
    labels = {},
    colors = {}
  } = options

  if (!data || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = data.map(item => item[xKey])

  const datasets = yKeys.map(key => ({
    label: labels[key] || key,
    data: data.map(item => item[key] || 0),
    borderColor: colors[key] || getRandomColor(),
    backgroundColor: `${colors[key] || getRandomColor()}33`,
    tension: 0.4,
    fill: true
  }))

  return { labels, datasets }
}

/**
 * Format data for bar chart
 */
export const formatBarChartData = (data, options = {}) => {
  const {
    labelKey = 'name',
    valueKey = 'value',
    colors = []
  } = options

  if (!data || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = data.map(item => item[labelKey] || item._id || 'Unknown')
  const values = data.map(item => item[valueKey] || item.total || 0)

  return {
    labels,
    datasets: [{
      label: 'Value',
      data: values,
      backgroundColor: colors.length > 0 ? colors : generateColorArray(values.length),
      borderWidth: 1
    }]
  }
}

/**
 * Format data for pie/doughnut chart
 */
export const formatPieChartData = (data, options = {}) => {
  const {
    labelKey = 'name',
    valueKey = 'value',
    colors = []
  } = options

  if (!data || data.length === 0) {
    return { labels: [], datasets: [] }
  }

  const labels = data.map(item => item[labelKey] || item._id || 'Unknown')
  const values = data.map(item => item[valueKey] || item.total || 0)

  return {
    labels,
    datasets: [{
      data: values,
      backgroundColor: colors.length > 0 ? colors : generateColorArray(values.length),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
}

/**
 * Format emissions by scope data
 */
export const formatEmissionsByScope = (data) => {
  const scopeOrder = ['scope1', 'scope2', 'scope3']
  const scopeColors = {
    scope1: '#ef4444',
    scope2: '#f59e0b',
    scope3: '#3b82f6'
  }
  const scopeLabels = {
    scope1: 'Scope 1 (Direct)',
    scope2: 'Scope 2 (Indirect Energy)',
    scope3: 'Scope 3 (Value Chain)'
  }

  const sortedData = scopeOrder.map(scope => {
    const found = data.find(item => item._id === scope)
    return found || { _id: scope, total: 0 }
  })

  return {
    labels: sortedData.map(item => scopeLabels[item._id] || item._id),
    datasets: [{
      data: sortedData.map(item => item.total || 0),
      backgroundColor: sortedData.map(item => scopeColors[item._id] || '#6b7280'),
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
}

/**
 * Format trend data with forecast
 */
export const formatTrendWithForecast = (trendData) => {
  const { historical = [], forecast = [] } = trendData

  const allData = [...historical, ...forecast]

  return {
    labels: allData.map(item => item.period),
    datasets: [
      {
        label: 'Historical',
        data: historical.map(item => item.total),
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f633',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Forecast',
        data: [
          ...new Array(historical.length - 1).fill(null),
          historical[historical.length - 1]?.total,
          ...forecast.map(item => item.total)
        ],
        borderColor: '#10b981',
        backgroundColor: '#10b98133',
        borderDash: [5, 5],
        tension: 0.4,
        fill: true
      }
    ]
  }
}

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (!previous || previous === 0) return 0

  const change = ((current - previous) / previous) * 100
  return Math.round(change * 100) / 100
}

/**
 * Format number with abbreviation (K, M, B)
 */
export const formatNumberAbbreviation = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0'

  const absNum = Math.abs(num)

  if (absNum >= 1e9) {
    return (num / 1e9).toFixed(decimals) + 'B'
  }
  if (absNum >= 1e6) {
    return (num / 1e6).toFixed(decimals) + 'M'
  }
  if (absNum >= 1e3) {
    return (num / 1e3).toFixed(decimals) + 'K'
  }

  return num.toFixed(decimals)
}

/**
 * Format CO2e with units
 */
export const formatCO2e = (value, unit = 'tCO2e') => {
  if (value === null || value === undefined) return `0 ${unit}`

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} Mt${unit.replace('t', '')}`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kt${unit.replace('t', '')}`
  }

  return `${value.toFixed(2)} ${unit}`
}

/**
 * Generate color array for charts
 */
export const generateColorArray = (count) => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
    '#6366f1'  // indigo
  ]

  if (count <= colors.length) {
    return colors.slice(0, count)
  }

  // Generate more colors if needed
  const generated = []
  for (let i = 0; i < count; i++) {
    generated.push(colors[i % colors.length])
  }

  return generated
}

/**
 * Get random color
 */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

/**
 * Format KPI data for display
 */
export const formatKPIData = (kpiData) => {
  return {
    emissionsReduction: {
      value: kpiData.emissionsReduction.rate,
      label: 'Emissions Reduction',
      unit: '%',
      status: kpiData.emissionsReduction.status,
      trend: kpiData.emissionsReduction.rate > 0 ? 'up' : 'down'
    },
    complianceRate: {
      value: kpiData.complianceRate.rate,
      label: 'Compliance Rate',
      unit: '%',
      status: kpiData.complianceRate.rate >= 80 ? 'good' : 'warning',
      trend: 'neutral'
    },
    dataQuality: {
      value: kpiData.dataQuality.score,
      label: 'Data Quality',
      unit: '/100',
      status: kpiData.dataQuality.score >= 70 ? 'good' : 'warning',
      trend: 'neutral'
    },
    reportingCompleteness: {
      value: kpiData.reportingCompleteness.overall,
      label: 'Reporting Completeness',
      unit: '%',
      status: kpiData.reportingCompleteness.overall >= 70 ? 'good' : 'warning',
      trend: 'neutral'
    }
  }
}

/**
 * Group data by time period
 */
export const groupByTimePeriod = (data, periodKey = 'date', groupBy = 'month') => {
  const grouped = {}

  data.forEach(item => {
    const date = new Date(item[periodKey])
    let key

    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0]
        break
      case 'week':
        const weekNum = getWeekNumber(date)
        key = `${date.getFullYear()}-W${weekNum}`
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        key = `${date.getFullYear()}-Q${quarter}`
        break
      case 'year':
        key = date.getFullYear().toString()
        break
      default:
        key = date.toISOString().split('T')[0]
    }

    if (!grouped[key]) {
      grouped[key] = []
    }

    grouped[key].push(item)
  })

  return grouped
}

/**
 * Get week number
 */
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

/**
 * Calculate moving average
 */
export const calculateMovingAverage = (data, window = 3) => {
  const result = []

  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(null)
    } else {
      const sum = data.slice(i - window + 1, i + 1).reduce((a, b) => a + b, 0)
      result.push(sum / window)
    }
  }

  return result
}

export default {
  formatLineChartData,
  formatBarChartData,
  formatPieChartData,
  formatEmissionsByScope,
  formatTrendWithForecast,
  calculatePercentageChange,
  formatNumberAbbreviation,
  formatCO2e,
  generateColorArray,
  getRandomColor,
  formatKPIData,
  groupByTimePeriod,
  calculateMovingAverage
}
