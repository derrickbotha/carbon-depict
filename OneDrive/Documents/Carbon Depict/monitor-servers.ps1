# Carbon Depict - Server Monitor & Auto-Restart Script
# This script monitors both servers and automatically restarts them if they crash

$ErrorActionPreference = "SilentlyContinue"

# Configuration
$projectRoot = "c:\Users\dbmos\OneDrive\Documents\Carbon Depict"
$backendPath = Join-Path $projectRoot "server"
$backendPort = 5500
$frontendPort = 3500
$maxRetries = 6
$checkInterval = 5  # seconds
$restartDelay = 3   # seconds

# Counters
$backendRetries = 0
$frontendRetries = 0
$backendCrashes = 0
$frontendCrashes = 0

# Process IDs
$backendPID = $null
$frontendPID = $null

function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Test-ServerPort {
    param($Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
        return $connection
    }
    catch {
        return $false
    }
}

function Stop-AllNodeProcesses {
    Write-Log "Stopping all Node processes..." -Color Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
}

function Start-BackendServer {
    Write-Log "Starting Backend Server..." -Color Green
    
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoExit -Command `"cd '$backendPath'; Write-Host 'Backend Server - Auto-Restart Enabled' -ForegroundColor Green; npm run dev`""
    $processInfo.UseShellExecute = $true
    $processInfo.WindowStyle = "Normal"
    
    $process = [System.Diagnostics.Process]::Start($processInfo)
    return $process.Id
}

function Start-FrontendServer {
    Write-Log "Starting Frontend Server..." -Color Green
    
    $processInfo = New-Object System.Diagnostics.ProcessStartInfo
    $processInfo.FileName = "powershell.exe"
    $processInfo.Arguments = "-NoExit -Command `"cd '$projectRoot'; Write-Host 'Frontend Server - Auto-Restart Enabled' -ForegroundColor Green; npm run dev`""
    $processInfo.UseShellExecute = $true
    $processInfo.WindowStyle = "Normal"
    
    $process = [System.Diagnostics.Process]::Start($processInfo)
    return $process.Id
}

function Restart-BackendServer {
    Write-Log "Backend server crashed! Attempting restart..." -Color Red
    $script:backendCrashes++
    $script:backendRetries++
    
    if ($script:backendRetries -gt $maxRetries) {
        Write-Log "Backend server failed $maxRetries times. Stopping monitor." -Color Red
        return $false
    }
    
    # Kill all node processes
    Stop-AllNodeProcesses
    Start-Sleep -Seconds $restartDelay
    
    # Restart backend
    $script:backendPID = Start-BackendServer
    Start-Sleep -Seconds 5
    
    # Restart frontend (since it depends on backend)
    $script:frontendPID = Start-FrontendServer
    
    Write-Log "Backend restart attempt $script:backendRetries of $maxRetries" -Color Yellow
    return $true
}

function Restart-FrontendServer {
    Write-Log "Frontend server crashed! Attempting restart..." -Color Red
    $script:frontendCrashes++
    $script:frontendRetries++
    
    if ($script:frontendRetries -gt $maxRetries) {
        Write-Log "Frontend server failed $maxRetries times. Stopping monitor." -Color Red
        return $false
    }
    
    # Kill all node processes
    Stop-AllNodeProcesses
    Start-Sleep -Seconds $restartDelay
    
    # Restart both servers
    $script:backendPID = Start-BackendServer
    Start-Sleep -Seconds 5
    $script:frontendPID = Start-FrontendServer
    
    Write-Log "Frontend restart attempt $script:frontendRetries of $maxRetries" -Color Yellow
    return $true
}

# Initial startup
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Carbon Depict Server Monitor" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Log "Monitor Configuration:" -Color Cyan
Write-Log "  Check Interval: $checkInterval seconds" -Color White
Write-Log "  Max Retries: $maxRetries attempts" -Color White
Write-Log "  Backend Port: $backendPort" -Color White
Write-Log "  Frontend Port: $frontendPort`n" -Color White

# Stop any existing servers
Stop-AllNodeProcesses

# Start servers
Write-Log "Performing initial server startup..." -Color Cyan
$backendPID = Start-BackendServer
Start-Sleep -Seconds 8

$frontendPID = Start-FrontendServer
Start-Sleep -Seconds 5

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  Servers Started - Monitoring Active" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Log "Backend:  http://localhost:$backendPort" -Color Cyan
Write-Log "Frontend: http://localhost:$frontendPort" -Color Cyan
Write-Log "Login:    http://localhost:$frontendPort/login`n" -Color Yellow

Write-Log "Credentials:" -Color White
Write-Log "  Email:    db@carbondepict.com" -Color White
Write-Log "  Password: db123!@#DB`n" -Color White

Write-Log "Press Ctrl+C to stop monitoring`n" -Color Yellow

# Monitoring loop
$lastBackendStatus = $true
$lastFrontendStatus = $true

while ($true) {
    Start-Sleep -Seconds $checkInterval
    
    # Check backend
    $backendAlive = Test-ServerPort -Port $backendPort
    
    if (-not $backendAlive -and $lastBackendStatus) {
        Write-Log "Backend server is DOWN!" -Color Red
        $continue = Restart-BackendServer
        if (-not $continue) {
            Write-Log "Monitor stopping due to max retries reached." -Color Red
            break
        }
        # Reset retry counter on successful restart
        Start-Sleep -Seconds 10
        if (Test-ServerPort -Port $backendPort) {
            Write-Log "Backend server RECOVERED!" -Color Green
            $script:backendRetries = 0
        }
    }
    elseif ($backendAlive -and -not $lastBackendStatus) {
        Write-Log "Backend server is UP!" -Color Green
        $script:backendRetries = 0
    }
    
    $lastBackendStatus = $backendAlive
    
    # Check frontend
    $frontendAlive = Test-ServerPort -Port $frontendPort
    
    if (-not $frontendAlive -and $lastFrontendStatus) {
        Write-Log "Frontend server is DOWN!" -Color Red
        $continue = Restart-FrontendServer
        if (-not $continue) {
            Write-Log "Monitor stopping due to max retries reached." -Color Red
            break
        }
        # Reset retry counter on successful restart
        Start-Sleep -Seconds 10
        if (Test-ServerPort -Port $frontendPort) {
            Write-Log "Frontend server RECOVERED!" -Color Green
            $script:frontendRetries = 0
        }
    }
    elseif ($frontendAlive -and -not $lastFrontendStatus) {
        Write-Log "Frontend server is UP!" -Color Green
        $script:frontendRetries = 0
    }
    
    $lastFrontendStatus = $frontendAlive
    
    # Status update every minute
    $currentSecond = (Get-Date).Second
    if ($currentSecond -lt $checkInterval) {
        $backendStatus = if ($backendAlive) { "UP" } else { "DOWN" }
        $frontendStatus = if ($frontendAlive) { "UP" } else { "DOWN" }
        Write-Log "Status: Backend [$backendStatus] | Frontend [$frontendStatus] | Crashes: B:$backendCrashes F:$frontendCrashes" -Color Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Red
Write-Host "  Monitor Stopped" -ForegroundColor Red
Write-Host "========================================`n" -ForegroundColor Red
