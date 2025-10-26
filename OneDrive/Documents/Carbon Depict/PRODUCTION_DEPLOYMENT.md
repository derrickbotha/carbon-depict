# Carbon Depict - Production Deployment Guide

## 📋 Overview

This guide covers deploying the Carbon Depict ESG platform to production with MongoDB as the primary database, optional Redis for background jobs, and full calculation capabilities.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React + Vite (Port 3500)
- **Backend**: Node.js + Express (Port 5500)
- **Database**: MongoDB (Primary data store)
- **Cache/Queue**: Redis (Optional - for background jobs)
- **WebSocket**: Socket.io (Real-time updates)

### Data Flow
```
User Input → Frontend → API Routes → Calculation Services → MongoDB
                                  ↓
                         Background Jobs (Redis) → Email/Reports
```

## 📦 Prerequisites

### Required
- Node.js 18+ (LTS)
- MongoDB 4.4+ (or MongoDB Atlas account)
- npm or yarn

### Optional
- Redis 6+ (for background job processing)
- SMTP server credentials (for email notifications)
- SSL certificates (for production HTTPS)

## 🚀 Installation

### 1. Clone and Install Dependencies

```bash
cd carbon-depict
npm install
cd server
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
```bash
cd server
cp .env.production.example .env.production
```

Edit `.env.production` with your production values:

```env
# Server
PORT=5500
NODE_ENV=production
CLIENT_URL=https://your-domain.com

# MongoDB (Use MongoDB Atlas for production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/carbondepict_prod

# Redis (Optional but recommended for production)
REDIS_ENABLED=true
REDIS_HOST=your-redis-host.cloud.redislabs.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security (Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
JWT_SECRET=your-production-jwt-secret-64-chars
SESSION_SECRET=your-production-session-secret-64-chars

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@your-domain.com

# AI (Optional)
AI_API_KEY=your-ai-api-key
```

#### Frontend (.env.production)
```bash
cd ..  # Return to root
cp .env.production.example .env.production
```

Edit `.env.production`:
```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=Carbon Depict
```

### 3. Run Database Migrations

```bash
cd server
node migrations/run.js
```

This will:
- Create necessary MongoDB indexes
- Set up TTL indexes for log expiration
- Optimize query performance

### 4. Seed Initial Data

```bash
# Create admin user and default company
node setup-database.js

# OR create custom admin
node create-user.js --email admin@yourcompany.com --password YourStrongPassword --createCompany=true
```

### 5. Build Frontend

```bash
cd ..  # Return to root
npm run build
```

This creates optimized production files in `dist/`.

## 🌐 Deployment Options

### Option 1: Traditional VPS/Server

#### Using PM2 (Recommended)

1. **Install PM2 globally**:
```bash
npm install -g pm2
```

2. **Create PM2 ecosystem file** (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [
    {
      name: 'carbondepict-api',
      cwd: './server',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5500
      },
      instances: 2,  // Use CPU cores
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true
    }
  ]
}
```

3. **Start with PM2**:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # Auto-start on reboot
```

4. **Serve frontend with Nginx**:

```nginx
# /etc/nginx/sites-available/carbondepict
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/carbon-depict/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API Proxy
    location /api {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

5. **Enable SSL with Let's Encrypt**:
```bash
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

#### 1. Backend Dockerfile

```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5500

CMD ["node", "index.js"]
```

#### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: carbondepict

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  api:
    build: ./server
    restart: always
    ports:
      - "5500:5500"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/carbondepict
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    env_file:
      - ./server/.env.production
    depends_on:
      - mongodb
      - redis

  frontend:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - api

volumes:
  mongodb_data:
  redis_data:
```

#### 3. Deploy with Docker

```bash
docker-compose up -d
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Install Heroku CLI
heroku login
heroku create carbondepict-api

# Add MongoDB Atlas add-on
heroku addons:create mongolab

# Configure env variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

#### AWS / Azure / GCP

Use their respective deployment guides with:
- **MongoDB Atlas** for database
- **Redis Cloud** for caching
- **CloudFront/Azure CDN** for frontend static files
- **EC2/App Service/Compute Engine** for backend

## 📊 Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Cluster**:
   - Sign up at mongodb.com/cloud/atlas
   - Create a free M0 cluster or paid tier
   - Choose region closest to users

2. **Configure Network Access**:
   - Add IP addresses or allow all (0.0.0.0/0) for cloud deployments
   - Use VPC peering for enhanced security

3. **Create Database User**:
   ```
   Username: carbondepict_app
   Password: [strong password]
   Role: readWrite
   ```

4. **Get Connection String**:
   ```
   mongodb+srv://carbondepict_app:<password>@cluster.mongodb.net/carbondepict_prod
   ```

5. **Run Migrations**:
   ```bash
   MONGODB_URI="your-atlas-uri" node migrations/run.js
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["root"]
})
```

## 🔐 Security Checklist

### Pre-Deployment
- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (64+ characters)
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS whitelist
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure helmet.js security headers
- [ ] Enable MongoDB encryption at rest
- [ ] Set up automated backups

### Post-Deployment
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure log rotation
- [ ] Enable MongoDB audit logging
- [ ] Set up intrusion detection
- [ ] Regular security updates
- [ ] Penetration testing

## 📈 Performance Optimization

### MongoDB
```javascript
// Create indexes (run migrations)
node migrations/run.js

// Monitor slow queries
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().limit(5).sort({ ts: -1 })
```

### Backend
- Use clustering with PM2
- Enable gzip compression
- Implement Redis caching for frequent queries
- Use CDN for static assets

### Frontend
- Enable code splitting
- Lazy load components
- Optimize images
- Use service worker for offline capability

## 🔍 Monitoring & Logging

### Application Monitoring

```javascript
// server/index.js - Add monitoring
const { connectDatabases } = require('./config/database')

// Health check endpoint
app.get('/api/health/detailed', async (req, res) => {
  const health = await checkDatabaseHealth()
  res.json(health)
})
```

### Log Management

```bash
# PM2 Logs
pm2 logs carbondepict-api

# MongoDB Logs
sudo tail -f /var/log/mongodb/mongod.log

# Nginx Logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Recommended Tools
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Performance**: New Relic, DataDog
- **Log Aggregation**: Papertrail, Loggly

## 🔄 Backup & Disaster Recovery

### Automated MongoDB Backups

```bash
# Create backup script (backup.sh)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Keep only last 30 days
find $BACKUP_DIR -type d -mtime +30 -exec rm -rf {} \;

# Add to crontab for daily backups at 2 AM
# 0 2 * * * /path/to/backup.sh
```

### MongoDB Atlas Automated Backups
- Enable continuous backups
- Set retention period (7-30 days)
- Configure point-in-time recovery
- Test restore procedures

## 🚦 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install
          cd server && npm install
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: npm run build
      
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/carbondepict
```

## 📞 Support & Troubleshooting

### Common Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"
```

**Redis Connection Issues**
```bash
# Check Redis status
redis-cli ping

# Check Redis configuration
redis-cli CONFIG GET *
```

**High Memory Usage**
```bash
# Monitor with PM2
pm2 monit

# Check MongoDB memory
db.serverStatus().mem
```

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt SSL](https://letsencrypt.org/getting-started/)

## ✅ Post-Deployment Checklist

- [ ] Backend server running on port 5500
- [ ] Frontend accessible at your domain
- [ ] MongoDB connection successful
- [ ] Redis working (if enabled)
- [ ] SSL certificate installed and auto-renewal configured
- [ ] Environment variables set correctly
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Backups configured and tested
- [ ] Monitoring and alerts set up
- [ ] Error tracking enabled
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on deployment procedures

---

**Need Help?** Check the troubleshooting guide or contact support.
