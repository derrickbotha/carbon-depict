# Console Errors Documentation
**Date:** 2025-12-04
**Session:** Development Server Analysis

## Server Status

### Backend Server
- **Status:** ✅ Running
- **Port:** 5500
- **URL:** http://localhost:5500
- **Database:** In-memory MongoDB at mongodb://127.0.0.1:39397/
- **Redis:** Not connected (using in-memory fallback)

### Frontend Server
- **Status:** ✅ Running
- **Port:** 3501 (auto-switched from 3500)
- **URL:** http://localhost:3501

## Identified Issues

### Issue #1: Authentication Errors (401 Unauthorized)

**Error Pattern:**
```
GET /api/esg/framework-data - 401 Unauthorized
GET /api/esg/framework-data/scores/all - 401 Unauthorized
```

**Frequency:** Multiple rapid-fire requests occurring immediately on app initialization

**Root Cause:**
The `ESGDataManager` class in `src/utils/esgDataManager.js` is making authenticated API calls in its constructor before the user has logged in.

**Code Location:** `src/utils/esgDataManager.js:28-33`
```javascript
if (USE_BACKEND) {
  this.initializeWebSocket();
  // These run immediately, before authentication!
  this.syncFromBackend();      // Line 31 - calls /api/esg/framework-data
  this.syncScoresFromBackend(); // Line 32 - calls /api/esg/framework-data/scores/all
}
```

**Impact:**
- Console filled with 401 error messages
- Unnecessary API calls that always fail
- Poor user experience with error logs
- Server logs cluttered with failed authentication attempts

**Expected Behavior:**
- ESG data sync should only occur AFTER user authentication
- No API calls should be made before the auth token is available

## Solution

### Fix Strategy
1. Remove automatic sync calls from the ESGDataManager constructor
2. Add a manual `initialize()` method that can be called after authentication
3. Update components to call `initialize()` after user login
4. Add auth state checking before making API calls

### Files to Modify
1. `src/utils/esgDataManager.js` - Update constructor and add initialize method
2. `src/contexts/AuthContext.jsx` - Trigger ESG sync after successful login
3. Any components directly using ESGDataManager - Update initialization logic

## Additional Observations

### Warning Messages
The following warnings are expected in development mode:
- ⚠️ Redis connection refused - Using in-memory fallback (expected)
- ⚠️ Email transporter not configured - Using placeholder (expected)

### Server Health
- ✅ MongoDB connection: Working (in-memory database)
- ✅ WebSocket server: Initialized successfully
- ✅ Job queues: Initialized (7 queues created)
- ✅ Background workers: Started successfully

## Next Steps

1. ✅ Document the issue
2. ✅ Fix the ESGDataManager authentication issue
3. ⏳ Test the fix by logging in and verifying no 401 errors
4. ⏳ Verify ESG data loads correctly after authentication

## Fix Applied

### Changes Made

#### 1. Updated `src/utils/esgDataManager.js`
- Removed automatic sync calls from constructor (lines 31-32)
- Added `initialized` flag to track initialization state
- Created new `initialize()` method that must be called after authentication
- Updated `useESGScores` hook to load from cache instead of syncing on mount

#### 2. Updated `src/contexts/AuthContext.jsx`
- Added import for `esgDataManager`
- Call `esgDataManager.initialize()` after successful login
- Call `esgDataManager.initialize()` after successful registration
- Call `esgDataManager.initialize()` when verifying existing auth token on app load

### How It Works Now
1. User opens the app (no auth yet)
2. ESGDataManager constructor runs but does NOT make API calls
3. User logs in or app verifies existing token
4. AuthContext calls `esgDataManager.initialize()`
5. ESGDataManager syncs data from backend with valid auth token
6. No more 401 errors on app initialization!

### Testing Instructions
1. Clear browser localStorage (to simulate fresh start)
2. Open the app at http://localhost:3501
3. Check console - should see NO 401 errors
4. Log in with valid credentials
5. After login, should see: "✅ ESG Data Manager initialized and synced with backend"
6. No 401 errors should appear in console
