@echo off
:: Auto-push enabled
echo ======================================
echo  Group Project Management System
echo ======================================
echo.
echo Step 1: Starting MongoDB (if installed as a service)...
net start MongoDB 2>nul || echo [INFO] MongoDB service not found. Make sure MongoDB is running separately.
echo.
echo Step 2: Starting Backend (Port 5000)...
start "Backend - Project Hub" cmd /k "cd /d %~dp0backend && npm run dev"
echo.
echo Step 3: Starting Frontend (Port 5173)...
start "Frontend - Project Hub" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo ======================================
echo  App will open at: http://localhost:5173
echo  Login: admin / admin123
echo ======================================
timeout /t 4 >nul
start http://localhost:5173
