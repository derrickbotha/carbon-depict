# Authentication Testing Guide

## ✅ Fixed Issues

1. **Database Configuration**: Changed backend from MongoDB Memory Server to persistent MongoDB
2. **Password Hash**: Updated password for user `db@carbondepict.com` to match `db123!@#DB`
3. **Code Cleanup**: Removed debugging console.log statements from frontend

## 🧪 Test Credentials

### Admin User
- **Email**: `db@carbondepict.com`
- **Password**: `db123!@#DB`
- **Role**: Admin
- **Email Verified**: ✅ Yes
- **Status**: Active

## 🔍 Testing Steps

### 1. Backend API Test (Already Verified ✅)
```bash
cd "c:\Users\dbmos\OneDrive\Documents\Carbon Depict"
node test-login.js
```
**Expected Result**: Status 200 with JWT token

### 2. Frontend Login Test
1. Open browser to: `http://localhost:3500/login`
2. Enter credentials:
   - Email: `db@carbondepict.com`
   - Password: `db123!@#DB`
3. Click "Sign in"
4. **Expected**: Redirect to `/dashboard` with user logged in

### 3. Check Authentication State
After logging in, open browser console and run:
```javascript
localStorage.getItem('authToken')
```
**Expected**: Should return a JWT token string

### 4. Verify User Data
In browser console:
```javascript
// This should show user data if logged in
console.log(JSON.parse(atob(localStorage.getItem('authToken').split('.')[1])))
```

## 🚀 Current Server Status

### Backend (Port 5500)
- MongoDB: Connected to `mongodb://localhost:27017/carbondepict`
- Redis: Disabled (running synchronously)
- Email: Placeholder (configured but not sending)
- WebSocket: Initialized
- Health Check: `http://localhost:5500/api/health`

### Frontend (Port 3500)
- Vite Dev Server
- API Proxy: `/api` → `http://localhost:5500`

## 📝 Additional Test Users

If you need more test users, run:
```bash
cd "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\server"
node create-test-user.js
```

This creates:
- **Manager**: `manager@carbondepict.com` / `ManagerPass123!`
- **User**: `user@carbondepict.com` / `UserPass123!`

## 🔧 Troubleshooting

### If login fails:
1. Check backend is running on port 5500
2. Check frontend is running on port 3500
3. Clear browser localStorage: `localStorage.clear()`
4. Check browser console for errors
5. Check backend terminal for error logs

### Reset password for any user:
Edit `server/update-password.js` with desired email/password, then:
```bash
cd "c:\Users\dbmos\OneDrive\Documents\Carbon Depict\server"
node update-password.js
```

## ✅ What's Working Now

- ✅ Backend connects to persistent MongoDB (no more Memory Server)
- ✅ User `db@carbondepict.com` exists with correct password hash
- ✅ Backend API login endpoint returns JWT token
- ✅ Frontend can communicate with backend via Vite proxy
- ✅ Email verification flag set to true
- ✅ User account is active
- ✅ Company account is active

## 🎯 Next Steps

1. Test frontend login at `http://localhost:3500/login`
2. Verify redirect to dashboard works
3. Test protected routes with authentication
4. Create additional test users if needed
