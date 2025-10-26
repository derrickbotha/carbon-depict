// Cache bust 2025-10-23
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Target,
  TrendingDown,
  Calendar,
  Upload,
  Lightbulb,
  Plus
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import apiClient from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';

/**
 * SBTi Data Collection Page
 * Science Based Targets initiative
 * Net-Zero Standard and Near-term Targets
 */
const SBTiDataCollection = () => {
  const [sbtiData, setSbtiData] = useState({
    // Company Information
    companyInfo: {
      'company-name': { name: 'Company name', value: '', completed: false },
      'sector': { name: 'Industry sector (as per SBTi classification)', value: '', completed: false },
      'revenue': { name: 'Annual revenue (million USD)', value: '', completed: false },
      'employees': { name: 'Number of employees', value: '', completed: false },
    },
    // Base Year Inventory
    baseYear: {
      'base-year': { name: 'Base year for emissions inventory', value: '', completed: false },
      'scope1-base': { name: 'Scope 1 emissions - Base year (tCO2e)', value: '', completed: false },
      'scope2-base': { name: 'Scope 2 emissions - Base year (tCO2e)', value: '', completed: false },
      'scope3-base': { name: 'Scope 3 emissions - Base year (tCO2e)', value: '', completed: false },
      'boundary': { name: 'Organizational boundary (operational control/equity share)', value: '', completed: false },
      'coverage': { name: 'Percentage of total emissions covered (must be >95%)', value: '', completed: false },
    },
    // Near-term Targets (5-10 years)
    nearTerm: {
      'near-target-year': { name: 'Near-term target year (5-10 years from base)', value: '', completed: false },
      'scope1-2-reduction': { name: 'Scope 1+2 reduction target (%)', value: '', completed: false },
      'scope1-2-pathway': { name: 'Scope 1+2 alignment (1.5°C or Well-below 2°C)', value: '', completed: false },
      'scope3-reduction': { name: 'Scope 3 reduction target (% or absolute)', value: '', completed: false },
      'scope3-coverage': { name: 'Scope 3 categories covered (at least 2/3 of total)', value: '', completed: false },
    },
    // Long-term/Net-Zero Targets
    netZero: {
      'net-zero-year': { name: 'Net-zero target year (no later than 2050)', value: '', completed: false },
      'net-zero-scope': { name: 'Scopes covered by net-zero target (1, 2, 3)', value: '', completed: false },
      'neutralization': { name: 'Beyond value chain mitigation (carbon removals, offsets)', value: '', completed: false },
      'interim-milestones': { name: 'Interim milestones (2025, 2030, 2040)', value: '', completed: false },
    },
    // Emissions Reduction Strategy
    strategy: {
      'reduction-levers': { name: 'Key emissions reduction levers and initiatives', value: '', completed: false },
      'renewable-energy': { name: 'Renewable energy procurement strategy', value: '', completed: false },
      'supply-chain': { name: 'Supplier engagement program for Scope 3', value: '', completed: false },
      'innovation': { name: 'Innovation and technology investments', value: '', completed: false },
    },
    // Reporting and Verification
    reporting: {
      'progress-reporting': { name: 'Annual progress reporting commitment', value: '', completed: false },
      'verification': { name: 'Third-party verification of emissions inventory', value: '', completed: false },
      'public-disclosure': { name: 'Public disclosure platform (CDP, annual report, website)', value: '', completed: false },
    },
  });

  const [activeSection, setActiveSection] = useState('companyInfo');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    Object.values(sbtiData).forEach(section => {
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

  // Handle new entry submission with compliance validation
  const handleNewEntry = async (formData) => {
    try {
      const response = await apiClient.esgMetrics.create({
        ...formData,
        framework: 'SBTI',
        status: 'draft',
      });

      const section = activeSection;
      const disclosure = formData.disclosure;
      
      if (sbtiData[section] && sbtiData[section][disclosure]) {
        updateField(section, disclosure, formData.value);
      }

      alert('Entry saved successfully as draft!');
      return response.data;
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
      return null;
    }
  };

  const updateField = (section, fieldKey, value) => {
    setSbtiData(prev => ({
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

  const sectionTitles = {
    companyInfo: 'Company Information',
    baseYear: 'Base Year Inventory',
    nearTerm: 'Near-term Targets (5-10 years)',
    netZero: 'Long-term Net-Zero Targets',
    strategy: 'Emissions Reduction Strategy',
    reporting: 'Reporting & Verification',
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
                <h1 className="text-2xl font-bold text-midnight">SBTi Target Submission</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Science Based Targets initiative - Net-Zero Standard
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-teal text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Checklist
                </button>
                <button
                  onClick={() => setViewMode('form')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'form'
                      ? 'bg-teal text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Enhanced Form
                </button>
              </div>
              
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Submit to SBTi
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="SBTi"
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
              <h3 className="text-sm font-semibold text-midnight mb-3">Sections</h3>
              <nav className="space-y-1">
                {Object.entries(sectionTitles).map(([key, title]) => {
                  const sectionFields = Object.values(sbtiData[key]);
                  const completedInSection = sectionFields.filter(f => f.completed).length;
                  const totalInSection = sectionFields.length;
                  const sectionProgress = (completedInSection / totalInSection) * 100;

                  return (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === key
                          ? 'bg-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{title}</span>
                        {sectionProgress === 100 ? (
                          <CheckCircle2 className="w-4 h-4 text-mint" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs opacity-75">
                        <span>{completedInSection}/{totalInSection}</span>
                        <div className="flex-1 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div
                            className="h-1 bg-mint"
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* SBTi Requirements Info */}
              <div className="mt-6 p-3 bg-mint bg-opacity-10 rounded-lg border border-mint">
                <h4 className="text-xs font-semibold text-midnight mb-2">Key Requirements</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• {'>'} 95% emissions coverage</li>
                  <li>• 1.5°C or WB2°C pathway</li>
                  <li>• 2/3 Scope 3 coverage</li>
                  <li>• Net-zero by 2050</li>
                  <li>• Annual reporting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9">
            {viewMode === 'form' ? (
              /* Enhanced Form View with AI Validation */
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-midnight mb-2">
                    Enhanced SBTi Data Entry with AI Compliance
                  </h2>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Lightbulb className="w-4 h-4 mt-0.5 text-cedar" />
                    <p>
                      Enter your science-based targets data and receive real-time compliance validation against SBTi Net-Zero Standard.
                      The system will verify alignment with 1.5°C pathways and coverage requirements.
                    </p>
                  </div>
                </div>

                <ESGDataEntryForm
                  framework="SBTI"
                  onSubmit={handleNewEntry}
                  initialData={{}}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-midnight mb-2">
                  {sectionTitles[activeSection]}
                </h2>
              </div>

              <div className="space-y-6">
                {Object.entries(sbtiData[activeSection]).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                      {field.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span>{field.name}</span>
                    </label>
                    {key.includes('year') || key.includes('reduction') || key.includes('coverage') || key.includes('revenue') || key.includes('employees') ? (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateField(activeSection, key, e.target.value)}
                        placeholder={`Enter ${field.name.toLowerCase()}...`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
                      />
                    ) : (
                      <textarea
                        value={field.value}
                        onChange={(e) => updateField(activeSection, key, e.target.value)}
                        placeholder={`Enter ${field.name.toLowerCase()}...`}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBTiDataCollection;
