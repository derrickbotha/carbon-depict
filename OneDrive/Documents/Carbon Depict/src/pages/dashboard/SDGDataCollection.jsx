// Cache bust 2025-10-23
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Plus,
  Minus,
  AlertCircle,
  Lightbulb
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import apiClient from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';

/**
 * SDG Data Collection Page
 * UN Sustainable Development Goals - 17 Goals
 * Impact assessment: Positive and Negative contributions
 */
const SDGDataCollection = () => {
  const [sdgData, setSDGData] = useState({
    // SDG 1: No Poverty
    sdg1: {
      name: 'No Poverty',
      color: 'bg-red-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 2: Zero Hunger
    sdg2: {
      name: 'Zero Hunger',
      color: 'bg-amber-500',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 3: Good Health and Well-being
    sdg3: {
      name: 'Good Health and Well-being',
      color: 'bg-green-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 4: Quality Education
    sdg4: {
      name: 'Quality Education',
      color: 'bg-red-700',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 5: Gender Equality
    sdg5: {
      name: 'Gender Equality',
      color: 'bg-orange-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 6: Clean Water and Sanitation
    sdg6: {
      name: 'Clean Water and Sanitation',
      color: 'bg-cyan-500',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 7: Affordable and Clean Energy
    sdg7: {
      name: 'Affordable and Clean Energy',
      color: 'bg-yellow-500',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 8: Decent Work and Economic Growth
    sdg8: {
      name: 'Decent Work and Economic Growth',
      color: 'bg-rose-700',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 9: Industry, Innovation and Infrastructure
    sdg9: {
      name: 'Industry, Innovation and Infrastructure',
      color: 'bg-orange-700',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 10: Reduced Inequalities
    sdg10: {
      name: 'Reduced Inequalities',
      color: 'bg-pink-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 11: Sustainable Cities and Communities
    sdg11: {
      name: 'Sustainable Cities and Communities',
      color: 'bg-amber-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 12: Responsible Consumption and Production
    sdg12: {
      name: 'Responsible Consumption and Production',
      color: 'bg-amber-700',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 13: Climate Action
    sdg13: {
      name: 'Climate Action',
      color: 'bg-green-700',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 14: Life Below Water
    sdg14: {
      name: 'Life Below Water',
      color: 'bg-blue-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 15: Life on Land
    sdg15: {
      name: 'Life on Land',
      color: 'bg-lime-600',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 16: Peace, Justice and Strong Institutions
    sdg16: {
      name: 'Peace, Justice and Strong Institutions',
      color: 'bg-blue-800',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
    // SDG 17: Partnerships for the Goals
    sdg17: {
      name: 'Partnerships for the Goals',
      color: 'bg-indigo-800',
      relevance: '',
      positiveImpacts: '',
      negativeImpacts: '',
      targets: '',
      metrics: '',
      completed: false,
    },
  });

  const [activeSDG, setActiveSDG] = useState('sdg1');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'

  const calculateProgress = () => {
    let totalSDGs = 0;
    let completedSDGs = 0;

    Object.values(sdgData).forEach(sdg => {
      totalSDGs++;
      if (sdg.completed) completedSDGs++;
    });

    return {
      percentage: totalSDGs > 0 ? (completedSDGs / totalSDGs) * 100 : 0,
      completed: completedSDGs,
      total: totalSDGs,
    };
  };

  const progress = calculateProgress();

  // Handle new entry submission with compliance validation
  const handleNewEntry = async (formData) => {
    try {
      const response = await apiClient.esgMetrics.create({
        ...formData,
        framework: 'SDG',
        status: 'draft',
      });

      alert('Entry saved successfully as draft!');
      return response.data;
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
      return null;
    }
  };

  const updateField = (sdgKey, field, value) => {
    setSDGData(prev => {
      const updatedSDG = {
        ...prev[sdgKey],
        [field]: value,
      };
      
      // Check if SDG is completed (all fields filled)
      updatedSDG.completed = 
        updatedSDG.relevance.trim() !== '' &&
        (updatedSDG.positiveImpacts.trim() !== '' || updatedSDG.negativeImpacts.trim() !== '');

      return {
        ...prev,
        [sdgKey]: updatedSDG,
      };
    });
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
                <h1 className="text-2xl font-bold text-midnight">SDG Impact Assessment</h1>
                <p className="text-sm text-gray-600 mt-1">
                  UN Sustainable Development Goals - 17 Goals for 2030 Agenda
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
            framework="SDG"
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
        {/* Impact Assessment Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-midnight mb-1">SDG Impact Assessment</h3>
            <p className="text-sm text-gray-700">
              For each SDG, assess your organization's impact. Include both <strong>positive contributions</strong> 
              (how you advance the goal) and <strong>negative impacts</strong> (where you may hinder progress). 
              Only assess SDGs relevant to your business.
            </p>
          </div>
        </div>

        {/* 17 SDGs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(sdgData).map(([key, sdg], index) => (
            <button
              key={key}
              onClick={() => setActiveSDG(key)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold text-lg transition-all relative ${
                sdg.color
              } ${
                activeSDG === key
                  ? 'ring-4 ring-teal ring-offset-2 scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <span className="text-3xl mb-1">{index + 1}</span>
              <span className="text-xs text-center px-2 leading-tight">{sdg.name}</span>
              {sdg.completed && (
                <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-white" />
              )}
            </button>
          ))}
        </div>

        {viewMode === 'form' ? (
          /* Enhanced Form View with AI Validation */
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-midnight mb-2">
                Enhanced SDG Data Entry with AI Compliance
              </h2>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Lightbulb className="w-4 h-4 mt-0.5 text-cedar" />
                <p>
                  Enter your sustainable development impact data and receive real-time assessment against UN SDG targets.
                  The system will analyze positive and negative contributions to the 2030 Agenda.
                </p>
              </div>
            </div>

            <ESGDataEntryForm
              framework="SDG"
              onSubmit={handleNewEntry}
              initialData={{}}
            />
          </div>
        ) : (
          /* Active SDG Form */
          <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-lg ${sdgData[activeSDG].color} flex items-center justify-center text-white font-bold text-2xl`}
              >
                {parseInt(activeSDG.replace('sdg', ''))}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-midnight mb-1">
                  SDG {parseInt(activeSDG.replace('sdg', ''))}: {sdgData[activeSDG].name}
                </h2>
                <p className="text-sm text-gray-600">
                  Assess your organization's impact on this goal
                </p>
              </div>
              {sdgData[activeSDG].completed && (
                <div className="flex items-center gap-2 text-teal">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Assessment Complete</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Relevance */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                <span className="flex-1">Relevance to Your Business</span>
                <span className="text-xs text-gray-500">Required</span>
              </label>
              <textarea
                value={sdgData[activeSDG].relevance}
                onChange={(e) => updateField(activeSDG, 'relevance', e.target.value)}
                placeholder="Explain how this SDG is relevant to your business operations, products, or services..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
              />
            </div>

            {/* Positive Impacts */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                <Plus className="w-4 h-4 text-green-600" />
                <span className="flex-1">Positive Contributions</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                How does your organization advance this SDG? Include products, services, initiatives, and partnerships.
              </p>
              <textarea
                value={sdgData[activeSDG].positiveImpacts}
                onChange={(e) => updateField(activeSDG, 'positiveImpacts', e.target.value)}
                placeholder="Describe positive contributions (e.g., renewable energy procurement for SDG 7, diversity initiatives for SDG 5)..."
                rows={4}
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Negative Impacts */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                <Minus className="w-4 h-4 text-red-600" />
                <span className="flex-1">Negative Impacts</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Where might your operations hinder progress toward this SDG? Be honest about challenges and areas for improvement.
              </p>
              <textarea
                value={sdgData[activeSDG].negativeImpacts}
                onChange={(e) => updateField(activeSDG, 'negativeImpacts', e.target.value)}
                placeholder="Describe negative impacts or areas of concern (e.g., GHG emissions for SDG 13, water use in water-stressed regions for SDG 6)..."
                rows={4}
                className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Targets */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                <span className="flex-1">Related Targets and Commitments</span>
                <span className="text-xs text-gray-500">Optional</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                List any company targets, commitments, or initiatives related to this SDG (e.g., "50% reduction in Scope 1+2 emissions by 2030").
              </p>
              <textarea
                value={sdgData[activeSDG].targets}
                onChange={(e) => updateField(activeSDG, 'targets', e.target.value)}
                placeholder="List targets and commitments..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
              />
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-midnight">
                <span className="flex-1">Key Metrics and Indicators</span>
                <span className="text-xs text-gray-500">Optional</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                What metrics do you track to measure your impact on this SDG? (e.g., tCO2e reduced, # of people trained, % renewable energy).
              </p>
              <textarea
                value={sdgData[activeSDG].metrics}
                onChange={(e) => updateField(activeSDG, 'metrics', e.target.value)}
                placeholder="List key metrics and current performance..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={() => {
                const currentIndex = parseInt(activeSDG.replace('sdg', ''));
                if (currentIndex > 1) {
                  setActiveSDG(`sdg${currentIndex - 1}`);
                }
              }}
              disabled={activeSDG === 'sdg1'}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous SDG
            </button>
            <button
              onClick={() => {
                const currentIndex = parseInt(activeSDG.replace('sdg', ''));
                if (currentIndex < 17) {
                  setActiveSDG(`sdg${currentIndex + 1}`);
                }
              }}
              disabled={activeSDG === 'sdg17'}
              className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next SDG
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default SDGDataCollection;
