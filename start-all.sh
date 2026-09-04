#!/usr/bin/env bash
# ===================================================
#           Starting AgriFlow Platform (Linux/macOS)
# ===================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==================================================="
echo "          Starting AgriFlow Platform               "
echo "==================================================="

# Function to kill all background processes on Ctrl+C
cleanup() {
    echo ""
    echo "Shutting down all AgriFlow services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# 1. Spring Boot Backend
echo "[1/4] Starting Spring Boot Backend (Port 8080)..."
(cd "$ROOT_DIR/FarmFresh_Backend" && ./mvnw spring-boot:run) &

# 2. Python AI Farm Intelligence API
echo "[2/4] Starting AI Farm Intelligence API (Port 8000)..."
(cd "$ROOT_DIR/agriflow-farm-intelligence-api" && uvicorn app.main:app --reload --port 8000) &

# 3. Logistics Tracking Service
echo "[3/4] Starting Logistics Service (Port 5000)..."
(cd "$ROOT_DIR/logistics-service" && npm start) &

# 4. React Frontend
echo "[4/4] Starting React Frontend (Port 5173)..."
(cd "$ROOT_DIR/frontend" && npm run dev) &

echo "==================================================="
echo "All 4 services are starting in the background!"
echo "Web App URL: http://localhost:5173"
echo "Press Ctrl+C at any time to stop all services."
echo "==================================================="

wait
