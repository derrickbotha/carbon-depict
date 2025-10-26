# Quick Start Guide - Authentication & Real-Time System

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- MongoDB installed and running
- Redis installed and running (Memurai on Windows, Redis on Mac/Linux)

## Step-by-Step Setup

### 1. Install Redis (Required for Background Jobs)

**Windows:**
```powershell
# Download Memurai (Redis for Windows)
# Visit: https://www.memurai.com/get-memurai
# Install and start the Memurai service
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

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

### 2. Configure Environment Variables

Copy the example env file:
```bash
cd server
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `.env` with your values:
```env
# Minimum required configuration
PORT=5500
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this
SESSION_SECRET=your-session-secret-change-this

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=carbondepict
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-postgres-password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/carbondepict

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=noreply@carbondepict.com
```

### 3. Setup Gmail SMTP (for Email Verification)

1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Create password for "Mail" app
   - Copy the 16-character password
3. Use this password in `SMTP_PASSWORD` in `.env`

### 4. Install Dependencies

```bash
cd server
npm install
```

This installs all required packages including:
- Express, Socket.io, Bull (job queues)
- PostgreSQL (Sequelize), MongoDB (Mongoose)
- Authentication (JWT, bcrypt)
- Email (Nodemailer)

### 5. Initialize Databases

Create PostgreSQL database:
```bash
# Using psql
psql -U postgres
CREATE DATABASE carbondepict;
\q
```

The server will automatically create tables on first run.

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
🚀 ========================================
   Carbon Depict API Server
   ========================================
   🌐 Server:     http://localhost:5500
   📊 Health:     http://localhost:5500/api/health
   🔌 WebSocket:  ws://localhost:5500
   📧 Email:      smtp.gmail.com
   💾 PostgreSQL: localhost
   🍃 MongoDB:    localhost
   🔴 Redis:      localhost:6379
   🌍 Environment: development
   ========================================
```

### 7. Test the Setup

#### Test 1: Health Check
```bash
curl http://localhost:5500/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 5.123
}
```

#### Test 2: Register User (should FAIL with Gmail)
```bash
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@gmail.com\",\"password\":\"Password123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"companyName\":\"Test Corp\",\"industry\":\"manufacturing\"}"
```

Expected error:
```json
{
  "error": "Please use a corporate email address. Personal email providers (Gmail, Yahoo, etc.) are not allowed."
}
```

#### Test 3: Register User (should SUCCEED with corporate email)
```bash
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@company.com\",\"password\":\"Password123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"companyName\":\"Test Corp\",\"industry\":\"manufacturing\"}"
```

Expected success:
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": 1,
    "email": "test@company.com",
    "firstName": "Test",
    "lastName": "User",
    "company": {
      "id": 1,
      "name": "Test Corp"
    }
  }
}
```

Check your email for verification link!

## Testing WebSocket Connection

### Using JavaScript (Browser Console or Node.js)

```javascript
// In browser or Node.js
const socket = io('http://localhost:5500', {
  auth: {
    token: 'your-jwt-token-from-login'
  }
})

socket.on('connected', (data) => {
  console.log('✅ Connected:', data)
})

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message)
})
```

## Testing Background Jobs

The server automatically starts email workers. Check console output:
```
👷 Starting background workers...
✅ Email worker started
Email transporter ready to send emails
```

When you register a user, you should see:
```
Processing email job: verification (Job ID: 1)
Email sent: <message-id>
Email job completed: verification (Job ID: 1)
```

## Common Issues & Solutions

### Issue: Redis Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not, start Redis:
brew services start redis           # macOS
sudo systemctl start redis-server   # Linux
# Start Memurai service in Windows Services
```

### Issue: PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Start PostgreSQL if not running:
brew services start postgresql@14   # macOS
sudo systemctl start postgresql     # Linux
# Start PostgreSQL service in Windows Services
```

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# Start MongoDB:
brew services start mongodb-community   # macOS
sudo systemctl start mongod             # Linux
# Start MongoDB service in Windows Services
```

### Issue: Email Not Sending
```
Error: Invalid login
```

**Solution:**
- Use Gmail App Password (not your regular password)
- Enable 2-Factor Authentication first
- Generate App Password at: https://myaccount.google.com/apppasswords

## Next Steps

### 1. Create Admin User

By default, the first user who registers becomes an admin. Or create one manually:

```javascript
// In Node.js REPL or create a script
const { User, Company } = require('./models/postgres')

async function createAdmin() {
  const company = await Company.create({
    name: 'System Admin',
    industry: 'other',
    subscription: 'enterprise',
    isActive: true
  })

  const admin = await User.create({
    email: 'admin@yourdomain.com',
    password: 'AdminPass123!',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    companyId: company.id,
    isActive: true,
    emailVerified: true
  })

  console.log('Admin created:', admin.email)
}

createAdmin()
```

### 2. Test Admin Panel

Login as admin and access:
```bash
# Get admin token first
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"AdminPass123!"}'

# Use token to access admin endpoints
curl http://localhost:5500/api/admin/dashboard \
  -H "Authorization: Bearer <your-admin-token>"
```

### 3. Frontend Integration

Use the Socket.io client in your React/Vue/Angular app:

```bash
npm install socket.io-client
```

```javascript
import io from 'socket.io-client'

const socket = io('http://localhost:5500', {
  auth: { token: localStorage.getItem('token') }
})

socket.on('connected', (data) => {
  console.log('Connected to real-time server')
})

socket.on('emissions:update', (data) => {
  // Update UI with new emissions data
  updateEmissionsChart(data)
})
```

### 4. Monitor System

Access these endpoints to monitor your system:

- Health: `GET /api/health/detailed`
- Queue Stats: `GET /api/admin/system/queues` (admin only)
- WebSocket Stats: `GET /api/admin/system/websockets` (admin only)
- Activity Logs: `GET /api/admin/activity` (admin only)

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Change `SESSION_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use production database credentials
- [ ] Configure production Redis (Redis Cloud, AWS ElastiCache)
- [ ] Setup production SMTP (SendGrid, AWS SES, Mailgun)
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Setup monitoring (PM2, New Relic, Datadog)
- [ ] Configure backups for databases
- [ ] Setup log aggregation (Winston, Elasticsearch)

## Documentation

Full documentation available at:
- **Authentication System**: `server/docs/AUTHENTICATION_SYSTEM.md`
- **Backend Architecture**: `server/docs/BACKEND_ARCHITECTURE.md`
- **Quick Reference**: `server/docs/QUICK_REFERENCE.md`

## Support

Need help? Check:
1. Console logs for error messages
2. `server/docs/AUTHENTICATION_SYSTEM.md` for detailed docs
3. Test each component individually (Redis, PostgreSQL, MongoDB)
4. Verify environment variables in `.env`

Happy coding! 🚀
