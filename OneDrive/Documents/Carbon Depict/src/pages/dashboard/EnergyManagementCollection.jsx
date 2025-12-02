// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Zap,
  Leaf,
  TrendingUp,
  Info,
  AlertCircle,
  Lightbulb,
  Battery,
  Settings
} from 'lucide-react';
// import useESGMetrics from '../../hooks/useESGMetrics'; // Assuming this hook exists and works

// Mock hook since the real one is not available
const useESGMetrics = () => ({
  createMetric: async (data) => { console.log('Creating metric:', data); return { _id: 'new-metric-id', ...data }; },
  updateMetric: async (id, data) => { console.log('Updating metric:', id, data); },
  metrics: [],
  loading: false,
});


// --- DATA & HOOK ---

const useEnergyManagement = () => {
  const navigate = useNavigate();
  const { createMetric, updateMetric, metrics, loading } = useESGMetrics({
    topic: 'Energy Management',
    pillar: 'Environmental'
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [existingMetricId, setExistingMetricId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('totalEnergy');
  const [formData, setFormData] = useState({
    totalEnergy: {
      'total-electricity': { name: 'Total Electricity Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7'] },
      'total-heating': { name: 'Total Heating Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'total-cooling': { name: 'Total Cooling Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'total-steam': { name: 'Total Steam Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'fuel-consumption': { name: 'Fuel Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
    },
    renewableEnergy: {
      'renewable-electricity': { name: 'Renewable Electricity Generated On-site (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
      'renewable-purchased': { name: 'Renewable Electricity Purchased (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
      'solar-capacity': { name: 'Solar Panel Capacity Installed (kW)', value: '', unit: 'kW', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.2'] },
      'wind-capacity': { name: 'Wind Energy Capacity (kW)', value: '', unit: 'kW', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.2'] },
      'renewable-percentage': { name: 'Renewable Energy as % of Total', value: '', unit: '%', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
    },
    energyIntensity: {
      'intensity-revenue': { name: 'Energy Intensity per Revenue (kWh/£)', value: '', unit: 'kWh/£', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-production': { name: 'Energy Intensity per Production Unit (kWh/unit)', value: '', unit: 'kWh/unit', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-sqm': { name: 'Energy Intensity per Square Meter (kWh/m²)', value: '', unit: 'kWh/m²', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-employee': { name: 'Energy Intensity per Employee (kWh/FTE)', value: '', unit: 'kWh/FTE', completed: false, frameworks: ['GRI 302-3'] },
    },
    energyEfficiency: {
      'reduction-initiatives': { name: 'Energy Reduction Initiatives Implemented', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'energy-saved': { name: 'Energy Savings Achieved (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'efficiency-measures': { name: 'Energy Efficiency Measures Description', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5'] },
      'led-lighting': { name: 'LED Lighting Installed (%)', value: '', unit: '%', completed: false, frameworks: ['SDG 7.3'] },
      'building-management-system': { name: 'Building Management System (BMS) in Place', value: '', unit: 'text', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.3'] },
    },
    energyMix: {
      'grid-electricity': { name: 'Grid Electricity (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'natural-gas': { name: 'Natural Gas (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'diesel': { name: 'Diesel (litres)', value: '', unit: 'litres', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'coal': { name: 'Coal (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'biomass': { name: 'Biomass (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
    },
    managementSystems: {
      'iso-50001': { name: 'ISO 50001 Energy Management System Certified', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'energy-policy': { name: 'Energy Management Policy in Place', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5'] },
      'energy-targets': { name: 'Energy Reduction Targets Set', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'monitoring-frequency': { name: 'Energy Monitoring Frequency', value: '', unit: 'text', completed: false, frameworks: ['CSRD E1-5'] },
    },
  });

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [fieldKey]: {
          ...prev[category][fieldKey],
          value: value,
          completed: value.trim() !== '',
        },
      },
    }));
  }, []);

  const calculateCategoryProgress = useCallback((category) => {
    const fields = Object.values(formData[category]);
    const completedFields = fields.filter((f) => f.completed).length;
    return fields.length > 0 ? Math.round((completedFields / fields.length) * 100) : 0;
  }, [formData]);

  const totalProgress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    Object.values(formData).forEach((category) => {
      const fields = Object.values(category);
      totalFields += fields.length;
      completedFields += fields.filter((f) => f.completed).length;
    });
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [formData]);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0];
      setExistingMetricId(latestMetric._id);
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setFormData(latestMetric.metadata.formData);
      }
    }
  }, [metrics]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const metricData = { /* ... */ };
      if (existingMetricId) await updateMetric(existingMetricId, metricData);
      else {
        const newMetric = await createMetric(metricData);
        setExistingMetricId(newMetric._id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric]);

  const handleSubmit = useCallback(async () => {
    setSaveStatus('submitting');
    try {
      const metricData = { /* ... */ };
      if (existingMetricId) await updateMetric(existingMetricId, metricData);
      else await createMetric(metricData);
      setSaveStatus('submitted');
      setTimeout(() => navigate('/dashboard/esg/data-entry'), 1500);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric, navigate]);

  const categories = [
    { id: 'totalEnergy', name: 'Total Energy', icon: Zap, fields: 5 },
    { id: 'renewableEnergy', name: 'Renewables', icon: Leaf, fields: 5 },
    { id: 'energyIntensity', name: 'Intensity', icon: TrendingUp, fields: 4 },
    { id: 'energyEfficiency', name: 'Efficiency', icon: Lightbulb, fields: 5 },
    { id: 'energyMix', name: 'Energy Mix', icon: Battery, fields: 5 },
    { id: 'managementSystems', name: 'Systems', icon: Settings, fields: 4 },
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  return {
    currentCategory,
    setCurrentCategory,
    formData,
    handleInputChange,
    calculateCategoryProgress,
    totalProgress,
    categories,
    currentCategoryData,
    handleSave,
    handleSubmit,
    saveStatus,
    loading,
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ totalProgress, onSave, onSubmit, saveStatus }) => (
  <div className="border-b border-greenly-light-gray bg-white">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/esg/data-entry" className="btn-icon">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Zap className="h-5 w-5 text-greenly-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-greenly-primary">Energy Management</span>
            </div>
            <h1 className="text-2xl font-bold text-greenly-charcoal">Energy Data Collection</h1>
            <p className="text-sm text-greenly-slate">Data for GRI 302, CSRD E1-5, and SDG 7</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Download className="h-4 w-4" /> Export</button>
          <button className="btn-primary" onClick={onSave} disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : <><Save className="h-4 w-4" /> Save</>}
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-greenly-charcoal">Overall Progress</span>
          <span className="font-bold text-greenly-primary">{totalProgress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-greenly-light-gray">
          <div className="h-2 rounded-full bg-greenly-primary transition-all" style={{ width: `${totalProgress}%` }} />
        </div>
      </div>
    </div>
  </div>
);

const FrameworkTags = () => (
  <div className="flex flex-wrap gap-2">
    <span className="status-badge-blue">GRI 302: Energy</span>
    <span className="status-badge-green">CSRD E1-5: Energy</span>
    <span className="status-badge-purple">SDG 7: Clean Energy</span>
  </div>
);

const Sidebar = ({ categories, currentCategory, setCurrentCategory, calculateCategoryProgress }) => (
  <div className="sticky top-6 space-y-2">
    <h3 className="input-label px-2">Categories</h3>
    {categories.map((cat) => {
      const progress = calculateCategoryProgress(cat.id);
      const isActive = currentCategory === cat.id;
      return (
        <button
          key={cat.id}
          onClick={() => setCurrentCategory(cat.id)}
          className={`w-full rounded-lg p-3 text-left transition-all ${
            isActive ? 'bg-greenly-primary text-white' : 'bg-white text-greenly-charcoal hover:bg-greenly-off-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <cat.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-greenly-primary'}`} />
              <span className="font-semibold">{cat.name}</span>
            </div>
            <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-greenly-slate'}`}>
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-black/10">
            <div className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-greenly-primary'}`} style={{ width: `${progress}%` }} />
          </div>
        </button>
      );
    })}
  </div>
);

const DataCollectionForm = ({ category, formData, handleInputChange }) => (
  <div className="card p-6">
    <div className="mb-6 border-b border-greenly-light-gray pb-4">
      <div className="flex items-center gap-3">
        <category.icon className="h-7 w-7 text-greenly-primary" />
        <div>
          <h2 className="text-xl font-bold text-greenly-charcoal">{category.name}</h2>
          <p className="text-sm text-greenly-slate">Enter your organization's energy data for the reporting period.</p>
        </div>
      </div>
    </div>
    <div className="space-y-5">
      {Object.entries(formData[category.id]).map(([fieldKey, field]) => (
        <div key={fieldKey} className="flex items-start gap-4">
          <div className="mt-1.5 flex-shrink-0">
            {field.completed ? <CheckCircle2 className="h-5 w-5 text-greenly-primary" /> : <Circle className="h-5 w-5 text-gray-300" />}
          </div>
          <div className="flex-1">
            <label className="input-label">{field.name}</label>
            <div className="mb-2 flex flex-wrap gap-1">
              {field.frameworks.map(fw => (
                <span key={fw} className="status-badge-gray text-xs">{fw}</span>
              ))}
            </div>
            <div className="flex gap-2">
              {field.unit === 'text' ? (
                <textarea
                  value={field.value}
                  onChange={(e) => handleInputChange(category.id, fieldKey, e.target.value)}
                  className="input-base"
                  placeholder="Enter description"
                  rows={3}
                />
              ) : (
                <>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={field.value}
                    onChange={(e) => handleInputChange(category.id, fieldKey, e.target.value)}
                    className="input-base"
                    placeholder={`Enter amount in ${field.unit}`}
                  />
                  <div className="flex w-24 items-center justify-center rounded-md border border-greenly-light-gray bg-greenly-off-white px-3 text-sm text-greenly-slate">
                    {field.unit}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GuidancePanel = ({ categoryId }) => {
  const guidance = {
    totalEnergy: [
      "GRI 302-1: Report total fuel consumption from non-renewable and renewable sources.",
      "CSRD E1-5: Total energy consumption in MWh (electricity, heating, cooling, steam).",
      "SDG 7: Tracking progress towards affordable and clean energy access.",
    ],
    renewableEnergy: [
      "SDG 7.2: Increase share of renewable energy in the global energy mix.",
      "Include solar PV, wind, hydroelectric, geothermal, and biomass energy.",
      "Calculate renewable percentage = (Renewable kWh / Total kWh) × 100.",
    ],
    energyEfficiency: [
      "GRI 302-4: Reductions in energy consumption achieved as a direct result of initiatives.",
      "SDG 7.3: Double the global rate of improvement in energy efficiency.",
      "Examples: LED lighting, HVAC upgrades, insulation, process optimization.",
    ]
  };

  if (!guidance[categoryId]) return null;

  return (
    <div className="mt-6 rounded-lg border border-greenly-light-gray bg-greenly-off-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-greenly-charcoal">
        <Info className="h-4 w-4" />
        Guidance
      </div>
      <ul className="space-y-1 pl-4 text-xs text-greenly-slate list-disc">
        {guidance[categoryId].map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function EnergyManagementCollection() {
  const {
    currentCategory,
    setCurrentCategory,
    formData,
    handleInputChange,
    calculateCategoryProgress,
    totalProgress,
    categories,
    currentCategoryData,
    handleSave,
    handleSubmit,
    saveStatus,
    loading,
  } = useEnergyManagement();

  return (
    <div className="min-h-screen bg-greenly-off-white">
      <Header 
        totalProgress={totalProgress} 
        onSave={handleSave}
        onSubmit={handleSubmit}
        saveStatus={saveStatus}
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <FrameworkTags />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Sidebar
              categories={categories}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
              calculateCategoryProgress={calculateCategoryProgress}
            />
          </div>
          <div className="lg:col-span-3">
            <DataCollectionForm
              category={currentCategoryData}
              formData={formData}
              handleInputChange={handleInputChange}
            />
            <GuidancePanel categoryId={currentCategory} />
            <div className="mt-6 flex gap-4 border-t border-greenly-light-gray pt-6">
              <button
                className="btn-primary flex-1"
                onClick={handleSubmit}
                disabled={loading || saveStatus === 'submitting'}
              >
                {saveStatus === 'submitting' ? 'Submitting...' : saveStatus === 'submitted' ? '✓ Submitted' : 'Submit Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
