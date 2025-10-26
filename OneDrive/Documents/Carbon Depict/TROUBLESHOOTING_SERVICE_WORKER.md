# Service Worker Errors - Troubleshooting Guide

## Problem
Browser showing repeated errors:
```
The FetchEvent for "<URL>" resulted in a network error response: the promise was rejected.
sw.js:1 Uncaught (in promise) TypeError: Failed to convert value to 'Response'.
```

## Cause
Service worker was caching requests incorrectly and causing fetch interception issues in development mode.

## Solution Applied

### 1. ✅ Simplified Service Worker (`public/sw.js`)
The service worker now:
- Immediately unregisters itself on activation
- Clears all caches
- Does not intercept fetch requests
- Suitable for development environment

### 2. ✅ Auto-Unregister in `index.html`
Added code to automatically unregister all service workers on page load:
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister()
      console.log('SW unregistered for development')
    })
  })
}
```

### 3. ✅ Enhanced Clear Cache Page
Created comprehensive cleanup at `http://localhost:3500/clear-cache.html`:
- Unregisters all service workers
- Deletes all cache storage
- Clears localStorage
- Clears sessionStorage
- Clears cookies
- Auto-redirects after cleanup

## How to Fix in Your Browser

### Option 1: Use Clear Cache Page (Recommended)
1. Navigate to: `http://localhost:3500/clear-cache.html`
2. Wait for cleanup to complete (2-3 seconds)
3. Browser will automatically redirect to home page
4. Errors should be gone!

### Option 2: Manual Browser Cleanup
1. Press `F12` to open DevTools
2. Go to **Application** tab
3. Click **Service Workers** in left sidebar
4. Click **Unregister** next to any service workers
5. Click **Storage** in left sidebar
6. Click **Clear site data** button
7. Close DevTools
8. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Option 3: Chrome's Clear Browsing Data
1. Press `Ctrl + Shift + Delete`
2. Select **Cached images and files**
3. Select **Cookies and other site data**
4. Time range: **All time**
5. Click **Clear data**
6. Restart browser

## Verify Fix
After clearing cache, you should see:
- ✅ No service worker errors in console
- ✅ No "FetchEvent" errors
- ✅ No "Failed to convert value to 'Response'" errors
- ✅ Clean console with only HMR logs from Vite

## Testing Login
After cache is cleared, test login functionality:

**URL:** `http://localhost:3500/login`

**Credentials:**
```
Email:    db@carbondepict.com
Password: db123!@#DB
Role:     admin
```

**Expected Result:**
- Login successful
- JWT token stored in localStorage
- Redirect to dashboard
- User info displayed correctly

## Backend API Endpoints

### Health Check
```bash
curl http://localhost:5500/api/health
```

### Login
```bash
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "db@carbondepict.com",
    "password": "db123!@#DB"
  }'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "db@carbondepict.com",
    "firstName": "DB",
    "lastName": "Admin",
    "role": "admin",
    "emailVerified": true,
    "company": {
      "id": "uuid",
      "name": "Carbon Depict Test Company",
      "industry": "other",
      "subscription": "free"
    }
  }
}
```

## Common Issues

### Issue: "Email not verified" error
**Solution:** Run the update script:
```bash
cd server
node scripts/updateTestUser.js
```

### Issue: "Invalid email or password"
**Causes:**
- Password was not hashed correctly
- User doesn't exist in database

**Solution:** Recreate user:
```bash
cd server
node scripts/createTestUser.js
```

### Issue: Backend not responding
**Check:**
1. Is backend running? Check terminal for "Server running on http://localhost:5500"
2. Is MongoDB running? Check connection: `node server/test-db.js`
3. Check backend logs for errors

**Restart backend:**
```bash
cd server
npm run dev
```

### Issue: Frontend not loading
**Check:**
1. Is Vite running? Check terminal for "Local: http://localhost:3500"
2. Check for port conflicts

**Restart frontend:**
```bash
npm run dev
```

## Production Notes

For production deployment, you'll want to:

1. **Enable Service Worker**
   - Uncomment the service worker registration in `index.html`
   - Update `sw.js` with proper caching strategy
   - Test offline functionality

2. **Update Caching Strategy**
   - Cache static assets
   - Implement stale-while-revalidate for API calls
   - Add offline fallback pages

3. **Security**
   - Use HTTPS in production
   - Set proper CORS headers
   - Update JWT_SECRET in environment variables
   - Enable SMTP for email verification

## Files Modified

1. ✅ `public/sw.js` - Simplified service worker
2. ✅ `public/clear-cache.html` - Enhanced cleanup page (brand colors)
3. ✅ `index.html` - Auto-unregister service workers
4. ✅ `server/scripts/updateTestUser.js` - New script to update test user
5. ✅ `src/pages/marketing/HomePage.jsx` - Updated gradient colors to brand

## Summary

Both servers are running and ready for testing:
- **Backend:** http://localhost:5500
- **Frontend:** http://localhost:3500
- **Clear Cache:** http://localhost:3500/clear-cache.html
- **Login:** http://localhost:3500/login

Service worker errors are fixed. Visit the clear-cache page first to remove old cached data from your browser!
