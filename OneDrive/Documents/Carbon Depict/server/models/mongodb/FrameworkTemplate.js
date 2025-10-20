const mongoose = require('mongoose')

/**
 * FrameworkTemplate Model (MongoDB)
 * Stores dynamic form schemas for each ESG framework
 */
const frameworkTemplateSchema = new mongoose.Schema(
  {
    framework: {
      type: String,
      required: true,
      enum: [
        'GRI',
        'SBTi',
        'TCFD',
        'CSRD',
        'SDG',
        'CDP_CLIMATE',
        'CDP_WATER',
        'CDP_FORESTS',
        'ECOVADIS',
        'SASB',
        'VSME',
        'EU_TAXONOMY',
        'MACF',
        'ISO14001',
      ],
      index: true,
    },
    frameworkVersion: {
      type: String,
      required: true,
      // GRI Standards 2021, TCFD 2017, CSRD 2023, etc.
    },
    pillar: {
      type: String,
      enum: ['Environmental', 'Social', 'Governance', 'Cross-Cutting'],
      index: true,
    },
    standardNumber: {
      type: String,
      // GRI 305, ESRS E1, TCFD Strategy, etc.
    },
    standardName: {
      type: String,
      required: true,
      // Emissions, Climate Change, Board Diversity, etc.
    },
    description: {
      type: String,
    },
    // Form structure
    disclosures: [
      {
        disclosureId: String, // 305-1, E1-6, etc.
        disclosureName: String,
        description: String,
        required: Boolean,
        dataType: {
          type: String,
          enum: ['numeric', 'percentage', 'currency', 'text', 'date', 'boolean', 'table', 'list'],
        },
        unit: String, // tCO2e, kWh, USD, %, etc.
        // Form fields
        fields: [
          {
            fieldId: String,
            fieldName: String,
            fieldType: {
              type: String,
              enum: [
                'text',
                'textarea',
                'number',
                'date',
                'select',
                'multiselect',
                'checkbox',
                'radio',
                'table',
                'file',
              ],
            },
            label: String,
            placeholder: String,
            helpText: String,
            required: Boolean,
            defaultValue: mongoose.Schema.Types.Mixed,
            validation: {
              min: Number,
              max: Number,
              pattern: String,
              customValidation: String,
            },
            options: [
              {
                value: String,
                label: String,
              },
            ],
            // Conditional display
            conditional: {
              dependsOn: String, // fieldId
              condition: String, // equals, contains, greaterThan, etc.
              value: mongoose.Schema.Types.Mixed,
            },
          },
        ],
        // Calculation logic
        calculation: {
          formula: String, // JavaScript expression
          dependencies: [String], // fieldIds required for calculation
        },
        // Guidance
        guidance: {
          type: String,
        },
        examples: [String],
        references: [
          {
            type: String,
            url: String,
          },
        ],
      },
    ],
    // Framework-specific metadata
    reportingBoundary: String,
    materialityThreshold: String,
    assuranceRequirement: String,
    publicationDeadline: String,
    // Tags for search
    tags: [String],
    // Related frameworks (interoperability)
    relatedFrameworks: [
      {
        framework: String,
        mapping: mongoose.Schema.Types.Mixed, // How disclosures map to other frameworks
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'framework_templates',
  }
)

// Indexes
frameworkTemplateSchema.index({ framework: 1, frameworkVersion: 1, pillar: 1 })
frameworkTemplateSchema.index({ standardNumber: 1 })
frameworkTemplateSchema.index({ tags: 1 })

const FrameworkTemplate = mongoose.model('FrameworkTemplate', frameworkTemplateSchema)

module.exports = FrameworkTemplate
