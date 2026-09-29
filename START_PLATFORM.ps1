# START_PLATFORM.ps1 - PowerShell Launcher
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "   DISASTER MANAGEMENT & EMERGENCY RESPONSE PLATFORM (SIH 2026 PS-26206)" -ForegroundColor White
Write-Host "   Complete Lifecycle: BEFORE DISASTER > DURING DISASTER > AFTER DISASTER" -ForegroundColor Yellow
Write-Host "=========================================================================" -ForegroundColor Cyan

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting Backend API Server (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptPath\backend'; npm.cmd start"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting Frontend Web & Mobile App (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptPath\frontend'; npm.cmd run dev"

Write-Host "`nPlatform online at http://localhost:5173" -ForegroundColor Cyan
