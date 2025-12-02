// Cache bust 2025-11-05
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Circle,
  Users,
  Heart,
  Award,
  TrendingUp,
  Target,
  Info,
  AlertCircle,
  Lightbulb,
  Globe,
  BookOpen
} from 'lucide-react';
import FrameworkProgressBar from '@components/molecules/FrameworkProgressBar';

const initialFormData = {
  representation: {
    'women-workforce': { name: 'Women in Total Workforce (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    'women-leadership': { name: 'Women in Leadership Positions (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    'underrepresented-groups': { name: 'Underrepresented Groups Workforce (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    'persons-with-disabilities': { name: 'Employees with Disabilities (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    'lgbtq-representation': { name: 'LGBTQ+ Representation (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-1'] }
  },
  policies: {
    'policy-statement': { name: 'Formal Diversity & Inclusion Policy', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-23', 'CSRD S1-1'] },
    'anti-discrimination': { name: 'Anti-discrimination Policy Coverage', value: '', unit: 'text', completed: false, frameworks: ['GRI 406-1', 'CSRD S1-16'] },
    'equal-opportunity': { name: 'Equal Opportunity Policy Scope', value: '', unit: 'text', completed: false, frameworks: ['GRI 406-1'] },
    'grievance-mechanism': { name: 'Grievance Mechanisms for Inclusion Issues', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-25', 'CSRD S1-6'] }
  },
  payEquity: {
    'gender-pay-gap': { name: 'Median Gender Pay Gap (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-2', 'CSRD S1-13'] },
    'ethnicity-pay-gap': { name: 'Median Ethnicity Pay Gap (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-13'] },
    'bonus-gap': { name: 'Bonus Pay Gap (Gender/Ethnicity) (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-2'] },
    'pay-equity-audits': { name: 'Pay Equity Audits Conducted', value: '', unit: 'text', completed: false, frameworks: ['CSRD S1-13'] }
  },
  culture: {
    'employee-resource-groups': { name: 'Employee Resource Groups (ERGs)', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-9'] },
    'inclusive-benefits': { name: 'Inclusive Benefits Offered', value: '', unit: 'text', completed: false, frameworks: ['GRI 401-2', 'CSRD S1-11'] },
    'bias-training-coverage': { name: 'Bias Training Coverage (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 404-2', 'CSRD S1-9'] },
    'engagement-score': { name: 'Inclusion Engagement Score', value: '', unit: 'score', completed: false, frameworks: ['CSRD S1-9'] }
  },
  pipeline: {
    'diverse-candidates-shortlisted': { name: 'Roles with Diverse Shortlists (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-9'] },
    'development-programs': { name: 'Inclusive Leadership Programs Offered', value: '', unit: 'text', completed: false, frameworks: ['GRI 404-2', 'CSRD S1-9'] },
    'internal-mobility-rate': { name: 'Internal Mobility for Underrepresented Groups (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-9'] },
    'succession-plans-diverse': { name: 'Critical Roles with Diverse Successors (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-9'] }
  },
  supplyChain: {
    'supplier-diversity-policy': { name: 'Supplier Diversity Policy', value: '', unit: 'text', completed: false, frameworks: ['GRI 204-1', 'CSRD S2-1'] },
    'diverse-spend': { name: 'Spend with Diverse Suppliers (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S2-1'] },
    'certified-suppliers': { name: 'Number of Certified Diverse Suppliers', value: '', unit: 'number', completed: false, frameworks: ['CSRD S2-1'] },
    'supplier-engagement': { name: 'Supplier Inclusion Engagement Programs', value: '', unit: 'text', completed: false, frameworks: ['CSRD S2-1'] }
  }
};

const categoriesConfig = [
  { id: 'representation', name: 'Representation', icon: Users, color: 'pink' },
  { id: 'policies', name: 'Policies & Governance', icon: BookOpen, color: 'purple' },
  { id: 'payEquity', name: 'Pay Equity', icon: Award, color: 'teal' },
  { id: 'culture', name: 'Inclusive Culture', icon: Heart, color: 'red' },
  { id: 'pipeline', name: 'Talent Pipeline', icon: TrendingUp, color: 'indigo' },
  { id: 'supplyChain', name: 'Supplier Inclusion', icon: Globe, color: 'blue' }
];

const useDiversityInclusionData = () => {
  const [currentCategory, setCurrentCategory] = useState('representation');
  const [showInsights, setShowInsights] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData(prev => ({ ...prev, [category]: { ...prev[category], [fieldKey]: { ...prev[category][fieldKey], value, completed: value.trim() !== '' } } }));
  }, []);

  const calculateCategoryProgress = useCallback((category) => {
    const fields = Object.values(formData[category]);
    const completedFields = fields.filter(f => f.completed).length;
    return fields.length > 0 ? Math.round((completedFields / fields.length) * 100) : 0;
  }, [formData]);

  const totalProgress = useMemo(() => {
    let totalFields = 0, completedFields = 0;
    Object.values(formData).forEach(cat => {
      const fields = Object.values(cat);
      totalFields += fields.length;
      completedFields += fields.filter(f => f.completed).length;
    });
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [formData]);

  const insightMetrics = useMemo(() => {
    const womenWorkforce = parseFloat(formData.representation['women-workforce'].value) || 0;
    const womenLeadership = parseFloat(formData.representation['women-leadership'].value) || 0;
    const genderPayGap = parseFloat(formData.payEquity['gender-pay-gap'].value) || 0;
    const biasTraining = parseFloat(formData.culture['bias-training-coverage'].value) || 0;
    const diverseSpend = parseFloat(formData.supplyChain['diverse-spend'].value) || 0;
    const hasData = [womenWorkforce, womenLeadership, genderPayGap, biasTraining, diverseSpend].some(v => v > 0);
    return { hasData, leadershipParity: womenWorkforce > 0 ? ((womenLeadership / womenWorkforce) * 100).toFixed(1) : '0.0', parityGap: Math.abs(womenWorkforce - womenLeadership).toFixed(1), genderPayGap: genderPayGap.toFixed(1), biasCoverage: biasTraining.toFixed(1), supplierDiversity: diverseSpend.toFixed(1) };
  }, [formData.representation, formData.payEquity, formData.culture, formData.supplyChain]);

  return { currentCategory, setCurrentCategory, showInsights, setShowInsights, formData, handleInputChange, calculateCategoryProgress, totalProgress, insightMetrics };
};

const Header = ({ totalProgress, formData }) => (
  <div className="bg-white border-b border-greenly-light-gray">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/esg" className="p-2 hover:bg-greenly-light-gray rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-greenly-charcoal" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Heart className="h-6 w-6 text-greenly-red" />
              <span className="text-sm font-semibold text-greenly-red">DIVERSITY & INCLUSION</span>
            </div>
            <h1 className="text-2xl font-bold text-greenly-charcoal">Diversity & Inclusion Data</h1>
            <p className="text-sm text-greenly-slate">GRI 405, 406 & CSRD S1 disclosures on fairness, equity, and representation.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2"><Download size={16} /> Export</button>
          <button className="btn-primary-red flex items-center gap-2"><Save size={16} /> Save Progress</button>
        </div>
      </div>
      <FrameworkProgressBar
        framework="Diversity & Inclusion"
        completionPercentage={totalProgress}
        totalFields={Object.values(formData).reduce((s, c) => s + Object.keys(c).length, 0)}
        completedFields={Object.values(formData).reduce((s, c) => s + Object.values(c).filter(f => f.completed).length, 0)}
        showDetails={true}
      />
    </div>
  </div>
);

const FrameworkTags = () => (
  <div className="mb-6 flex flex-wrap gap-2">
    {['GRI 405-1', 'GRI 405-2', 'GRI 406-1', 'CSRD S1-9', 'CSRD S1-13', 'CSRD S2-1'].map(tag => (
      <span key={tag} className="status-badge-info-sm">{tag}</span>
    ))}
  </div>
);

const CategorySidebar = ({ currentCategory, setCurrentCategory, calculateCategoryProgress }) => (
  <div className="lg:col-span-1">
    <div className="sticky top-24 space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-greenly-slate px-3">Categories</h3>
      {categoriesConfig.map(cat => {
        const progress = calculateCategoryProgress(cat.id);
        const isActive = currentCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setCurrentCategory(cat.id)}
            className={`w-full rounded-lg border p-4 text-left transition-all ${isActive ? `border-greenly-red bg-greenly-red text-white shadow-lg` : 'border-greenly-light-gray bg-white text-greenly-charcoal hover:border-greenly-red/50 hover:shadow-md'}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className={`p-2 rounded-full ${isActive ? 'bg-white/20' : `bg-greenly-light-${cat.color}`}`}>
                <cat.icon className={`h-5 w-5 ${isActive ? 'text-white' : `text-greenly-${cat.color}`}`} />
              </div>
              <span className={`text-sm font-semibold ${isActive ? 'text-white' : `text-greenly-red`}`}>{progress}%</span>
            </div>
            <div className="font-semibold">{cat.name}</div>
            <div className={`h-1.5 w-full rounded-full mt-2 ${isActive ? 'bg-white/20' : 'bg-greenly-light-gray'}`}>
              <div className={`h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-greenly-red'}`} style={{ width: `${progress}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const DataCollectionForm = ({ currentCategory, formData, handleInputChange }) => {
  const currentConfig = categoriesConfig.find(c => c.id === currentCategory);
  const numericUnits = ['%', 'number', 'score'];

  return (
    <div className="rounded-lg border border-greenly-light-gray bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-greenly-light-gray pb-4">
        <div className="mb-2 flex items-center gap-3">
          <div className={`p-2 rounded-full bg-greenly-light-${currentConfig.color}`}>
            <currentConfig.icon className={`h-6 w-6 text-greenly-${currentConfig.color}`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-greenly-charcoal">{currentConfig.name}</h2>
            <p className="text-sm text-greenly-slate">Capture metrics for ESG disclosures.</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {Object.entries(formData[currentCategory] || {}).map(([fieldKey, field]) => {
          const isNumeric = numericUnits.includes(field.unit);
          return (
            <div key={fieldKey} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-2.5">
                {field.completed ? <CheckCircle2 className="h-5 w-5 text-greenly-primary" /> : <Circle className="h-5 w-5 text-greenly-light-gray-dark" />}
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium text-greenly-charcoal">{field.name}</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {field.frameworks.map(fw => <span key={fw} className="status-badge-info-sm">{fw}</span>)}
                </div>
                <div className="flex gap-2">
                  {isNumeric ? (
                    <>
                      <input
                        type="number"
                        step={field.unit === '%' || field.unit === 'score' ? '0.1' : '1'}
                        value={field.value}
                        onChange={e => handleInputChange(currentCategory, fieldKey, e.target.value)}
                        className="input-base flex-1"
                        placeholder={`Enter ${field.unit}`}
                      />
                      <div className="input-base w-24 flex items-center justify-center bg-greenly-light-gray text-greenly-slate">{field.unit}</div>
                    </>
                  ) : (
                    <textarea
                      value={field.value}
                      onChange={e => handleInputChange(currentCategory, fieldKey, e.target.value)}
                      className="input-base flex-1"
                      placeholder="Enter description or details..."
                      rows={3}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InsightsPanel = ({ showInsights, setShowInsights, insightMetrics }) => (
  <>
    <div className="mt-6 flex items-center justify-between rounded-lg border border-greenly-light-red bg-greenly-light-red/50 p-4">
      <div className="flex items-center gap-3 text-sm text-greenly-charcoal">
        <Lightbulb className="h-4 w-4 text-greenly-red" />
        <span>Unlock automated diversity insights from your data.</span>
      </div>
      <button onClick={() => setShowInsights(p => !p)} className="btn-primary-red">{showInsights ? 'Hide Insights' : 'Show Insights'}</button>
    </div>
    {showInsights && (
      <div className="mt-4 rounded-lg border border-greenly-red/30 bg-white p-6">
        <div className="mb-4 flex items-center gap-2 text-greenly-red">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-semibold">Diversity & Inclusion Analytics</span>
        </div>
        {insightMetrics.hasData ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Leadership Parity Index',
                value: `${insightMetrics.leadershipParity}%`,
                desc: 'Target: 100% to mirror workforce.',
                icon: Users
              },
              {
                title: 'Representation Gap',
                value: `${insightMetrics.parityGap}%`,
                desc: 'Aim for <5% difference.',
                icon: Target
              },
              {
                title: 'Median Gender Pay Gap',
                value: `${insightMetrics.genderPayGap}%`,
                desc: 'Narrative needed if >5%.',
                icon: Award
              },
              {
                title: 'Bias Training Coverage',
                value: `${insightMetrics.biasCoverage}%`,
                desc: 'Keep above 90% for compliance.',
                icon: BookOpen
              },
              {
                title: 'Diverse Supplier Spend',
                value: `${insightMetrics.supplierDiversity}%`,
                desc: 'Report top-tier spend.',
                icon: Globe
              }
            ].map(metric => (
              <div key={metric.title} className="rounded-lg bg-greenly-light-red/30 p-4">
                <div className="flex items-center justify-between text-sm text-greenly-slate">
                  <span>{metric.title}</span>
                  <metric.icon className="h-4 w-4 text-greenly-red" />
                </div>
                <div className="mt-2 text-2xl font-bold text-greenly-charcoal">{metric.value}</div>
                <p className="mt-1 text-xs text-greenly-slate">{metric.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-greenly-light-gray bg-greenly-off-white p-6 text-sm text-greenly-slate flex items-center gap-3">
            <Info className="h-5 w-5 text-greenly-slate flex-shrink-0" />
            Enter representation, pay, and supplier metrics to generate automated insights and benchmark analysis.
          </div>
        )}
      </div>
    )}
  </>
);

const DiversityInclusionCollection = () => {
  const {
    currentCategory,
    setCurrentCategory,
    showInsights,
    setShowInsights,
    formData,
    handleInputChange,
    calculateCategoryProgress,
    totalProgress,
    insightMetrics,
  } = useDiversityInclusionData();

  return (
    <div className="min-h-screen bg-greenly-off-white">
      <Header totalProgress={totalProgress} formData={formData} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FrameworkTags />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <CategorySidebar
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            calculateCategoryProgress={calculateCategoryProgress}
          />
          <div className="lg:col-span-3">
            <DataCollectionForm
              currentCategory={currentCategory}
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <InsightsPanel
              showInsights={showInsights}
              setShowInsights={setShowInsights}
              insightMetrics={insightMetrics}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiversityInclusionCollection;
