@echo off
REM Carbon Depict - Development Environment Startup for Windows

echo ================================================
echo Starting Carbon Depict Development Environment
echo ================================================
echo.

REM Start development services
docker-compose -f docker-compose.dev.yml up -d

echo.
echo [OK] Development environment is starting...
echo.
echo Service Status:
docker-compose -f docker-compose.dev.yml ps
echo.
echo Access URLs:
echo    Frontend (Vite HMR): http://localhost:3500
echo    Backend (Nodemon):   http://localhost:5500
echo    PostgreSQL:          localhost:5432
echo    MongoDB:             localhost:27017
echo    Redis:               localhost:6379
echo.
echo Development Features:
echo    [OK] Hot Module Replacement (HMR) enabled
echo    [OK] Nodemon auto-restart on code changes
echo    [OK] Volume mounts for live code updates
echo    [OK] Debug-friendly configurations
echo.
echo Useful Commands:
echo    View logs:     docker-compose -f docker-compose.dev.yml logs -f
echo    Stop services: docker-compose -f docker-compose.dev.yml down
echo    Restart:       docker-compose -f docker-compose.dev.yml restart
echo    Shell access:  docker-compose -f docker-compose.dev.yml exec backend-dev sh
