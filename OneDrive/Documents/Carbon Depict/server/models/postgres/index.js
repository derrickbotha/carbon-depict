const User = require('./User')
const Company = require('./Company')
const Emission = require('./Emission')
const Report = require('./Report')
const ESGMetric = require('./ESGMetric')
const ESGTarget = require('./ESGTarget')
const ESGReport = require('./ESGReport')
const MaterialityAssessment = require('./MaterialityAssessment')

// Define associations

// Company has many Users
Company.hasMany(User, {
  foreignKey: 'companyId',
  as: 'users',
})
User.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// Company has many Emissions
Company.hasMany(Emission, {
  foreignKey: 'companyId',
  as: 'emissions',
})
Emission.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// User has many Emissions
User.hasMany(Emission, {
  foreignKey: 'userId',
  as: 'emissions',
})
Emission.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

// Company has many Reports
Company.hasMany(Report, {
  foreignKey: 'companyId',
  as: 'reports',
})
Report.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// User has many Reports
User.hasMany(Report, {
  foreignKey: 'userId',
  as: 'reports',
})
Report.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

// ESG Associations

// Company has many ESG Metrics
Company.hasMany(ESGMetric, {
  foreignKey: 'companyId',
  as: 'esgMetrics',
})
ESGMetric.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// User has many ESG Metrics
User.hasMany(ESGMetric, {
  foreignKey: 'userId',
  as: 'esgMetrics',
})
ESGMetric.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

// Company has many ESG Targets
Company.hasMany(ESGTarget, {
  foreignKey: 'companyId',
  as: 'esgTargets',
})
ESGTarget.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// Company has many ESG Reports
Company.hasMany(ESGReport, {
  foreignKey: 'companyId',
  as: 'esgReports',
})
ESGReport.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

// User has many ESG Reports
User.hasMany(ESGReport, {
  foreignKey: 'userId',
  as: 'esgReports',
})
ESGReport.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
})

// Company has many Materiality Assessments
Company.hasMany(MaterialityAssessment, {
  foreignKey: 'companyId',
  as: 'materialityAssessments',
})
MaterialityAssessment.belongsTo(Company, {
  foreignKey: 'companyId',
  as: 'company',
})

module.exports = {
  User,
  Company,
  Emission,
  Report,
  ESGMetric,
  ESGTarget,
  ESGReport,
  MaterialityAssessment,
}
