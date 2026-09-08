# 🌾 AgriFlow - AI-Powered Farm-to-Market Intelligence & Supply Aggregation

> An end-to-end platform connecting farmers, buyers, AI-powered market intelligence, supply aggregation, and intelligent logistics in one connected farm-to-market ecosystem.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Service Responsibilities](#service-responsibilities)
- [End-to-End Workflow](#end-to-end-workflow)
- [API Overview](#api-overview)
- [Real-Time Events](#real-time-events)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Security](#security)
- [Design Principles](#design-principles)
- [Demo Scenario](#demo-scenario)
- [Future Scope](#future-scope)

---

## 🌱 Overview

AgriFlow is an AI-powered farm-to-market platform that answers four critical questions:

1. **What should be sold?** — Visual quality assessment & inventory management
2. **When should it be sold?** — Price & demand prediction
3. **Which buyer is the best fit?** — Intelligent buyer matching & supply aggregation
4. **How should it be delivered?** — Route optimization & live GPS tracking

### Core Capabilities

- ✅ Digital produce-lot creation with quality assessment
- ✅ AI-powered price & demand prediction
- ✅ Intelligent buyer matching & supply aggregation
- ✅ Real-time GPS tracking & route optimization
- ✅ Automatic route recalculation & ETA calculation
- ✅ Complete order & payment lifecycle tracking

---

## 🎯 Problem Statement

**Traditional farm-to-market supply chains face:**

| Challenge | Impact |
|-----------|--------|
| Limited price & demand visibility | Farmers make uninformed decisions |
| Inconsistent quality verification | Buyers lack confidence in suppliers |
| Fragmented supply across farms | Individual lots don't meet bulk requirements |
| Inefficient logistics | Disconnected data across systems |
| No real-time delivery tracking | Lack of transparency & control |

**Result:** Reduced transparency, inefficient operations, and limited market access for small farmers.

---

## 🚀 Key Features

### 👨‍🌾 Farmer Module
- Create digital produce lots (crop type, quantity, harvest date, geolocation, photos)
- View quality assessment results
- Access market insights & price predictions
- Track active orders & expected earnings
- Monitor live shipments

### 🧪 Visual Quality Assessment
- AI-powered image analysis
- Automatic grading (A/B/C)
- Defect detection & quality scoring
- Example output:
  ```
  Score: 87/100 | Grade: A
  Good: 82% | Damaged: 8% | Rotten: 5%
  ```

### 📈 Price Prediction
- Historical market data analysis
- Future price movement estimates
- Hold/Sell recommendations
- Example: Current ₹2,600/qtl → Predicted ₹2,780/qtl in 5 days

### 📊 Demand Prediction
- Seasonality & trend analysis
- Location-based demand forecasting
- Example: Delhi region expecting 38 tonnes onion demand in 7 days

### 🤝 Smart Buyer Matching
- Rank buyers by compatibility (quality, price, quantity, distance)
- Transparency through explainable matching scores
- Example: 92% match for Buyer B (20 km away)

### 📦 Supply Aggregation
- Combine multiple farmer lots to meet bulk requirements
- Enable small farms to access larger procurement opportunities
- Example: 3 farmers (500kg + 700kg + 800kg) = 2,000kg order

### 🚚 Logistics & Live Tracking
- Route optimization (Farm → Collection Centre → Buyer)
- Real-time GPS tracking with WebSocket updates
- Route deviation detection & automatic recalculation
- ETA calculation with remaining distance

### 📋 Order & Payment Lifecycle
```
ORDER PLACED → PICKUP → TRANSIT → DELIVERY → 
QUALITY VERIFICATION → PAYMENT RELEASE
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────┐
│         FRONTEND                │
│    React / Next.js              │
│  • Farmer Portal                │
│  • Buyer Portal                 │
│  • Live Logistics Map           │
└────────────┬────────────────────┘
             │ REST / WebSocket
    ┌────────┼────────┬─────────────────┐
    │        │        │                 │
    ▼        ▼        ▼                 ▼
┌────────┐ ┌──────┐ ┌──────┐    ┌──────────────┐
│ Spring │ │FastAPI   │Node.js │    │ External     │
│ Boot   │ │(AI/ML)   │(Logistics)  │ Services     │
│ Core   │ │        │ ├──────┤    ├──────────────┤
│ Logic  │ │        │ │Redis  │    │ Maps/Routing │
└───┬────┘ └──────┘ └────┬──┘    │ Provider     │
    │                 │        └──────────────┘
    ▼                 ▼
┌─────────────────────────┐
│   PostgreSQL            │
│   (Persistent Data)     │
└─────────────────────────┘
```

### Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React / Next.js |
| **Core Backend** | Spring Boot (Java) |
| **AI/ML Backend** | FastAPI (Python) |
| **Logistics** | Node.js / Express |
| **Database** | PostgreSQL |
| **Real-Time** | WebSockets / Socket.IO |
| **Routing** | Road-based optimization |

---

## 🧩 Service Responsibilities

### **Spring Boot** — Core Business Backend
Owns all business logic and persistent data:
- Authentication & JWT-based authorization
- User profiles (farmers, buyers)
- Produce lot management
- Order processing & status tracking
- Business validation rules
- PostgreSQL persistence

**Key Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/lots
GET    /api/lots/{id}
POST   /api/orders
GET    /api/orders/{id}
GET    /api/dashboard/*
```

### **FastAPI** — AI/ML Backend
Independent ML service for intelligent decision support:
- Visual quality assessment
- Price prediction
- Demand forecasting
- Buyer matching algorithm
- Supply aggregation logic
- Pydantic request validation

**Key Endpoints:**
```
POST /api/quality/analyze
POST /api/prediction/price
POST /api/prediction/demand
POST /api/matching/lots
POST /api/aggregation/create-batch
```

### **Node.js** — Logistics & Real-Time Backend
Handles delivery execution and live updates:
- Route optimization & planning
- GPS tracking & vehicle location management
- Deviation detection & route recalculation
- ETA calculation
- WebSocket/Socket.IO real-time broadcasts
- Shipment status updates

**Key Endpoints:**
```
POST /api/logistics/route
POST /api/logistics/recalculate
POST /api/tracking/location
GET  /api/tracking/{shipmentId}
```

---

## 🔄 End-to-End Workflow

```
1. Farmer Lists Produce
   ↓ (Photos + Quantity)
2. AI Quality Assessment
   ↓ (Grade A/B/C)
3. Market Intelligence
   ↓ (Price + Demand)
4. Intelligent Matching
   ↓ (Best buyers identified)
5. Supply Aggregation
   ↓ (Multiple lots combined)
6. Order Created
   ↓ (Spring Boot updates state)
7. Logistics Planning
   ↓ (Route generated)
8. Live Tracking
   ↓ (GPS + WebSocket updates)
9. Delivery & Payment
   ↓ (Order fulfilled)
10. Payment Released
    ↓ (Cycle complete)
```

---

## 🔌 API Overview

### Authentication
```bash
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
```

### Produce Management
```bash
POST   /api/lots                  # Create produce lot
GET    /api/lots                  # List all lots
GET    /api/lots/{id}             # Get specific lot
PUT    /api/lots/{id}             # Update lot
DELETE /api/lots/{id}             # Delete lot
```

### Orders
```bash
POST   /api/orders                # Create order
GET    /api/orders                # List orders
GET    /api/orders/{id}           # Get order details
```

### AI Services
```bash
POST   /api/quality/analyze       # Analyze produce quality
POST   /api/prediction/price      # Predict future prices
POST   /api/prediction/demand     # Forecast demand
POST   /api/matching/lots         # Get buyer matches
POST   /api/aggregation/create-batch  # Create supply batch
```

### Logistics & Tracking
```bash
POST   /api/logistics/route       # Generate optimal route
POST   /api/logistics/recalculate # Recalculate route after deviation
POST   /api/tracking/location     # Update vehicle location (GPS)
GET    /api/tracking/{shipmentId} # Get shipment details
```

---

## ⚡ Real-Time Events

Node.js uses **WebSockets/Socket.IO** for live updates:

| Event | Purpose |
|-------|---------|
| `shipment:started` | Delivery begins |
| `vehicle:location` | GPS update received |
| `route:updated` | Route recalculated |
| `shipment:status` | Status changed |
| `shipment:delivered` | Delivery completed |
| `route:deviation` | Vehicle off-route |

**Example Flow:**
```
Vehicle GPS → Node.js Processing → Socket.IO Broadcast → 
Frontend Map Update (No page refresh needed)
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js & npm
- Java 11+ & Maven
- Python 3.9+
- PostgreSQL 13+
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/coder-aman2021/AgriFlow.git
cd AgriFlow
```

**2. Setup PostgreSQL**
```sql
CREATE DATABASE agriflow;
-- Configure in Spring Boot application.properties
```

**3. Start Spring Boot (Core Backend)**
```bash
cd spring-boot-service
./mvnw spring-boot:run
```

**4. Start FastAPI (AI/ML Service)**
```bash
cd fastapi-service
python -m venv venv

# Activate virtual environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

**5. Start Node.js (Logistics Service)**
```bash
cd logistics-service
npm install
npm run dev
```

**6. Start Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Default URLs:**
- Frontend: `http://localhost:3000`
- Spring Boot: `http://localhost:8080`
- FastAPI: `http://localhost:8000`
- Node.js: `http://localhost:5000`

---

## ⚙️ Environment Configuration

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:8080
VITE_AI_API_URL=http://localhost:8000
VITE_LOGISTICS_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Spring Boot (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agriflow
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-secret-key
fastapi.base.url=http://localhost:8000
node.logistics.url=http://localhost:5000
```

### FastAPI (`.env`)
```env
MODEL_PATH=./models
SPRING_BOOT_URL=http://localhost:8080
```

### Node.js (`.env`)
```env
PORT=5000
SPRING_BOOT_URL=http://localhost:8080
ROUTING_SERVICE_URL=https://router.api
CORS_ORIGIN=http://localhost:3000
```

---

## 🔒 Security

### Core Practices
- ✅ Environment variables for all secrets (never commit credentials)
- ✅ JWT-based authentication with role-based access control
- ✅ Password hashing (bcrypt recommended)
- ✅ Request validation at service boundaries
- ✅ Ownership checks on farmer/buyer resources
- ✅ HTTPS in production
- ✅ CORS restricted to trusted origins

### Production Checklist
- [ ] Use secret manager (AWS Secrets, HashiCorp Vault)
- [ ] Enable rate limiting
- [ ] Add audit logging
- [ ] Implement request signing for internal services
- [ ] Setup monitoring & alerting
- [ ] Regular security audits

---

## 🎨 Design Principles

### For Farmers ✓
- **Simple** — Easy to navigate
- **Mobile-first** — Touch-friendly on field
- **Readable outdoors** — Good contrast
- **Minimal jargon** — Clear language
- **Large controls** — Easy to tap
- **Practical insights** — Actionable recommendations

### For Buyers ✓
- **Efficient** — Quick procurement
- **Transparent** — Quality visibility
- **Bulk-friendly** — Aggregation support
- **Match-aware** — Clear recommendations

### Overall ✓
The platform feels **professional**, **trustworthy**, **practical**, and **modern** — not like a generic SaaS dashboard.

---

## 🧪 Demo Scenario

### Step-by-Step Walkthrough

**Step 1:** Farmer creates lot
```
Crop: Onion | Qty: 500kg | Location: Delhi | Photos: ✓
```

**Step 2:** AI quality assessment
```
Grade: A | Score: 87/100 | Quality: Excellent
```

**Step 3:** Market intelligence
```
Current: ₹2,600/qtl | Predicted: ₹2,780/qtl (5 days)
Recommendation: Hold for better price
```

**Step 4:** Buyer matching
```
Buyer A needs 1,000kg Grade-A Onion
Match Score: 92% (20km away) ✓
```

**Step 5:** Supply aggregation
```
Farmer A: 500kg ✓
Farmer B: 300kg ✓
Farmer C: 200kg ✓
Total: 1,000kg (Order fulfilled)
```

**Step 6:** Order placed & logistics
```
STATUS: PICKUP
Route: Farm → Collection Centre → Buyer
Vehicle: Ready for dispatch
```

**Step 7:** Live tracking
```
Vehicle GPS → Real-time map updates
Remaining: 24.35 km | ETA: 28.5 minutes
```

**Step 8:** Route deviation detection
```
Vehicle off-route by 19.69 km
Auto-recalculating... New route ready ✓
```

**Step 9:** Delivery complete
```
STATUS: DELIVERY → QUALITY VERIFICATION → PAYMENT RELEASE ✓
```

---

## 📈 Future Scope

### Phase 2 Enhancements
- 🔬 Advanced computer vision models (crop-specific grading)
- 📊 Regional demand forecasting with ML
- 💰 Dynamic pricing intelligence
- 🚛 Multi-farmer route optimization
- 🌡️ Cold-chain monitoring with IoT sensors
- 📱 Offline-first farmer workflows
- 🌐 Multi-language support (Hindi, regional languages)
- 🔔 Push notifications & SMS alerts
- 💳 Payment gateway integration (Razorpay, PayU)

---

## 📁 Project Structure

```
AgriFlow/
├── frontend/                    # React/Next.js UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/           # API calls
│   │   ├── hooks/
│   │   └── types/
│   └── package.json
│
├── spring-boot-service/        # Core business logic
│   ├── src/main/java/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   ├── repository/
│   │   └── config/
│   └── pom.xml
│
├── fastapi-service/            # AI/ML backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   └── services/
│   ├── models/                 # ML models
│   ├── inference/
│   └── requirements.txt
│
├── logistics-service/          # Node.js logistics
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── socket/
│   │   └── middleware/
│   ├── config/
│   └── package.json
│
└── README.md
```

---

## 🏆 Why AgriFlow?

| Traditional Marketplace | AgriFlow |
|------------------------|----------|
| Farmer → Listing → Buyer | Farmer → Quality → Intelligence → Matching → Aggregation → Logistics → Tracking → Payment |
| Limited visibility | Complete transparency |
| Manual matching | AI-powered matching |
| No aggregation | Supply aggregation |
| No tracking | Live GPS tracking |

**Result:** A smarter, more connected farm-to-market journey.

---

## 📊 Data Ownership

| Concern | Owner |
|---------|-------|
| Users, Auth, JWT, Roles | Spring Boot |
| Produce Lots, Orders, Core State | Spring Boot |
| PostgreSQL | Spring Boot |
| Quality Assessment, Price/Demand Prediction | FastAPI |
| Buyer Matching, Supply Aggregation | FastAPI |
| Route Optimization, GPS Tracking, ETA | Node.js |
| WebSockets, Live Events | Node.js |

---

## 👥 Team Structure

| Team | Responsibility |
|------|-----------------|
| **Backend (Spring Boot)** | Core business logic, authentication, database |
| **AI/ML (FastAPI)** | Computer vision, predictions, matching algorithms |
| **DevOps (Node.js)** | Logistics, routing, real-time tracking |
| **Frontend (React)** | User interfaces, live map, dashboards |

Each team works independently and integrates through stable REST APIs.

---

## 🚀 Quick Links

- 📚 [API Documentation](#api-overview)
- 🔧 [Setup Guide](#getting-started)
- 🔒 [Security Guide](#security)
- 🎯 [Architecture](#system-architecture)

---

## 📄 Project Information

- **Category:** AI-Powered Farm-to-Market Intelligence
- **Architecture:** Microservices
- **Status:** Active Development
- **License:** [Add your license]

---

## ⭐ Acknowledgements

Built as a collaborative multi-service system with clearly separated responsibilities across core business services, AI/ML intelligence, logistics execution, and frontend user experiences.

---

<div align="center">

🌾 **From knowing what to sell, to knowing when, where, and how to deliver it — AgriFlow makes the farm-to-market journey smarter.**

[⬆ Back to top](#-agriflow---ai-powered-farm-to-market-intelligence--supply-aggregation)

</div>
