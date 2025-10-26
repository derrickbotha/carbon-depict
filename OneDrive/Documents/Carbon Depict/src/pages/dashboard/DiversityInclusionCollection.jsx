// Cache bust 2025-10-23
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
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const DiversityInclusionCollection = () => {
  const [currentCategory, setCurrentCategory] = useState('representation');
  const [showInsights, setShowInsights] = useState(false);

  const [formData, setFormData] = useState({
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
  });

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [fieldKey]: {
          ...prev[category][fieldKey],
          value,
          completed: value.trim() !== ''
        }
      }
    }));
  }, []);

  const calculateCategoryProgress = useCallback((category) => {
    const fields = Object.values(formData[category]);
    const completedFields = fields.filter((f) => f.completed).length;
    return fields.length > 0 ? Math.round((completedFields / fields.length) * 100) : 0;
  }, [formData]);

  const totalProgress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    Object.values(formData).forEach((category) => {
      const fields = Object.values(category);
      totalFields += fields.length;
      completedFields += fields.filter((f) => f.completed).length;
    });
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [formData]);

  const categories = [
    { id: 'representation', name: 'Representation & Demographics', description: 'Diverse workforce composition metrics', icon: '👥', fields: Object.keys(formData.representation).length },
    { id: 'policies', name: 'Policies & Governance', description: 'Policies enabling inclusive culture', icon: '📜', fields: Object.keys(formData.policies).length },
    { id: 'payEquity', name: 'Pay Equity & Rewards', description: 'Compensation fairness metrics', icon: '⚖️', fields: Object.keys(formData.payEquity).length },
    { id: 'culture', name: 'Inclusive Culture & Engagement', description: 'Belonging programs and sentiment', icon: '💙', fields: Object.keys(formData.culture).length },
    { id: 'pipeline', name: 'Talent Pipeline & Advancement', description: 'Career progression for underrepresented groups', icon: '🚀', fields: Object.keys(formData.pipeline).length },
    { id: 'supplyChain', name: 'Supplier Inclusion', description: 'Diverse supplier engagement and spend', icon: '🌍', fields: Object.keys(formData.supplyChain).length }
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  const insightMetrics = useMemo(() => {
    const womenWorkforce = parseFloat(formData.representation['women-workforce'].value) || 0;
    const womenLeadership = parseFloat(formData.representation['women-leadership'].value) || 0;
    const genderPayGap = parseFloat(formData.payEquity['gender-pay-gap'].value) || 0;
    const biasTraining = parseFloat(formData.culture['bias-training-coverage'].value) || 0;
    const diverseSpend = parseFloat(formData.supplyChain['diverse-spend'].value) || 0;

    const hasData = [womenWorkforce, womenLeadership, genderPayGap, biasTraining, diverseSpend].some(val => val > 0);

    return {
      hasData,
      leadershipParity: womenWorkforce > 0 ? ((womenLeadership / womenWorkforce) * 100).toFixed(1) : '0.0',
      parityGap: Math.abs(womenWorkforce - womenLeadership).toFixed(1),
      genderPayGap: genderPayGap.toFixed(1),
      biasCoverage: biasTraining.toFixed(1),
      supplierDiversity: diverseSpend.toFixed(1)
    };
  }, [formData]);

  const numericUnits = ['%', 'number', 'score'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/esg/data-entry" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
              </Link>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-rose-600" strokeWidth={2} />
                  <span className="text-sm font-semibold text-rose-600">DIVERSITY & INCLUSION</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Diversity & Inclusion Data Collection</h1>
                <p className="text-cd-muted">GRI 405, 406 and CSRD S1 disclosures on fairness, equity, and representation.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center gap-2">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          <FrameworkProgressBar
            framework="Diversity & Inclusion"
            completionPercentage={totalProgress}
            totalFields={Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
            completedFields={Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter(f => f.completed).length, 0)}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">GRI 405-1: Diversity of Governance Bodies & Employees</span>
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">GRI 405-2: Ratio of Basic Salary & Remuneration</span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">GRI 406-1: Incidents of Discrimination</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-9: Diversity & Inclusion</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-13: Pay Equality</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">CSRD S2-1: Supplier Social Impacts</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cd-muted">Categories</h3>
              {categories.map((cat) => {
                const progress = calculateCategoryProgress(cat.id);
                const isActive = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${isActive ? 'border-rose-600 bg-rose-600 text-white shadow-lg' : 'border-cd-border bg-white text-cd-text hover:border-rose-300 hover:shadow-md'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-rose-600'}`}>{progress}%</span>
                    </div>
                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>{cat.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>{cat.fields} fields</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                      <div className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-rose-600'}`} style={{ width: `${progress}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
              <div className="mb-6 border-b border-cd-border pb-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-3xl">{currentCategoryData?.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-cd-text">{currentCategoryData?.name}</h2>
                    <p className="text-sm text-cd-muted">{currentCategoryData?.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-cd-muted">
                  <AlertCircle className="h-4 w-4" strokeWidth={2} />
                  <span>Capture diversity metrics, policies, and practices for ESG disclosures.</span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(formData[currentCategory] || {}).map(([fieldKey, field]) => {
                  const isNumeric = numericUnits.includes(field.unit);
                  const step = field.unit === '%' ? '0.1' : field.unit === 'score' ? '0.1' : '1';
                  return (
                    <div key={fieldKey} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2">
                        {field.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={2} />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-cd-text">{field.name}</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {field.frameworks.map((fw) => (
                            <span key={fw} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{fw}</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {isNumeric ? (
                            <>
                              <input
                                type="number"
                                step={step}
                                min="0"
                                max={field.unit === '%' ? '100' : field.unit === 'score' ? '5' : undefined}
                                value={field.value}
                                onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                                className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/20"
                                placeholder={`Enter ${field.unit}`}
                              />
                              <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">{field.unit}</div>
                            </>
                          ) : (
                            <textarea
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/20"
                              placeholder="Enter description or details"
                              rows={3}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center gap-3 text-sm text-rose-900">
                  <Lightbulb className="h-4 w-4" strokeWidth={2} />
                  <span>Unlock automated diversity insights from representation and pay data.</span>
                </div>
                <button
                  onClick={() => setShowInsights((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                >
                  {showInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
              </div>

              {showInsights && (
                <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-6">
                  <div className="mb-4 flex items-center gap-2 text-rose-900">
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm font-semibold">Diversity & Inclusion Analytics</span>
                  </div>
                  {insightMetrics.hasData ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Leadership Parity Index</span>
                          <Users className="h-4 w-4 text-rose-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.leadershipParity}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Target 100% to mirror enterprise representation.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Representation Gap</span>
                          <Target className="h-4 w-4 text-rose-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.parityGap}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Aim for &lt;5% difference between workforce and leadership.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Median Gender Pay Gap</span>
                          <Award className="h-4 w-4 text-rose-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.genderPayGap}%</div>
                        <p className="mt-1 text-xs text-cd-muted">CSRD expects narrative below 5% or remediation roadmap.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Bias Training Coverage</span>
                          <BookOpen className="h-4 w-4 text-rose-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.biasCoverage}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Keep annual coverage above 90% for compliance readiness.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Diverse Supplier Spend</span>
                          <Globe className="h-4 w-4 text-rose-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.supplierDiversity}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Report top-tier supplier diversity investments.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-rose-200 bg-white p-6 text-sm text-cd-muted">
                      <Info className="h-4 w-4 text-rose-500 inline mr-2" strokeWidth={2} />
                      Enter representation, pay, and supplier metrics to generate insights.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiversityInclusionCollection;
