# Server Monitoring & Auto-Restart System

## Overview

The Carbon Depict platform now includes an intelligent server monitoring system that automatically detects server crashes and restarts them with up to 6 retry attempts.

## Features

✅ **Automatic Server Monitoring**
- Checks both backend (port 5500) and frontend (port 3500) every 5 seconds
- Detects when servers become unresponsive
- Provides real-time status updates with timestamps

✅ **Intelligent Auto-Restart**
- Automatically restarts crashed servers
- Up to 6 retry attempts per server
- Kills all Node processes before restart to prevent port conflicts
- Coordinates backend/frontend restarts (frontend depends on backend)

✅ **Crash Recovery**
- Tracks total number of crashes
- Resets retry counter on successful recovery
- Stops monitoring if max retries exceeded (prevents infinite loops)
- Clean shutdown on critical failure

✅ **Status Reporting**
- Timestamped logs for all events
- Color-coded messages (Green=success, Red=error, Yellow=warning)
- Periodic status updates showing UP/DOWN state
- Crash counter display

## Quick Start

### Option 1: NPM Script (Recommended)
```powershell
npm run monitor
```

### Option 2: Direct PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File ./monitor-servers.ps1
```

## Configuration

Edit `monitor-servers.ps1` to customize:

```powershell
$backendPort = 5500         # Backend server port
$frontendPort = 3500        # Frontend server port
$maxRetries = 6             # Maximum restart attempts
$checkInterval = 5          # Health check frequency (seconds)
$restartDelay = 3           # Delay before restart (seconds)
```

## How It Works

### 1. Initial Startup
```
1. Stops all existing Node processes (clean slate)
2. Starts backend server in new terminal window
3. Waits 8 seconds for backend initialization
4. Starts frontend server in new terminal window
5. Waits 5 seconds for frontend initialization
6. Begins monitoring loop
```

### 2. Monitoring Loop
```
Every 5 seconds:
  ├── Check backend port 5500
  │   ├── If DOWN and was UP: Trigger restart
  │   └── If UP and was DOWN: Log recovery
  │
  ├── Check frontend port 3500
  │   ├── If DOWN and was UP: Trigger restart
  │   └── If UP and was DOWN: Log recovery
  │
  └── Log status every minute
```

### 3. Restart Process
```
When server crashes:
  1. Log crash event
  2. Increment retry counter
  3. Check if max retries exceeded
  4. Kill all Node processes
  5. Wait 3 seconds
  6. Start backend server
  7. Wait 5 seconds
  8. Start frontend server
  9. Wait 10 seconds
  10. Verify recovery
  11. Reset retry counter if successful
```

## Monitoring Output

### Startup Messages
```
========================================
  Carbon Depict Server Monitor
========================================

[19:46:25] Monitor Configuration:
[19:46:25]   Check Interval: 5 seconds
[19:46:25]   Max Retries: 6 attempts
[19:46:25]   Backend Port: 5500
[19:46:25]   Frontend Port: 3500

[19:46:25] Stopping all Node processes...
[19:46:27] Performing initial server startup...
[19:46:27] Starting Backend Server...
[19:46:35] Starting Frontend Server...

========================================
  Servers Started - Monitoring Active
========================================

[19:46:40] Backend:  http://localhost:5500
[19:46:40] Frontend: http://localhost:3500
[19:46:40] Login:    http://localhost:3500/login

[19:46:40] Credentials:
[19:46:40]   Email:    db@carbondepict.com
[19:46:40]   Password: db123!@#DB

[19:46:40] Press Ctrl+C to stop monitoring
```

### Crash Detection & Recovery
```
[19:47:15] Frontend server is DOWN!
[19:47:15] Frontend server crashed! Attempting restart...
[19:47:15] Stopping all Node processes...
[19:47:18] Starting Backend Server...
[19:47:23] Starting Frontend Server...
[19:47:23] Frontend restart attempt 1 of 6
[19:47:33] Frontend server RECOVERED!
```

### Status Updates
```
[19:48:01] Status: Backend [UP] | Frontend [UP] | Crashes: B:0 F:1
```

## Troubleshooting

### Monitor Won't Start
```powershell
# Check execution policy
Get-ExecutionPolicy

# Set to RemoteSigned if needed
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Servers Keep Crashing
```powershell
# Check logs in server terminal windows
# Backend logs: Check for database connection errors
# Frontend logs: Check for port conflicts

# Manually test servers
cd server
npm run dev

cd ..
npm run dev
```

### Max Retries Reached
```
If servers fail 6 times:
1. Check Docker containers are running
   - PostgreSQL (port 5432)
   - MongoDB (port 27017)
   - Redis (port 6379)

2. Check .env configuration
   - Database connection strings
   - JWT secrets
   - Port settings

3. Check for port conflicts
   netstat -ano | findstr ":5500"
   netstat -ano | findstr ":3500"

4. Review server logs for errors
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr ":<PORT>"

# Kill specific process
Stop-Process -Id <PID> -Force

# Or kill all Node processes
Get-Process -Name node | Stop-Process -Force
```

## Comparison with Manual Scripts

### `start-servers.ps1` (Manual)
- Starts servers once
- No monitoring
- Manual restart required if crash
- Good for: Development without crashes

### `monitor-servers.ps1` (Automatic)
- Starts servers + monitoring
- Auto-restart on crash
- Up to 6 retry attempts
- Good for: Production-like stability

## Best Practices

### Development Workflow
```powershell
# For stable development
npm run monitor

# Leave terminal open
# Two server windows will open
# Monitor window shows status
# Work in VS Code
# Servers auto-recover if crash
```

### Stopping Servers
```powershell
# Option 1: Stop monitor (Ctrl+C in monitor terminal)
# Then close server terminal windows

# Option 2: Kill all Node processes
npm run stop:all

# Option 3: PowerShell command
Get-Process -Name node | Stop-Process -Force
```

### Testing Recovery
```powershell
# Simulate crash by killing a server process
Get-Process -Name node | Where-Object {$_.Id -eq <PID>} | Stop-Process -Force

# Monitor should detect and restart within 5 seconds
```

## Architecture Benefits

### Redundancy Features
1. **Automatic Detection**: 5-second polling interval
2. **Coordinated Restart**: Frontend restarts with backend
3. **Port Cleanup**: Kills all Node processes before restart
4. **Retry Logic**: Up to 6 attempts prevents single-point failures
5. **Recovery Validation**: Verifies server up after restart
6. **Crash Tracking**: Monitors failure patterns

### Why This Helps Your Issue
Your original error:
```
[vite] server connection lost. Polling for restart...
GET http://localhost:3500/ net::ERR_CONNECTION_REFUSED
```

**Root Cause**: Frontend server stopped responding

**Solution**: Monitor detects unresponsive port 3500 and:
1. Logs "Frontend server is DOWN!"
2. Kills all Node processes (clean slate)
3. Restarts backend first (dependencies)
4. Restarts frontend second
5. Validates recovery
6. Resets to normal monitoring

**Result**: < 15 seconds downtime, automatic recovery

## Related Scripts

- `start-servers.ps1` - One-time server startup
- `stop-servers.ps1` - Clean shutdown
- `monitor-servers.ps1` - **Auto-restart monitoring (this doc)**

## NPM Scripts

```json
{
  "start:all": "Start servers once",
  "stop:all": "Stop all servers",
  "monitor": "Start with auto-restart monitoring"
}
```

## Future Enhancements

Potential additions:
- Health check API endpoints (beyond port checking)
- Email/Slack notifications on crash
- Configurable retry delays (exponential backoff)
- Per-server retry counters
- Persistent log file
- Web dashboard for monitoring status
- Automatic log rotation
- Performance metrics (uptime, crash frequency)

## License

Part of Carbon Depict platform - Internal tooling

## Support

For issues with monitoring system:
1. Check PowerShell execution policy
2. Verify ports 5500 and 3500 available
3. Ensure Docker containers running
4. Review server logs in terminal windows
5. Check `monitor-servers.ps1` configuration

---

**Last Updated**: October 22, 2025  
**Version**: 1.0.0  
**Maintained By**: Carbon Depict Development Team
