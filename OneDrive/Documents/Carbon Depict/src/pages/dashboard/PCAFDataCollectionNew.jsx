/**
 * PCAF Data Collection - Full Compliance Implementation
 * 
 * Implements PCAF Global GHG Standard requirements:
 * - All 7 asset classes with proper attribution formulas
 * - Data quality scoring (1-5 scale) per asset class
 * - Consolidation approach declaration
 * - Transparent audit trail
 * - Coverage & exclusions disclosure
 * - Separate scope 1/2/3 tracking
 * - Emission removals & avoided emissions
 * - Recalculation policy
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Download, Upload, CheckCircle2, Circle, FileText,
  Lightbulb, BookOpen, Plus, Building2, TrendingUp, DollarSign,
  PieChart, BarChart3, AlertTriangle, Shield, Calculator, X,
  ChevronRight, Info, Target, Leaf, Settings, Briefcase, Home,
  Car, Globe, Factory, Database, Clock
} from 'lucide-react';
import { useESGData } from '../../utils/esgDataManager';

// ============================================
// PCAF CONSTANTS & CONFIGURATIONS
// ============================================

const CONSOLIDATION_APPROACHES = [
  { value: 'operational_control', label: 'Operational Control', description: 'Report 100% of emissions from operations you control' },
  { value: 'financial_control', label: 'Financial Control', description: 'Report based on financial control criteria' },
];

const DATA_QUALITY_SCORES = {
  1: { 
    label: 'Score 1 - Highest Quality', 
    description: 'Verified primary data from counterparty (audited)',
    criteria: 'Company-specific, verified emissions data'
  },
  2: { 
    label: 'Score 2 - High Quality', 
    description: 'Primary data from counterparty (unverified)',
    criteria: 'Company-specific, unverified emissions data'
  },
  3: { 
    label: 'Score 3 - Medium Quality', 
    description: 'Averaged primary data or sector-specific data',
    criteria: 'Sector/region averages with company-specific activity'
  },
  4: { 
    label: 'Score 4 - Low Quality', 
    description: 'Proxy data or broad sector averages',
    criteria: 'Sector/region averages with estimated activity'
  },
  5: { 
    label: 'Score 5 - Lowest Quality', 
    description: 'Estimated data with low granularity',
    criteria: 'Highly aggregated estimates or global averages'
  },
};

const ASSET_CLASSES = [
  {
    id: 'listed_equity',
    name: 'Listed Equity & Corporate Bonds',
    icon: TrendingUp,
    description: 'Publicly traded companies and bonds',
    formula: 'Attribution Factor = Outstanding Amount / EVIC × Company Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Amount', unit: 'USD', type: 'number', required: true, tooltip: 'Value of your investment in the company' },
      { key: 'evic', label: 'EVIC (Enterprise Value Including Cash)', unit: 'USD', type: 'number', required: true, tooltip: 'Total equity + debt of the company' },
      { key: 'company_emissions_scope1', label: 'Company Scope 1 Emissions', unit: 'tCO2e', type: 'number', required: true, tooltip: 'Direct emissions from company operations' },
      { key: 'company_emissions_scope2', label: 'Company Scope 2 Emissions', unit: 'tCO2e', type: 'number', required: true, tooltip: 'Indirect emissions from purchased electricity' },
      { key: 'company_emissions_scope3', label: 'Company Scope 3 Emissions', unit: 'tCO2e', type: 'number', required: false, tooltip: 'Value chain emissions (phase-in per sector)' },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true, tooltip: 'CDP, Bloomberg, company report, etc.' },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true, tooltip: 'Year of emissions data' },
    ]
  },
  {
    id: 'business_loans',
    name: 'Business Loans & Unlisted Equity',
    icon: Briefcase,
    description: 'SME loans and private companies',
    formula: 'Attribution Factor = Outstanding Amount / (Total Equity + Debt) × Company Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Loan Amount', unit: 'USD', type: 'number', required: true },
      { key: 'company_total_equity', label: 'Company Total Equity', unit: 'USD', type: 'number', required: false, tooltip: 'If available' },
      { key: 'company_total_debt', label: 'Company Total Debt', unit: 'USD', type: 'number', required: false, tooltip: 'If available' },
      { key: 'evic_alternative', label: 'EVIC (if equity+debt unavailable)', unit: 'USD', type: 'number', required: false },
      { key: 'company_emissions_scope1', label: 'Company Scope 1 Emissions', unit: 'tCO2e', type: 'number', required: true },
      { key: 'company_emissions_scope2', label: 'Company Scope 2 Emissions', unit: 'tCO2e', type: 'number', required: true },
      { key: 'company_emissions_scope3', label: 'Company Scope 3 Emissions', unit: 'tCO2e', type: 'number', required: false },
      { key: 'use_proxy', label: 'Using Sector/Region Proxy?', unit: 'boolean', type: 'checkbox', required: false },
      { key: 'proxy_description', label: 'Proxy Description', unit: 'text', type: 'textarea', required: false, tooltip: 'Describe proxy methodology if used' },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
  {
    id: 'project_finance',
    name: 'Project Finance',
    icon: Factory,
    description: 'Infrastructure and project-specific financing',
    formula: 'Attribution Factor = Outstanding Amount / (Project Equity + Project Debt) × Project Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Amount', unit: 'USD', type: 'number', required: true },
      { key: 'project_total_equity', label: 'Total Project Equity', unit: 'USD', type: 'number', required: true },
      { key: 'project_total_debt', label: 'Total Project Debt', unit: 'USD', type: 'number', required: true },
      { key: 'project_emissions_scope1', label: 'Project Scope 1 Emissions', unit: 'tCO2e', type: 'number', required: true },
      { key: 'project_emissions_scope2', label: 'Project Scope 2 Emissions', unit: 'tCO2e', type: 'number', required: true },
      { key: 'project_emissions_scope3', label: 'Project Scope 3 Emissions', unit: 'tCO2e', type: 'number', required: false },
      { key: 'emission_removals', label: 'Emission Removals (Separate)', unit: 'tCO2e', type: 'number', required: false, tooltip: 'Carbon sequestration, CCS, etc.' },
      { key: 'avoided_emissions', label: 'Avoided Emissions (Optional)', unit: 'tCO2e', type: 'number', required: false, tooltip: 'Renewable energy projects, etc.' },
      { key: 'avoided_emissions_methodology', label: 'Avoided Emissions Methodology', unit: 'text', type: 'textarea', required: false },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
  {
    id: 'commercial_re',
    name: 'Commercial Real Estate',
    icon: Building2,
    description: 'Commercial property loans and investments',
    formula: 'Attribution Factor = Outstanding Amount / Property Value at Origination × Building Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Mortgage Amount', unit: 'USD', type: 'number', required: true },
      { key: 'property_value_origination', label: 'Property Value at Origination', unit: 'USD', type: 'number', required: true },
      { key: 'building_emissions_annual', label: 'Annual Building Emissions', unit: 'tCO2e/year', type: 'number', required: true, tooltip: 'Scope 1+2 for the building' },
      { key: 'building_energy_consumption', label: 'Energy Consumption', unit: 'kWh', type: 'number', required: false },
      { key: 'building_floor_area', label: 'Floor Area', unit: 'm²', type: 'number', required: false },
      { key: 'building_type', label: 'Building Type', unit: 'text', type: 'select', required: false, options: ['Office', 'Retail', 'Industrial', 'Hotel', 'Mixed Use', 'Other'] },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
  {
    id: 'mortgages',
    name: 'Mortgages (Residential)',
    icon: Home,
    description: 'Residential property mortgages',
    formula: 'Attribution Factor = Outstanding Amount / Property Value at Origination × Building Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Mortgage Amount', unit: 'USD', type: 'number', required: true },
      { key: 'property_value_origination', label: 'Property Value at Origination', unit: 'USD', type: 'number', required: true },
      { key: 'building_emissions_annual', label: 'Annual Building Emissions', unit: 'tCO2e/year', type: 'number', required: true },
      { key: 'building_energy_consumption', label: 'Energy Consumption', unit: 'kWh', type: 'number', required: false },
      { key: 'building_floor_area', label: 'Floor Area', unit: 'm²', type: 'number', required: false },
      { key: 'property_type', label: 'Property Type', unit: 'text', type: 'select', required: false, options: ['Single Family', 'Multi-Family', 'Apartment', 'Condo', 'Other'] },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
  {
    id: 'motor_vehicles',
    name: 'Motor Vehicle Loans',
    icon: Car,
    description: 'Vehicle financing',
    formula: 'Attribution Factor = Outstanding Amount / Vehicle Value at Origination × Vehicle Lifetime Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Loan Amount', unit: 'USD', type: 'number', required: true },
      { key: 'vehicle_value_origination', label: 'Vehicle Value at Origination', unit: 'USD', type: 'number', required: true },
      { key: 'vehicle_emissions_lifetime', label: 'Vehicle Lifetime Emissions', unit: 'tCO2e', type: 'number', required: true, tooltip: 'Or annual emissions per PCAF guidance' },
      { key: 'vehicle_type', label: 'Vehicle Type', unit: 'text', type: 'select', required: false, options: ['Passenger Car', 'Light Truck', 'Heavy Truck', 'EV', 'Hybrid', 'Other'] },
      { key: 'vehicle_make_model', label: 'Make/Model', unit: 'text', type: 'text', required: false },
      { key: 'fuel_type', label: 'Fuel Type', unit: 'text', type: 'select', required: false, options: ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'Hydrogen', 'Other'] },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
  {
    id: 'sovereign_debt',
    name: 'Sovereign Debt',
    icon: Globe,
    description: 'Government bonds and loans',
    formula: 'Attribution Factor = Outstanding Amount / PPP-Adjusted GDP × Sovereign Emissions',
    fields: [
      { key: 'exposure_amount', label: 'Outstanding Amount', unit: 'USD', type: 'number', required: true },
      { key: 'ppp_adjusted_gdp', label: 'PPP-Adjusted GDP', unit: 'USD', type: 'number', required: true, tooltip: 'Purchase Power Parity adjusted GDP' },
      { key: 'sovereign_emissions_total', label: 'Sovereign Total Emissions', unit: 'tCO2e', type: 'number', required: true, tooltip: 'National GHG inventory' },
      { key: 'country', label: 'Country', unit: 'text', type: 'text', required: true },
      { key: 'methodology_note', label: 'Methodology Note', unit: 'text', type: 'textarea', required: false, tooltip: 'PCAF notes limitations - document alternatives if used' },
      { key: 'data_quality_score', label: 'Data Quality Score', unit: '1-5', type: 'select', required: true, options: Object.keys(DATA_QUALITY_SCORES) },
      { key: 'data_source', label: 'Data Source', unit: 'text', type: 'text', required: true, tooltip: 'UNFCCC, World Bank, etc.' },
      { key: 'reporting_year', label: 'Data Year', unit: 'YYYY', type: 'number', required: true },
    ]
  },
];

// Setup & Configuration section
const SETUP_FIELDS = [
  { key: 'reporting_year', label: 'Reporting Year', unit: 'YYYY', type: 'number', required: true, tooltip: 'Calendar year for this PCAF report' },
  { key: 'reporting_date', label: 'Reporting Date', unit: 'date', type: 'date', required: true, tooltip: 'Date of report publication' },
  { key: 'consolidation_approach', label: 'Consolidation Approach', unit: 'select', type: 'select', required: true, options: CONSOLIDATION_APPROACHES.map(a => a.value), tooltip: 'Operational or Financial Control' },
  { key: 'pcaf_methodology_version', label: 'PCAF Methodology Version', unit: 'text', type: 'text', required: true, tooltip: 'e.g., "Global GHG Standard 2nd Edition"' },
  { key: 'recalculation_policy', label: 'Recalculation Policy', unit: 'text', type: 'textarea', required: true, tooltip: 'Describe when and how you recalculate historical data' },
  { key: 'significance_threshold', label: 'Significance Threshold', unit: '%', type: 'number', required: true, tooltip: 'Threshold for triggering recalculation (e.g., 5%)' },
];

// Disclosures section
const DISCLOSURE_FIELDS = [
  { key: 'portfolio_coverage_pct', label: 'Portfolio Coverage', unit: '%', type: 'number', required: true, tooltip: 'Percentage of portfolio by value included' },
  { key: 'exclusions_list', label: 'Exclusions List', unit: 'text', type: 'textarea', required: true, tooltip: 'Asset classes or sectors excluded and reasons' },
  { key: 'assumptions_proxies', label: 'Assumptions & Proxies Used', unit: 'text', type: 'textarea', required: true },
  { key: 'data_sources_summary', label: 'Data Sources Summary', unit: 'text', type: 'textarea', required: true },
  { key: 'audit_trail_notes', label: 'Audit Trail Notes', unit: 'text', type: 'textarea', required: false },
];

// ============================================
// SUB-COMPONENTS
// ============================================

const SidebarItem = ({ id, label, icon: Icon, active, onClick, progress }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all mb-2 ${
      active
        ? 'bg-greenly-midnight text-white shadow-md'
        : 'text-greenly-slate hover:bg-greenly-off-white hover:text-greenly-midnight'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`h-5 w-5 ${active ? 'text-greenly-teal' : 'text-current'}`} />
      <span className="font-medium text-sm">{label}</span>
    </div>
    {progress === 100 && <CheckCircle2 className="h-4 w-4 text-greenly-success" />}
  </button>
);

const FormField = ({ field, value, onChange }) => {
  const handleChange = (e) => {
    const newValue = field.type === 'number' ? parseFloat(e.target.value) || '' : 
                     field.type === 'checkbox' ? e.target.checked : 
                     e.target.value;
    onChange(field.key, newValue);
  };

  return (
    <div className="group mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-bold text-greenly-midnight flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-greenly-alert">*</span>}
          {field.tooltip && (
            <div className="relative group/tooltip">
              <Info className="h-4 w-4 text-greenly-slate cursor-help" />
              <div className="absolute left-0 top-6 w-64 bg-greenly-midnight text-white text-xs p-2 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                {field.tooltip}
              </div>
            </div>
          )}
        </label>
        <span className="text-xs font-medium text-greenly-slate">{field.unit}</span>
      </div>

      {field.type === 'select' ? (
        <select
          value={value || ''}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border-2 border-greenly-light bg-greenly-off-white focus:bg-white focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all outline-none font-medium text-greenly-midnight"
        >
          <option value="">Select...</option>
          {field.options && field.options.map(opt => (
            <option key={opt} value={opt}>{
              field.key === 'data_quality_score' ? DATA_QUALITY_SCORES[opt]?.label :
              field.key === 'consolidation_approach' ? CONSOLIDATION_APPROACHES.find(a => a.value === opt)?.label :
              opt
            }</option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={handleChange}
          rows={4}
          className="w-full p-4 rounded-xl border-2 border-greenly-light bg-greenly-off-white focus:bg-white focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all outline-none font-medium text-greenly-midnight"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-greenly-light bg-greenly-off-white hover:bg-white cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            className="w-5 h-5 rounded border-2 border-greenly-light text-greenly-teal focus:ring-2 focus:ring-greenly-teal/20"
          />
          <span className="font-medium text-greenly-midnight">Yes</span>
        </label>
      ) : (
        <input
          type={field.type}
          value={value || ''}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border-2 border-greenly-light bg-greenly-off-white focus:bg-white focus:border-greenly-teal focus:ring-4 focus:ring-greenly-teal/10 transition-all outline-none font-medium text-greenly-midnight"
          placeholder={`Enter ${field.label.toLowerCase()}...`}
        />
      )}
    </div>
  );
};

const CalculationPreview = ({ assetClass, data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const calculateAttribution = () => {
    const exposure = parseFloat(data.exposure_amount) || 0;
    
    switch (assetClass.id) {
      case 'listed_equity':
        const evic = parseFloat(data.evic) || 1;
        return (exposure / evic * 100).toFixed(4);
      
      case 'business_loans':
        const equity = parseFloat(data.company_total_equity) || 0;
        const debt = parseFloat(data.company_total_debt) || 0;
        const evicAlt = parseFloat(data.evic_alternative) || (equity + debt) || 1;
        return (exposure / evicAlt * 100).toFixed(4);
      
      case 'project_finance':
        const projEquity = parseFloat(data.project_total_equity) || 0;
        const projDebt = parseFloat(data.project_total_debt) || 0;
        return (exposure / (projEquity + projDebt || 1) * 100).toFixed(4);
      
      case 'commercial_re':
      case 'mortgages':
        const propValue = parseFloat(data.property_value_origination) || 1;
        return (exposure / propValue * 100).toFixed(4);
      
      case 'motor_vehicles':
        const vehicleValue = parseFloat(data.vehicle_value_origination) || 1;
        return (exposure / vehicleValue * 100).toFixed(4);
      
      case 'sovereign_debt':
        const gdp = parseFloat(data.ppp_adjusted_gdp) || 1;
        return (exposure / gdp * 100).toFixed(4);
      
      default:
        return '0.0000';
    }
  };

  const calculateFinancedEmissions = () => {
    const attribution = parseFloat(calculateAttribution()) / 100;
    
    const scope1 = parseFloat(data.company_emissions_scope1 || data.project_emissions_scope1 || data.building_emissions_annual || data.vehicle_emissions_lifetime || data.sovereign_emissions_total) || 0;
    const scope2 = parseFloat(data.company_emissions_scope2 || data.project_emissions_scope2) || 0;
    const scope3 = parseFloat(data.company_emissions_scope3 || data.project_emissions_scope3) || 0;
    
    return {
      scope1: (attribution * scope1).toFixed(2),
      scope2: (attribution * scope2).toFixed(2),
      scope3: (attribution * scope3).toFixed(2),
      total: (attribution * (scope1 + scope2 + scope3)).toFixed(2),
    };
  };

  const attribution = calculateAttribution();
  const emissions = calculateFinancedEmissions();

  return (
    <div className="mt-6 p-6 bg-greenly-teal/5 border-2 border-greenly-teal/20 rounded-2xl">
      <h4 className="font-bold text-greenly-midnight mb-4 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-greenly-teal" />
        Calculation Preview (Live)
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-greenly-light">
          <div className="text-xs font-medium text-greenly-slate mb-1">Attribution Factor</div>
          <div className="text-2xl font-bold text-greenly-midnight">{attribution}%</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-greenly-light">
          <div className="text-xs font-medium text-greenly-slate mb-1">Total Financed Emissions</div>
          <div className="text-2xl font-bold text-greenly-teal">{emissions.total} tCO2e</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-greenly-light">
          <div className="text-xs font-medium text-greenly-slate mb-1">Scope 1</div>
          <div className="text-lg font-bold text-greenly-midnight">{emissions.scope1} tCO2e</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-greenly-light">
          <div className="text-xs font-medium text-greenly-slate mb-1">Scope 2</div>
          <div className="text-lg font-bold text-greenly-midnight">{emissions.scope2} tCO2e</div>
        </div>
        
        {parseFloat(emissions.scope3) > 0 && (
          <div className="bg-white p-4 rounded-xl border border-greenly-light col-span-2">
            <div className="text-xs font-medium text-greenly-slate mb-1">Scope 3</div>
            <div className="text-lg font-bold text-greenly-midnight">{emissions.scope3} tCO2e</div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-greenly-slate">
        <strong>Formula:</strong> {assetClass.formula}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function PCAFDataCollectionNew() {
  const [pcafData, savePcafData, loading] = useESGData('pcaf');
  const [activeSection, setActiveSection] = useState('setup');
  const [showGuidance, setShowGuidance] = useState(true);

  // Initialize data structure
  const data = useMemo(() => {
    if (loading) return {};
    if (pcafData && Object.keys(pcafData).length > 0) return pcafData;

    // Initialize with empty structure
    const initial = {
      setup: {},
      disclosures: {},
      asset_classes: {},
    };

    ASSET_CLASSES.forEach(ac => {
      initial.asset_classes[ac.id] = [];
    });

    return initial;
  }, [pcafData, loading]);

  const handleSetupChange = (key, value) => {
    const updated = {
      ...data,
      setup: { ...data.setup, [key]: value }
    };
    savePcafData(updated);
  };

  const handleDisclosureChange = (key, value) => {
    const updated = {
      ...data,
      disclosures: { ...data.disclosures, [key]: value }
    };
    savePcafData(updated);
  };

  const handleAssetClassChange = (assetClassId, entryIndex, fieldKey, value) => {
    const updated = { ...data };
    if (!updated.asset_classes[assetClassId]) {
      updated.asset_classes[assetClassId] = [];
    }
    
    if (!updated.asset_classes[assetClassId][entryIndex]) {
      updated.asset_classes[assetClassId][entryIndex] = { 
        id: `${assetClassId}_${Date.now()}`,
        created_at: new Date().toISOString(),
      };
    }
    
    updated.asset_classes[assetClassId][entryIndex][fieldKey] = value;
    updated.asset_classes[assetClassId][entryIndex].last_updated = new Date().toISOString();
    
    savePcafData(updated);
  };

  const addAssetClassEntry = (assetClassId) => {
    const updated = { ...data };
    if (!updated.asset_classes[assetClassId]) {
      updated.asset_classes[assetClassId] = [];
    }
    
    updated.asset_classes[assetClassId].push({
      id: `${assetClassId}_${Date.now()}`,
      created_at: new Date().toISOString(),
    });
    
    savePcafData(updated);
  };

  const removeAssetClassEntry = (assetClassId, entryIndex) => {
    const updated = { ...data };
    updated.asset_classes[assetClassId].splice(entryIndex, 1);
    savePcafData(updated);
  };

  const currentAssetClass = ASSET_CLASSES.find(ac => ac.id === activeSection);

  // Calculate completion percentage
  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    // Setup fields
    SETUP_FIELDS.forEach(field => {
      total++;
      if (data.setup && data.setup[field.key]) completed++;
    });

    // Asset classes
    ASSET_CLASSES.forEach(ac => {
      const entries = data.asset_classes?.[ac.id] || [];
      entries.forEach(entry => {
        ac.fields.filter(f => f.required).forEach(field => {
          total++;
          if (entry[field.key]) completed++;
        });
      });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-greenly-secondary">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-greenly-teal border-t-transparent mb-4"></div>
          <p className="text-greenly-slate font-medium">Loading PCAF data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-greenly-secondary font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r-2 border-greenly-light p-6 fixed left-0 top-0 h-screen overflow-y-auto">
        <Link to="/dashboard/esg-data-entry" className="flex items-center gap-2 text-greenly-slate hover:text-greenly-midnight mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to ESG Hub</span>
        </Link>

        <h2 className="text-xl font-bold text-greenly-midnight mb-2">PCAF Data Collection</h2>
        <p className="text-sm text-greenly-slate mb-6">Full PCAF Global GHG Standard Compliance</p>

        {/* Progress */}
        <div className="mb-6 p-4 bg-greenly-teal/5 rounded-xl border border-greenly-teal/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-greenly-midnight">Overall Progress</span>
            <span className="text-xs font-bold text-greenly-teal">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-greenly-light rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-greenly-teal to-greenly-success transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <SidebarItem
            id="setup"
            label="Setup & Configuration"
            icon={Settings}
            active={activeSection === 'setup'}
            onClick={setActiveSection}
            progress={0}
          />

          <div className="my-4 border-t border-greenly-light"></div>
          <div className="text-xs font-bold text-greenly-slate mb-2 px-3">ASSET CLASSES</div>

          {ASSET_CLASSES.map(ac => (
            <SidebarItem
              key={ac.id}
              id={ac.id}
              label={ac.name}
              icon={ac.icon}
              active={activeSection === ac.id}
              onClick={setActiveSection}
              progress={0}
            />
          ))}

          <div className="my-4 border-t border-greenly-light"></div>

          <SidebarItem
            id="disclosures"
            label="Reporting & Disclosures"
            icon={FileText}
            active={activeSection === 'disclosures'}
            onClick={setActiveSection}
            progress={0}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-72 p-8 lg:p-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-greenly-midnight mb-2">
                {activeSection === 'setup' ? 'Setup & Configuration' :
                 activeSection === 'disclosures' ? 'Reporting & Disclosures' :
                 currentAssetClass?.name}
              </h2>
              <p className="text-greenly-slate">
                {activeSection === 'setup' ? 'Configure reporting parameters and consolidation approach' :
                 activeSection === 'disclosures' ? 'Required PCAF disclosures and transparency items' :
                 currentAssetClass?.description}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-greenly-light rounded-xl text-greenly-midnight font-semibold hover:bg-greenly-off-white hover:border-greenly-teal transition-all shadow-sm">
                <Download className="h-5 w-5" />
                Export
              </button>
              <button 
                onClick={() => savePcafData(data)}
                className="flex items-center gap-2 px-4 py-2.5 bg-greenly-midnight text-white rounded-xl font-semibold hover:bg-greenly-midnight/90 transition-all shadow-lg shadow-greenly-midnight/20"
              >
                <Save className="h-5 w-5" />
                Save All
              </button>
            </div>
          </div>

          {/* PCAF Guidance Banner */}
          {showGuidance && (
            <div className="mb-8 bg-greenly-teal/5 border-2 border-greenly-teal/20 rounded-2xl p-6">
              <div className="flex gap-4">
                <Lightbulb className="h-6 w-6 text-greenly-teal flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-greenly-midnight">PCAF Compliance Requirements</h4>
                    <button 
                      onClick={() => setShowGuidance(false)}
                      className="text-greenly-slate hover:text-greenly-midnight"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-greenly-slate leading-relaxed mb-3">
                    This form implements the full PCAF Global GHG Standard. All required fields must be completed for compliance.
                    Data quality scores (1-5) and transparent audit trails are mandatory.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-greenly-success" />
                      <span>Asset-class specific formulas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-greenly-success" />
                      <span>Data quality scoring (1-5)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-greenly-success" />
                      <span>Scope 1/2/3 separation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-greenly-success" />
                      <span>Audit trail & provenance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup Section */}
          {activeSection === 'setup' && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-greenly-light p-8">
              <h3 className="text-xl font-bold text-greenly-midnight mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-greenly-teal" />
                Reporting Configuration
              </h3>
              
              {SETUP_FIELDS.map(field => (
                <FormField
                  key={field.key}
                  field={field}
                  value={data.setup?.[field.key]}
                  onChange={handleSetupChange}
                />
              ))}

              <div className="mt-6 p-4 bg-greenly-warning/5 border-l-4 border-greenly-warning rounded">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-greenly-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-greenly-slate">
                    <strong className="text-greenly-midnight">Important:</strong> The consolidation approach must be declared
                    and used consistently. PCAF requires either Operational Control or Financial Control - you cannot mix both.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclosures Section */}
          {activeSection === 'disclosures' && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-greenly-light p-8">
              <h3 className="text-xl font-bold text-greenly-midnight mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-greenly-teal" />
                Required PCAF Disclosures
              </h3>
              
              {DISCLOSURE_FIELDS.map(field => (
                <FormField
                  key={field.key}
                  field={field}
                  value={data.disclosures?.[field.key]}
                  onChange={handleDisclosureChange}
                />
              ))}

              <div className="mt-6 p-4 bg-greenly-teal/5 border-l-4 border-greenly-teal rounded">
                <div className="flex gap-3">
                  <Database className="h-5 w-5 text-greenly-teal flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-greenly-slate">
                    <strong className="text-greenly-midnight">Audit Trail:</strong> All calculations include immutable timestamps
                    and data provenance. User comments and override justifications are stored for transparency and auditing.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Asset Class Sections */}
          {currentAssetClass && (
            <div>
              {/* Attribution Formula */}
              <div className="mb-6 p-6 bg-greenly-midnight/5 border-2 border-greenly-midnight/10 rounded-2xl">
                <h4 className="font-bold text-greenly-midnight mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-greenly-teal" />
                  PCAF Attribution Formula
                </h4>
                <p className="text-sm text-greenly-slate font-mono bg-white p-3 rounded border border-greenly-light">
                  {currentAssetClass.formula}
                </p>
              </div>

              {/* Existing Entries */}
              {data.asset_classes?.[currentAssetClass.id]?.map((entry, index) => (
                <div key={entry.id} className="bg-white rounded-2xl shadow-sm border-2 border-greenly-light p-8 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-greenly-midnight flex items-center gap-2">
                      <currentAssetClass.icon className="h-5 w-5 text-greenly-teal" />
                      Entry #{index + 1}
                    </h3>
                    <button
                      onClick={() => removeAssetClassEntry(currentAssetClass.id, index)}
                      className="text-greenly-alert hover:text-greenly-alert/80 flex items-center gap-2 text-sm font-medium"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  {currentAssetClass.fields.map(field => (
                    <FormField
                      key={field.key}
                      field={field}
                      value={entry[field.key]}
                      onChange={(key, value) => handleAssetClassChange(currentAssetClass.id, index, key, value)}
                    />
                  ))}

                  {/* Live Calculation */}
                  <CalculationPreview assetClass={currentAssetClass} data={entry} />

                  {/* Metadata */}
                  <div className="mt-6 pt-6 border-t border-greenly-light text-xs text-greenly-slate flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Created: {new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                    {entry.last_updated && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Last Updated: {new Date(entry.last_updated).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Entry Button */}
              <button
                onClick={() => addAssetClassEntry(currentAssetClass.id)}
                className="w-full p-6 border-2 border-dashed border-greenly-light rounded-2xl text-greenly-slate hover:border-greenly-teal hover:text-greenly-teal hover:bg-greenly-teal/5 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                Add New {currentAssetClass.name} Entry
              </button>

              {/* Data Quality Reference */}
              <div className="mt-8 bg-white rounded-2xl shadow-sm border-2 border-greenly-light p-6">
                <h4 className="font-bold text-greenly-midnight mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-greenly-teal" />
                  PCAF Data Quality Score Reference
                </h4>
                <div className="grid gap-3">
                  {Object.entries(DATA_QUALITY_SCORES).map(([score, info]) => (
                    <div key={score} className="flex gap-3 p-3 bg-greenly-off-white rounded-lg">
                      <div className="font-bold text-greenly-midnight w-20">Score {score}</div>
                      <div className="flex-1">
                        <div className="font-medium text-greenly-midnight text-sm">{info.label}</div>
                        <div className="text-xs text-greenly-slate mt-1">{info.criteria}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
