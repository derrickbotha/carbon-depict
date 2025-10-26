# Autonomous System Startup with Redundancy
# Handles multiple potential failure scenarios

param(
    [switch]$SkipBackend = $false,
    [switch]$SkipFrontend = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Carbon Depict - Autonomous Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$backendPort = 5500
$frontendPort = 3500
$maxRetries = 3
$retryDelay = 5000 # 5 seconds

# Function to check if port is in use
function Test-PortInUse {
    param([int]$Port)
    $connections = netstat -ano | findstr ":$Port" | findstr "LISTENING"
    return $connections.Length -gt 0
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $connections = netstat -ano | findstr ":$Port" | findstr "LISTENING"
    foreach ($connection in $connections) {
        if ($connection -match '\s+(\d+)\s*$') {
            $processId = $matches[1]
            Write-Host "Killing process $processId on port $Port" -ForegroundColor Yellow
            try {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Start-Sleep -Milliseconds 1000
            } catch {
                Write-Host "Failed to kill process $processId" -ForegroundColor Red
            }
        }
    }
}

# Function to wait for service to be ready
function Wait-ForService {
    param(
        [int]$Port,
        [int]$TimeoutSeconds = 30
    )
    
    $elapsed = 0
    while ($elapsed -lt $TimeoutSeconds) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/api/health" -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch {
            Start-Sleep -Milliseconds 1000
            $elapsed++
        }
    }
    return $false
}

# Function to start backend with retry
function Start-Backend {
    Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        Write-Host "Attempt $i/$maxRetries" -ForegroundColor Yellow
        
        # Check if port is already in use
        if (Test-PortInUse -Port $backendPort) {
            Write-Host "Port $backendPort is in use, cleaning up..." -ForegroundColor Yellow
            Stop-ProcessOnPort -Port $backendPort
            Start-Sleep -Milliseconds 2000
        }
        
        try {
            Push-Location "server"
            Start-Process -FilePath "node" -ArgumentList "index.js" -WindowStyle Hidden
            Pop-Location
            
            Write-Host "Waiting for backend to be ready..." -ForegroundColor Yellow
            if (Wait-ForService -Port $backendPort) {
                Write-Host "✅ Backend Server Started Successfully" -ForegroundColor Green
                return $true
            } else {
                Write-Host "Backend failed to start within timeout" -ForegroundColor Red
            }
        } catch {
            Write-Host "Error starting backend: $_" -ForegroundColor Red
        }
        
        if ($i -lt $maxRetries) {
            Write-Host "Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
    
    Write-Host "❌ Backend failed to start after $maxRetries attempts" -ForegroundColor Red
    return $false
}

# Function to start frontend with retry
function Start-Frontend {
    Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Green
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        Write-Host "Attempt $i/$maxRetries" -ForegroundColor Yellow
        
        # Check if port is already in use
        if (Test-PortInUse -Port $frontendPort) {
            Write-Host "Port $frontendPort is in use, cleaning up..." -ForegroundColor Yellow
            Stop-ProcessOnPort -Port $frontendPort
            Start-Sleep -Milliseconds 2000
        }
        
        try {
            Start-Process -FilePath "npm" -ArgumentList "run dev" -WindowStyle Hidden
            Pop-Location
            
            Write-Host "Frontend starting (check browser at http://localhost:$frontendPort)" -ForegroundColor Yellow
            return $true
        } catch {
            Write-Host "Error starting frontend: $_" -ForegroundColor Red
        }
        
        if ($i -lt $maxRetries) {
            Write-Host "Retrying in 5 seconds..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        }
    }
    
    Write-Host "❌ Frontend failed to start after $maxRetries attempts" -ForegroundColor Red
    return $false
}

# Main execution
try {
    # Start Backend
    if (-not $SkipBackend) {
        $backendStarted = Start-Backend
        if (-not $backendStarted) {
            Write-Host "Backend startup failed. Use -SkipBackend to continue anyway." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️  Skipping Backend (instructed)" -ForegroundColor Yellow
    }
    
    # Start Frontend
    if (-not $SkipFrontend) {
        $frontendStarted = Start-Frontend
        if (-not $frontendStarted) {
            Write-Host "Frontend startup failed. Use -SkipFrontend to continue anyway." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⏭️  Skipping Frontend (instructed)" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "✅ Startup Complete" -ForegroundColor Green
    Write-Host "Backend:  http://localhost:$backendPort" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:$frontendPort" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Startup failed: $_" -ForegroundColor Red
    exit 1
}

