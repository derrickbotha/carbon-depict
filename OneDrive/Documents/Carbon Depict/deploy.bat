@echo off
REM Carbon Depict - Production Deployment Script for Windows

echo ========================================
echo Carbon Depict - Production Deployment
echo ========================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found
    echo Please copy .env.example to .env and fill in the values
    echo cp .env.example .env
    exit /b 1
)

echo [OK] Environment file found
echo.

REM Build Docker images
echo [INFO] Building Docker images...
docker-compose build --no-cache

if errorlevel 1 (
    echo [ERROR] Failed to build images
    exit /b 1
)

echo [OK] Images built successfully
echo.

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose down

REM Start database services
echo [INFO] Starting database services...
docker-compose up -d postgres mongodb redis

echo [INFO] Waiting for databases to be ready...
timeout /t 10 /nobreak > nul

REM Start backend
echo [INFO] Starting backend API...
docker-compose up -d backend

echo [INFO] Waiting for backend to be ready...
timeout /t 5 /nobreak > nul

REM Start frontend
echo [INFO] Starting frontend application...
docker-compose up -d frontend

echo.
echo ================================
echo Deployment Complete!
echo ================================
echo.
echo Application Status:
docker-compose ps
echo.
echo Access URLs:
echo    Frontend: http://localhost:3500
echo    Backend API: http://localhost:5500
echo    API Health: http://localhost:5500/api/health
echo.
echo Useful Commands:
echo    View logs:        docker-compose logs -f
echo    Stop services:    docker-compose down
echo    Restart services: docker-compose restart
echo    View status:      docker-compose ps
echo.
echo [WARNING] Make sure to set up SSL certificates for production
echo [WARNING] Configure firewall rules and security groups
echo [WARNING] Set up regular database backups
