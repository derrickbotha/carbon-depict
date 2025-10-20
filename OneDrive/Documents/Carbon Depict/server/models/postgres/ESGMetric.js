const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * ESGMetric Model (PostgreSQL)
 * Stores quantitative ESG metrics with time-series data
 */
const ESGMetric = sequelize.define(
  'ESGMetric',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    // Framework identification
    framework: {
      type: DataTypes.ENUM(
        'GRI',
        'SBTi',
        'TCFD',
        'CSRD',
        'SDG',
        'CDP',
        'ECOVADIS',
        'SASB',
        'VSME',
        'EU_TAXONOMY',
        'MACF'
      ),
      allowNull: false,
      comment: 'ESG framework this metric belongs to',
    },
    // Hierarchical categorization
    pillar: {
      type: DataTypes.ENUM('Environmental', 'Social', 'Governance'),
      allowNull: false,
      comment: 'ESG pillar',
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'GRI 305: Emissions, ESRS E1: Climate Change, etc.',
    },
    subTopic: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Sub-topic or disclosure number (e.g., 305-1, E1-6)',
    },
    metricName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Scope 1 GHG emissions, Female employees %, Board independence',
    },
    metricCode: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: 'Standardized code for metric (e.g., GRI-305-1, ESRS-E1-6)',
    },
    // Data values
    value: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: 'Quantitative value',
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'tCO2e, kWh, %, number, USD, etc.',
    },
    textValue: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Qualitative or narrative response',
    },
    dataType: {
      type: DataTypes.ENUM('numeric', 'percentage', 'currency', 'text', 'boolean', 'date'),
      defaultValue: 'numeric',
    },
    // Temporal information
    reportingPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'FY2024, Q1-2025, 2024-01, etc.',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Methodology and sources
    methodology: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Calculation methodology or data collection approach',
    },
    dataSource: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Internal systems, third-party, manual entry, estimated',
    },
    dataQuality: {
      type: DataTypes.ENUM('measured', 'calculated', 'estimated', 'proxy'),
      defaultValue: 'measured',
    },
    uncertaintyRange: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '±5%, ±10%, etc.',
    },
    // Verification and assurance
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assuranceLevel: {
      type: DataTypes.ENUM('none', 'limited', 'reasonable'),
      defaultValue: 'none',
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Auditor or verification body',
    },
    verificationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Boundaries and scope
    boundary: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Operational control, financial control, equity share, value chain',
    },
    geographicScope: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Global, EU, UK, specific countries',
    },
    facilities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'List of facilities/sites included',
    },
    // Materiality and impact
    isMaterial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Identified as material in double materiality assessment',
    },
    impactMateriality: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: true,
      comment: 'Impact on environment/society',
    },
    financialMateriality: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: true,
      comment: 'Financial impact on company',
    },
    // Compliance and status
    status: {
      type: DataTypes.ENUM('draft', 'submitted', 'published', 'archived'),
      defaultValue: 'draft',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Published in public report',
    },
    // Additional metadata
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'File paths to supporting documents',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Flexible storage for framework-specific data',
    },
  },
  {
    tableName: 'esg_metrics',
    timestamps: true,
    indexes: [
      { fields: ['companyId', 'reportingPeriod'] },
      { fields: ['framework', 'pillar'] },
      { fields: ['topic', 'subTopic'] },
      { fields: ['metricCode'] },
      { fields: ['startDate', 'endDate'] },
      { fields: ['isMaterial'] },
      { fields: ['status'] },
    ],
  }
)

module.exports = ESGMetric
