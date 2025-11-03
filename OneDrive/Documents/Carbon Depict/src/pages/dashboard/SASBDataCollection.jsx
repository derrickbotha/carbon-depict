// SASB Data Collection - Sustainability Accounting Standards Board
// Industry-specific financially material ESG metrics
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Download, CheckCircle2, Circle, FileText,
  Lightbulb, BookOpen, Plus, Building2, TrendingUp, DollarSign
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import { apiClient } from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';

/**
 * SASB Data Collection Page
 * Focus on financially material sustainability information for investors
 * Industry-specific metrics across 77 industries in 11 sectors
 */
const SASBDataCollection = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('technology-communications');
  const [activeCategory, setActiveCategory] = useState('environment');
  const [viewMode, setViewMode] = useState('list');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  // SASB Industries (Sample - Technology & Communications sector)
  const industries = [
    { id: 'technology-communications', name: 'Technology & Communications', sector: 'Technology & Communications' },
    { id: 'software-it', name: 'Software & IT Services', sector: 'Technology & Communications' },
    { id: 'financials', name: 'Commercial Banks', sector: 'Financials' },
    { id: 'healthcare', name: 'Biotechnology & Pharmaceuticals', sector: 'Health Care' },
    { id: 'consumer-goods', name: 'Apparel & Footwear', sector: 'Consumer Goods' },
    { id: 'extractives', name: 'Oil & Gas - Exploration & Production', sector: 'Extractives & Minerals Processing' },
    { id: 'food-beverage', name: 'Food Retailers & Distributors', sector: 'Food & Beverage' },
    { id: 'infrastructure', name: 'Electric Utilities & Power Generators', sector: 'Infrastructure' },
  ];

  // Technology & Communications - Software & IT Services (TC-SI)
  const getInitialData = () => ({
    environment: {
      'TC-SI-130a.1': { name: 'Total energy consumed (GJ)', value: '', unit: 'GJ', completed: false, materiality: 'High' },
      'TC-SI-130a.2': { name: 'Percentage grid electricity (%)', value: '', unit: '%', completed: false, materiality: 'High' },
      'TC-SI-130a.3': { name: 'Percentage renewable energy (%)', value: '', unit: '%', completed: false, materiality: 'High' },
      'TC-SI-130a.4': { name: 'Total water withdrawn (m³)', value: '', unit: 'm³', completed: false, materiality: 'Medium' },
      'TC-SI-130a.5': { name: 'Total water consumed (m³)', value: '', unit: 'm³', completed: false, materiality: 'Medium' },
    },
    socialCapital: {
      'TC-SI-220a.1': { name: 'Number of users affected by data breaches', value: '', unit: 'number', completed: false, materiality: 'Critical' },
      'TC-SI-220a.2': { name: 'Percentage of users covered by privacy policy (%)', value: '', unit: '%', completed: false, materiality: 'Critical' },
      'TC-SI-220a.3': { name: 'Number of law enforcement requests for user information', value: '', unit: 'number', completed: false, materiality: 'High' },
      'TC-SI-220a.4': { name: 'Number of requests complied with', value: '', unit: 'number', completed: false, materiality: 'High' },
      'TC-SI-220a.5': { name: 'List of countries where core products subject to censorship', value: '', unit: 'text', completed: false, materiality: 'Medium' },
    },
    humanCapital: {
      'TC-SI-330a.1': { name: 'Percentage of gender diversity in management (%)', value: '', unit: '%', completed: false, materiality: 'High' },
      'TC-SI-330a.2': { name: 'Percentage of racial/ethnic diversity in management (%)', value: '', unit: '%', completed: false, materiality: 'High' },
      'TC-SI-330a.3': { name: 'Employee engagement score', value: '', unit: 'score', completed: false, materiality: 'Medium' },
    },
    businessModelInnovation: {
      'TC-SI-410a.1': { name: 'Total amount of monetary losses from legal proceedings - anti-competitive behavior ($)', value: '', unit: 'USD', completed: false, materiality: 'High' },
      'TC-SI-410a.2': { name: 'Number of workforce optimization activities', value: '', unit: 'number', completed: false, materiality: 'Medium' },
      'TC-SI-410a.3': { name: 'Number of employees affected by optimization', value: '', unit: 'number', completed: false, materiality: 'Medium' },
    },
    leadershipGovernance: {
      'TC-SI-550a.1': { name: 'Number of performance issues related to systems', value: '', unit: 'number', completed: false, materiality: 'High' },
      'TC-SI-550a.2': { name: 'Customer downtime (days)', value: '', unit: 'days', completed: false, materiality: 'Critical' },
      'TC-SI-550a.3': { name: 'Percentage of downtime from service disruptions (%)', value: '', unit: '%', completed: false, materiality: 'Critical' },
    },
  });

  const [sasbData, setSasbData] = useState(() => {
    const saved = esgDataManager.getFrameworkData('sasb');
    return Object.keys(saved).length > 0 ? saved : getInitialData();
  });

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    Object.values(sasbData).forEach(category => {
      Object.values(category).forEach(field => {
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

  const updateField = (category, disclosure, value) => {
    setSasbData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [disclosure]: {
          ...prev[category][disclosure],
          value,
          completed: value.trim() !== '',
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await esgDataManager.saveFrameworkData('sasb', sasbData);
      
      // Also save to backend
      await apiClient.esgMetrics.bulkCreate({
        framework: 'SASB',
        industry: selectedIndustry,
        data: sasbData,
      });

      alert('SASB data saved successfully!');
    } catch (error) {
      console.error('Error saving SASB data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleExport = () => {
    const csvData = [];
    csvData.push(['Disclosure', 'Metric Name', 'Value', 'Unit', 'Materiality', 'Completed']);

    Object.entries(sasbData).forEach(([category, fields]) => {
      Object.entries(fields).forEach(([disclosure, field]) => {
        csvData.push([
          disclosure,
          field.name,
          field.value,
          field.unit,
          field.materiality,
          field.completed ? 'Yes' : 'No',
        ]);
      });
    });

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sasb-data-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const categories = {
    environment: { name: 'Environment', icon: '🌍', color: 'green' },
    socialCapital: { name: 'Social Capital', icon: '👥', color: 'blue' },
    humanCapital: { name: 'Human Capital', icon: '💼', color: 'purple' },
    businessModelInnovation: { name: 'Business Model & Innovation', icon: '💡', color: 'orange' },
    leadershipGovernance: { name: 'Leadership & Governance', icon: '⚖️', color: 'red' },
  };

  const materialityStats = {
    Critical: Object.values(sasbData[activeCategory] || {}).filter(f => f.materiality === 'Critical').length,
    High: Object.values(sasbData[activeCategory] || {}).filter(f => f.materiality === 'High').length,
    Medium: Object.values(sasbData[activeCategory] || {}).filter(f => f.materiality === 'Medium').length,
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
            <h1 className="text-3xl font-bold text-cd-midnight">SASB Data Collection</h1>
            <p className="text-cd-muted">
              Industry-specific financially material ESG metrics for investors
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
        frameworkName="SASB"
        percentage={progress.percentage}
        completedFields={progress.completed}
        totalFields={progress.total}
      />

      {/* Industry Selection */}
      <div className="rounded-lg border border-cd-border bg-white p-6">
        <h3 className="mb-3 font-semibold text-cd-midnight">Select Your Industry</h3>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="w-full rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-midnight focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
        >
          {industries.map(ind => (
            <option key={ind.id} value={ind.id}>
              {ind.name} ({ind.sector})
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-cd-muted">
          SASB standards are industry-specific. Each industry has unique financially material metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-2xl font-bold text-red-700">{materialityStats.Critical}</div>
          <div className="text-sm text-red-600">Critical Materiality</div>
        </div>
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="text-2xl font-bold text-orange-700">{materialityStats.High}</div>
          <div className="text-sm text-orange-600">High Materiality</div>
        </div>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="text-2xl font-bold text-yellow-700">{materialityStats.Medium}</div>
          <div className="text-sm text-yellow-600">Medium Materiality</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-cd-border">
        <div className="flex gap-2 overflow-x-auto">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeCategory === key
                  ? 'border-cd-midnight text-cd-midnight'
                  : 'border-transparent text-cd-muted hover:text-cd-midnight'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Data Collection Form */}
      <div className="rounded-lg border border-cd-border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-cd-midnight">
            {categories[activeCategory]?.name} Metrics
          </h2>
          <Button size="sm" onClick={() => setShowNewEntryForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Metric
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(sasbData[activeCategory] || {}).map(([disclosure, field]) => (
            <div key={disclosure} className="rounded-lg border border-cd-border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm text-cd-muted">{disclosure}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      field.materiality === 'Critical' ? 'bg-red-100 text-red-700' :
                      field.materiality === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {field.materiality}
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
                <input
                  type={field.unit === 'text' ? 'text' : 'number'}
                  value={field.value}
                  onChange={(e) => updateField(activeCategory, disclosure, e.target.value)}
                  placeholder={`Enter ${field.unit}`}
                  className="flex-1 rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                />
                <div className="flex items-center rounded-lg border border-cd-border bg-cd-surface px-3 py-2 text-sm text-cd-muted">
                  {field.unit}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-cd-muted">
                <Lightbulb className="h-3 w-3" />
                <span>Financial materiality: Impacts investor decision-making</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="rounded-lg border border-cd-mint/30 bg-cd-mint/10 p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cd-midnight" />
          <h3 className="font-semibold text-cd-midnight">SASB Guidance</h3>
        </div>
        <ul className="space-y-2 text-sm text-cd-muted">
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Financial Materiality:</strong> SASB focuses on information likely to affect enterprise value and investor decisions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Industry-Specific:</strong> Metrics are tailored to 77 industries across 11 sectors based on evidence of financial impact.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Five Dimensions:</strong> Environment, Social Capital, Human Capital, Business Model & Innovation, Leadership & Governance.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Investor-Focused:</strong> Designed for inclusion in SEC filings (10-K, 20-F) and mainstream financial reports.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Integration with ISSB:</strong> SASB standards now maintained by IFRS Foundation as part of ISSB climate and sustainability disclosure standards.</span>
          </li>
        </ul>
      </div>

      {/* New Entry Form Modal */}
      {showNewEntryForm && (
        <ESGDataEntryForm
          framework="SASB"
          onClose={() => setShowNewEntryForm(false)}
          onSubmit={(data) => {
            console.log('New SASB entry:', data);
            setShowNewEntryForm(false);
          }}
        />
      )}
    </div>
  );
};

export default SASBDataCollection;
