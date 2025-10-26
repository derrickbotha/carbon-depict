import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  Circle,
  GraduationCap,
  TrendingUp,
  Info,
  AlertCircle,
  Award,
  Lightbulb,
  Target,
  Users,
  BookOpen,
  Clock
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';
import useESGMetrics from '../../hooks/useESGMetrics';

const TrainingDevelopmentCollection = () => {
  const navigate = useNavigate();
  const { createMetric, updateMetric, metrics: savedMetrics, loading } = useESGMetrics({
    topic: 'Training & Development',
    pillar: 'Social'
  });
  
  const [saveStatus, setSaveStatus] = useState('');
  const [existingMetricId, setExistingMetricId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('trainingHours');
  const [showInsights, setShowInsights] = useState(false);

  const [formData, setFormData] = useState({
    trainingHours: {
      'total-training-hours': { name: 'Total Training Hours Delivered', value: '', unit: 'hours', completed: false, frameworks: ['GRI 404-1', 'CSRD S1-17'] },
      'mandatory-training-hours': { name: 'Mandatory Compliance Training Hours', value: '', unit: 'hours', completed: false, frameworks: ['GRI 404-1'] },
      'optional-training-hours': { name: 'Optional / Elective Learning Hours', value: '', unit: 'hours', completed: false, frameworks: ['GRI 404-2'] },
      'leadership-program-hours': { name: 'Leadership Program Hours Delivered', value: '', unit: 'hours', completed: false, frameworks: ['GRI 404-2', 'CSRD S1-18'] },
      'digital-learning-hours': { name: 'Digital Learning Hours (LMS, Microlearning)', value: '', unit: 'hours', completed: false, frameworks: ['GRI 404-1'] }
    },
    participation: {
      'total-employees': { name: 'Employees in Scope for Training', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-1', 'CSRD S1-17'] },
      'employees-trained': { name: 'Employees Completing At Least One Training', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-1', 'CSRD S1-17'] },
      'employees-completed': { name: 'Employees Completing All Mandatory Modules', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-17'] },
      'average-courses-per-employee': { name: 'Average Courses Completed per Employee', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-1'] },
      'hours-per-employee-target': { name: 'Hours per Employee Target (Annual)', value: '', unit: 'hours', completed: false, frameworks: ['CSRD S1-17'] }
    },
    leadership: {
      'leaders-trained': { name: 'Leaders Completing Development Programs', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-3', 'CSRD S1-18'] },
      'high-potential-participants': { name: 'High-Potential Talent in Programs', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-18'] },
      'succession-roles-covered': { name: 'Critical Roles with Succession Coverage (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-18'] },
      'mentoring-pairs': { name: 'Active Mentoring or Coaching Pairs', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-2'] }
    },
    skillDevelopment: {
      'critical-skills-identified': { name: 'Priority Skill Gaps Identified', value: '', unit: 'text', completed: false, frameworks: ['GRI 404-2', 'CSRD S1-19'] },
      'employees-reskilled': { name: 'Employees Completing Reskilling Programs', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-19'] },
      'certifications-earned': { name: 'Professional Certifications Earned', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-2'] },
      'digital-competency-score': { name: 'Average Digital Competency Score (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD S1-19'] }
    },
    delivery: {
      'instructor-led-sessions': { name: 'Instructor-Led Sessions Delivered', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-2'] },
      'digital-modules-completed': { name: 'Digital Modules Completed', value: '', unit: 'number', completed: false, frameworks: ['GRI 404-2'] },
      'learning-platforms-used': { name: 'Learning Platforms Utilized', value: '', unit: 'text', completed: false, frameworks: ['GRI 404-1'] },
      'avg-session-rating': { name: 'Average Session Satisfaction Rating (1-5)', value: '', unit: 'score', completed: false, frameworks: ['CSRD S1-17'] }
    },
    investment: {
      'training-budget-approved': { name: 'Annual Training Budget Approved', value: '', unit: 'USD', completed: false, frameworks: ['GRI 404-1'] },
      'training-budget-spent': { name: 'Training Budget Utilized', value: '', unit: 'USD', completed: false, frameworks: ['GRI 404-1'] },
      'tuition-reimbursement': { name: 'Tuition Reimbursement Provided', value: '', unit: 'USD', completed: false, frameworks: ['CSRD S1-17'] },
      'roi-commentary': { name: 'ROI or Business Impact Commentary', value: '', unit: 'text', completed: false, frameworks: ['CSRD S1-19'] }
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

  // Load existing data from database
  useEffect(() => {
    if (savedMetrics && savedMetrics.length > 0) {
      const latestMetric = savedMetrics[0];
      setExistingMetricId(latestMetric._id);
      
      if (latestMetric.metadata && latestMetric.metadata.formData) {
        setFormData(latestMetric.metadata.formData);
      }
    }
  }, [savedMetrics]);

  // Save data to MongoDB
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const totalHours = parseFloat(formData.trainingHours['total-training-hours']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD,SDG',
        pillar: 'Social',
        topic: 'Training & Development',
        metricName: 'Training & Development Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalHours,
        unit: 'hours',
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
      console.error('Error saving Training & Development data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric]);

  // Submit data (publish)
  const handleSubmit = useCallback(async () => {
    setSaveStatus('submitting');
    try {
      const totalHours = parseFloat(formData.trainingHours['total-training-hours']?.value) || 0;
      
      const metricData = {
        framework: 'GRI,CSRD,SDG',
        pillar: 'Social',
        topic: 'Training & Development',
        metricName: 'Training & Development Data',
        reportingPeriod: new Date().getFullYear().toString(),
        value: totalHours,
        unit: 'hours',
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
      alert('Training & Development data submitted successfully and saved to database!');
      setTimeout(() => {
        navigate('/dashboard/esg/data-entry');
      }, 1500);
    } catch (error) {
      console.error('Error submitting Training & Development data:', error);
      setSaveStatus('error');
      alert('Error submitting data. Please try again.');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  }, [formData, totalProgress, existingMetricId, createMetric, updateMetric, navigate]);

  const categories = [
    {
      id: 'trainingHours',
      name: 'Training Hours Overview',
      description: 'Total hours delivered and modality mix',
      icon: '⏱️',
      fields: Object.keys(formData.trainingHours).length
    },
    {
      id: 'participation',
      name: 'Participation & Coverage',
      description: 'Employee reach and completion metrics',
      icon: '👥',
      fields: Object.keys(formData.participation).length
    },
    {
      id: 'leadership',
      name: 'Leadership & Succession',
      description: 'Leadership pipeline and mentoring',
      icon: '🎯',
      fields: Object.keys(formData.leadership).length
    },
    {
      id: 'skillDevelopment',
      name: 'Skills & Certifications',
      description: 'Reskilling and critical capability build',
      icon: '💡',
      fields: Object.keys(formData.skillDevelopment).length
    },
    {
      id: 'delivery',
      name: 'Delivery Channels',
      description: 'Learning delivery methods and feedback',
      icon: '📚',
      fields: Object.keys(formData.delivery).length
    },
    {
      id: 'investment',
      name: 'Investment & ROI',
      description: 'Budget allocations and impact narrative',
      icon: '💰',
      fields: Object.keys(formData.investment).length
    }
  ];

  const currentCategoryData = categories.find((cat) => cat.id === currentCategory);

  const calculatedMetrics = useMemo(() => {
    const totalEmployees = parseFloat(formData.participation['total-employees'].value) || 0;
    const employeesTrained = parseFloat(formData.participation['employees-trained'].value) || 0;
    const employeesCompleted = parseFloat(formData.participation['employees-completed'].value) || 0;
    const totalHours = parseFloat(formData.trainingHours['total-training-hours'].value) || 0;
    const leadershipParticipants = parseFloat(formData.leadership['leaders-trained'].value) || 0;
    const budgetSpent = parseFloat(formData.investment['training-budget-spent'].value) || 0;

    const hasNumericInput = totalEmployees || employeesTrained || totalHours || leadershipParticipants || budgetSpent;

    return {
      hasData: hasNumericInput > 0,
      averageHours: totalEmployees > 0 ? (totalHours / totalEmployees).toFixed(2) : '0.00',
      coverageRate: totalEmployees > 0 ? ((employeesTrained / totalEmployees) * 100).toFixed(1) : '0.0',
      completionRate: employeesTrained > 0 ? ((employeesCompleted / employeesTrained) * 100).toFixed(1) : '0.0',
      leadershipCoverage: employeesTrained > 0 ? ((leadershipParticipants / employeesTrained) * 100).toFixed(1) : '0.0',
      spendPerEmployee: totalEmployees > 0 ? (budgetSpent / totalEmployees).toFixed(2) : '0.00'
    };
  }, [formData]);

  const numericUnits = ['number', 'hours', '%', 'USD', 'score'];

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <GraduationCap className="h-6 w-6 text-indigo-600" strokeWidth={2} />
                  <span className="text-sm font-semibold text-indigo-600">TRAINING & DEVELOPMENT</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Training & Development Data Collection</h1>
                <p className="text-cd-muted">
                  Data for GRI 404 and CSRD S1 (Own Workforce Talent Development)
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSubmit}
                disabled={loading || saveStatus === 'submitting'}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                {saveStatus === 'submitting' ? 'Submitting...' : saveStatus === 'submitted' ? '✓ Submitted' : 'Submit Data'}
              </button>
              <button 
                onClick={handleSave}
                disabled={loading || saveStatus === 'saving'}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? '✓ Saved to Database' : 'Save Progress'}
              </button>
            </div>
          </div>

          <FrameworkProgressBar
            framework="Training & Development"
            completionPercentage={totalProgress}
            totalFields={Object.values(formData).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}
            completedFields={Object.values(formData).reduce((sum, cat) => sum + Object.values(cat).filter((f) => f.completed).length, 0)}
            showDetails={true}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">GRI 404-1: Training Hours</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">GRI 404-2: Skills Management</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">GRI 404-3: Career Development</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-17: Skills & Competence</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-18: Talent Development</span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">CSRD S1-19: Training Investments</span>
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
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      isActive
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                        : 'border-cd-border bg-white text-cd-text hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-indigo-600'}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className={`mb-1 font-semibold ${isActive ? 'text-white' : 'text-cd-text'}`}>{cat.name}</div>
                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-cd-muted'}`}>{cat.fields} fields</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/20">
                      <div
                        className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-600'}`}
                        style={{ width: `${progress}%` }}
                      />
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
                  <span>Enter training activity for the reporting period to power ESG disclosures.</span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(formData[currentCategory] || {}).map(([fieldKey, field]) => {
                  const isNumeric = numericUnits.includes(field.unit);
                  const inputType = isNumeric ? 'number' : 'text';
                  const step = field.unit === '%' ? '0.1' : field.unit === 'score' ? '0.1' : '1';
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
                            <span key={fw} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                              {fw}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {isNumeric ? (
                            <>
                              <input
                                type={inputType}
                                step={step}
                                min={field.unit === 'score' ? '0' : '0'}
                                max={field.unit === 'score' ? '5' : undefined}
                                value={field.value}
                                onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                                className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                                placeholder={`Enter ${field.unit}`}
                              />
                              <div className="flex w-24 items-center justify-center rounded-lg border border-cd-border bg-cd-surface px-3 text-sm text-cd-muted">
                                {field.unit}
                              </div>
                            </>
                          ) : (
                            <textarea
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
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

              <div className="mt-6 flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex items-center gap-3 text-sm text-indigo-900">
                  <Lightbulb className="h-4 w-4" strokeWidth={2} />
                  <span>See calculated insights from hours, participation, and spend.</span>
                </div>
                <button
                  onClick={() => setShowInsights((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {showInsights ? 'Hide Insights' : 'Show Insights'}
                </button>
              </div>

              {showInsights && (
                <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 p-6">
                  <div className="mb-4 flex items-center gap-2 text-indigo-900">
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                    <span className="text-sm font-semibold">Training Program Analytics</span>
                  </div>
                  {calculatedMetrics.hasData ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Average Hours per Employee</span>
                          <Clock className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{calculatedMetrics.averageHours}</div>
                        <p className="mt-1 text-xs text-cd-muted">GRI 404-1 guidance: 20+ hours indicates mature programs.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Employee Coverage Rate</span>
                          <Users className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{calculatedMetrics.coverageRate}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Target 85%+ for CSRD S1-17 compliance readiness.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Mandatory Completion Rate</span>
                          <Target className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{calculatedMetrics.completionRate}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Flag below 90% to prioritize remediation.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Leadership Program Coverage</span>
                          <Award className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">{calculatedMetrics.leadershipCoverage}%</div>
                        <p className="mt-1 text-xs text-cd-muted">Ensure succession coverage across critical roles.</p>
                      </div>
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-sm text-cd-muted">
                          <span>Spend per Employee</span>
                          <BookOpen className="h-4 w-4 text-indigo-500" strokeWidth={2} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-cd-text">${calculatedMetrics.spendPerEmployee}</div>
                        <p className="mt-1 text-xs text-cd-muted">Benchmark: USD $700-$1,200 for advanced talent strategies.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-indigo-200 bg-white p-6 text-sm text-cd-muted">
                      <Info className="h-4 w-4 text-indigo-500 inline mr-2" strokeWidth={2} />
                      Enter numeric hours, participants, and spend to unlock automated insights.
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

export default TrainingDevelopmentCollection;
