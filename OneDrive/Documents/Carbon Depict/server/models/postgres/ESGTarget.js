const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * ESGTarget Model (PostgreSQL)
 * Stores ESG goals, targets, and progress tracking
 */
const ESGTarget = sequelize.define(
  'ESGTarget',
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
    // Target identification
    framework: {
      type: DataTypes.ENUM('GRI', 'SBTi', 'TCFD', 'CSRD', 'SDG', 'CDP', 'ECOVADIS', 'INTERNAL'),
      allowNull: false,
    },
    pillar: {
      type: DataTypes.ENUM('Environmental', 'Social', 'Governance'),
      allowNull: false,
    },
    targetName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Reduce Scope 1+2 emissions by 50%, Achieve gender parity, etc.',
    },
    targetType: {
      type: DataTypes.ENUM(
        'absolute',
        'intensity',
        'percentage',
        'qualitative',
        'binary',
        'sbti-near-term',
        'sbti-net-zero'
      ),
      allowNull: false,
    },
    // Target specifics
    relatedMetricCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Links to ESGMetric.metricCode',
    },
    relatedSDG: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      comment: 'SDG numbers [7, 13] for SDG 7 and 13',
    },
    // Baseline
    baselineYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '2020, 2023, etc.',
    },
    baselineValue: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
    },
    baselineUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Target values
    targetYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '2030, 2050, etc.',
    },
    targetValue: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
    },
    targetUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reductionPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: '50.00 for 50% reduction',
    },
    // SBTi-specific
    sbtiStatus: {
      type: DataTypes.ENUM(
        'not-submitted',
        'committed',
        'targets-set',
        'approved',
        'rejected',
        'removed'
      ),
      allowNull: true,
    },
    sbtiValidationDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    sbtiAmbition: {
      type: DataTypes.ENUM('1.5C', 'WB2C', 'net-zero'),
      allowNull: true,
      comment: '1.5°C, Well-below 2°C, Net-Zero',
    },
    // Progress tracking
    currentValue: {
      type: DataTypes.DECIMAL(20, 4),
      allowNull: true,
      comment: 'Latest reported value',
    },
    progressPercentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Percentage towards target (0-100)',
    },
    onTrack: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Is target on track to be achieved',
    },
    // Milestones
    milestones: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of {year, targetValue, achieved} objects',
    },
    // Accountability
    responsiblePerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    boardApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approvalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Status
    status: {
      type: DataTypes.ENUM('draft', 'active', 'achieved', 'missed', 'revised', 'retired'),
      defaultValue: 'draft',
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    publicCommitmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Details
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    methodology: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'How progress is measured',
    },
    actions: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Key actions to achieve target',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  },
  {
    tableName: 'esg_targets',
    timestamps: true,
    indexes: [
      { fields: ['companyId'] },
      { fields: ['framework', 'pillar'] },
      { fields: ['targetYear'] },
      { fields: ['status'] },
      { fields: ['sbtiStatus'] },
      { fields: ['relatedSDG'] },
    ],
  }
)

module.exports = ESGTarget
