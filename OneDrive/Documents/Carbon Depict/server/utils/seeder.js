const mongoose = require('mongoose')
const User = require('../models/mongodb/User')
const Company = require('../models/mongodb/Company')
const logger = require('./logger')

const seedDatabase = async () => {
    try {
        const userCount = await User.countDocuments()
        if (userCount > 0) {
            logger.info('Database already seeded with users')
            return
        }

        logger.info('Seeding database with test users...')

        // Create test company
        const testCompany = await Company.create({
            name: 'Carbon Depict Test Company',
            industry: 'other',
            region: 'uk',
            size: 'medium',
            subscription: 'free',
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
            }
        })

        logger.info(`Created test company: ${testCompany.name}`)

        // Create admin user
        // Note: Password hashing is handled by pre-save hook in User model
        // The password in create-test-user.js was 'db123!@#DB'
        // We need to pass the plain password, the model will hash it.
        // Wait, the User model pre-save hook hashes the password if modified.
        // So we should pass the plain text password.

        const adminUser = await User.create({
            email: 'db@carbondepict.com',
            password: 'Db123!Admin&',
            firstName: 'DB',
            lastName: 'Admin',
            role: 'admin',
            companyId: testCompany._id,
            emailVerified: true,
            isActive: true,
            lastLogin: new Date()
        })

        logger.info(`Created admin user: ${adminUser.email}`)

        // Create manager user
        const managerUser = await User.create({
            email: 'manager@carbondepict.com',
            password: 'Manager@Pass1!',
            firstName: 'Test',
            lastName: 'Manager',
            role: 'manager',
            companyId: testCompany._id,
            emailVerified: true,
            isActive: true,
            lastLogin: new Date()
        })

        logger.info(`Created manager user: ${managerUser.email}`)

        // Create regular user
        const regularUser = await User.create({
            email: 'user@carbondepict.com',
            password: 'UserPass@123!',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            companyId: testCompany._id,
            emailVerified: true,
            isActive: true,
            lastLogin: new Date()
        })

        logger.info(`Created regular user: ${regularUser.email}`)

        logger.info('Database seeding completed successfully')
    } catch (error) {
        logger.error('Error seeding database:', { error: error.message, stack: error.stack })
    }
}

module.exports = seedDatabase
