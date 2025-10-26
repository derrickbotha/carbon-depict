#!/usr/bin/env node

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const User = require('./models/mongodb/User.js')
const Company = require('./models/mongodb/Company.js')

const createTestUser = async () => {
  try {
    console.log('🚀 Creating Test User for CarbonDepict')
    console.log('=====================================')

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    // Create test company first (or find existing)
    let testCompany = await Company.findOne({ name: 'CarbonDepict Test Corp' })
    
    if (!testCompany) {
      testCompany = new Company({
        name: 'CarbonDepict Test Corp',
        industry: 'manufacturing',
        size: 'medium',
        country: 'United States',
        region: 'uk',
        address: '123 Test Street, Test City, TC 12345',
        subscription: 'enterprise',
        subscriptionValidUntil: new Date('2025-12-31'),
        isActive: true,
        settings: {
          emailDomain: 'carbondepict.com',
          allowedDomains: ['carbondepict.com'],
          requireEmailVerification: true,
          autoApproveUsers: true,
          dateFormat: 'yyyy-mm-dd',
          unitSystem: 'metric',
          notifications: {
            email: true,
            monthlyReports: true,
            factorUpdates: true
          }
        },
        metadata: {
          description: 'Test company for CarbonDepict application testing',
          website: 'https://test.carbondepict.com',
          compliance: {
            frameworks: ['GRI', 'TCFD', 'SBTi', 'CSRD'],
            reportingPeriod: 'Annual',
            lastReportDate: new Date('2024-01-01'),
            nextReportDate: new Date('2025-01-01')
          }
        }
      })

      await testCompany.save()
      console.log('✅ Created test company:', testCompany.name)
    } else {
      console.log('✅ Found existing test company:', testCompany.name)
    }

    // Password will be hashed by the User model's pre-save hook

    // Create test user (or find existing)
    let testUser = await User.findOne({ email: 'test@carbondepict.com' })
    
    if (!testUser) {
      testUser = new User({
        email: 'test@carbondepict.com',
        password: 'TestPassword123!', // Let the pre-save hook hash it
        firstName: 'Test',
        lastName: 'User',
        role: 'admin',
        companyId: testCompany._id,
        emailVerified: true,
        isActive: true,
        lastLogin: new Date(),
        metadata: {
          jobTitle: 'ESG Manager',
          department: 'Sustainability',
          phone: '+1-555-0123',
          avatar: null,
          bio: 'Test user for CarbonDepict application testing and development',
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              dashboard: true,
              reports: true,
              alerts: true
            },
            dashboard: {
              defaultView: 'overview',
              widgets: ['emissions', 'esg-scores', 'compliance', 'targets']
            }
          },
          permissions: {
            canViewAllData: true,
            canEditData: true,
            canDeleteData: true,
            canManageUsers: true,
            canManageCompany: true,
            canGenerateReports: true,
            canExportData: true,
            canAccessAnalytics: true,
            canManageIntegrations: true
          }
        }
      })

      await testUser.save()
      console.log('✅ Created test user:', testUser.email)
    } else {
      console.log('✅ Found existing test user:', testUser.email)
    }

    // Create additional test users with different roles
    let managerUser = await User.findOne({ email: 'manager@carbondepict.com' })
    
    if (!managerUser) {
      managerUser = new User({
        email: 'manager@carbondepict.com',
        password: 'ManagerPass123!', // Let the pre-save hook hash it
        firstName: 'Test',
        lastName: 'Manager',
        role: 'manager',
        companyId: testCompany._id,
        emailVerified: true,
        isActive: true,
        lastLogin: new Date(),
        metadata: {
          jobTitle: 'Sustainability Manager',
          department: 'Operations',
          phone: '+1-555-0124',
          avatar: null,
          bio: 'Test manager user for CarbonDepict application testing',
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              dashboard: true,
              reports: true,
              alerts: true
            },
            dashboard: {
              defaultView: 'emissions',
              widgets: ['emissions', 'esg-scores', 'compliance']
            }
          },
          permissions: {
            canViewAllData: true,
            canEditData: true,
            canDeleteData: false,
            canManageUsers: false,
            canManageCompany: false,
            canGenerateReports: true,
            canExportData: true,
            canAccessAnalytics: true,
            canManageIntegrations: false
          }
        }
      })

      await managerUser.save()
      console.log('✅ Created manager user:', managerUser.email)
    } else {
      console.log('✅ Found existing manager user:', managerUser.email)
    }

    let regularUser = await User.findOne({ email: 'user@carbondepict.com' })
    
    if (!regularUser) {
      regularUser = new User({
        email: 'user@carbondepict.com',
        password: 'UserPass123!', // Let the pre-save hook hash it
        firstName: 'Test',
        lastName: 'Employee',
        role: 'user',
        companyId: testCompany._id,
        emailVerified: true,
        isActive: true,
        lastLogin: new Date(),
        metadata: {
          jobTitle: 'Sustainability Analyst',
          department: 'Sustainability',
          phone: '+1-555-0125',
          avatar: null,
          bio: 'Test regular user for CarbonDepict application testing',
          preferences: {
            theme: 'light',
            notifications: {
              email: true,
              dashboard: true,
              reports: false,
              alerts: true
            },
            dashboard: {
              defaultView: 'overview',
              widgets: ['emissions', 'esg-scores']
            }
          },
          permissions: {
            canViewAllData: false,
            canEditData: true,
            canDeleteData: false,
            canManageUsers: false,
            canManageCompany: false,
            canGenerateReports: false,
            canExportData: false,
            canAccessAnalytics: false,
            canManageIntegrations: false
          }
        }
      })

      await regularUser.save()
      console.log('✅ Created regular user:', regularUser.email)
    } else {
      console.log('✅ Found existing regular user:', regularUser.email)
    }

    console.log('\n🎉 Test Users Created Successfully!')
    console.log('=====================================')
    console.log('📧 Admin User:')
    console.log('   Email: test@carbondepict.com')
    console.log('   Password: TestPassword123!')
    console.log('   Role: Admin (Full Access)')
    console.log('')
    console.log('📧 Manager User:')
    console.log('   Email: manager@carbondepict.com')
    console.log('   Password: ManagerPass123!')
    console.log('   Role: Manager (Limited Admin Access)')
    console.log('')
    console.log('📧 Regular User:')
    console.log('   Email: user@carbondepict.com')
    console.log('   Password: UserPass123!')
    console.log('   Role: User (Basic Access)')
    console.log('')
    console.log('🏢 Test Company:')
    console.log('   Name: CarbonDepict Test Corp')
    console.log('   Industry: Technology')
    console.log('   Size: Medium (50-200 employees)')
    console.log('')
    console.log('✅ All users are email verified and ready to use!')
    console.log('🌐 You can now login at: http://localhost:3502')

  } catch (error) {
    console.error('❌ Error creating test user:', error.message)
    console.error(error.stack)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

createTestUser()
