// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  X
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import useESGMetrics from '../../hooks/useESGMetrics';

const EmployeeDemographicsCollection = () => {
  const navigate = useNavigate();
  const { createMetric, updateMetric, metrics, loading } = useESGMetrics({
    topic: 'Employee Demographics',
    pillar: 'Social'
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [existingMetricId, setExistingMetricId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('workforce');
  const [showCalculations, setShowCalculations] = useState(false);
  
  // Calculation Functions
  const calculateTurnoverRate = useCallback((departures, avgEmployees) => {
    if (!avgEmployees || avgEmployees === 0) return 0;
    return ((departures / avgEmployees) * 100).toFixed(2);
  }, []);

  const calculateGenderPayGap = useCallback((malePay, femalePay) => {
    if (!malePay || malePay === 0) return 0;
    return (((malePay - femalePay) / malePay) * 100).toFixed(2);
  }, []);

  const calculateCEOPayRatio = useCallback((ceoCompensation, medianEmployeeCompensation) => {
    if (!medianEmployeeCompensation || medianEmployeeCompensation === 0) return '0:1';
    const ratio = (ceoCompensation / medianEmployeeCompensation).toFixed(0);
    return `${ratio}:1`;
  }, []);

  const categorizeWorkers = useCallback((totalEmployees, contractors) => {
    return {
      directEmployees: totalEmployees,
      indirectWorkers: contractors,
      total: totalEmployees + contractors,
      employeePercentage: totalEmployees > 0 
        ? ((totalEmployees / (totalEmployees + contractors)) * 100).toFixed(1) 
        : 0
    };
  }, []);

  const [formData, setFormData] = useState({
    // Total Workforce Composition
    workforce: {
      'total-employees': { name: 'Total Number of Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'permanent-employees': { name: 'Permanent Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'temporary-employees': { name: 'Temporary Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'full-time-employees': { name: 'Full-time Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'part-time-employees': { name: 'Part-time Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'contractors': { name: 'Contractors and Consultants', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-8', 'CSRD S1-6'] },
      'non-guaranteed-hours': { name: 'Non-guaranteed Hours Workers', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
    },
    // Gender Diversity
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
    // Age Diversity
    age: {
      'under-30': { name: 'Employees Under 30 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      '30-50-years': { name: 'Employees 30-50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'over-50': { name: 'Employees Over 50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-under-30': { name: 'Management Under 30 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-30-50': { name: 'Management 30-50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'management-over-50': { name: 'Management Over 50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
    },
    // Geographic Distribution
    geographic: {
      'employees-by-region': { name: 'Employees by Geographic Region', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'employees-by-country': { name: 'Employees by Country (Top 5)', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-7', 'CSRD S1-6'] },
      'headquarters-location': { name: 'Number of Employees at Headquarters', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-7'] },
      'remote-workers': { name: 'Remote/Hybrid Workers', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-6'] },
    },
    // New Hires & Turnover
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
    // Diversity & Inclusion
    diversity: {
      'ethnic-minorities': { name: 'Employees from Ethnic Minorities', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'persons-with-disabilities': { name: 'Employees with Disabilities', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'indigenous-peoples': { name: 'Employees from Indigenous Peoples', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1'] },
      'veterans': { name: 'Veteran Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1'] },
      'diversity-policy': { name: 'Diversity & Inclusion Policy', value: '', unit: 'text', completed: false, frameworks: ['GRI 405-1', 'CSRD S1-9'] },
      'diversity-targets': { name: 'Diversity Targets Set', value: '', unit: 'text', completed: false, frameworks: ['CSRD S1-9'] },
    },
    // Pay & Compensation
    compensation: {
      'pay-gap-gender': { name: 'Gender Pay Gap (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 405-2', 'CSRD S1-13'] },
      'pay-ratio-ceo': { name: 'CEO to Median Employee Pay Ratio', value: '', unit: 'ratio', completed: false, frameworks: ['GRI 2-21', 'CSRD S1-13'] },
      'living-wage-compliance': { name: 'Living Wage Compliance (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-13'] },
      'benefits-coverage': { name: 'Employees Receiving Benefits (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 401-2', 'CSRD S1-11'] },
      'pension-coverage': { name: 'Employees with Pension Coverage (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 401-2', 'CSRD S1-11'] },
    },
  });

  // Calculate total progress percentage
  const totalProgress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    
    Object.values(formData).forEach(category => {
      Object.values(category).forEach(field => {
        totalFields++;
        if (field.completed) completedFields++;
      });
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const totalEmployees = parseFloat(formData.workforce['total-employees']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD',
        pillar: 'Social',
        topic: 'Employee Demographics',
        metricName: 'Employee Demographics Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalEmployees,
        unit: 'number',
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
      console.error('Error saving Employee Demographics data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric]);

  const handleSubmit = useCallback(async () => {
    if (totalProgress < 100) {
      alert('Please complete all fields before submitting.');
      return;
    }
    
    setSaveStatus('submitting');
    try {
      const totalEmployees = parseFloat(formData.workforce['total-employees']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD',
        pillar: 'Social',
        topic: 'Employee Demographics',
        metricName: 'Employee Demographics Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalEmployees,
        unit: 'number',
        dataQuality: 'measured',
        status: 'published',
        isDraft: false,
        metadata: {
          formData: formData,
          completionPercentage: 100,
          submittedAt: new Date().toISOString()
        }
      };
      
      if (existingMetricId) {
        await updateMetric(existingMetricId, metricData);
      } else {
        await createMetric(metricData);
      }
      
      setSaveStatus('submitted');
      alert('Employee Demographics data submitted successfully and saved to database!');
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry');
      }, 1500);
    } catch (error) {
      console.error('Error submitting Employee Demographics data:', error);
      setSaveStatus('error');
      alert('Error submitting data. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [totalProgress, formData, existingMetricId, createMetric, updateMetric, navigate]);

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

  const categories = [
    {
      id: 'workforce',
      name: 'Workforce Composition',
      description: 'Total employees by contract type',
      icon: '👥',
      fields: 7,
    },
    {
      id: 'gender',
      name: 'Gender Diversity',
      description: 'Gender breakdown across all levels',
      icon: '⚖️',
      fields: 9,
    },
    {
      id: 'age',
      name: 'Age Diversity',
      description: 'Age distribution of workforce',
      icon: '📊',
      fields: 6,
    },
    {
      id: 'geographic',
      name: 'Geographic Distribution',
      description: 'Employee locations and regions',
      icon: '🌍',
      fields: 4,
    },
    {
      id: 'turnover',
      name: 'New Hires & Turnover',
      description: 'Hiring and retention metrics',
      icon: '🔄',
      fields: 10,
    },
    {
      id: 'diversity',
      name: 'Diversity & Inclusion',
      description: 'Additional diversity metrics',
      icon: '🤝',
      fields: 6,
    },
    {
      id: 'compensation',
      name: 'Pay & Compensation',
      description: 'Pay equity and benefits',
      icon: '💰',
      fields: 5,
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
                <ArrowLeft strokeWidth={2} />
              </Link>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <User strokeWidth={2} />
                  <span className="text-sm font-semibold text-blue-600">EMPLOYEE DEMOGRAPHICS</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Employee Demographics Data Collection</h1>
                <p className="text-cd-muted">
                  Data for GRI 2-7, 405-1, 401-1 and CSRD S1 (Own Workforce)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Save strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="Employee Demographics"
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
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">GRI 2-7: Employees</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">GRI 405-1: Diversity</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">GRI 401-1: New Hires</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-6: Own Workforce</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-9: Diversity</span>
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
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                        : 'border-cd-border bg-white text-cd-text hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-blue-600'}`}>
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
                        className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-blue-600'}`}
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
                  <Alert strokeWidth={2} />
                  <span>Enter your organization's workforce data for the reporting period</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {Object.entries(formData[currentCategory]).map(([fieldKey, field]) => (
                  <div key={fieldKey} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-2">
                      {field.completed ? (
                        <Check strokeWidth={2} />
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
                            className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
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
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                              placeholder={`Enter ${field.unit === 'ratio' ? 'ratio (e.g., 100:1)' : field.unit}`}
                            />
                            <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                              {field.unit === 'ratio' ? 'ratio' : field.unit}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Automated Calculations Section */}
              {currentCategory === 'workforce' && formData.workforce['total-employees'].value && formData.workforce['contractors'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Automated Worker Categorization
                    </div>
                  </div>
                  {(() => {
                    const totalEmp = parseFloat(formData.workforce['total-employees'].value) || 0;
                    const contractors = parseFloat(formData.workforce['contractors'].value) || 0;
                    const result = categorizeWorkers(totalEmp, contractors);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Direct Employees (GRI 2-7):</span>
                          <span className="font-semibold">{result.directEmployees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Indirect Workers (GRI 2-8):</span>
                          <span className="font-semibold">{result.indirectWorkers}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">Total Workforce:</span>
                          <span className="font-semibold">{result.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Employee Percentage:</span>
                          <span className="font-semibold">{result.employeePercentage}%</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {currentCategory === 'turnover' && formData.turnover['turnover-total'].value && formData.workforce['total-employees'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Automated Turnover Rate Calculation
                    </div>
                  </div>
                  {(() => {
                    const departures = parseFloat(formData.turnover['turnover-total'].value) || 0;
                    const avgEmployees = parseFloat(formData.workforce['total-employees'].value) || 0;
                    const rate = calculateTurnoverRate(departures, avgEmployees);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Total Departures:</span>
                          <span className="font-semibold">{departures}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Employees:</span>
                          <span className="font-semibold">{avgEmployees}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">Turnover Rate:</span>
                          <span className="font-semibold text-lg">{rate}%</span>
                        </div>
                        <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> (Departures ÷ Average Employees) × 100 = ({departures} ÷ {avgEmployees}) × 100 = {rate}%
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {currentCategory === 'compensation' && formData.compensation['pay-gap-gender'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Pay Equity Analysis
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-green-800">
                    {formData.compensation['pay-gap-gender'].value && (
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Gender Pay Gap:</span>
                          <span className="font-semibold text-lg">{formData.compensation['pay-gap-gender'].value}%</span>
                        </div>
                        <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> ((Male Median Pay - Female Median Pay) ÷ Male Median Pay) × 100
                        </div>
                      </div>
                    )}
                    {formData.compensation['pay-ratio-ceo'].value && (
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <span>CEO Pay Ratio:</span>
                          <span className="font-semibold text-lg">{formData.compensation['pay-ratio-ceo'].value}</span>
                        </div>
                        <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> CEO Total Compensation ÷ Median Employee Compensation = Ratio:1
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category-Specific Guidance */}
              {currentCategory === 'workforce' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info strokeWidth={2} />
                    Workforce Composition Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 2-7:</strong> Report total employees by employment contract (permanent/temporary) and type (full-time/part-time)</li>
                    <li>• <strong>CSRD S1-6:</strong> Total number of employees at the end of the reporting period</li>
                    <li>• Include all direct employees; contractors reported separately under GRI 2-8</li>
                    <li>• Count employees as of the last day of the reporting period</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'gender' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info strokeWidth={2} />
                    Gender Diversity Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 405-1:</strong> Report diversity of governance bodies and employees by gender and age group</li>
                    <li>• <strong>CSRD S1-9:</strong> Gender distribution across workforce, including management and governance</li>
                    <li>• Break down by employee category: board, senior executives, management, and all employees</li>
                    <li>• Consider offering "non-binary" or "prefer not to say" options</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'turnover' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info strokeWidth={2} />
                    New Hires & Turnover Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 401-1:</strong> Total new hires and employee turnover by age group, gender, and region</li>
                    <li>• <strong>CSRD S1-6:</strong> Number and rate of employee turnover in the reporting period</li>
                    <li>• Turnover rate = (Number of departures / Average number of employees) × 100</li>
                    <li>• Distinguish between voluntary (resignation) and involuntary (dismissal) turnover</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'compensation' && (
                <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <Info strokeWidth={2} />
                    Pay & Compensation Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• <strong>GRI 405-2:</strong> Ratio of basic salary and remuneration of women to men</li>
                    <li>• <strong>CSRD S1-13:</strong> Gender pay gap (unadjusted and adjusted)</li>
                    <li>• Gender pay gap = ((Male median pay - Female median pay) / Male median pay) × 100</li>
                    <li>• CEO pay ratio = Total CEO compensation / Median employee compensation</li>
                  </ul>
                </div>
              )}

              {/* Comprehensive Calculation Summary */}
              {showCalculations && (
                <div className="mt-6 rounded-lg border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between border-b border-green-300 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-green-700" strokeWidth={2} />
                      <h3 className="text-xl font-bold text-green-900">Automated Calculations Summary</h3>
                    </div>
                    <button
                      onClick={() => setShowCalculations(false)}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Worker Categorization */}
                    {formData.workforce['total-employees'].value && formData.workforce['contractors'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">👥 Worker Categorization</h4>
                        {(() => {
                          const totalEmp = parseFloat(formData.workforce['total-employees'].value) || 0;
                          const contractors = parseFloat(formData.workforce['contractors'].value) || 0;
                          const result = categorizeWorkers(totalEmp, contractors);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Direct Employees:</span>
                                <span className="font-semibold">{result.directEmployees}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Contractors:</span>
                                <span className="font-semibold">{result.indirectWorkers}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Total Workforce:</span>
                                <span className="font-bold text-lg text-green-700">{result.total}</span>
                              </div>
                              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Employee % = {result.employeePercentage}% of total workforce
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Turnover Rate */}
                    {formData.turnover['turnover-total'].value && formData.workforce['total-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">🔄 Turnover Rate</h4>
                        {(() => {
                          const departures = parseFloat(formData.turnover['turnover-total'].value) || 0;
                          const avgEmployees = parseFloat(formData.workforce['total-employees'].value) || 0;
                          const rate = calculateTurnoverRate(departures, avgEmployees);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Departures:</span>
                                <span className="font-semibold">{departures}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg Employees:</span>
                                <span className="font-semibold">{avgEmployees}</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Turnover Rate:</span>
                                <span className="font-bold text-lg text-green-700">{rate}%</span>
                              </div>
                              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Formula: ({departures} ÷ {avgEmployees}) × 100
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Gender Pay Gap */}
                    {formData.compensation['pay-gap-gender'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">⚖️ Gender Pay Gap</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Pay Gap:</span>
                            <span className="font-bold text-lg text-green-700">{formData.compensation['pay-gap-gender'].value}%</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            Formula: ((Male Pay - Female Pay) ÷ Male Pay) × 100
                          </div>
                          <div className="mt-2 text-xs text-gray-700">
                            {parseFloat(formData.compensation['pay-gap-gender'].value) < 5 
                              ? '✅ Excellent pay equity' 
                              : parseFloat(formData.compensation['pay-gap-gender'].value) < 15 
                              ? '⚠️ Moderate gap - improvement recommended' 
                              : '❌ Significant gap - urgent action needed'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CEO Pay Ratio */}
                    {formData.compensation['pay-ratio-ceo'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">💰 CEO Pay Ratio</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Ratio:</span>
                            <span className="font-bold text-lg text-green-700">{formData.compensation['pay-ratio-ceo'].value}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            Formula: CEO Compensation ÷ Median Employee Pay
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gender Distribution */}
                    {formData.gender['male-employees'].value && formData.gender['female-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">👫 Gender Distribution</h4>
                        {(() => {
                          const male = parseFloat(formData.gender['male-employees'].value) || 0;
                          const female = parseFloat(formData.gender['female-employees'].value) || 0;
                          const nonBinary = parseFloat(formData.gender['non-binary-employees'].value) || 0;
                          const total = male + female + nonBinary;
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Male:</span>
                                <span className="font-semibold">{male} ({total > 0 ? ((male/total)*100).toFixed(1) : 0}%)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Female:</span>
                                <span className="font-semibold">{female} ({total > 0 ? ((female/total)*100).toFixed(1) : 0}%)</span>
                              </div>
                              {nonBinary > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Non-binary:</span>
                                  <span className="font-semibold">{nonBinary} ({total > 0 ? ((nonBinary/total)*100).toFixed(1) : 0}%)</span>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
                <button
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 flex items-center justify-center gap-2"
                  onClick={handleSave}
                  disabled={loading || saveStatus === 'saving' || saveStatus === 'submitting'}
                >
                  <Save strokeWidth={2} />
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved' : 'Save Progress'}
                </button>
                <button
                  className="flex-1 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700 flex items-center justify-center gap-2"
                  onClick={handleSubmit}
                  disabled={loading || saveStatus === 'saving' || saveStatus === 'submitting'}
                >
                  {saveStatus === 'submitting' ? 'Submitting...' : saveStatus === 'submitted' ? '✓ Submitted' : 'Submit Data'}
                </button>
                <button
                  className="flex-1 rounded-lg border-2 border-green-600 bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 flex items-center justify-center gap-2"
                  onClick={() => setShowCalculations(!showCalculations)}
                >
                  <Award className="w-4 h-4" strokeWidth={2} />
                  {showCalculations ? 'Hide' : 'Show'} Automated Calculations
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDemographicsCollection;

