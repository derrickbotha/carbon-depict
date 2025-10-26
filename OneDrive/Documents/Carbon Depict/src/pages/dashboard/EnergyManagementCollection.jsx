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
  AlertCircle
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import useESGMetrics from '../../hooks/useESGMetrics';

const EnergyManagementCollection = () => {
  const navigate = useNavigate();
  const { createMetric, updateMetric, metrics, loading } = useESGMetrics({
    topic: 'Energy Management',
    pillar: 'Environmental'
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [existingMetricId, setExistingMetricId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('totalEnergy');
  const [formData, setFormData] = useState({
    // Total Energy Consumption
    totalEnergy: {
      'total-electricity': { name: 'Total Electricity Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7'] },
      'total-heating': { name: 'Total Heating Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'total-cooling': { name: 'Total Cooling Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'total-steam': { name: 'Total Steam Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'fuel-consumption': { name: 'Fuel Consumption (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
    },
    // Renewable Energy
    renewableEnergy: {
      'renewable-electricity': { name: 'Renewable Electricity Generated On-site (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
      'renewable-purchased': { name: 'Renewable Electricity Purchased (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
      'solar-capacity': { name: 'Solar Panel Capacity Installed (kW)', value: '', unit: 'kW', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.2'] },
      'wind-capacity': { name: 'Wind Energy Capacity (kW)', value: '', unit: 'kW', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.2'] },
      'renewable-percentage': { name: 'Renewable Energy as % of Total', value: '', unit: '%', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5', 'SDG 7.2'] },
    },
    // Energy Intensity
    energyIntensity: {
      'intensity-revenue': { name: 'Energy Intensity per Revenue (kWh/£)', value: '', unit: 'kWh/£', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-production': { name: 'Energy Intensity per Production Unit (kWh/unit)', value: '', unit: 'kWh/unit', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-sqm': { name: 'Energy Intensity per Square Meter (kWh/m²)', value: '', unit: 'kWh/m²', completed: false, frameworks: ['GRI 302-3', 'CSRD E1-5'] },
      'intensity-employee': { name: 'Energy Intensity per Employee (kWh/FTE)', value: '', unit: 'kWh/FTE', completed: false, frameworks: ['GRI 302-3'] },
    },
    // Energy Efficiency & Reduction
    energyEfficiency: {
      'reduction-initiatives': { name: 'Energy Reduction Initiatives Implemented', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'energy-saved': { name: 'Energy Savings Achieved (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5', 'SDG 7.3'] },
      'efficiency-measures': { name: 'Energy Efficiency Measures Description', value: '', unit: 'text', completed: false, frameworks: ['GRI 302-4', 'CSRD E1-5'] },
      'led-lighting': { name: 'LED Lighting Installed (%)', value: '', unit: '%', completed: false, frameworks: ['SDG 7.3'] },
      'building-management-system': { name: 'Building Management System (BMS) in Place', value: '', unit: 'text', completed: false, frameworks: ['CSRD E1-5', 'SDG 7.3'] },
    },
    // Energy Mix & Sources
    energyMix: {
      'grid-electricity': { name: 'Grid Electricity (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'natural-gas': { name: 'Natural Gas (kWh)', value: '', unit: 'kWh', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'diesel': { name: 'Diesel (litres)', value: '', unit: 'litres', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'coal': { name: 'Coal (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
      'biomass': { name: 'Biomass (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 302-1', 'CSRD E1-5'] },
    },
    // Energy Management Systems
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

  // Load existing data from database
  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const latestMetric = metrics[0];
      setExistingMetricId(latestMetric._id);
      
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setFormData(latestMetric.metadata.formData);
      }
    }
  }, [metrics]);

  // Save data to MongoDB
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const totalElectricity = parseFloat(formData.totalEnergy['total-electricity']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD,SDG',
        pillar: 'Environmental',
        topic: 'Energy Management',
        metricName: 'Energy Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalElectricity,
        unit: 'kWh',
        dataQuality: 'measured',
        metadata: {
          formData: formData,
          completionPercentage: totalProgress,
          lastUpdated: new Date().toISOString()
        }
      };
      
      if (existingMetricId) {
        await updateMetric(existingMetricId, metricData);
      } else {
        const newMetric = await createMetric(metricData);
        setExistingMetricId(newMetric._id);
      }
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving Energy Management data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric]);

  // Submit data (publish)
  const handleSubmit = useCallback(async () => {
    setSaveStatus('submitting');
    try {
      const totalElectricity = parseFloat(formData.totalEnergy['total-electricity']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD,SDG',
        pillar: 'Environmental',
        topic: 'Energy Management',
        metricName: 'Energy Management Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalElectricity,
        unit: 'kWh',
        dataQuality: 'measured',
        status: 'published',
        isDraft: false,
        metadata: {
          formData: formData,
          completionPercentage: totalProgress,
          submittedAt: new Date().toISOString()
        }
      };
      
      if (existingMetricId) {
        await updateMetric(existingMetricId, metricData);
      } else {
        await createMetric(metricData);
      }
      
      setSaveStatus('submitted');
      alert('Energy Management data submitted successfully and saved to database!');
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry');
      }, 1500);
    } catch (error) {
      console.error('Error submitting Energy Management data:', error);
      setSaveStatus('error');
      alert('Error submitting data. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric, navigate]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-cd-mint';
    if (progress >= 50) return 'bg-cd-teal';
    if (progress >= 25) return 'bg-cd-cedar';
    return 'bg-gray-300';
  };

  const categories = [
    {
      id: 'totalEnergy',
      name: 'Total Energy Consumption',
      description: 'Total energy consumed within the organization',
      icon: '⚡',
      fields: 5,
    },
    {
      id: 'renewableEnergy',
      name: 'Renewable Energy',
      description: 'Renewable energy generation and procurement',
      icon: '☀️',
      fields: 5,
    },
    {
      id: 'energyIntensity',
      name: 'Energy Intensity',
      description: 'Energy efficiency metrics and ratios',
      icon: '📊',
      fields: 4,
    },
    {
      id: 'energyEfficiency',
      name: 'Energy Efficiency & Reduction',
      description: 'Initiatives and savings achieved',
      icon: '💡',
      fields: 5,
    },
    {
      id: 'energyMix',
      name: 'Energy Mix & Sources',
      description: 'Breakdown by energy source type',
      icon: '🔋',
      fields: 5,
    },
    {
      id: 'managementSystems',
      name: 'Energy Management Systems',
      description: 'Policies, certifications, and governance',
      icon: '🎯',
      fields: 4,
    },
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/esg/data-entry"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
              </Link>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Zap className="h-6 w-6 text-cd-teal" strokeWidth={2} />
                  <span className="text-sm font-semibold text-cd-teal">ENERGY MANAGEMENT</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Energy Management Data Collection</h1>
                <p className="text-cd-muted">
                  Data for GRI 302, CSRD E1-5, and SDG 7 (Affordable and Clean Energy)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-teal text-white rounded-lg text-sm font-medium hover:bg-opacity-90 flex items-center gap-2">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="Energy Management"
            completionPercentage={totalProgress}
            totalFields={Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
            completedFields={Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter(f => f.completed).length, 0)}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Framework Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">GRI 302: Energy</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD E1-5: Energy</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">SDG 7: Clean Energy</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar - Category Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cd-muted">
                Categories
              </h3>
              {categories.map((cat) => {
                const progress = calculateCategoryProgress(cat.id);
                const isActive = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      isActive
                        ? 'border-cd-teal bg-cd-teal text-white shadow-cd-md'
                        : 'border-cd-border bg-white text-cd-text hover:border-cd-teal/30 hover:shadow-cd-sm'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-cd-teal'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>
                      {cat.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>
                      {cat.fields} fields
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                      <div
                        className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-cd-teal'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
              {/* Category Header */}
              <div className="mb-6 border-b border-cd-border pb-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-3xl">{currentCategoryData.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-cd-text">{currentCategoryData.name}</h2>
                    <p className="text-sm text-cd-muted">{currentCategoryData.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-cd-muted">
                  <AlertCircle className="h-4 w-4" strokeWidth={2} />
                  <span>Enter your organization's energy data for the reporting period</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {Object.entries(formData[currentCategory]).map(([fieldKey, field]) => (
                  <div key={fieldKey} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-2">
                      {field.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-cd-mint" strokeWidth={2} />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-300" strokeWidth={2} />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-cd-text">
                        {field.name}
                      </label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {field.frameworks.map(fw => (
                          <span key={fw} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {fw}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {field.unit === 'text' ? (
                          <textarea
                            value={field.value}
                            onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                            className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
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
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-cd-teal focus:outline-none focus:ring-2 focus:ring-cd-teal/20"
                              placeholder={`Enter amount in ${field.unit}`}
                            />
                            <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                              {field.unit}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Category-Specific Guidance */}
              {currentCategory === 'totalEnergy' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info className="h-4 w-4" strokeWidth={2} />
                    Total Energy Consumption Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 302-1:</strong> Report total fuel consumption from non-renewable and renewable sources</li>
                    <li>• <strong>CSRD E1-5:</strong> Total energy consumption in MWh (electricity, heating, cooling, steam)</li>
                    <li>• <strong>SDG 7:</strong> Tracking progress towards affordable and clean energy access</li>
                    <li>• Include energy consumed from all sources: grid electricity, on-site generation, fuels, etc.</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'renewableEnergy' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info className="h-4 w-4" strokeWidth={2} />
                    Renewable Energy Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>SDG 7.2:</strong> Increase share of renewable energy in the global energy mix</li>
                    <li>• Include solar PV, wind, hydroelectric, geothermal, and biomass energy</li>
                    <li>• Distinguish between self-generated and purchased renewable electricity</li>
                    <li>• Calculate renewable percentage = (Renewable kWh / Total kWh) × 100</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'energyEfficiency' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info className="h-4 w-4" strokeWidth={2} />
                    Energy Efficiency Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 302-4:</strong> Reductions in energy consumption achieved as a direct result of initiatives</li>
                    <li>• <strong>SDG 7.3:</strong> Double the global rate of improvement in energy efficiency</li>
                    <li>• Examples: LED lighting, HVAC upgrades, insulation, process optimization</li>
                    <li>• Report energy saved in kWh and cost savings where available</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
                <button
                  className="flex-1 rounded-lg bg-cd-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-cd-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={loading || saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved to Database' : 'Save Progress'}
                </button>
                <button
                  className="flex-1 rounded-lg border border-cd-border bg-white px-6 py-3 font-semibold text-cd-teal transition-colors hover:bg-cd-surface disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default EnergyManagementCollection;
