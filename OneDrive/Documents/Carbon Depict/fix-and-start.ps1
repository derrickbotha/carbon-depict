# Immediate Fix and Start Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Carbon Depict - Emergency Restart" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

# Set working directory
Set-Location "C:\Users\dbmos\OneDrive\Documents\Carbon Depict"

# Kill all node processes
Write-Host "Stopping all node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Check MongoDB connection
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoCheck = Get-Process -Name mongod -ErrorAction SilentlyContinue
if ($mongoCheck) {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB may not be running (this is OK if using external MongoDB)" -ForegroundColor Yellow
}

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\dbmos\OneDrive\Documents\Carbon Depict\server'; Write-Host 'Backend starting...' -ForegroundColor Green; node index.js"

# Wait
Start-Sleep -Seconds 5

# Check ports
Write-Host ""
Write-Host "Checking server status..." -ForegroundColor Yellow
$ports = netstat -ano | findstr "LISTENING"
$port3500 = $ports | Select-String "3500"
$port5500 = $ports | Select-String "5500"

if ($port3500) {
    Write-Host "✅ Frontend running on port 3500" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend NOT running on port 3500" -ForegroundColor Red
}

if ($port5500) {
    Write-Host "✅ Backend running on port 5500" -ForegroundColor Green
} else {
    Write-Host "❌ Backend NOT running on port 5500" -ForegroundColor Red
    Write-Host "Start backend manually with: cd server; node index.js" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3500" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5500" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan



