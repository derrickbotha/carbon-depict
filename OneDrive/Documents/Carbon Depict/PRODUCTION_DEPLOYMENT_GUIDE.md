# 🚀 CarbonDepict Production Deployment Guide

## Prerequisites

- Node.js 18+ 
- MongoDB 6+
- Redis (optional, for caching)
- SSL Certificate
- Domain name

## Environment Setup

### 1. Create Production Environment File

Create `server/.env` with the following variables:

```env
# Production Environment
NODE_ENV=production
PORT=5500
CLIENT_URL=https://yourdomain.com

# Database Configuration
MONGODB_URI=mongodb://username:password@your-mongodb-host:27017/carbondepict
MONGO_POOL_MAX=20
MONGO_POOL_MIN=5

# Redis Configuration (Optional)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security (REQUIRED - Generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret-minimum-32-characters

# Email Configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@yourdomain.com

# AI Integration (Optional)
AI_API_KEY=your-api-key
AI_API_URL=https://api.x.ai/v1/chat/completions

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=/var/www/carbondepict/uploads

# Logging
LOG_LEVEL=warn
LOG_FILE=/var/log/carbondepict/app.log
```

### 2. Generate Strong Secrets

```bash
# Generate JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Setup

### MongoDB Production Configuration

```javascript
// mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled

replication:
  replSetName: "rs0"
```

### Create Database User

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your-admin-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create application user
use carbondepict
db.createUser({
  user: "carbondepict",
  pwd: "your-app-password",
  roles: ["readWrite"]
})
```

## Application Deployment

### 1. Build Application

```bash
# Install dependencies
npm ci --production

# Build frontend
npm run build

# Build backend (if needed)
cd server
npm ci --production
```

### 2. PM2 Process Management

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'carbondepict-api',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5500
    },
    error_file: '/var/log/carbondepict/error.log',
    out_file: '/var/log/carbondepict/out.log',
    log_file: '/var/log/carbondepict/combined.log',
    time: true
  }]
}
```

Start with PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/carbondepict`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend (React App)
    location / {
        root /var/www/carbondepict/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5500;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    client_max_body_size 20M;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/carbondepict /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Security Checklist

### ✅ Environment Security
- [ ] All secrets are in environment variables
- [ ] No hardcoded credentials in code
- [ ] Strong JWT and session secrets (32+ chars)
- [ ] Database credentials secured

### ✅ Application Security
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Input validation on all endpoints
- [ ] Authentication required for protected routes

### ✅ Infrastructure Security
- [ ] HTTPS enabled with valid certificate
- [ ] Firewall configured (only ports 80, 443, 22)
- [ ] Database access restricted to application server
- [ ] Regular security updates applied
- [ ] Log monitoring enabled

### ✅ Data Security
- [ ] Database backups automated
- [ ] Sensitive data encrypted at rest
- [ ] GDPR compliance measures in place
- [ ] Data retention policies implemented

## Monitoring & Logging

### 1. Application Monitoring

```bash
# Install monitoring tools
npm install -g pm2-logrotate

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 2. System Monitoring

```bash
# Install system monitoring
sudo apt install htop iotop nethogs

# Monitor logs
sudo tail -f /var/log/carbondepict/combined.log
```

### 3. Health Checks

The application includes health check endpoints:

- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system status

## Backup Strategy

### Database Backup

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://username:password@localhost:27017/carbondepict" --out="/backups/mongodb_$DATE"
tar -czf "/backups/mongodb_$DATE.tar.gz" "/backups/mongodb_$DATE"
rm -rf "/backups/mongodb_$DATE"
```

### Application Backup

```bash
#!/bin/bash
# app-backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "/backups/app_$DATE.tar.gz" /var/www/carbondepict
```

### Automated Backups

Add to crontab:

```bash
# Daily database backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly application backup on Sundays at 3 AM
0 3 * * 0 /path/to/app-backup.sh
```

## Performance Optimization

### 1. Database Optimization

```javascript
// Add indexes for common queries
db.ghgemissions.createIndex({ companyId: 1, reportingPeriod: 1 })
db.esgmetrics.createIndex({ companyId: 1, framework: 1 })
db.users.createIndex({ email: 1 }, { unique: true })
```

### 2. Application Optimization

```bash
# Enable gzip compression
# Already configured in nginx.conf

# Enable HTTP/2
# Already configured in nginx.conf

# Optimize PM2 settings
pm2 start ecosystem.config.js --max-memory-restart 1G
```

## Troubleshooting

### Common Issues

1. **Application won't start**
   - Check environment variables
   - Verify database connection
   - Check logs: `pm2 logs carbondepict-api`

2. **Database connection errors**
   - Verify MongoDB is running
   - Check connection string
   - Verify user permissions

3. **SSL certificate issues**
   - Verify certificate validity
   - Check nginx configuration
   - Test with: `openssl s_client -connect yourdomain.com:443`

### Log Locations

- Application logs: `/var/log/carbondepict/`
- Nginx logs: `/var/log/nginx/`
- MongoDB logs: `/var/log/mongodb/`
- System logs: `/var/log/syslog`

## Maintenance

### Regular Tasks

- **Daily**: Check application logs for errors
- **Weekly**: Review security logs and access patterns
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and rotate secrets

### Updates

```bash
# Update application
git pull origin main
npm ci --production
npm run build
pm2 restart carbondepict-api

# Update dependencies
npm audit fix
npm update
```

## Support

For production issues:
- Check logs first
- Review this guide
- Contact system administrator
- Create GitHub issue if needed

---

**Remember**: Always test deployments in a staging environment before production!
