// Cache bust 2025-11-05
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Activity, Calendar, Target, AlertCircle, CheckCircle,
  Leaf, Users, Shield, ArrowRight, Award, Zap, Globe, FileText, Clock, ChevronRight
} from 'lucide-react';
import SkeletonLoader from '@components/atoms/SkeletonLoader';
import EmptyState from '@components/molecules/EmptyState';

// --- MOCK DATA & HOOK ---
const useExecutiveSummaryData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        scores: { environmental: 76, social: 82, governance: 88 },
        criticalActions: [
          { id: 1, title: 'CSRD Reporting Deadline Approaching', description: 'First report for FY2025 is due Jan 2026.', priority: 'critical', daysRemaining: 73, action: 'Complete ESRS Data', link: '/dashboard/esg/csrd' },
          { id: 2, title: 'Scope 3 Emissions Above Trend', description: 'Category 1 (Purchased Goods) emissions increased 3.4% MoM.', priority: 'high', impact: 'May affect SBTi target achievement.', action: 'Review Supplier Engagement', link: '/dashboard/emissions/scope3' },
        ],
        emissionsPerformance: { current: { scope1: 498.2, scope2: 374.8, scope3: 374.5, total: 1247.5 }, baseline: { year: 2019, total: 1850.0 }, targets: { nearTerm2030: { progress: 67.4 }, netZero2050: { progress: 32.6 } }, yearOverYear: { change: -12.5 } },
        euCompliance: { taxonomy: { eligible: 78, aligned: 45 }, csrd: { progress: 65 } },
        frameworksStatus: [
          { id: 'csrd', name: 'CSRD/ESRS', description: 'EU Corporate Sustainability Reporting Directive', progress: 65, status: 'on-track' },
          { id: 'taxonomy', name: 'EU Taxonomy', description: 'Sustainable Activities Classification', progress: 78, status: 'compliant' },
          { id: 'sbti', name: 'SBTi Targets', description: 'Science-Based Targets (1.5°C pathway)', progress: 67, status: 'on-track' },
          { id: 'gri', name: 'GRI Standards', description: 'Global Reporting Initiative 2021', progress: 90, status: 'compliant' },
        ],
        recentActivities: [
          { id: 1, action: 'CSRD data for ESRS E1 updated', category: 'Compliance', date: '2h ago', status: 'info' },
          { id: 2, action: 'SBTi validation submitted for near-term targets', category: 'Climate Action', date: '5h ago', status: 'success' },
          { id: 3, action: 'New water consumption data added for Q3', category: 'Data Entry', date: '1d ago', status: 'info' },
        ],
      });
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return { ...data, loading };
};

// --- SUB-COMPONENTS ---

const Header = ({ loading }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-greenly-midnight">Executive Summary</h1>
      <p className="mt-1 text-lg text-greenly-slate">A top-level overview of your organization's ESG performance.</p>
    </div>
    {loading ? <SkeletonLoader className="h-12 w-48 rounded-lg" /> : (
      <div className="text-right">
        <div className="text-sm font-medium text-greenly-slate">Reporting Period</div>
        <div className="font-semibold text-greenly-midnight text-lg">FY 2025 (YTD)</div>
      </div>
    )}
  </div>
);

const CriticalActions = ({ actions, loading }) => {
  if (loading) return <SkeletonLoader className="h-48 w-full rounded-lg" />;
  if (!actions || actions.length === 0) return null;

  return (
    <div className="bg-greenly-desert/20 border border-greenly-desert p-6 rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="h-6 w-6 text-greenly-warning" />
        <h2 className="text-xl font-bold text-greenly-midnight">Action Required</h2>
      </div>
      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-md shadow-sm gap-4 border border-greenly-light">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${action.priority === 'critical' ? 'bg-greenly-alert' : 'bg-greenly-warning'}`} />
                <h3 className="font-semibold text-greenly-midnight">{action.title}</h3>
                {action.daysRemaining && <span className="text-xs font-medium text-greenly-alert bg-red-50 px-2 py-0.5 rounded-full border border-red-100">{action.daysRemaining} days left</span>}
              </div>
              <p className="text-sm text-greenly-slate mt-1">{action.description}</p>
            </div>
            <Link to={action.link} className="flex items-center gap-2 px-4 py-2 bg-greenly-midnight text-white rounded-lg hover:bg-greenly-midnight/90 transition-colors text-sm font-medium">
              {action.action} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const EsgPillarCard = ({ pillar, score, icon: Icon, color, loading }) => {
  if (loading) return <SkeletonLoader className="h-48 w-full rounded-lg" />;

  const statusColor = score >= 85 ? 'text-greenly-success' : score >= 70 ? 'text-greenly-info' : 'text-greenly-warning';
  const progressColor = score >= 85 ? 'bg-greenly-success' : score >= 70 ? 'bg-greenly-info' : 'bg-greenly-warning';

  // Map old color names to new palette
  const iconBgColor = color === 'primary' ? 'bg-greenly-mint/30' : color === 'blue' ? 'bg-greenly-info/10' : 'bg-greenly-cedar/10';
  const iconColor = color === 'primary' ? 'text-greenly-midnight' : color === 'blue' ? 'text-greenly-info' : 'text-greenly-cedar';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light hover:shadow-md hover:border-greenly-teal transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${iconBgColor} p-3 rounded-full`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h3 className="text-xl font-bold text-greenly-midnight">{pillar}</h3>
        </div>
        <div className={`text-2xl font-bold ${statusColor}`}>{score}<span className="text-base text-greenly-slate">/100</span></div>
      </div>
      <div className="w-full bg-greenly-light rounded-full h-2 mb-4">
        <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <Link to={`/dashboard/esg/${pillar.toLowerCase()}`} className="flex items-center justify-end gap-2 text-sm font-semibold text-greenly-teal hover:underline">
        View Details <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

const ClimatePerformance = ({ data, loading }) => {
  if (loading) return <SkeletonLoader className="h-96 w-full rounded-lg" />;
  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-greenly-midnight">Climate Performance vs. SBTi</h2>
          <p className="text-sm text-greenly-slate mt-1">Aligned with SBTi 1.5°C pathway and Net-Zero Standard.</p>
        </div>
        <Link to="/dashboard/emissions" className="flex items-center gap-2 px-4 py-2 border border-greenly-light rounded-lg hover:bg-greenly-off-white transition-colors text-sm font-medium text-greenly-midnight">
          Emissions Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-greenly-off-white p-4 rounded-md border border-greenly-light">
          <h3 className="font-semibold text-greenly-midnight mb-3">Current Performance (YTD)</h3>
          <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-sm border border-greenly-light">
            <div>
              <p className="text-sm text-greenly-slate">Total GHG Emissions</p>
              <p className="text-3xl font-bold text-greenly-midnight">{data.current.total.toLocaleString()} <span className="text-base font-normal text-gray-500">tCO₂e</span></p>
              <div className="flex items-center gap-1 text-sm text-greenly-success font-semibold mt-1">
                <TrendingDown className="h-4 w-4" /> {Math.abs(data.yearOverYear.change)}% vs {data.baseline.year}
              </div>
            </div>
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-greenly-mint/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-greenly-teal" />
            </div>
          </div>
        </div>
        <div className="bg-greenly-off-white p-4 rounded-md space-y-4 border border-greenly-light">
          <h3 className="font-semibold text-greenly-midnight">SBTi Target Progress</h3>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-sm text-greenly-midnight">2030 Target (1.5°C)</p>
              <p className="text-xs font-bold text-greenly-teal">On Track</p>
            </div>
            <div className="w-full bg-greenly-light rounded-full h-2.5">
              <div className="bg-greenly-teal h-2.5 rounded-full" style={{ width: `${data.targets.nearTerm2030.progress}%` }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-greenly-slate">{data.targets.nearTerm2030.progress}% achieved</p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-sm text-greenly-midnight">2050 Net-Zero Target</p>
              <p className="text-xs font-bold text-greenly-info">On Track</p>
            </div>
            <div className="w-full bg-greenly-light rounded-full h-2.5">
              <div className="bg-greenly-info h-2.5 rounded-full" style={{ width: `${data.targets.netZero2050.progress}%` }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-greenly-slate">{data.targets.netZero2050.progress}% achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComplianceStatus = ({ frameworks, euCompliance, loading }) => {
  if (loading) return <SkeletonLoader className="h-80 w-full rounded-lg" />;
  if (!frameworks || !euCompliance) return null;

  const getStatusPill = (status) => {
    switch (status) {
      case 'compliant': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-greenly-mint/50 text-greenly-midnight border border-greenly-mint">Compliant</span>;
      case 'on-track': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-greenly-desert/50 text-greenly-warning border border-greenly-desert">On Track</span>;
      default: return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-greenly-alert border border-red-200">Action Needed</span>;
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-6 w-6 text-greenly-info" />
          <h2 className="text-xl font-bold text-greenly-midnight">EU Compliance</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-greenly-info/10 p-4 rounded-md border border-greenly-info/20">
            <h3 className="font-semibold text-greenly-midnight mb-2">EU Taxonomy Alignment</h3>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-3xl font-bold text-greenly-info">{euCompliance.taxonomy.eligible}%</p>
                <p className="text-sm text-greenly-slate">Eligible</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-greenly-teal">{euCompliance.taxonomy.aligned}%</p>
                <p className="text-sm text-greenly-slate">Aligned</p>
              </div>
            </div>
          </div>
          <div className="bg-greenly-cedar/10 p-4 rounded-md border border-greenly-cedar/20">
            <h3 className="font-semibold text-greenly-midnight mb-2">CSRD Readiness</h3>
            <div className="w-full bg-greenly-light rounded-full h-2.5">
              <div className="bg-greenly-cedar h-2.5 rounded-full" style={{ width: `${euCompliance.csrd.progress}%` }}></div>
            </div>
            <p className="text-xs text-right mt-1 text-greenly-slate">{euCompliance.csrd.progress}% complete</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-greenly-midnight" />
          <h2 className="text-xl font-bold text-greenly-midnight">Frameworks Status</h2>
        </div>
        <div className="space-y-3">
          {frameworks.map(fw => (
            <div key={fw.id} className="flex items-center justify-between p-3 rounded-md hover:bg-greenly-off-white border border-transparent hover:border-greenly-light transition-colors">
              <div>
                <p className="font-semibold text-greenly-midnight">{fw.name}</p>
                <p className="text-xs text-greenly-slate">{fw.description}</p>
              </div>
              {getStatusPill(fw.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ activities, loading }) => {
  if (loading) return <SkeletonLoader className="h-48 w-full rounded-lg" />;
  if (!activities) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-greenly-light">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-greenly-midnight" />
        <h2 className="text-xl font-bold text-greenly-midnight">Recent Activity</h2>
      </div>
      <ul className="space-y-3">
        {activities.map(act => (
          <li key={act.id} className="flex items-center justify-between pb-3 border-b border-greenly-light last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${act.status === 'success' ? 'bg-greenly-success' : 'bg-greenly-info'}`}></div>
              <div>
                <p className="font-medium text-greenly-midnight">{act.action}</p>
                <p className="text-sm text-greenly-slate">{act.category}</p>
              </div>
            </div>
            <p className="text-sm text-greenly-slate">{act.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function DashboardHome() {
  const { loading, scores, criticalActions, emissionsPerformance, euCompliance, frameworksStatus, recentActivities } = useExecutiveSummaryData();

  if (loading) {
    return (
      <div className="p-6 bg-greenly-secondary min-h-screen animate-pulse">
        <Header loading={true} />
        <SkeletonLoader className="h-48 w-full mb-6 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <SkeletonLoader className="h-48 w-full rounded-lg" />
          <SkeletonLoader className="h-48 w-full rounded-lg" />
          <SkeletonLoader className="h-48 w-full rounded-lg" />
        </div>
        <SkeletonLoader className="h-96 w-full mb-6 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader className="h-80 w-full rounded-lg" />
          <SkeletonLoader className="h-80 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!scores) {
    return <EmptyState title="Could not load summary data" message="There was an issue fetching the executive summary. Please try again later." />;
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-secondary min-h-screen space-y-6">
      <Header loading={loading} />
      <CriticalActions actions={criticalActions} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <EsgPillarCard pillar="Environmental" score={scores.environmental} icon={Leaf} color="primary" loading={loading} />
        <EsgPillarCard pillar="Social" score={scores.social} icon={Users} color="blue" loading={loading} />
        <EsgPillarCard pillar="Governance" score={scores.governance} icon={Shield} color="purple" loading={loading} />
      </div>

      <ClimatePerformance data={emissionsPerformance} loading={loading} />
      <ComplianceStatus frameworks={frameworksStatus} euCompliance={euCompliance} loading={loading} />
      <RecentActivity activities={recentActivities} loading={loading} />
    </div>
  );
}
