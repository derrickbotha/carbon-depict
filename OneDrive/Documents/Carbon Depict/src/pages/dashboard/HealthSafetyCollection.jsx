// Cache bust 2025-10-23
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  CheckCircle2, 
  Circle,
  Shield,
  AlertTriangle,
  TrendingUp,
  Info,
  AlertCircle,
  Award,
  X,
  Heart,
  Activity
} from '@atoms/Icon';
import FrameworkProgressBar from '../../components/molecules/FrameworkProgressBar';

const HealthSafetyCollection = () => {
  const [currentCategory, setCurrentCategory] = useState('incidents');
  const [showCalculations, setShowCalculations] = useState(false);
  
  // Calculation Functions
  const calculateLTIFR = useCallback((lostTimeInjuries, hoursWorked) => {
    // Lost Time Injury Frequency Rate (per 1,000,000 hours worked)
    if (!hoursWorked || hoursWorked === 0) return 0;
    return ((lostTimeInjuries / hoursWorked) * 1000000).toFixed(2);
  }, []);

  const calculateTRIFR = useCallback((recordableInjuries, hoursWorked) => {
    // Total Recordable Injury Frequency Rate (per 1,000,000 hours worked)
    if (!hoursWorked || hoursWorked === 0) return 0;
    return ((recordableInjuries / hoursWorked) * 1000000).toFixed(2);
  }, []);

  const calculateSeverityRate = useCallback((daysLost, hoursWorked) => {
    // Severity Rate (days lost per 1,000,000 hours worked)
    if (!hoursWorked || hoursWorked === 0) return 0;
    return ((daysLost / hoursWorked) * 1000000).toFixed(2);
  }, []);

  const calculateFatalityRate = useCallback((fatalities, hoursWorked) => {
    // Fatality Rate (per 10,000,000 hours worked)
    if (!hoursWorked || hoursWorked === 0) return 0;
    return ((fatalities / hoursWorked) * 10000000).toFixed(2);
  }, []);

  const calculateOccupationalDiseaseRate = useCallback((diseases, employees) => {
    // Occupational Disease Rate (per 10,000 employees)
    if (!employees || employees === 0) return 0;
    return ((diseases / employees) * 10000).toFixed(2);
  }, []);

  const [formData, setFormData] = useState({
    // Work-Related Injuries
    incidents: {
      'fatalities': { name: 'Number of Fatalities', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'high-consequence-injuries': { name: 'High-Consequence Work-Related Injuries (excluding fatalities)', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'recordable-injuries': { name: 'Total Recordable Work-Related Injuries', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'lost-time-injuries': { name: 'Lost Time Injuries (LTI)', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'days-lost': { name: 'Days Lost Due to Injuries', value: '', unit: 'days', completed: false, frameworks: ['GRI 403-9'] },
      'first-aid-cases': { name: 'First Aid Cases', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9'] },
      'near-misses': { name: 'Near Miss Incidents Reported', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-14'] },
    },
    // Work-Related Ill Health
    illHealth: {
      'occupational-diseases': { name: 'Cases of Occupational Disease', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-10', 'CSRD S1-14'] },
      'work-related-illnesses': { name: 'Work-Related Ill Health Cases', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-10', 'CSRD S1-14'] },
      'mental-health-cases': { name: 'Mental Health Cases Related to Work', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-14'] },
      'days-lost-illness': { name: 'Days Lost Due to Ill Health', value: '', unit: 'days', completed: false, frameworks: ['GRI 403-10'] },
    },
    // Hours Worked & Exposure
    exposure: {
      'total-hours-employees': { name: 'Total Hours Worked by Employees', value: '', unit: 'hours', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'total-hours-contractors': { name: 'Total Hours Worked by Contractors', value: '', unit: 'hours', completed: false, frameworks: ['GRI 403-9', 'CSRD S1-14'] },
      'number-employees': { name: 'Number of Employees', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9'] },
      'number-contractors': { name: 'Number of Contractors', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-9'] },
    },
    // Safety Management System
    management: {
      'iso-45001-certified': { name: 'ISO 45001 Certified', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-1', 'CSRD S1-14'] },
      'ohsms-coverage': { name: 'Workers Covered by OH&S Management System (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 403-8', 'CSRD S1-14'] },
      'safety-policy': { name: 'Occupational Health & Safety Policy', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-1', 'CSRD S1-14'] },
      'safety-committees': { name: 'Worker Safety Committees Established', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-4', 'CSRD S1-14'] },
      'worker-participation': { name: 'Workers Represented in Safety Committees (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 403-4'] },
    },
    // Training & Awareness
    training: {
      'safety-training-hours': { name: 'Total Safety Training Hours Delivered', value: '', unit: 'hours', completed: false, frameworks: ['GRI 403-5', 'CSRD S1-14'] },
      'employees-trained': { name: 'Employees Receiving Safety Training', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-5', 'CSRD S1-14'] },
      'training-coverage': { name: 'Safety Training Coverage (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 403-5'] },
      'emergency-drills': { name: 'Emergency Drills Conducted', value: '', unit: 'number', completed: false, frameworks: ['CSRD S1-14'] },
    },
    // Health Services
    healthServices: {
      'health-surveillance': { name: 'Workers Covered by Health Surveillance (%)', value: '', unit: '%', completed: false, frameworks: ['GRI 403-3', 'CSRD S1-14'] },
      'occupational-health-services': { name: 'Occupational Health Services Provided', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-3', 'CSRD S1-14'] },
      'health-checks': { name: 'Health Checks Conducted', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-3'] },
      'wellness-programs': { name: 'Wellness Programs Offered', value: '', unit: 'text', completed: false, frameworks: ['CSRD S1-14'] },
    },
    // Risk Assessment
    riskAssessment: {
      'hazard-identification': { name: 'Hazard Identification Process', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-2', 'CSRD S1-14'] },
      'risk-assessments-conducted': { name: 'Risk Assessments Conducted', value: '', unit: 'number', completed: false, frameworks: ['GRI 403-2', 'CSRD S1-14'] },
      'high-risk-activities': { name: 'High-Risk Activities Identified', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-2'] },
      'control-measures': { name: 'Control Measures Implemented', value: '', unit: 'text', completed: false, frameworks: ['GRI 403-2', 'CSRD S1-14'] },
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
      id: 'incidents',
      name: 'Work-Related Injuries',
      description: 'Injuries, fatalities, and near misses',
      icon: '⚠️',
      fields: 7,
    },
    {
      id: 'illHealth',
      name: 'Work-Related Ill Health',
      description: 'Occupational diseases and illnesses',
      icon: '🏥',
      fields: 4,
    },
    {
      id: 'exposure',
      name: 'Hours Worked & Exposure',
      description: 'Working hours for rate calculations',
      icon: '⏱️',
      fields: 4,
    },
    {
      id: 'management',
      name: 'Safety Management System',
      description: 'OH&S systems and certifications',
      icon: '🛡️',
      fields: 5,
    },
    {
      id: 'training',
      name: 'Training & Awareness',
      description: 'Safety training and drills',
      icon: '🎓',
      fields: 4,
    },
    {
      id: 'healthServices',
      name: 'Health Services',
      description: 'Health surveillance and wellness',
      icon: '💊',
      fields: 4,
    },
    {
      id: 'riskAssessment',
      name: 'Risk Assessment',
      description: 'Hazard identification and controls',
      icon: '🔍',
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
                <ArrowLeft strokeWidth={2} />
              </Link>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Shield strokeWidth={2} />
                  <span className="text-sm font-semibold text-orange-600">HEALTH & SAFETY</span>
                </div>
                <h1 className="text-3xl font-bold text-cd-text">Health & Safety Data Collection</h1>
                <p className="text-cd-muted">
                  Data for GRI 403 (Occupational Health & Safety) and CSRD S1-14
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Download strokeWidth={2} />
                Export Data
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2">
                <Save strokeWidth={2} />
                Save Progress
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <FrameworkProgressBar
            framework="Health & Safety"
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
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">GRI 403: Occupational Health & Safety</span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">CSRD S1-14: Health & Safety</span>
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
                        ? 'border-orange-600 bg-orange-600 text-white shadow-lg'
                        : 'border-cd-border bg-white text-cd-text hover:border-orange-300 hover:shadow-md'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-orange-600'}`}>
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
                        className={`h-1 rounded-full ${isActive ? 'bg-white' : 'bg-orange-600'}`}
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
                  <span>Enter your organization's health and safety data for the reporting period</span>
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
                            className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20"
                            placeholder="Enter description or details"
                            rows={3}
                          />
                        ) : (
                          <>
                            <input
                              type="number"
                              step={field.unit === '%' ? '0.01' : field.unit === 'hours' ? '1' : '1'}
                              min="0"
                              value={field.value}
                              onChange={(e) => handleInputChange(currentCategory, fieldKey, e.target.value)}
                              className="flex-1 rounded-lg border border-cd-border bg-white px-4 py-2 text-cd-text placeholder-cd-muted/50 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20"
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

              {/* Automated Calculations - LTIFR */}
              {currentCategory === 'incidents' && formData.incidents['lost-time-injuries'].value && formData.exposure['total-hours-employees'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Lost Time Injury Frequency Rate (LTIFR)
                    </div>
                  </div>
                  {(() => {
                    const lti = parseFloat(formData.incidents['lost-time-injuries'].value) || 0;
                    const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                    const ltifr = calculateLTIFR(lti, hours);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Lost Time Injuries:</span>
                          <span className="font-semibold">{lti}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hours Worked:</span>
                          <span className="font-semibold">{hours.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">LTIFR:</span>
                          <span className="font-semibold text-lg">{ltifr}</span>
                        </div>
                        <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> (LTI ÷ Hours Worked) × 1,000,000 = ({lti} ÷ {hours}) × 1,000,000
                        </div>
                        <div className="text-xs text-green-700">
                          {parseFloat(ltifr) < 1 ? '✅ Excellent safety performance' : parseFloat(ltifr) < 3 ? '⚠️ Moderate - continue improvement' : '❌ High rate - urgent action needed'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Automated Calculations - TRIFR */}
              {currentCategory === 'incidents' && formData.incidents['recordable-injuries'].value && formData.exposure['total-hours-employees'].value && (
                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                      <Award className="h-4 w-4" strokeWidth={2} />
                      Total Recordable Injury Frequency Rate (TRIFR)
                    </div>
                  </div>
                  {(() => {
                    const recordable = parseFloat(formData.incidents['recordable-injuries'].value) || 0;
                    const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                    const trifr = calculateTRIFR(recordable, hours);
                    return (
                      <div className="space-y-2 text-sm text-green-800">
                        <div className="flex justify-between">
                          <span>Recordable Injuries:</span>
                          <span className="font-semibold">{recordable}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hours Worked:</span>
                          <span className="font-semibold">{hours.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="font-semibold">TRIFR:</span>
                          <span className="font-semibold text-lg">{trifr}</span>
                        </div>
                        <div className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded">
                          <strong>Formula:</strong> (Recordable Injuries ÷ Hours Worked) × 1,000,000
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
                      <h3 className="text-xl font-bold text-green-900">Safety Metrics Summary</h3>
                    </div>
                    <button
                      onClick={() => setShowCalculations(false)}
                      className="text-green-700 hover:text-green-900"
                    >
                      <X className="h-5 w-5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* LTIFR */}
                    {formData.incidents['lost-time-injuries'].value && formData.exposure['total-hours-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">⚠️ LTIFR</h4>
                        {(() => {
                          const lti = parseFloat(formData.incidents['lost-time-injuries'].value) || 0;
                          const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                          const ltifr = calculateLTIFR(lti, hours);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">LTIFR:</span>
                                <span className="font-bold text-lg text-green-700">{ltifr}</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Per 1M hours worked
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TRIFR */}
                    {formData.incidents['recordable-injuries'].value && formData.exposure['total-hours-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">📊 TRIFR</h4>
                        {(() => {
                          const recordable = parseFloat(formData.incidents['recordable-injuries'].value) || 0;
                          const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                          const trifr = calculateTRIFR(recordable, hours);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">TRIFR:</span>
                                <span className="font-bold text-lg text-green-700">{trifr}</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Per 1M hours worked
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Severity Rate */}
                    {formData.incidents['days-lost'].value && formData.exposure['total-hours-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">📅 Severity Rate</h4>
                        {(() => {
                          const days = parseFloat(formData.incidents['days-lost'].value) || 0;
                          const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                          const severity = calculateSeverityRate(days, hours);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Severity Rate:</span>
                                <span className="font-bold text-lg text-green-700">{severity}</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Days lost per 1M hours
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Fatality Rate */}
                    {formData.incidents['fatalities'].value && formData.exposure['total-hours-employees'].value && (
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <h4 className="mb-3 font-semibold text-green-900">💀 Fatality Rate</h4>
                        {(() => {
                          const fatalities = parseFloat(formData.incidents['fatalities'].value) || 0;
                          const hours = parseFloat(formData.exposure['total-hours-employees'].value) || 0;
                          const fatalityRate = calculateFatalityRate(fatalities, hours);
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Fatality Rate:</span>
                                <span className="font-bold text-lg text-red-700">{fatalityRate}</span>
                              </div>
                              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                Per 10M hours worked
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
              {currentCategory === 'incidents' && (
                <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-900">
                    <Info strokeWidth={2} />
                    Work-Related Injuries Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-orange-800">
                    <li>• <strong>GRI 403-9:</strong> Report work-related injuries, fatalities, high-consequence injuries</li>
                    <li>• <strong>High-consequence injury:</strong> Injury from which worker cannot recover within 6 months</li>
                    <li>• <strong>Recordable injury:</strong> Any work-related injury requiring medical treatment beyond first aid</li>
                    <li>• <strong>Lost Time Injury:</strong> Work-related injury resulting in absence from work</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'exposure' && (
                <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-900">
                    <Info strokeWidth={2} />
                    Hours Worked Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-orange-800">
                    <li>• <strong>Total hours worked:</strong> Sum of all actual hours worked during reporting period</li>
                    <li>• Include regular hours, overtime, and time worked by temporary workers</li>
                    <li>• Exclude holidays, vacation, sick leave, and other paid/unpaid leave</li>
                    <li>• Used to calculate injury frequency rates (LTIFR, TRIFR)</li>
                  </ul>
                </div>
              )}

              {currentCategory === 'management' && (
                <div className="mt-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-900">
                    <Info strokeWidth={2} />
                    Safety Management System Guidance
                  </div>
                  <ul className="space-y-1 text-xs text-orange-800">
                    <li>• <strong>GRI 403-1:</strong> Describe the occupational health and safety management system</li>
                    <li>• <strong>ISO 45001:</strong> International standard for OH&S management systems</li>
                    <li>• <strong>GRI 403-8:</strong> Report percentage of workers covered by OH&S system</li>
                    <li>• Include scope, whether system is audited, and certification status</li>
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 border-t border-cd-border pt-6">
                <button
                  className="flex-1 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-700 flex items-center justify-center gap-2"
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
                  {showCalculations ? 'Hide' : 'Show'} Safety Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthSafetyCollection;

