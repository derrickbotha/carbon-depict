// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Circle,
  Leaf,
  MapPin,
  Info,
  AlertCircle,
  TrendingUp,
  Target,
  Droplet,
  TreeDeciduous,
  Award,
  Globe,
  Lightbulb,
  Factory,
  Wind
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const BiodiversityLandUseCollection = () => {
  const [currentCategory, setCurrentCategory] = useState('sites');
  const [showInsights, setShowInsights] = useState(false);

  const [formData, setFormData] = useState({
    sites: {
      'operating-sites-total': { name: 'Total Operating Sites', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-1', 'CSRD E4-5'] },
      'sites-in-protected-areas': { name: 'Sites in or Adjacent to Protected Areas', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-1', 'CSRD E4-5'] },
      'sensitive-habitats': { name: 'Sites in Sensitive or High Biodiversity Areas', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-1'] },
      'hectares-impacted': { name: 'Hectares of Habitat Affected', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-2', 'CSRD E4-5'] },
      'permits-authorizations': { name: 'Environmental Permits and Authorizations', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-3'] }
    },
    species: {
      'iucn-endangered': { name: 'IUCN Critically Endangered or Endangered Species Impacted', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-4', 'CSRD E4-5'] },
      'national-protected-species': { name: 'Nationally Protected Species Impacted', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-4'] },
      'species-mitigation': { name: 'Species Mitigation or Conservation Actions', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-5'] },
      'habitat-restoration': { name: 'Habitat Restoration Projects Active', value: '', unit: 'number', completed: false, frameworks: ['GRI 304-3', 'CSRD E4-5'] }
    },
    impacts: {
      'land-cleared': { name: 'Land Cleared or Disturbed (hectares)', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-2', 'CSRD E4-5'] },
      'land-restored': { name: 'Land Restored/Rehabilitated (hectares)', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-3', 'CSRD E4-5'] },
      'water-withdrawal-sensitive': { name: 'Water Withdrawal in Sensitive Areas (m³)', value: '', unit: 'm3', completed: false, frameworks: ['CSRD E4-4', 'GRI 303-2'] },
      'pollution-incidents': { name: 'Environmental Incidents Affecting Biodiversity', value: '', unit: 'number', completed: false, frameworks: ['CSRD E4-4'] },
      'noise-light-impacts': { name: 'Noise/Light/Other Ecological Impacts', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-4'] }
    },
    mitigation: {
      'biodiversity-policy': { name: 'Biodiversity Policy and Commitments', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-23', 'CSRD E4-1'] },
      'no-net-loss-target': { name: 'No Net Loss / Net Positive Impact Target', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] },
      'offset-projects': { name: 'Biodiversity Offset Projects', value: '', unit: 'text', completed: false, frameworks: ['GRI 304-3', 'CSRD E4-5'] },
      'stakeholder-engagement': { name: 'Community & Indigenous Engagement on Land Use', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-5', 'GRI 413-1'] }
    },
    performance: {
      'investment-biodiversity': { name: 'Investment in Biodiversity Programs (USD)', value: '', unit: 'USD', completed: false, frameworks: ['CSRD E4-5'] },
      'protected-area-coverage': { name: 'Protected Area Coverage (hectares)', value: '', unit: 'hectares', completed: false, frameworks: ['GRI 304-3', 'CSRD E4-5'] },
      'land-use-intensity': { name: 'Land Use Intensity (hectares per unit output)', value: '', unit: 'hectares/unit', completed: false, frameworks: ['CSRD E4-5'] },
      'offset-effectiveness': { name: 'Biodiversity Offset Effectiveness (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD E4-5'] },
      'monitoring-frequency': { name: 'Monitoring Frequency (per year)', value: '', unit: 'number', completed: false, frameworks: ['CSRD E4-5'] }
    },
    riskOpportunities: {
      'biodiversity-risk-assessment': { name: 'Biodiversity Risk Assessment Completed', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] },
      'transition-risks': { name: 'Nature-related Transition Risks Description', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2', 'TCFD/ISSB S2 linkage'] },
      'physical-risks': { name: 'Nature-related Physical Risks Description', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] },
      'tnfd-alignment': { name: 'TNFD Framework Alignment Status', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] },
      'nature-opportunities': { name: 'Opportunities from Biodiversity Investments', value: '', unit: 'text', completed: false, frameworks: ['CSRD E4-2'] }
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
    { id: 'sites', name: 'Sites & Footprint', description: 'Locations intersecting protected and sensitive areas', icon: '📍', fields: Object.keys(formData.sites).length },
    { id: 'species', name: 'Species & Habitats', description: 'Species impacted and restoration actions', icon: '🦋', fields: Object.keys(formData.species).length },
    { id: 'impacts', name: 'Operational Impacts', description: 'Land disturbance, water use, pollution incidents', icon: '🌿', fields: Object.keys(formData.impacts).length },
    { id: 'mitigation', name: 'Policies & Mitigation', description: 'Policies, targets, offsets, stakeholder engagement', icon: '🛡️', fields: Object.keys(formData.mitigation).length },
    { id: 'performance', name: 'Performance & Investment', description: 'Investments, land use intensity, monitoring', icon: '📈', fields: Object.keys(formData.performance).length },
    { id: 'riskOpportunities', name: 'Risk & Opportunity', description: 'Nature-related risks, opportunities, TNFD alignment', icon: '🌍', fields: Object.keys(formData.riskOpportunities).length }
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  const insightMetrics = useMemo(() => {
    const sitesProtected = parseFloat(formData.sites['sites-in-protected-areas'].value) || 0;
    const sensitiveSites = parseFloat(formData.sites['sensitive-habitats'].value) || 0;
    const hectaresImpacted = parseFloat(formData.sites['hectares-impacted'].value) || 0;
    const hectaresRestored = parseFloat(formData.performance['protected-area-coverage'].value) || 0;
    const investment = parseFloat(formData.performance['investment-biodiversity'].value) || 0;
    const offsetEffectiveness = parseFloat(formData.performance['offset-effectiveness'].value) || 0;

    const hasData = sitesProtected > 0 || sensitiveSites > 0 || hectaresImpacted > 0 || hectaresRestored > 0 || investment > 0 || offsetEffectiveness > 0;

    return {
      hasData,
      impactIntensity: hectaresImpacted > 0 && sitesProtected > 0 ? (hectaresImpacted / sitesProtected).toFixed(2) : '0.00',
      restorationCoverage: hectaresImpacted > 0 ? ((hectaresRestored / hectaresImpacted) * 100).toFixed(1) : '0.0',
      biodiversityInvestment: investment.toLocaleString(undefined, { maximumFractionDigits: 0 }),
      offsetEffectiveness: offsetEffectiveness.toFixed(1),
      protectedAreaRatio: sitesProtected > 0 && sensitiveSites > 0 ? ((sitesProtected / sensitiveSites) * 100).toFixed(1) : '0.0'
    };
  }, [formData]);

  const numericUnits = ['number', 'hectares', 'm3', 'USD', '%', 'hectares/unit'];

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
                  <Leaf className="h-6 w-6 text-green-600" strokeWidth={2} />
                  <span className="text-sm font-semibold text-green-600">BIODIVERSITY & LAND USE</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Biodiversity & Land Use Data Collection</h1>
                <p className="text-cd-muted">GRI 304 and CSRD E4 disclosures on nature, habitat, and ecosystem impacts.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2">
                <Save className="w-4 h-4" strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          <FrameworkProgressBar
            framework="Biodiversity & Land Use"
            completionPercentage={totalProgress}
            totalFields={Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
            completedFields={Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter(f => f.completed).length, 0)}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">GRI 304: Biodiversity</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD E4: Biodiversity & Ecosystems</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">GRI 303: Water (Sensitive Areas)</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">TNFD Alignment (Optional)</span>
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
                    className={`w-full rounded-lg border p-4 text-left transition-all ${isActive ? 'border-green-600 bg-green-600 text-white shadow-lg' : 'border-cd-border bg-white text-cd-text hover:border-green-300 hover:shadow-md'}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-green-600'}`}>{progress}%</span>
                    </div>
                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>{cat.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>{cat.fields} fields</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                      <div className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-green-600'}`} style={{ width: `${progress}%` }} />
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
                  <span>Track biodiversity dependencies, impacts, and mitigation for ESG reporting.</span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(formData[currentCategory] || {}).map(([fieldKey, field]) => {
                  const isNumeric = numericUnits.includes(field.unit);
                  const step = field.unit === '%' ? '0.1' : field.unit === 'USD' ? '0.01' : field.unit === 'hectares/unit' ? '0.01' : '1';
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
                                className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
                                placeholder={`Enter ${field.unit}`}
                              />
                              <div className="flex w-28 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">{field.unit}</div>
                            </>
                          ) : (
                            <textarea
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
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

              <div className="mt-6 flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-4">
                <div className="flex items-center gap-3 text-sm text-green-900">
                  <Lightbulb className="h-4 w-4" strokeWidth={2} />
                  <span>Review land use intensity, restoration coverage, and investment trends.</span>
                </div>
                <button
                  onClick={() => setShowInsights((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  {showInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
              </div>

              {showInsights && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
                  <div className="mb-4 flex items-center gap-2 text-green-900">
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm font-semibold">Biodiversity & Land Use Analytics</span>
                  </div>
                  {insightMetrics.hasData ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Restoration Coverage</span>
                          <TreeDeciduous className="h-4 w-4 text-green-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.restorationCoverage}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Aim for restoration ≥ impact for net positive alignment.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Impact Intensity</span>
                          <Factory className="h-4 w-4 text-green-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.impactIntensity}</div>
                        <p className="mt-1 text-xs text-cd-muted">Lower hectares impacted per site in protected zones.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Biodiversity Investment</span>
                          <Award className="h-4 w-4 text-green-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">${insightMetrics.biodiversityInvestment}</div>
                        <p className="mt-1 text-xs text-cd-muted">Highlight investments in restoration and offsets.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Offset Effectiveness</span>
                          <Target className="h-4 w-4 text-green-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.offsetEffectiveness}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Maintain ≥80% to demonstrate credible offsets.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Protected Area Ratio</span>
                          <Globe className="h-4 w-4 text-green-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{insightMetrics.protectedAreaRatio}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Track share of sensitive sites with formal protection.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-green-200 bg-white p-6 text-sm text-cd-muted">
                      <Info className="h-4 w-4 text-green-500 inline mr-2" strokeWidth={2} />
                      Provide site, species, restoration, and investment data to unlock insights.
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

export default BiodiversityLandUseCollection;
