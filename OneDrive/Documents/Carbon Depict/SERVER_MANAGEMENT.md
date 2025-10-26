# Server Management Guide

This guide explains how to start and stop the Carbon Depict servers reliably.

## Quick Start

### Option 1: Using NPM Scripts (Recommended)

**Start both servers:**
```powershell
npm run start:all
```

This will:
- Stop any existing Node processes
- Open a new terminal window for the backend server
- Open a new terminal window for the frontend server
- Display server URLs and login credentials
- Each server runs in its own isolated terminal

**Stop all servers:**
```powershell
npm run stop:all
```

### Option 2: Using PowerShell Scripts Directly

**Start servers:**
```powershell
.\start-servers.ps1
```

**Stop servers:**
```powershell
.\stop-servers.ps1
```

### Option 3: Manual Start (Development)

**Backend (Terminal 1):**
```powershell
cd server
npm run dev
```

**Frontend (Terminal 2):**
```powershell
npm run dev
```

## Server Information

### Backend API Server
- **URL:** http://localhost:5500
- **Health Check:** http://localhost:5500/api/health
- **Databases:**
  - PostgreSQL (port 5432)
  - MongoDB (port 27017)
  - Redis (port 6379)
- **Features:**
  - WebSocket server
  - Job queues (7 types)
  - Email worker
  - Real-time updates

### Frontend Application
- **URL:** http://localhost:3500
- **Build Tool:** Vite v5.4.21
- **Features:**
  - Hot Module Replacement (HMR)
  - React 18
  - Tailwind CSS
  - ESG Data Collection Forms

## Login Credentials

**Test User:**
- Email: `db@carbondepict.com`
- Password: `db123!@#DB`
- Role: `admin`

**Login Page:** http://localhost:3500/login

## Troubleshooting

### Servers Won't Start

**Check if ports are in use:**
```powershell
# Check port 3500 (frontend)
netstat -ano | findstr ":3500"

# Check port 5500 (backend)
netstat -ano | findstr ":5500"
```

**Kill processes using the ports:**
```powershell
# Stop all Node processes
npm run stop:all

# Or manually
Get-Process -Name node | Stop-Process -Force
```

### Frontend Server Stops Unexpectedly

This usually happens when:
1. Another command runs in the same terminal
2. Terminal window is closed
3. PowerShell execution policy blocks scripts

**Solution:** Use `npm run start:all` which creates isolated terminal windows.

### Backend Database Connection Errors

**Check if Docker containers are running:**
```powershell
docker ps
```

**Expected containers:**
- carbon-depict-db (PostgreSQL)
- carbon-depict-mongodb (MongoDB)
- carbon-depict-redis (Redis)

**Start Docker containers:**
```powershell
cd server
docker-compose up -d
```

### Service Worker Errors in Browser

If you see repeated service worker errors in browser console:

**Solution:** Visit http://localhost:3500/clear-cache.html

This will:
- Unregister all service workers
- Clear all caches
- Clear localStorage/sessionStorage
- Redirect to home page

### PowerShell Execution Policy Error

If you get "cannot be loaded because running scripts is disabled":

**Solution:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set policy for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for single command
powershell -ExecutionPolicy Bypass -File .\start-servers.ps1
```

## Development Workflow

### Normal Development (with auto-restart)

1. Start servers in separate terminals:
   ```powershell
   npm run start:all
   ```

2. Make code changes
   - Backend: nodemon auto-restarts on file changes
   - Frontend: Vite HMR updates instantly

3. View changes in browser at http://localhost:3500

### After System Restart

1. Start Docker containers:
   ```powershell
   cd server
   docker-compose up -d
   ```

2. Wait ~10 seconds for databases to initialize

3. Start application servers:
   ```powershell
   npm run start:all
   ```

### Clean Restart

If experiencing issues, do a clean restart:

1. Stop all servers:
   ```powershell
   npm run stop:all
   ```

2. Clear browser cache:
   - Visit http://localhost:3500/clear-cache.html

3. Restart servers:
   ```powershell
   npm run start:all
   ```

## Server Scripts Reference

### package.json scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite) |
| `npm run server:dev` | Start backend only (nodemon) |
| `npm run start:all` | Start both servers in new terminals |
| `npm run stop:all` | Stop all Node processes |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

### PowerShell scripts

| File | Purpose |
|------|---------|
| `start-servers.ps1` | Start both servers in isolated terminals |
| `stop-servers.ps1` | Stop all Node processes gracefully |

## Architecture

```
┌─────────────────────────────────────┐
│   Browser (http://localhost:3500)  │
│   - React Frontend                  │
│   - Vite Dev Server                 │
└──────────────┬──────────────────────┘
               │
               │ HTTP/WebSocket
               │
┌──────────────▼──────────────────────┐
│   Backend API (http://localhost:5500)│
│   - Express.js Server               │
│   - WebSocket Server                │
│   - Job Queues                      │
└──────────────┬──────────────────────┘
               │
               ├─── PostgreSQL (5432)
               ├─── MongoDB (27017)
               └─── Redis (6379)
```

## Best Practices

1. **Always use `npm run start:all`** for development
   - Ensures isolated terminals
   - Prevents server crashes from command interference
   - Easy to monitor both servers

2. **Keep terminal windows open**
   - Don't close backend/frontend terminal windows
   - Watch for errors in real-time
   - See logs for debugging

3. **Use `npm run stop:all` before system shutdown**
   - Ensures clean shutdown
   - Prevents port conflicts on restart

4. **Clear browser cache when updating service workers**
   - Use http://localhost:3500/clear-cache.html
   - Hard refresh: Ctrl+Shift+R

5. **Check Docker before starting servers**
   - Backend needs databases running
   - Use `docker ps` to verify

## Additional Resources

- **Backend Documentation:** `server/README.md`
- **API Documentation:** `server/docs/`
- **Test Credentials:** `TEST_CREDENTIALS.md`
- **Service Worker Issues:** `TROUBLESHOOTING_SERVICE_WORKER.md`
- **Quick Start:** `QUICKSTART.md`

## Support

If you encounter issues not covered here:

1. Check terminal output for error messages
2. Check browser console for frontend errors
3. Check Docker containers are running
4. Try clean restart (stop → clear cache → start)
5. Review documentation files listed above
