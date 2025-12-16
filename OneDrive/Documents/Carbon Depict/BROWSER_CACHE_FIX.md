# Fix Browser Cache Issues - Carbon Depict ESG App

## The Problem
Your browser has cached old 404 responses and the old JavaScript bundles from before the Docker rebuild. This causes:
1. `vite.svg` showing 404 (even though it now exists)
2. React `createContext` errors (from old cached vendor.js bundle)

## Quick Fix (Choose ONE method)

### Method 1: Hard Refresh (Fastest)
**Windows/Linux:**
- Press `Ctrl + Shift + R` or `Ctrl + F5`

**Mac:**
- Press `Cmd + Shift + R`

### Method 2: Clear Site Data (Most Thorough)
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Click **Clear storage** (left sidebar)
4. Check all boxes:
   - ✅ Unregister service workers
   - ✅ Local and session storage
   - ✅ IndexedDB
   - ✅ Cookies
   - ✅ Cache storage
5. Click **Clear site data**
6. Close DevTools
7. Refresh page (`F5`)

### Method 3: Incognito/Private Window
1. Open a new Incognito window (`Ctrl + Shift + N`)
2. Navigate to `http://localhost:3500`
3. App should work without errors

### Method 4: Use Built-in Cache Clear Page
1. Navigate to: `http://localhost:3500/clear-cache.html`
2. Click the "Clear Cache" button
3. Go back to `http://localhost:3500`

## Verify It's Fixed

After clearing cache, open DevTools Console (`F12` → Console tab) and check:

✅ **Should see:**
- No errors
- App loads successfully
- vite.svg loads (check Network tab)

❌ **Should NOT see:**
- "Cannot read properties of undefined (reading 'createContext')"
- "404 Not Found" for vite.svg

## Why This Happened

1. Docker was rebuilt with fixes
2. Files changed on server
3. Browser kept old cached responses
4. Hard refresh forces browser to fetch fresh files

## Preventing Future Cache Issues

For development, disable cache in DevTools:
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Check ☑️ **Disable cache** (keep DevTools open while testing)

## Still Not Working?

If errors persist after clearing cache:

1. **Check Docker containers are running:**
   ```bash
   docker ps | grep carbon-depict
   ```
   All containers should show "healthy" or "Up"

2. **Restart Docker containers:**
   ```bash
   cd "/home/dbm/carbon-depict/OneDrive/Documents/Carbon Depict"
   docker-compose restart frontend
   ```

3. **Check browser console for different errors**
   - Open DevTools (`F12`)
   - Go to Console tab
   - Screenshot any new errors

## Technical Details

**What's actually happening:**
- Server returns: `HTTP 200 OK` with correct files
- Browser shows: `404` from cache
- Solution: Force browser to fetch from server

**Files that were fixed:**
- `/vite.svg` - Added Vite logo SVG
- `/assets/*.js` - Rebuilt with correct React bundling
- `nginx.conf` - Fixed user directive conflict

**Verified working from server:**
```bash
curl -I http://localhost:3500/vite.svg
# Returns: HTTP/1.1 200 OK

curl -I http://localhost:3500/assets/react-vendor.C91X8j0C.js
# Returns: HTTP/1.1 200 OK
```

All files are serving correctly. Browser just needs cache refresh!
