import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle, 
  Circle, 
  Users, 
  Shield, 
  TrendingUp, 
  Info, 
  Award, 
  Building2, 
  Scale 
} from 'lucide-react';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

// --- HOOK ---
const useBoardCompositionData = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState('structure');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [formData, setFormData] = useState({
    structure: {
      'total-directors': { name: 'Total Number of Board Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'independent-directors': { name: 'Independent Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
    },
    gender: {
      'female-directors': { name: 'Female Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'gender-diversity-policy': { name: 'Gender Diversity Policy', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    expertise: {
      'climate-experts': { name: 'Directors with Climate/ESG Expertise', value: '', unit: 'number', completed: false, frameworks: ['TCFD', 'CSRD G1-1'] },
      'skills-matrix': { name: 'Board Skills Matrix Published', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    activities: {
      'meetings-held': { name: 'Board Meetings Held in Reporting Period', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'esg-committee': { name: 'ESG/Sustainability Committee Established', value: '', unit: 'text', completed: false, frameworks: ['TCFD', 'CSRD G1-1'] },
    },
  });

  const handleInputChange = useCallback((category, fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category], [fieldKey]: { ...prev[category][fieldKey], value, completed: value.trim() !== '' } }
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

  const analytics = useMemo(() => {
    const total = parseFloat(formData.structure['total-directors']?.value) || 0;
    const independent = parseFloat(formData.structure['independent-directors']?.value) || 0;
    const female = parseFloat(formData.gender['female-directors']?.value) || 0;
    const climate = parseFloat(formData.expertise['climate-experts']?.value) || 0;
    
    return {
      hasData: total > 0,
      independenceRatio: total > 0 ? ((independent / total) * 100).toFixed(1) : '0.0',
      femaleRatio: total > 0 ? ((female / total) * 100).toFixed(1) : '0.0',
      climateExpertiseRatio: total > 0 ? ((climate / total) * 100).toFixed(1) : '0.0',
    };
  }, [formData]);

  return {
    navigate, currentCategory, setCurrentCategory, showAnalytics, setShowAnalytics,
    formData, handleInputChange, calculateCategoryProgress, totalProgress,
    totalFieldsCount, completedFieldsCount, analytics
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
              <Building2 className="h-6 w-6 text-greenly-primary" />
              <span className="text-sm font-semibold text-greenly-primary uppercase tracking-wider">Board Composition</span>
            </div>
            <h1 className="text-3xl font-bold text-greenly-charcoal">Data Collection</h1>
            <p className="text-greenly-slate">
              GRI 2-9, CSRD G1-1, and TCFD Governance disclosures.
            </p>
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
      <FrameworkProgressBar
        framework="Board Composition"
        completionPercentage={progress}
        totalFields={totalFields}
        completedFields={completedFields}
        showDetails
      />
    </div>
  </div>
);

const CategorySidebar = ({ categories, current, setCategory, getProgress }) => (
  <div className="sticky top-6 space-y-2">
    <h3 className="px-4 text-sm font-semibold uppercase tracking-wider text-greenly-slate">
      Categories
    </h3>
    {categories.map(cat => {
      const progress = getProgress(cat.id);
      const isActive = current === cat.id;
      return (
        <button key={cat.id} onClick={() => setCategory(cat.id)}
          className={`w-full text-left p-4 rounded-lg transition-all flex items-center gap-4 ${
            isActive ? 'bg-greenly-primary text-white shadow-lg' : 'bg-white hover:bg-green-50'
          }`}
        >
          <div className={`p-2 rounded-md ${isActive ? 'bg-white/20' : 'bg-green-100'}`}>
            <Users className={`h-5 w-5 ${isActive ? 'text-white' : 'text-greenly-primary'}`} />
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

const DataCollectionForm = ({ category, data, onInputChange }) => (
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
                        {field.unit === 'number' ? (
                            <div className="flex">
                                <input type="number" value={field.value} onChange={e => onInputChange(category.id, key, e.target.value)}
                                    className="flex-grow w-full rounded-l-lg border-gray-300 shadow-sm focus:border-greenly-primary focus:ring-greenly-primary" placeholder="Enter number" />
                                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">#</span>
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

const AnalyticsPanel = ({ analytics, show, onToggle }) => (
    <>
        <div className="mt-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-3 text-sm text-green-800">
                <Info className="h-5 w-5" />
                <span>Enter data in 'Board Structure' and 'Gender Diversity' to unlock analytics.</span>
            </div>
            <button onClick={onToggle} disabled={!analytics.hasData} className="flex items-center gap-2 rounded-xl bg-greenly-primary px-4 py-2 text-sm font-semibold text-white hover:bg-greenly-primary/90 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <TrendingUp className="h-5 w-5" /> {show ? 'Hide Analytics' : 'Show Analytics'}
            </button>
        </div>
        {show && analytics.hasData && (
            <div className="mt-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsMetric label="Independence Ratio" value={`${analytics.independenceRatio}%`} icon={Shield} target="≥50%" />
                <AnalyticsMetric label="Female Representation" value={`${analytics.femaleRatio}%`} icon={Scale} target="≥40%" />
                <AnalyticsMetric label="Climate Expertise" value={`${analytics.climateExpertiseRatio}%`} icon={Award} target="Growing" />
            </div>
        )}
    </>
);

const AnalyticsMetric = ({ label, value, icon: Icon, target }) => (
    <div className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-greenly-primary">
            <Icon className="h-6 w-6" />
        </div>
        <p className="text-3xl font-bold text-greenly-charcoal">{value}</p>
        <p className="text-sm font-medium text-greenly-slate">{label}</p>
        <p className="text-xs text-greenly-slate mt-1">Target: {target}</p>
    </div>
);

// --- MAIN COMPONENT ---
export default function BoardCompositionCollection() {
  const {
    navigate, currentCategory, setCurrentCategory, showAnalytics, setShowAnalytics,
    formData, handleInputChange, calculateCategoryProgress, totalProgress,
    totalFieldsCount, completedFieldsCount, analytics
  } = useBoardCompositionData();

  const categories = [
    { id: 'structure', name: 'Board Structure', description: 'Size and independence', fields: Object.keys(formData.structure).length },
    { id: 'gender', name: 'Gender Diversity', description: 'Gender composition and policies', fields: Object.keys(formData.gender).length },
    { id: 'expertise', name: 'Skills & Expertise', description: 'Board competencies and skills', fields: Object.keys(formData.expertise).length },
    { id: 'activities', name: 'Board Activities', description: 'Meetings and oversight', fields: Object.keys(formData.activities).length },
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
            <AnalyticsPanel analytics={analytics} show={showAnalytics} onToggle={() => setShowAnalytics(prev => !prev)} />
          </div>
        </div>
      </main>
    </div>
  );
}
