@echo off
echo Starting CarbonDepict Enterprise...
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd server && npm run dev"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting frontend...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo CarbonDepict Enterprise is starting...
echo Backend: http://localhost:5500
echo Frontend: http://localhost:3500
echo.
pause
