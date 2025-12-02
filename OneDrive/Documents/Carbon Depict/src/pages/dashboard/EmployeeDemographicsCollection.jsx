import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Users,
  TrendingUp,
  Info,
  AlertCircle,
  Award,
  X,
  Building,
  Briefcase,
  Users2,
  Globe,
  Repeat,
  HeartHandshake,
  Landmark
} from 'lucide-react';

// --- DATA & HOOK ---

const useEmployeeDemographics = () => {
  const [currentCategory, setCurrentCategory] = useState('workforce');
  const [showCalculations, setShowCalculations] = useState(false);

  const [formData, setFormData] = useState({
    workforce: {
      'total-employees': { name: 'Total Number of Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'permanent-employees': { name: 'Permanent Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'temporary-employees': { name: 'Temporary Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'full-time-employees': { name: 'Full-time Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'part-time-employees': { name: 'Part-time Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'contractors': { name: 'Contractors and Consultants', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-8', 'CSRD S1-6'] },
      'non-guaranteed-hours': { name: 'Non-guaranteed Hours Workers', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
    },
    gender: {
      'male-employees': { name: 'Male Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'female-employees': { name: 'Female Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'non-binary-employees': { name: 'Non-binary/Other Gender Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'male-management': { name: 'Male in Management Positions', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'female-management': { name: 'Female in Management Positions', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'male-senior-exec': { name: 'Male in Senior Executive Positions', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'female-senior-exec': { name: 'Female in Senior Executive Positions', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'board-male': { name: 'Male Board Members', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'board-female': { name: 'Female Board Members', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    },
    age: {
      'under-30': { name: 'Employees Under 30 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      '30-50-years': { name: 'Employees 30-50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'over-50': { name: 'Employees Over 50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-under-30': { name: 'Management Under 30 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-30-50': { name: 'Management 30-50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-over-50': { name: 'Management Over 50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    },
    geographic: {
      'employees-by-region': { name: 'Employees by Geographic Region', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'employees-by-country': { name: 'Employees by Country (Top 5)', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'headquarters-location': { name: 'Number of Employees at Headquarters', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7'] },
      'remote-workers': { name: 'Remote/Hybrid Workers', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-6'] },
    },
    turnover: {
      'new-hires-total': { name: 'Total New Hires', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'new-hires-male': { name: 'New Hires - Male', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'new-hires-female': { name: 'New Hires - Female', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'new-hires-under-30': { name: 'New Hires - Under 30', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'new-hires-30-50': { name: 'New Hires - 30-50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'new-hires-over-50': { name: 'New Hires - Over 50', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'turnover-total': { name: 'Total Employee Turnover', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'turnover-voluntary': { name: 'Voluntary Turnover', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'turnover-involuntary': { name: 'Involuntary Turnover', value: '', unit: 'number', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
      'turnover-rate': { name: 'Turnover Rate (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 401-1', 'CSRD S1-6'] },
    },
    diversity: {
      'ethnic-minorities': { name: 'Employees from Ethnic Minorities', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'persons-with-disabilities': { name: 'Employees with Disabilities', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'indigenous-peoples': { name: 'Employees from Indigenous Peoples', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1'] },
      'veterans': { name: 'Veteran Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1'] },
      'diversity-policy': { name: 'Diversity & Inclusion Policy', value: '', unit: 'text', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'diversity-targets': { name: 'Diversity Targets Set', value: '', unit: 'text', completed: false, frameworks: ['CSRD S1-9'] },
    },
    compensation: {
      'pay-gap-gender': { name: 'Gender Pay Gap (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-2', 'CSRD S1-13'] },
      'pay-ratio-ceo': { name: 'CEO to Median Employee Pay Ratio', value: '', unit: 'ratio', completed: false, frameworks: ['GRI 2-21', 'CSRD S1-13'] },
      'living-wage-compliance': { name: 'Living Wage Compliance (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-13'] },
      'benefits-coverage': { name: 'Employees Receiving Benefits (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 401-2', 'CSRD S1-11'] },
      'pension-coverage': { name: 'Employees with Pension Coverage (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 401-2', 'CSRD S1-11'] },
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

  const categories = [
    { id: 'workforce', name: 'Workforce', icon: Briefcase, fields: 7 },
    { id: 'gender', name: 'Gender', icon: Users2, fields: 9 },
    { id: 'age', name: 'Age', icon: TrendingUp, fields: 6 },
    { id: 'geographic', name: 'Geography', icon: Globe, fields: 4 },
    { id: 'turnover', name: 'Turnover', icon: Repeat, fields: 10 },
    { id: 'diversity', name: 'D&I', icon: HeartHandshake, fields: 6 },
    { id: 'compensation', name: 'Compensation', icon: Landmark, fields: 5 },
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  const calculationResults = useMemo(() => {
    const workforce = formData.workforce;
    const turnover = formData.turnover;
    const compensation = formData.compensation;
    const gender = formData.gender;

    const totalEmp = parseFloat(workforce['total-employees'].value) || 0;
    const contractors = parseFloat(workforce['contractors'].value) || 0;
    const totalWorkforce = totalEmp + contractors;

    const departures = parseFloat(turnover['turnover-total'].value) || 0;
    const turnoverRate = totalEmp > 0 ? ((departures / totalEmp) * 100).toFixed(1) : 0;

    const male = parseFloat(gender['male-employees'].value) || 0;
    const female = parseFloat(gender['female-employees'].value) || 0;
    const nonBinary = parseFloat(gender['non-binary-employees'].value) || 0;
    const totalGender = male + female + nonBinary;

    return {
      workerCategorization: {
        direct: totalEmp,
        indirect: contractors,
        total: totalWorkforce,
        employeePercentage: totalWorkforce > 0 ? ((totalEmp / totalWorkforce) * 100).toFixed(1) : 0,
      },
      turnover: {
        departures,
        avgEmployees: totalEmp,
        rate: turnoverRate,
      },
      payGap: {
        gap: compensation['pay-gap-gender'].value,
      },
      ceoRatio: {
        ratio: compensation['pay-ratio-ceo'].value,
      },
      genderDistribution: {
        male,
        female,
        nonBinary,
        total: totalGender,
        malePercent: totalGender > 0 ? ((male / totalGender) * 100).toFixed(1) : 0,
        femalePercent: totalGender > 0 ? ((female / totalGender) * 100).toFixed(1) : 0,
        nonBinaryPercent: totalGender > 0 ? ((nonBinary / totalGender) * 100).toFixed(1) : 0,
      },
    };
  }, [formData]);

  return {
    currentCategory,
    setCurrentCategory,
    showCalculations,
    setShowCalculations,
    formData,
    handleInputChange,
    calculateCategoryProgress,
    totalProgress,
    categories,
    currentCategoryData,
    calculationResults,
  };
};

// --- SUB-COMPONENTS ---

const Header = ({ totalProgress }) => (
  <div className="border-b border-greenly-light-gray bg-white">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/esg/data-entry" className="btn-icon">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Users className="h-5 w-5 text-greenly-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-greenly-primary">Employee Demographics</span>
            </div>
            <h1 className="text-2xl font-bold text-greenly-charcoal">Demographics Data Collection</h1>
            <p className="text-sm text-greenly-slate">Data for GRI 2-7, 405-1, 401-1 and CSRD S1 (Own Workforce)</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary"><Download className="h-4 w-4" /> Export</button>
          <button className="btn-primary"><Save className="h-4 w-4" /> Save</button>
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
    <span className="status-badge-blue">GRI 2-7: Employees</span>
    <span className="status-badge-blue">GRI 405-1: Diversity</span>
    <span className="status-badge-blue">GRI 401-1: New Hires</span>
    <span className="status-badge-green">CSRD S1-6: Own Workforce</span>
    <span className="status-badge-green">CSRD S1-9: Diversity</span>
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
          <p className="text-sm text-greenly-slate">Enter your organization's workforce data for the reporting period.</p>
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
                  placeholder="Enter description or details"
                  rows={3}
                />
              ) : (
                <>
                  <input
                    type={field.unit === 'number' ? 'number' : 'text'}
                    step={field.unit === '%' ? '0.01' : '1'}
                    min="0"
                    value={field.value}
                    onChange={(e) => handleInputChange(category.id, fieldKey, e.target.value)}
                    className="input-base"
                    placeholder={`Enter ${field.unit === 'ratio' ? 'ratio (e.g., 100:1)' : field.unit}`}
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
    workforce: [
      "GRI 2-7: Report total employees by employment contract (permanent/temporary) and type (full-time/part-time).",
      "CSRD S1-6: Total number of employees at the end of the reporting period.",
      "Include all direct employees; contractors reported separately under GRI 2-8.",
    ],
    gender: [
      "GRI 405-1: Report diversity of governance bodies and employees by gender and age group.",
      "CSRD S1-9: Gender distribution across workforce, including management and governance.",
      "Break down by employee category: board, senior executives, management, and all employees.",
    ],
    turnover: [
        "GRI 401-1: Total new hires and employee turnover by age group, gender, and region.",
        "CSRD S1-6: Number and rate of employee turnover in the reporting period.",
        "Turnover rate = (Number of departures / Average number of employees) × 100.",
    ],
    compensation: [
        "GRI 405-2: Ratio of basic salary and remuneration of women to men.",
        "CSRD S1-13: Gender pay gap (unadjusted and adjusted).",
        "CEO pay ratio = Total CEO compensation / Median employee compensation.",
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

const CalculationSummary = ({ results, onClose }) => (
  <div className="card mt-6 p-6 border-2 border-greenly-primary bg-greenly-primary/5">
    <div className="mb-4 flex items-center justify-between border-b border-greenly-primary/20 pb-3">
      <div className="flex items-center gap-2">
        <Award className="h-6 w-6 text-greenly-primary" />
        <h3 className="text-lg font-bold text-greenly-charcoal">Automated Calculations Summary</h3>
      </div>
      <button onClick={onClose} className="btn-icon"><X className="h-5 w-5" /></button>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <CalcCard title="Worker Categorization" icon={Users}>
        <CalcRow label="Direct Employees" value={results.workerCategorization.direct} />
        <CalcRow label="Contractors" value={results.workerCategorization.indirect} />
        <CalcRow label="Total Workforce" value={results.workerCategorization.total} isTotal />
        <div className="mt-2 text-xs text-greenly-slate bg-greenly-off-white p-2 rounded">
          Employee % = {results.workerCategorization.employeePercentage}% of total workforce
        </div>
      </CalcCard>
      <CalcCard title="Turnover Rate" icon={Repeat}>
        <CalcRow label="Departures" value={results.turnover.departures} />
        <CalcRow label="Avg Employees" value={results.turnover.avgEmployees} />
        <CalcRow label="Turnover Rate" value={`${results.turnover.rate}%`} isTotal />
      </CalcCard>
      <CalcCard title="Gender Pay Gap" icon={Users2}>
        <CalcRow label="Pay Gap" value={`${results.payGap.gap || 0}%`} isTotal />
        <div className="mt-2 text-xs text-greenly-slate">
          {parseFloat(results.payGap.gap) < 5 ? '✅ Excellent' : '⚠️ Moderate gap'}
        </div>
      </CalcCard>
      <CalcCard title="CEO Pay Ratio" icon={Landmark}>
        <CalcRow label="Ratio" value={results.ceoRatio.ratio || 'N/A'} isTotal />
      </CalcCard>
      <CalcCard title="Gender Distribution" icon={HeartHandshake}>
        <CalcRow label="Male" value={`${results.genderDistribution.male} (${results.genderDistribution.malePercent}%)`} />
        <CalcRow label="Female" value={`${results.genderDistribution.female} (${results.genderDistribution.femalePercent}%)`} />
        {results.genderDistribution.nonBinary > 0 && <CalcRow label="Non-binary" value={`${results.genderDistribution.nonBinary} (${results.genderDistribution.nonBinaryPercent}%)`} />}
      </CalcCard>
    </div>
  </div>
);

const CalcCard = ({ title, icon: Icon, children }) => (
  <div className="rounded-lg bg-white p-4 shadow-sm border border-greenly-light-gray">
    <h4 className="mb-3 flex items-center gap-2 font-semibold text-greenly-charcoal">
      <Icon className="h-4 w-4 text-greenly-primary" /> {title}
    </h4>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const CalcRow = ({ label, value, isTotal = false }) => (
  <div className={`flex justify-between ${isTotal ? 'border-t border-greenly-light-gray pt-2' : ''}`}>
    <span className={isTotal ? 'font-semibold' : 'text-greenly-slate'}>{label}:</span>
    <span className={`font-semibold ${isTotal ? 'text-lg text-greenly-primary' : ''}`}>{value}</span>
  </div>
);

// --- MAIN COMPONENT ---
export default function EmployeeDemographicsCollection() {
  const {
    currentCategory,
    setCurrentCategory,
    showCalculations,
    setShowCalculations,
    formData,
    handleInputChange,
    calculateCategoryProgress,
    totalProgress,
    categories,
    currentCategoryData,
    calculationResults,
  } = useEmployeeDemographics();

  return (
    <div className="min-h-screen bg-greenly-off-white">
      <Header totalProgress={totalProgress} />
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
            {showCalculations && (
              <CalculationSummary results={calculationResults} onClose={() => setShowCalculations(false)} />
            )}
            <div className="mt-6 flex gap-4">
              <button className="btn-primary flex-1" onClick={() => alert('Data saved!')}>
                <Save className="h-4 w-4" /> Save Progress
              </button>
              <button className="btn-secondary flex-1" onClick={() => setShowCalculations(p => !p)}>
                <Award className="h-4 w-4" /> {showCalculations ? 'Hide' : 'Show'} Calculations
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
