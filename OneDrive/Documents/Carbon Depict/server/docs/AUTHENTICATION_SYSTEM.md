# Authentication & Real-Time System Documentation

## Overview

This document covers the complete authentication, real-time updates (WebSockets), and background job processing system for Carbon Depict.

## Table of Contents

1. [Authentication System](#authentication-system)
2. [WebSocket Real-Time Updates](#websocket-real-time-updates)
3. [Background Job Processing](#background-job-processing)
4. [Admin Panel](#admin-panel)
5. [Security Features](#security-features)
6. [Setup & Configuration](#setup--configuration)

---

## Authentication System

### Features

- ✅ **Corporate Email Only** - Blocks Gmail, Yahoo, Outlook, and other personal email providers
- ✅ **JWT-based Authentication** - Secure token-based auth with refresh tokens
- ✅ **Multi-tenant Support** - Company-based data isolation
- ✅ **Email Verification** - Required before account activation
- ✅ **Password Reset Flow** - Secure password recovery
- ✅ **Role-Based Access Control (RBAC)** - Admin, Manager, User roles
- ✅ **Session Management** - Track last login, force logout

### API Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "companyName": "Company Ltd",
  "industry": "manufacturing",
  "region": "uk"
}
```

**Response:**
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "email": "john@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "company": {
      "id": 1,
      "name": "Company Ltd"
    }
  }
}
```

**Blocked Email Domains:**
- gmail.com, yahoo.com, hotmail.com, outlook.com
- aol.com, icloud.com, mail.com, protonmail.com
- yandex.com, zoho.com, gmx.com, live.com, msn.com

#### Verify Email
```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "emailVerified": true,
    "company": {
      "id": 1,
      "name": "Company Ltd",
      "industry": "manufacturing",
      "subscription": "free"
    }
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@company.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "NewSecurePass123!"
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware Usage

#### Protect Routes
```javascript
const { authenticate } = require('../middleware/auth')

router.get('/protected', authenticate, async (req, res) => {
  // req.user contains the authenticated user
  // req.user.company contains the user's company
  res.json({ user: req.user })
})
```

#### Role-Based Authorization
```javascript
const { authenticate, authorize, isAdmin } = require('../middleware/auth')

// Admin only
router.get('/admin', authenticate, isAdmin, async (req, res) => {
  res.json({ message: 'Admin access' })
})

// Admin or Manager
router.get('/manager', authenticate, authorize('admin', 'manager'), async (req, res) => {
  res.json({ message: 'Manager access' })
})
```

#### Verify Company Access
```javascript
const { authenticate, verifyCompanyAccess } = require('../middleware/auth')

router.get('/data/:companyId', authenticate, verifyCompanyAccess, async (req, res) => {
  // User can only access their own company's data
  res.json({ companyId: req.params.companyId })
})
```

---

## WebSocket Real-Time Updates

### Features

- ✅ **JWT Authentication** - Secure WebSocket connections
- ✅ **Room-Based Isolation** - User, company, facility, location rooms
- ✅ **Real-Time Emissions Updates** - Live data sync
- ✅ **ESG Metrics Updates** - Live ESG score changes
- ✅ **Report Generation Status** - Real-time report progress
- ✅ **AI Prediction Updates** - Live ML predictions
- ✅ **Notification System** - Real-time user notifications

### Client Connection

```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:5500', {
  auth: {
    token: 'your-jwt-token-here'
  }
})

// Connection success
socket.on('connected', (data) => {
  console.log('Connected to WebSocket:', data)
  // { userId: 1, companyId: 1, role: 'user' }
})

// Connection error
socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message)
})
```

### Subscribe to Updates

#### Emissions Updates
```javascript
// Subscribe to facility emissions
socket.emit('subscribe:emissions', { facilityId: 123 })

// Listen for updates
socket.on('emissions:update', (data) => {
  console.log('Emissions updated:', data)
})

// Unsubscribe
socket.emit('unsubscribe:emissions', { facilityId: 123 })
```

#### ESG Metrics Updates
```javascript
socket.emit('subscribe:esg')

socket.on('esg:update', (data) => {
  console.log('ESG metrics updated:', data)
})
```

#### Report Generation
```javascript
socket.emit('subscribe:reports')

socket.on('report:update', (data) => {
  console.log('Report status:', data)
  // { reportId: 1, status: 'processing', progress: 45 }
})
```

#### AI Predictions
```javascript
socket.emit('subscribe:ai')

socket.on('ai:prediction', (data) => {
  console.log('New AI prediction:', data)
})
```

### Server-Side Emission

```javascript
const { emitToUser, emitToCompany, emitToFacility } = require('../services/websocketService')

// Emit to specific user
emitToUser(userId, 'notification', {
  type: 'info',
  message: 'Your report is ready'
})

// Emit to entire company
emitToCompany(companyId, 'emissions:update', {
  facilityId: 123,
  total: 1500.5,
  change: -5.2
})

// Emit to facility subscribers
emitToFacility(facilityId, 'emissions:update', {
  value: 1500.5,
  timestamp: new Date()
})
```

### Available Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connected` | Server → Client | Connection established |
| `emissions:update` | Server → Client | Emissions data changed |
| `esg:update` | Server → Client | ESG metrics updated |
| `report:update` | Server → Client | Report generation progress |
| `ai:prediction` | Server → Client | New AI prediction |
| `email_verified` | Server → Client | Email verified |
| `user_logged_in` | Server → Client | User logged in |
| `password_changed` | Server → Client | Password changed |
| `account_updated` | Server → Client | Account info updated |
| `force_logout` | Server → Client | Force disconnect |

---

## Background Job Processing

### Features

- ✅ **Redis-Based Queues** - Bull queue system
- ✅ **Multiple Queue Types** - Email, reports, data processing, AI, notifications
- ✅ **Job Retry Logic** - Automatic retry with exponential backoff
- ✅ **Progress Tracking** - Monitor job status
- ✅ **Scheduled Jobs** - Cron-like recurring tasks
- ✅ **Priority System** - High-priority jobs first

### Queue Types

1. **Email Queue** - Verification emails, password resets, notifications
2. **Reports Queue** - ESG report generation, data exports
3. **Data Processing Queue** - Emissions calculations, aggregations
4. **AI Predictions Queue** - ML model inference
5. **Notifications Queue** - Real-time user notifications
6. **Exports Queue** - CSV, Excel, PDF exports
7. **Scheduled Queue** - Recurring tasks (daily reports, cleanup)

### Usage Examples

#### Send Email
```javascript
const { sendVerificationEmail } = require('../services/queueService')

await sendVerificationEmail(
  'user@company.com',
  'verification-token',
  'John'
)
```

#### Generate Report
```javascript
const { generateReport } = require('../services/queueService')

const job = await generateReport(
  'ghg-inventory',
  companyId,
  userId,
  { year: 2024, scope: 'all' }
)

console.log('Report job ID:', job.id)
```

#### Process Data
```javascript
const { calculateEmissionsAggregate } = require('../services/queueService')

await calculateEmissionsAggregate(companyId, {
  startDate: '2024-01-01',
  endDate: '2024-12-31'
})
```

#### AI Prediction
```javascript
const { generateAIPrediction } = require('../services/queueService')

await generateAIPrediction(
  'emissions-forecast',
  companyId,
  { historicalData: [...] }
)
```

#### Scheduled Job
```javascript
const { addScheduledJob } = require('../services/queueService')

// Run daily at midnight
await addScheduledJob(
  'daily-report',
  { reportType: 'summary' },
  '0 0 * * *'
)
```

### Job Status Monitoring

```javascript
const { getJobStatus, getQueueStats } = require('../services/queueService')

// Get specific job status
const status = await getJobStatus('email', jobId)
console.log(status)
// {
//   id: '123',
//   name: 'verification',
//   state: 'completed',
//   progress: 100,
//   attemptsMade: 1
// }

// Get queue statistics
const stats = await getQueueStats('email')
console.log(stats)
// {
//   queueName: 'email',
//   waiting: 5,
//   active: 2,
//   completed: 150,
//   failed: 3
// }
```

---

## Admin Panel

### Features

- ✅ **User Management** - CRUD operations on users
- ✅ **Company Management** - Manage companies
- ✅ **Activity Logs** - View all system activity
- ✅ **Queue Management** - Monitor and control job queues
- ✅ **WebSocket Stats** - Connected users monitoring
- ✅ **System Health** - Database and service status

### API Endpoints

#### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "stats": {
    "users": {
      "total": 150,
      "active": 145,
      "verified": 140,
      "newLast30Days": 25,
      "connected": 42
    },
    "companies": { "total": 30 },
    "emissions": { "total": 5420 },
    "facilities": { "total": 85 }
  },
  "queueStats": {
    "email": { "waiting": 2, "active": 1, "completed": 1500 },
    "reports": { "waiting": 5, "active": 2, "completed": 250 }
  },
  "recentActivity": [...]
}
```

#### List Users
```http
GET /api/admin/users?page=1&limit=20&search=john&role=user&isActive=true
Authorization: Bearer <admin-token>
```

#### Get User Details
```http
GET /api/admin/users/:id
Authorization: Bearer <admin-token>
```

#### Create User
```http
POST /api/admin/users
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "email": "newuser@company.com",
  "password": "TempPass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "companyId": 1,
  "role": "user"
}
```

#### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "manager",
  "isActive": true,
  "emailVerified": true
}
```

#### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <admin-token>
```

#### List Companies
```http
GET /api/admin/companies?page=1&limit=20&industry=manufacturing
Authorization: Bearer <admin-token>
```

#### Update Company
```http
PUT /api/admin/companies/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subscription": "premium",
  "isActive": true
}
```

#### Activity Logs
```http
GET /api/admin/activity?page=1&limit=50&action=user_login&userId=1
Authorization: Bearer <admin-token>
```

#### Queue Management
```http
GET /api/admin/system/queues
POST /api/admin/system/queues/email/pause
POST /api/admin/system/queues/email/resume
POST /api/admin/system/queues/email/clean
Authorization: Bearer <admin-token>
```

#### WebSocket Stats
```http
GET /api/admin/system/websockets
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "totalConnected": 42,
  "byCompany": [
    { "companyId": 1, "companyName": "Company Ltd", "connectedUsers": 15 },
    { "companyId": 2, "companyName": "Another Corp", "connectedUsers": 8 }
  ]
}
```

---

## Security Features

### Corporate Email Validation

Only corporate email addresses are allowed. Personal email providers are blocked:

```javascript
// Blocked domains
const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'gmx.com', 'live.com', 'msn.com'
]
```

### JWT Token Structure

```javascript
{
  userId: 1,
  companyId: 1,
  role: 'user',
  email: 'user@company.com',
  iat: 1234567890,
  exp: 1234567890
}
```

### Password Requirements

- Minimum 8 characters
- Hashed using bcrypt (10 salt rounds)
- Stored securely in database

### Multi-Tenant Data Isolation

Users can only access data belonging to their company:

```javascript
// Middleware automatically checks company access
router.get('/data/:companyId', authenticate, verifyCompanyAccess, handler)
```

### Rate Limiting

- API: 100 requests per 15 minutes per IP
- Configurable in `.env`

### Session Management

- HTTP-only cookies
- Secure flag in production
- 24-hour session lifetime

---

## Setup & Configuration

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
# Server
PORT=5500
CLIENT_URL=http://localhost:3000

# Database
POSTGRES_HOST=localhost
POSTGRES_DB=carbondepict
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password

MONGODB_URI=mongodb://localhost:27017/carbondepict

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-key
SESSION_SECRET=your-session-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@company.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@carbondepict.com
```

### 3. Setup Redis

**Windows (using Memurai - Redis for Windows):**
```bash
# Download from https://www.memurai.com/
# Install and start the service
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 4. Setup SMTP (Gmail Example)

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create a new app password for "Mail"
3. Use the generated password in `SMTP_PASSWORD`

### 5. Initialize Databases

```bash
# Run migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 6. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

### 7. Verify Setup

```bash
# Test health endpoint
curl http://localhost:5500/api/health

# Test detailed health (shows database connections)
curl http://localhost:5500/api/health/detailed
```

---

## Testing

### Test Registration (should fail with Gmail)
```bash
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User",
    "companyName": "Test Corp",
    "industry": "manufacturing"
  }'
```

Expected: `"Please use a corporate email address..."`

### Test Registration (should succeed with corporate email)
```bash
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User",
    "companyName": "Test Corp",
    "industry": "manufacturing"
  }'
```

Expected: `"Registration successful. Please check your email..."`

### Test WebSocket Connection
```javascript
const io = require('socket.io-client')

const socket = io('http://localhost:5500', {
  auth: { token: 'your-jwt-token' }
})

socket.on('connected', (data) => {
  console.log('✅ WebSocket connected:', data)
})
```

### Test Queue Job
```javascript
const { sendVerificationEmail } = require('./services/queueService')

const job = await sendVerificationEmail('test@company.com', 'token123', 'Test')
console.log('Job ID:', job.id)
```

---

## Troubleshooting

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Make sure Redis is running
```bash
# Check Redis status
redis-cli ping  # Should return "PONG"

# If not running, start Redis
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

### Email Not Sending
```
Error: Invalid login
```

**Solution:** 
1. Check SMTP credentials in `.env`
2. For Gmail, use App Password (not regular password)
3. Enable "Less secure app access" or use OAuth2

### WebSocket Not Connecting
```
Error: Authentication token required
```

**Solution:** Make sure to pass JWT token in auth:
```javascript
io('http://localhost:5500', {
  auth: { token: yourJwtToken }
})
```

### Database Connection Failed
```
Error: connect ECONNREFUSED
```

**Solution:**
1. Verify PostgreSQL and MongoDB are running
2. Check connection strings in `.env`
3. Test connections manually:
```bash
psql -h localhost -U postgres -d carbondepict
mongo mongodb://localhost:27017/carbondepict
```

---

## Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5500
CLIENT_URL=https://yourdomain.com
JWT_SECRET=<strong-random-secret>
SESSION_SECRET=<strong-random-secret>

# Use production databases
POSTGRES_HOST=your-db-host
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Use production Redis (Redis Cloud, AWS ElastiCache, etc.)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Production SMTP
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Process Manager (PM2)
```bash
npm install -g pm2

pm2 start server/index.js --name carbon-depict
pm2 startup
pm2 save
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5500
CMD ["node", "index.js"]
```

---

## API Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/api/auth/*` | 5 requests / minute |
| `/api/*` | 100 requests / 15 minutes |
| Admin endpoints | 200 requests / 15 minutes |

---

## Support

For issues or questions:
- GitHub Issues: [Your repo URL]
- Email: support@carbondepict.com
- Documentation: [Your docs URL]
