const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * MaterialityAssessment Model (PostgreSQL)
 * Stores double materiality assessments for CSRD and other frameworks
 */
const MaterialityAssessment = sequelize.define(
  'MaterialityAssessment',
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
    // Assessment details
    assessmentYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    framework: {
      type: DataTypes.ENUM('GRI', 'CSRD', 'TCFD', 'INTEGRATED'),
      allowNull: false,
    },
    materialityType: {
      type: DataTypes.ENUM('single', 'double'),
      allowNull: false,
      comment: 'Single materiality (GRI) or double materiality (CSRD)',
    },
    // Topic identification
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Climate change, Water, Biodiversity, Labor rights, etc.',
    },
    topicCode: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'ESRS E1, GRI 305, etc.',
    },
    pillar: {
      type: DataTypes.ENUM('Environmental', 'Social', 'Governance'),
      allowNull: false,
    },
    // Impact materiality (inside-out)
    impactMateriality: {
      type: DataTypes.ENUM('not-material', 'low', 'medium', 'high', 'critical'),
      allowNull: false,
      comment: "Organization's impact on environment/society",
    },
    impactScale: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Scale of impact (1-5)',
    },
    impactScope: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Scope/extent of impact (1-5)',
    },
    impactSeverity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Severity of impact (1-5)',
    },
    impactLikelihood: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Likelihood of impact (1-5)',
    },
    impactRemediation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Is impact irremediable?',
    },
    // Financial materiality (outside-in)
    financialMateriality: {
      type: DataTypes.ENUM('not-material', 'low', 'medium', 'high', 'critical'),
      allowNull: true,
      comment: "Environment/society's impact on organization's finances",
    },
    financialMagnitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Financial magnitude (1-5)',
    },
    financialLikelihood: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Likelihood of financial impact (1-5)',
    },
    financialTimeHorizon: {
      type: DataTypes.ENUM('short-term', 'medium-term', 'long-term'),
      allowNull: true,
      comment: '<3 years, 3-7 years, >7 years',
    },
    // Overall determination
    isMaterial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Final materiality determination',
    },
    materialityRationale: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Value chain
    valueChainStage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: '["upstream", "operations", "downstream"]',
    },
    affectedStakeholders: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: '["employees", "communities", "suppliers", "customers"]',
    },
    geographicRelevance: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Relevant countries/regions',
    },
    // Stakeholder input
    stakeholderInput: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Was stakeholder consultation conducted?',
    },
    stakeholderGroups: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    consultationMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Survey, interviews, workshops, etc.',
    },
    // Actions
    policiesInPlace: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    actionsPlanned: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metricsTracked: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Related metric codes',
    },
    // Assessment metadata
    assessmentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Methodology used for assessment',
    },
    assessors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Names or roles of assessors',
    },
    assessmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nextReviewDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    // Status
    status: {
      type: DataTypes.ENUM('draft', 'in-review', 'approved', 'published'),
      defaultValue: 'draft',
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
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
    tableName: 'materiality_assessments',
    timestamps: true,
    indexes: [
      { fields: ['companyId', 'assessmentYear'] },
      { fields: ['framework'] },
      { fields: ['topic', 'pillar'] },
      { fields: ['isMaterial'] },
      { fields: ['impactMateriality', 'financialMateriality'] },
    ],
  }
)

module.exports = MaterialityAssessment
