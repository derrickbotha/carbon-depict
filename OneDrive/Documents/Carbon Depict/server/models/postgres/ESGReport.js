const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * ESGReport Model (PostgreSQL)
 * Tracks ESG reports generated for various frameworks
 */
const ESGReport = sequelize.define(
  'ESGReport',
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
    // Report identification
    framework: {
      type: DataTypes.ENUM(
        'GRI',
        'TCFD',
        'CSRD',
        'CDP_CLIMATE',
        'CDP_WATER',
        'CDP_FORESTS',
        'ECOVADIS',
        'SBTI',
        'SDG',
        'INTEGRATED',
        'EU_TAXONOMY',
        'VSME',
        'MACF'
      ),
      allowNull: false,
    },
    reportType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Sustainability Report, Climate Disclosure, Annual Report, etc.',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Reporting period
    reportingYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reportingPeriod: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'FY2024, Jan-Dec 2024, Q1 2025',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Report content
    language: {
      type: DataTypes.STRING,
      defaultValue: 'en',
      comment: 'ISO 639-1 language code',
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    wordCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // GRI-specific
    griVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'GRI Standards 2021',
    },
    griContentIndex: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'GRI content index mapping',
    },
    // Framework compliance
    frameworkVersion: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Framework version used (CSRD 2023, TCFD 2017, etc.)',
    },
    complianceLevel: {
      type: DataTypes.ENUM('full', 'partial', 'referenced'),
      allowNull: true,
    },
    materiality: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Material topics identified',
    },
    // Assurance
    externalAssurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assuranceProvider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assuranceLevel: {
      type: DataTypes.ENUM('none', 'limited', 'reasonable'),
      defaultValue: 'none',
    },
    assuranceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    assuranceOpinion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Files
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileFormat: {
      type: DataTypes.ENUM('pdf', 'docx', 'html', 'xml', 'xbrl', 'ixbrl'),
      defaultValue: 'pdf',
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'File size in bytes',
    },
    downloadUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Publication
    status: {
      type: DataTypes.ENUM('draft', 'review', 'approved', 'published', 'archived'),
      defaultValue: 'draft',
    },
    publishDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    publicUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Approval workflow
    reviewedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Stakeholder distribution
    distributionList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Emails or stakeholder groups',
    },
    distributionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Metrics summary
    keyMetrics: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Summary of key performance indicators',
    },
    // Metadata
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    tableName: 'esg_reports',
    timestamps: true,
    indexes: [
      { fields: ['companyId', 'reportingYear'] },
      { fields: ['framework'] },
      { fields: ['status'] },
      { fields: ['publishDate'] },
      { fields: ['isPublic'] },
    ],
  }
)

module.exports = ESGReport
