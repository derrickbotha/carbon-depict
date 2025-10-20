# Carbon Depict - Deployment Guide

Complete deployment guide for Carbon Depict ESG tracking platform using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Environment Configuration](#environment-configuration)
4. [Production Deployment](#production-deployment)
5. [Development Deployment](#development-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Database Management](#database-management)
8. [SSL/HTTPS Setup](#ssl-https-setup)
9. [Monitoring & Logging](#monitoring--logging)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **RAM**: Minimum 4GB, recommended 8GB
- **Disk Space**: Minimum 20GB free space
- **OS**: Linux, macOS, or Windows with WSL2

### Installing Docker

**Ubuntu/Debian:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

### Verify Installation

```bash
docker --version          # Should be 20.10+
docker-compose --version  # Should be 2.0+
```

---

## Quick Start

Get Carbon Depict running in 3 commands:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit environment variables (see Environment Configuration below)
nano .env  # or your preferred editor

# 3. Deploy
./deploy.sh  # Linux/macOS
# or
deploy.bat   # Windows
```

Your application will be available at:
- **Frontend**: http://localhost:3500
- **Backend API**: http://localhost:5500
- **API Health**: http://localhost:5500/api/health

---

## Environment Configuration

### Required Variables

Edit `.env` file and configure these **CRITICAL** variables:

#### 1. Database Passwords
```env
POSTGRES_PASSWORD=your_very_strong_postgres_password_here
MONGO_PASSWORD=your_very_strong_mongo_password_here
REDIS_PASSWORD=your_very_strong_redis_password_here
```

⚠️ **Security**: Use strong passwords (20+ characters, mixed case, numbers, symbols)

#### 2. JWT Secret
```env
JWT_SECRET=your_very_strong_jwt_secret_minimum_32_characters
JWT_EXPIRE=7d
```

⚠️ **Security**: Generate a strong random key:
```bash
# Linux/macOS
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

#### 3. API Keys (Optional but Recommended)

```env
# DEFRA API for UK emissions data
DEFRA_API_KEY=your_defra_api_key_here

# OpenAI for AI-powered ESG scoring
OPENAI_API_KEY=sk-your_openai_api_key_here
```

### Optional Variables

#### CORS Configuration
```env
CORS_ORIGIN=http://localhost:3500,https://yourdomain.com
```

#### Email Configuration (for notifications)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@carbondepict.com
```

#### AWS S3 (for file storage)
```env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=carbon-depict-uploads
```

#### Rate Limiting
```env
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Complete Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `FRONTEND_PORT` | Frontend port | Yes | `3500` |
| `BACKEND_PORT` | Backend API port | Yes | `5500` |
| `POSTGRES_HOST` | PostgreSQL host | Yes | `postgres` |
| `POSTGRES_PORT` | PostgreSQL port | Yes | `5432` |
| `POSTGRES_USER` | PostgreSQL user | Yes | `carbonuser` |
| `POSTGRES_PASSWORD` | PostgreSQL password | **Yes** | - |
| `POSTGRES_DB` | PostgreSQL database | Yes | `carbon_depict` |
| `MONGO_URI` | MongoDB connection string | Yes | Auto-generated |
| `MONGO_USER` | MongoDB user | Yes | `carbonuser` |
| `MONGO_PASSWORD` | MongoDB password | **Yes** | - |
| `MONGO_DB` | MongoDB database | Yes | `carbon_depict` |
| `REDIS_HOST` | Redis host | Yes | `redis` |
| `REDIS_PORT` | Redis port | Yes | `6379` |
| `REDIS_PASSWORD` | Redis password | **Yes** | - |
| `JWT_SECRET` | JWT signing secret | **Yes** | - |
| `JWT_EXPIRE` | JWT expiration | Yes | `7d` |
| `DEFRA_API_KEY` | DEFRA emissions API | No | - |
| `OPENAI_API_KEY` | OpenAI API | No | - |
| `CORS_ORIGIN` | Allowed CORS origins | Yes | `*` |
| `SESSION_SECRET` | Session signing secret | Yes | Auto-generated |
| `RATE_LIMIT_WINDOW` | Rate limit window (min) | Yes | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | Yes | `100` |

---

## Production Deployment

### Step-by-Step Production Deployment

#### 1. Prepare Environment

```bash
# Clone repository
git clone https://github.com/yourusername/carbon-depict.git
cd carbon-depict

# Copy and configure environment
cp .env.example .env
nano .env  # Edit all required variables
```

#### 2. Security Checklist

- [ ] Changed all default passwords
- [ ] Generated strong JWT secret (32+ chars)
- [ ] Configured CORS with specific origins (not `*`)
- [ ] Enabled HTTPS/SSL (see SSL Setup below)
- [ ] Configured firewall rules (ports 80, 443 only)
- [ ] Set up database backups (see Database Management)
- [ ] Reviewed and restricted database access
- [ ] Enabled rate limiting
- [ ] Configured logging and monitoring

#### 3. Deploy

```bash
# Make scripts executable (Linux/macOS)
chmod +x deploy.sh scripts/*.sh

# Deploy
./deploy.sh
```

#### 4. Verify Deployment

```bash
# Check all services are running
docker-compose ps

# Check health endpoints
curl http://localhost:5500/api/health
curl http://localhost:3500/health

# View logs
docker-compose logs -f
```

#### 5. Post-Deployment Tasks

```bash
# Set up database backups (cron job)
crontab -e
# Add: 0 2 * * * /path/to/carbon-depict/scripts/backup.sh

# Configure monitoring (see Monitoring section)

# Set up SSL certificates (see SSL Setup section)
```

### Production Architecture

```
                    ┌─────────────┐
                    │   Internet  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Nginx    │
                    │   (Port 80) │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
       ┌──────▼──────┐           ┌─────▼──────┐
       │  Frontend   │           │  Backend   │
       │  (Port 3500)│           │ (Port 5500)│
       └─────────────┘           └─────┬──────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
             ┌──────▼──────┐    ┌─────▼─────┐    ┌──────▼──────┐
             │  PostgreSQL │    │  MongoDB  │    │    Redis    │
             │  (Port 5432)│    │(Port 27017│    │  (Port 6379)│
             └─────────────┘    └───────────┘    └─────────────┘
```

### Scaling Production

#### Horizontal Scaling (Multiple Instances)

Update `docker-compose.yml`:

```yaml
backend:
  deploy:
    replicas: 3  # Run 3 backend instances
    resources:
      limits:
        cpus: '1.0'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

#### Load Balancing

Add to `nginx.conf`:

```nginx
upstream backend_servers {
    least_conn;
    server backend:5500;
    server backend:5501;
    server backend:5502;
}

server {
    location /api {
        proxy_pass http://backend_servers;
    }
}
```

---

## Development Deployment

### Quick Start Development

```bash
# Start development environment
./scripts/start-dev.sh  # Linux/macOS
# or
scripts\start-dev.bat   # Windows
```

### Development Features

- ✅ **Hot Module Replacement (HMR)**: Frontend updates instantly
- ✅ **Nodemon Auto-Restart**: Backend restarts on code changes
- ✅ **Volume Mounts**: Edit code locally, changes reflect in container
- ✅ **Debug-Friendly**: Source maps, verbose logging
- ✅ **Direct Database Access**: Connect to databases from host

### Development URLs

- **Frontend**: http://localhost:3500 (Vite dev server)
- **Backend**: http://localhost:5500 (Nodemon)
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### Development Workflow

```bash
# Start services
./scripts/start-dev.sh

# View logs (all services)
./scripts/logs.sh dev

# View logs (specific service)
./scripts/logs.sh backend-dev

# Restart a service
docker-compose -f docker-compose.dev.yml restart backend-dev

# Execute commands in container
docker-compose -f docker-compose.dev.yml exec backend-dev npm run test

# Stop services
./scripts/stop.sh dev
```

### Debugging in Development

#### Backend Debugging (Node.js)

Update `server/Dockerfile.dev`:

```dockerfile
# Add debug flag
CMD ["node", "--inspect=0.0.0.0:9229", "index.js"]
```

Update `docker-compose.dev.yml`:

```yaml
backend-dev:
  ports:
    - "5500:5500"
    - "9229:9229"  # Debug port
```

Connect VS Code debugger:

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "attach",
  "name": "Docker: Attach to Node",
  "address": "localhost",
  "port": 9229,
  "localRoot": "${workspaceFolder}/server",
  "remoteRoot": "/app"
}
```

#### Frontend Debugging

Open Chrome DevTools at http://localhost:3500 (source maps enabled)

---

## Cloud Deployment

### AWS Deployment

#### Option 1: AWS ECS (Elastic Container Service)

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name carbon-depict/frontend
aws ecr create-repository --repository-name carbon-depict/backend

# Build and push images
docker build -t carbon-depict/frontend .
docker tag carbon-depict/frontend:latest $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/carbon-depict/frontend:latest
docker push $AWS_ACCOUNT.dkr.ecr.$REGION.amazonaws.com/carbon-depict/frontend:latest

# Create ECS task definition (use docker-compose.yml as reference)
# Deploy via AWS Console or CLI
```

#### Option 2: AWS Lightsail (Simpler)

```bash
# Create Lightsail container service
aws lightsail create-container-service \
  --service-name carbon-depict \
  --power medium \
  --scale 1

# Deploy containers
aws lightsail create-container-service-deployment \
  --service-name carbon-depict \
  --containers file://lightsail-containers.json
```

### Google Cloud Platform (GCP)

#### GCP Cloud Run

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Authenticate
gcloud auth login

# Build and push to GCR
gcloud builds submit --tag gcr.io/$PROJECT_ID/carbon-depict-frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/carbon-depict-backend server/

# Deploy to Cloud Run
gcloud run deploy carbon-depict-frontend \
  --image gcr.io/$PROJECT_ID/carbon-depict-frontend \
  --platform managed \
  --allow-unauthenticated
```

### Microsoft Azure

#### Azure Container Instances

```bash
# Install Azure CLI
curl -L https://aka.ms/InstallAzureCli | bash

# Login
az login

# Create resource group
az group create --name carbon-depict-rg --location eastus

# Create container registry
az acr create --resource-group carbon-depict-rg --name carbondepictacr --sku Basic

# Build and push
az acr build --registry carbondepictacr --image carbon-depict-frontend .
az acr build --registry carbondepictacr --image carbon-depict-backend server/

# Deploy
az container create \
  --resource-group carbon-depict-rg \
  --name carbon-depict \
  --image carbondepictacr.azurecr.io/carbon-depict-frontend \
  --dns-name-label carbon-depict \
  --ports 80
```

### DigitalOcean App Platform

```bash
# Install doctl
snap install doctl

# Authenticate
doctl auth init

# Create app from spec
doctl apps create --spec .do/app.yaml
```

Create `.do/app.yaml`:

```yaml
name: carbon-depict
services:
  - name: frontend
    github:
      repo: yourusername/carbon-depict
      branch: main
      deploy_on_push: true
    dockerfile_path: Dockerfile
    http_port: 3500
  - name: backend
    github:
      repo: yourusername/carbon-depict
      branch: main
    dockerfile_path: server/Dockerfile
    http_port: 5500
databases:
  - name: postgres
    engine: PG
    version: "15"
  - name: mongodb
    engine: MONGODB
    version: "7"
  - name: redis
    engine: REDIS
    version: "7"
```

---

## Database Management

### Database Backups

#### Automated Backups

```bash
# Run backup script
./scripts/backup.sh

# Schedule daily backups (Linux/macOS)
crontab -e
# Add: 0 2 * * * /path/to/carbon-depict/scripts/backup.sh

# Windows Task Scheduler
schtasks /create /tn "Carbon Depict Backup" /tr "C:\path\to\backup.sh" /sc daily /st 02:00
```

#### Manual Backups

**PostgreSQL:**
```bash
# Backup
docker-compose exec postgres pg_dump -U carbonuser carbon_depict > backup.sql

# Restore
docker-compose exec -T postgres psql -U carbonuser carbon_depict < backup.sql
```

**MongoDB:**
```bash
# Backup
docker-compose exec mongodb mongodump --username=carbonuser --password=$MONGO_PASSWORD --authenticationDatabase=admin --out=/backup

# Restore
docker-compose exec mongodb mongorestore --username=carbonuser --password=$MONGO_PASSWORD --authenticationDatabase=admin /backup
```

### Database Migrations

#### PostgreSQL Migrations (using Sequelize)

```bash
# Create migration
docker-compose exec backend npx sequelize-cli migration:generate --name add-esg-scores

# Run migrations
docker-compose exec backend npx sequelize-cli db:migrate

# Rollback
docker-compose exec backend npx sequelize-cli db:migrate:undo
```

#### MongoDB Migrations (using migrate-mongo)

```bash
# Create migration
docker-compose exec backend npx migrate-mongo create add-esg-indexes

# Run migrations
docker-compose exec backend npx migrate-mongo up

# Rollback
docker-compose exec backend npx migrate-mongo down
```

### Database Seeding

Create seed data for testing:

```bash
# Seed development data
docker-compose -f docker-compose.dev.yml exec backend-dev npm run seed

# Seed production data (be careful!)
docker-compose exec backend npm run seed:prod
```

### Database Access

#### Direct Database Access

**PostgreSQL:**
```bash
docker-compose exec postgres psql -U carbonuser carbon_depict
```

**MongoDB:**
```bash
docker-compose exec mongodb mongosh -u carbonuser -p $MONGO_PASSWORD --authenticationDatabase admin carbon_depict
```

**Redis:**
```bash
docker-compose exec redis redis-cli -a $REDIS_PASSWORD
```

#### GUI Tools

**PostgreSQL** - pgAdmin:
```bash
docker run -p 8080:80 -e PGADMIN_DEFAULT_EMAIL=admin@admin.com -e PGADMIN_DEFAULT_PASSWORD=admin dpage/pgadmin4
# Access: http://localhost:8080
```

**MongoDB** - Mongo Express:
```bash
docker run -p 8081:8081 -e ME_CONFIG_MONGODB_URL="$MONGO_URI" mongo-express
# Access: http://localhost:8081
```

---

## SSL/HTTPS Setup

### Option 1: Let's Encrypt (Recommended)

#### Install Certbot

```bash
# Ubuntu/Debian
sudo apt-get install certbot python3-certbot-nginx

# macOS
brew install certbot
```

#### Generate Certificates

```bash
# Stop nginx if running
docker-compose stop nginx

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

#### Configure Nginx for HTTPS

Update `nginx.default.conf`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # ... rest of configuration
}
```

#### Update docker-compose.yml

```yaml
nginx:
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
    - ./nginx.default.conf:/etc/nginx/conf.d/default.conf:ro
    - /etc/letsencrypt:/etc/letsencrypt:ro  # Mount certificates
  ports:
    - "80:80"
    - "443:443"  # Add HTTPS port
```

#### Auto-Renew Certificates

```bash
# Test renewal
sudo certbot renew --dry-run

# Add to crontab
sudo crontab -e
# Add: 0 3 * * * certbot renew --quiet && docker-compose restart nginx
```

### Option 2: Self-Signed Certificates (Development)

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ./ssl/private.key \
  -out ./ssl/certificate.crt

# Update nginx.default.conf
ssl_certificate /etc/nginx/ssl/certificate.crt;
ssl_certificate_key /etc/nginx/ssl/private.key;

# Mount in docker-compose.yml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
```

### Option 3: Cloudflare SSL

1. Add your domain to Cloudflare
2. Set SSL/TLS mode to "Full"
3. Enable "Always Use HTTPS"
4. Use Origin Certificates in Nginx

---

## Monitoring & Logging

### Built-in Health Checks

```bash
# Backend health
curl http://localhost:5500/api/health

# Frontend health
curl http://localhost:3500/health

# Docker health status
docker-compose ps
```

### Logging

#### View Logs

```bash
# All services
./scripts/logs.sh

# Specific service
./scripts/logs.sh backend

# Development
./scripts/logs.sh dev

# Last 100 lines
docker-compose logs --tail=100

# Follow logs
docker-compose logs -f backend
```

#### Configure Log Rotation

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### Prometheus + Grafana Setup

#### Add to docker-compose.yml

```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana-data:/var/lib/grafana
```

#### Create prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'carbon-depict'
    static_configs:
      - targets: ['backend:5500']
```

#### Add Metrics to Backend

Install prom-client:
```bash
npm install prom-client
```

Add to `server/index.js`:
```javascript
const promClient = require('prom-client');
const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

Add to `docker-compose.yml`:

```yaml
elasticsearch:
  image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
  environment:
    - discovery.type=single-node
    - xpack.security.enabled=false
  ports:
    - "9200:9200"

kibana:
  image: docker.elastic.co/kibana/kibana:8.11.0
  ports:
    - "5601:5601"
  depends_on:
    - elasticsearch

logstash:
  image: docker.elastic.co/logstash/logstash:8.11.0
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
  depends_on:
    - elasticsearch
```

### Application Performance Monitoring (APM)

#### Option 1: New Relic

```bash
# Install New Relic agent
npm install newrelic

# Add to backend
require('newrelic');
```

#### Option 2: Datadog

```yaml
# Add to docker-compose.yml
datadog:
  image: datadog/agent:latest
  environment:
    - DD_API_KEY=${DD_API_KEY}
    - DD_SITE=datadoghq.com
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - /proc/:/host/proc/:ro
    - /sys/fs/cgroup/:/host/sys/fs/cgroup:ro
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:**
```
Error starting userland proxy: listen tcp 0.0.0.0:3500: bind: address already in use
```

**Solution:**
```bash
# Find process using the port
lsof -i :3500  # Linux/macOS
netstat -ano | findstr :3500  # Windows

# Kill the process
kill -9 <PID>  # Linux/macOS
taskkill /PID <PID> /F  # Windows

# Or change port in .env
FRONTEND_PORT=3501
```

#### 2. Permission Denied (Volumes)

**Error:**
```
ERROR: for postgres  Cannot create container: Error response from daemon: create postgres-data: permission denied
```

**Solution:**
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./data

# Or use named volumes (recommended)
volumes:
  postgres-data:  # Docker manages permissions
```

#### 3. Database Connection Failed

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if database is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Wait for database to be ready
docker-compose exec backend npm run wait-for-db

# Verify connection string in .env
POSTGRES_HOST=postgres  # Use service name, not localhost
```

#### 4. Build Context Size Too Large

**Error:**
```
Sending build context to Docker daemon  2.5GB
```

**Solution:**
```bash
# Clean build cache
docker builder prune

# Ensure .dockerignore is present
ls -la .dockerignore

# Add node_modules to .dockerignore
echo "node_modules" >> .dockerignore
```

#### 5. Out of Memory

**Error:**
```
Error: Cannot allocate memory
```

**Solution:**
```bash
# Increase Docker memory limit (Docker Desktop)
# Settings > Resources > Memory: 4GB+

# Add memory limits to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

#### 6. SSL Certificate Verification Failed

**Error:**
```
Error: unable to verify the first certificate
```

**Solution:**
```bash
# Development: Disable SSL verification (not for production!)
NODE_TLS_REJECT_UNAUTHORIZED=0

# Production: Install certificates
update-ca-certificates  # Linux
```

#### 7. Container Keeps Restarting

**Error:**
```
backend    exited with code 1
backend    restarting
```

**Solution:**
```bash
# Check logs for error
docker-compose logs backend

# Common causes:
# - Missing environment variables
# - Database not ready
# - Port already in use
# - Syntax error in code

# Disable restart to debug
docker-compose up --no-deps backend
```

### Health Check Commands

```bash
# Check Docker daemon
docker info

# Check container status
docker-compose ps

# Check container health
docker inspect --format='{{json .State.Health}}' <container_name>

# Check network connectivity
docker-compose exec backend ping postgres
docker-compose exec backend nc -zv postgres 5432

# Check disk space
df -h  # Linux/macOS
wmic logicaldisk get size,freespace,caption  # Windows

# Check memory
free -h  # Linux
vm_stat  # macOS
systeminfo | findstr Memory  # Windows
```

### Debug Mode

Enable verbose logging:

**.env:**
```env
NODE_ENV=development
LOG_LEVEL=debug
```

**docker-compose.yml:**
```yaml
backend:
  environment:
    - DEBUG=express:*,sequelize:*
```

### Clean Reset

Start fresh if everything breaks:

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (CAUTION: deletes all data!)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Clean Docker system
docker system prune -a --volumes

# Rebuild from scratch
./deploy.sh
```

---

## Performance Optimization

### Database Optimization

**PostgreSQL:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_esg_scores_company ON esg_scores(company_id);
CREATE INDEX idx_emissions_date ON emissions(date DESC);

-- Analyze tables
ANALYZE esg_scores;
ANALYZE emissions;
```

**MongoDB:**
```javascript
// Add indexes
db.esg_data.createIndex({ companyId: 1, framework: 1 });
db.emissions.createIndex({ date: -1 });
```

### Caching Strategy

**Redis caching:**
```javascript
// server/middleware/cache.js
const redis = require('redis');
const client = redis.createClient({ host: 'redis' });

const cache = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  const cached = await client.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  res.sendResponse = res.json;
  res.json = (body) => {
    client.setex(key, duration, JSON.stringify(body));
    res.sendResponse(body);
  };
  next();
};

// Use in routes
app.get('/api/esg/scores', cache(300), getESGScores);
```

### Frontend Optimization

**Vite build optimization:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['chart.js', 'recharts'],
          'utils': ['axios', 'date-fns', 'lodash']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
};
```

---

## Security Checklist

- [ ] Changed all default passwords
- [ ] JWT secret is strong and unique
- [ ] CORS configured with specific origins
- [ ] SSL/HTTPS enabled
- [ ] Database ports not exposed to public
- [ ] Rate limiting enabled
- [ ] Security headers configured (CSP, X-Frame-Options)
- [ ] Input validation and sanitization
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection enabled
- [ ] CSRF protection enabled
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Firewall rules configured
- [ ] Monitoring and alerting set up
- [ ] Secrets not in version control
- [ ] Docker images regularly updated
- [ ] Container running as non-root user
- [ ] Minimal base images used
- [ ] Vulnerabilities scanned (Trivy, Snyk)

---

## Support

For issues and questions:

- **GitHub Issues**: https://github.com/yourusername/carbon-depict/issues
- **Documentation**: https://github.com/yourusername/carbon-depict/wiki
- **Email**: support@carbondepict.com

---

## License

Copyright © 2024 Carbon Depict. All rights reserved.
