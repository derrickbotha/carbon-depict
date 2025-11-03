// PCAF Data Collection - Partnership for Carbon Accounting Financials
// Standard for measuring and disclosing financed emissions
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, Download, CheckCircle2, Circle, FileText,
  Lightbulb, BookOpen, Plus, Building2, TrendingUp, DollarSign,
  PieChart, BarChart3, AlertTriangle, Shield, Calculator
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import ESGDataEntryForm from '../../components/ESGDataEntryForm';
import { apiClient } from '../../utils/api';
import esgDataManager from '../../utils/esgDataManager';
import { calculatePCAFFinancedEmissions } from '../../utils/emissionsCalculator';
import { getEmissionFactor } from '../../utils/emissionFactors';

/**
 * PCAF Data Collection Page
 * Partnership for Carbon Accounting Financials
 * Standard for measuring and disclosing GHG emissions associated with loans and investments
 */
const PCAFDataCollection = () => {
  const [activeAssetClass, setActiveAssetClass] = useState('corporate-loans');
  const [activeSection, setActiveSection] = useState('portfolio');
  const [viewMode, setViewMode] = useState('list');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    counterpartyEmissionsTonnes: '',
    counterpartyRevenueMillion: '',
    counterpartySector: 'manufacturing',
    outstandingAmountUSD: '',
    totalAssetOrEquityUSD: '',
    buildingAreaM2: '',
    dataQualitySource: 'sector-average',
  });
  const [calculationResult, setCalculationResult] = useState(null);

  // PCAF Asset Classes
  const assetClasses = [
    { id: 'corporate-loans', name: 'Listed Equity & Corporate Bonds', icon: '📊', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'business-loans', name: 'Business Loans & Unlisted Equity', icon: '🏢', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'project-finance', name: 'Project Finance', icon: '🏗️', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'commercial-real-estate', name: 'Commercial Real Estate', icon: '🏙️', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'mortgages', name: 'Mortgages', icon: '🏠', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'motor-vehicle', name: 'Motor Vehicle Loans', icon: '🚗', dataQuality: [1, 2, 3, 4, 5] },
    { id: 'sovereign-debt', name: 'Sovereign Debt', icon: '🏛️', dataQuality: [1, 2, 3] },
  ];

  const getInitialData = () => ({
    // Portfolio Overview
    portfolio: {
      'pcaf-port-1': { name: 'Total portfolio value (USD)', value: '', unit: 'USD', completed: false, dataQuality: null },
      'pcaf-port-2': { name: 'Number of counterparties/investees', value: '', unit: 'number', completed: false, dataQuality: null },
      'pcaf-port-3': { name: 'Portfolio coverage (%)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-port-4': { name: 'Reporting period', value: '', unit: 'text', completed: false, dataQuality: null },
    },
    
    // Financed Emissions Calculation
    emissions: {
      'pcaf-em-1': { name: 'Total financed emissions - Scope 1 (tCO2e)', value: '', unit: 'tCO2e', completed: false, dataQuality: null },
      'pcaf-em-2': { name: 'Total financed emissions - Scope 2 (tCO2e)', value: '', unit: 'tCO2e', completed: false, dataQuality: null },
      'pcaf-em-3': { name: 'Total financed emissions - Scope 3 (tCO2e)', value: '', unit: 'tCO2e', completed: false, dataQuality: null },
      'pcaf-em-4': { name: 'Attribution factor methodology', value: '', unit: 'text', completed: false, dataQuality: null },
      'pcaf-em-5': { name: 'Outstanding amount (USD)', value: '', unit: 'USD', completed: false, dataQuality: null },
      'pcaf-em-6': { name: 'Total asset/equity (USD)', value: '', unit: 'USD', completed: false, dataQuality: null },
    },

    // Data Quality Assessment
    dataQuality: {
      'pcaf-dq-1': { name: 'Percentage of portfolio with Score 1 (Reported data) (%)', value: '', unit: '%', completed: false, dataQuality: 1 },
      'pcaf-dq-2': { name: 'Percentage of portfolio with Score 2 (Physical activity-based) (%)', value: '', unit: '%', completed: false, dataQuality: 2 },
      'pcaf-dq-3': { name: 'Percentage of portfolio with Score 3 (Economic activity-based) (%)', value: '', unit: '%', completed: false, dataQuality: 3 },
      'pcaf-dq-4': { name: 'Percentage of portfolio with Score 4 (Region/sector average) (%)', value: '', unit: '%', completed: false, dataQuality: 4 },
      'pcaf-dq-5': { name: 'Percentage of portfolio with Score 5 (Global average) (%)', value: '', unit: '%', completed: false, dataQuality: 5 },
      'pcaf-dq-6': { name: 'Weighted average data quality score', value: '', unit: 'score', completed: false, dataQuality: null },
    },

    // Carbon Intensity Metrics
    intensity: {
      'pcaf-int-1': { name: 'Portfolio carbon intensity (tCO2e per $M invested)', value: '', unit: 'tCO2e/$M', completed: false, dataQuality: null },
      'pcaf-int-2': { name: 'Weighted average carbon intensity (WACI)', value: '', unit: 'tCO2e/$M revenue', completed: false, dataQuality: null },
      'pcaf-int-3': { name: 'Physical intensity (tCO2e per physical unit)', value: '', unit: 'tCO2e/unit', completed: false, dataQuality: null },
      'pcaf-int-4': { name: 'Economic intensity (tCO2e per $M revenue)', value: '', unit: 'tCO2e/$M', completed: false, dataQuality: null },
    },

    // Engagement & Target Setting
    engagement: {
      'pcaf-eng-1': { name: 'Number of high-carbon counterparties engaged', value: '', unit: 'number', completed: false, dataQuality: null },
      'pcaf-eng-2': { name: 'Percentage of counterparties with science-based targets (%)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-eng-3': { name: 'Percentage of counterparties with net-zero commitments (%)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-eng-4': { name: 'Portfolio decarbonization target (%)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-eng-5': { name: 'Target year for portfolio net-zero', value: '', unit: 'year', completed: false, dataQuality: null },
      'pcaf-eng-6': { name: 'Interim reduction target 2030 (%)', value: '', unit: '%', completed: false, dataQuality: null },
    },

    // Sector Exposure
    sectorExposure: {
      'pcaf-sec-1': { name: 'Exposure to fossil fuel sector (% of portfolio)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-sec-2': { name: 'Exposure to renewable energy (% of portfolio)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-sec-3': { name: 'Exposure to real estate (% of portfolio)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-sec-4': { name: 'Exposure to automotive (% of portfolio)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-sec-5': { name: 'Exposure to agriculture (% of portfolio)', value: '', unit: '%', completed: false, dataQuality: null },
      'pcaf-sec-6': { name: 'Top 5 carbon-intensive sectors', value: '', unit: 'text', completed: false, dataQuality: null },
    },
  });

  const [pcafData, setPcafData] = useState(() => {
    const saved = esgDataManager.getFrameworkData('pcaf');
    return Object.keys(saved).length > 0 ? saved : getInitialData();
  });

  const calculateProgress = () => {
    let totalFields = 0;
    let completedFields = 0;

    Object.values(pcafData).forEach(section => {
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

  const updateField = (section, disclosure, value) => {
    setPcafData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [disclosure]: {
          ...prev[section][disclosure],
          value,
          completed: value.trim() !== '',
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await esgDataManager.saveFrameworkData('pcaf', pcafData);
      
      await apiClient.esgMetrics.bulkCreate({
        framework: 'PCAF',
        assetClass: activeAssetClass,
        data: pcafData,
      });

      alert('PCAF data saved successfully!');
    } catch (error) {
      console.error('Error saving PCAF data:', error);
      alert('Failed to save data. Please try again.');
    }
  };

  const handleExport = () => {
    const csvData = [];
    csvData.push(['Section', 'Metric ID', 'Metric Name', 'Value', 'Unit', 'Data Quality Score', 'Completed']);

    Object.entries(pcafData).forEach(([section, fields]) => {
      Object.entries(fields).forEach(([disclosure, field]) => {
        csvData.push([
          section,
          disclosure,
          field.name,
          field.value,
          field.unit,
          field.dataQuality || 'N/A',
          field.completed ? 'Yes' : 'No',
        ]);
      });
    });

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pcaf-financed-emissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleCalculate = () => {
    const inputs = {
      counterpartyEmissionsTonnes: parseFloat(calculatorInputs.counterpartyEmissionsTonnes) || 0,
      counterpartyRevenueMillion: parseFloat(calculatorInputs.counterpartyRevenueMillion) || 0,
      counterpartySector: calculatorInputs.counterpartySector,
      outstandingAmountUSD: parseFloat(calculatorInputs.outstandingAmountUSD) || 0,
      totalAssetOrEquityUSD: parseFloat(calculatorInputs.totalAssetOrEquityUSD) || 0,
      buildingAreaM2: parseFloat(calculatorInputs.buildingAreaM2) || 0,
      dataQualitySource: calculatorInputs.dataQualitySource,
    };

    const result = calculatePCAFFinancedEmissions(inputs);
    setCalculationResult(result);
  };

  const sections = {
    portfolio: { name: 'Portfolio Overview', icon: '📋', description: 'Overall portfolio characteristics' },
    emissions: { name: 'Financed Emissions', icon: '🏭', description: 'GHG emissions from loans and investments' },
    dataQuality: { name: 'Data Quality', icon: '📊', description: 'PCAF 1-5 data quality scoring' },
    intensity: { name: 'Carbon Intensity', icon: '📈', description: 'Normalized emissions metrics' },
    engagement: { name: 'Engagement & Targets', icon: '🎯', description: 'Counterparty engagement and portfolio targets' },
    sectorExposure: { name: 'Sector Exposure', icon: '🏢', description: 'Portfolio breakdown by sector' },
  };

  const dataQualityScores = {
    1: { label: 'Score 1 - Reported Data', description: 'Actual GHG emissions reported by counterparty', color: 'bg-green-500', quality: 'Highest' },
    2: { label: 'Score 2 - Physical Activity', description: 'Primary physical activity data with emission factors', color: 'bg-lime-500', quality: 'High' },
    3: { label: 'Score 3 - Economic Activity', description: 'Economic activity data with emission factors', color: 'bg-yellow-500', quality: 'Medium' },
    4: { label: 'Score 4 - Average Data', description: 'Region/sector average emissions data', color: 'bg-orange-500', quality: 'Low' },
    5: { label: 'Score 5 - Proxy Data', description: 'Global or sector average proxy data', color: 'bg-red-500', quality: 'Lowest' },
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
            <h1 className="text-3xl font-bold text-cd-midnight">PCAF Data Collection</h1>
            <p className="text-cd-muted">
              Partnership for Carbon Accounting Financials - Financed Emissions Standard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowCalculator(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            PCAF Calculator
          </Button>
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
        frameworkName="PCAF"
        percentage={progress.percentage}
        completedFields={progress.completed}
        totalFields={progress.total}
      />

      {/* Asset Class Selection */}
      <div className="rounded-lg border border-cd-border bg-white p-6">
        <h3 className="mb-3 font-semibold text-cd-midnight">Select Asset Class</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {assetClasses.map(assetClass => (
            <button
              key={assetClass.id}
              onClick={() => setActiveAssetClass(assetClass.id)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                activeAssetClass === assetClass.id
                  ? 'border-cd-midnight bg-cd-mint/10'
                  : 'border-cd-border bg-white hover:border-cd-mint'
              }`}
            >
              <div className="mb-2 text-2xl">{assetClass.icon}</div>
              <div className="text-sm font-medium text-cd-midnight">{assetClass.name}</div>
              <div className="mt-1 text-xs text-cd-muted">
                Data Quality: {assetClass.dataQuality.join(', ')}
              </div>
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-cd-muted">
          PCAF Standard covers 7 asset classes with specific methodologies for calculating financed emissions.
        </p>
      </div>

      {/* Data Quality Overview */}
      <div className="rounded-lg border border-cd-border bg-white p-6">
        <h3 className="mb-4 font-semibold text-cd-midnight">PCAF Data Quality Scores (1-5 Scale)</h3>
        <div className="space-y-2">
          {Object.entries(dataQualityScores).map(([score, info]) => (
            <div key={score} className="flex items-center gap-3 rounded-lg border border-cd-border p-3">
              <div className={`h-8 w-8 flex items-center justify-center rounded ${info.color} text-white font-bold text-sm`}>
                {score}
              </div>
              <div className="flex-1">
                <div className="font-medium text-cd-midnight">{info.label}</div>
                <div className="text-sm text-cd-muted">{info.description}</div>
              </div>
              <div className="rounded-full bg-cd-surface px-3 py-1 text-xs font-medium text-cd-midnight">
                {info.quality} Quality
              </div>
            </div>
          ))}
        </div>
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
            {sections[activeSection]?.name}
          </h2>
          <Button size="sm" onClick={() => setShowNewEntryForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Custom Metric
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(pcafData[activeSection] || {}).map(([disclosure, field]) => (
            <div key={disclosure} className="rounded-lg border border-cd-border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="rounded bg-cd-surface px-2 py-0.5 font-mono text-xs text-cd-muted">
                      {disclosure}
                    </span>
                    {field.dataQuality && (
                      <span className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                        dataQualityScores[field.dataQuality]?.color
                      }`}>
                        DQ Score {field.dataQuality}
                      </span>
                    )}
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
                  type={field.unit === 'text' || field.unit === 'year' ? 'text' : 'number'}
                  value={field.value}
                  onChange={(e) => updateField(activeSection, disclosure, e.target.value)}
                  placeholder={`Enter ${field.unit}`}
                  className="flex-1 rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                />
                <div className="flex items-center rounded-lg border border-cd-border bg-cd-surface px-3 py-2 text-sm text-cd-muted">
                  {field.unit}
                </div>
              </div>

              {activeSection === 'emissions' && disclosure.includes('em-') && (
                <div className="mt-2 text-xs text-cd-muted">
                  <Lightbulb className="mr-1 inline h-3 w-3" />
                  Formula: Financed Emissions = Counterparty Emissions × (Outstanding Amount / Total Asset or Equity)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="rounded-lg border border-cd-mint/30 bg-cd-mint/10 p-6">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-cd-midnight" />
          <h3 className="font-semibold text-cd-midnight">PCAF Guidance</h3>
        </div>
        <ul className="space-y-2 text-sm text-cd-muted">
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Financed Emissions:</strong> GHG emissions associated with financial institutions' loans and investments (Scope 3 Category 15).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Attribution Factor:</strong> Proportional share of counterparty emissions based on outstanding amount relative to total enterprise value or equity.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Data Quality Scoring:</strong> 5-level hierarchy from reported data (Score 1) to proxy estimates (Score 5). Lower scores indicate higher quality.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Asset Classes:</strong> Listed equity & corporate bonds, business loans, project finance, real estate, mortgages, motor vehicles, sovereign debt.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>GHG Protocol Alignment:</strong> Follows Corporate Value Chain (Scope 3) Accounting and Reporting Standard.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Portfolio Decarbonization:</strong> Set science-based targets for reducing financed emissions aligned with Paris Agreement goals.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>PCAF Database:</strong> Access standardized emission factors and methodologies via PCAF Global database.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cd-mint">•</span>
            <span><strong>Financial Regulators:</strong> Increasingly requiring financed emissions disclosure (e.g., TCFD, CSRD, SEC climate rules).</span>
          </li>
        </ul>
      </div>

      {/* PCAF Formula Reference */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-3 font-semibold text-blue-900">PCAF Core Formula</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="rounded-lg bg-white p-4 font-mono text-xs">
            <div className="mb-2 font-semibold">Financed Emissions = </div>
            <div className="ml-4">Borrower/Investee GHG Emissions × Attribution Factor</div>
            <div className="mt-3 mb-2 font-semibold">Where Attribution Factor = </div>
            <div className="ml-4">Outstanding Amount / (Total Equity + Debt) or EVIC</div>
          </div>
          <p className="text-blue-700">
            <strong>Example:</strong> If a company emits 100,000 tCO2e and your loan is $5M of their $50M total capital, 
            your financed emissions are 100,000 × (5/50) = 10,000 tCO2e.
          </p>
        </div>
      </div>

      {/* New Entry Form Modal */}
      {showNewEntryForm && (
        <ESGDataEntryForm
          framework="PCAF"
          onClose={() => setShowNewEntryForm(false)}
          onSubmit={(data) => {
            console.log('New PCAF entry:', data);
            setShowNewEntryForm(false);
          }}
        />
      )}

      {/* PCAF Financed Emissions Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-cd-midnight">PCAF Financed Emissions Calculator</h2>
                <p className="text-sm text-cd-muted">Calculate financed emissions using DEFRA 2025 & PCAF emission factors</p>
              </div>
              <button
                onClick={() => {
                  setShowCalculator(false);
                  setCalculationResult(null);
                }}
                className="rounded-lg p-2 text-cd-muted hover:bg-cd-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Input Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-cd-midnight">Portfolio Details</h3>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-cd-midnight">
                    Outstanding Amount (USD)
                  </label>
                  <input
                    type="number"
                    value={calculatorInputs.outstandingAmountUSD}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, outstandingAmountUSD: e.target.value})}
                    placeholder="e.g., 5000000"
                    className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-cd-midnight">
                    Total Asset or Equity (USD)
                  </label>
                  <input
                    type="number"
                    value={calculatorInputs.totalAssetOrEquityUSD}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, totalAssetOrEquityUSD: e.target.value})}
                    placeholder="e.g., 50000000"
                    className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-cd-midnight">
                    Counterparty Sector
                  </label>
                  <select
                    value={calculatorInputs.counterpartySector}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, counterpartySector: e.target.value})}
                    className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="oilGas">Oil & Gas</option>
                    <option value="electricUtilities">Electric Utilities</option>
                    <option value="technology">Technology</option>
                    <option value="financialServices">Financial Services</option>
                    <option value="realEstate">Real Estate</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>

                <div className="rounded-lg border-t border-cd-border pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-cd-midnight">Data Quality Source</h4>
                  
                  <div>
                    <label className="mb-1 block text-sm font-medium text-cd-midnight">
                      Counterparty Reported Emissions (tCO₂e) <span className="text-green-600">[DQ Score 1]</span>
                    </label>
                    <input
                      type="number"
                      value={calculatorInputs.counterpartyEmissionsTonnes}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, counterpartyEmissionsTonnes: e.target.value, dataQualitySource: 'reported'})}
                      placeholder="If available (highest quality)"
                      className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                    />
                  </div>

                  <div className="mt-3 text-center text-xs text-cd-muted">OR (if emissions not reported)</div>

                  <div className="mt-3">
                    <label className="mb-1 block text-sm font-medium text-cd-midnight">
                      Counterparty Revenue (USD Million) <span className="text-orange-600">[DQ Score 4]</span>
                    </label>
                    <input
                      type="number"
                      value={calculatorInputs.counterpartyRevenueMillion}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, counterpartyRevenueMillion: e.target.value, dataQualitySource: 'sector-average'})}
                      placeholder="For sector-based estimation"
                      className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                    />
                  </div>

                  <div className="mt-3 text-center text-xs text-cd-muted">OR (for real estate)</div>

                  <div className="mt-3">
                    <label className="mb-1 block text-sm font-medium text-cd-midnight">
                      Building Area (m²) <span className="text-yellow-600">[DQ Score 3]</span>
                    </label>
                    <input
                      type="number"
                      value={calculatorInputs.buildingAreaM2}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, buildingAreaM2: e.target.value, dataQualitySource: 'economic-activity'})}
                      placeholder="For commercial real estate"
                      className="w-full rounded-lg border border-cd-border px-3 py-2 text-sm focus:border-cd-midnight focus:outline-none focus:ring-2 focus:ring-cd-midnight/20"
                    />
                  </div>
                </div>

                <Button onClick={handleCalculate} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Financed Emissions
                </Button>
              </div>

              {/* Results Section */}
              <div>
                <h3 className="mb-4 font-semibold text-cd-midnight">Calculation Results</h3>
                
                {calculationResult ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border-2 border-cd-mint bg-cd-mint/10 p-4">
                      <div className="text-sm text-cd-muted">Financed Emissions</div>
                      <div className="text-3xl font-bold text-cd-midnight">
                        {calculationResult.totalTonnesCO2e.toFixed(2)} <span className="text-lg">tCO₂e</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`rounded px-2 py-0.5 text-xs font-medium text-white ${
                          calculationResult.dataQualityScore === 1 ? 'bg-green-500' :
                          calculationResult.dataQualityScore === 2 ? 'bg-lime-500' :
                          calculationResult.dataQualityScore === 3 ? 'bg-yellow-500' :
                          calculationResult.dataQualityScore === 4 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}>
                          DQ Score: {calculationResult.dataQualityScore}
                        </span>
                        <span className="text-xs text-cd-muted">{calculationResult.methodology}</span>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-lg bg-cd-surface p-4 text-sm">
                      <div>
                        <div className="text-xs text-cd-muted">Attribution Factor</div>
                        <div className="font-semibold text-cd-midnight">{calculationResult.attributionFactor.toFixed(2)}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-cd-muted">Counterparty Emissions</div>
                        <div className="font-semibold text-cd-midnight">{calculationResult.counterpartyEmissionsTonnes.toFixed(2)} tCO₂e</div>
                      </div>
                      <div>
                        <div className="text-xs text-cd-muted">Portfolio Carbon Intensity</div>
                        <div className="font-semibold text-cd-midnight">{calculationResult.portfolioCarbonIntensity.toFixed(2)} tCO₂e/$M</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs">
                      <div className="mb-2 font-semibold text-blue-900">Calculation Steps:</div>
                      <div className="space-y-1 text-blue-800">
                        <div>1. {calculationResult.calculation.counterpartyEmissions}</div>
                        <div>2. Attribution: {calculationResult.calculation.attribution}</div>
                        <div className="font-semibold">3. Result: {calculationResult.calculation.result}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-cd-mint bg-white p-3 text-xs">
                      <div className="mb-1 font-semibold text-cd-midnight">Emission Factor Source:</div>
                      <div className="text-cd-muted">
                        {calculationResult.dataQualityScore === 1 && 'Reported data from counterparty (DEFRA 2025)'}
                        {calculationResult.dataQualityScore === 3 && 'Building area-based using CIBSE TM46 / DEFRA 2025'}
                        {calculationResult.dataQualityScore === 4 && 'Sector average intensity from PCAF Database 2025'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-cd-border">
                    <div className="text-center text-cd-muted">
                      <Calculator className="mx-auto mb-2 h-12 w-12 opacity-30" />
                      <p>Enter portfolio details and click calculate</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-cd-mint/10 p-4 text-sm">
              <div className="mb-2 font-semibold text-cd-midnight">💡 Using DEFRA 2025 Emission Factors:</div>
              <ul className="space-y-1 text-cd-muted">
                <li>• Sector intensities from PCAF Global Database 2025 (DQ Score 4)</li>
                <li>• Building emissions from CIBSE TM46 benchmarks with DEFRA factors (DQ Score 3)</li>
                <li>• Reported emissions validated against DEFRA 2025 methodology (DQ Score 1)</li>
                <li>• All factors updated annually by UK Government and PCAF partnership</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PCAFDataCollection;
