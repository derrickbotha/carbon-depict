# Docker Deployment Guide for Carbon Depict

This guide explains how to run the Carbon Depict application using Docker for both local development and production deployment.

## Prerequisites

- **Docker Desktop** (for Windows/Mac) or **Docker Engine** (for Linux)
- **Docker Compose** v2.0 or higher
- At least 4GB RAM available for Docker
- 10GB free disk space

## Quick Start

### 1. Start All Services

```bash
docker-compose up -d
```

This command will start:
- **PostgreSQL** (port 5432) - Relational database
- **MongoDB** (port 27017) - Document database
- **Redis** (port 6379) - Cache and session store
- **Backend API** (port 5500) - Express.js API server
- **Frontend** (port 3000) - React application

### 2. Check Service Status

```bash
docker ps --filter "name=carbon-depict"
```

All containers should show as "Up" and healthy (except frontend healthcheck which is a known non-issue).

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5500/api
- **API Documentation**: http://localhost:5500/api/docs

## Service Ports

| Service | Internal Port | External Port | Description |
|---------|--------------|---------------|-------------|
| Frontend | 3500 | 3000 | React web application |
| Backend | 5500 | 5500 | Express.js API server |
| PostgreSQL | 5432 | 5432 | Relational database |
| MongoDB | 27017 | 27017 | Document database |
| Redis | 6379 | 6379 | Cache & sessions |

## Environment Variables

The application uses environment variables defined in docker-compose.yml. For production, create a `.env` file:

```bash
# Application
NODE_ENV=production
FRONTEND_PORT=3000
BACKEND_PORT=5500

# Database Credentials
POSTGRES_USER=carbonuser
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=carbondepict

MONGO_ROOT_USER=carbonadmin
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGO_DB=carbondepict

REDIS_PASSWORD=your_secure_password_here

# Security
JWT_SECRET=your_very_secure_jwt_secret_here
SESSION_SECRET=your_very_secure_session_secret_here

# CORS
CORS_ORIGIN=https://yourdomain.com
```

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild services
```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

### Restart a service
```bash
docker-compose restart backend
```

### Remove all data (WARNING: Deletes all database data)
```bash
docker-compose down -v
```

## Production Deployment

### 1. Secure Your Environment Variables

Never use default passwords in production. Generate strong passwords:

```bash
# Generate secure random passwords
openssl rand -base64 32
```

### 2. Build for Production

```bash
docker-compose -f docker-compose.yml build --no-cache
```

### 3. Deploy

For cloud deployment (AWS, GCP, Azure):

1. Push images to a container registry:
```bash
docker tag carbondepict-backend:latest your-registry/carbon-depict-backend:latest
docker push your-registry/carbon-depict-backend:latest

docker tag carbondepict-frontend:latest your-registry/carbon-depict-frontend:latest
docker push your-registry/carbon-depict-frontend:latest
```

2. Update docker-compose.yml to use registry images
3. Deploy to your cloud platform using their Docker/Kubernetes services

### 4. SSL/TLS Configuration

For production, enable HTTPS:

1. Update nginx.conf to listen on port 443
2. Mount SSL certificates as volumes
3. Uncomment the nginx service in docker-compose.yml:

```bash
docker-compose --profile production up -d
```

## Backup and Restore

### Backup MongoDB
```bash
docker exec carbon-depict-mongodb mongodump --username=carbonadmin --password=your_password --authenticationDatabase=admin --db=carbondepict --out=/backups
```

### Backup PostgreSQL
```bash
docker exec carbon-depict-db pg_dump -U carbonuser carbondepict > backup.sql
```

### Restore MongoDB
```bash
docker exec carbon-depict-mongodb mongorestore --username=carbonadmin --password=your_password --authenticationDatabase=admin --db=carbondepict /backups/carbondepict
```

### Restore PostgreSQL
```bash
docker exec -i carbon-depict-db psql -U carbonuser -d carbondepict < backup.sql
```

## Troubleshooting

### Backend keeps restarting

Check logs:
```bash
docker logs carbon-depict-api
```

Common issues:
- Missing environment variables (SESSION_SECRET, JWT_SECRET)
- Database connection issues
- Port conflicts

### Frontend shows 502 error

1. Check if backend is running:
```bash
docker ps | grep carbon-depict-api
```

2. Check backend health:
```bash
curl http://localhost:5500/api/health
```

### Database connection fails

1. Ensure databases are healthy:
```bash
docker ps --filter "name=carbon-depict" --format "table {{.Names}}\t{{.Status}}"
```

2. Check database logs:
```bash
docker logs carbon-depict-mongodb
docker logs carbon-depict-db
```

### Out of memory errors

Increase Docker memory allocation in Docker Desktop settings to at least 4GB.

## Development Tips

### Hot Reload

For development with hot reload, use docker-compose.dev.yml:

```bash
docker-compose -f docker-compose.dev.yml up
```

### Access Database Directly

```bash
# MongoDB
docker exec -it carbon-depict-mongodb mongosh -u carbonadmin -p

# PostgreSQL
docker exec -it carbon-depict-db psql -U carbonuser -d carbondepict

# Redis
docker exec -it carbon-depict-redis redis-cli -a your_redis_password
```

### View Container Resource Usage

```bash
docker stats carbon-depict-api carbon-depict-mongodb carbon-depict-db carbon-depict-redis
```

## GitHub Deployment

When deploying to GitHub:

1. **Add GitHub Actions workflow** (`.github/workflows/docker-deploy.yml`):

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker-compose push
```

2. **Set GitHub Secrets** in your repository settings:
   - DOCKER_USERNAME
   - DOCKER_PASSWORD
   - Production environment variables

3. **Use GitHub Packages** or **Docker Hub** as your container registry

## Architecture

```
┌─────────────┐
│   Nginx     │ (Optional load balancer)
│  Port 80    │
└──────┬──────┘
       │
┌──────▼──────────┐
│    Frontend     │
│  React (3000)   │
└──────┬──────────┘
       │
┌──────▼──────────┐       ┌──────────────┐
│    Backend      │◄──────┤   MongoDB    │
│ Express (5500)  │       │  Port 27017  │
└──────┬──────────┘       └──────────────┘
       │                  ┌──────────────┐
       ├──────────────────┤  PostgreSQL  │
       │                  │  Port 5432   │
       │                  └──────────────┘
       │                  ┌──────────────┐
       └──────────────────┤    Redis     │
                          │  Port 6379   │
                          └──────────────┘
```

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Verify environment variables are set correctly
- Ensure all containers are healthy: `docker ps`
- Check GitHub issues for known problems

## License

See LICENSE file in the project root.
