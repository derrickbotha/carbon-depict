# CarbonDepict Environment Configuration
# Copy this file to server/.env and update with your actual values

# Server Configuration
NODE_ENV=development
PORT=5500
CLIENT_URL=http://localhost:3500

# Database Configuration
# MongoDB (Primary database)
MONGODB_URI=mongodb://localhost:27017/carbondepict
MONGO_POOL_MAX=10
MONGO_POOL_MIN=2

# Redis (Caching and sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security (REQUIRED - Generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret-change-in-production

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@carbondepict.com

# AI Integration (Optional)
AI_API_KEY=your-grok-or-openai-api-key
AI_API_URL=https://api.x.ai/v1/chat/completions
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# External APIs (Optional)
DEFRA_API_KEY=your-defra-api-key

# CORS Configuration
CORS_ORIGIN=http://localhost:3500

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
