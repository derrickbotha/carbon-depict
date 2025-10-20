const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * Emission Model (PostgreSQL)
 * Stores individual emission entries with calculations
 */
const Emission = sequelize.define(
  'Emission',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Foreign keys
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
    // Emission categorization
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      // fuels, electricity, refrigerants, passenger-transport, freight-transport, water, waste, etc.
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true,
      // diesel, petrol, natural-gas, van-class-1, etc.
    },
    scope: {
      type: DataTypes.ENUM('Scope 1', 'Scope 2', 'Scope 3'),
      allowNull: false,
    },
    // Activity data
    activityData: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      // Quantity: litres, kWh, km, etc.
    },
    activityUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      // litres, kWh, km, kg, m³, etc.
    },
    // Calculation results
    emissionFactor: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false,
      // kgCO2e per unit
    },
    emissionFactorUnit: {
      type: DataTypes.STRING,
      allowNull: false,
      // kgCO2e/litre, kgCO2e/kWh, etc.
    },
    calculatedEmissions: {
      type: DataTypes.DECIMAL(15, 4),
      allowNull: false,
      // Total emissions in kgCO2e
    },
    emissionsUnit: {
      type: DataTypes.STRING,
      defaultValue: 'kgCO2e',
    },
    // Metadata
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // Additional data (flexible JSON field)
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
      // Store: vehicle model, trips, biofuel blend, etc.
    },
    // Source information
    source: {
      type: DataTypes.STRING,
      defaultValue: 'manual',
      // manual, excel-import, api
    },
    // Verification status
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'emissions',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['companyId'] },
      { fields: ['date'] },
      { fields: ['category'] },
      { fields: ['scope'] },
    ],
  }
)

module.exports = Emission
