# Database Migrations

This directory contains database migration scripts for the Carbon Depict application.

## Migration Naming Convention

Migrations should be named: `YYYYMMDDHHMMSS_description.js`

Example: `20251024120000_add_emission_calculation_fields.js`

## Running Migrations

```bash
# Run all pending migrations
node migrations/run.js

# Run a specific migration
node migrations/run.js 20251024120000_add_emission_calculation_fields.js

# Rollback last migration
node migrations/run.js --rollback
```

## Creating a New Migration

```bash
node migrations/create.js "description of migration"
```

## Migration Structure

Each migration file should export two functions:
- `up()`: Apply the migration
- `down()`: Rollback the migration

```javascript
module.exports = {
  async up(db) {
    // Migration code
  },
  async down(db) {
    // Rollback code
  }
}
```
