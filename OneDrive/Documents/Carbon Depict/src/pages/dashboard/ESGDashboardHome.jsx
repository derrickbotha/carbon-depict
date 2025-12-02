// Cache bust 2025-10-23
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Users,
  Shield,
  Target,
  FileText,
  AlertCircle,
  ChevronRight,
  Globe,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import esgDataManager from '../../utils/esgDataManager';

// --- Custom Hook for Dashboard Logic ---
const useESGDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState('year');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      setData({
        netZero: {
          targetYear: 2050,
          currentProgress: 35, // % reduction from baseline
          baselineEmissions: 50000,
          currentEmissions: 32500,
          yoyReduction: 12.5,
        },
        pillars: {
          environmental: { status: 'on-track', score: 78, trend: [65, 68, 70, 72, 75, 78, 76, 79, 82, 80, 78, 78] },
          social: { status: 'watch', score: 65, trend: [60, 62, 61, 63, 64, 65, 65, 64, 63, 64, 65, 65] },
          governance: { status: 'on-track', score: 85, trend: [80, 81, 82, 83, 84, 84, 85, 85, 86, 85, 85, 85] },
        },
        emissions: [
          { name: 'Jan', scope1: 4000, scope2: 2400, scope3: 2400 },
          { name: 'Feb', scope1: 3000, scope2: 1398, scope3: 2210 },
          { name: 'Mar', scope1: 2000, scope2: 9800, scope3: 2290 },
          { name: 'Apr', scope1: 2780, scope2: 3908, scope3: 2000 },
          { name: 'May', scope1: 1890, scope2: 4800, scope3: 2181 },
          { name: 'Jun', scope1: 2390, scope2: 3800, scope3: 2500 },
        ],
        targets: [
          { id: 1, name: '50% Reduction by 2030', progress: 15, status: 'on-track' },
          { id: 2, name: '100% Renewable Energy', progress: 60, status: 'watch' },
        ],
        compliance: [
          { name: 'CSRD', progress: 80, deadline: '2025-01-01' },
          { name: 'SBTi', progress: 45, deadline: '2024-12-31' },
          { name: 'CDP', progress: 100, deadline: '2024-07-31' },
        ],
        tasks: [
          { id: 1, title: 'Upload Q3 Energy Bills', due: 'Today', priority: 'high' },
          { id: 2, title: 'Verify Employee Demographics', due: 'Tomorrow', priority: 'medium' },
        ]
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { loading, timeframe, setTimeframe, data };
};

// --- Main Component ---
export default function ESGDashboardHome() {
  const { loading, timeframe, setTimeframe, data } = useESGDashboard();

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-greenly-secondary min-h-screen">
      <Header timeframe={timeframe} setTimeframe={setTimeframe} />

      {/* Top Row: Strategic Goal & Pillar Snapshots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <StrategicGoalTracker data={data.netZero} />
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <PillarPerformanceSnapshot title="Environmental" data={data.pillars.environmental} icon={Leaf} color="greenly-primary" />
          <PillarPerformanceSnapshot title="Social" data={data.pillars.social} icon={Users} color="greenly-info" />
          <PillarPerformanceSnapshot title="Governance" data={data.pillars.governance} icon={Shield} color="greenly-accent" />
        </div>
      </div>

      {/* Middle Row: GHG Deep Dive & Priority Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <GHGDataDeepDive data={data.emissions} />
        </div>
        <div className="lg:col-span-4">
          <PriorityActionCenter targets={data.targets} tasks={data.tasks} />
        </div>
      </div>

      {/* Bottom Row: Regulatory Readiness */}
      <RegulatoryReadinessStatus compliance={data.compliance} />
    </div>
  );
}

// --- Sub-components ---

const Header = ({ timeframe, setTimeframe }) => (
  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center mb-2">
    <div>
      <h1 className="text-2xl font-bold text-greenly-charcoal sm:text-3xl">ESG Dashboard</h1>
      <p className="mt-1 text-sm text-greenly-slate">Track your journey to Net Zero and compliance readiness.</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="appearance-none bg-white border border-greenly-light text-greenly-charcoal py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-greenly-primary focus:border-transparent text-sm font-medium shadow-sm"
        >
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-greenly-slate" />
      </div>
      <Link to="/dashboard/esg/reports/generate" className="bg-greenly-primary hover:bg-greenly-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Generate Report
      </Link>
    </div>
  </div>
);

const StrategicGoalTracker = ({ data }) => {
  const chartData = [
    { name: 'Progress', value: data.currentProgress },
    { name: 'Remaining', value: 100 - data.currentProgress },
  ];
  const COLORS = ['#07393C', '#E5E7EB']; // greenly-primary, greenly-light

  return (
    <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-6 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-greenly-charcoal">Net Zero Progress</h3>
          <p className="text-sm text-greenly-slate">Target Year: {data.targetYear}</p>
        </div>
        <div className="bg-greenly-secondary p-2 rounded-lg">
          <Target className="w-5 h-5 text-greenly-primary" />
        </div>
      </div>

      <div className="flex items-center justify-center relative h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-greenly-charcoal">{data.currentProgress}%</span>
          <span className="text-xs text-greenly-slate uppercase tracking-wide">To Goal</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-greenly-light">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-greenly-slate">Current Emissions</p>
            <p className="font-semibold text-greenly-charcoal">{data.currentEmissions.toLocaleString()} tCO2e</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-greenly-slate">YoY Reduction</p>
            <p className="font-semibold text-greenly-accent flex items-center justify-end">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              {data.yoyReduction}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PillarPerformanceSnapshot = ({ title, data, icon: Icon, color }) => {
  const sparklineData = data.trend.map((val, i) => ({ i, val }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-greenly-success bg-green-50 border-greenly-success';
      case 'watch': return 'text-greenly-warning bg-yellow-50 border-greenly-warning';
      case 'risk': return 'text-greenly-alert bg-red-50 border-greenly-alert';
      default: return 'text-greenly-slate bg-gray-50 border-greenly-slate';
    }
  };

  const statusStyles = getStatusColor(data.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-5 flex flex-col h-full">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${color.replace('text-', 'bg-').replace('border-', 'bg-')} bg-opacity-10`}>
            <Icon className={`w-4 h-4 text-${color.replace('bg-', '')}`} />
          </div>
          <h3 className="font-semibold text-greenly-charcoal">{title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles}`}>
          {data.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="flex-1 flex items-end justify-between mt-2">
        <div>
          <p className="text-2xl font-bold text-greenly-charcoal">{data.score}</p>
          <p className="text-xs text-greenly-slate">Score</p>
        </div>
        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line type="monotone" dataKey="val" stroke="#07393C" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const GHGDataDeepDive = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-greenly-charcoal">GHG Emissions Deep Dive</h3>
          <p className="text-sm text-greenly-slate">Scope 1, 2, & 3 Breakdown (tCO2e)</p>
        </div>
        <button className="text-sm text-greenly-primary font-medium hover:underline flex items-center">
          View Methodology <AlertCircle className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="scope1" name="Scope 1" stackId="a" fill="#07393C" radius={[0, 0, 4, 4]} />
            <Bar dataKey="scope2" name="Scope 2" stackId="a" fill="#34A56F" radius={[0, 0, 0, 0]} />
            <Bar dataKey="scope3" name="Scope 3" stackId="a" fill="#BDF679" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PriorityActionCenter = ({ targets, tasks }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-greenly-charcoal mb-4">Priority Action Center</h3>

      <div className="space-y-6 flex-1">
        {/* Active Targets Section */}
        <div>
          <h4 className="text-xs font-semibold text-greenly-slate uppercase tracking-wider mb-3">Active Targets</h4>
          <div className="space-y-3">
            {targets.map(target => (
              <div key={target.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-greenly-charcoal">{target.name}</span>
                  <span className="text-greenly-slate">{target.progress}%</span>
                </div>
                <div className="w-full bg-greenly-light rounded-full h-2">
                  <div
                    className="bg-greenly-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${target.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Required Actions Section */}
        <div>
          <h4 className="text-xs font-semibold text-greenly-slate uppercase tracking-wider mb-3">Required Actions</h4>
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-greenly-secondary rounded-lg border border-greenly-light hover:border-greenly-primary transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-greenly-alert' : 'bg-greenly-warning'}`} />
                  <span className="text-sm font-medium text-greenly-charcoal group-hover:text-greenly-primary">{task.title}</span>
                </div>
                <span className="text-xs text-greenly-slate bg-white px-2 py-1 rounded border border-greenly-light">
                  {task.due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link to="/dashboard/esg/data-entry" className="flex items-center justify-center gap-2 bg-greenly-primary hover:bg-greenly-primary-dark text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
          <Globe className="w-4 h-4" />
          Enter Data
        </Link>
        <Link to="/dashboard/esg/targets" className="flex items-center justify-center gap-2 bg-white border border-greenly-light hover:border-greenly-primary text-greenly-charcoal py-2.5 px-4 rounded-lg text-sm font-medium transition-colors">
          <Target className="w-4 h-4" />
          Set Target
        </Link>
      </div>
    </div>
  );
};

const RegulatoryReadinessStatus = ({ compliance }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-greenly-light p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-greenly-charcoal">Regulatory Readiness Status</h3>
        <Link to="/dashboard/esg/frameworks" className="text-sm text-greenly-primary font-medium hover:underline flex items-center">
          View All Frameworks <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {compliance.map((item) => (
          <div key={item.name} className="border border-greenly-light rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-greenly-charcoal">{item.name}</h4>
              {item.progress === 100 ? (
                <CheckCircle className="w-5 h-5 text-greenly-success" />
              ) : (
                <Clock className="w-5 h-5 text-greenly-warning" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-greenly-slate">Completion</span>
                <span className="font-medium text-greenly-charcoal">{item.progress}%</span>
              </div>
              <div className="w-full bg-greenly-light rounded-full h-1.5 mb-3">
                <div
                  className={`h-1.5 rounded-full ${item.progress === 100 ? 'bg-greenly-success' : 'bg-greenly-primary'}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-greenly-light flex justify-between items-center text-xs">
              <span className="text-greenly-slate">Next Deadline</span>
              <span className="font-medium text-greenly-charcoal">{item.deadline}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="space-y-6 p-8 animate-pulse">
    <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4 h-64 bg-gray-200 rounded-xl"></div>
      <div className="col-span-8 grid grid-cols-3 gap-4">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-8 h-80 bg-gray-200 rounded-xl"></div>
      <div className="col-span-4 h-80 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);
