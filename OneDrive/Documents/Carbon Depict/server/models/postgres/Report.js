const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * Report Model (PostgreSQL)
 * Stores generated emission reports
 */
const Report = sequelize.define(
  'Report',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Companies',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'annual', 'custom'),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // Summary data
    totalEmissions: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
    },
    scope1: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    scope2: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    scope3: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      defaultValue: 0,
    },
    // Breakdown by category (stored as JSON)
    categoryBreakdown: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    // Report metadata
    format: {
      type: DataTypes.ENUM('pdf', 'csv', 'json'),
      defaultValue: 'pdf',
    },
    status: {
      type: DataTypes.ENUM('generating', 'ready', 'archived', 'failed'),
      defaultValue: 'ready',
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    methodology: {
      type: DataTypes.TEXT,
      defaultValue: 'WRI GHG Protocol with DEFRA 2025 emission factors',
    },
  },
  {
    tableName: 'reports',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['companyId'] },
      { fields: ['startDate', 'endDate'] },
      { fields: ['status'] },
    ],
  }
)

module.exports = Report
