import React, { useState, useEffect } from 'react';
import { Building2, Users2, Scale, ShieldCheck, AlertTriangle, CheckCircle2, Landmark, Users, Shield, GitBranch } from 'lucide-react';
import SkeletonLoader from '@components/atoms/SkeletonLoader';
import EmptyState from '@components/molecules/EmptyState';

// Mock data fetching
const useGovernanceData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        summary: {
          boardIndependence: 67,
          womenOnBoard: 40,
          ethicsTraining: 98,
          complianceViolations: 0,
          riskScore: 23,
        },
        boardComposition: [
          { label: 'Independent Directors', value: 67, count: '8 of 12' },
          { label: 'Women Directors', value: 40, count: '5 of 12' },
          { label: 'Diverse Backgrounds', value: 33, count: '4 of 12' },
        ],
        committees: [
          { name: 'Audit Committee', members: 4, icon: ShieldCheck },
          { name: 'Compensation Committee', members: 3, icon: Users },
          { name: 'Risk Committee', members: 4, icon: AlertTriangle },
          { name: 'Sustainability Committee', members: 3, icon: GitBranch },
        ],
        risks: [
          { name: 'Cyber Security', level: 'High', color: 'red' },
          { name: 'Regulatory', level: 'Medium', color: 'yellow' },
          { name: 'Climate', level: 'Low', color: 'green' },
          { name: 'Supply Chain', level: 'Low', color: 'green' },
          { name: 'Reputation', level: 'Medium', color: 'yellow' },
        ],
        categories: [
          { title: 'Ethics & Compliance', items: ['Code of conduct', 'Anti-corruption policies', 'Whistleblower protection', 'Training completion'] },
          { title: 'Risk Management', items: ['Risk identification', 'Mitigation strategies', 'Internal controls', 'Audit findings'] },
          { title: 'Stakeholder Engagement', items: ['Investor relations', 'Community consultations', 'Employee feedback', 'Transparency reporting'] },
        ]
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
};

const Header = () => (
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-greenly-charcoal">Governance Performance</h1>
    <p className="mt-2 text-lg text-greenly-slate">
      Monitor board composition, ethics, compliance, and risk management.
    </p>
  </div>
);

const SummaryCard = ({ icon: Icon, title, value, unit, color, loading }) => {
  if (loading) {
    return <SkeletonLoader className="h-28 w-full" />;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-4">
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          <Icon className={`h-7 w-7 text-${color}-600`} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-medium text-greenly-slate">{title}</p>
          <p className="text-3xl font-bold text-greenly-charcoal">
            {value}<span className="text-xl">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const BoardComposition = ({ data, loading }) => {
  if (loading) {
    return <SkeletonLoader className="h-64 w-full" />;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-greenly-charcoal mb-4">Board Composition</h2>
      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-greenly-slate font-medium">{item.label}</span>
              <span className="font-bold text-greenly-charcoal">{item.count}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-greenly-primary" style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommitteeStructure = ({ data, loading }) => {
  if (loading) {
    return <SkeletonLoader className="h-64 w-full" />;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-greenly-charcoal mb-4">Committee Structure</h2>
      <div className="space-y-3">
        {data.map((committee, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <committee.icon className="h-5 w-5 text-greenly-primary" />
              <span className="text-sm font-medium text-greenly-charcoal">{committee.name}</span>
            </div>
            <span className="text-xs text-greenly-slate font-semibold">{committee.members} members</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskHeatmap = ({ data, loading }) => {
  const colorClasses = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };
  if (loading) {
    return <SkeletonLoader className="h-48 w-full" />;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h2 className="text-xl font-semibold text-greenly-charcoal mb-4">Risk Heatmap</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {data.map((risk, i) => (
          <div key={i} className="text-center">
            <div className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold border-2 ${colorClasses[risk.level]}`}>
              {risk.level}
            </div>
            <p className="mt-2 text-xs text-greenly-slate font-medium">{risk.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryCard = ({ title, items, loading }) => {
  if (loading) {
    return <SkeletonLoader className="h-48 w-full" />;
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="font-semibold text-greenly-charcoal mb-4 text-lg">{title}</h3>
      <ul className="space-y-2 text-sm text-greenly-slate list-disc list-inside">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
};

export default function GovernanceDashboard() {
  const { data, loading } = useGovernanceData();

  const summaryMetrics = [
    { icon: Landmark, title: 'Board Independence', value: data?.summary.boardIndependence, unit: '%', color: 'blue' },
    { icon: Users2, title: 'Women on Board', value: data?.summary.womenOnBoard, unit: '%', color: 'purple' },
    { icon: Scale, title: 'Ethics Training', value: data?.summary.ethicsTraining, unit: '%', color: 'green' },
    { icon: CheckCircle2, title: 'Violations', value: data?.summary.complianceViolations, unit: '', color: 'teal' },
    { icon: AlertTriangle, title: 'Risk Score', value: data?.summary.riskScore, unit: '/100', color: 'yellow' },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-greenly-light-gray min-h-screen animate-pulse">
        <Header />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <SkeletonLoader className="h-64 w-full" />
          <SkeletonLoader className="h-64 w-full" />
        </div>
        <SkeletonLoader className="h-48 w-full mb-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }
  
  if (!data) {
    return <EmptyState title="No Governance Data Available" message="We couldn't retrieve the governance performance data. Please try again later." />;
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {summaryMetrics.map((metric, i) => <SummaryCard key={i} {...metric} loading={loading} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <BoardComposition data={data.boardComposition} loading={loading} />
        <CommitteeStructure data={data.committees} loading={loading} />
      </div>

      <div className="mb-8">
        <RiskHeatmap data={data.risks} loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {data.categories.map((cat, i) => <CategoryCard key={i} {...cat} loading={loading} />)}
      </div>
    </div>
  );
}

