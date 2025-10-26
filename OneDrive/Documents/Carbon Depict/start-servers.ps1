# Carbon Depict - Server Startup Script
# This script starts both backend and frontend servers in separate terminal windows

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Starting Carbon Depict Servers" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop any existing Node processes
Write-Host "Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Get the project root directory
$projectRoot = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict"

Write-Host "Project root: $projectRoot`n" -ForegroundColor White

# Start Backend Server in new terminal
Write-Host "Starting Backend Server..." -ForegroundColor Green
$backendPath = Join-Path $projectRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait a bit for backend to initialize
Start-Sleep -Seconds 3

# Start Frontend Server in new terminal
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; Write-Host 'Frontend Server Starting...' -ForegroundColor Green; npm run dev"

# Wait for servers to start
Start-Sleep -Seconds 3

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Backend Server:  http://localhost:5500" -ForegroundColor Cyan
Write-Host "Frontend Server: http://localhost:3500`n" -ForegroundColor Cyan

Write-Host "Login Credentials:" -ForegroundColor Yellow
Write-Host "  Email:    db@carbondepict.com" -ForegroundColor White
Write-Host "  Password: db123!@#DB`n" -ForegroundColor White

Write-Host "Two terminal windows have been opened:" -ForegroundColor Yellow
Write-Host "  1. Backend Server (port 5500)" -ForegroundColor White
Write-Host "  2. Frontend Server (port 3500)`n" -ForegroundColor White

Write-Host "You can close this window. Servers will keep running." -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Keep this window open for 10 seconds so user can read the message
Start-Sleep -Seconds 10
