# Microservices Architecture - Emissions & ESG Separation

## Overview

This document describes the microservices architecture where **Emissions** and **ESG** components are separated into independent applications that share the same database infrastructure.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Port 3500)                  │
│                   Unified React Application                 │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway (Port 5500)                    │
│              Routes requests to appropriate service         │
└───────────┬─────────────────────────────┬───────────────────┘
            │                               │
            ↓                               ↓
┌───────────────────────┐      ┌───────────────────────┐
│  Emissions Service    │      │    ESG Service        │
│     (Port 5501)      │      │     (Port 5502)       │
│  - GHG Calculations  │      │  - ESG Metrics        │
│  - DEFRA Factors     │      │  - Data Collection    │
│  - Scope 1/2/3       │      │  - Compliance         │
└───────────┬───────────┘      └───────────┬───────────┘
            │                               │
            └───────────┬───────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Shared Database Infrastructure                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │PostgreSQL│  │ MongoDB  │  │  Redis   │                │
│  └──────────┘  └──────────┘  └──────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Services

### 1. Emissions Service (Port 5501)
**Purpose**: Handles all emission-related calculations and data processing

**Responsibilities**:
- GHG Protocol compliant calculations
- DEFRA 2025 emission factors
- Scope 1, 2, 3 calculations
- Mobile combustion calculations
- Electricity market vs location methodology
- Emission data persistence

**API Endpoints**:
- `GET /api/emissions` - List emissions
- `POST /api/emissions` - Create emission record
- `PUT /api/emissions/:id` - Update emission
- `DELETE /api/emissions/:id` - Delete emission
- `POST /api/emissions/calculate` - Calculate emissions
- `GET /api/emissions/summary` - Get emission summary

### 2. ESG Service (Port 5502)
**Purpose**: Handles all ESG data collection and metrics

**Responsibilities**:
- ESG metrics collection
- Compliance framework validation
- Materiality assessment
- Data entry management
- Risk management
- Training and development tracking

**API Endpoints**:
- `GET /api/esg/metrics` - List ESG metrics
- `POST /api/esg/metrics` - Create ESG metric
- `PUT /api/esg/metrics/:id` - Update ESG metric
- `DELETE /api/esg/metrics/:id` - Delete ESG metric
- `GET /api/compliance/stats` - Get compliance statistics

### 3. API Gateway (Port 5500)
**Purpose**: Routes requests to appropriate microservices

**Responsibilities**:
- Request routing
- Authentication & authorization
- Load balancing
- Rate limiting
- Health monitoring

**Routing Logic**:
- `/api/emissions/*` → Emissions Service
- `/api/esg/*` → ESG Service
- `/api/compliance/*` → ESG Service
- `/api/auth/*` → API Gateway (handled here)

### 4. Frontend (Port 3500)
**Purpose**: Unified user interface for both services

**Features**:
- Single React application
- Dynamic API endpoint selection
- Emissions data forms
- ESG data collection forms
- Unified dashboard

## Benefits of Microservices

### 1. **Independent Scaling**
- Scale emissions service during peak calculation times
- Scale ESG service for reporting periods
- Independent resource allocation

### 2. **Independent Deployment**
- Deploy emissions updates without affecting ESG
- Deploy ESG updates without affecting emissions
- Rollback one service independently

### 3. **Technology Flexibility**
- Use different technologies per service
- Different update cycles
- Isolated dependencies

### 4. **Fault Isolation**
- Failure in one service doesn't bring down the other
- Independent health monitoring
- Graceful degradation

### 5. **Team Autonomy**
- Separate teams can work independently
- Clear ownership boundaries
- Faster development cycles

## Deployment

### Start All Services:
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

### Start Only Emissions Service:
```bash
docker-compose -f docker-compose.microservices.yml up -d emissions-service postgres mongodb redis
```

### Start Only ESG Service:
```bash
docker-compose -f docker-compose.microservices.yml up -d esg-service postgres mongodb redis
```

### Scale Services Independently:
```bash
# Scale emissions service
docker-compose -f docker-compose.microservices.yml up -d --scale emissions-service=3

# Scale ESG service
docker-compose -f docker-compose.microservices.yml up -d --scale esg-service=2
```

## API Gateway Configuration

The API Gateway acts as a reverse proxy, routing requests based on path:

```javascript
// Gateway routing logic
app.use('/api/emissions', proxy('http://emissions-service:5501'))
app.use('/api/esg', proxy('http://esg-service:5502'))
app.use('/api/compliance', proxy('http://esg-service:5502'))
app.use('/api/auth', handleAuth) // Handled by gateway
```

## Health Monitoring

Each service has independent health checks:

```bash
# Check emissions service health
curl http://localhost:5501/api/health

# Check ESG service health
curl http://localhost:5502/api/health

# Check API gateway health
curl http://localhost:5500/api/health
```

## Monitoring & Logging

Each service maintains its own logs:

- Emissions: `server/logs/emissions/`
- ESG: `server/logs/esg/`
- Gateway: `server/logs/gateway/`

## Resource Allocation

Each service has defined resource limits:

- **Emissions Service**: 1 CPU, 1GB RAM
- **ESG Service**: 1 CPU, 1GB RAM
- **API Gateway**: 0.5 CPU, 512MB RAM
- **Frontend**: 1 CPU, 512MB RAM

## Database Sharing

Both services share the same databases:

- **PostgreSQL**: Relational data, users, companies
- **MongoDB**: Document storage, emissions, ESG metrics
- **Redis**: Caching, session management, rate limiting

## Migration Path

To migrate from monolithic to microservices:

1. **Phase 1**: Deploy both services and gateway
2. **Phase 2**: Route new features to microservices
3. **Phase 3**: Gradually migrate existing features
4. **Phase 4**: Deprecate monolithic API

## Testing

### Test Emissions Service:
```bash
curl -X POST http://localhost:5501/api/emissions/calculate \
  -H "Content-Type: application/json" \
  -d '{"scope":"scope1","formData":{...}}'
```

### Test ESG Service:
```bash
curl http://localhost:5502/api/esg/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Status

- ✅ Emissions Service - Isolated and independent
- ✅ ESG Service - Isolated and independent
- ✅ API Gateway - Routing configured
- ✅ Shared Database - Postgres, MongoDB, Redis
- ✅ Frontend - Unified interface
- ✅ Health Checks - All services
- ✅ Resource Limits - Per service
- ✅ Independent Scaling - Fully supported

