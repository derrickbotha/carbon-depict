# ✅ Redundant Server Management Solution

## Problem Solved
Previously, servers would stop when running commands in the same terminal. This has been fixed with isolated terminal windows for each server.

## New Features Implemented

### 1. **start-servers.ps1** - Robust Server Startup
- Stops any existing Node processes
- Opens **separate terminal windows** for each server
- Backend runs in its own isolated terminal
- Frontend runs in its own isolated terminal
- Displays status and credentials
- Terminals remain open even after commands complete

### 2. **stop-servers.ps1** - Clean Shutdown
- Gracefully stops all Node.js processes
- Reports number of processes stopped
- Safe to run anytime

### 3. **NPM Scripts Added**
```json
"start:all": "Start both servers in separate terminals"
"stop:all": "Stop all servers"
```

## Usage

### Start Servers (Recommended Method)
```powershell
npm run start:all
```

**What happens:**
1. ✅ Stops any existing Node processes
2. ✅ Opens new terminal window for backend (port 5500)
3. ✅ Opens new terminal window for frontend (port 3500)
4. ✅ Each server runs independently
5. ✅ Status message shows URLs and credentials
6. ✅ You can close the startup window, servers keep running

### Stop All Servers
```powershell
npm run stop:all
```

## Why This Solution is Redundant/Reliable

### ✅ Isolation
- Each server runs in its own terminal window
- No interference between processes
- Can monitor each server independently

### ✅ Persistence  
- Servers keep running even if you:
  - Close the startup window
  - Run other commands
  - Open new terminals

### ✅ Easy Monitoring
- See backend logs in one window
- See frontend logs in another window
- Can restart individually if needed

### ✅ Clean Shutdown
- One command stops all servers
- No orphaned processes
- Safe restart anytime

## Files Created

1. **start-servers.ps1** - Server startup script
2. **stop-servers.ps1** - Server shutdown script
3. **SERVER_MANAGEMENT.md** - Complete documentation
4. **REDUNDANT_SERVERS.md** - This file
5. **package.json** - Updated with new scripts

## Quick Reference

| Task | Command |
|------|---------|
| Start both servers | `npm run start:all` |
| Stop all servers | `npm run stop:all` |
| Check what's running | `Get-Process -Name node` |
| Kill stuck processes | `Get-Process -Name node \| Stop-Process -Force` |

## Server URLs

- **Backend:** http://localhost:5500
- **Frontend:** http://localhost:3500
- **Login:** http://localhost:3500/login
- **Clear Cache:** http://localhost:3500/clear-cache.html

## Login Credentials

- Email: `db@carbondepict.com`
- Password: `db123!@#DB`
- Role: `admin`

## Troubleshooting

### If servers won't start
```powershell
# Stop everything
npm run stop:all

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start again
npm run start:all
```

### If you see port conflicts
```powershell
# Check what's using the ports
netstat -ano | findstr ":3500"
netstat -ano | findstr ":5500"

# Stop all Node processes
npm run stop:all
```

### If terminal windows don't open
Check PowerShell execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Benefits Summary

✅ **No More Crashed Servers** - Each runs independently  
✅ **Easy Monitoring** - Separate windows for each server  
✅ **Clean Startup/Shutdown** - One command for both  
✅ **Developer Friendly** - Can see logs in real-time  
✅ **Production Ready** - Reliable for testing  

## Next Steps

1. Run `npm run start:all` to start servers
2. Open http://localhost:3500 in browser
3. Login with test credentials
4. Start developing!

When done:
```powershell
npm run stop:all
```

That's it! No more server crashes! 🎉
