// ISSB Data Collection - International Sustainability Standards Board
// IFRS S1 (General Requirements) & IFRS S2 (Climate-related Disclosures)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Download, CheckCircle2, Circle, FileText,
  Lightbulb, BookOpen, Plus, Globe, TrendingUp, AlertTriangle, Target
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import { apiClient } from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';

/**
 * ISSB Data Collection Page
 * International Sustainability Standards Board (IFRS Foundation)
 * IFRS S1: General Requirements for Sustainability-related Disclosures
 * IFRS S2: Climate-related Disclosures
 */
const ISSBDataCollection = () => {
  const [activeStandard, setActiveStandard] = useState('s1'); // s1 or s2
  const [activeSection, setActiveSection] = useState('governance');
  const [viewMode, setViewMode] = useState('list');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  const getInitialData = () => ({
    // IFRS S1: General Requirements
    s1: {
      governance: {
        's1-gov-1': { name: 'Governance body responsible for oversight of sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-gov-2': { name: "Management's role in governance processes and controls", value: '', completed: false, standard: 'S1' },
        's1-gov-3': { name: 'How governance body oversees sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-gov-4': { name: 'Integration of sustainability in compensation policies', value: '', completed: false, standard: 'S1' },
      },
      strategy: {
        's1-str-1': { name: 'Description of sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-str-2': { name: 'Current and anticipated effects on financial position, performance, and cash flows', value: '', completed: false, standard: 'S1' },
        's1-str-3': { name: 'Effects on business model and value chain', value: '', completed: false, standard: 'S1' },
        's1-str-4': { name: 'Effects on strategy and decision-making', value: '', completed: false, standard: 'S1' },
        's1-str-5': { name: 'Resilience of strategy and business model', value: '', completed: false, standard: 'S1' },
      },
      riskManagement: {
        's1-risk-1': { name: 'Processes to identify sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-risk-2': { name: 'Processes to monitor sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-risk-3': { name: 'Integration into overall risk management', value: '', completed: false, standard: 'S1' },
      },
      metricsTargets: {
        's1-met-1': { name: 'Cross-industry metrics for sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-met-2': { name: 'Industry-based metrics (aligned with SASB)', value: '', completed: false, standard: 'S1' },
        's1-met-3': { name: 'Targets to manage sustainability-related risks and opportunities', value: '', completed: false, standard: 'S1' },
        's1-met-4': { name: 'Progress toward achieving targets', value: '', completed: false, standard: 'S1' },
      },
    },
    // IFRS S2: Climate-related Disclosures
    s2: {
      governance: {
        's2-gov-1': { name: 'Governance body responsible for climate-related risks and opportunities', value: '', completed: false, standard: 'S2' },
        's2-gov-2': { name: 'Management oversight of climate-related risks and opportunities', value: '', completed: false, standard: 'S2' },
        's2-gov-3': { name: 'How climate expertise is integrated into governance', value: '', completed: false, standard: 'S2' },
      },
      strategy: {
        's2-str-1': { name: 'Climate-related physical risks (acute and chronic)', value: '', completed: false, standard: 'S2' },
        's2-str-2': { name: 'Climate-related transition risks (policy, legal, technology, market, reputation)', value: '', completed: false, standard: 'S2' },
        's2-str-3': { name: 'Climate-related opportunities (resource efficiency, energy source, products/services, markets, resilience)', value: '', completed: false, standard: 'S2' },
        's2-str-4': { name: 'Current and anticipated effects on business model and value chain', value: '', completed: false, standard: 'S2' },
        's2-str-5': { name: 'Climate scenario analysis and resilience assessment', value: '', completed: false, standard: 'S2' },
        's2-str-6': { name: 'Transition plan for climate change mitigation', value: '', completed: false, standard: 'S2' },
      },
      riskManagement: {
        's2-risk-1': { name: 'Processes to identify and assess climate-related risks', value: '', completed: false, standard: 'S2' },
        's2-risk-2': { name: 'Processes to manage climate-related risks', value: '', completed: false, standard: 'S2' },
        's2-risk-3': { name: 'Prioritization of climate-related risks relative to other risks', value: '', completed: false, standard: 'S2' },
        's2-risk-4': { name: 'Integration of climate risk into overall risk management', value: '', completed: false, standard: 'S2' },
      },
      metricsTargets: {
        's2-met-1': { name: 'Scope 1 GHG emissions (tCO2e)', value: '', unit: 'tCO2e', completed: false, standard: 'S2' },
        's2-met-2': { name: 'Scope 2 GHG emissions (tCO2e)', value: '', unit: 'tCO2e', completed: false, standard: 'S2' },
        's2-met-3': { name: 'Scope 3 GHG emissions (tCO2e)', value: '', unit: 'tCO2e', completed: false, standard: 'S2' },
        's2-met-4': { name: 'GHG intensity metrics (per revenue, per employee, etc.)', value: '', completed: false, standard: 'S2' },
        's2-met-5': { name: 'Climate-related targets (emissions reduction, renewable energy, etc.)', value: '', completed: false, standard: 'S2' },
        's2-met-6': { name: 'Progress toward achieving climate targets', value: '', completed: false, standard: 'S2' },
        's2-met-7': { name: 'Internal carbon pricing approach', value: '', completed: false, standard: 'S2' },
        's2-met-8': { name: 'Amount of assets or business activities vulnerable to transition risks', value: '', unit: 'USD', completed: false, standard: 'S2' },
        's2-met-9': { name: 'Amount of assets or business activities vulnerable to physical risks', value: '', unit: 'USD', completed: false, standard: 'S2' },
        's2-met-10': { name: 'Climate-related opportunities and capital deployment', value: '', unit: 'USD', completed: false, standard: 'S2' },
      },
    },
  });

  const [issbData, setIssbData] = useState(() => {
    const saved = esgDataManager.getFrameworkData('issb');
    return Object.keys(saved).length > 0 ? saved : getInitialData();
  });

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    // Calculate for both S1 and S2
    ['s1', 's2'].forEach(standard => {
      Object.values(issbData[standard]).forEach(section => {
        Object.values(section).forEach(field => {
          totalFields++;
          if (field.completed) completedFields++;
        });
      });
    });

    return {
      percentage: totalFields > 0 ? (completedFields / totalFields) * 100 : 0,
      completed: completedFields,
      total: totalFields,
    };
  };

  const progress = calculateProgress();

  const updateField = (section, disclosure, value) => {
    setIssbData(prev => ({
      ...prev,
      [activeStandard]: {
        ...prev[activeStandard],
        [section]: {
          ...prev[activeStandard][section],
          [disclosure]: {
            ...prev[activeStandard][section][disclosure],
            value,
            completed: value.trim() !== '',
          },
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await esgDataManager.saveFrameworkData('issb', issbData);
      
      await apiClient.esgMetrics.bulkCreate({
        framework: 'ISSB',
        standards: ['IFRS S1', 'IFRS S2'],
        data: issbData,
      });

      alert('ISSB data saved successfully!');
    } catch (error) {
      console.error('Error saving ISSB data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleExport = () => {
    const csvData = [];
    csvData.push(['Standard', 'Section', 'Disclosure', 'Requirement', 'Value', 'Unit', 'Completed']);

    ['s1', 's2'].forEach(standard => {
      Object.entries(issbData[standard]).forEach(([section, fields]) => {
        Object.entries(fields).forEach(([disclosure, field]) => {
          csvData.push([
            field.standard,
            section,
            disclosure,
            field.name,
            field.value,
            field.unit || 'text',
            field.completed ? 'Yes' : 'No',
          ]);
        });
      });
    });

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `issb-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const sections = {
    governance: { name: 'Governance', icon: '⚖️', description: 'Oversight and accountability' },
    strategy: { name: 'Strategy', icon: '🎯', description: 'Business implications and resilience' },
    riskManagement: { name: 'Risk Management', icon: '🛡️', description: 'Processes for identifying and managing risks' },
    metricsTargets: { name: 'Metrics & Targets', icon: '📊', description: 'Performance measurement and goals' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/esg"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cd-border bg-white text-cd-muted transition-colors hover:bg-cd-surface hover:text-cd-midnight"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-cd-midnight">ISSB Data Collection</h1>
            <p className="text-cd-muted">
              IFRS Sustainability Disclosure Standards - Global baseline for investors
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Progress
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <FrameworkProgressBar
        frameworkName="ISSB"
        percentage={progress.percentage}
        completedFields={progress.completed}
        totalFields={progress.total}
      />

      {/* Standard Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={() => { setActiveStandard('s1'); setActiveSection('governance'); }}
          className={`rounded-lg border-2 p-6 text-left transition-all ${
            activeStandard === 's1'
              ? 'border-cd-midnight bg-cd-mint/10'
              : 'border-cd-border bg-white hover:border-cd-mint'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <Globe className="h-5 w-5 text-cd-midnight" />
            <h3 className="font-bold text-cd-midnight">IFRS S1</h3>
          </div>
          <p className="text-sm text-cd-muted">
            General Requirements for Disclosure of Sustainability-related Financial Information
          </p>
          <div className="mt-3 text-xs font-medium text-cd-midnight">
            {Object.values(issbData.s1).flatMap(s => Object.values(s)).filter(f => f.completed).length} / {Object.values(issbData.s1).flatMap(s => Object.values(s)).length} completed
          </div>
        </button>

        <button
          onClick={() => { setActiveStandard('s2'); setActiveSection('governance'); }}
          className={`rounded-lg border-2 p-6 text-left transition-all ${
            activeStandard === 's2'
              ? 'border-cd-midnight bg-cd-mint/10'
              : 'border-cd-border bg-white hover:border-cd-mint'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cd-midnight" />
            <h3 className="font-bold text-cd-midnight">IFRS S2</h3>
          </div>
          <p className="text-sm text-cd-muted">
            Climate-related Disclosures (incorporates TCFD recommendations)
          </p>
          <div className="mt-3 text-xs font-medium text-cd-midnight">
            {Object.values(issbData.s2).flatMap(s => Object.values(s)).filter(f => f.completed).length} / {Object.values(issbData.s2).flatMap(s => Object.values(s)).length} completed
          </div>
        </button>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-cd-border">
        <div className="flex gap-2 overflow-x-auto">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === key
                  ? 'border-cd-midnight text-cd-midnight'
                  : 'border-transparent text-cd-muted hover:text-cd-midnight'
              }`}
            >
              <span>{section.icon}</span>
              <div>
                <div>{section.name}</div>
                <div className="text-xs font-normal text-cd-muted">{section.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Data Collection Form */}
      <div className="rounded-lg border border-cd-border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-cd-midnight">
            {activeStandard === 's1' ? 'IFRS S1' : 'IFRS S2'} - {sections[activeSection]?.name}
          </h2>
          <Button size="sm" onClick={() => setShowNewEntryForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(issbData[activeStandard][activeSection] || {}).map(([disclosure, field]) => (
            <div key={disclosure} className="rounded-lg border border-cd-border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-cd-surface px-2 py-0.5 font-mono text-xs text-cd-muted">
                      {disclosure}
                    </span>
                    <span className="rounded bg-cd-midnight px-2 py-0.5 text-xs font-medium text-white">
                      {field.standard}
                    </span>
                  </div>
                  <h3 className="font-medium text-cd-midnight">{field.name}</h3>
                </div>
                {field.completed ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 text-gray-300" />
                )}
              </div>

              <div className="flex gap-2">
                <textarea
                  value={field.value}
                  onChange={(e) => updateField(activeSection, disclosure, e.target.value)}
                  placeholder="Describe how your organization addresses this requirement..."
                  rows={3}
                  className="flex-1 rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                />
                {field.unit && (
                  <div className="flex items-center rounded-lg border border-cd-border bg-cd-surface px-3 py-2 text-sm text-cd-muted">
                    {field.unit}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="rounded-lg border border-cd-mint/30 bg-cd-mint/10 p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cd-midnight" />
          <h3 className="font-semibold text-cd-midnight">ISSB Guidance</h3>
        </div>
        <ul className="space-y-2 text-sm text-cd-muted">
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Global Baseline:</strong> ISSB standards provide a global baseline for sustainability disclosures, designed for integration into financial reporting.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Investor-Focused:</strong> Designed to meet information needs of investors, lenders, and other creditors when assessing enterprise value.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>S1 Foundation:</strong> IFRS S1 sets general requirements applicable to all sustainability topics material to enterprise value.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>S2 Climate:</strong> IFRS S2 provides specific climate-related requirements, building on TCFD recommendations.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>SASB Integration:</strong> S1 requires use of applicable SASB industry-based metrics for industry-specific disclosures.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Interoperability:</strong> Designed for interoperability with CSRD (ESRS) and other regional requirements.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Effective Date:</strong> Annual reporting periods beginning on or after January 1, 2024 (varies by jurisdiction).</span>
          </li>
        </ul>
      </div>

      {/* New Entry Form Modal */}
      {showNewEntryForm && (
        <ESGDataEntryForm
          framework="ISSB"
          onClose={() => setShowNewEntryForm(false)}
          onSubmit={(data) => {
            console.log('New ISSB entry:', data);
            setShowNewEntryForm(false);
          }}
        />
      )}
    </div>
  );
};

export default ISSBDataCollection;
