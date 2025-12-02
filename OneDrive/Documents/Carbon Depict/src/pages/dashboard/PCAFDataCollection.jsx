// Cache bust 2025-10-23
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Download, CheckCircle2, Circle, FileText,
  Lightbulb, BookOpen, Plus, Building2, TrendingUp, DollarSign,
  PieChart, BarChart3, AlertTriangle, Shield, Calculator, X,
  ChevronRight, Info, Target, Leaf
} from 'lucide-react';
import { useESGData } from '../../utils/esgDataManager';
import { calculatePCAFFinancedEmissions } from '../../utils/emissionsCalculator';

// --- CONSTANTS ---
const ASSET_CLASSES = [
  { id: 'corporate-loans', name: 'Listed Equity & Corporate Bonds', icon: BarChart3, description: 'Emissions from listed companies' },
  { id: 'business-loans', name: 'Business Loans & Unlisted Equity', icon: Building2, description: 'SME and private company loans' },
  { id: 'project-finance', name: 'Project Finance', icon: TrendingUp, description: 'Infrastructure and project loans' },
  { id: 'commercial-real-estate', name: 'Commercial Real Estate', icon: Building2, description: 'Commercial property investments' },
  { id: 'mortgages', name: 'Mortgages', icon: Building2, description: 'Residential property loans' },
  { id: 'motor-vehicle', name: 'Motor Vehicle Loans', icon: Leaf, description: 'Vehicle financing' },
  { id: 'sovereign-debt', name: 'Sovereign Debt', icon: Shield, description: 'Government bonds and loans' },
];

const DATA_QUALITY_SCORES = {
  1: { label: 'Score 1 - Reported', description: 'Verified emissions data', color: 'text-greenly-success bg-greenly-success/10 border-greenly-success/20' },
  2: { label: 'Score 2 - Physical', description: 'Physical activity data', color: 'text-greenly-teal bg-greenly-teal/10 border-greenly-teal/20' },
  3: { label: 'Score 3 - Economic', description: 'Economic activity data', color: 'text-greenly-warning bg-greenly-warning/10 border-greenly-warning/20' },
  4: { label: 'Score 4 - Sector Avg', description: 'Sector average data', color: 'text-greenly-orange bg-greenly-orange/10 border-greenly-orange/20' },
  5: { label: 'Score 5 - Proxy', description: 'Proxy data', color: 'text-greenly-alert bg-greenly-alert/10 border-greenly-alert/20' },
};

// --- SUB-COMPONENTS ---

const SidebarItem = ({ id, label, icon: Icon, active, onClick, progress }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-2 ${active
        ? 'bg-greenly-midnight text-white shadow-md'
        : 'text-greenly-slate hover:bg-greenly-off-white hover:text-greenly-midnight'
      }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${active ? 'text-greenly-teal' : 'text-current'}`} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {progress === 100 && <CheckCircle2 className="h-4 w-4 text-greenly-success" />}
  </button>
);

const ProgressBar = ({ percentage }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-greenly-light mb-8 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-end mb-2">
      <div>
        <h3 className="font-bold text-greenly-midnight text-lg">Overall Progress</h3>
        <p className="text-sm text-greenly-slate">Complete all sections to finalize report</p>
      </div>
      <span className="text-2xl font-bold text-greenly-teal">{percentage}%</span>
    </div>
    <div className="w-full bg-greenly-light rounded-full h-3">
      <div
        className="bg-greenly-teal h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const CalculatorModal = ({ isOpen, onClose }) => {
  const [inputs, setInputs] = useState({
    outstandingAmount: '',
    totalEquity: '',
    emissions: '',
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const outstanding = parseFloat(inputs.outstandingAmount) || 0;
    const equity = parseFloat(inputs.totalEquity) || 1; // Avoid division by zero
    const emissions = parseFloat(inputs.emissions) || 0;

    const attributionFactor = outstanding / equity;
    const financedEmissions = emissions * attributionFactor;

    setResult({
      attributionFactor: (attributionFactor * 100).toFixed(2),
      financedEmissions: financedEmissions.toFixed(2)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border-2 border-greenly-light">
        <div className="p-6 border-b-2 border-greenly-light flex justify-between items-center">
          <h3 className="text-xl font-bold text-greenly-midnight flex items-center gap-2">
            <Calculator className="h-6 w-6 text-greenly-teal" />
            PCAF Calculator
          </h3>
          <button onClick={onClose} className="text-greenly-slate hover:text-greenly-midnight transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-greenly-midnight mb-1">Outstanding Amount ($)</label>
            <input
              type="number"
              className="w-full rounded-xl border-2 border-greenly-light focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all px-4 py-3"
              value={inputs.outstandingAmount}
              onChange={e => setInputs({ ...inputs, outstandingAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-greenly-midnight mb-1">Total Company Equity + Debt ($)</label>
            <input
              type="number"
              className="w-full rounded-xl border-2 border-greenly-light focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all px-4 py-3"
              value={inputs.totalEquity}
              onChange={e => setInputs({ ...inputs, totalEquity: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-greenly-midnight mb-1">Company Emissions (tCO2e)</label>
            <input
              type="number"
              className="w-full rounded-xl border-2 border-greenly-light focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all px-4 py-3"
              value={inputs.emissions}
              onChange={e => setInputs({ ...inputs, emissions: e.target.value })}
            />
          </div>

          <button
            onClick={calculate}
            className="w-full py-3 bg-greenly-midnight text-white rounded-xl font-semibold hover:bg-greenly-midnight/90 transition-colors shadow-lg"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-4 p-4 bg-greenly-off-white rounded-xl border-2 border-greenly-light">
              <div className="flex justify-between mb-2">
                <span className="text-greenly-slate font-medium">Attribution Factor:</span>
                <span className="font-bold text-greenly-midnight">{result.attributionFactor}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-greenly-slate font-medium">Financed Emissions:</span>
                <span className="font-bold text-greenly-teal">{result.financedEmissions} tCO2e</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function PCAFDataCollection() {
  const [pcafData, savePcafData, loading] = useESGData('pcaf');
  const [activeSection, setActiveSection] = useState('portfolio');
  const [showCalculator, setShowCalculator] = useState(false);

  // Initialize data structure if empty
  const data = useMemo(() => {
    if (loading) return {}; // Return empty object while loading
    if (pcafData && Object.keys(pcafData).length > 0) return pcafData;

    return {
      portfolio: {
        totalValue: { name: 'Total Portfolio Value', value: '', unit: 'USD', completed: false },
        counterparties: { name: 'Number of Counterparties', value: '', unit: '#', completed: false },
        coverage: { name: 'Portfolio Coverage', value: '', unit: '%', completed: false },
      },
      emissions: {
        scope1: { name: 'Financed Scope 1', value: '', unit: 'tCO2e', completed: false },
        scope2: { name: 'Financed Scope 2', value: '', unit: 'tCO2e', completed: false },
        scope3: { name: 'Financed Scope 3', value: '', unit: 'tCO2e', completed: false },
      },
      dataQuality: {
        score1: { name: 'Score 1 (Reported)', value: '', unit: '%', completed: false },
        score2: { name: 'Score 2 (Physical)', value: '', unit: '%', completed: false },
        score3: { name: 'Score 3 (Economic)', value: '', unit: '%', completed: false },
      },
      targets: {
        sbti: { name: 'Portfolio with SBTi', value: '', unit: '%', completed: false },
        netZero: { name: 'Net Zero Commitment', value: '', unit: 'Year', completed: false },
      }
    };
  }, [pcafData]);

  const handleUpdate = (section, field, value) => {
    const newData = {
      ...data,
      [section]: {
        ...data[section],
        [field]: {
          ...data[section][field],
          value,
          completed: value.trim() !== ''
        }
      }
    };
    savePcafData(newData);
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    Object.values(data).forEach(section => {
      Object.values(section).forEach(field => {
        total++;
        if (field.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  const sections = [
    { id: 'portfolio', label: 'Portfolio Overview', icon: PieChart },
    { id: 'emissions', label: 'Financed Emissions', icon: Leaf },
    { id: 'dataQuality', label: 'Data Quality', icon: Shield },
    { id: 'targets', label: 'Targets & Goals', icon: Target },
  ];

  return (
    <div className="flex min-h-screen bg-greenly-secondary font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-greenly-light p-6 flex flex-col fixed h-full overflow-y-auto">
        <div className="mb-8">
          <Link to="/dashboard/esg" className="flex items-center gap-2 text-greenly-slate hover:text-greenly-midnight transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-greenly-midnight">PCAF Data</h1>
          <p className="text-sm text-greenly-slate mt-1">Financed Emissions Standard</p>
        </div>

        <nav className="space-y-1 flex-1">
          {sections.map(section => (
            <SidebarItem
              key={section.id}
              {...section}
              active={activeSection === section.id}
              onClick={setActiveSection}
              progress={100} // Placeholder for section progress
            />
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-greenly-light">
          <button
            onClick={() => setShowCalculator(true)}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-greenly-off-white text-greenly-midnight font-semibold hover:bg-greenly-light transition-colors"
          >
            <Calculator className="h-5 w-5" />
            Calculator
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-greenly-teal border-t-transparent mb-4"></div>
                <p className="text-greenly-slate font-medium">Loading PCAF data...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-greenly-midnight mb-2">
                    {sections.find(s => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-greenly-slate">Enter your data according to the PCAF Global GHG Standard.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-greenly-light rounded-xl text-greenly-midnight font-semibold hover:bg-greenly-off-white hover:border-greenly-teal transition-all shadow-sm">
                    <Download className="h-5 w-5" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-greenly-midnight text-white rounded-xl font-semibold hover:bg-greenly-midnight/90 transition-all shadow-lg shadow-greenly-midnight/20">
                    <Save className="h-5 w-5" />
                    Save Changes
                  </button>
            </div>
          </div>

          <ProgressBar percentage={progress} />

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-greenly-light overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-8 grid gap-8">
              {Object.entries(data[activeSection] || {}).map(([key, field]) => (
                <div key={key} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-greenly-midnight flex items-center gap-2">
                      {field.name}
                      <Info className="h-4 w-4 text-greenly-slate cursor-help hover:text-greenly-teal transition-colors" />
                    </label>
                    {field.completed && <span className="text-xs font-bold text-greenly-success bg-greenly-success/10 px-2.5 py-1 rounded-full border border-greenly-success/20">Completed</span>}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleUpdate(activeSection, key, e.target.value)}
                      className="w-full p-4 rounded-xl border-2 border-greenly-light bg-greenly-off-white focus:bg-white focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all outline-none font-medium text-greenly-midnight placeholder-greenly-gray/50"
                      placeholder={`Enter ${field.name.toLowerCase()}...`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-greenly-slate bg-white px-2.5 py-1 rounded-md border border-greenly-light">
                      {field.unit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div className="mt-8 bg-greenly-teal/5 border-2 border-greenly-teal/20 rounded-2xl p-6 flex gap-4">
            <Lightbulb className="h-6 w-6 text-greenly-teal flex-shrink-0" />
            <div>
              <h4 className="font-bold text-greenly-midnight mb-1">PCAF Guidance</h4>
              <p className="text-sm text-greenly-slate leading-relaxed">
                For listed equity and corporate bonds, use the Enterprise Value Including Cash (EVIC) to calculate attribution factors.
                Ensure data quality scores are assigned for each data point to calculate the weighted data quality score for the portfolio.
              </p>
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      <CalculatorModal isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
    </div>
  );
}
