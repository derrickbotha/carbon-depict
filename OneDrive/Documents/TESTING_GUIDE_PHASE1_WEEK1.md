# Phase 1 Week 1 - Testing Guide
## Security & Critical Fixes Validation

**Date:** December 3, 2025
**Purpose:** Verify all Phase 1 Week 1 implementations are working correctly

---

## Pre-Testing Checklist

Before running tests, ensure:

- [ ] Node.js 18+ is installed
- [ ] MongoDB is running
- [ ] Redis is running (optional, but recommended)
- [ ] Environment variables are set

### Environment Setup

Create/update `.env` files:

**Frontend `.env` (root directory):**
```env
VITE_API_URL=http://localhost:5500/api
```

**Backend `.env` (server directory):**
```env
# Database
MONGO_URI=mongodb://localhost:27017/carbondepict

# Security (REQUIRED for production)
SESSION_SECRET=test-secret-for-development-only-change-in-production
JWT_SECRET=jwt-test-secret-change-in-production

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# Environment
NODE_ENV=development

# Server
PORT=5500
CLIENT_URL=http://localhost:3000
```

---

## Testing Sequence

### Step 1: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

**Expected Output:**
- No errors during installation
- All packages installed successfully

**✅ Pass Criteria:** Clean installation with no vulnerabilities

---

### Step 2: Run Database Migration

```bash
cd server
npm run migrate:indexes
```

**Expected Output:**
```
🔄 Starting database index migration...
📊 Connecting to MongoDB: mongodb://localhost:27017/carbondepict
✅ Database connected

📝 Creating indexes for ESGMetric collection...
  ✓ Created index: companyId_1_topic_1_createdAt_-1
  ✓ Created index: companyId_1_pillar_1_createdAt_-1
  ✓ Created index: createdAt_-1
  ✓ Created index: framework_1

📝 Creating indexes for GHGEmission collection...
  ✓ Created index: companyId_1_scope_1_recordedAt_-1
  ✓ Created index: facilityId_1_recordedAt_-1
  ✓ Created index: recordedAt_-1

📊 Verifying indexes...

✅ ESGMetric collection has X indexes:
   - _id_
   - companyId_1_framework_1_reportingPeriod_1
   - companyId_1_status_1
   - companyId_1_topic_1_createdAt_-1
   - companyId_1_pillar_1_createdAt_-1
   - createdAt_-1
   - framework_1

✅ GHGEmission collection has X indexes:
   - _id_
   - companyId_1_reportingPeriod_1
   - facilityId_1
   - scope_1
   - companyId_1_scope_1_recordedAt_-1
   - facilityId_1_recordedAt_-1
   - recordedAt_-1

🎉 Index migration completed successfully!
👋 Database disconnected
```

**✅ Pass Criteria:**
- All indexes created without errors
- ESGMetric has at least 7 indexes
- GHGEmission has at least 7 indexes

**❌ If Failed:**
- Check MongoDB is running: `mongosh` or `mongo`
- Verify MONGO_URI in `.env`
- Check for permissions issues

---

### Step 3: Start Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
🔄 Starting Carbon Depict server...
📊 Connecting to databases...
✅ Databases connected
🔌 Initializing WebSocket server...
✅ WebSocket server initialized
⚙️  Initializing job queues...
✅ Job queues initialized
👷 Starting background workers...
✅ Email worker started

🚀 ========================================
   Carbon Depict API Server
   ========================================
   🌐 Server:     http://localhost:5500
   📊 Health:     http://localhost:5500/api/health
   🔌 WebSocket:  ws://localhost:5500
   📧 Email:      <configured or not>
   🍃 MongoDB:    mongodb://localhost:27017/carbondepict
   🔴 Redis:      localhost:6379
   🌍 Environment: development
   ========================================
```

**✅ Pass Criteria:**
- Server starts without errors
- All services initialized (MongoDB, WebSocket, Queues)
- Listening on port 5500

**❌ If Failed:**
- Check MongoDB connection
- Verify port 5500 is not in use
- Check all environment variables are set

**Keep this terminal running** ⚠️

---

### Step 4: Test Health Check Endpoint

Open a new terminal:

```bash
curl http://localhost:5500/api/health
```

**Expected Output:**
```json
{
  "status": "ok",
  "message": "CarbonDepict API is running",
  "timestamp": "2025-12-03T...",
  "uptime": 12.345,
  "environment": "development"
}
```

**✅ Pass Criteria:**
- HTTP 200 status
- Response contains "status": "ok"

---

### Step 5: Test Rate Limiting

#### Test 5.1: General API Rate Limit

```bash
# This should succeed (under limit in dev mode)
for i in {1..5}; do
  curl -s http://localhost:5500/api/health | grep -o '"status":"ok"'
done
```

**Expected:** All 5 requests succeed (1000 limit in dev mode)

#### Test 5.2: Auth Rate Limit (IMPORTANT)

```bash
# Test login rate limiting - should block after 5 attempts
for i in {1..7}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:5500/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrongpassword"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 1
done
```

**Expected Output:**
- Attempts 1-5: HTTP 400 or 401 (invalid credentials)
- Attempts 6-7: **HTTP 429** (Too Many Requests)

**Response on 6th attempt:**
```json
{
  "error": "Too many authentication attempts",
  "message": "Too many authentication attempts from this IP, please try again later.",
  "retryAfter": 900
}
```

**✅ Pass Criteria:**
- First 5 attempts allowed
- 6th attempt blocked with HTTP 429
- Response includes `retryAfter` field

**❌ If Failed:**
- Check server logs for errors
- Verify authLimiter is applied in server/index.js

---

### Step 6: Test Password Validation

#### Test 6.1: Weak Password (Should Fail)

```bash
# Test with weak password
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser1@example.com",
    "password":"password123",
    "firstName":"Test",
    "lastName":"User"
  }' | jq
```

**Expected Output:**
```json
{
  "success": false,
  "error": "Password must be at least 12 characters and include uppercase, lowercase, number, and special character (@$!%*?&)"
}
```

**✅ Pass Criteria:** Registration fails with password validation error

#### Test 6.2: Common Password (Should Fail)

```bash
# Test with common password pattern
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser2@example.com",
    "password":"Password123!",
    "firstName":"Test",
    "lastName":"User"
  }' | jq
```

**Expected Output:**
```json
{
  "success": false,
  "error": "Password is too common. Please choose a stronger, more unique password."
}
```

**✅ Pass Criteria:** Registration fails with common password error

#### Test 6.3: Strong Password (Should Succeed)

```bash
# Test with strong, unique password
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"testuser3@example.com",
    "password":"MyStr0ng!Passw0rd#2025",
    "firstName":"Test",
    "lastName":"User",
    "companyName":"Test Company"
  }' | jq
```

**Expected Output:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "testuser3@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "user"
  }
}
```

**✅ Pass Criteria:**
- HTTP 200 or 201
- Returns JWT token
- User created successfully
- Password is hashed (not visible in response)

---

### Step 7: Test Session Secret Enforcement

#### Test 7.1: Development Mode (Should Work)

Current test (already running) - should work fine

#### Test 7.2: Production Mode Without Secret (Should Fail)

```bash
# Stop the current server (Ctrl+C in server terminal)

# Try to start in production without SESSION_SECRET
cd server
NODE_ENV=production npm start
```

**Expected Output:**
```
Error: SESSION_SECRET must be set in production environment
    at Object.<anonymous> (/path/to/server/index.js:42:9)
```

**✅ Pass Criteria:**
- Server throws error and exits
- Error message mentions SESSION_SECRET

#### Test 7.3: Production Mode With Secret (Should Work)

```bash
# Start with SESSION_SECRET set
cd server
SESSION_SECRET="my-production-secret-key-12345" NODE_ENV=production npm start
```

**Expected Output:**
- Server starts successfully
- Environment shows: "production"

**✅ Pass Criteria:**
- Server starts without errors
- Uses provided SESSION_SECRET

**Remember to switch back to development mode after testing!**

```bash
# Stop production server (Ctrl+C)
# Restart in dev mode
npm run dev
```

---

### Step 8: Test Frontend (Optional - if frontend is running)

#### Step 8.1: Start Frontend

```bash
# In a new terminal, from project root
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 423 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

#### Step 8.2: Test Scope Data Collection

1. Open browser: `http://localhost:3000`
2. Login or register (use strong password from Test 6.3)
3. Navigate to: Dashboard → Emissions → Scope 1 Data Collection
4. Fill out the form with test data
5. Click "Save"

**Expected Behavior:**
- Save button shows loading state
- Success message appears (not alert with "API integration pending")
- Data is saved to database

**Verify in MongoDB:**
```bash
mongosh
use carbondepict
db.ghgemissions.find({scope: "scope1"}).pretty()
```

**✅ Pass Criteria:**
- Form saves successfully
- Data appears in MongoDB
- No console errors in browser
- Loading state works correctly

#### Step 8.3: Repeat for Scope 2 and 3

- Navigate to Scope 2 Data Collection
- Test save functionality
- Navigate to Scope 3 Data Collection
- Test save functionality

**✅ Pass Criteria:** All three Scope forms save data successfully

---

### Step 9: Verify Database Indexes

```bash
# Connect to MongoDB
mongosh

# Switch to database
use carbondepict

# Check ESGMetric indexes
db.esgmetrics.getIndexes()

# Check GHGEmission indexes
db.ghgemissions.getIndexes()
```

**Expected Output:**

**ESGMetric Indexes:**
```javascript
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { companyId: 1, framework: 1, reportingPeriod: 1 }, name: 'companyId_1_framework_1_reportingPeriod_1' },
  { v: 2, key: { companyId: 1, status: 1 }, name: 'companyId_1_status_1' },
  { v: 2, key: { companyId: 1, topic: 1, createdAt: -1 }, name: 'companyId_1_topic_1_createdAt_-1' },
  { v: 2, key: { companyId: 1, pillar: 1, createdAt: -1 }, name: 'companyId_1_pillar_1_createdAt_-1' },
  { v: 2, key: { createdAt: -1 }, name: 'createdAt_-1' },
  { v: 2, key: { framework: 1 }, name: 'framework_1' }
]
```

**GHGEmission Indexes:**
```javascript
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { companyId: 1, reportingPeriod: 1 }, name: 'companyId_1_reportingPeriod_1' },
  { v: 2, key: { facilityId: 1 }, name: 'facilityId_1' },
  { v: 2, key: { scope: 1 }, name: 'scope_1' },
  { v: 2, key: { companyId: 1, scope: 1, recordedAt: -1 }, name: 'companyId_1_scope_1_recordedAt_-1' },
  { v: 2, key: { facilityId: 1, recordedAt: -1 }, name: 'facilityId_1_recordedAt_-1' },
  { v: 2, key: { recordedAt: -1 }, name: 'recordedAt_-1' }
]
```

**✅ Pass Criteria:**
- ESGMetric has at least 7 indexes
- GHGEmission has at least 7 indexes
- All new indexes are present

---

### Step 10: Performance Test (Optional)

Test query performance with indexes:

```javascript
// In mongosh
use carbondepict

// Test ESGMetric query (should use index)
db.esgmetrics.find({ companyId: ObjectId("..."), topic: "Waste Management" })
  .sort({ createdAt: -1 })
  .explain("executionStats")

// Check if index was used
// Look for: "winningPlan" → "inputStage" → "indexName"
```

**✅ Pass Criteria:**
- Query uses index (not COLLSCAN)
- "executionStats" shows "totalDocsExamined" ≈ "nReturned"

---

## Test Results Checklist

Mark each test as you complete it:

### Security Tests
- [ ] Rate limiting works (general API)
- [ ] Rate limiting works (auth endpoints - blocks after 5 attempts)
- [ ] Weak passwords rejected (< 12 chars)
- [ ] Weak passwords rejected (missing complexity)
- [ ] Common passwords rejected
- [ ] Strong passwords accepted
- [ ] Session secret enforced in production
- [ ] Session secret validation works

### Functional Tests
- [ ] Server starts successfully
- [ ] Health check endpoint works
- [ ] Scope 1 data saves via API
- [ ] Scope 2 data saves via API
- [ ] Scope 3 data saves via API
- [ ] Data persists in MongoDB
- [ ] Loading states work correctly

### Performance Tests
- [ ] Database migration script runs successfully
- [ ] All indexes created (7+ per collection)
- [ ] Queries use indexes (explain plan verification)
- [ ] No performance degradation noticed

### Dependency Tests
- [ ] All dependencies installed without errors
- [ ] No critical vulnerabilities (run `npm audit`)
- [ ] Server runs with updated packages
- [ ] Frontend runs with updated packages

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Start MongoDB: `mongod` or `brew services start mongodb-community`
2. Check MONGO_URI in `.env`
3. Verify MongoDB is running: `mongosh`

### Issue 2: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5500
```

**Solutions:**
1. Kill process on port 5500: `lsof -ti:5500 | xargs kill -9`
2. Change PORT in `.env`
3. Check for other running instances

### Issue 3: Rate Limiting Not Working

**Symptoms:**
- No 429 errors after multiple requests

**Solutions:**
1. Check server logs for errors
2. Verify `authLimiter` is applied before auth routes
3. Clear any cached rate limit data: restart server
4. Check if using different IPs (proxy/VPN)

### Issue 4: Password Validation Not Working

**Symptoms:**
- Weak passwords accepted

**Solutions:**
1. Check User model has validation code
2. Verify pre-save hook is not being skipped
3. Check for `runValidators: true` in save operations
4. Look for error handling that might suppress validation errors

### Issue 5: Indexes Not Created

**Symptoms:**
- Migration script completes but indexes missing

**Solutions:**
1. Check MongoDB user has permissions to create indexes
2. Verify model files loaded correctly
3. Try creating manually:
   ```javascript
   db.esgmetrics.createIndex({companyId: 1, topic: 1, createdAt: -1})
   ```
4. Drop and recreate if needed

---

## Performance Baseline

After testing, record baseline metrics for comparison:

| Metric | Value | Notes |
|--------|-------|-------|
| Server startup time | ___ seconds | Time to "ready" message |
| Health check response | ___ ms | Average of 10 requests |
| Auth login time | ___ ms | Successful login |
| Scope 1 save time | ___ ms | Form submission to response |
| Database query time | ___ ms | From MongoDB logs |

These will be useful for comparing Phase 1 Week 2 optimizations.

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Commit changes to git
2. Create a backup of the database
3. Proceed to Phase 1 Week 2 (Database Optimization)

### If Tests Fail ❌
1. Document which tests failed
2. Check error logs
3. Review implementation
4. Fix issues before proceeding

---

## Support

If you encounter issues:
1. Check server logs: `tail -f server/logs/combined.log` (if configured)
2. Check browser console for frontend errors
3. Check MongoDB logs: `tail -f /usr/local/var/log/mongodb/mongo.log`
4. Review implementation summary: `PHASE1_WEEK1_IMPLEMENTATION_SUMMARY.md`

---

**Testing Completed:** ___/___/2025
**All Tests Passed:** [ ] Yes  [ ] No
**Ready for Phase 1 Week 2:** [ ] Yes  [ ] No
**Notes:**

_____________________________________________
_____________________________________________
_____________________________________________
