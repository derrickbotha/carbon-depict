# Carbon Depict - Deployment Architecture & Workflow

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CARBON DEPICT PLATFORM                          │
│                     ESG Tracking & Emissions Management                  │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │   Internet   │
                              │   / Users    │
                              └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │    Nginx     │
                              │ (Port 80/443)│
                              │ Reverse Proxy│
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                                 │
            ┌───────▼────────┐              ┌────────▼────────┐
            │   FRONTEND      │              │    BACKEND      │
            │   Container     │              │   Container     │
            │                 │              │                 │
            │ React 18.2      │◄────────────►│ Node.js 18+     │
            │ Vite 5.0        │   REST API   │ Express 4.18    │
            │ Tailwind CSS    │              │ JWT Auth        │
            │ Chart.js 4.4    │              │ Helmet          │
            │                 │              │ Rate Limiting   │
            │ Port: 3500      │              │ Port: 5500      │
            │ User: nodejs    │              │ User: nodejs    │
            │ Health: /health │              │ Health: /api/   │
            └─────────────────┘              └────────┬────────┘
                                                      │
                                                      │
                        ┌─────────────────────────────┼──────────────────────┐
                        │                             │                      │
                ┌───────▼────────┐          ┌────────▼────────┐    ┌───────▼────────┐
                │  POSTGRESQL     │          │    MONGODB      │    │     REDIS      │
                │   Container     │          │   Container     │    │   Container    │
                │                 │          │                 │    │                │
                │ Version: 15     │          │ Version: 7      │    │ Version: 7     │
                │ Port: 5432      │          │ Port: 27017     │    │ Port: 6379     │
                │ User: carbonuser│          │ User: carbonuser│    │ Auth: password │
                │                 │          │                 │    │                │
                │ Data:           │          │ Data:           │    │ Data:          │
                │ - Companies     │          │ - ESG Frameworks│    │ - Cache        │
                │ - Emissions     │          │ - Assessments   │    │ - Sessions     │
                │ - ESG Metrics   │          │ - Documents     │    │ - Temp Data    │
                │ - Reports       │          │ - Engagements   │    │                │
                │                 │          │                 │    │                │
                └────────┬────────┘          └────────┬────────┘    └───────┬────────┘
                         │                            │                     │
                         │                            │                     │
                ┌────────▼────────┐          ┌────────▼────────┐    ┌──────▼─────────┐
                │  postgres-data  │          │  mongodb-data   │    │   redis-data   │
                │     Volume      │          │     Volume      │    │     Volume     │
                │  (Persistent)   │          │  (Persistent)   │    │  (Persistent)  │
                └─────────────────┘          └─────────────────┘    └────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        DOCKER NETWORK: carbon-depict-network             │
│                             Type: Bridge                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Production Deployment Workflow

```
┌─────────────────┐
│  1. PREPARE     │
│  Environment    │
└────────┬────────┘
         │
         │ cp .env.example .env
         │ Edit passwords & secrets
         │
         ▼
┌─────────────────┐
│  2. VALIDATE    │
│  Configuration  │
└────────┬────────┘
         │
         │ Check: POSTGRES_PASSWORD ✓
         │ Check: MONGO_PASSWORD ✓
         │ Check: REDIS_PASSWORD ✓
         │ Check: JWT_SECRET ✓
         │
         ▼
┌─────────────────┐
│  3. BUILD       │
│  Docker Images  │
└────────┬────────┘
         │
         │ Stage 1: Dependencies
         │ Stage 2: Build
         │ Stage 3: Production
         │
         ▼
┌─────────────────┐
│  4. START       │
│  Databases      │
└────────┬────────┘
         │
         │ Start: PostgreSQL
         │ Wait: Health check ✓
         │ Start: MongoDB
         │ Wait: Health check ✓
         │ Start: Redis
         │ Wait: Health check ✓
         │
         ▼
┌─────────────────┐
│  5. START       │
│  Backend API    │
└────────┬────────┘
         │
         │ Connect to databases
         │ Initialize routes
         │ Start Express server
         │ Wait: Health check ✓
         │
         ▼
┌─────────────────┐
│  6. START       │
│  Frontend       │
└────────┬────────┘
         │
         │ Serve static files
         │ Configure Nginx
         │ Enable SPA routing
         │ Wait: Health check ✓
         │
         ▼
┌─────────────────┐
│  7. VERIFY      │
│  Deployment     │
└────────┬────────┘
         │
         │ Test: Frontend access
         │ Test: Backend API
         │ Test: Database connections
         │ Review: Logs
         │
         ▼
┌─────────────────┐
│  8. MONITOR     │
│  & Maintain     │
└─────────────────┘
```

---

## 🔀 Development vs Production Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT MODE                               │
└──────────────────────────────────────────────────────────────────────┘

    Developer
       │
       │ npm run dev (Hot Reload)
       ▼
┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │
│   (Vite HMR) │◄───────►│  (Nodemon)   │
│              │         │              │
│ Volume Mount │         │ Volume Mount │
│ ./src/       │         │ ./server/    │
└──────────────┘         └──────┬───────┘
       ▲                        │
       │                        │
       │ Edit code locally      │
       │ Changes reflect        │
       │ instantly             │
       │                        ▼
    Developer            ┌──────────────┐
                         │  Databases   │
                         │  (Dev mode)  │
                         └──────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION MODE                                │
└──────────────────────────────────────────────────────────────────────┘

    Users
       │
       │ HTTPS/SSL
       ▼
┌──────────────┐
│    Nginx     │
│ Reverse Proxy│
└──────┬───────┘
       │
       │ Routes: /api → Backend
       │ Routes: /* → Frontend
       ▼
┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Backend    │
│  (Optimized) │◄───────►│ (Production) │
│              │         │              │
│ Static Files │         │ Rate Limited │
│ Gzip + Cache │         │ Helmet       │
└──────────────┘         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  Databases   │
                         │ (Production) │
                         │ + Backups    │
                         └──────────────┘
```

---

## 🔐 Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                         │
└──────────────────────────────────────────────────────────────┘

Layer 1: Network Security
┌──────────────────────────────────────┐
│  Firewall                             │
│  - Only ports 80, 443 exposed        │
│  - Internal network isolated         │
│  - Rate limiting enabled             │
└──────────────────────────────────────┘
            │
            ▼
Layer 2: Application Security
┌──────────────────────────────────────┐
│  Nginx                                │
│  - Security headers (CSP, XSS)       │
│  - SSL/TLS encryption                │
│  - Gzip compression                  │
└──────────────────────────────────────┘
            │
            ▼
Layer 3: Authentication & Authorization
┌──────────────────────────────────────┐
│  Backend (Express + JWT)              │
│  - JWT token authentication          │
│  - Role-based access control         │
│  - Session management                │
│  - Password hashing (bcrypt)         │
└──────────────────────────────────────┘
            │
            ▼
Layer 4: Data Security
┌──────────────────────────────────────┐
│  Databases                            │
│  - Encrypted connections             │
│  - Strong passwords                  │
│  - Non-root users                    │
│  - Backup encryption                 │
└──────────────────────────────────────┘
            │
            ▼
Layer 5: Container Security
┌──────────────────────────────────────┐
│  Docker                               │
│  - Non-root users (nodejs:1001)      │
│  - Multi-stage builds                │
│  - Minimal base images               │
│  - Health checks                     │
│  - Resource limits                   │
└──────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    ESG DATA COLLECTION FLOW                       │
└──────────────────────────────────────────────────────────────────┘

User Interface (React)
       │
       │ 1. User fills ESG form
       │    (GRI, TCFD, SBTi, etc.)
       ▼
┌──────────────────┐
│ ESG Data Manager │
│  (localStorage)  │
└────────┬─────────┘
         │
         │ 2. Save locally
         │    (offline support)
         ▼
     API Call
         │
         │ 3. POST /api/esg/metrics
         ▼
┌──────────────────┐
│  Backend API     │
│  (Validation)    │
└────────┬─────────┘
         │
         │ 4. Validate data
         │    Calculate scores
         │    Run AI analysis
         ▼
    Split Data
         │
    ┌────┴─────┐
    │          │
    ▼          ▼
┌──────┐  ┌──────┐
│ PG   │  │ Mongo│
│ SQL  │  │ NoSQL│
└──┬───┘  └───┬──┘
   │          │
   │ 5. Store:│ 5. Store:
   │ - Metrics│ - Frameworks
   │ - Scores │ - Assessments
   │          │ - Documents
   │          │
   └────┬─────┘
        │
        │ 6. Return success
        ▼
   Dashboard
        │
        │ 7. Display:
        │ - Real-time scores
        │ - Progress charts
        │ - Compliance status
        ▼
     User
```

---

## 🔄 Continuous Deployment Flow (CI/CD)

```
┌──────────────────────────────────────────────────────────────┐
│                     CI/CD PIPELINE (Optional)                 │
└──────────────────────────────────────────────────────────────┘

Developer
    │
    │ git push
    ▼
┌────────────┐
│   GitHub   │
└─────┬──────┘
      │
      │ Webhook trigger
      ▼
┌────────────┐
│  CI Server │
│ (GitHub    │
│  Actions)  │
└─────┬──────┘
      │
      ├─► 1. Lint Code (ESLint, Prettier)
      │
      ├─► 2. Run Tests (Jest, Cypress)
      │
      ├─► 3. Build Docker Images
      │      ├─ docker build -t frontend
      │      └─ docker build -t backend
      │
      ├─► 4. Scan for Vulnerabilities (Trivy)
      │
      ├─► 5. Push to Registry
      │      ├─ Docker Hub
      │      ├─ AWS ECR
      │      └─ Google GCR
      │
      └─► 6. Deploy
           │
           ├─► Staging
           │   ├─ Run smoke tests
           │   └─ Manual approval
           │
           └─► Production
               ├─ Rolling update
               ├─ Health checks
               └─ Notify team
```

---

## 📈 Monitoring & Observability Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    MONITORING ARCHITECTURE                    │
└──────────────────────────────────────────────────────────────┘

Application Containers
├── Frontend
├── Backend
└── Databases
      │
      │ Expose metrics
      ▼
┌─────────────┐
│ Prometheus  │
│ (Metrics)   │
└──────┬──────┘
       │
       │ Scrape every 15s
       │ - CPU usage
       │ - Memory usage
       │ - Request rates
       │ - Error rates
       │ - Response times
       ▼
┌─────────────┐
│  Grafana    │
│ (Dashboard) │
└──────┬──────┘
       │
       │ Visualize + Alert
       ▼
┌─────────────┐
│ AlertManager│
│ (Alerts)    │
└──────┬──────┘
       │
       │ Notify on threshold
       ├─► Email
       ├─► Slack
       └─► PagerDuty

Application Logs
├── Frontend logs
├── Backend logs
└── Database logs
      │
      │ Ship logs
      ▼
┌─────────────┐
│ Logstash    │
│ (Processor) │
└──────┬──────┘
       │
       │ Parse + Enrich
       ▼
┌─────────────┐
│Elasticsearch│
│ (Storage)   │
└──────┬──────┘
       │
       │ Index + Search
       ▼
┌─────────────┐
│   Kibana    │
│ (Visualize) │
└─────────────┘
```

---

## 💾 Backup & Recovery Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    BACKUP STRATEGY                            │
└──────────────────────────────────────────────────────────────┘

Daily (Automated via cron)
    │
    │ 2:00 AM UTC
    ▼
┌─────────────────┐
│  Backup Script  │
│ ./backup.sh     │
└────────┬────────┘
         │
         ├─► PostgreSQL
         │   └─ pg_dumpall > backup.sql
         │
         ├─► MongoDB
         │   └─ mongodump > mongo_backup/
         │
         └─► Compress
             └─ tar -czf backup_YYYYMMDD.tar.gz
                    │
                    ▼
            ┌───────────────┐
            │ Local Storage │
            │ ./backups/    │
            └───────┬───────┘
                    │
                    │ Upload to cloud
                    ▼
            ┌───────────────┐
            │ Cloud Storage │
            │ - AWS S3      │
            │ - GCS         │
            │ - Azure Blob  │
            └───────────────┘

Recovery Process
    │
    │ When needed
    ▼
┌─────────────────┐
│  1. Stop        │
│     Services    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Download    │
│     Backup      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Extract     │
│     Files       │
└────────┬────────┘
         │
         ├─► Restore PostgreSQL
         │   └─ psql < backup.sql
         │
         └─► Restore MongoDB
             └─ mongorestore mongo_backup/
                    │
                    ▼
            ┌───────────────┐
            │  4. Verify    │
            │     Data      │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │  5. Start     │
            │     Services  │
            └───────────────┘
```

---

## 🌐 Cloud Deployment Architectures

### AWS Architecture
```
    Route 53 (DNS)
         │
         ▼
    CloudFront (CDN)
         │
         ├─► S3 (Static Assets)
         │
         └─► ALB (Load Balancer)
              │
              ├─► ECS (Frontend)
              │   └─ Fargate Tasks
              │
              └─► ECS (Backend)
                  └─ Fargate Tasks
                       │
                       ├─► RDS (PostgreSQL)
                       ├─► DocumentDB (MongoDB)
                       └─► ElastiCache (Redis)
```

### GCP Architecture
```
    Cloud DNS
         │
         ▼
    Cloud CDN
         │
         ├─► Cloud Storage (Static)
         │
         └─► Cloud Load Balancer
              │
              ├─► Cloud Run (Frontend)
              │
              └─► Cloud Run (Backend)
                       │
                       ├─► Cloud SQL (PostgreSQL)
                       ├─► Firestore (MongoDB)
                       └─► Memorystore (Redis)
```

### Azure Architecture
```
    Azure DNS
         │
         ▼
    Azure CDN
         │
         ├─► Blob Storage (Static)
         │
         └─► Application Gateway
              │
              ├─► Container Instances (Frontend)
              │
              └─► Container Instances (Backend)
                       │
                       ├─► Azure Database (PostgreSQL)
                       ├─► Cosmos DB (MongoDB)
                       └─► Azure Cache (Redis)
```

---

## 📦 Container Build Process

```
┌──────────────────────────────────────────────────────────────┐
│              MULTI-STAGE DOCKER BUILD                         │
└──────────────────────────────────────────────────────────────┘

Frontend Build:

Stage 1: Dependencies
├── FROM node:18-alpine
├── COPY package*.json
├── RUN npm ci
└── Size: ~500MB

Stage 2: Builder
├── COPY src/
├── RUN npm run build
├── Output: dist/
└── Size: ~600MB

Stage 3: Production
├── FROM nginx:alpine
├── COPY --from=builder dist/
├── COPY nginx.conf
├── USER nodejs (1001)
└── Size: ~50MB ✓

Backend Build:

Stage 1: Dependencies
├── FROM node:18-alpine
├── COPY package*.json
├── RUN npm ci --only=production
└── Size: ~300MB

Stage 2: Builder
├── COPY all dependencies
├── RUN npm test
└── Size: ~400MB

Stage 3: Production
├── FROM node:18-alpine
├── COPY --from=dependencies node_modules/
├── COPY server/
├── USER nodejs (1001)
└── Size: ~150MB ✓

Total Size Reduction: 70%
Security: Non-root user ✓
```

---

**This completes the comprehensive deployment package for Carbon Depict!**

📚 **Documentation**: 40,000+ words across 4 guides
🐳 **Docker**: 11 configuration files
🔧 **Scripts**: 7 helper scripts
🏗️ **Architecture**: Production-ready, cloud-compatible
🔐 **Security**: Enterprise-grade best practices

**You're ready to deploy! 🚀**
