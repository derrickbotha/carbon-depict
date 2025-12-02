// Cache bust 2025-10-23
import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Target, TrendingUp, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

// --- HOOK ---
const useTargetManagement = () => {
  const navigate = useNavigate();
  const targets = useMemo(() => [
    { id: 1, name: 'Net-Zero by 2050', type: 'SBTi', baseline: '2020: 50,000 tCO2e', target: '2050: 5,000 tCO2e (90% reduction)', progress: 25, status: 'on-track', deadline: '2050-12-31' },
    { id: 2, name: 'Near-term Emissions Reduction', type: 'SBTi', baseline: '2020: 50,000 tCO2e', target: '2030: 27,500 tCO2e (45% reduction)', progress: 40, status: 'on-track', deadline: '2030-12-31' },
    { id: 3, name: '100% Renewable Energy', type: 'SDG 7', baseline: '2023: 35% renewable', target: '2030: 100% renewable', progress: 45, status: 'on-track', deadline: '2030-12-31' },
    { id: 4, name: 'Gender Equality in Leadership', type: 'SDG 5', baseline: '2023: 30% women', target: '2027: 50% women', progress: 38, status: 'at-risk', deadline: '2027-12-31' },
  ], []);

  const stats = useMemo(() => {
    if (!targets || targets.length === 0) {
      return { total: 0, onTrack: 0, atRisk: 0, avgProgress: 0 };
    }
    return {
      total: targets.length,
      onTrack: targets.filter(t => t.status === 'on-track').length,
      atRisk: targets.filter(t => t.status === 'at-risk').length,
      avgProgress: Math.round(targets.reduce((sum, t) => sum + t.progress, 0) / targets.length),
    };
  }, [targets]);

  return {
    targets,
    stats,
    navigate,
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ onNewTarget }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-4xl font-bold text-greenly-charcoal">Target Management</h1>
      <p className="mt-2 text-lg text-greenly-slate">
        Track and manage your organization's sustainability goals.
      </p>
    </div>
    <Link
      to="/dashboard/target-creation"
      className="flex items-center gap-2 rounded-xl bg-greenly-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-greenly-primary/90 transition-all shadow-sm"
    >
      <Plus className="h-5 w-5" />
      New Target
    </Link>
  </div>
);

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full ${colorClass}`}>
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-greenly-slate">{label}</p>
      <p className="text-3xl font-bold text-greenly-charcoal">{value}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const isAtRisk = status === 'at-risk';
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold border ${
      isAtRisk 
        ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
        : 'bg-green-100 text-green-800 border-green-200'
    }`}>
      {isAtRisk ? 'At Risk' : 'On Track'}
    </span>
  );
};

const TargetCard = ({ target }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-greenly-primary/50 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-lg font-bold text-greenly-charcoal">{target.name}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200">
            {target.type}
          </span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-greenly-slate">Baseline:</span>
            <span className="ml-2 font-semibold text-greenly-charcoal">{target.baseline}</span>
          </div>
          <div>
            <span className="text-greenly-slate">Target:</span>
            <span className="ml-2 font-semibold text-greenly-charcoal">{target.target}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
        <StatusBadge status={target.status} />
        <button className="p-2 rounded-lg text-greenly-slate hover:bg-gray-100 hover:text-greenly-primary">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-greenly-slate">Progress</span>
        <span className="text-sm font-bold text-greenly-primary">{target.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${target.status === 'on-track' ? 'bg-greenly-primary' : 'bg-yellow-500'}`}
          style={{ width: `${target.progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export default function TargetManagement() {
  const { targets, stats, navigate } = useTargetManagement();

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header onNewTarget={() => navigate('/dashboard/target-creation')} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard icon={Target} label="Total Targets" value={stats.total} colorClass="bg-blue-100 text-blue-600" />
        <StatCard icon={CheckCircle2} label="On Track" value={stats.onTrack} colorClass="bg-green-100 text-green-600" />
        <StatCard icon={TrendingUp} label="At Risk" value={stats.atRisk} colorClass="bg-yellow-100 text-yellow-600" />
        <StatCard icon={Calendar} label="Avg. Progress" value={`${stats.avgProgress}%`} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="space-y-4">
        {targets.map(target => (
          <TargetCard key={target.id} target={target} />
        ))}
      </div>
    </div>
  );
}

