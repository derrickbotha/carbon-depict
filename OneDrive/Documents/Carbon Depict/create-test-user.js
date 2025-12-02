#!/usr/bin/env node

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Import models
import User from './server/models/mongodb/User.js';
import Company from './server/models/mongodb/Company.js';

const createTestUser = async () => {
  try {
    console.log('🚀 Creating Test User for CarbonDepict')
    console.log('=====================================')

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    // Create test company first
    const testCompany = new Company({
      name: 'CarbonDepict Test Corp',
      industry: 'Technology',
      size: 'Medium (50-200 employees)',
      country: 'United States',
      region: 'North America',
      website: 'https://test.carbondepict.com',
      description: 'Test company for CarbonDepict application testing',
      isActive: true,
      settings: {
        currency: 'USD',
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        language: 'en',
        notifications: {
          email: true,
          dashboard: true,
          reports: true
        }
      },
      compliance: {
        frameworks: ['GRI', 'TCFD', 'SBTi', 'CSRD'],
        reportingPeriod: 'Annual',
        lastReportDate: new Date('2024-01-01'),
        nextReportDate: new Date('2025-01-01')
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await testCompany.save()
    console.log('✅ Created test company:', testCompany.name)

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash('db123!@#DB', saltRounds)

    // Create test user
    const testUser = new User({
      email: 'db@carbondepict.com',
      password: hashedPassword,
      firstName: 'Derrick',
      lastName: 'Botha',
      role: 'admin',
      companyId: testCompany._id,
      isEmailVerified: true,
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      isActive: true,
      lastLogin: new Date(),
      profile: {
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await testUser.save()
    console.log('✅ Created test user:', testUser.email)

    // Create additional test users with different roles
    const managerPassword = await bcrypt.hash('ManagerPass123!', saltRounds)
    const managerUser = new User({
      email: 'manager@carbondepict.com',
      password: managerPassword,
      firstName: 'Test',
      lastName: 'Manager',
      role: 'manager',
      companyId: testCompany._id,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      isActive: true,
      lastLogin: new Date(),
      profile: {
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await managerUser.save()
    console.log('✅ Created manager user:', managerUser.email)

    const userPassword = await bcrypt.hash('UserPass123!', saltRounds)
    const regularUser = new User({
      email: 'user@carbondepict.com',
      password: userPassword,
      firstName: 'Test',
      lastName: 'Employee',
      role: 'user',
      companyId: testCompany._id,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
      isActive: true,
      lastLogin: new Date(),
      profile: {
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
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await regularUser.save()
    console.log('✅ Created regular user:', regularUser.email)

    console.log('\n🎉 Test Users Created Successfully!')
    console.log('=====================================')
    console.log('📧 Admin User:')
    console.log('   Email: db@carbondepict.com')
    console.log('   Password: db123!@#DB')
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
    console.log('🌐 You can now login at: http://localhost:3500')

  } catch (error) {
    console.error('❌ Error creating test user:', error.message)
    console.error(error.stack)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
    process.exit(0)
  }
}

createTestUser();