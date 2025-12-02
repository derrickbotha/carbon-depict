// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, CheckCircle, Circle, Leaf, Info, TrendingUp, Lightbulb } from 'lucide-react';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

// --- HOOK ---
const useBiodiversityData = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('sites');
  const [showInsights, setShowInsights] = useState(false);

  const [formData, setFormData] = useState({
    sites: {
      'operating-sites-total': { name: 'Total Operating Sites', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-1', 'CSRD E4-5'] },
      'sites-in-protected-areas': { name: 'Sites in or Adjacent to Protected Areas', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-1', 'CSRD E4-5'] },
    },
    species: {
      'iucn-endangered': { name: 'IUCN Endangered Species Impacted', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-4', 'CSRD E4-5'] },
    },
    impacts: {
      'land-cleared': { name: 'Land Cleared or Disturbed', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-2', 'CSRD E4-5'] },
    },
    mitigation: {
      'biodiversity-policy': { name: 'Biodiversity Policy and Commitments', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-23', 'CSRD E4-1'] },
    },
    performance: {
        'investment-biodiversity': { name: 'Investment in Biodiversity Programs (USD)', value: '', unit: 'USD', completed: false, frameworks: ['CSRD E4-5'] },
        'protected-area-coverage': { name: 'Restored/Protected Area Coverage', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-3', 'CSRD E4-5'] },
    },
    riskOpportunities: {
      'biodiversity-risk-assessment': { name: 'Biodiversity Risk Assessment Completed', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] },
    }
  });

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [fieldKey]: { ...prev[category][fieldKey], value, completed: value.trim() !== '' }
      }
    }));
  }, []);

  const calculateCategoryProgress = useCallback((category) => {
    const fields = Object.values(formData[category]);
    if (fields.length === 0) return 0;
    const completedFields = fields.filter(f => f.completed).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [formData]);

  const totalProgress = useMemo(() => {
    let totalFields = 0, completedFields = 0;
    Object.values(formData).forEach(category => {
      const fields = Object.values(category);
      totalFields += fields.length;
      completedFields += fields.filter(f => f.completed).length;
    });
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [formData]);
  
  const totalFieldsCount = useMemo(() => Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0), [formData]);
  const completedFieldsCount = useMemo(() => Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter(f => f.completed).length, 0), [formData]);

  const insightMetrics = useMemo(() => {
    const sitesProtected = parseFloat(formData.sites['sites-in-protected-areas']?.value) || 0;
    const hectaresImpacted = parseFloat(formData.impacts['land-cleared']?.value) || 0;
    const hectaresRestored = parseFloat(formData.performance['protected-area-coverage']?.value) || 0;
    const investment = parseFloat(formData.performance['investment-biodiversity']?.value) || 0;
    return {
      hasData: sitesProtected > 0 || hectaresImpacted > 0 || hectaresRestored > 0 || investment > 0,
      restorationCoverage: hectaresImpacted > 0 ? ((hectaresRestored / hectaresImpacted) * 100).toFixed(1) : '0.0',
      investment: investment.toLocaleString(),
    };
  }, [formData]);

  return {
    navigate, currentCategory, setCurrentCategory, showInsights, setShowInsights,
    formData, handleInputChange, calculateCategoryProgress, totalProgress,
    totalFieldsCount, completedFieldsCount, insightMetrics
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ onBack, onSave, onExport, progress, totalFields, completedFields }) => (
  <div className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-greenly-charcoal" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="h-6 w-6 text-greenly-primary" />
              <span className="text-sm font-semibold text-greenly-primary uppercase tracking-wider">Biodiversity & Land Use</span>
            </div>
            <h1 className="text-3xl font-bold text-greenly-charcoal">Data Collection</h1>
            <p className="text-greenly-slate">GRI 304 & CSRD E4 disclosures on nature and ecosystems.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onExport} className="flex items-center gap-2 rounded-xl bg-white border border-gray-300 px-4 py-2.5 text-sm font-semibold text-greenly-charcoal hover:bg-gray-50 shadow-sm">
            <Download className="w-5 h-5" /> Export
          </button>
          <button onClick={onSave} className="flex items-center gap-2 rounded-xl bg-greenly-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-greenly-primary/90 shadow-sm">
            <Save className="w-5 h-5" /> Save Progress
          </button>
        </div>
      </div>
      <FrameworkProgressBar framework="Biodiversity & Land Use" completionPercentage={progress} totalFields={totalFields} completedFields={completedFields} showDetails />
    </div>
  </div>
);

const CategorySidebar = ({ categories, current, setCategory, getProgress }) => (
  <div className="sticky top-6 space-y-2">
    <h3 className="px-4 text-sm font-semibold uppercase tracking-wider text-greenly-slate">Categories</h3>
    {categories.map(cat => {
      const progress = getProgress(cat.id);
      const isActive = current === cat.id;
      return (
        <button key={cat.id} onClick={() => setCategory(cat.id)}
          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${isActive ? 'bg-greenly-primary text-white shadow-lg' : 'bg-white hover:bg-green-50'}`}>
          <div className={`p-2 rounded-md ${isActive ? 'bg-white/20' : 'bg-green-100'}`}>
            <Leaf className={`h-5 w-5 ${isActive ? 'text-white' : 'text-greenly-primary'}`} />
          </div>
          <div>
            <p className={`font-bold ${isActive ? 'text-white' : 'text-greenly-charcoal'}`}>{cat.name}</p>
            <p className={`text-xs ${isActive ? 'text-white/80' : 'text-greenly-slate'}`}>{cat.fields} fields</p>
          </div>
          <div className="ml-auto text-right">
            <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-greenly-primary'}`}>{progress}%</p>
          </div>
        </button>
      );
    })}
  </div>
);

const DataCollectionForm = ({ category, data, onInputChange }) => {
    const numericUnits = ['number', 'hectares', 'm3', 'USD', '%'];
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-greenly-charcoal">{category.name}</h2>
                <p className="text-sm text-greenly-slate mt-1">{category.description}</p>
            </div>
            <div className="space-y-6">
                {Object.entries(data).map(([key, field]) => (
                    <div key={key} className="flex items-start gap-4">
                        <div className="mt-1.5">{field.completed ? <CheckCircle className="h-5 w-5 text-greenly-primary" /> : <Circle className="h-5 w-5 text-gray-300" />}</div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-greenly-charcoal mb-1">{field.name}</label>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {field.frameworks.map(fw => <span key={fw} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">{fw}</span>)}
                            </div>
                            {numericUnits.includes(field.unit) ? (
                                <div className="flex">
                                    <input type="number" step="any" value={field.value} onChange={e => onInputChange(category.id, key, e.target.value)}
                                        className="flex-grow w-full rounded-l-lg border-gray-300 shadow-sm focus:border-greenly-primary focus:ring-greenly-primary" placeholder={`Enter ${field.unit}`} />
                                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">{field.unit}</span>
                                </div>
                            ) : (
                                <textarea value={field.value} onChange={e => onInputChange(category.id, key, e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-greenly-primary focus:ring-greenly-primary" placeholder="Enter description or details..." rows={3} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InsightsPanel = ({ metrics, show, onToggle }) => (
    <>
        <div className="mt-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3 text-sm text-green-800">
                <Lightbulb className="h-5 w-5" />
                <span>Unlock insights by providing data on land use, restoration, and investments.</span>
            </div>
            <button onClick={onToggle} className="flex items-center gap-2 rounded-xl bg-greenly-primary px-4 py-2 text-sm font-semibold text-white hover:bg-greenly-primary/90 shadow-sm">
                <TrendingUp className="h-5 w-5" /> {show ? 'Hide Insights' : 'Show Insights'}
            </button>
        </div>
        {show && (
            <div className="mt-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                {metrics.hasData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm font-medium text-greenly-slate">Restoration Coverage</p>
                            <p className="text-3xl font-bold text-greenly-charcoal">{metrics.restorationCoverage}%</p>
                            <p className="text-xs text-greenly-slate">Aim for restoration ≥ impact for net positive alignment.</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-greenly-slate">Biodiversity Investment</p>
                            <p className="text-3xl font-bold text-greenly-charcoal">${metrics.investment}</p>
                            <p className="text-xs text-greenly-slate">Highlight investments in restoration and offsets.</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-greenly-slate py-8">
                        <Info className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Enter data to generate insights.</p>
                    </div>
                )}
            </div>
        )}
    </>
);

// --- MAIN COMPONENT ---
export default function BiodiversityLandUseCollection() {
  const {
    navigate, currentCategory, setCurrentCategory, showInsights, setShowInsights,
    formData, handleInputChange, calculateCategoryProgress, totalProgress,
    totalFieldsCount, completedFieldsCount, insightMetrics
  } = useBiodiversityData();

  const categories = [
    { id: 'sites', name: 'Sites & Footprint', description: 'Locations intersecting protected and sensitive areas', fields: Object.keys(formData.sites).length },
    { id: 'species', name: 'Species & Habitats', description: 'Species impacted and restoration actions', fields: Object.keys(formData.species).length },
    { id: 'impacts', name: 'Operational Impacts', description: 'Land disturbance, water use, pollution incidents', fields: Object.keys(formData.impacts).length },
    { id: 'mitigation', name: 'Policies & Mitigation', description: 'Policies, targets, offsets, stakeholder engagement', fields: Object.keys(formData.mitigation).length },
    { id: 'performance', name: 'Performance & Investment', description: 'Investments, land use intensity, monitoring', fields: Object.keys(formData.performance).length },
    { id: 'riskOpportunities', name: 'Risk & Opportunity', description: 'Nature-related risks, opportunities, TNFD alignment', fields: Object.keys(formData.riskOpportunities).length }
  ];

  const currentCategoryData = categories.find(cat => cat.id === currentCategory);

  return (
    <div className="min-h-screen bg-greenly-light-gray">
      <Header
        onBack={() => navigate('/dashboard/esg-data-entry-hub')}
        onSave={() => console.log('Saving...')}
        onExport={() => console.log('Exporting...')}
        progress={totalProgress}
        totalFields={totalFieldsCount}
        completedFields={completedFieldsCount}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CategorySidebar categories={categories} current={currentCategory} setCategory={setCurrentCategory} getProgress={calculateCategoryProgress} />
          </div>
          <div className="lg:col-span-3">
            {currentCategoryData && (
              <DataCollectionForm category={currentCategoryData} data={formData[currentCategory]} onInputChange={handleInputChange} />
            )}
            <InsightsPanel metrics={insightMetrics} show={showInsights} onToggle={() => setShowInsights(prev => !prev)} />
          </div>
        </div>
      </main>
    </div>
  );
}
