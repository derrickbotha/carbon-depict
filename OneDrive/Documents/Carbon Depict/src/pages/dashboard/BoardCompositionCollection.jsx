// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Users,
  Shield,
  TrendingUp,
  Info,
  AlertCircle,
  Award,
  X,
  Building2,
  Scale
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const BoardCompositionCollection = () => {
  const [currentCategory, setCurrentCategory] = useState('structure');
  const [showCalculations, setShowCalculations] = useState(false);
  
  // Calculation Functions
  const calculateIndependenceRatio = useCallback((independent, total) => {
    if (!total || total === 0) return 0;
    return ((independent / total) * 100).toFixed(1);
  }, []);

  const calculateDiversityMetrics = useCallback((category, total) => {
    if (!total || total === 0) return { percentage: 0, ratio: '0:0' };
    const percentage = ((category / total) * 100).toFixed(1);
    const ratio = `${category}:${total - category}`;
    return { percentage, ratio };
  }, []);

  const calculateAverageAge = useCallback((under50, age50to70, over70) => {
    // Weighted average using midpoints: 40, 60, 75
    const totalMembers = under50 + age50to70 + over70;
    if (totalMembers === 0) return 0;
    const weightedSum = (under50 * 40) + (age50to70 * 60) + (over70 * 75);
    return (weightedSum / totalMembers).toFixed(1);
  }, []);

  const calculateAverageTenure = useCallback((under3, years3to6, years6to9, over9) => {
    // Weighted average using midpoints: 1.5, 4.5, 7.5, 10
    const totalMembers = under3 + years3to6 + years6to9 + over9;
    if (totalMembers === 0) return 0;
    const weightedSum = (under3 * 1.5) + (years3to6 * 4.5) + (years6to9 * 7.5) + (over9 * 10);
    return (weightedSum / totalMembers).toFixed(1);
  }, []);

  const [formData, setFormData] = useState({
    // Board Structure
    structure: {
      'total-directors': { name: 'Total Number of Board Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1', 'TCFD'] },
      'executive-directors': { name: 'Executive (Inside) Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'non-executive-directors': { name: 'Non-Executive (Outside) Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'independent-directors': { name: 'Independent Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1', 'TCFD'] },
      'board-chair': { name: 'Board Chair Name and Role', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'chair-ceo-separate': { name: 'Chair and CEO Roles Separated', value: '', unit: 'text', completed: false, frameworks: ['GRI 2-11', 'CSRD G1-1'] },
    },
    // Gender Diversity
    gender: {
      'male-directors': { name: 'Male Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'female-directors': { name: 'Female Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'non-binary-directors': { name: 'Non-binary Directors', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1'] },
      'gender-diversity-policy': { name: 'Gender Diversity Policy', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
      'gender-targets': { name: 'Gender Diversity Targets', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    // Age Diversity
    age: {
      'directors-under-50': { name: 'Directors Under 50 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'directors-50-70': { name: 'Directors 50-70 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'directors-over-70': { name: 'Directors Over 70 Years', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'age-limit-policy': { name: 'Age Limit Policy', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    // Skills & Expertise
    expertise: {
      'financial-experts': { name: 'Directors with Financial Expertise', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'climate-experts': { name: 'Directors with Climate/ESG Expertise', value: '', unit: 'number', completed: false, frameworks: ['TCFD', 'CSRD G1-1'] },
      'industry-experts': { name: 'Directors with Industry Expertise', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'technology-experts': { name: 'Directors with Technology Expertise', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'risk-management-experts': { name: 'Directors with Risk Management Expertise', value: '', unit: 'number', completed: false, frameworks: ['TCFD', 'CSRD G1-1'] },
      'skills-matrix': { name: 'Board Skills Matrix Published', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    // Tenure & Experience
    tenure: {
      'tenure-under-3': { name: 'Directors with Tenure < 3 Years', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'tenure-3-6': { name: 'Directors with Tenure 3-6 Years', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'tenure-6-9': { name: 'Directors with Tenure 6-9 Years', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'tenure-over-9': { name: 'Directors with Tenure > 9 Years', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'term-limits': { name: 'Term Limits Policy', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    // Other Diversity
    diversity: {
      'ethnic-minority-directors': { name: 'Directors from Ethnic Minorities', value: '', unit: 'number', completed: false, frameworks: ['GRI 405-1', 'CSRD G1-1'] },
      'international-directors': { name: 'Directors from Different Countries', value: '', unit: 'number', completed: false, frameworks: ['CSRD G1-1'] },
      'diversity-initiatives': { name: 'Board Diversity Initiatives', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
    },
    // Board Activities
    activities: {
      'meetings-held': { name: 'Board Meetings Held in Reporting Period', value: '', unit: 'number', completed: false, frameworks: ['GRI 2-9', 'CSRD G1-1'] },
      'average-attendance': { name: 'Average Meeting Attendance Rate (%)', value: '', unit: '%', completed: false, frameworks: ['CSRD G1-1'] },
      'board-evaluation': { name: 'Board Effectiveness Evaluation Conducted', value: '', unit: 'text', completed: false, frameworks: ['CSRD G1-1'] },
      'esg-committee': { name: 'ESG/Sustainability Committee Established', value: '', unit: 'text', completed: false, frameworks: ['TCFD', 'CSRD G1-1'] },
      'climate-oversight': { name: 'Board-Level Climate Risk Oversight', value: '', unit: 'text', completed: false, frameworks: ['TCFD'] },
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
    {
      id: 'structure',
      name: 'Board Structure',
      description: 'Size and independence',
      icon: '🏛️',
      fields: 6,
    },
    {
      id: 'gender',
      name: 'Gender Diversity',
      description: 'Gender composition and policies',
      icon: '⚖️',
      fields: 5,
    },
    {
      id: 'age',
      name: 'Age Diversity',
      description: 'Age distribution of board',
      icon: '📊',
      fields: 4,
    },
    {
      id: 'expertise',
      name: 'Skills & Expertise',
      description: 'Board competencies and skills',
      icon: '🎓',
      fields: 6,
    },
    {
      id: 'tenure',
      name: 'Tenure & Experience',
      description: 'Board member tenure',
      icon: '⏳',
      fields: 5,
    },
    {
      id: 'diversity',
      name: 'Other Diversity',
      description: 'Ethnic and geographic diversity',
      icon: '🌍',
      fields: 3,
    },
    {
      id: 'activities',
      name: 'Board Activities',
      description: 'Meetings and oversight',
      icon: '📋',
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
                  <Building strokeWidth={2} />
                  <span className="text-sm font-semibold text-purple-600">BOARD COMPOSITION</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Board Composition Data Collection</h1>
                <p className="text-cd-muted">
                  Data for GRI 2-9, 405-1, CSRD G1-1, and TCFD Governance
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
                <Save strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="Board Composition"
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
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">GRI 2-9: Governance Structure</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">GRI 405-1: Diversity</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">CSRD G1-1: Board Composition</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">TCFD: Governance</span>
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
                        ? 'border-purple-600 bg-purple-600 text-white shadow-lg'
                        : 'border-cd-border bg-white text-cd-text hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-purple-600'}`}>
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
                        className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-purple-600'}`}
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
                  <span>Enter your board of directors' composition data</span>
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
                            className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                            placeholder="Enter description or details"
                            rows={3}
                          />
                        ) : (
                          <>
                            <input
                              type="number"
                              step={field.unit === '%' ? '0.1' : '1'}
                              min="0"
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                              placeholder={`Enter ${field.unit}`}
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

              {/* Automated Calculations - Independence Ratio */}
              {currentCategory === 'structure' && formData.structure['independent-directors'].value && formData.structure['total-directors'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Board Independence Ratio
                    </div>
                  </div>
                  {(() => {
                    const independent = parseFloat(formData.structure['independent-directors'].value) || 0;
                    const total = parseFloat(formData.structure['total-directors'].value) || 0;
                    const ratio = calculateIndependenceRatio(independent, total);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Independent Directors:</span>
                          <span className="font-semibold">{independent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Directors:</span>
                          <span className="font-semibold">{total}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">Independence Ratio:</span>
                          <span className="font-semibold text-lg">{ratio}%</span>
                        </div>
                        <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> (Independent Directors ÷ Total Directors) × 100
                        </div>
                        <div className="text-xs text-green-700">
                          {parseFloat(ratio) >= 50 ? '✅ Meets best practice (≥50% independent)' : parseFloat(ratio) >= 33 ? '⚠️ Adequate but below best practice' : '❌ Below recommended level'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Automated Calculations - Gender Diversity */}
              {currentCategory === 'gender' && formData.gender['female-directors'].value && formData.structure['total-directors'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Gender Diversity Metrics
                    </div>
                  </div>
                  {(() => {
                    const female = parseFloat(formData.gender['female-directors'].value) || 0;
                    const total = parseFloat(formData.structure['total-directors'].value) || 0;
                    const metrics = calculateDiversityMetrics(female, total);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Female Directors:</span>
                          <span className="font-semibold">{female}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Board Size:</span>
                          <span className="font-semibold">{total}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">Female Representation:</span>
                          <span className="font-semibold text-lg">{metrics.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gender Ratio (F:M):</span>
                          <span className="font-semibold">{metrics.ratio}</span>
                        </div>
                        <div className="text-xs text-green-700">
                          {parseFloat(metrics.percentage) >= 40 ? '✅ Excellent diversity (≥40%)' : parseFloat(metrics.percentage) >= 30 ? '⚠️ Good progress toward parity' : '❌ Below 30% target'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Comprehensive Calculation Summary */}
              {showCalculations && (
                <div className="mt-6 rounded-lg border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between border-b border-green-300 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-green-700" strokeWidth={2} />
                      <h3 className="text-xl font-bold text-green-900">Board Composition Analytics</h3>
                    </div>
                    <button
                      onClick={() => setShowCalculations(false)}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Independence Ratio */}
                    {formData.structure['independent-directors'].value && formData.structure['total-directors'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">🏛️ Independence</h4>
                        {(() => {
                          const independent = parseFloat(formData.structure['independent-directors'].value) || 0;
                          const total = parseFloat(formData.structure['total-directors'].value) || 0;
                          const ratio = calculateIndependenceRatio(independent, total);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Independence:</span>
                                <span className="font-bold text-lg text-green-700">{ratio}%</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Target: ≥50% for best practice
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Gender Diversity */}
                    {formData.gender['female-directors'].value && formData.structure['total-directors'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">⚖️ Gender Balance</h4>
                        {(() => {
                          const female = parseFloat(formData.gender['female-directors'].value) || 0;
                          const total = parseFloat(formData.structure['total-directors'].value) || 0;
                          const metrics = calculateDiversityMetrics(female, total);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Female %:</span>
                                <span className="font-bold text-lg text-green-700">{metrics.percentage}%</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Target: ≥40% for gender parity
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Average Age */}
                    {formData.age['directors-under-50'].value && formData.age['directors-50-70'].value && formData.age['directors-over-70'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">📊 Average Age</h4>
                        {(() => {
                          const under50 = parseFloat(formData.age['directors-under-50'].value) || 0;
                          const age50to70 = parseFloat(formData.age['directors-50-70'].value) || 0;
                          const over70 = parseFloat(formData.age['directors-over-70'].value) || 0;
                          const avgAge = calculateAverageAge(under50, age50to70, over70);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Avg Age:</span>
                                <span className="font-bold text-lg text-green-700">{avgAge} years</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Estimated using age bracket midpoints
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Average Tenure */}
                    {formData.tenure['tenure-under-3'].value && formData.tenure['tenure-3-6'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">⏳ Average Tenure</h4>
                        {(() => {
                          const under3 = parseFloat(formData.tenure['tenure-under-3'].value) || 0;
                          const years3to6 = parseFloat(formData.tenure['tenure-3-6'].value) || 0;
                          const years6to9 = parseFloat(formData.tenure['tenure-6-9'].value) || 0;
                          const over9 = parseFloat(formData.tenure['tenure-over-9'].value) || 0;
                          const avgTenure = calculateAverageTenure(under3, years3to6, years6to9, over9);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Avg Tenure:</span>
                                <span className="font-bold text-lg text-green-700">{avgTenure} years</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Balance between fresh perspectives and experience
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Climate Expertise */}
                    {formData.expertise['climate-experts'].value && formData.structure['total-directors'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">🌱 Climate Expertise</h4>
                        {(() => {
                          const climate = parseFloat(formData.expertise['climate-experts'].value) || 0;
                          const total = parseFloat(formData.structure['total-directors'].value) || 0;
                          const metrics = calculateDiversityMetrics(climate, total);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Climate/ESG:</span>
                                <span className="font-bold text-lg text-green-700">{metrics.percentage}%</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                TCFD: Board climate competence
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category-Specific Guidance */}
              {currentCategory === 'structure' && (
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-900">
                    <Info strokeWidth={2} />
                    Board Structure Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>• <strong>GRI 2-9:</strong> Governance structure and composition of highest governance body</li>
                    <li>• <strong>Independent Directors:</strong> No material relationship with the company</li>
                    <li>• <strong>Best Practice:</strong> At least 50% of board should be independent directors</li>
                    <li>• <strong>GRI 2-11:</strong> Chair should ideally be independent or separate from CEO</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'gender' && (
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-900">
                    <Info strokeWidth={2} />
                    Gender Diversity Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>• <strong>GRI 405-1:</strong> Report diversity of governance bodies by gender</li>
                    <li>• <strong>CSRD G1-1:</strong> Gender balance in administrative, management and supervisory bodies</li>
                    <li>• <strong>Best Practice:</strong> Target 40-60% representation for gender balance</li>
                    <li>• Many jurisdictions have minimum requirements (e.g., 30-40% female representation)</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'expertise' && (
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-900">
                    <Info strokeWidth={2} />
                    Skills & Expertise Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>• <strong>TCFD:</strong> Describe board members' expertise in climate-related issues</li>
                    <li>• <strong>CSRD G1-1:</strong> Report on expertise of board members</li>
                    <li>• <strong>Skills Matrix:</strong> Consider publishing board skills matrix publicly</li>
                    <li>• Key areas: Financial, ESG/Climate, Industry, Technology, Risk Management, Legal</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'activities' && (
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-900">
                    <Info strokeWidth={2} />
                    Board Activities Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-purple-800">
                    <li>• <strong>TCFD:</strong> Describe board's oversight of climate-related risks and opportunities</li>
                    <li>• <strong>Best Practice:</strong> Board should meet at least 4-6 times per year</li>
                    <li>• <strong>Attendance:</strong> Target {'>'} 80% average attendance rate</li>
                    <li>• <strong>ESG Committee:</strong> Dedicated committee for sustainability oversight recommended</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
                <button
                  className="flex-1 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-purple-700 flex items-center justify-center gap-2"
                  onClick={() => alert('Data saved! (API integration pending)')}
                >
                  <Save strokeWidth={2} />
                  Save Progress
                </button>
                <button
                  className="flex-1 rounded-lg border-2 border-green-600 bg-white px-6 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 flex items-center justify-center gap-2"
                  onClick={() => setShowCalculations(!showCalculations)}
                >
                  <Award className="w-4 h-4" strokeWidth={2} />
                  {showCalculations ? 'Hide' : 'Show'} Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardCompositionCollection;

