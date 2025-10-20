# Carbon Depict - Quick Deployment Reference

## One-Page Quick Start

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum

### Deploy in 3 Commands

```bash
cp .env.example .env  # Copy template
nano .env             # Edit: Set passwords & JWT_SECRET
./deploy.sh           # Deploy (Linux/macOS) or deploy.bat (Windows)
```

### Access Your Application
- Frontend: http://localhost:3500
- Backend: http://localhost:5500
- Health: http://localhost:5500/api/health

---

## Essential Commands

| Task | Command |
|------|---------|
| **Start production** | `./deploy.sh` or `deploy.bat` |
| **Start development** | `./scripts/start-dev.sh` |
| **View logs** | `docker-compose logs -f` |
| **View specific logs** | `docker-compose logs -f backend` |
| **Stop services** | `docker-compose down` |
| **Restart service** | `docker-compose restart backend` |
| **Check status** | `docker-compose ps` |
| **Backup database** | `./scripts/backup.sh` |
| **Clean rebuild** | `docker-compose down -v && ./deploy.sh` |

---

## Critical Environment Variables

**Must Change These:**
```env
POSTGRES_PASSWORD=your_strong_password_here
MONGO_PASSWORD=your_strong_password_here
REDIS_PASSWORD=your_strong_password_here
JWT_SECRET=your_32_char_random_key_here
```

**Generate Strong JWT Secret:**
```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
```

---

## Quick Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3500              # macOS/Linux
netstat -ano | findstr :3500  # Windows
kill -9 <PID>              # macOS/Linux
taskkill /PID <PID> /F     # Windows
```

### Database Won't Start
```bash
docker-compose logs postgres
docker-compose restart postgres
docker-compose exec postgres pg_isready
```

### Complete Reset (Deletes Data!)
```bash
docker-compose down -v
docker system prune -a
./deploy.sh
```

---

## Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3500 | http://localhost:3500 |
| Backend | 5500 | http://localhost:5500 |
| PostgreSQL | 5432 | localhost:5432 |
| MongoDB | 27017 | localhost:27017 |
| Redis | 6379 | localhost:6379 |
| Nginx (optional) | 80/443 | http://localhost |

---

## Security Quick Wins

1. ✅ Change all default passwords in `.env`
2. ✅ Generate strong JWT_SECRET (32+ chars)
3. ✅ Set CORS_ORIGIN to your domain (not `*`)
4. ✅ Enable SSL/HTTPS for production
5. ✅ Set up automated backups (cron job)
6. ✅ Update SMTP settings for email notifications

---

## Backup & Restore

**Backup:**
```bash
./scripts/backup.sh
# Creates: backups/YYYYMMDD_HHMMSS.tar.gz
```

**Restore:**
```bash
# Extract backup
tar -xzf backups/20240101_120000.tar.gz

# Restore PostgreSQL
docker-compose exec -T postgres psql -U carbonuser carbon_depict < backup.sql

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup
```

**Automated Backups (cron):**
```bash
crontab -e
# Add: 0 2 * * * /path/to/carbon-depict/scripts/backup.sh
```

---

## Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| **Start command** | `./scripts/start-dev.sh` | `./deploy.sh` |
| **Hot reload** | ✅ Enabled | ❌ Disabled |
| **Source maps** | ✅ Enabled | ❌ Disabled |
| **Debug mode** | ✅ On | ❌ Off |
| **Nginx** | ❌ Not used | ✅ Optional |
| **Data volumes** | Temporary | Persistent |
| **Build time** | Fast | Optimized |
| **Image size** | Larger | Smaller |

---

## Health Checks

**Backend Health:**
```bash
curl http://localhost:5500/api/health
# Response: {"status":"ok","timestamp":"..."}
```

**Frontend Health:**
```bash
curl http://localhost:3500/health
# Response: healthy
```

**Database Health:**
```bash
# PostgreSQL
docker-compose exec postgres pg_isready

# MongoDB
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Redis
docker-compose exec redis redis-cli -a $REDIS_PASSWORD ping
```

---

## File Structure

```
carbon-depict/
├── src/                 # Frontend React code
├── server/              # Backend Node.js code
├── scripts/             # Helper scripts
│   ├── start-dev.sh    # Start dev environment
│   ├── stop.sh         # Stop services
│   ├── logs.sh         # View logs
│   └── backup.sh       # Backup databases
├── Dockerfile           # Frontend production build
├── Dockerfile.dev       # Frontend dev build
├── server/Dockerfile    # Backend production build
├── server/Dockerfile.dev # Backend dev build
├── docker-compose.yml   # Production orchestration
├── docker-compose.dev.yml # Dev orchestration
├── nginx.conf           # Nginx main config
├── nginx.default.conf   # Nginx server block
├── .env.example         # Environment template
├── deploy.sh           # Production deploy script
└── DEPLOYMENT.md       # Full documentation
```

---

## Cloud Deployment Quick Links

**AWS ECS:**
```bash
aws ecr create-repository --repository-name carbon-depict/frontend
docker build -t carbon-depict/frontend .
# Push to ECR and deploy via ECS Console
```

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/$PROJECT/carbon-depict-frontend
gcloud run deploy --image gcr.io/$PROJECT/carbon-depict-frontend
```

**Azure Container Instances:**
```bash
az acr build --registry myregistry --image carbon-depict-frontend .
az container create --resource-group mygroup --image myregistry.azurecr.io/carbon-depict-frontend
```

**DigitalOcean:**
```bash
doctl apps create --spec .do/app.yaml
```

---

## Get Help

- Full docs: See `DEPLOYMENT.md`
- GitHub: https://github.com/yourusername/carbon-depict
- Issues: https://github.com/yourusername/carbon-depict/issues

---

## Next Steps After Deployment

1. ✅ Verify all services are running: `docker-compose ps`
2. ✅ Check health endpoints
3. ✅ Set up SSL certificates (Let's Encrypt)
4. ✅ Configure automated backups
5. ✅ Set up monitoring (Prometheus/Grafana)
6. ✅ Configure firewall rules
7. ✅ Test application functionality
8. ✅ Set up CI/CD pipeline (optional)

---

**🎉 You're ready to go! Questions? Check DEPLOYMENT.md for detailed guide.**
