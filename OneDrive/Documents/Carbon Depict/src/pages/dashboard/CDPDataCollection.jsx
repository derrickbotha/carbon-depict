import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

/**
 * CDP Data Collection Page
 * Carbon Disclosure Project - Climate Change Questionnaire
 * 12 modules with scoring guidance
 */
const CDPDataCollection = () => {
  const [cdpData, setCdpData] = useState({
    // C0: Introduction
    introduction: {
      'c0.1': { name: 'Reporting year start and end dates', value: '', completed: false },
      'c0.2': { name: 'State if submitted in previous years', value: '', completed: false },
      'c0.3': { name: 'Select reporting boundary', value: '', completed: false },
      'c0.4': { name: 'Organizational activities', value: '', completed: false },
      'c0.5': { name: 'Currency used for financial data', value: '', completed: false },
    },
    // C1: Governance
    governance: {
      'c1.1': { name: 'Board-level oversight of climate issues', value: '', completed: false },
      'c1.1a': { name: 'Board responsibilities for climate', value: '', completed: false },
      'c1.1b': { name: 'Frequency of board review', value: '', completed: false },
      'c1.2': { name: 'Management-level responsibility', value: '', completed: false },
      'c1.2a': { name: 'Management position with climate responsibility', value: '', completed: false },
      'c1.3': { name: 'Incentives for managing climate issues', value: '', completed: false },
      'c1.3a': { name: 'Details of incentive schemes', value: '', completed: false },
    },
    // C2: Risks and Opportunities
    risksOpportunities: {
      'c2.1': { name: 'Risk management processes', value: '', completed: false },
      'c2.1a': { name: 'Board oversight of risk management', value: '', completed: false },
      'c2.1b': { name: 'Integration into overall risk management', value: '', completed: false },
      'c2.2': { name: 'Climate-related risks with potential impact', value: '', completed: false },
      'c2.2a': { name: 'Transition risks identified', value: '', completed: false },
      'c2.2b': { name: 'Physical risks identified', value: '', completed: false },
      'c2.3': { name: 'Climate-related opportunities', value: '', completed: false },
      'c2.3a': { name: 'Opportunities identified and pursued', value: '', completed: false },
      'c2.4': { name: 'Climate scenario analysis', value: '', completed: false },
      'c2.4a': { name: 'Details of scenario analysis (2°C, 1.5°C)', value: '', completed: false },
    },
    // C3: Business Strategy
    businessStrategy: {
      'c3.1': { name: 'Climate change integrated into strategy', value: '', completed: false },
      'c3.1a': { name: 'Strategic plans that consider climate', value: '', completed: false },
      'c3.1b': { name: 'Aspects of climate change influencing strategy', value: '', completed: false },
      'c3.2': { name: 'Climate transition plan', value: '', completed: false },
      'c3.2a': { name: 'Details of transition plan (targets, actions)', value: '', completed: false },
      'c3.3': { name: 'Business objectives accounting for climate', value: '', completed: false },
      'c3.4': { name: 'Scenario analysis informing strategy', value: '', completed: false },
      'c3.5': { name: 'Products/services affected by climate regulation', value: '', completed: false },
    },
    // C4: Targets and Performance
    targetsPerformance: {
      'c4.1': { name: 'Emission reduction initiatives in reporting year', value: '', completed: false },
      'c4.1a': { name: 'Details of initiatives (type, scope, savings)', value: '', completed: false },
      'c4.1b': { name: 'Emission reduction per initiative', value: '', completed: false },
      'c4.2': { name: 'Emission reduction targets', value: '', completed: false },
      'c4.2a': { name: 'Target details (baseline, target year, % reduction)', value: '', completed: false },
      'c4.2b': { name: 'Progress against targets', value: '', completed: false },
      'c4.2c': { name: 'Targets aligned with net-zero trajectory', value: '', completed: false },
      'c4.3': { name: 'Other climate-related targets (renewable energy, etc.)', value: '', completed: false },
      'c4.3a': { name: 'Details of other targets', value: '', completed: false },
    },
    // C5: Emissions Methodology
    emissionsMethodology: {
      'c5.1': { name: 'Base year and emissions in base year', value: '', completed: false },
      'c5.1a': { name: 'Scope 1 base year emissions', value: '', completed: false },
      'c5.1b': { name: 'Scope 2 base year emissions', value: '', completed: false },
      'c5.1c': { name: 'Scope 3 base year emissions', value: '', completed: false },
      'c5.2': { name: 'Consolidation approach', value: '', completed: false },
      'c5.2a': { name: 'Reporting boundary details', value: '', completed: false },
    },
    // C6: Emissions Data
    emissionsData: {
      'c6.1': { name: 'Scope 1 emissions (tCO2e)', value: '', completed: false },
      'c6.2': { name: 'Scope 2 emissions (location and market-based)', value: '', completed: false },
      'c6.3': { name: 'Scope 3 emissions by category (15 categories)', value: '', completed: false },
      'c6.4': { name: 'Biogenic emissions', value: '', completed: false },
      'c6.5': { name: 'Emissions intensity metrics', value: '', completed: false },
      'c6.7': { name: 'Emission breakdowns (country, business division, etc.)', value: '', completed: false },
      'c6.10': { name: 'Gross global Scope 1 emissions breakdown by GHG type', value: '', completed: false },
    },
    // C7: Emissions Breakdown
    emissionsBreakdown: {
      'c7.1': { name: 'Emissions breakdown by GHG protocol scope', value: '', completed: false },
      'c7.1a': { name: 'Scope 1 breakdown by GHG type (CO2, CH4, N2O, etc.)', value: '', completed: false },
      'c7.2': { name: 'Scope 2 emissions breakdown', value: '', completed: false },
      'c7.3': { name: 'Scope 3 emissions breakdown', value: '', completed: false },
      'c7.5': { name: 'Emissions performance against previous year', value: '', completed: false },
      'c7.6': { name: 'Scope 1 emissions intensities', value: '', completed: false },
      'c7.7': { name: 'Scope 2 emissions intensities', value: '', completed: false },
      'c7.9': { name: 'Emissions reduction initiatives impact', value: '', completed: false },
    },
    // C8: Energy
    energy: {
      'c8.1': { name: 'Electricity consumption (MWh)', value: '', completed: false },
      'c8.2': { name: 'Energy-related activities (renewable procurement, etc.)', value: '', completed: false },
      'c8.2a': { name: 'Renewable electricity consumed (MWh)', value: '', completed: false },
      'c8.2b': { name: 'Fuel consumption (MWh)', value: '', completed: false },
      'c8.2c': { name: 'Steam, heating, and cooling consumption', value: '', completed: false },
      'c8.2d': { name: 'Total energy consumption breakdown', value: '', completed: false },
      'c8.2e': { name: 'Renewable energy certificates (RECs)', value: '', completed: false },
    },
    // C9: Additional Metrics
    additionalMetrics: {
      'c9.1': { name: 'Other climate-related metrics (water, waste, etc.)', value: '', completed: false },
      'c9.1a': { name: 'Metrics details and methodology', value: '', completed: false },
    },
    // C10: Verification
    verification: {
      'c10.1': { name: 'Third-party verification of emissions', value: '', completed: false },
      'c10.1a': { name: 'Scope 1 verification level', value: '', completed: false },
      'c10.1b': { name: 'Scope 2 verification level', value: '', completed: false },
      'c10.1c': { name: 'Scope 3 verification level', value: '', completed: false },
      'c10.2': { name: 'Other information verified', value: '', completed: false },
    },
    // C11: Carbon Pricing
    carbonPricing: {
      'c11.1': { name: 'Price on carbon (carbon tax, ETS, internal)', value: '', completed: false },
      'c11.1a': { name: 'Internal carbon price details ($/tCO2e)', value: '', completed: false },
      'c11.1b': { name: 'Carbon tax details', value: '', completed: false },
      'c11.1c': { name: 'Emissions trading scheme participation', value: '', completed: false },
      'c11.2': { name: 'Projects generating carbon credits', value: '', completed: false },
      'c11.3': { name: 'Engagement with policy makers on carbon pricing', value: '', completed: false },
    },
    // C12: Engagement
    engagement: {
      'c12.1': { name: 'Value chain engagement on climate', value: '', completed: false },
      'c12.1a': { name: 'Suppliers engaged (% of procurement spend)', value: '', completed: false },
      'c12.1b': { name: 'Customer engagement activities', value: '', completed: false },
      'c12.1d': { name: 'Other value chain engagement', value: '', completed: false },
      'c12.2': { name: 'Employee engagement on climate', value: '', completed: false },
      'c12.3': { name: 'Public policy engagement', value: '', completed: false },
      'c12.3a': { name: 'Trade associations and climate positions', value: '', completed: false },
      'c12.4': { name: 'Collaborative initiatives', value: '', completed: false },
    },
  });

  const [activeModule, setActiveModule] = useState('introduction');

  const calculateProgress = () => {
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
  };

  const progress = calculateProgress();

  const updateField = (module, fieldKey, value) => {
    setCdpData(prev => ({
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
    introduction: { title: 'C0: Introduction', icon: FileText, color: 'text-gray-700', maxScore: 0 },
    governance: { title: 'C1: Governance', icon: Shield, color: 'text-indigo-600', maxScore: 10 },
    risksOpportunities: { title: 'C2: Risks & Opportunities', icon: TrendingUp, color: 'text-red-600', maxScore: 15 },
    businessStrategy: { title: 'C3: Business Strategy', icon: Target, color: 'text-purple-600', maxScore: 12 },
    targetsPerformance: { title: 'C4: Targets & Performance', icon: BarChart3, color: 'text-teal', maxScore: 15 },
    emissionsMethodology: { title: 'C5: Methodology', icon: Lightbulb, color: 'text-amber-600', maxScore: 6 },
    emissionsData: { title: 'C6: Emissions Data', icon: Cloud, color: 'text-blue-600', maxScore: 12 },
    emissionsBreakdown: { title: 'C7: Breakdown', icon: Factory, color: 'text-gray-600', maxScore: 8 },
    energy: { title: 'C8: Energy', icon: Leaf, color: 'text-green-600', maxScore: 8 },
    additionalMetrics: { title: 'C9: Metrics', icon: DollarSign, color: 'text-cyan-600', maxScore: 4 },
    verification: { title: 'C10: Verification', icon: Award, color: 'text-pink-600', maxScore: 6 },
    carbonPricing: { title: 'C11: Carbon Pricing', icon: DollarSign, color: 'text-orange-600', maxScore: 8 },
    engagement: { title: 'C12: Engagement', icon: Users, color: 'text-purple-600', maxScore: 10 },
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
                <h1 className="text-2xl font-bold text-midnight">CDP Climate Change Questionnaire</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Carbon Disclosure Project - 12 Modules with Scoring Guidance (A to D-)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Response
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="CDP"
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
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-midnight mb-3">CDP Modules</h3>
              <nav className="space-y-1">
                {Object.entries(moduleConfig).map(([key, config]) => {
                  const moduleFields = Object.values(cdpData[key]);
                  const completedInModule = moduleFields.filter(f => f.completed).length;
                  const totalInModule = moduleFields.length;
                  const moduleProgress = (completedInModule / totalInModule) * 100;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveModule(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeModule === key
                          ? 'bg-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{config.title}</span>
                        {moduleProgress === 100 ? (
                          <CheckCircle2 className="w-4 h-4 text-mint" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span>{completedInModule}/{totalInModule}</span>
                        <div className="flex-1 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div
                            className="h-1 bg-mint"
                            style={{ width: `${moduleProgress}%` }}
                          />
                        </div>
                      </div>
                      {config.maxScore > 0 && (
                        <div className="text-xs opacity-75 mt-1">
                          Max Score: {config.maxScore} points
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* CDP Scoring Info */}
              <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xs font-semibold text-midnight mb-2">CDP Scoring</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>A:</span>
                    <span className="font-semibold">Leadership</span>
                  </div>
                  <div className="flex justify-between">
                    <span>B:</span>
                    <span className="font-semibold">Management</span>
                  </div>
                  <div className="flex justify-between">
                    <span>C:</span>
                    <span className="font-semibold">Awareness</span>
                  </div>
                  <div className="flex justify-between">
                    <span>D:</span>
                    <span className="font-semibold">Disclosure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9">
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
                    {moduleConfig[activeModule].maxScore > 0 && (
                      <p className="text-sm text-gray-600">
                        Maximum score: {moduleConfig[activeModule].maxScore} points
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(cdpData[activeModule]).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                      {field.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className="flex-1">
                        <span className="text-teal font-mono">{key.toUpperCase()}</span>: {field.name}
                      </span>
                    </label>
                    <textarea
                      value={field.value}
                      onChange={(e) => updateField(activeModule, key, e.target.value)}
                      placeholder={`Enter response for ${field.name}...`}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CDPDataCollection;
