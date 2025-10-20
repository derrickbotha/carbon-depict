import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Lightbulb,
  BookOpen,
  Shield,
  TrendingUp,
  AlertTriangle,
  Target
} from 'lucide-react';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

/**
 * TCFD Data Collection Page
 * Task Force on Climate-related Financial Disclosures
 * Four pillars: Governance, Strategy, Risk Management, Metrics & Targets
 */
const TCFDDataCollection = () => {
  const [tcfdData, setTcfdData] = useState({
    // Pillar 1: Governance
    governance: {
      'gov-a': { name: "Board's oversight of climate risks and opportunities", value: '', completed: false },
      'gov-b': { name: "Management's role in assessing climate risks and opportunities", value: '', completed: false },
    },
    // Pillar 2: Strategy
    strategy: {
      'strat-a': { name: 'Climate risks and opportunities identified (short, medium, long-term)', value: '', completed: false },
      'strat-b': { name: 'Impact of climate risks on business, strategy, and financial planning', value: '', completed: false },
      'strat-c': { name: 'Resilience of strategy under different climate scenarios (2°C, 1.5°C)', value: '', completed: false },
    },
    // Pillar 3: Risk Management
    riskManagement: {
      'risk-a': { name: 'Processes for identifying and assessing climate risks', value: '', completed: false },
      'risk-b': { name: 'Processes for managing climate risks', value: '', completed: false },
      'risk-c': { name: 'Integration of climate risk processes into overall risk management', value: '', completed: false },
    },
    // Pillar 4: Metrics and Targets
    metricsTargets: {
      'met-a': { name: 'Metrics used to assess climate risks and opportunities', value: '', completed: false },
      'met-b': { name: 'Scope 1, 2, and 3 GHG emissions', value: '', completed: false },
      'met-c': { name: 'Targets used to manage climate risks and performance against targets', value: '', completed: false },
    },
  });

  const [activeSection, setActiveSection] = useState('governance');

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    Object.values(tcfdData).forEach(section => {
      Object.values(section).forEach(field => {
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

  const updateField = (section, fieldKey, value) => {
    setTcfdData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldKey]: {
          ...prev[section][fieldKey],
          value,
          completed: value.trim() !== '',
        },
      },
    }));
  };

  const sectionConfig = {
    governance: {
      title: 'Governance',
      icon: Shield,
      description: "Describe the organization's governance around climate-related risks and opportunities",
      color: 'text-blue-600',
    },
    strategy: {
      title: 'Strategy',
      icon: TrendingUp,
      description: 'Disclose actual and potential impacts of climate risks on business strategy',
      color: 'text-teal',
    },
    riskManagement: {
      title: 'Risk Management',
      icon: AlertTriangle,
      description: 'Describe processes for identifying, assessing, and managing climate risks',
      color: 'text-cedar',
    },
    metricsTargets: {
      title: 'Metrics & Targets',
      icon: Target,
      description: 'Disclose metrics and targets used to assess climate risks and opportunities',
      color: 'text-midnight',
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
                <h1 className="text-2xl font-bold text-midnight">TCFD Disclosure</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Task Force on Climate-related Financial Disclosures - 4 Pillars
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
            framework="TCFD"
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
        {/* Four Pillars Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(sectionConfig).map(([key, config]) => {
            const Icon = config.icon;
            const sectionFields = Object.values(tcfdData[key]);
            const completedInSection = sectionFields.filter(f => f.completed).length;
            const totalInSection = sectionFields.length;
            const sectionProgress = (completedInSection / totalInSection) * 100;

            return (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeSection === key
                    ? 'border-teal bg-teal bg-opacity-5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={`w-8 h-8 mb-2 ${config.color}`} />
                <h3 className="font-semibold text-midnight mb-1">{config.title}</h3>
                <div className="text-xs text-gray-600 mb-2">
                  {completedInSection}/{totalInSection} complete
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-teal transition-all"
                    style={{ width: `${sectionProgress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Section Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              {React.createElement(sectionConfig[activeSection].icon, {
                className: `w-6 h-6 ${sectionConfig[activeSection].color}`,
              })}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-midnight mb-2">
                  {sectionConfig[activeSection].title}
                </h2>
                <p className="text-sm text-gray-600">
                  {sectionConfig[activeSection].description}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {Object.entries(tcfdData[activeSection]).map(([key, field]) => (
              <div key={key} className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                  {field.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-teal" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-300" />
                  )}
                  <span className="flex-1">{field.name}</span>
                  <button className="text-teal hover:text-cedar transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </button>
                </label>
                <textarea
                  value={field.value}
                  onChange={(e) => updateField(activeSection, key, e.target.value)}
                  placeholder={`Describe ${field.name.toLowerCase()}...`}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                />
                {field.completed && (
                  <p className="text-xs text-teal flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Field completed
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

export default TCFDDataCollection;
