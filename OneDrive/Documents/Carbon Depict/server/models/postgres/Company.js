const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/database')

/**
 * Company Model (PostgreSQL)
 * Stores organization/company information
 */
const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.ENUM(
        'agriculture',
        'energy',
        'fleet',
        'food',
        'manufacturing',
        'education',
        'other'
      ),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'uk',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM('small', 'medium', 'large', 'enterprise'),
      defaultValue: 'small',
    },
    subscription: {
      type: DataTypes.ENUM('free', 'professional', 'enterprise'),
      defaultValue: 'free',
    },
    subscriptionValidUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        dateFormat: 'yyyy-mm-dd',
        unitSystem: 'metric',
        notifications: {
          email: true,
          monthlyReports: true,
          factorUpdates: false,
        },
      },
    },
  },
  {
    tableName: 'companies',
    timestamps: true,
  }
)

module.exports = Company
