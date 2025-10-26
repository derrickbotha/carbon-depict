# Microservices Deployment - Quick Start Guide

## Architecture

- **Emissions Service** (Port 5501) - GHG calculations
- **ESG Service** (Port 5502) - ESG data collection
- **API Gateway** (Port 5500) - Request routing
- **Frontend** (Port 3500) - User interface
- **Shared Databases** - Postgres, MongoDB, Redis

## Quick Start

### 1. Create .env file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start all services:
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

### 3. Check status:
```bash
docker-compose -f docker-compose.microservices.yml ps
```

### 4. View logs:
```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f emissions-service
docker-compose -f docker-compose.microservices.yml logs -f esg-service
docker-compose -f docker-compose.microservices.yml logs -f api-gateway
```

## Access Services

- **Frontend**: http://localhost:3500
- **API Gateway**: http://localhost:5500
- **Emissions Service**: http://localhost:5501
- **ESG Service**: http://localhost:5502

## Health Checks

```bash
# Check API gateway
curl http://localhost:5500/api/health

# Check emissions service
curl http://localhost:5501/api/health

# Check ESG service
curl http://localhost:5502/api/health
```

## Scale Services

```bash
# Scale emissions service (for high calculation load)
docker-compose -f docker-compose.microservices.yml up -d --scale emissions-service=3

# Scale ESG service (for reporting periods)
docker-compose -f docker-compose.microservices.yml up -d --scale esg-service=2
```

## Independent Operations

### Start Only Emissions:
```bash
docker-compose -f docker-compose.microservices.yml up -d emissions-service postgres mongodb redis
```

### Start Only ESG:
```bash
docker-compose -f docker-compose.microservices.yml up -d esg-service postgres mongodb redis
```

### Stop All:
```bash
docker-compose -f docker-compose.microservices.yml down
```

### Stop with Volumes (deletes data):
```bash
docker-compose -f docker-compose.microservices.yml down -v
```

## Benefits

✅ **Independent Scaling** - Scale emissions and ESG separately
✅ **Independent Deployment** - Deploy updates independently
✅ **Fault Isolation** - Failure in one doesn't affect the other
✅ **Technology Flexibility** - Use different tech per service
✅ **Team Autonomy** - Separate teams can work independently

