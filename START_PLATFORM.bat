@echo off
title DISASTER MANAGEMENT & EMERGENCY RESPONSE PLATFORM - SIH 2026
echo =========================================================================
echo    DISASTER MANAGEMENT & EMERGENCY RESPONSE PLATFORM (SIH 2026 PS-26206)
echo    Complete Lifecycle: BEFORE DISASTER ^> DURING DISASTER ^> AFTER DISASTER
echo =========================================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend API Server (Port 5000)...
start "NDMP Backend API" cmd /k "cd backend && npm start"

timeout /t 2 >nul

echo [2/2] Launching Frontend Web & Mobile Dashboard (Port 5173)...
start "NDMP Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo =========================================================================
echo Platform Successfully Initialized!
echo Web Application:        http://localhost:5173
echo Backend API & Telemetry: http://localhost:5000/api
echo =========================================================================
echo.
pause
