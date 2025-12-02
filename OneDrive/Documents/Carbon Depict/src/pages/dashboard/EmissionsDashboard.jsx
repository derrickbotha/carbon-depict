// Cache bust 2025-11-05
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Factory, Zap, Globe } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// Custom Hook for Emissions Dashboard Logic
const useEmissionsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [emissionsData, setEmissionsData] = useState(null);

  const chartColors = {
    primary: '#07393C', // Midnight (greenly-primary)
    teal: '#1B998B', // Teal (greenly-teal)
    cedar: '#A15E49', // Cedar (greenly-cedar)
    mint: '#B5FFE1', // Mint (greenly-mint)
    light: '#E5E7EB',
    text: '#111827',
    white: '#ffffff',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setEmissionsData({
        totalEmissions: 8542.6,
        scope1Emissions: 3245.8,
        scope2Emissions: 2156.4,
        scope3Emissions: 3140.4,
        scope1Progress: 68,
        scope2Progress: 85,
        scope3Progress: 42,
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const monthlyTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Scope 1',
        data: [2800, 2950, 3100, 3050, 3200, 3150, 3100, 3250, 3200, 3245],
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}1A`,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
      },
      {
        label: 'Scope 2',
        data: [1900, 2000, 2100, 2050, 2150, 2100, 2080, 2120, 2140, 2156],
        borderColor: chartColors.teal,
        backgroundColor: `${chartColors.teal}1A`,
        tension: 0.4,
        pointBackgroundColor: chartColors.teal,
      },
      {
        label: 'Scope 3',
        data: [2500, 2650, 2800, 2900, 3000, 2950, 3050, 3100, 3120, 3140],
        borderColor: chartColors.cedar,
        backgroundColor: `${chartColors.cedar}1A`,
        tension: 0.4,
        pointBackgroundColor: chartColors.cedar,
      },
    ],
  };

  const scopePieData = {
    labels: ['Scope 1: Direct', 'Scope 2: Energy', 'Scope 3: Indirect'],
    datasets: [
      {
        data: [emissionsData?.scope1Emissions || 0, emissionsData?.scope2Emissions || 0, emissionsData?.scope3Emissions || 0],
        backgroundColor: [chartColors.primary, chartColors.teal, chartColors.cedar],
        borderColor: chartColors.white,
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const categoryBreakdown = {
    labels: ['Fuels', 'Electricity', 'Transport', 'Waste', 'Water', 'Refrigerants', 'Other'],
    datasets: [
      {
        label: 'Emissions (tCO₂e)',
        data: [1850, 2156, 2340, 680, 420, 890, 206].map(v => v / 1000), // Convert to tonnes
        backgroundColor: chartColors.teal,
        borderColor: chartColors.teal,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: "'Inter', sans-serif" },
          color: chartColors.text,
        },
      },
      tooltip: {
        backgroundColor: chartColors.white,
        titleColor: chartColors.text,
        bodyColor: chartColors.text,
        borderColor: chartColors.light,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        boxPadding: 3,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'tCO₂e',
          font: { family: "'Inter', sans-serif" },
          color: chartColors.text,
        },
        ticks: { font: { family: "'Inter', sans-serif" }, color: chartColors.text },
        grid: { color: chartColors.light },
      },
      x: {
        title: { display: false },
        ticks: { font: { family: "'Inter', sans-serif" }, color: chartColors.text },
        grid: { display: false },
      },
    },
  };

  const pieChartOptions = { ...chartOptions, scales: {} };
  const barChartOptions = { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } };
  const lineChartOptions = { ...chartOptions, plugins: { ...chartOptions.plugins, legend: { position: 'top' } } };

  return {
    loading,
    emissionsData,
    monthlyTrend,
    scopePieData,
    categoryBreakdown,
    pieChartOptions,
    barChartOptions,
    lineChartOptions,
  };
};

// --- Main Component ---
export default function EmissionsDashboard() {
  const {
    loading,
    emissionsData,
    monthlyTrend,
    scopePieData,
    categoryBreakdown,
    pieChartOptions,
    barChartOptions,
    lineChartOptions,
  } = useEmissionsDashboard();

  if (loading) return <EmissionsDashboardSkeleton />;

  if (!emissionsData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-greenly-midnight">No Emissions Data</h2>
          <p className="mt-2 text-sm text-greenly-slate">
            We couldn't find any emissions data. Start by collecting data for Scope 1, 2, or 3.
          </p>
          <Link to="/dashboard/emissions/scope1" className="btn-primary mt-4">
            Start Data Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-greenly-secondary min-h-screen">
      <Header />
      <SummaryGrid emissionsData={emissionsData} />
      <ChartsGrid
        scopePieData={scopePieData}
        pieChartOptions={pieChartOptions}
        categoryBreakdown={categoryBreakdown}
        barChartOptions={barChartOptions}
      />
      <ChartCard title="Monthly Emissions Trend" height="h-[350px]">
        <Line data={monthlyTrend} options={lineChartOptions} />
      </ChartCard>
      <DataCollectionGrid emissionsData={emissionsData} />
      <DefraInfo />
    </div>
  );
}

// --- Sub-components for cleaner structure ---

const Header = () => (
  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
    <div className="flex items-center gap-3">
      <Link to="/dashboard" className="p-2 rounded-full hover:bg-greenly-light transition-colors text-greenly-midnight">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-greenly-midnight">Emissions Dashboard</h1>
        <p className="text-sm text-greenly-slate">Track and analyze your carbon footprint across all scopes.</p>
      </div>
    </div>
  </div>
);

const SummaryGrid = ({ emissionsData }) => {
  const { totalEmissions, scope1Emissions, scope2Emissions, scope3Emissions } = emissionsData;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard title="Total Emissions" value={totalEmissions} unit="tCO₂e" trend="-12%" trendDirection="down" />
      <ScopeCard title="Scope 1" icon={Factory} value={scope1Emissions} total={totalEmissions} color="greenly-primary" />
      <ScopeCard title="Scope 2" icon={Zap} value={scope2Emissions} total={totalEmissions} color="greenly-teal" />
      <ScopeCard title="Scope 3" icon={Globe} value={scope3Emissions} total={totalEmissions} color="greenly-cedar" />
    </div>
  );
};

const ChartsGrid = ({ scopePieData, pieChartOptions, categoryBreakdown, barChartOptions }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <ChartCard title="Emissions by Scope">
      <Pie data={scopePieData} options={pieChartOptions} />
    </ChartCard>
    <ChartCard title="Emissions by Category">
      <Bar data={categoryBreakdown} options={barChartOptions} />
    </ChartCard>
  </div>
);

const DataCollectionGrid = ({ emissionsData }) => {
  const scopeCards = [
    {
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'From sources owned or controlled by your organization.',
      emissions: emissionsData.scope1Emissions,
      progress: emissionsData.scope1Progress,
      color: 'greenly-primary',
      icon: Factory,
      route: '/dashboard/emissions/scope1',
    },
    {
      scope: 'Scope 2',
      title: 'Energy Indirect',
      description: 'From purchased electricity, steam, heating, and cooling.',
      emissions: emissionsData.scope2Emissions,
      progress: emissionsData.scope2Progress,
      color: 'greenly-teal',
      icon: Zap,
      route: '/dashboard/emissions/scope2',
    },
    {
      scope: 'Scope 3',
      title: 'Value Chain Indirect',
      description: 'All other indirect emissions in your value chain.',
      emissions: emissionsData.scope3Emissions,
      progress: emissionsData.scope3Progress,
      color: 'greenly-cedar',
      icon: Globe,
      route: '/dashboard/emissions/scope3',
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-greenly-midnight">Data Collection by Scope</h2>
        <span className="text-sm text-greenly-slate">Click to enter detailed emissions data.</span>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scopeCards.map((card) => (
          <DataCollectionCard key={card.scope} {...card} />
        ))}
      </div>
    </div>
  );
};

const DefraInfo = () => (
  <div className="rounded-lg border border-greenly-light bg-greenly-off-white p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 flex-shrink-0 text-greenly-teal" />
      <div>
        <div className="font-semibold text-greenly-midnight">DEFRA 2025 Emission Factors</div>
        <p className="text-sm text-greenly-slate">
          All calculations use the latest UK Government DEFRA emission factors (2025) and follow the GHG Protocol methodology for accurate, auditable carbon accounting.
        </p>
      </div>
    </div>
  </div>
);

const SummaryCard = ({ title, value, unit, trend, trendDirection }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
    <div className="mb-2 text-sm font-medium text-greenly-slate">{title}</div>
    <div className="mb-1 text-3xl font-bold text-greenly-midnight">{(value / 1000).toFixed(1)}</div>
    <div className="text-sm text-greenly-slate">{unit}</div>
    <div className={`mt-4 flex items-center gap-2 text-sm ${trendDirection === 'down' ? 'text-greenly-success' : 'text-greenly-alert'}`}>
      {trendDirection === 'down' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
      <span>{trend} vs last month</span>
    </div>
  </div>
);

const ScopeCard = ({ title, icon: Icon, value, total, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
    <div className="mb-2 flex items-center justify-between">
      <div className="text-sm font-medium text-greenly-slate">{title}</div>
      <Icon className={`h-5 w-5 text-${color}`} />
    </div>
    <div className={`mb-1 text-2xl font-bold text-${color}`}>{(value / 1000).toFixed(1)}</div>
    <div className="text-sm text-greenly-slate">tCO₂e</div>
    <div className="mt-2 text-xs text-greenly-slate">{total > 0 ? ((value / total) * 100).toFixed(1) : 0}% of total</div>
  </div>
);

const ChartCard = ({ title, height = 'h-[300px]', children }) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-greenly-light">
    <h2 className="mb-4 text-lg font-semibold text-greenly-midnight">{title}</h2>
    <div className={height}>
      {children}
    </div>
  </div>
);

const DataCollectionCard = ({ scope, title, description, emissions, progress, color, icon: Icon, route }) => {
  const getProgressColor = (p) => {
    if (p >= 80) return 'bg-greenly-success';
    if (p >= 50) return 'bg-greenly-warning';
    return 'bg-greenly-alert';
  };

  return (
    <Link to={route} className="group flex flex-col bg-white p-6 rounded-2xl shadow-sm border-2 border-greenly-light hover:shadow-xl hover:border-greenly-teal hover:-translate-y-1 transition-all duration-300">
      <div className="flex-grow">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className={`mb-1 text-sm font-semibold text-${color}`}>{scope}</div>
            <h3 className="mb-2 text-lg font-bold text-greenly-midnight group-hover:text-greenly-teal transition-colors">{title}</h3>
            <p className="text-sm text-greenly-slate">{description}</p>
          </div>
          <div className={`rounded-xl bg-${color}/10 p-3 flex-shrink-0 ml-4 group-hover:bg-${color}/20 transition-colors`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
        </div>
        <div className="mb-4 rounded-xl bg-greenly-off-white p-4 border border-greenly-light">
          <div className="text-xs text-greenly-slate mb-1">Current Emissions</div>
          <div className={`text-xl font-bold text-${color}`}>
            {(emissions / 1000).toFixed(1)} <span className="text-base font-normal text-greenly-slate">tCO₂e</span>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-greenly-slate font-medium">Data Collection Progress</span>
            <span className={`font-semibold text-${color}`}>{progress}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-greenly-light">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="border-t border-greenly-light pt-4 mt-4">
        <div className="w-full text-center py-2.5 rounded-lg bg-greenly-teal/10 text-greenly-teal font-semibold text-sm group-hover:bg-greenly-teal group-hover:text-white transition-all">
          Enter Data
        </div>
      </div>
    </Link>
  );
};

const EmissionsDashboardSkeleton = () => (
  <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-greenly-secondary">
    {/* Header Skeleton */}
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
      <div>
        <div className="h-7 w-48 rounded bg-gray-200 mb-2"></div>
        <div className="h-4 w-64 rounded bg-gray-200"></div>
      </div>
    </div>
    {/* Summary Cards Skeleton */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-36 rounded-lg bg-gray-200"></div>
      ))}
    </div>
    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="h-80 rounded-lg bg-gray-200"></div>
      <div className="h-80 rounded-lg bg-gray-200"></div>
    </div>
    {/* Data Collection Skeleton */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-64 rounded-lg bg-gray-200"></div>
      ))}
    </div>
  </div>
);
