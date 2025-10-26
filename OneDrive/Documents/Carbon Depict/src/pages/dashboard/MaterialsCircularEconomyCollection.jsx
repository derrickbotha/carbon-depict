// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Circle,
  Recycle,
  Factory,
  Target,
  TrendingUp,
  Info,
  AlertCircle,
  Award,
  Lightbulb,
  Package,
  Droplet,
  Leaf,
  Zap
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const MaterialsCircularEconomyCollection = () => {
  const [currentCategory, setCurrentCategory] = useState('materials');
  const [showInsights, setShowInsights] = useState(false);

  const [formData, setFormData] = useState({
    materials: {
      'total-material-input': { name: 'Total Material Input (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 301-1', 'CSRD E5-5'] },
      'renewable-material-input': { name: 'Renewable Material Input (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 301-1', 'CSRD E5-5'] },
      'recycled-material-input': { name: 'Recycled Material Input (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 301-2', 'CSRD E5-5'] },
      'secondary-material-percentage': { name: 'Secondary Material Share (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 301-2', 'CSRD E5-5'] },
      'critical-materials': { name: 'Critical Raw Materials Used', value: '', unit: 'text', completed: false, frameworks: ['CSRD E5-5'] }
    },
    circularity: {
      'product-circular-design': { name: 'Products with Circular Design Features (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD E5-6'] },
      'products-reused': { name: 'Products Reused or Refurbished (units)', value: '', unit: 'number', completed: false, frameworks: ['CSRD E5-6'] },
      'closed-loop-initiatives': { name: 'Closed-loop Initiatives Implemented', value: '', unit: 'text', completed: false, frameworks: ['GRI 306-2', 'CSRD E5-6'] },
      'product-takeback-rate': { name: 'Product Take-back Rate (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD E5-6'] }
    },
    waste: {
      'total-waste-generated': { name: 'Total Waste Generated (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 306-3', 'CSRD E5-6'] },
      'waste-reused': { name: 'Waste Reused (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 306-4'] },
      'waste-recycled': { name: 'Waste Recycled (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 306-4'] },
      'waste-landfilled': { name: 'Waste Disposed to Landfill (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 306-5', 'CSRD E5-6'] },
      'hazardous-waste': { name: 'Hazardous Waste Generated (tonnes)', value: '', unit: 'tonnes', completed: false, frameworks: ['GRI 306-3', 'CSRD E5-6'] }
    },
    circularMetrics: {
      'material-circularity-indicator': { name: 'Material Circularity Indicator (MCI)', value: '', unit: 'score', completed: false, frameworks: ['CSRD E5-6'] },
      'resource-productivity': { name: 'Resource Productivity (USD revenue per tonne)', value: '', unit: 'USD/tonne', completed: false, frameworks: ['CSRD E5-4'] },
      'circular-revenue-share': { name: 'Revenue from Circular Products (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD E5-6'] },
      'supply-chain-engagement': { name: 'Supplier Engagement for Circularity', value: '', unit: 'text', completed: false, frameworks: ['CSRD E5-5'] }
    },
    innovation: {
      'eco-design-investment': { name: 'Investments in Eco-design (USD)', value: '', unit: 'USD', completed: false, frameworks: ['CSRD E5-6'] },
      'circular-partnerships': { name: 'Circular Economy Partnerships', value: '', unit: 'text', completed: false, frameworks: ['CSRD E5-5'] },
      'pilot-projects': { name: 'Circular Economy Pilot Projects', value: '', unit: 'number', completed: false, frameworks: ['CSRD E5-6'] },
      'customer-engagement': { name: 'Customer Engagement on Circularity', value: '', unit: 'text', completed: false, frameworks: ['CSRD E5-6'] }
    },
    climateLinks: {
      'life-cycle-emissions': { name: 'Life Cycle Emissions per Product (kg CO2e)', value: '', unit: 'kg CO2e', completed: false, frameworks: ['CSRD E1-6'] },
      'energy-recovery': { name: 'Energy Recovered from Waste (MWh)', value: '', unit: 'MWh', completed: false, frameworks: ['CSRD E5-6'] },
      'water-use-reduction': { name: 'Water Use Reduction through Circularity (m³)', value: '', unit: 'm3', completed: false, frameworks: ['CSRD E5-6', 'CSRD E3-4'] },
      'carbon-savings': { name: 'Estimated Carbon Savings from Circular Strategies (tCO2e)', value: '', unit: 'tCO2e', completed: false, frameworks: ['CSRD E1-6'] }
    }
  });

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [fieldKey]: {
          ...prev[category][fieldKey],
          value,
          completed: value.trim() !== ''
        }
      }
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

  const categories = [
    { id: 'materials', name: 'Material Inputs', description: 'Primary, renewable, and recycled material use', icon: '📦', fields: Object.keys(formData.materials).length },
    { id: 'circularity', name: 'Circular Product Design', description: 'Product reuse, take-back, and circular models', icon: '♻️', fields: Object.keys(formData.circularity).length },
    { id: 'waste', name: 'Waste & Resource Recovery', description: 'Waste generation and diversion metrics', icon: '🗑️', fields: Object.keys(formData.waste).length },
    { id: 'circularMetrics', name: 'Circular Economy KPIs', description: 'Material circularity, resource productivity, revenue', icon: '📊', fields: Object.keys(formData.circularMetrics).length },
    { id: 'innovation', name: 'Innovation & Partnerships', description: 'Investments and collaborations for circularity', icon: '💡', fields: Object.keys(formData.innovation).length },
    { id: 'climateLinks', name: 'Climate & Resource Linkages', description: 'Carbon, water, and energy co-benefits', icon: '🌱', fields: Object.keys(formData.climateLinks).length }
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  const insightMetrics = useMemo(() => {
    const totalMaterial = parseFloat(formData.materials['total-material-input'].value) || 0;
    const recycledMaterial = parseFloat(formData.materials['recycled-material-input'].value) || 0;
    const secondaryShare = parseFloat(formData.materials['secondary-material-percentage'].value) || 0;
    const totalWaste = parseFloat(formData.waste['total-waste-generated'].value) || 0;
    const wasteRecycled = parseFloat(formData.waste['waste-recycled'].value) || 0;
    const circularRevenue = parseFloat(formData.circularMetrics['circular-revenue-share'].value) || 0;

    const hasData = totalMaterial > 0 || recycledMaterial > 0 || secondaryShare > 0 || totalWaste > 0 || circularRevenue > 0;

    return {
      hasData,
      recycledRatio: totalMaterial > 0 ? ((recycledMaterial / totalMaterial) * 100).toFixed(1) : '0.0',
      secondaryShare: secondaryShare.toFixed(1),
      wasteDiversion: totalWaste > 0 ? ((wasteRecycled / totalWaste) * 100).toFixed(1) : '0.0',
      circularRevenue: circularRevenue.toFixed(1)
    };
  }, [formData]);

  const numericUnits = ['tonnes', '%', 'number', 'USD', 'USD/tonne', 'score', 'kg CO2e', 'MWh', 'm3', 'tCO2e'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/dashboard/esg/data-entry" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
              </Link>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Recycle className="h-6 w-6 text-emerald-600" strokeWidth={2} />
                  <span className="text-sm font-semibold text-emerald-600">MATERIALS & CIRCULAR ECONOMY</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Materials & Circular Economy Data Collection</h1>
                <p className="text-cd-muted">GRI 301, 306 and CSRD E5 disclosures on resource use and circular strategies.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          <FrameworkProgressBar
            framework="Materials & Circular Economy"
            completionPercentage={totalProgress}
            totalFields={Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
            completedFields={Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter(f => f.completed).length, 0)}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">GRI 301: Materials</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">GRI 306: Waste</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">CSRD E5: Resource Use & Circular Economy</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">CSRD E1: Climate Change Linkages</span>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">CSRD E3: Water & Marine Resources</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-cd-muted">Categories</h3>
              {categories.map((cat) => {
                const progress = calculateCategoryProgress(cat.id);
                const isActive = currentCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentCategory(cat.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${isActive ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg' : 'border-cd-border bg-white text-cd-text hover:border-emerald-300 hover:shadow-md'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-emerald-600'}`}>{progress}%</span>
                    </div>
                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>{cat.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>{cat.fields} fields</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                      <div className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-emerald-600'}`} style={{ width: `${progress}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-lg border border-cd-border bg-white p-6 shadow-cd-sm">
              <div className="mb-6 border-b border-cd-border pb-4">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-3xl">{currentCategoryData?.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-cd-text">{currentCategoryData?.name}</h2>
                    <p className="text-sm text-cd-muted">{currentCategoryData?.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-cd-muted">
                  <AlertCircle className="h-4 w-4" strokeWidth={2} />
                  <span>Provide material flows, circular design, and waste recovery metrics.</span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(formData[currentCategory] || {}).map(([fieldKey, field]) => {
                  const isNumeric = numericUnits.includes(field.unit);
                  const step = field.unit === '%' ? '0.1' : field.unit === 'score' ? '0.01' : field.unit === 'USD' || field.unit === 'USD/tonne' ? '0.01' : '1';
                  return (
                    <div key={fieldKey} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-2">
                        {field.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={2} />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="mb-1 block text-sm font-medium text-cd-text">{field.name}</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {field.frameworks.map((fw) => (
                            <span key={fw} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{fw}</span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {isNumeric ? (
                            <>
                              <input
                                type="number"
                                step={step}
                                min="0"
                                value={field.value}
                                onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                                className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                                placeholder={`Enter ${field.unit}`}
                              />
                              <div className="flex w-28 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">{field.unit}</div>
                            </>
                          ) : (
                            <textarea
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/100 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                              placeholder="Enter description or details"
                              rows={3}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-3 text-sm text-emerald-900">
                  <Lightbulb className="h-4 w-4" strokeWidth={2} />
                  <span>Visualize circular material performance and waste diversion progress.</span>
                </div>
                <button
                  onClick={() => setShowInsights((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  {showInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
              </div>

              {showInsights && (
                <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
                  <div className="mb-4 flex items-center gap-2 text-emerald-900">
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm font-semibold">Circular Economy Analytics</span>
                  </div>
                  {insightMetrics.hasData ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Recycled Material Share</span>
                          <Recycle className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.recycledRatio}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Target 30%+ to align with mature circular strategies.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Secondary Material Share</span>
                          <Package className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.secondaryShare}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Increase secondary materials to buffer supply risk.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Waste Diversion Rate</span>
                          <Factory className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.wasteDiversion}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Aim for &gt;90% landfill diversion at flagship sites.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Circular Revenue Share</span>
                          <Target className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.circularRevenue}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Surface circular business models to investors.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-white p-6 text-sm text-cd-muted">
                      <Info className="h-4 w-4 text-emerald-500 inline mr-2" strokeWidth={2} />
                      Provide material, waste, and revenue metrics to unlock analytics.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsCircularEconomyCollection;
