# Carbon Depict - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- At least 4GB RAM
- 10GB free disk space

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/derrickbotha/carbon-depict.git
cd carbon-depict
```

2. **Set up environment variables**
Create a `.env` file in the project root:

```env
# Database
POSTGRES_USER=carbonuser
POSTGRES_PASSWORD=your_strong_password_here
POSTGRES_DB=carbondepict
POSTGRES_PORT=5432

MONGO_USER=carbonadmin
MONGO_PASSWORD=your_strong_password_here
MONGO_DB=carbondepict
MONGO_PORT=27017

REDIS_PASSWORD=your_strong_password_here
REDIS_PORT=6379

# Security (CHANGE THESE!)
JWT_SECRET=your-very-long-random-secret-here
SESSION_SECRET=your-very-long-random-secret-here
JWT_EXPIRE=7d

# API Keys
DEFRA_API_KEY=your_defra_api_key
OPENAI_API_KEY=your_openai_api_key

# URLs
CORS_ORIGIN=http://localhost:3500
CLIENT_URL=http://localhost:3500
VITE_API_URL=http://localhost:5500/api

# Ports
BACKEND_PORT=5500
FRONTEND_PORT=3500
NGINX_HTTP_PORT=80
NGINX_HTTPS_PORT=443

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Deployment Options

### Option 1: Production Deployment (Recommended)

#### Start all services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### View logs:
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

#### Check status:
```bash
docker-compose -f docker-compose.prod.yml ps
```

#### Stop services:
```bash
docker-compose -f docker-compose.prod.yml down
```

#### Stop and remove volumes:
```bash
docker-compose -f docker-compose.prod.yml down -v
```

### Option 2: Development Deployment

#### Start all services:
```bash
docker-compose up -d
```

#### View logs:
```bash
docker-compose logs -f
```

#### Restart a specific service:
```bash
docker-compose restart backend
```

#### Stop services:
```bash
docker-compose down
```

## Health Checks

### Check Backend Health:
```bash
curl http://localhost:5500/api/health
```

### Check Frontend:
```bash
curl http://localhost:3500
```

### Check Database Connections:
```bash
# PostgreSQL
docker exec -it carbon-depict-db-prod psql -U carbonuser -d carbondepict

# MongoDB
docker exec -it carbon-depict-mongodb-prod mongosh -u carbonadmin -p
```

## Building Images

### Build all images:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Build specific service:
```bash
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml build frontend
```

## Troubleshooting

### View logs:
```bash
# All services
docker-compose -f docker-compose.prod.yml logs

# Specific service
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Restart a service:
```bash
docker-compose -f docker-compose.prod.yml restart backend
```

### Rebuild after code changes:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Check container status:
```bash
docker-compose -f docker-compose.prod.yml ps
docker stats
```

### Access container shell:
```bash
# Backend
docker exec -it carbon-depict-api-prod sh

# Frontend
docker exec -it carbon-depict-app-prod sh

# Database
docker exec -it carbon-depict-db-prod psql -U carbonuser
```

### Clean up everything:
```bash
# Stop containers
docker-compose -f docker-compose.prod.yml down

# Remove volumes (deletes all data!)
docker-compose -f docker-compose.prod.yml down -v

# Remove images
docker-compose -f docker-compose.prod.yml down --rmi all
```

## Backup & Restore

### Backup PostgreSQL:
```bash
docker exec carbon-depict-db-prod pg_dump -U carbonuser carbondepict > backup.sql
```

### Restore PostgreSQL:
```bash
docker exec -i carbon-depict-db-prod psql -U carbonuser carbondepict < backup.sql
```

### Backup MongoDB:
```bash
docker exec carbon-depict-mongodb-prod mongodump --out /backup
docker cp carbon-depict-mongodb-prod:/backup ./backup-mongodb
```

## Scaling

### Scale backend instances:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

### Scale with resource limits:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=2 --scale frontend=2
```

## Monitoring

### Check resource usage:
```bash
docker stats
```

### View container logs:
```bash
docker logs -f carbon-depict-api-prod
docker logs -f carbon-depict-app-prod
```

### Monitor health checks:
```bash
docker inspect carbon-depict-api-prod | grep -A 10 Health
```

## Production Checklist

- [ ] Update `.env` file with strong passwords
- [ ] Change JWT_SECRET to a secure random string
- [ ] Update CORS_ORIGIN to your domain
- [ ] Configure SMTP settings for email
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Configure monitoring and alerting
- [ ] Set up log aggregation
- [ ] Test failover scenarios

## Security Considerations

1. **Use strong passwords** for all database connections
2. **Change JWT_SECRET** to a secure random string
3. **Enable HTTPS** in production
4. **Configure firewall** to only allow necessary ports
5. **Regular backups** of database volumes
6. **Monitor logs** for suspicious activity
7. **Keep Docker images updated**
8. **Use secrets management** (Docker Secrets or Vault)

## Performance Optimization

1. **Resource limits** are configured in docker-compose.prod.yml
2. **Database indexing** for faster queries
3. **Redis caching** for session management
4. **Nginx reverse proxy** for load balancing
5. **CDN** for static assets in production

## Support

For issues or questions:
- GitHub Issues: https://github.com/derrickbotha/carbon-depict/issues
- Documentation: https://github.com/derrickbotha/carbon-depict/tree/master/docs

