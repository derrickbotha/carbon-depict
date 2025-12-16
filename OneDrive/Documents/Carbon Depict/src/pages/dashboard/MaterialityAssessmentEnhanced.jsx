// Enhanced ESG Materiality Assessment - Comprehensive Stakeholder Engagement
// Implements best practices from GRI, SASB, TCFD, CSRD, CDP, and ISSB frameworks
// Integrated with ESG Data Collection Hub for completion tracking
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Share2, Save, Users, TrendingUp,
  AlertCircle, CheckCircle, Filter, Search, Plus, X,
  BarChart3, PieChart, FileText, Mail, MessageSquare,
  Building2, Leaf, Globe, Shield, Heart, DollarSign,
  ExternalLink, ClipboardList, Target, Edit, Loader
} from 'lucide-react';
import SkeletonLoader from '@components/atoms/SkeletonLoader';
import EmptyState from '@components/molecules/EmptyState';
import { useDedicatedModelForm } from '@hooks/useDedicatedModelForm';
import ExportButton from '@components/molecules/ExportButton';
import apiClient from '@utils/api';

// --- API INTEGRATION HOOK ---
const useEnhancedMaterialityData = () => {
  const [reportingPeriod] = useState(new Date().getFullYear().toString());
  const [assessmentYear] = useState(new Date().getFullYear().toString());

  // Use the dedicated model form hook
  const {
    data: assessments,
    loading: apiLoading,
    saving,
    error,
    createResource,
    updateResource,
    deleteResource,
    exportData,
    refetch
  } = useDedicatedModelForm('/api/materiality', reportingPeriod, false);

  // Local state for form data
  const [esgIssues, setEsgIssues] = useState([
    // Environmental
    { id: 1, name: 'Climate Change & GHG Emissions', category: 'Environmental', impactScore: 9, financialScore: 9, frameworks: ['GRI', 'CSRD', 'TCFD', 'CDP', 'SASB', 'ISSB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'High' },
    { id: 2, name: 'Energy Management', category: 'Environmental', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB', 'CDP'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'High' },
    { id: 3, name: 'Water & Effluents', category: 'Environmental', impactScore: 6, financialScore: 5, frameworks: ['GRI', 'CSRD', 'CDP'], stakeholderConcern: 'Medium', riskLevel: 'Medium', opportunityLevel: 'Medium' },
    { id: 4, name: 'Waste Management', category: 'Environmental', impactScore: 6, financialScore: 4, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'Medium' },
    { id: 5, name: 'Biodiversity & Ecosystems', category: 'Environmental', impactScore: 8, financialScore: 6, frameworks: ['GRI', 'CSRD', 'TCFD'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'Low' },
    { id: 6, name: 'Circular Economy', category: 'Environmental', impactScore: 7, financialScore: 7, frameworks: ['CSRD', 'GRI'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 7, name: 'Air Quality & Emissions', category: 'Environmental', impactScore: 6, financialScore: 5, frameworks: ['GRI', 'CSRD', 'CDP'], stakeholderConcern: 'Medium', riskLevel: 'Medium', opportunityLevel: 'Low' },
    // Social
    { id: 8, name: 'Labor Practices & Working Conditions', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 9, name: 'Diversity, Equity & Inclusion (DEI)', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'High' },
    { id: 10, name: 'Employee Health & Safety', category: 'Social', impactScore: 9, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 11, name: 'Human Rights', category: 'Social', impactScore: 9, financialScore: 6, frameworks: ['GRI', 'CSRD', 'ISSB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 12, name: 'Community Engagement & Investment', category: 'Social', impactScore: 7, financialScore: 5, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 13, name: 'Supply Chain Labor Standards', category: 'Social', impactScore: 8, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 14, name: 'Employee Training & Development', category: 'Social', impactScore: 6, financialScore: 6, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 15, name: 'Data Privacy & Security', category: 'Social', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    // Governance
    { id: 16, name: 'Board Composition & Independence', category: 'Governance', impactScore: 6, financialScore: 7, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'Medium' },
    { id: 17, name: 'Business Ethics & Anti-Corruption', category: 'Governance', impactScore: 8, financialScore: 8, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 18, name: 'ESG Governance Structure', category: 'Governance', impactScore: 7, financialScore: 7, frameworks: ['GRI', 'CSRD', 'TCFD', 'ISSB'], stakeholderConcern: 'High', riskLevel: 'Medium', opportunityLevel: 'High' },
    { id: 19, name: 'Risk Management', category: 'Governance', impactScore: 7, financialScore: 8, frameworks: ['GRI', 'CSRD', 'TCFD', 'ISSB'], stakeholderConcern: 'High', riskLevel: 'High', opportunityLevel: 'Medium' },
    { id: 20, name: 'Regulatory Compliance', category: 'Governance', impactScore: 7, financialScore: 9, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Critical', riskLevel: 'High', opportunityLevel: 'Low' },
    { id: 21, name: 'Stakeholder Engagement', category: 'Governance', impactScore: 6, financialScore: 6, frameworks: ['GRI', 'CSRD'], stakeholderConcern: 'High', riskLevel: 'Low', opportunityLevel: 'High' },
    { id: 22, name: 'Executive Compensation Linkage to ESG', category: 'Governance', impactScore: 5, financialScore: 6, frameworks: ['GRI', 'CSRD', 'SASB'], stakeholderConcern: 'Medium', riskLevel: 'Low', opportunityLevel: 'Medium' },
  ]);

  const [stakeholderGroups, setStakeholderGroups] = useState([
    { id: 1, name: 'Investors & Shareholders', type: 'External', size: 'Large', engagement: 'Quarterly', priority: 'Critical', contactCount: 45, lastEngagement: '2024-10-15' },
    { id: 2, name: 'Employees', type: 'Internal', size: 'Large', engagement: 'Monthly', priority: 'Critical', contactCount: 250, lastEngagement: '2024-10-20' },
    { id: 3, name: 'Board of Directors', type: 'Internal', size: 'Small', engagement: 'Monthly', priority: 'Critical', contactCount: 12, lastEngagement: '2024-10-18' },
    { id: 4, name: 'Customers', type: 'External', size: 'Large', engagement: 'Quarterly', priority: 'High', contactCount: 180, lastEngagement: '2024-09-30' },
    { id: 5, name: 'Suppliers', type: 'External', size: 'Medium', engagement: 'Bi-Annual', priority: 'High', contactCount: 65, lastEngagement: '2024-08-15' },
    { id: 6, name: 'Local Communities', type: 'External', size: 'Medium', engagement: 'Quarterly', priority: 'Medium', contactCount: 35, lastEngagement: '2024-10-10' },
    { id: 7, name: 'Regulators', type: 'External', size: 'Small', engagement: 'As-Needed', priority: 'Critical', contactCount: 8, lastEngagement: '2024-09-20' },
    { id: 8, name: 'NGOs & Advocacy Groups', type: 'External', size: 'Small', engagement: 'Quarterly', priority: 'Medium', contactCount: 15, lastEngagement: '2024-10-05' },
  ]);

  const [dataCollectionStatus, setDataCollectionStatus] = useState({
    // Environmental
    'Climate Change & GHG Emissions': { formId: 'env-ghg', status: 'completed', progress: 100, requiredFor: ['GRI 305', 'CSRD E1', 'TCFD Metrics', 'CDP C6-C7', 'SBTi'] },
    'Energy Management': { formId: 'env-energy', status: 'in-progress', progress: 65, requiredFor: ['GRI 302', 'CSRD E1', 'SDG 7'] },
    'Water & Effluents': { formId: 'env-water', status: 'in-progress', progress: 40, requiredFor: ['GRI 303', 'CDP W1-W11', 'CSRD E3'] },
    'Waste Management': { formId: 'env-waste', status: 'pending', progress: 0, requiredFor: ['GRI 306', 'CSRD E5'] },
    'Biodiversity & Ecosystems': { formId: 'env-biodiversity', status: 'pending', progress: 0, requiredFor: ['GRI 304', 'CSRD E4', 'TCFD'] },
    'Circular Economy': { formId: 'env-materials', status: 'pending', progress: 0, requiredFor: ['CSRD E5', 'GRI 301'] },
    'Air Quality & Emissions': { formId: 'env-ghg', status: 'completed', progress: 100, requiredFor: ['GRI 305', 'CSRD E1'] },
    // Social
    'Labor Practices & Working Conditions': { formId: 'soc-demographics', status: 'completed', progress: 100, requiredFor: ['GRI 401-403', 'CSRD S1', 'SASB'] },
    'Diversity, Equity & Inclusion (DEI)': { formId: 'soc-diversity', status: 'pending', progress: 0, requiredFor: ['GRI 405', 'CSRD S1', 'SASB', 'SDG 5'] },
    'Employee Health & Safety': { formId: 'soc-safety', status: 'in-progress', progress: 80, requiredFor: ['GRI 403', 'CSRD S1', 'SASB'] },
    'Human Rights': { formId: 'soc-demographics', status: 'completed', progress: 100, requiredFor: ['GRI 406-414', 'CSRD S2', 'ISSB'] },
    'Community Engagement & Investment': { formId: 'soc-training', status: 'in-progress', progress: 55, requiredFor: ['GRI 413', 'CSRD S3'] },
    'Supply Chain Labor Standards': { formId: 'soc-demographics', status: 'completed', progress: 100, requiredFor: ['GRI 414', 'CSRD S2', 'SASB'] },
    'Employee Training & Development': { formId: 'soc-training', status: 'in-progress', progress: 55, requiredFor: ['GRI 404', 'CSRD S1', 'SDG 4'] },
    'Data Privacy & Security': { formId: 'gov-risk', status: 'pending', progress: 0, requiredFor: ['GRI 418', 'CSRD S1', 'SASB'] },
    // Governance
    'Board Composition & Independence': { formId: 'gov-board', status: 'completed', progress: 100, requiredFor: ['GRI 405', 'CSRD G1', 'SASB'] },
    'Business Ethics & Anti-Corruption': { formId: 'gov-ethics', status: 'in-progress', progress: 60, requiredFor: ['GRI 205-206', 'CSRD G1', 'SASB', 'SDG 16'] },
    'ESG Governance Structure': { formId: 'gov-board', status: 'completed', progress: 100, requiredFor: ['GRI 2-9 to 2-17', 'CSRD G1', 'TCFD Governance', 'ISSB'] },
    'Risk Management': { formId: 'gov-risk', status: 'pending', progress: 0, requiredFor: ['GRI 102-15', 'CSRD G1', 'TCFD Risk', 'ISSB'] },
    'Regulatory Compliance': { formId: 'gov-ethics', status: 'in-progress', progress: 60, requiredFor: ['GRI 2-27', 'CSRD G1', 'SASB'] },
    'Stakeholder Engagement': { formId: 'fw-gri', status: 'pending', progress: 0, requiredFor: ['GRI 2-29', 'CSRD Materiality'] },
    'Executive Compensation Linkage to ESG': { formId: 'gov-board', status: 'completed', progress: 100, requiredFor: ['GRI 2-19 to 2-21', 'CSRD G1', 'SASB'] },
  });

  const [assessmentId, setAssessmentId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing assessment from API
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);

        if (assessments && assessments.length > 0) {
          const assessment = assessments[0]; // Get the most recent assessment
          setAssessmentId(assessment._id);

          // Load data from API if available
          if (assessment.materialTopics && assessment.materialTopics.length > 0) {
            setEsgIssues(assessment.materialTopics);
          }
          if (assessment.stakeholderGroups && assessment.stakeholderGroups.length > 0) {
            setStakeholderGroups(assessment.stakeholderGroups);
          }
          if (assessment.dataCollectionStatus) {
            setDataCollectionStatus(assessment.dataCollectionStatus);
          }
        }
      } catch (error) {
        console.error('Failed to load materiality assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!apiLoading) {
      loadAssessment();
    }
  }, [assessments, apiLoading]);

  // Save assessment to API
  const saveAssessment = useCallback(async () => {
    try {
      const payload = {
        assessmentYear,
        reportingPeriod,
        materialTopics: esgIssues,
        stakeholderGroups,
        dataCollectionStatus,
        materialityMatrix: {
          issues: esgIssues.map(issue => ({
            id: issue.id,
            name: issue.name,
            impactScore: issue.impactScore,
            financialScore: issue.financialScore,
            position: {
              x: issue.financialScore,
              y: issue.impactScore
            }
          }))
        },
        status: 'draft'
      };

      let result;
      if (assessmentId) {
        result = await updateResource(assessmentId, payload);
      } else {
        result = await createResource(payload);
        if (result.success && result.data._id) {
          setAssessmentId(result.data._id);
        }
      }

      if (result.success) {
        alert('Materiality assessment saved successfully!');
      } else {
        alert('Failed to save assessment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert('Failed to save assessment. Please try again.');
    }
  }, [assessmentId, assessmentYear, reportingPeriod, esgIssues, stakeholderGroups, dataCollectionStatus, createResource, updateResource]);

  return {
    esgIssues,
    stakeholderGroups,
    dataCollectionStatus,
    loading: loading || apiLoading,
    saving,
    saveAssessment,
    exportData,
    setEsgIssues,
    setStakeholderGroups,
    setDataCollectionStatus
  };
};

const formRoutes = {
    'env-ghg': '/dashboard/ghg-inventory',
    'env-energy': '/dashboard/environmental',
    'soc-demographics': '/dashboard/social',
    'gov-board': '/dashboard/governance',
    'fw-gri': '/dashboard/materiality-assessment',
}

// --- SUB-COMPONENTS ---

const Header = ({ onSave, onExport, loading, saving }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
    <div>
      <h1 className="text-4xl font-bold text-greenly-charcoal">Enhanced Materiality Assessment</h1>
      <p className="mt-2 text-lg text-greenly-slate">A dynamic, data-driven view of your ESG landscape.</p>
    </div>
    <div className="flex items-center gap-3">
      <ExportButton onExport={onExport} disabled={loading} loading={saving} />
      <button
        onClick={onSave}
        disabled={saving || loading}
        className="flex items-center gap-2 rounded-xl bg-greenly-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-greenly-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader className="h-5 w-5 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="h-5 w-5" /> Save
          </>
        )}
      </button>
    </div>
  </div>
);

const StatCard = ({ title, value, unit, icon: Icon, color, loading }) => {
  if (loading) return <SkeletonLoader className="h-32 w-full" />;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`bg-${color}-100 p-3.5 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-greenly-slate">{title}</p>
          <p className="text-3xl font-bold text-greenly-charcoal">{value}{unit}</p>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ id, label, icon: Icon, activeTab, setActiveTab, notificationCount }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      activeTab === id
        ? 'border-greenly-primary text-greenly-primary'
        : 'border-transparent text-greenly-slate hover:text-greenly-charcoal hover:bg-gray-50'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
    {notificationCount > 0 && (
      <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        {notificationCount}
      </span>
    )}
  </button>
);

const MaterialityMatrix = ({ issues, loading, matrixRef }) => {
    if (loading) return <SkeletonLoader className="w-full aspect-square" />;
    
    const getMaterialityColor = (issue) => {
        const avg = (issue.impactScore + issue.financialScore) / 2;
        if (avg >= 8) return 'bg-red-500';
        if (avg >= 6) return 'bg-orange-500';
        if (avg >= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-greenly-charcoal mb-6">Double Materiality Matrix</h2>
            <div ref={matrixRef} className="relative aspect-square max-w-3xl mx-auto border-2 border-gray-200 rounded-lg bg-gradient-to-tr from-green-50/30 via-yellow-50/30 to-red-50/30">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    <div className="border-r border-b border-gray-200/80"></div>
                    <div className="border-b border-gray-200/80"></div>
                    <div className="border-r border-gray-200/80"></div>
                    <div></div>
                </div>
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium text-greenly-slate">Financial Materiality →</div>
                <div className="absolute top-1/2 -left-16 -translate-y-1/2 -rotate-90 text-sm font-medium text-greenly-slate">Impact Materiality →</div>
                
                {issues.map((issue) => (
                    <div
                        key={issue.id}
                        className="absolute group cursor-pointer"
                        style={{ left: `${(issue.financialScore / 10) * 100}%`, top: `${100 - (issue.impactScore / 10) * 100}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className={`h-4 w-4 rounded-full border-2 border-white shadow-md group-hover:scale-150 transition-transform ${getMaterialityColor(issue)}`}></div>
                        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-10 whitespace-nowrap rounded-md bg-greenly-charcoal px-3 py-2 text-sm text-white shadow-lg">
                            <p className="font-semibold">{issue.name}</p>
                            <p className="text-xs text-gray-300">Impact: {issue.impactScore}/10 | Financial: {issue.financialScore}/10</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DataGaps = ({ issues, dataCollectionStatus, loading }) => {
    if (loading) return <SkeletonLoader className="w-full h-96" />;
    
    const incompleteIssues = issues.filter(issue => dataCollectionStatus[issue.name]?.progress < 100);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-greenly-charcoal mb-6">Data Gaps Analysis</h2>
            <div className="space-y-4">
                {incompleteIssues.map(issue => {
                    const status = dataCollectionStatus[issue.name];
                    if (!status) return null;
                    return (
                        <div key={issue.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-greenly-charcoal">{issue.name}</h3>
                                    <p className="text-sm text-greenly-slate">Required for: {status.requiredFor.slice(0, 3).join(', ')}{status.requiredFor.length > 3 ? '...' : ''}</p>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-full sm:w-32">
                                        <div className="h-2.5 bg-gray-200 rounded-full">
                                            <div className="h-2.5 bg-red-500 rounded-full" style={{ width: `${status.progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right mt-1">{status.progress}% complete</p>
                                    </div>
                                    <Link to={formRoutes[status.formId] || '#'} className="flex-shrink-0">
                                        <button className="flex items-center gap-1.5 text-sm font-semibold text-greenly-primary hover:underline">
                                            Complete <ExternalLink className="h-4 w-4" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function MaterialityAssessmentEnhanced() {
  const {
    esgIssues,
    stakeholderGroups,
    dataCollectionStatus,
    loading,
    saving,
    saveAssessment,
    exportData
  } = useEnhancedMaterialityData();

  const [activeTab, setActiveTab] = useState('matrix');
  const matrixRef = useRef(null);

  const stats = useMemo(() => {
    if (loading || !esgIssues || !dataCollectionStatus) {
      return { totalIssues: 0, criticalIssues: 0, dataCompletion: 0, dataGaps: 0 };
    }
    const critical = esgIssues.filter(i => (i.impactScore + i.financialScore) / 2 >= 8);
    const completedForms = Object.values(dataCollectionStatus).filter(d => d.progress === 100).length;
    const totalForms = Object.values(dataCollectionStatus).length;
    return {
      totalIssues: esgIssues.length,
      criticalIssues: critical.length,
      dataCompletion: totalForms > 0 ? Math.round((completedForms / totalForms) * 100) : 0,
      dataGaps: totalForms - completedForms,
    };
  }, [esgIssues, dataCollectionStatus, loading]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 bg-greenly-light-gray min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 text-greenly-primary animate-spin mx-auto mb-4" />
            <p className="text-greenly-slate">Loading materiality assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!esgIssues) {
    return <EmptyState title="Could not load assessment data" message="There was an issue fetching the materiality assessment data. Please try again later." />;
  }

  return (
    <div className="p-4 sm:p-6 bg-greenly-light-gray min-h-screen">
      <Header
        onSave={saveAssessment}
        onExport={exportData}
        loading={loading}
        saving={saving}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total ESG Issues" value={stats.totalIssues} icon={BarChart3} color="blue" loading={false} />
        <StatCard title="Critical Issues" value={stats.criticalIssues} icon={AlertCircle} color="red" loading={false} />
        <StatCard title="Data Completion" value={stats.dataCompletion} unit="%" icon={CheckCircle} color="green" loading={false} />
        <StatCard title="Stakeholder Groups" value={stakeholderGroups?.length || 0} icon={Users} color="purple" loading={false} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap gap-2 px-4">
            <TabButton id="matrix" label="Materiality Matrix" icon={PieChart} activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="data-gaps" label="Data Gaps" icon={ClipboardList} activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={stats.dataGaps} />
            <TabButton id="issues" label="ESG Issues" icon={BarChart3} activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="stakeholders" label="Stakeholders" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>

      <div>
        {activeTab === 'matrix' && <MaterialityMatrix issues={esgIssues} loading={false} matrixRef={matrixRef} />}
        {activeTab === 'data-gaps' && <DataGaps issues={esgIssues} dataCollectionStatus={dataCollectionStatus} loading={false} />}
        {activeTab === 'issues' && <div className="bg-white p-6 rounded-2xl shadow-sm"><h2 className="text-2xl font-bold text-greenly-charcoal">ESG Issues List (WIP)</h2></div>}
        {activeTab === 'stakeholders' && <div className="bg-white p-6 rounded-2xl shadow-sm"><h2 className="text-2xl font-bold text-greenly-charcoal">Stakeholders List (WIP)</h2></div>}
      </div>
    </div>
  );
}
