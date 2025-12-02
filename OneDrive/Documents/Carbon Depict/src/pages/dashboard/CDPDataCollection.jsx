// Cache bust 2025-11-05
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Cloud,
  Target,
  TrendingUp,
  Users,
  Shield,
  Lightbulb,
  DollarSign,
  FileText,
  BarChart3,
  Factory,
  Leaf,
  Award,
  List,
  Edit3
} from 'lucide-react';
import FrameworkProgressBar from '@components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '@components/ESGDataEntryForm';
import apiClient from '@utils/api';

const initialCdpData = {
    introduction: { 'c0.1': { name: 'Reporting year start and end dates', value: '', completed: false }, 'c0.2': { name: 'State if submitted in previous years', value: '', completed: false }, 'c0.3': { name: 'Select reporting boundary', value: '', completed: false }, 'c0.4': { name: 'Organizational activities', value: '', completed: false }, 'c0.5': { name: 'Currency used for financial data', value: '', completed: false }, },
    governance: { 'c1.1': { name: 'Board-level oversight of climate issues', value: '', completed: false }, 'c1.1a': { name: 'Board responsibilities for climate', value: '', completed: false }, 'c1.1b': { name: 'Frequency of board review', value: '', completed: false }, 'c1.2': { name: 'Management-level responsibility', value: '', completed: false }, 'c1.2a': { name: 'Management position with climate responsibility', value: '', completed: false }, 'c1.3': { name: 'Incentives for managing climate issues', value: '', completed: false }, 'c1.3a': { name: 'Details of incentive schemes', value: '', completed: false }, },
    risksOpportunities: { 'c2.1': { name: 'Risk management processes', value: '', completed: false }, 'c2.1a': { name: 'Board oversight of risk management', value: '', completed: false }, 'c2.1b': { name: 'Integration into overall risk management', value: '', completed: false }, 'c2.2': { name: 'Climate-related risks with potential impact', value: '', completed: false }, 'c2.2a': { name: 'Transition risks identified', value: '', completed: false }, 'c2.2b': { name: 'Physical risks identified', value: '', completed: false }, 'c2.3': { name: 'Climate-related opportunities', value: '', completed: false }, 'c2.3a': { name: 'Opportunities identified and pursued', value: '', completed: false }, 'c2.4': { name: 'Climate scenario analysis', value: '', completed: false }, 'c2.4a': { name: 'Details of scenario analysis (2°C, 1.5°C)', value: '', completed: false }, },
    businessStrategy: { 'c3.1': { name: 'Climate change integrated into strategy', value: '', completed: false }, 'c3.1a': { name: 'Strategic plans that consider climate', value: '', completed: false }, 'c3.1b': { name: 'Aspects of climate change influencing strategy', value: '', completed: false }, 'c3.2': { name: 'Climate transition plan', value: '', completed: false }, 'c3.2a': { name: 'Details of transition plan (targets, actions)', value: '', completed: false }, 'c3.3': { name: 'Business objectives accounting for climate', value: '', completed: false }, 'c3.4': { name: 'Scenario analysis informing strategy', value: '', completed: false }, 'c3.5': { name: 'Products/services affected by climate regulation', value: '', completed: false }, },
    targetsPerformance: { 'c4.1': { name: 'Emission reduction initiatives in reporting year', value: '', completed: false }, 'c4.1a': { name: 'Details of initiatives (type, scope, savings)', value: '', completed: false }, 'c4.1b': { name: 'Emission reduction per initiative', value: '', completed: false }, 'c4.2': { name: 'Emission reduction targets', value: '', completed: false }, 'c4.2a': { name: 'Target details (baseline, target year, % reduction)', value: '', completed: false }, 'c4.2b': { name: 'Progress against targets', value: '', completed: false }, 'c4.2c': { name: 'Targets aligned with net-zero trajectory', value: '', completed: false }, 'c4.3': { name: 'Other climate-related targets (renewable energy, etc.)', value: '', completed: false }, 'c4.3a': { name: 'Details of other targets', value: '', completed: false }, },
    emissionsMethodology: { 'c5.1': { name: 'Base year and emissions in base year', value: '', completed: false }, 'c5.1a': { name: 'Scope 1 base year emissions', value: '', completed: false }, 'c5.1b': { name: 'Scope 2 base year emissions', value: '', completed: false }, 'c5.1c': { name: 'Scope 3 base year emissions', value: '', completed: false }, 'c5.2': { name: 'Consolidation approach', value: '', completed: false }, 'c5.2a': { name: 'Reporting boundary details', value: '', completed: false }, },
    emissionsData: { 'c6.1': { name: 'Scope 1 emissions (tCO2e)', value: '', completed: false }, 'c6.2': { name: 'Scope 2 emissions (location and market-based)', value: '', completed: false }, 'c6.3': { name: 'Scope 3 emissions by category (15 categories)', value: '', completed: false }, 'c6.4': { name: 'Biogenic emissions', value: '', completed: false }, 'c6.5': { name: 'Emissions intensity metrics', value: '', completed: false }, 'c6.7': { name: 'Emission breakdowns (country, business division, etc.)', value: '', completed: false }, 'c6.10': { name: 'Gross global Scope 1 emissions breakdown by GHG type', value: '', completed: false }, },
    emissionsBreakdown: { 'c7.1': { name: 'Emissions breakdown by GHG protocol scope', value: '', completed: false }, 'c7.1a': { name: 'Scope 1 breakdown by GHG type (CO2, CH4, N2O, etc.)', value: '', completed: false }, 'c7.2': { name: 'Scope 2 emissions breakdown', value: '', completed: false }, 'c7.3': { name: 'Scope 3 emissions breakdown', value: '', completed: false }, 'c7.5': { name: 'Emissions performance against previous year', value: '', completed: false }, 'c7.6': { name: 'Scope 1 emissions intensities', value: '', completed: false }, 'c7.7': { name: 'Scope 2 emissions intensities', value: '', completed: false }, 'c7.9': { name: 'Emissions reduction initiatives impact', value: '', completed: false }, },
    energy: { 'c8.1': { name: 'Electricity consumption (MWh)', value: '', completed: false }, 'c8.2': { name: 'Energy-related activities (renewable procurement, etc.)', value: '', completed: false }, 'c8.2a': { name: 'Renewable electricity consumed (MWh)', value: '', completed: false }, 'c8.2b': { name: 'Fuel consumption (MWh)', value: '', completed: false }, 'c8.2c': { name: 'Steam, heating, and cooling consumption', value: '', completed: false }, 'c8.2d': { name: 'Total energy consumption breakdown', value: '', completed: false }, 'c8.2e': { name: 'Renewable energy certificates (RECs)', value: '', completed: false }, },
    additionalMetrics: { 'c9.1': { name: 'Other climate-related metrics (water, waste, etc.)', value: '', completed: false }, 'c9.1a': { name: 'Metrics details and methodology', value: '', completed: false }, },
    verification: { 'c10.1': { name: 'Third-party verification of emissions', value: '', completed: false }, 'c10.1a': { name: 'Scope 1 verification level', value: '', completed: false }, 'c10.1b': { name: 'Scope 2 verification level', value: '', completed: false }, 'c10.1c': { name: 'Scope 3 verification level', value: '', completed: false }, 'c10.2': { name: 'Other information verified', value: '', completed: false }, },
    carbonPricing: { 'c11.1': { name: 'Price on carbon (carbon tax, ETS, internal)', value: '', completed: false }, 'c11.1a': { name: 'Internal carbon price details ($/tCO2e)', value: '', completed: false }, 'c11.1b': { name: 'Carbon tax details', value: '', completed: false }, 'c11.1c': { name: 'Emissions trading scheme participation', value: '', completed: false }, 'c11.2': { name: 'Projects generating carbon credits', value: '', completed: false }, 'c11.3': { name: 'Engagement with policy makers on carbon pricing', value: '', completed: false }, },
    engagement: { 'c12.1': { name: 'Value chain engagement on climate', value: '', completed: false }, 'c12.1a': { name: 'Suppliers engaged (% of procurement spend)', value: '', completed: false }, 'c12.1b': { name: 'Customer engagement activities', value: '', completed: false }, 'c12.1d': { name: 'Other value chain engagement', value: '', completed: false }, 'c12.2': { name: 'Employee engagement on climate', value: '', completed: false }, 'c12.3': { name: 'Public policy engagement', value: '', completed: false }, 'c12.3a': { name: 'Trade associations and climate positions', value: '', completed: false }, 'c12.4': { name: 'Collaborative initiatives', value: '', completed: false }, },
};

const moduleConfig = {
    introduction: { title: 'C0: Introduction', icon: FileText, color: 'text-greenly-slate', maxScore: 0 },
    governance: { title: 'C1: Governance', icon: Shield, color: 'text-greenly-indigo', maxScore: 10 },
    risksOpportunities: { title: 'C2: Risks & Opportunities', icon: TrendingUp, color: 'text-greenly-red', maxScore: 15 },
    businessStrategy: { title: 'C3: Business Strategy', icon: Target, color: 'text-greenly-purple', maxScore: 12 },
    targetsPerformance: { title: 'C4: Targets & Performance', icon: BarChart3, color: 'text-greenly-teal', maxScore: 15 },
    emissionsMethodology: { title: 'C5: Methodology', icon: Lightbulb, color: 'text-greenly-amber', maxScore: 6 },
    emissionsData: { title: 'C6: Emissions Data', icon: Cloud, color: 'text-greenly-blue', maxScore: 12 },
    emissionsBreakdown: { title: 'C7: Breakdown', icon: Factory, color: 'text-greenly-slate', maxScore: 8 },
    energy: { title: 'C8: Energy', icon: Leaf, color: 'text-greenly-primary', maxScore: 8 },
    additionalMetrics: { title: 'C9: Metrics', icon: DollarSign, color: 'text-greenly-cyan', maxScore: 4 },
    verification: { title: 'C10: Verification', icon: Award, color: 'text-greenly-pink', maxScore: 6 },
    carbonPricing: { title: 'C11: Carbon Pricing', icon: DollarSign, color: 'text-greenly-orange', maxScore: 8 },
    engagement: { title: 'C12: Engagement', icon: Users, color: 'text-greenly-purple', maxScore: 10 },
};

const useCDPData = () => {
  const [cdpData, setCdpData] = useState(initialCdpData);
  const [activeModule, setActiveModule] = useState('introduction');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'

  const progress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    Object.values(cdpData).forEach(module => {
      Object.values(module).forEach(field => {
        totalFields++;
        if (field.completed) completedFields++;
      });
    });
    return {
      percentage: totalFields > 0 ? (completedFields / totalFields) * 100 : 0,
      completed: completedFields,
      total: totalFields,
    };
  }, [cdpData]);

  const handleNewEntry = useCallback(async (formData) => {
    try {
      const response = await apiClient.esgMetrics.create({ ...formData, framework: 'CDP', status: 'draft' });
      const { disclosure } = formData;
      if (cdpData[activeModule] && cdpData[activeModule][disclosure]) {
        updateField(activeModule, disclosure, formData.value);
      }
      alert('Entry saved successfully as draft!');
      return response.data;
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
      return null;
    }
  }, [activeModule, cdpData]);

  const updateField = useCallback((module, fieldKey, value) => {
    setCdpData(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [fieldKey]: { ...prev[module][fieldKey], value, completed: value.trim() !== '' },
      },
    }));
  }, []);

  return { cdpData, activeModule, setActiveModule, viewMode, setViewMode, progress, handleNewEntry, updateField };
};

const Header = ({ progress, viewMode, setViewMode }) => (
  <div className="bg-white border-b border-greenly-light-gray">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/esg" className="p-2 hover:bg-greenly-light-gray rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-greenly-charcoal" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-greenly-charcoal">CDP Climate Change Questionnaire</h1>
            <p className="text-sm text-greenly-slate mt-1">Carbon Disclosure Project - 12 Modules with Scoring Guidance (A to D-)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-greenly-light-gray rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-greenly-primary shadow-sm' : 'text-greenly-slate hover:bg-white/50'}`}>
              <List size={16} /> Checklist
            </button>
            <button onClick={() => setViewMode('form')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'form' ? 'bg-white text-greenly-primary shadow-sm' : 'text-greenly-slate hover:bg-white/50'}`}>
              <Edit3 size={16} /> Enhanced Form
            </button>
          </div>
          <button className="btn-secondary flex items-center gap-2"><Download size={16} /> Export</button>
          <button className="btn-primary flex items-center gap-2"><Save size={16} /> Save Progress</button>
        </div>
      </div>
      <FrameworkProgressBar framework="CDP" completionPercentage={progress.percentage} totalFields={progress.total} completedFields={progress.completed} showDetails={true} size="md" />
    </div>
  </div>
);

const ModuleSidebar = ({ cdpData, activeModule, setActiveModule }) => (
  <div className="col-span-3">
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
      <h3 className="text-sm font-semibold text-greenly-charcoal mb-3 px-3">CDP Modules</h3>
      <nav className="space-y-1">
        {Object.entries(moduleConfig).map(([key, config]) => {
          const moduleFields = Object.values(cdpData[key]);
          const completedInModule = moduleFields.filter(f => f.completed).length;
          const totalInModule = moduleFields.length;
          const moduleProgress = totalInModule > 0 ? (completedInModule / totalInModule) * 100 : 0;

          return (
            <button key={key} onClick={() => setActiveModule(key)} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeModule === key ? 'bg-greenly-primary text-white' : 'text-greenly-charcoal hover:bg-greenly-light-gray'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{config.title}</span>
                {moduleProgress === 100 ? <CheckCircle2 className="w-4 h-4 text-greenly-sage" /> : <div className={`w-4 h-4 rounded-full border-2 ${activeModule === key ? 'border-white/50' : 'border-greenly-light-gray'}`} />}
              </div>
              <div className="flex items-center gap-2 text-xs opacity-75">
                <span>{completedInModule}/{totalInModule}</span>
                <div className="flex-1 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
                  <div className="h-1 bg-greenly-sage" style={{ width: `${moduleProgress}%` }} />
                </div>
              </div>
              {config.maxScore > 0 && <div className="text-xs opacity-75 mt-1">Max Score: {config.maxScore} pts</div>}
            </button>
          );
        })}
      </nav>
      <div className="mt-6 p-3 bg-greenly-light-blue rounded-lg border border-greenly-blue/30">
        <h4 className="text-xs font-semibold text-greenly-charcoal mb-2">CDP Scoring</h4>
        <div className="text-xs text-greenly-slate space-y-1">
          {['A: Leadership', 'B: Management', 'C: Awareness', 'D: Disclosure'].map(item => (
            <div key={item} className="flex justify-between"><span className="font-semibold">{item.split(':')[0]}:</span><span>{item.split(':')[1]}</span></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ChecklistView = ({ activeModule, cdpData, updateField }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="mb-6 pb-6 border-b border-greenly-light-gray">
      <div className="flex items-start gap-3">
        {React.createElement(moduleConfig[activeModule].icon, { className: `w-6 h-6 ${moduleConfig[activeModule].color}`, strokeWidth: 2 })}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-greenly-charcoal mb-1">{moduleConfig[activeModule].title}</h2>
          {moduleConfig[activeModule].maxScore > 0 && <p className="text-sm text-greenly-slate">Maximum score: {moduleConfig[activeModule].maxScore} points</p>}
        </div>
      </div>
    </div>
    <div className="space-y-6">
      {Object.entries(cdpData[activeModule]).map(([key, field]) => (
        <div key={key} className="space-y-2">
          <label className="flex items-center gap-3 text-sm font-medium text-greenly-charcoal">
            {field.completed ? <CheckCircle2 className="w-5 h-5 text-greenly-primary" /> : <Circle className="w-5 h-5 text-greenly-light-gray" />}
            <span className="flex-1"><span className="text-greenly-primary font-mono">{key.toUpperCase()}</span>: {field.name}</span>
          </label>
          <textarea value={field.value} onChange={(e) => updateField(activeModule, key, e.target.value)} placeholder={`Enter response for ${field.name}...`} rows={3} className="input-base w-full resize-y" />
        </div>
      ))}
    </div>
  </div>
);

const EnhancedFormView = ({ handleNewEntry }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="mb-6 pb-6 border-b border-greenly-light-gray">
      <h2 className="text-xl font-bold text-greenly-charcoal mb-2">Enhanced CDP Data Entry with AI Compliance</h2>
      <div className="flex items-start gap-2 text-sm text-greenly-slate">
        <Lightbulb className="w-4 h-4 mt-0.5 text-greenly-amber flex-shrink-0" />
        <p>Enter your climate disclosure data and receive real-time compliance validation against CDP scoring methodology. The system will analyze completeness, accuracy, and provide recommendations to improve your CDP score.</p>
      </div>
    </div>
    <ESGDataEntryForm framework="CDP" onSubmit={handleNewEntry} initialData={{}} />
  </div>
);

const CDPDataCollection = () => {
  const { cdpData, activeModule, setActiveModule, viewMode, setViewMode, progress, handleNewEntry, updateField } = useCDPData();

  return (
    <div className="min-h-screen bg-greenly-off-white">
      <Header progress={progress} viewMode={viewMode} setViewMode={setViewMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <ModuleSidebar cdpData={cdpData} activeModule={activeModule} setActiveModule={setActiveModule} />
          <div className="col-span-9">
            {viewMode === 'list' ? (
              <ChecklistView activeModule={activeModule} cdpData={cdpData} updateField={updateField} />
            ) : (
              <EnhancedFormView handleNewEntry={handleNewEntry} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CDPDataCollection;
