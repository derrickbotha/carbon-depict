import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  BookOpen,
  FileText,
  Users,
  Heart,
  Shield,
  Leaf,
  Award,
  Info
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const GRIStandardsCollection = () => {
  const [griData, setGriData] = useState({
    // GRI 2: General Disclosures
    generalDisclosures: {
      '2-1': { name: 'Organizational details', value: '', completed: false },
      '2-2': { name: 'Entities included in sustainability reporting', value: '', completed: false },
      '2-6': { name: 'Activities, value chain and other business relationships', value: '', completed: false },
      '2-9': { name: 'Governance structure and composition', value: '', completed: false },
      '2-12': { name: 'Role of the highest governance body in overseeing impacts', value: '', completed: false },
      '2-14': { name: 'Role of the highest governance body in sustainability reporting', value: '', completed: false },
      '2-22': { name: 'Statement on sustainable development strategy', value: '', completed: false },
      '2-23': { name: 'Policy commitments', value: '', completed: false },
      '2-29': { name: 'Approach to stakeholder engagement', value: '', completed: false },
    },
    // GRI 3: Material Topics
    materialTopics: {
      '3-1': { name: 'Process to determine material topics', value: '', completed: false },
      '3-2': { name: 'List of material topics', value: '', completed: false },
      '3-3': { name: 'Management of material topics', value: '', completed: false },
    },
    // Economic Topics (e.g., GRI 201)
    economicTopics: {
      '201-1': { name: 'Direct economic value generated and distributed', value: '', completed: false },
      '205-2': { name: 'Communication and training about anti-corruption policies', value: '', completed: false },
    },
    // Environmental Topics (e.g., GRI 305)
    environmentalTopics: {
      '302-1': { name: 'Energy consumption within the organization', value: '', completed: false },
      '303-5': { name: 'Water consumption', value: '', completed: false },
      '305-1': { name: 'Direct (Scope 1) GHG emissions', value: '', completed: false },
      '305-2': { name: 'Indirect (Scope 2) GHG emissions', value: '', completed: false },
      '305-3': { name: 'Other indirect (Scope 3) GHG emissions', value: '', completed: false },
      '306-2': { name: 'Waste by type and disposal method', value: '', completed: false },
    },
    // Social Topics (e.g., GRI 401)
    socialTopics: {
      '401-1': { name: 'New employee hires and employee turnover', value: '', completed: false },
      '403-9': { name: 'Work-related injuries', value: '', completed: false },
      '404-2': { name: 'Programs for upgrading employee skills', value: '', completed: false },
      '405-1': { name: 'Diversity of governance bodies and employees', value: '', completed: false },
    },
  });

  const [activeModule, setActiveModule] = useState('generalDisclosures');

  const progress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    Object.values(griData).forEach(module => {
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
  }, [griData]);

  const updateField = (module, fieldKey, value) => {
    setGriData(prev => ({
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
    generalDisclosures: { title: 'GRI 2: General Disclosures', icon: BookOpen },
    materialTopics: { title: 'GRI 3: Material Topics', icon: Award },
    economicTopics: { title: 'Economic Topics', icon: FileText },
    environmentalTopics: { title: 'Environmental Topics', icon: Leaf },
    socialTopics: { title: 'Social Topics', icon: Users },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/esg/data-entry" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-midnight">GRI Standards Data Collection</h1>
                <p className="text-sm text-gray-600 mt-1">Global Reporting Initiative - Universal and Topic Standards.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Export
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save
              </button>
            </div>
          </div>
          <FrameworkProgressBar
            framework="GRI"
            completionPercentage={progress.percentage}
            totalFields={progress.total}
            completedFields={progress.completed}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-midnight mb-3">GRI Standards Modules</h3>
              <nav className="space-y-1">
                {Object.entries(moduleConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setActiveModule(key)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                      activeModule === key ? 'bg-teal text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <config.icon className="w-4 h-4" />
                    <span className="font-medium">{config.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  {React.createElement(moduleConfig[activeModule].icon, { className: 'w-6 h-6 text-teal' })}
                  <div>
                    <h2 className="text-xl font-bold text-midnight mb-2">{moduleConfig[activeModule].title}</h2>
                    <p className="text-sm text-gray-600">Data entry for the selected GRI standard.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {Object.entries(griData[activeModule]).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                      {field.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal" strokeWidth={2} />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" strokeWidth={2} />
                      )}
                      <span className="flex-1">
                        <span className="text-teal font-mono">{`GRI ${key}`}</span>: {field.name}
                      </span>
                    </label>
                    <textarea
                      value={field.value}
                      onChange={(e) => updateField(activeModule, key, e.target.value)}
                      placeholder={`Enter response for GRI ${key}...`}
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

export default GRIStandardsCollection;
