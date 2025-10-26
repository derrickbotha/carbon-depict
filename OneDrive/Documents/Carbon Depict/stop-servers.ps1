# Carbon Depict - Server Shutdown Script
# This script stops all Node.js processes (both backend and frontend servers)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Stopping Carbon Depict Servers" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Stop all Node processes
Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow

$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "Stopped $($nodeProcesses.Count) Node.js process(es)" -ForegroundColor Green
} else {
    Write-Host "No Node.js processes found running" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  All Servers Stopped" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Keep window open for 3 seconds
Start-Sleep -Seconds 3
