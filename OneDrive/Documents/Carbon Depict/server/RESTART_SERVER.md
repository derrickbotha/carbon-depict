# 🔄 Server Restart Required

## Issue Fixed
The login 500 error has been fixed by updating the auth route to properly populate the `companyId` field instead of the non-existent `company` virtual.

## Files Modified
1. `server/routes/auth.js` - Fixed populate calls and company references
2. `server/index.js` - Temporarily increased rate limit for testing
3. `TEST_CREDENTIALS.md` - Updated with correct password

## ⚠️ Action Required
**Your server must be restarted to load the updated code.**

The server is currently running as root (PID 364011) in terminal pts/7 and cannot be auto-reloaded.

### To Restart the Server:

#### Option 1: Restart in the running terminal
1. Go to the terminal where the server is running (pts/7)
2. Press `Ctrl+C` to stop the server
3. Run: `npm run dev` or `node index.js`

#### Option 2: Kill and restart manually
```bash
# As root or with sudo
sudo kill 364011

# Then start the server
cd "/home/dbm/carbon-depict/OneDrive/Documents/Carbon Depict/server"
npm run dev
```

#### Option 3: Use nodemon for auto-reload
```bash
# Make sure nodemon is installed
npm install -g nodemon

# Start with nodemon (it will auto-reload on file changes)
cd "/home/dbm/carbon-depict/OneDrive/Documents/Carbon Depict/server"
nodemon index.js
```

## Test Login After Restart

### Credentials
- **Email:** `db@carbondepict.com`
- **Password:** `Db123!Admin&` ⚠️ (Note: Not `db123!@#DB`)

### Test Command
```bash
curl -X POST http://127.0.0.1:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"db@carbondepict.com","password":"Db123!Admin&"}'
```

### Expected Response
```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "...",
    "email": "db@carbondepict.com",
    "firstName": "DB",
    "lastName": "Admin",
    "role": "admin",
    "emailVerified": true,
    "company": {
      "id": "...",
      "name": "Carbon Depict Test Company",
      "industry": "other",
      "subscription": "free"
    }
  }
}
```

## What Was Fixed

### Before (Broken)
```javascript
const user = await User.findOne({ email })
  .populate({
    path: 'company',  // ❌ This virtual doesn't exist
    select: 'name industry subscription isActive'
  })

// Later in code
company: {
  id: user.company.id,  // ❌ TypeError: Cannot read property 'id' of undefined
  name: user.company.name,
  // ...
}
```

### After (Fixed)
```javascript
const user = await User.findOne({ email })
  .populate({
    path: 'companyId',  // ✅ Populates the actual field
    select: 'name industry subscription isActive'
  })

// Later in code
company: {
  id: user.companyId.id,  // ✅ Works correctly
  name: user.companyId.name,
  // ...
}
```

## Rate Limit Note
The authentication rate limit was temporarily increased from 5 to 100 attempts per 15 minutes in `server/index.js` line 92. You may want to revert this to 5 for production security.

---

**Last Updated:** 2025-12-09
**Status:** ✅ Code Fixed - Awaiting Server Restart
