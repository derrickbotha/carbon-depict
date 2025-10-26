# Docker Deployment Setup Complete ✅

## Overview
Complete Docker setup for Carbon Depict application with production-ready configuration.

## Files Created/Updated

### 1. Frontend Docker Configuration
- **File**: `Dockerfile`
- **Features**:
  - Multi-stage build (builder + production)
  - Node 20 Alpine base image
  - Nginx for serving static files
  - Production optimizations
  - Health checks
  - Non-root user

### 2. Backend Docker Configuration
- **File**: `server/Dockerfile`
- **Features**:
  - Multi-stage build (dependencies + production)
  - Node 20 Alpine base image
  - Production optimizations
  - Health checks
  - Non-root user
  - Volume mounts for uploads/logs

### 3. Docker Compose Configurations
- **File**: `docker-compose.yml` - Development setup
- **File**: `docker-compose.prod.yml` - Production setup
- **Features**:
  - PostgreSQL database
  - MongoDB database
  - Redis cache
  - Backend API
  - Frontend application
  - Nginx reverse proxy (optional)
  - Health checks for all services
  - Resource limits
  - Volume persistence

### 4. Docker Ignore Files
- **File**: `.dockerignore` - Frontend build exclusions
- **File**: `server/.dockerignore` - Backend build exclusions
- **Purpose**: Reduce image size by excluding unnecessary files

### 5. Documentation
- **File**: `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide

## Quick Start

### Production Deployment

1. **Clone repository:**
```bash
git clone https://github.com/derrickbotha/carbon-depict.git
cd carbon-depict
```

2. **Create `.env` file:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Check status:**
```bash
docker-compose -f docker-compose.prod.yml ps
```

5. **View logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Access the Application

- **Frontend**: http://localhost:3500
- **Backend API**: http://localhost:5500
- **API Health**: http://localhost:5500/api/health
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

## Services

### Backend API (`backend`)
- **Container**: carbon-depict-api-prod
- **Port**: 5500
- **Technology**: Node.js 20 Alpine
- **Purpose**: API server, business logic, database connections

### Frontend Application (`frontend`)
- **Container**: carbon-depict-app-prod
- **Port**: 3500
- **Technology**: React + Vite + Nginx
- **Purpose**: User interface, web application

### PostgreSQL Database (`postgres`)
- **Container**: carbon-depict-db-prod
- **Port**: 5432
- **Image**: postgres:15-alpine
- **Purpose**: Primary relational database

### MongoDB Database (`mongodb`)
- **Container**: carbon-depict-mongodb-prod
- **Port**: 27017
- **Image**: mongo:7-jammy
- **Purpose**: Document storage, emissions data

### Redis Cache (`redis`)
- **Container**: carbon-depict-redis-prod
- **Port**: 6379
- **Image**: redis:7-alpine
- **Purpose**: Session management, caching

## Features Implemented

✅ **Multi-stage builds** for optimized images
✅ **Health checks** for all services
✅ **Resource limits** to prevent resource exhaustion
✅ **Non-root users** for security
✅ **Volume persistence** for data persistence
✅ **Environment variables** for configuration
✅ **Dependencies** handled via depends_on
✅ **Network isolation** with bridge network
✅ **Health checks** ensure services are ready
✅ **Production optimizations** throughout

## Security Features

1. **Non-root users** in all containers
2. **Secrets management** via environment variables
3. **Network isolation** with Docker networks
4. **Volume permissions** configured correctly
5. **Resource limits** to prevent DoS
6. **Health checks** for automatic recovery

## Performance Features

1. **Multi-stage builds** reduce image size
2. **Layer caching** for faster rebuilds
3. **Resource limits** prevent resource exhaustion
4. **Redis caching** for improved performance
5. **Connection pooling** for databases
6. **Static asset optimization** in frontend

## Troubleshooting

### View logs:
```bash
docker-compose -f docker-compose.prod.yml logs
```

### Restart service:
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Rebuild images:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Check health:
```bash
docker inspect carbon-depict-api-prod | grep Health
```

## Next Steps

1. **Configure `.env`** with production values
2. **Set up SSL/TLS** certificates
3. **Configure firewall** rules
4. **Set up automated backups**
5. **Configure monitoring** and alerting
6. **Set up CI/CD** pipeline
7. **Deploy to cloud** (AWS, Azure, GCP)

## Status: COMPLETE ✅

Your application is now Docker-ready and can be deployed to any environment!

