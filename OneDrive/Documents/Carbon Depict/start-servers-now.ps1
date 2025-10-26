# Quick Server Start Script
Write-Host "Starting Carbon Depict Servers..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start backend
Write-Host "Starting backend server on port 5500..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; node index.js"

# Wait for backend to start
Start-Sleep -Seconds 5

# Check if backend is running
$backendRunning = Test-NetConnection -ComputerName localhost -Port 5500 -WarningAction SilentlyContinue
if ($backendRunning.TcpTestSucceeded) {
    Write-Host "✅ Backend server running on port 5500" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend server may not be running properly" -ForegroundColor Yellow
}

# Start frontend
Write-Host "Starting frontend server on port 3500..." -ForegroundColor Green
Set-Location $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servers starting!" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5500" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3500" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Give the servers 10-15 seconds to start up..." -ForegroundColor Yellow

