@echo off
title AgriFlow Launcher
echo ===================================================
echo           Starting AgriFlow Platform
echo ===================================================

echo [1/4] Launching Spring Boot Backend (Port 8080)...
start "1. Spring Boot Backend (:8080)" cmd /k "cd /d "%~dp0FarmFresh_Backend" && mvnw.cmd spring-boot:run"

echo [2/4] Launching AI Intelligence API (Port 8000)...
start "2. AI Farm Intelligence (:8000)" cmd /k "cd /d "%~dp0agriflow-farm-intelligence-api" && uvicorn app.main:app --reload --port 8000"

echo [3/4] Launching Logistics Tracking Service (Port 5000)...
start "3. Logistics Service (:5000)" cmd /k "cd /d "%~dp0logistics-service" && npm start"

echo [4/4] Launching React Frontend (Port 5173)...
start "4. React Frontend (:5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo ===================================================
echo All 4 services started in separate windows!
echo Web App URL: http://localhost:5173
echo ===================================================
pause

