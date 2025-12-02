// Cache bust 2025-11-05
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle, 
  Leaf, 
  Users, 
  Shield, 
  Factory, 
  Droplet, 
  TreeDeciduous, 
  Recycle, 
  Zap, 
  Heart, 
  Globe, 
  Building2, 
  AlertTriangle, 
  Lightbulb, 
  List, 
  Edit3 
} from 'lucide-react';
import FrameworkProgressBar from '@components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '@components/ESGDataEntryForm';
import apiClient from '@utils/api';

const initialCsrdData = {
    general: { 'esrs2-sbm1': { name: 'Strategy, business model and value chain', value: '', completed: false }, 'esrs2-sbm2': { name: 'Interests and views of stakeholders', value: '', completed: false }, 'esrs2-sbm3': { name: 'Material impacts, risks and opportunities', value: '', completed: false }, 'esrs2-gov1': { name: 'Role of governance bodies', value: '', completed: false }, 'esrs2-gov2': { name: 'Information provided to governance bodies', value: '', completed: false }, 'esrs2-gov3': { name: 'Integration of sustainability performance', value: '', completed: false }, 'esrs2-gov4': { name: 'Statement on due diligence', value: '', completed: false }, 'esrs2-gov5': { name: 'Risk management and internal controls', value: '', completed: false }, },
    climateChange: { 'e1-1': { name: 'Transition plan for climate change mitigation', value: '', completed: false }, 'e1-2': { name: 'Policies related to climate change mitigation and adaptation', value: '', completed: false }, 'e1-3': { name: 'Actions and resources related to climate change', value: '', completed: false }, 'e1-4': { name: 'Targets related to climate change mitigation and adaptation', value: '', completed: false }, 'e1-5': { name: 'Energy consumption and mix (total, renewable %)', value: '', completed: false }, 'e1-6': { name: 'Gross Scopes 1, 2, 3 and Total GHG emissions', value: '', completed: false }, 'e1-7': { name: 'GHG removals and carbon credits', value: '', completed: false }, 'e1-8': { name: 'Internal carbon pricing', value: '', completed: false }, 'e1-9': { name: 'Anticipated financial effects from material climate risks', value: '', completed: false }, },
    pollution: { 'e2-1': { name: 'Policies related to pollution', value: '', completed: false }, 'e2-2': { name: 'Actions and resources related to pollution', value: '', completed: false }, 'e2-3': { name: 'Targets related to pollution', value: '', completed: false }, 'e2-4': { name: 'Pollution of air, water and soil', value: '', completed: false }, 'e2-5': { name: 'Substances of concern and very high concern', value: '', completed: false }, 'e2-6': { name: 'Anticipated financial effects from pollution', value: '', completed: false }, },
    water: { 'e3-1': { name: 'Policies related to water and marine resources', value: '', completed: false }, 'e3-2': { name: 'Actions and resources related to water', value: '', completed: false }, 'e3-3': { name: 'Targets related to water and marine resources', value: '', completed: false }, 'e3-4': { name: 'Water consumption', value: '', completed: false }, 'e3-5': { name: 'Anticipated financial effects from water risks', value: '', completed: false }, },
    biodiversity: { 'e4-1': { name: 'Transition plan for biodiversity and ecosystems', value: '', completed: false }, 'e4-2': { name: 'Policies related to biodiversity and ecosystems', value: '', completed: false }, 'e4-3': { name: 'Actions and resources for biodiversity', value: '', completed: false }, 'e4-4': { name: 'Targets related to biodiversity and ecosystems', value: '', completed: false }, 'e4-5': { name: 'Impact metrics (site areas, species affected)', value: '', completed: false }, 'e4-6': { name: 'Anticipated financial effects from biodiversity impacts', value: '', completed: false }, },
    circularEconomy: { 'e5-1': { name: 'Policies related to resource use and circular economy', value: '', completed: false }, 'e5-2': { name: 'Actions and resources for circular economy', value: '', completed: false }, 'e5-3': { name: 'Targets related to resource use and circular economy', value: '', completed: false }, 'e5-4': { name: 'Resource inflows (materials, products)', value: '', completed: false }, 'e5-5': { name: 'Resource outflows (products, waste by type)', value: '', completed: false }, 'e5-6': { name: 'Anticipated financial effects from resource use', value: '', completed: false }, },
    ownWorkforce: { 's1-1': { name: 'Policies related to own workforce', value: '', completed: false }, 's1-2': { name: 'Processes for engaging with own workers', value: '', completed: false }, 's1-3': { name: 'Processes to remediate negative impacts on workforce', value: '', completed: false }, 's1-4': { name: 'Taking action on material impacts on own workforce', value: '', completed: false }, 's1-5': { name: 'Targets related to managing material impacts on workforce', value: '', completed: false }, 's1-6': { name: 'Characteristics of employees (headcount, gender, age)', value: '', completed: false }, 's1-7': { name: 'Characteristics of non-employee workers', value: '', completed: false }, 's1-8': { name: 'Collective bargaining coverage and social dialogue', value: '', completed: false }, 's1-9': { name: 'Diversity metrics', value: '', completed: false }, 's1-10': { name: 'Adequate wages', value: '', completed: false }, 's1-11': { name: 'Social protection', value: '', completed: false }, 's1-12': { name: 'Persons with disabilities', value: '', completed: false }, 's1-13': { name: 'Training and skills development metrics', value: '', completed: false }, 's1-14': { name: 'Health and safety metrics (work-related injuries, fatalities)', value: '', completed: false }, 's1-15': { name: 'Work-life balance metrics', value: '', completed: false }, },
    valueChainWorkers: { 's2-1': { name: 'Policies related to value chain workers', value: '', completed: false }, 's2-2': { name: 'Processes for engaging with value chain workers', value: '', completed: false }, 's2-3': { name: 'Processes to remediate negative impacts on value chain', value: '', completed: false }, 's2-4': { name: 'Taking action on material impacts in value chain', value: '', completed: false }, 's2-5': { name: 'Targets related to managing impacts on value chain workers', value: '', completed: false }, },
    communities: { 's3-1': { name: 'Policies related to affected communities', value: '', completed: false }, 's3-2': { name: 'Processes for engaging with affected communities', value: '', completed: false }, 's3-3': { name: 'Processes to remediate negative impacts on communities', value: '', completed: false }, 's3-4': { name: 'Taking action on material impacts on communities', value: '', completed: false }, 's3-5': { name: 'Targets related to managing impacts on communities', value: '', completed: false }, },
    consumers: { 's4-1': { name: 'Policies related to consumers and end-users', value: '', completed: false }, 's4-2': { name: 'Processes for engaging with consumers', value: '', completed: false }, 's4-3': { name: 'Processes to remediate negative impacts on consumers', value: '', completed: false }, 's4-4': { name: 'Taking action on material impacts on consumers', value: '', completed: false }, 's4-5': { name: 'Targets related to managing impacts on consumers', value: '', completed: false }, },
    businessConduct: { 'g1-1': { name: 'Corporate culture and business conduct policies', value: '', completed: false }, 'g1-2': { name: 'Management of relationships with suppliers', value: '', completed: false }, 'g1-3': { name: 'Prevention and detection of corruption and bribery', value: '', completed: false }, 'g1-4': { name: 'Confirmed incidents of corruption or bribery', value: '', completed: false }, 'g1-5': { name: 'Political influence and lobbying activities', value: '', completed: false }, 'g1-6': { name: 'Payment practices (payment terms to suppliers)', value: '', completed: false }, },
};

const moduleConfig = {
    general: { title: 'ESRS 2: General Disclosures', icon: Globe, color: 'text-greenly-slate', bgColor: 'bg-greenly-light-gray', description: 'Cross-cutting disclosures on governance, strategy, and materiality', },
    climateChange: { title: 'ESRS E1: Climate Change', icon: Leaf, color: 'text-greenly-primary', bgColor: 'bg-greenly-light-green', description: 'GHG emissions, energy, transition plan, and climate risks', },
    pollution: { title: 'ESRS E2: Pollution', icon: Factory, color: 'text-greenly-purple', bgColor: 'bg-greenly-light-purple', description: 'Air, water, soil pollution and substances of concern', },
    water: { title: 'ESRS E3: Water & Marine', icon: Droplet, color: 'text-greenly-blue', bgColor: 'bg-greenly-light-blue', description: 'Water consumption, discharge, and marine resources', },
    biodiversity: { title: 'ESRS E4: Biodiversity', icon: TreeDeciduous, color: 'text-greenly-teal', bgColor: 'bg-greenly-light-teal', description: 'Ecosystems, species, and nature-related impacts', },
    circularEconomy: { title: 'ESRS E5: Circular Economy', icon: Recycle, color: 'text-greenly-amber', bgColor: 'bg-greenly-light-amber', description: 'Resource use, waste management, and circularity', },
    ownWorkforce: { title: 'ESRS S1: Own Workforce', icon: Users, color: 'text-greenly-indigo', bgColor: 'bg-greenly-light-indigo', description: 'Working conditions, diversity, health & safety', },
    valueChainWorkers: { title: 'ESRS S2: Value Chain Workers', icon: Building2, color: 'text-greenly-cyan', bgColor: 'bg-greenly-light-cyan', description: 'Workers in upstream and downstream value chain', },
    communities: { title: 'ESRS S3: Communities', icon: Heart, color: 'text-greenly-pink', bgColor: 'bg-greenly-light-pink', description: 'Impacts on affected and local communities', },
    consumers: { title: 'ESRS S4: Consumers', icon: Users, color: 'text-greenly-orange', bgColor: 'bg-greenly-light-orange', description: 'Product safety, privacy, and consumer rights', },
    businessConduct: { title: 'ESRS G1: Business Conduct', icon: Shield, color: 'text-greenly-charcoal', bgColor: 'bg-greenly-light-gray', description: 'Ethics, anti-corruption, lobbying, supplier relations', },
};

const useCSRDData = () => {
  const [csrdData, setCsrdData] = useState(initialCsrdData);
  const [activeModule, setActiveModule] = useState('general');
  const [viewMode, setViewMode] = useState('list');

  const progress = useMemo(() => {
    let totalFields = 0, completedFields = 0;
    Object.values(csrdData).forEach(module => {
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
  }, [csrdData]);

  const handleNewEntry = useCallback(async (formData) => {
    try {
      const response = await apiClient.esgMetrics.create({ ...formData, framework: 'CSRD', status: 'draft' });
      const { disclosure } = formData;
      if (csrdData[activeModule] && csrdData[activeModule][disclosure]) {
        updateField(activeModule, disclosure, formData.value);
      }
      alert('Entry saved successfully as draft!');
      return response.data;
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
      return null;
    }
  }, [activeModule, csrdData]);

  const updateField = useCallback((module, fieldKey, value) => {
    setCsrdData(prev => ({
      ...prev,
      [module]: { ...prev[module], [fieldKey]: { ...prev[module][fieldKey], value, completed: value.trim() !== '' } },
    }));
  }, []);

  return { csrdData, activeModule, setActiveModule, viewMode, setViewMode, progress, handleNewEntry, updateField };
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
            <h1 className="text-2xl font-bold text-greenly-charcoal">CSRD Sustainability Statement</h1>
            <p className="text-sm text-greenly-slate mt-1">European Sustainability Reporting Standards (ESRS)</p>
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
      <FrameworkProgressBar framework="CSRD" completionPercentage={progress.percentage} totalFields={progress.total} completedFields={progress.completed} showDetails={true} size="md" />
    </div>
  </div>
);

const ModuleGrid = ({ csrdData, activeModule, setActiveModule }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
    {Object.entries(moduleConfig).map(([key, config]) => {
      const moduleFields = Object.values(csrdData[key]);
      const completedInModule = moduleFields.filter(f => f.completed).length;
      const totalInModule = moduleFields.length;
      const moduleProgress = totalInModule > 0 ? (completedInModule / totalInModule) * 100 : 0;
      return (
        <button key={key} onClick={() => setActiveModule(key)} className={`p-4 rounded-lg border-2 transition-all text-left ${activeModule === key ? 'border-greenly-primary bg-greenly-light-green' : 'border-greenly-light-gray bg-white hover:border-greenly-light-gray-dark'}`}>
          <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center mb-3`}>
            <config.icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <h3 className="font-semibold text-greenly-charcoal text-sm mb-1">{config.title.split(':')[1] || config.title}</h3>
          <div className="text-xs text-greenly-slate mb-2">{completedInModule}/{totalInModule} fields</div>
          <div className="h-1.5 bg-greenly-light-gray rounded-full overflow-hidden">
            <div className="h-1.5 bg-greenly-primary transition-all" style={{ width: `${moduleProgress}%` }} />
          </div>
        </button>
      );
    })}
  </div>
);

const MaterialityNotice = () => (
  <div className="bg-greenly-light-amber border border-greenly-amber/50 rounded-lg p-4 mb-6 flex items-start gap-4">
    <AlertTriangle className="w-5 h-5 text-greenly-amber mt-0.5 flex-shrink-0" />
    <div>
      <h3 className="font-semibold text-greenly-charcoal mb-1">Double Materiality Assessment Required</h3>
      <p className="text-sm text-greenly-slate">
        CSRD requires assessment of both <strong>impact materiality</strong> (inside-out: how your organization affects people and environment) and <strong>financial materiality</strong> (outside-in: how sustainability matters affect your financial performance). Only material topics require full disclosure.
      </p>
    </div>
  </div>
);

const ChecklistView = ({ activeModule, csrdData, updateField }) => {
  const ActiveIcon = moduleConfig[activeModule].icon;
  return (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="mb-6 pb-6 border-b border-greenly-light-gray">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${moduleConfig[activeModule].bgColor} flex items-center justify-center`}>
            <ActiveIcon className={`w-5 h-5 ${moduleConfig[activeModule].color}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-greenly-charcoal mb-1">{moduleConfig[activeModule].title}</h2>
          <p className="text-sm text-greenly-slate">{moduleConfig[activeModule].description}</p>
        </div>
      </div>
    </div>
    <div className="space-y-6">
      {Object.entries(csrdData[activeModule]).map(([key, field]) => (
        <div key={key} className="space-y-2">
          <label className="flex items-center gap-3 text-sm font-medium text-greenly-charcoal">
            {field.completed ? <CheckCircle2 className="w-5 h-5 text-greenly-primary" /> : <Circle className="w-5 h-5 text-greenly-light-gray" />}
            <span className="flex-1"><span className="text-greenly-primary font-mono">{key.toUpperCase()}</span>: {field.name}</span>
          </label>
          <textarea value={field.value} onChange={(e) => updateField(activeModule, key, e.target.value)} placeholder={`Describe ${field.name.toLowerCase()}...`} rows={4} className="input-base w-full resize-y" />
        </div>
      ))}
    </div>
  </div>
  );
};

const EnhancedFormView = ({ handleNewEntry }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="mb-6 pb-6 border-b border-greenly-light-gray">
      <h2 className="text-xl font-bold text-greenly-charcoal mb-2">Enhanced CSRD Data Entry with AI Compliance</h2>
      <div className="flex items-start gap-2 text-sm text-greenly-slate">
        <Lightbulb className="w-4 h-4 mt-0.5 text-greenly-amber flex-shrink-0" />
        <p>Enter your sustainability disclosure data and receive real-time compliance validation against ESRS requirements. The system will assess double materiality alignment and completeness.</p>
      </div>
    </div>
    <ESGDataEntryForm framework="CSRD" onSubmit={handleNewEntry} initialData={{}} />
  </div>
);

const CSRDDataCollection = () => {
  const { csrdData, activeModule, setActiveModule, viewMode, setViewMode, progress, handleNewEntry, updateField } = useCSRDData();

  return (
    <div className="min-h-screen bg-greenly-off-white">
      <Header progress={progress} viewMode={viewMode} setViewMode={setViewMode} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModuleGrid csrdData={csrdData} activeModule={activeModule} setActiveModule={setActiveModule} />
        <MaterialityNotice />
        {viewMode === 'list' ? (
          <ChecklistView activeModule={activeModule} csrdData={csrdData} updateField={updateField} />
        ) : (
          <EnhancedFormView handleNewEntry={handleNewEntry} />
        )}
      </main>
    </div>
  );
};

export default CSRDDataCollection;
