#!/usr/bin/env node

const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const GHGEmission = require('./models/mongodb/GHGEmission.js')
const ESGMetric = require('./models/mongodb/ESGMetric.js')
const Company = require('./models/mongodb/Company.js')

const createSampleData = async () => {
  try {
    console.log('🚀 Creating Sample Data for Date Filtering Test')
    console.log('==============================================')

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    // Find test company
    const testCompany = await Company.findOne({ name: 'CarbonDepict Test Corp' })
    if (!testCompany) {
      console.log('❌ Test company not found. Please run create-test-user.cjs first.')
      return
    }

    console.log('✅ Found test company:', testCompany.name)

    // Create sample emissions data with different timestamps
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const lastQuarter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    const sampleEmissions = [
      {
        companyId: testCompany._id,
        scope: 'scope1',
        activityType: 'Natural Gas Combustion',
        activityValue: 1000,
        activityUnit: 'm3',
        emissionFactor: 0.2,
        co2e: 200,
        recordedAt: now,
        reportingPeriod: '2024-Q4'
      },
      {
        companyId: testCompany._id,
        scope: 'scope1',
        activityType: 'Diesel Fuel',
        activityValue: 500,
        activityUnit: 'liters',
        emissionFactor: 2.7,
        co2e: 1350,
        recordedAt: lastWeek,
        reportingPeriod: '2024-Q4'
      },
      {
        companyId: testCompany._id,
        scope: 'scope2',
        activityType: 'Electricity Consumption',
        activityValue: 2000,
        activityUnit: 'kWh',
        emissionFactor: 0.4,
        co2e: 800,
        recordedAt: lastMonth,
        reportingPeriod: '2024-Q3'
      },
      {
        companyId: testCompany._id,
        scope: 'scope3',
        activityType: 'Employee Commuting',
        activityValue: 100,
        activityUnit: 'km',
        emissionFactor: 0.1,
        co2e: 10,
        recordedAt: lastQuarter,
        reportingPeriod: '2024-Q2'
      }
    ]

    // Clear existing sample emissions
    await GHGEmission.deleteMany({ 
      companyId: testCompany._id,
      activityType: { $in: ['Natural Gas Combustion', 'Diesel Fuel', 'Electricity Consumption', 'Employee Commuting'] }
    })

    // Insert sample emissions
    for (const emission of sampleEmissions) {
      const newEmission = new GHGEmission(emission)
      await newEmission.save()
      console.log(`✅ Created emission: ${emission.activityType} (${emission.recordedAt.toLocaleDateString()})`)
    }

    // Create sample ESG metrics with different timestamps
    const sampleESGMetrics = [
      {
        companyId: testCompany._id,
        framework: 'GRI',
        pillar: 'environmental',
        topic: 'Emissions',
        metricName: 'Total GHG Emissions',
        value: 2500,
        unit: 'tCO2e',
        reportingPeriod: '2024',
        createdAt: now,
        status: 'published'
      },
      {
        companyId: testCompany._id,
        framework: 'TCFD',
        pillar: 'governance',
        topic: 'Climate Risk',
        metricName: 'Climate Risk Assessment',
        value: 85,
        unit: '%',
        reportingPeriod: '2024',
        createdAt: lastWeek,
        status: 'published'
      },
      {
        companyId: testCompany._id,
        framework: 'SBTi',
        pillar: 'environmental',
        topic: 'Targets',
        metricName: 'Science-Based Target',
        value: 30,
        unit: '%',
        reportingPeriod: '2024',
        createdAt: lastMonth,
        status: 'published'
      },
      {
        companyId: testCompany._id,
        framework: 'CSRD',
        pillar: 'social',
        topic: 'Workforce',
        metricName: 'Employee Satisfaction',
        value: 78,
        unit: '%',
        reportingPeriod: '2024',
        createdAt: lastQuarter,
        status: 'published'
      }
    ]

    // Clear existing sample ESG metrics
    await ESGMetric.deleteMany({ 
      companyId: testCompany._id,
      metricName: { $in: ['Total GHG Emissions', 'Climate Risk Assessment', 'Science-Based Target', 'Employee Satisfaction'] }
    })

    // Insert sample ESG metrics
    for (const metric of sampleESGMetrics) {
      const newMetric = new ESGMetric(metric)
      await newMetric.save()
      console.log(`✅ Created ESG metric: ${metric.metricName} (${metric.createdAt.toLocaleDateString()})`)
    }

    console.log('\n🎉 Sample Data Created Successfully!')
    console.log('=====================================')
    console.log('📊 Sample Emissions:')
    console.log('   - Natural Gas Combustion (Today)')
    console.log('   - Diesel Fuel (Last Week)')
    console.log('   - Electricity Consumption (Last Month)')
    console.log('   - Employee Commuting (Last Quarter)')
    console.log('\n📈 Sample ESG Metrics:')
    console.log('   - Total GHG Emissions (Today)')
    console.log('   - Climate Risk Assessment (Last Week)')
    console.log('   - Science-Based Target (Last Month)')
    console.log('   - Employee Satisfaction (Last Quarter)')
    console.log('\n✅ You can now test the date filtering functionality!')
    console.log('🌐 Test at: http://localhost:3502/dashboard')

  } catch (error) {
    console.error('❌ Error creating sample data:', error)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

createSampleData()
