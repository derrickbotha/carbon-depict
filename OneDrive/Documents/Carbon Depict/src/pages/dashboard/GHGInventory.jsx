import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  Globe,
  TrendingUp,
  Target,
  ChevronRight,
  LayoutGrid,
  ArrowRight,
} from 'lucide-react';

// --- MOCK DATA & HOOK ---
const useGHGInventoryData = () => {
  const [loading, setLoading] = useState(true);
  const [scopeData, setScopeData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScopeData({
        scope1: { emissions: 1250.75, progress: 85, sources: 4, trend: -5.2 },
        scope2: { emissions: 3450.2, progress: 95, sources: 2, trend: -2.1 },
        scope3: { emissions: 15200.5, progress: 40, sources: 8, trend: 12.5 },
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const summaryMetrics = useMemo(() => {
    if (!scopeData)
      return { totalEmissions: 0, overallProgress: 0, alignment: 'N/A' };
    const totalEmissions =
      scopeData.scope1.emissions +
      scopeData.scope2.emissions +
      scopeData.scope3.emissions;
    const overallProgress = Math.round(
      (scopeData.scope1.progress +
        scopeData.scope2.progress +
        scopeData.scope3.progress) /
        3
    );
    return {
      totalEmissions,
      overallProgress,
      alignment: 'SBTi 1.5°C Path',
    };
  }, [scopeData]);

  return { loading, scopeData, summaryMetrics };
};

// --- SUB-COMPONENTS ---

const Header = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-greenly-charcoal">
      GHG Emissions Inventory
    </h1>
    <p className="mt-1 text-base text-greenly-slate">
      Manage Scope 1, 2, and 3 emissions data.
    </p>
  </div>
);

const SummaryCard = ({ icon: Icon, title, value, unit, isLoading }) => (
  <div className="card flex-1 p-5">
    {isLoading ? (
      <div className="space-y-3">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
        <div className="h-8 w-1/2 rounded bg-gray-200 animate-pulse"></div>
      </div>
    ) : (
      <>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-greenly-primary/10 text-greenly-primary">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-greenly-slate">{title}</p>
        <p className="text-2xl font-bold text-greenly-charcoal">
          {value}
          {unit && (
            <span className="text-base font-medium text-greenly-slate">
              {' '}
              {unit}
            </span>
          )}
        </p>
      </>
    )}
  </div>
);

const ScopeCard = ({ scope, title, description, icon: Icon, data, link, isLoading }) => {
  if (isLoading) {
    return <div className="card h-[380px] animate-pulse bg-gray-200"></div>;
  }

  const trendColor = data.trend < 0 ? 'text-green-600' : 'text-red-500';

  return (
    <div className="card-interactive flex flex-col p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-greenly-charcoal">{title}</h3>
          <p className="mt-1 text-sm text-greenly-slate">{description}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-greenly-primary/10 text-greenly-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg bg-greenly-off-white p-3">
          <p className="text-greenly-slate">Emissions</p>
          <p className="text-xl font-semibold text-greenly-charcoal">
            {data.emissions.toLocaleString()}
            <span className="text-sm font-normal text-greenly-slate"> tCO₂e</span>
          </p>
        </div>
        <div className="rounded-lg bg-greenly-off-white p-3">
          <p className="text-greenly-slate">vs Last Period</p>
          <p className={`text-xl font-semibold ${trendColor}`}>
            {data.trend > 0 ? '+' : ''}
            {data.trend.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-4 flex-grow">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-greenly-slate">Completion</span>
          <span className="text-xs font-bold text-greenly-primary">
            {data.progress}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-greenly-light-gray">
          <div
            className="h-2 rounded-full bg-greenly-primary transition-all"
            style={{ width: `${data.progress}%` }}
          />
        </div>
      </div>

      <Link to={link} className="btn-primary mt-6 group">
        {data.progress < 100 ? 'Continue Data Entry' : 'View Details'}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

const EmptyInventoryState = () => (
  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-greenly-light-gray bg-white py-20 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-greenly-light-gray">
      <LayoutGrid className="h-8 w-8 text-greenly-primary" />
    </div>
    <h2 className="mt-6 text-xl font-semibold text-greenly-charcoal">
      No GHG Inventory Data
    </h2>
    <p className="mt-2 text-sm text-greenly-slate">
      It looks like you haven't started your GHG inventory yet.
      <br />
      Get started by adding data for any scope.
    </p>
    <Link to="/dashboard/esg-data-entry" className="btn-primary mt-6">
      Go to Data Hub
    </Link>
  </div>
);

// --- MAIN COMPONENT ---
const GHGInventory = () => {
  const { loading, scopeData, summaryMetrics } = useGHGInventoryData();

  if (!loading && !scopeData) {
    return <EmptyInventoryState />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Header />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <SummaryCard
          icon={TrendingUp}
          title="Total GHG Emissions"
          value={loading ? '...' : summaryMetrics.totalEmissions.toLocaleString()}
          unit="tCO₂e"
          isLoading={loading}
        />
        <SummaryCard
          icon={Target}
          title="Overall Progress"
          value={loading ? '...' : `${summaryMetrics.overallProgress}%`}
          isLoading={loading}
        />
        <SummaryCard
          icon={ChevronRight}
          title="Alignment"
          value={loading ? '...' : summaryMetrics.alignment}
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ScopeCard
          scope="scope1"
          title="Scope 1: Direct Emissions"
          description="Emissions from owned or controlled sources."
          icon={Flame}
          data={scopeData?.scope1}
          link="/dashboard/emissions/scope1"
          isLoading={loading}
        />
        <ScopeCard
          scope="scope2"
          title="Scope 2: Indirect Emissions"
          description="From purchased electricity, steam, heating, and cooling."
          icon={Zap}
          data={scopeData?.scope2}
          link="/dashboard/emissions/scope2"
          isLoading={loading}
        />
        <ScopeCard
          scope="scope3"
          title="Scope 3: Value Chain Emissions"
          description="All other indirect emissions in the value chain."
          icon={Globe}
          data={scopeData?.scope3}
          link="/dashboard/emissions/scope3"
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default GHGInventory;

