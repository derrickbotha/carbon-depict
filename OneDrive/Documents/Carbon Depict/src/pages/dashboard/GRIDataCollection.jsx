// Cache bust 2025-10-23
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  FileText,
  Lightbulb,
  BookOpen,
  Plus
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import { apiClient } from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';

/**
 * GRI Data Collection Page
 * Collects data for GRI Standards 2021
 * Tracks completion percentage across all disclosures
 */
const GRIDataCollection = () => {
  // Initial data structure
  const getInitialData = () => ({
    // GRI 2: General Disclosures (43 disclosures)
    organizationalProfile: {
      '2-1': { name: 'Organizational details', value: '', completed: false },
      '2-2': { name: 'Entities in sustainability reporting', value: '', completed: false },
      '2-3': { name: 'Reporting period and frequency', value: '', completed: false },
      '2-4': { name: 'Restatements of information', value: '', completed: false },
      '2-5': { name: 'External assurance', value: '', completed: false },
      '2-6': { name: 'Activities, value chain, relationships', value: '', completed: false },
      '2-7': { name: 'Employees', value: '', completed: false },
      '2-8': { name: 'Workers who are not employees', value: '', completed: false },
    },
    governance: {
      '2-9': { name: 'Governance structure and composition', value: '', completed: false },
      '2-10': { name: 'Nomination and selection', value: '', completed: false },
      '2-11': { name: 'Chair of the highest governance body', value: '', completed: false },
      '2-12': { name: 'Role in sustainability oversight', value: '', completed: false },
      '2-13': { name: 'Delegation of responsibility', value: '', completed: false },
      '2-14': { name: 'Role in sustainability reporting', value: '', completed: false },
      '2-15': { name: 'Conflicts of interest', value: '', completed: false },
      '2-16': { name: 'Communication of critical concerns', value: '', completed: false },
      '2-17': { name: 'Collective knowledge', value: '', completed: false },
      '2-18': { name: 'Evaluation of performance', value: '', completed: false },
      '2-19': { name: 'Remuneration policies', value: '', completed: false },
      '2-20': { name: 'Process to determine remuneration', value: '', completed: false },
      '2-21': { name: 'Annual total compensation ratio', value: '', completed: false },
    },
    strategyAndPolicies: {
      '2-22': { name: 'Statement on sustainable development strategy', value: '', completed: false },
      '2-23': { name: 'Policy commitments', value: '', completed: false },
      '2-24': { name: 'Embedding policy commitments', value: '', completed: false },
      '2-25': { name: 'Processes to remediate negative impacts', value: '', completed: false },
      '2-26': { name: 'Mechanisms for seeking advice and concerns', value: '', completed: false },
      '2-27': { name: 'Compliance with laws and regulations', value: '', completed: false },
      '2-28': { name: 'Membership associations', value: '', completed: false },
    },
    stakeholderEngagement: {
      '2-29': { name: 'Approach to stakeholder engagement', value: '', completed: false },
      '2-30': { name: 'Collective bargaining agreements', value: '', completed: false },
    },
    // GRI 3: Material Topics
    materiality: {
      '3-1': { name: 'Process to determine material topics', value: '', completed: false },
      '3-2': { name: 'List of material topics', value: '', completed: false },
      '3-3': { name: 'Management of material topics', value: '', completed: false },
    },
    // GRI 305: Emissions (Example topic-specific standard)
    emissions: {
      '305-1': { name: 'Direct (Scope 1) GHG emissions', value: '', completed: false },
      '305-2': { name: 'Energy indirect (Scope 2) GHG emissions', value: '', completed: false },
      '305-3': { name: 'Other indirect (Scope 3) GHG emissions', value: '', completed: false },
      '305-4': { name: 'GHG emissions intensity', value: '', completed: false },
      '305-5': { name: 'Reduction of GHG emissions', value: '', completed: false },
      '305-6': { name: 'Emissions of ozone-depleting substances', value: '', completed: false },
      '305-7': { name: 'NOx, SOx, and other significant air emissions', value: '', completed: false },
    },
    // GRI 405: Diversity and Equal Opportunity
    diversity: {
      '405-1': { name: 'Diversity of governance bodies and employees', value: '', completed: false },
      '405-2': { name: 'Ratio of basic salary and remuneration', value: '', completed: false },
    },
  });

  // Initialize state with saved data if available
  const [griData, setGriData] = useState(() => {
    const saved = esgDataManager.getFrameworkData('gri');
    return Object.keys(saved).length > 0 ? saved : getInitialData();
  });

  const [activeSection, setActiveSection] = useState('organizationalProfile');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  // Calculate overall completion percentage
  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    Object.values(griData).forEach(section => {
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
      // Save to backend API
      const response = await apiClient.esgMetrics.create({
        ...formData,
        framework: 'GRI',
        status: 'draft',
      });

      // Update local state
      const section = activeSection;
      const disclosure = formData.disclosure;
      
      if (griData[section] && griData[section][disclosure]) {
        updateField(section, disclosure, formData.value);
      }

      setShowNewEntryForm(false);
      alert('Entry saved successfully as draft!');
      
      return response.data;
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
      return null;
    }
  };

  // Handle field update and save to localStorage
  const updateField = (section, fieldKey, value) => {
    const updatedData = {
      ...griData,
      [section]: {
        ...griData[section],
        [fieldKey]: {
          ...griData[section][fieldKey],
          value,
          completed: value.trim() !== '',
        },
      },
    };
    
    setGriData(updatedData);
    // Auto-save to localStorage
    esgDataManager.saveFrameworkData('gri', updatedData);
  };

  // Section titles
  const sectionTitles = {
    organizationalProfile: 'Organizational Profile (GRI 2-1 to 2-8)',
    governance: 'Governance (GRI 2-9 to 2-21)',
    strategyAndPolicies: 'Strategy & Policies (GRI 2-22 to 2-28)',
    stakeholderEngagement: 'Stakeholder Engagement (GRI 2-29 to 2-30)',
    materiality: 'Material Topics (GRI 3)',
    emissions: 'Emissions (GRI 305)',
    diversity: 'Diversity & Equal Opportunity (GRI 405)',
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
                <h1 className="text-2xl font-bold text-midnight">GRI Standards 2021</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Global Reporting Initiative - Universal & Topic-Specific Standards
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
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="GRI"
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
          {/* Sidebar Navigation */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="text-sm font-semibold text-midnight mb-3">Sections</h3>
              <nav className="space-y-1">
                {Object.entries(sectionTitles).map(([key, title]) => {
                  const sectionFields = Object.values(griData[key]);
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
                        <span className="font-medium">{title.split('(')[0]}</span>
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
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9">
            {viewMode === 'form' ? (
              /* Enhanced Form View with AI Validation */
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-midnight mb-2">
                    Enhanced GRI Data Entry with AI Compliance
                  </h2>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <Lightbulb className="w-4 h-4 mt-0.5 text-cedar" />
                    <p>
                      Enter your ESG data below and receive real-time compliance validation against GRI Standards 2021.
                      The system will analyze completeness, accuracy, and provide recommendations.
                    </p>
                  </div>
                </div>

                <ESGDataEntryForm
                  framework="GRI"
                  onSubmit={handleNewEntry}
                  initialData={{}}
                />
              </div>
            ) : (
              /* Original Checklist View */
              <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Section Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-midnight mb-2">
                  {sectionTitles[activeSection]}
                </h2>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <Lightbulb className="w-4 h-4 mt-0.5 text-cedar" />
                  <p>
                    Complete all required fields in this section. Hover over field labels for guidance.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {Object.entries(griData[activeSection]).map(([key, field]) => (
                  <div key={key} className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                      {field.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-teal" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span>GRI {key}: {field.name}</span>
                      <button className="ml-auto text-teal hover:text-cedar transition-colors">
                        <BookOpen className="w-4 h-4" />
                      </button>
                    </label>
                    <textarea
                      value={field.value}
                      onChange={(e) => updateField(activeSection, key, e.target.value)}
                      placeholder={`Enter information for ${field.name}...`}
                      rows={4}
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

              {/* Section Navigation */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => {
                    const sections = Object.keys(sectionTitles);
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1]);
                    }
                  }}
                  disabled={Object.keys(sectionTitles).indexOf(activeSection) === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Section
                </button>
                <button
                  onClick={() => {
                    const sections = Object.keys(sectionTitles);
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1]);
                    }
                  }}
                  disabled={
                    Object.keys(sectionTitles).indexOf(activeSection) ===
                    Object.keys(sectionTitles).length - 1
                  }
                  className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Section
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GRIDataCollection;
