# Carbon Depict - Quick Setup Guide

## Prerequisites Installation

### 1. Install PostgreSQL (Windows)

**Option A: PostgreSQL Official Installer**
```powershell
# Download from: https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql

# After installation:
# - Default port: 5432
# - Default user: postgres
# - Set password during installation
```

**Option B: Use Docker (Recommended)**
```powershell
# Install Docker Desktop from: https://www.docker.com/products/docker-desktop

# Run PostgreSQL container:
docker run -d `
  --name carbondepict-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=carbondepict `
  -p 5432:5432 `
  postgres:15-alpine

# Verify it's running:
docker ps
```

### 2. Install MongoDB

**Option A: MongoDB Community Edition**
```powershell
# Download from: https://www.mongodb.com/try/download/community
# Or use Chocolatey:
choco install mongodb

# Start MongoDB service:
net start MongoDB
```

**Option B: Use Docker (Recommended)**
```powershell
# Run MongoDB container:
docker run -d `
  --name carbondepict-mongo `
  -p 27017:27017 `
  mongo:7

# Verify it's running:
docker ps
```

### 3. Install Redis

**Option A: Memurai (Redis for Windows)**
```powershell
# Download from: https://www.memurai.com/get-memurai

# Or use WSL2:
wsl --install
# Then in WSL:
sudo apt update
sudo apt install redis-server
redis-server
```

**Option B: Use Docker (Recommended)**
```powershell
# Run Redis container:
docker run -d `
  --name carbondepict-redis `
  -p 6379:6379 `
  redis:7-alpine

# Verify it's running:
docker ps
```

## Quick Start with Docker (All Services)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: carbondepict
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
  mongo_data:
```

Start all services:
```powershell
docker-compose up -d
```

## Server Setup

### 1. Install Dependencies
```powershell
cd server
npm install
```

### 2. Configure Environment
```powershell
# Copy .env.example to .env (already done)
# Update these values:
# - AI_API_KEY: Get from https://console.x.ai (Grok) or OpenAI
# - SMTP credentials for email notifications
```

### 3. Run Database Migrations
```powershell
# PostgreSQL tables will auto-create in development mode
# MongoDB collections auto-create on first use

# Optional: Seed framework templates
node seeds/frameworks.js
```

### 4. Start Server
```powershell
npm run dev
```

Server will run on http://localhost:5500

## Verify Installation

### Check Database Connections
```powershell
# Test PostgreSQL:
curl http://localhost:5500/api/health/detailed

# Expected response:
# {
#   "status": "ok",
#   "services": {
#     "postgres": "connected",
#     "mongodb": "connected",
#     "redis": "connected"
#   }
# }
```

### Test Authentication
```powershell
# Register a user:
curl -X POST http://localhost:5500/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@company.com",
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User",
    "companyName": "Test Company",
    "industry": "Technology"
  }'
```

### Test AI Compliance
```powershell
# Login first to get token:
$response = Invoke-RestMethod -Method POST -Uri http://localhost:5500/api/auth/login `
  -ContentType "application/json" `
  -Body '{"email":"admin@company.com","password":"SecurePass123!"}'

$token = $response.token

# Test compliance check:
Invoke-RestMethod -Method POST -Uri http://localhost:5500/api/compliance/analyze `
  -Headers @{"Authorization"="Bearer $token"} `
  -ContentType "application/json" `
  -Body '{
    "framework": "GRI",
    "data": {
      "disclosure": "305-1",
      "indicator": "Direct GHG emissions",
      "value": 15000,
      "unit": "tCO2e",
      "reportingPeriod": "2024"
    }
  }'
```

## Frontend Setup

### 1. Install Dependencies
```powershell
cd ../src  # or wherever React app is
npm install
```

### 2. Start Development Server
```powershell
npm start
```

Frontend will run on http://localhost:3000

## Troubleshooting

### PostgreSQL Connection Error
```
Error: Cannot read properties of undefined (reading 'write')
```
**Solution:** PostgreSQL is not running. Start it with Docker or Windows service.

### MongoDB Connection Timeout
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution:** MongoDB is not running. Start it with Docker or Windows service.

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:** Redis/Memurai is not running. Background jobs will be disabled but server will still work.

### AI API Error
```
Error: Request failed with status code 401
```
**Solution:** Set valid `AI_API_KEY` in `.env` file. Get from:
- Grok: https://console.x.ai
- OpenAI: https://platform.openai.com/api-keys

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5500
```
**Solution:** Another process is using port 5500. Either stop it or change `PORT` in `.env`.

## Production Deployment

### Environment Variables
Update these in production `.env`:
```env
NODE_ENV=production
JWT_SECRET=use-strong-random-secret-here
SESSION_SECRET=use-strong-random-secret-here
POSTGRES_PASSWORD=strong-database-password
SMTP_USER=your-corporate-email
SMTP_PASSWORD=your-smtp-password
AI_API_KEY=your-production-api-key
```

### Security Checklist
- [ ] Change all default passwords
- [ ] Enable SSL for PostgreSQL (`POSTGRES_SSL=true`)
- [ ] Use environment-specific MongoDB replica set
- [ ] Configure Redis with password
- [ ] Set up CORS whitelist for production domains
- [ ] Enable rate limiting
- [ ] Configure logging and monitoring
- [ ] Set up automated backups
- [ ] Enable database encryption at rest

### Deployment Options

**Option 1: Traditional VPS**
- Use PM2 for process management: `pm2 start index.js --name carbon-depict`
- Nginx reverse proxy
- Let's Encrypt SSL
- Database backups with pg_dump/mongodump

**Option 2: Docker**
- Build production image: `docker build -t carbondepict-api .`
- Use docker-compose for orchestration
- Persistent volumes for data
- Health checks and restart policies

**Option 3: Cloud Platform**
- AWS: ECS/Fargate + RDS PostgreSQL + DocumentDB (MongoDB-compatible)
- Azure: App Service + Azure Database for PostgreSQL + Cosmos DB
- GCP: Cloud Run + Cloud SQL + Firestore

## Support

For issues, check:
1. Server logs: `server/logs/`
2. Database connection: `GET /api/health/detailed`
3. Error logs: `ActivityLog` collection in MongoDB
4. Admin panel: http://localhost:5500/admin (login as admin user)

---

**Quick Start Command Summary:**
```powershell
# Start databases (Docker):
docker-compose up -d

# Start server:
cd server ; npm install ; npm run dev

# Start frontend:
cd src ; npm install ; npm start
```

That's it! You're ready to start building with Carbon Depict! 🌱
