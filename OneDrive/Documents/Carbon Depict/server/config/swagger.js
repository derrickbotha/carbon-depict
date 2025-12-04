/**
 * Swagger/OpenAPI Configuration
 * Phase 2 Week 8: API Documentation
 *
 * Provides auto-generated interactive API documentation
 */

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Carbon Depict API',
      version: '1.0.0',
      description: 'Enterprise-grade carbon emissions tracking and ESG reporting API',
      contact: {
        name: 'Carbon Depict Support',
        email: 'support@carbondepict.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://carbondepict.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server'
      },
      {
        url: 'https://api.carbondepict.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/login'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'array',
              items: {}
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                count: { type: 'number' },
                page: { type: 'number' },
                pages: { type: 'number' },
                limit: { type: 'number' },
                hasNextPage: { type: 'boolean' },
                hasPrevPage: { type: 'boolean' },
                nextPage: { type: 'number', nullable: true },
                prevPage: { type: 'number', nullable: true }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Emissions',
        description: 'GHG emissions data management'
      },
      {
        name: 'ESG Metrics',
        description: 'ESG performance metrics'
      },
      {
        name: 'Reports',
        description: 'Report generation and management'
      },
      {
        name: 'Monitoring',
        description: 'Health checks and performance metrics'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './models/**/*.js'
  ]
}

// Generate swagger spec
const swaggerSpec = swaggerJsDoc(swaggerOptions)

// Swagger UI options
const swaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Carbon Depict API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true
  }
}

/**
 * Setup Swagger documentation
 * @param {Express.Application} app - Express app instance
 */
function setupSwagger(app) {
  // Serve swagger JSON
  app.get('/api/docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  // Serve swagger UI
  app.use('/api/docs', swaggerUi.serve)
  app.get('/api/docs', swaggerUi.setup(swaggerSpec, swaggerUiOptions))

  console.log('📚 API Documentation available at /api/docs')
}

module.exports = {
  setupSwagger,
  swaggerSpec
}
