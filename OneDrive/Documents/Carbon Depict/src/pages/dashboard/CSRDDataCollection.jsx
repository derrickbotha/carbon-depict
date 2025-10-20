import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

/**
 * CSRD Data Collection Page
 * Corporate Sustainability Reporting Directive - ESRS Standards
 * Includes: ESRS 2 (General), ESRS E1-E5 (Environmental), ESRS S1-S4 (Social), ESRS G1 (Governance)
 */
const CSRDDataCollection = () => {
  const [csrdData, setCsrdData] = useState({
    // ESRS 2: General Disclosures (Cross-cutting)
    general: {
      'esrs2-sbm1': { name: 'Strategy, business model and value chain', value: '', completed: false },
      'esrs2-sbm2': { name: 'Interests and views of stakeholders', value: '', completed: false },
      'esrs2-sbm3': { name: 'Material impacts, risks and opportunities', value: '', completed: false },
      'esrs2-gov1': { name: 'Role of governance bodies', value: '', completed: false },
      'esrs2-gov2': { name: 'Information provided to governance bodies', value: '', completed: false },
      'esrs2-gov3': { name: 'Integration of sustainability performance', value: '', completed: false },
      'esrs2-gov4': { name: 'Statement on due diligence', value: '', completed: false },
      'esrs2-gov5': { name: 'Risk management and internal controls', value: '', completed: false },
    },
    // ESRS E1: Climate Change
    climateChange: {
      'e1-1': { name: 'Transition plan for climate change mitigation', value: '', completed: false },
      'e1-2': { name: 'Policies related to climate change mitigation and adaptation', value: '', completed: false },
      'e1-3': { name: 'Actions and resources related to climate change', value: '', completed: false },
      'e1-4': { name: 'Targets related to climate change mitigation and adaptation', value: '', completed: false },
      'e1-5': { name: 'Energy consumption and mix (total, renewable %)', value: '', completed: false },
      'e1-6': { name: 'Gross Scopes 1, 2, 3 and Total GHG emissions', value: '', completed: false },
      'e1-7': { name: 'GHG removals and carbon credits', value: '', completed: false },
      'e1-8': { name: 'Internal carbon pricing', value: '', completed: false },
      'e1-9': { name: 'Anticipated financial effects from material climate risks', value: '', completed: false },
    },
    // ESRS E2: Pollution
    pollution: {
      'e2-1': { name: 'Policies related to pollution', value: '', completed: false },
      'e2-2': { name: 'Actions and resources related to pollution', value: '', completed: false },
      'e2-3': { name: 'Targets related to pollution', value: '', completed: false },
      'e2-4': { name: 'Pollution of air, water and soil', value: '', completed: false },
      'e2-5': { name: 'Substances of concern and very high concern', value: '', completed: false },
      'e2-6': { name: 'Anticipated financial effects from pollution', value: '', completed: false },
    },
    // ESRS E3: Water and Marine Resources
    water: {
      'e3-1': { name: 'Policies related to water and marine resources', value: '', completed: false },
      'e3-2': { name: 'Actions and resources related to water', value: '', completed: false },
      'e3-3': { name: 'Targets related to water and marine resources', value: '', completed: false },
      'e3-4': { name: 'Water consumption', value: '', completed: false },
      'e3-5': { name: 'Anticipated financial effects from water risks', value: '', completed: false },
    },
    // ESRS E4: Biodiversity and Ecosystems
    biodiversity: {
      'e4-1': { name: 'Transition plan for biodiversity and ecosystems', value: '', completed: false },
      'e4-2': { name: 'Policies related to biodiversity and ecosystems', value: '', completed: false },
      'e4-3': { name: 'Actions and resources for biodiversity', value: '', completed: false },
      'e4-4': { name: 'Targets related to biodiversity and ecosystems', value: '', completed: false },
      'e4-5': { name: 'Impact metrics (site areas, species affected)', value: '', completed: false },
      'e4-6': { name: 'Anticipated financial effects from biodiversity impacts', value: '', completed: false },
    },
    // ESRS E5: Circular Economy
    circularEconomy: {
      'e5-1': { name: 'Policies related to resource use and circular economy', value: '', completed: false },
      'e5-2': { name: 'Actions and resources for circular economy', value: '', completed: false },
      'e5-3': { name: 'Targets related to resource use and circular economy', value: '', completed: false },
      'e5-4': { name: 'Resource inflows (materials, products)', value: '', completed: false },
      'e5-5': { name: 'Resource outflows (products, waste by type)', value: '', completed: false },
      'e5-6': { name: 'Anticipated financial effects from resource use', value: '', completed: false },
    },
    // ESRS S1: Own Workforce
    ownWorkforce: {
      's1-1': { name: 'Policies related to own workforce', value: '', completed: false },
      's1-2': { name: 'Processes for engaging with own workers', value: '', completed: false },
      's1-3': { name: 'Processes to remediate negative impacts on workforce', value: '', completed: false },
      's1-4': { name: 'Taking action on material impacts on own workforce', value: '', completed: false },
      's1-5': { name: 'Targets related to managing material impacts on workforce', value: '', completed: false },
      's1-6': { name: 'Characteristics of employees (headcount, gender, age)', value: '', completed: false },
      's1-7': { name: 'Characteristics of non-employee workers', value: '', completed: false },
      's1-8': { name: 'Collective bargaining coverage and social dialogue', value: '', completed: false },
      's1-9': { name: 'Diversity metrics', value: '', completed: false },
      's1-10': { name: 'Adequate wages', value: '', completed: false },
      's1-11': { name: 'Social protection', value: '', completed: false },
      's1-12': { name: 'Persons with disabilities', value: '', completed: false },
      's1-13': { name: 'Training and skills development metrics', value: '', completed: false },
      's1-14': { name: 'Health and safety metrics (work-related injuries, fatalities)', value: '', completed: false },
      's1-15': { name: 'Work-life balance metrics', value: '', completed: false },
    },
    // ESRS S2: Workers in Value Chain
    valueChainWorkers: {
      's2-1': { name: 'Policies related to value chain workers', value: '', completed: false },
      's2-2': { name: 'Processes for engaging with value chain workers', value: '', completed: false },
      's2-3': { name: 'Processes to remediate negative impacts on value chain', value: '', completed: false },
      's2-4': { name: 'Taking action on material impacts in value chain', value: '', completed: false },
      's2-5': { name: 'Targets related to managing impacts on value chain workers', value: '', completed: false },
    },
    // ESRS S3: Affected Communities
    communities: {
      's3-1': { name: 'Policies related to affected communities', value: '', completed: false },
      's3-2': { name: 'Processes for engaging with affected communities', value: '', completed: false },
      's3-3': { name: 'Processes to remediate negative impacts on communities', value: '', completed: false },
      's3-4': { name: 'Taking action on material impacts on communities', value: '', completed: false },
      's3-5': { name: 'Targets related to managing impacts on communities', value: '', completed: false },
    },
    // ESRS S4: Consumers and End-Users
    consumers: {
      's4-1': { name: 'Policies related to consumers and end-users', value: '', completed: false },
      's4-2': { name: 'Processes for engaging with consumers', value: '', completed: false },
      's4-3': { name: 'Processes to remediate negative impacts on consumers', value: '', completed: false },
      's4-4': { name: 'Taking action on material impacts on consumers', value: '', completed: false },
      's4-5': { name: 'Targets related to managing impacts on consumers', value: '', completed: false },
    },
    // ESRS G1: Business Conduct
    businessConduct: {
      'g1-1': { name: 'Corporate culture and business conduct policies', value: '', completed: false },
      'g1-2': { name: 'Management of relationships with suppliers', value: '', completed: false },
      'g1-3': { name: 'Prevention and detection of corruption and bribery', value: '', completed: false },
      'g1-4': { name: 'Confirmed incidents of corruption or bribery', value: '', completed: false },
      'g1-5': { name: 'Political influence and lobbying activities', value: '', completed: false },
      'g1-6': { name: 'Payment practices (payment terms to suppliers)', value: '', completed: false },
    },
  });

  const [activeModule, setActiveModule] = useState('general');

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

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
  };

  const progress = calculateProgress();

  const updateField = (module, fieldKey, value) => {
    setCsrdData(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [fieldKey]: {
          ...prev[module][fieldKey],
          value,
          completed: value.trim() !== '',
        },
      },
    }));
  };

  const moduleConfig = {
    general: {
      title: 'ESRS 2: General Disclosures',
      icon: Globe,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      description: 'Cross-cutting disclosures on governance, strategy, and materiality',
    },
    climateChange: {
      title: 'ESRS E1: Climate Change',
      icon: Leaf,
      color: 'text-teal',
      bgColor: 'bg-teal-50',
      description: 'GHG emissions, energy, transition plan, and climate risks',
    },
    pollution: {
      title: 'ESRS E2: Pollution',
      icon: Factory,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Air, water, soil pollution and substances of concern',
    },
    water: {
      title: 'ESRS E3: Water & Marine',
      icon: Droplet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Water consumption, discharge, and marine resources',
    },
    biodiversity: {
      title: 'ESRS E4: Biodiversity',
      icon: TreeDeciduous,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Ecosystems, species, and nature-related impacts',
    },
    circularEconomy: {
      title: 'ESRS E5: Circular Economy',
      icon: Recycle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Resource use, waste management, and circularity',
    },
    ownWorkforce: {
      title: 'ESRS S1: Own Workforce',
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Working conditions, diversity, health & safety',
    },
    valueChainWorkers: {
      title: 'ESRS S2: Value Chain Workers',
      icon: Building2,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Workers in upstream and downstream value chain',
    },
    communities: {
      title: 'ESRS S3: Communities',
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: 'Impacts on affected and local communities',
    },
    consumers: {
      title: 'ESRS S4: Consumers',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Product safety, privacy, and consumer rights',
    },
    businessConduct: {
      title: 'ESRS G1: Business Conduct',
      icon: Shield,
      color: 'text-midnight',
      bgColor: 'bg-gray-50',
      description: 'Ethics, anti-corruption, lobbying, supplier relations',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/esg"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-midnight">CSRD Sustainability Statement</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Corporate Sustainability Reporting Directive - European Sustainability Reporting Standards (ESRS)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="CSRD"
            completionPercentage={progress.percentage}
            totalFields={progress.total}
            completedFields={progress.completed}
            showDetails={true}
            size="md"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ESRS Modules Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(moduleConfig).map(([key, config]) => {
            const Icon = config.icon;
            const moduleFields = Object.values(csrdData[key]);
            const completedInModule = moduleFields.filter(f => f.completed).length;
            const totalInModule = moduleFields.length;
            const moduleProgress = (completedInModule / totalInModule) * 100;

            return (
              <button
                key={key}
                onClick={() => setActiveModule(key)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activeModule === key
                    ? 'border-teal bg-teal bg-opacity-5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <h3 className="font-semibold text-midnight text-sm mb-1">
                  {config.title.split(':')[1] || config.title}
                </h3>
                <div className="text-xs text-gray-600 mb-2">
                  {completedInModule}/{totalInModule} fields
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-teal transition-all"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Double Materiality Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-midnight mb-1">Double Materiality Assessment Required</h3>
            <p className="text-sm text-gray-700">
              CSRD requires assessment of both <strong>impact materiality</strong> (inside-out: how your organization affects people and environment) 
              and <strong>financial materiality</strong> (outside-in: how sustainability matters affect your financial performance). 
              Only material topics require full disclosure.
            </p>
          </div>
        </div>

        {/* Active Module Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              {React.createElement(moduleConfig[activeModule].icon, {
                className: `w-6 h-6 ${moduleConfig[activeModule].color}`,
              })}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-midnight mb-2">
                  {moduleConfig[activeModule].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {moduleConfig[activeModule].description}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {Object.entries(csrdData[activeModule]).map(([key, field]) => (
              <div key={key} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                  {field.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                  <span className="flex-1">
                    <span className="text-teal">{key.toUpperCase()}</span>: {field.name}
                  </span>
                </label>
                <textarea
                  value={field.value}
                  onChange={(e) => updateField(activeModule, key, e.target.value)}
                  placeholder={`Describe ${field.name.toLowerCase()}...`}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                />
                {field.completed && (
                  <p className="text-xs text-teal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Disclosure completed
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRDDataCollection;
