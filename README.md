# 🌾 AgriFlow

## AI-Powered Farm-to-Market Intelligence, Supply Aggregation & Smart Logistics Platform

> **AgriFlow connects farmers, buyers, AI-powered market intelligence, supply aggregation, and intelligent logistics into one integrated farm-to-market ecosystem.**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Core%20Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
[![AI](https://img.shields.io/badge/AI-FastAPI%20%2B%20Hosted%20Models-orange)](https://fastapi.tiangolo.com/)
[![Logistics](https://img.shields.io/badge/Logistics-Node.js%20%2B%20Express-yellow)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Add%20Your%20License-lightgrey)](#license)

---

# 📋 Table of Contents

- [1. What is AgriFlow?](#1-what-is-agriflow)
- [2. Problem Statement](#2-problem-statement)
- [3. Solution](#3-solution)
- [4. Key Features](#4-key-features)
- [5. Users](#5-users)
- [6. Technology Stack](#6-technology-stack)
- [7. System Architecture](#7-system-architecture)
- [8. Service Architecture](#8-service-architecture)
- [9. Data Flow](#9-data-flow)
- [10. End-to-End Workflow](#10-end-to-end-workflow)
- [11. AI/ML Architecture](#11-aiml-architecture)
- [12. Logistics Architecture](#12-logistics-architecture)
- [13. Redis & Caching Architecture](#13-redis--caching-architecture)
- [14. Authentication & Security](#14-authentication--security)
- [15. Project Structure](#15-project-structure)
- [16. Prerequisites](#16-prerequisites)
- [17. Clone the Repository](#17-clone-the-repository)
- [18. Local Development Setup](#18-local-development-setup)
- [19. Environment Variables](#19-environment-variables)
- [20. Running the Complete System](#20-running-the-complete-system)
- [21. API Architecture](#21-api-architecture)
- [22. Real-Time Communication](#22-real-time-communication)
- [23. Example User Journey](#23-example-user-journey)
- [24. Deployment Architecture](#24-deployment-architecture)
- [25. Testing](#25-testing)
- [26. Troubleshooting](#26-troubleshooting)
- [27. Design Decisions](#27-design-decisions)
- [28. Future Scope](#28-future-scope)
- [29. Contributing](#29-contributing)
- [30. License](#30-license)

---

# 1. What is AgriFlow?

AgriFlow is a **microservice-based agricultural technology platform** designed to connect the complete journey of agricultural produce:

```text
Farmer
   ↓
Produce Listing
   ↓
AI Quality Assessment
   ↓
Price & Demand Intelligence
   ↓
Buyer Matching
   ↓
Supply Aggregation
   ↓
Order Creation
   ↓
Logistics Planning
   ↓
Live GPS Tracking
   ↓
Delivery
   ↓
Order Completion
```

Instead of treating farming, marketplace operations, artificial intelligence, and transportation as separate systems, AgriFlow combines them into a single workflow.

The platform is designed around four major questions:

### 1. What should be sold?

AgriFlow analyzes uploaded produce images and evaluates the visible quality of the produce.

### 2. When should it be sold?

The platform provides price and demand forecasting to help users understand possible market movement.

### 3. Who should buy it?

The buyer-matching layer compares available produce with buyer requirements.

### 4. How should it be delivered?

The logistics service plans routes, tracks vehicles, detects deviations, recalculates routes, and provides ETA information.

---

# 2. Problem Statement

Traditional agricultural supply chains often suffer from fragmented information.

| Problem | Consequence |
|---|---|
| Farmers have limited market intelligence | Poor selling decisions |
| Produce quality is difficult to verify remotely | Buyer uncertainty |
| Small farmers have limited quantities | Difficulty fulfilling bulk orders |
| Buyer discovery is fragmented | Lost procurement opportunities |
| Logistics information is disconnected | Poor coordination |
| Delivery tracking is limited | Low transparency |
| Market data is difficult to interpret | Reactive rather than informed decisions |

AgriFlow addresses these problems by connecting the complete process through multiple specialized services.

---

# 3. Solution

AgriFlow separates the system into independent services.

```text
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │     React + Vite    │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
        ┌─────────────────┐ ┌──────────────┐ ┌──────────────────┐
        │ Spring Boot     │ │   FastAPI    │ │ Node.js          │
        │ Core Backend    │ │ AI/ML        │ │ Logistics        │
        │                 │ │              │ │                  │
        │ Auth            │ │ Quality      │ │ Routes           │
        │ Users           │ │ Forecasting  │ │ GPS              │
        │ Produce         │ │ Matching     │ │ ETA              │
        │ Orders          │ │ Aggregation  │ │ WebSockets       │
        └────────┬────────┘ └──────────────┘ └────────┬─────────┘
                 │                                    │
                 ▼                                    ▼
        ┌─────────────────┐                  ┌─────────────────┐
        │   PostgreSQL    │                  │ Redis / Cache   │
        │ Persistent Data │                  │ Fast State      │
        └─────────────────┘                  └─────────────────┘
```

---

# 4. Key Features

## 👨‍🌾 Farmer Management

Farmers can:

- Create produce listings
- Add crop information
- Add quantity
- Upload produce images
- View quality analysis
- View market intelligence
- Track orders
- Monitor shipments

---

## 🧪 AI-Based Produce Quality Assessment

The AI service accepts produce images and performs visual analysis.

Example:

```text
Input:
    Produce Image

        ↓

AI Vision Model

        ↓

Quality Analysis

        ↓

Structured Response

Grade: A
Score: 87/100
Condition: Good
Defects: Low
```

The response is validated using Pydantic schemas before being returned to the consuming service.

---

## 📈 Price Forecasting

AgriFlow can use a time-series forecasting model to estimate future prices.

Example:

```text
Input price sequence
        ↓
Chronos forecasting model
        ↓
Future prediction
        ↓
7-day forecast
```

The forecasting service is intentionally separated from the core Spring Boot application so that AI/ML components can evolve independently.

---

## 📊 Demand Forecasting

Demand forecasting estimates future demand based on the supplied time-series information.

```text
Historical / supplied observations
             ↓
      Time-series model
             ↓
      Future demand
             ↓
       Forecast result
```

---

## 🤝 Buyer Matching

The matching service evaluates compatibility between:

```text
Produce
 +
Quantity
 +
Quality
 +
Price
 +
Location
        ↓
Buyer Requirements
```

The system can calculate a compatibility score based on relevant criteria.

---

## 📦 Supply Aggregation

A single farmer may not have enough produce to fulfill a bulk requirement.

Example:

```text
Farmer A → 500 kg
Farmer B → 300 kg
Farmer C → 200 kg
-------------------
Total    → 1000 kg
```

AgriFlow can combine compatible lots into an aggregated supply batch.

This allows smaller producers to participate in larger procurement opportunities.

---

# 5. Users

AgriFlow primarily operates around two major marketplace actors.

## 👨‍🌾 Farmer

Responsible for:

- Listing produce
- Uploading images
- Providing quantity and location
- Reviewing AI analysis
- Viewing market intelligence
- Managing orders
- Tracking shipments

## 🏢 Buyer

Responsible for:

- Discovering available produce
- Reviewing quality
- Comparing available lots
- Matching supply with requirements
- Creating/processing orders
- Tracking deliveries

---

# 6. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Build Tool | Vite | Frontend development/build |
| Styling | Tailwind CSS | UI styling |
| Core Backend | Java + Spring Boot | Business logic |
| ORM | Hibernate / JPA | Database interaction |
| Database Driver | JDBC | PostgreSQL connectivity |
| API | REST | Service communication |
| Authentication | JWT | Authentication/authorization |
| AI Backend | Python + FastAPI | AI/ML services |
| Validation | Pydantic | Request/response validation |
| AI Models | Hosted AI APIs | Quality & forecasting |
| Logistics | Node.js + Express | Logistics APIs |
| Real-Time | Socket.IO / WebSockets | Live updates |
| Cache | Redis | Fast-changing/temporary data |
| Database | PostgreSQL | Persistent relational storage |
| Containerization | Docker | Service deployment |
| Version Control | Git + GitHub | Source control |

---

# 7. System Architecture

AgriFlow follows a **microservice-oriented architecture**.

```text
                         ┌──────────────────────┐
                         │      React + Vite    │
                         │       Frontend       │
                         └───────────┬──────────┘
                                     │
                      REST APIs / WebSocket
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
     │  Spring Boot    │   │     FastAPI     │   │     Node.js     │
     │  Core Backend   │   │    AI Engine    │   │    Logistics    │
     │                 │   │                 │   │                 │
     │ Authentication  │   │ Quality         │   │ Route Planning  │
     │ Users           │   │ Price Forecast  │   │ GPS Tracking    │
     │ Produce         │   │ Demand Forecast │   │ ETA             │
     │ Orders          │   │ Matching        │   │ Deviation       │
     │ Business Logic  │   │ Aggregation     │   │ Socket.IO       │
     └────────┬────────┘   └─────────────────┘   └────────┬────────┘
              │                                            │
              ▼                                            ▼
     ┌─────────────────┐                           ┌────────────────┐
     │   PostgreSQL    │                           │     Redis      │
     │ Persistent Data │                           │ Cache / State  │
     └─────────────────┘                           └────────────────┘
```

---

# 8. Service Architecture

## 8.1 Spring Boot — Core Business Service

Directory:

```text
FarmFresh_Backend/
```

Spring Boot acts as the **main business backend**.

Responsibilities include:

- Authentication
- JWT processing
- User management
- Farmer management
- Buyer management
- Produce management
- Orders
- Database persistence
- Business rules
- Core application state

Spring Boot communicates with PostgreSQL using:

```text
Spring Boot
    ↓
JPA / Hibernate
    ↓
JDBC
    ↓
PostgreSQL
```

---

# 8.2 FastAPI — AI Intelligence Service

Directory:

```text
agriflow-farm-intelligence-api/
```

The FastAPI service isolates AI functionality from the main business backend.

Responsibilities:

```text
Image
  ↓
Quality Analysis

Time Series
  ↓
Price Forecast

Time Series
  ↓
Demand Forecast

Produce + Buyer Data
  ↓
Matching

Multiple Lots
  ↓
Aggregation
```

This separation provides an important architectural advantage:

> AI models can be changed without rewriting the main business backend.

---

# 8.3 Node.js — Logistics Service

Directory:

```text
logistics-service/
```

The Node.js service is responsible for logistics execution.

Responsibilities:

- Route planning
- Vehicle tracking
- GPS updates
- Distance calculation
- ETA calculation
- Route deviation detection
- Route recalculation
- Shipment state
- Socket.IO communication

The logistics service is separated because logistics has different requirements from normal CRUD/business operations.

---

# 9. Data Flow

A typical produce transaction flows through the system like this:

```text
                    FARMER
                      │
                      ▼
              Create Produce Lot
                      │
                      ▼
              Spring Boot API
                      │
              ┌───────┴────────┐
              │                │
              ▼                ▼
         PostgreSQL       FastAPI AI
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
             Quality        Price         Demand
             Analysis     Forecast        Forecast
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                       Buyer Matching
                              │
                              ▼
                       Supply Aggregation
                              │
                              ▼
                         Order Created
                              │
                              ▼
                      Logistics Service
                              │
                              ▼
                     Route Generation
                              │
                              ▼
                        Vehicle Starts
                              │
                              ▼
                         GPS Updates
                              │
                              ▼
                      Socket.IO Events
                              │
                              ▼
                        Live Frontend
```

---

# 10. End-to-End Workflow

## Step 1 — Farmer creates a produce listing

The farmer provides:

```text
Crop
Quantity
Harvest information
Location
Produce images
```

The request is sent to the Spring Boot backend.

---

## Step 2 — Produce is stored

Spring Boot validates the request and stores the produce information in PostgreSQL.

```text
Frontend
   ↓
Spring Boot
   ↓
Validation
   ↓
JPA/Hibernate
   ↓
PostgreSQL
```

---

## Step 3 — AI quality analysis

The produce image is sent to the FastAPI intelligence service.

```text
Image
 ↓
FastAPI
 ↓
Hosted Vision Model
 ↓
Quality Analysis
 ↓
Pydantic Validation
 ↓
JSON Response
```

Example:

```json
{
  "grade": "A",
  "score": 87,
  "quality": "Good"
}
```

---

## Step 4 — Market intelligence

Price and demand prediction services process time-series inputs.

```text
Input observations
        ↓
Chronos model
        ↓
Future predictions
```

The resulting information can be displayed to the farmer.

---

## Step 5 — Buyer matching

The system compares available produce with buyer requirements.

Possible factors include:

```text
Crop compatibility
Quantity
Quality
Price
Distance
Buyer requirement
```

The matching service produces compatible buyer candidates.

---

## Step 6 — Supply aggregation

If a buyer needs more produce than a single farmer can provide:

```text
Farmer A → 500 kg
Farmer B → 300 kg
Farmer C → 200 kg
             ↓
         Aggregation
             ↓
         1000 kg batch
```

---

## Step 7 — Order creation

The final order is maintained by the Spring Boot service.

```text
Buyer
 ↓
Order
 ↓
Spring Boot
 ↓
PostgreSQL
```

---

## Step 8 — Logistics planning

Once an order requires delivery, the logistics service calculates a route.

```text
Farm
 ↓
Collection Point
 ↓
Buyer
```

---

## Step 9 — Live tracking

During transportation:

```text
Vehicle GPS
     ↓
Node.js
     ↓
Location Processing
     ↓
Socket.IO
     ↓
Frontend Map
```

The frontend can update without refreshing the page.

---

## Step 10 — Route deviation

The logistics service continuously compares the vehicle's current location with the planned route.

Conceptually:

```text
Current GPS Position
        ↓
Distance from planned route
        ↓
Threshold exceeded?
     /        \
   No          Yes
   ↓            ↓
Continue     Recalculate
route        route
```

---

# 11. AI/ML Architecture

AgriFlow uses specialized models rather than forcing one model to perform every task.

## 11.1 Produce Quality Analysis

The project uses a hosted vision-language model for image-based produce analysis.

Architecture:

```text
Farmer Image
     ↓
Frontend
     ↓
FastAPI
     ↓
Hosted VLM
     ↓
Structured Quality Result
     ↓
Spring Boot / Frontend
```

The advantage of a hosted model is that the application does not need to deploy a large vision model locally.

---

## 11.2 Price Forecasting

AgriFlow uses:

```text
amazon/chronos-bolt-base
```

for time-series forecasting.

Conceptually:

```text
Price observations
       ↓
Chronos
       ↓
Forecast horizon
       ↓
Future price estimates
```

Important:

> A forecasting model does not magically retrieve historical prices from PostgreSQL unless the application actually supplies that data.

The forecasting endpoint requires a time-series input or another configured data source. Therefore, the README should not claim that AgriFlow automatically possesses a large historical market-price database unless such a database is actually implemented.

---

## 11.3 Demand Forecasting

The same class of time-series forecasting approach can be used for demand.

```text
Demand observations
        ↓
Time-series model
        ↓
Future demand
```

The forecast horizon can be configured according to the request.

---

## 11.4 Buyer Matching

Buyer matching is primarily algorithmic rather than requiring a large language model.

Example conceptual scoring:

```text
Compatibility Score =
    Quality Compatibility
  + Quantity Compatibility
  + Price Compatibility
  + Distance Compatibility
```

The exact weights should be treated as implementation details of the matching service.

---

# 12. Redis & Caching Architecture

Redis can be used as a **fast in-memory data layer**, but it should not replace PostgreSQL.

### PostgreSQL

Use PostgreSQL for:

```text
Users
Farmers
Buyers
Produce
Orders
Persistent business state
```

### Redis

Use Redis for data that changes frequently or is expensive to calculate repeatedly.

Examples:

```text
Vehicle latest location
Current shipment status
Live ETA
Temporary route data
API response cache
Session-related temporary state
Rate limiting
Pub/Sub events
```

Architecture:

```text
              ┌──────────────┐
              │ Spring Boot  │
              └──────┬───────┘
                     │
             Persistent Data
                     │
                     ▼
              ┌──────────────┐
              │ PostgreSQL   │
              └──────────────┘


              ┌──────────────┐
              │   Node.js    │
              └──────┬───────┘
                     │
              Fast-changing data
                     │
                     ▼
                ┌─────────┐
                │  Redis  │
                └─────────┘
```

The key principle is:

> **PostgreSQL is the source of truth; Redis is an acceleration/state layer.**

---

# 13. Authentication & Security

AgriFlow uses JWT-based authentication.

Typical authentication flow:

```text
User
 ↓
Login
 ↓
Spring Boot
 ↓
Validate credentials
 ↓
Generate JWT
 ↓
Frontend stores token
 ↓
Authenticated API requests
 ↓
JWT validation
 ↓
Authorized resource
```

Security responsibilities include:

- Password hashing
- JWT authentication
- Role-based authorization
- Request validation
- CORS configuration
- Environment-based secrets
- Ownership checks
- HTTPS in production

### Never commit secrets

Do not commit:

```text
.env
API keys
JWT secrets
Database passwords
Hugging Face tokens
```

Use environment variables instead.

---

# 14. Project Structure

The repository is organized into four major application components. The current GitHub repository contains `FarmFresh_Backend`, `agriflow-farm-intelligence-api`, `frontend`, and `logistics-service`, along with startup scripts.

```text
AgriFlow/
│
├── .github/
│   └── workflows/
│       └── ...
│
├── .vscode/
│   └── ...
│
├── FarmFresh_Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── ...
│   │   │   └── resources/
│   │   │       └── ...
│   │   └── test/
│   │       └── ...
│   │
│   ├── pom.xml
│   └── mvnw
│
├── agriflow-farm-intelligence-api/
│   ├── app/
│   │   ├── ...
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.*
│
├── logistics-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── socket/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
├── start-all.sh
├── start-all.bat
└── README.md
```

---

# 15. Directory Responsibilities

## `frontend/`

Contains the React/Vite application.

Typical responsibilities:

```text
UI
Routing
Forms
Dashboards
Farmer interface
Buyer interface
Maps
API calls
WebSocket handling
```

---

## `FarmFresh_Backend/`

Contains the Spring Boot application.

Responsibilities:

```text
Authentication
Users
Roles
Farmers
Buyers
Produce
Orders
Business rules
Database persistence
```

---

## `agriflow-farm-intelligence-api/`

Contains the Python FastAPI AI service.

Responsibilities:

```text
Quality analysis
Price prediction
Demand prediction
Buyer matching
Supply aggregation
AI model integration
Pydantic validation
```

---

## `logistics-service/`

Contains the Node.js logistics application.

Responsibilities:

```text
Routes
GPS
Vehicle tracking
ETA
Deviation detection
Route recalculation
Socket.IO
Real-time shipment state
```

---

# 16. Prerequisites

Install the following before running AgriFlow.

### Required

```text
Git
Node.js
npm
Java
Maven
Python
pip
PostgreSQL
```

### Recommended versions

Check the individual `package.json`, `pom.xml`, and Python requirements files in the repository before choosing exact versions.

Verify installations:

```bash
git --version
node --version
npm --version
java --version
mvn --version
python3 --version
pip3 --version
psql --version
```

---

# 17. Clone the Repository

```bash
git clone https://github.com/CreativeArun/AgriFlow.git
cd AgriFlow
```

---

# 18. Local Development Setup

AgriFlow contains multiple independently runnable services.

You can run them separately during development.

---

## 18.1 PostgreSQL

Create the database:

```sql
CREATE DATABASE agriflow;
```

Then configure the database credentials in the Spring Boot configuration.

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agriflow
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

Do not commit your actual password.

---

# 18.2 Spring Boot Backend

Move into the backend:

```bash
cd FarmFresh_Backend
```

Run with Maven Wrapper:

### Linux/macOS

```bash
./mvnw spring-boot:run
```

### Windows

```powershell
mvnw.cmd spring-boot:run
```

The backend normally runs on:

```text
http://localhost:8080
```

---

# 18.3 FastAPI AI Service

Move into:

```bash
cd agriflow-farm-intelligence-api
```

Create a virtual environment:

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the service:

```bash
uvicorn app.main:app --reload
```

FastAPI:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

# 18.4 Node.js Logistics Service

Move into:

```bash
cd logistics-service
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

The logistics service runs on the configured Node.js port.

---

# 18.5 Frontend

Move into:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# 19. Environment Variables

Environment variables should be configured independently for each service.

---

## Frontend

Example:

```env
VITE_API_URL=http://localhost:8080
VITE_AI_API_URL=http://localhost:8000
VITE_LOGISTICS_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Use the actual variable names implemented in the frontend code.

---

## Spring Boot

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agriflow
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD

jwt.secret=YOUR_SECRET

fastapi.base.url=http://localhost:8000
node.logistics.url=http://localhost:5000
```

---

## FastAPI

Example:

```env
HF_TOKEN=YOUR_HUGGING_FACE_TOKEN
SPRING_BOOT_URL=http://localhost:8080
```

Only include variables that are actually required by the implementation.

---

## Node.js

Example:

```env
PORT=5000
SPRING_BOOT_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:5173
```

Again, use the exact environment variable names expected by the source code.

---

# 20. Running the Complete System

There are two ways to run AgriFlow.

## Option A — Run services independently

Open four terminals.

### Terminal 1 — Spring Boot

```bash
cd FarmFresh_Backend
./mvnw spring-boot:run
```

### Terminal 2 — FastAPI

```bash
cd agriflow-farm-intelligence-api
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Terminal 3 — Logistics

```bash
cd logistics-service
npm run dev
```

### Terminal 4 — Frontend

```bash
cd frontend
npm run dev
```

---

## Option B — Startup Scripts

The repository also contains:

```text
start-all.sh
start-all.bat
```

These scripts are intended to simplify starting the multiple services.

### Linux/macOS

```bash
chmod +x start-all.sh
./start-all.sh
```

### Windows

```cmd
start-all.bat
```

If a startup script fails, run the services individually so that the terminal output clearly identifies which service caused the problem.

---

# 21. API Architecture

AgriFlow uses REST APIs for communication between the frontend and backend services.

---

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

Authentication flow:

```text
Frontend
   ↓
Spring Boot
   ↓
Credential validation
   ↓
JWT
   ↓
Frontend
```

---

## Produce APIs

Conceptually:

```http
POST   /api/lots
GET    /api/lots
GET    /api/lots/{id}
PUT    /api/lots/{id}
DELETE /api/lots/{id}
```

---

## Order APIs

```http
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
```

---

## AI APIs

```http
POST /api/quality/analyze
POST /api/prediction/price
POST /api/prediction/demand
POST /api/matching/lots
POST /api/aggregation/create-batch
```

These endpoints are handled by the AI service or routed through the appropriate application layer depending on the implementation.

---

## Logistics APIs

```http
POST /api/logistics/route
POST /api/logistics/recalculate
POST /api/tracking/location
GET  /api/tracking/{shipmentId}
```

The exact endpoint paths should always be considered subordinate to the actual route definitions in the service source code.

---

# 22. Real-Time Communication

The logistics service uses Socket.IO/WebSocket-style communication for live updates.

Example:

```text
Vehicle
   ↓
GPS Location
   ↓
Node.js
   ↓
Process Location
   ↓
Check Route Deviation
   ↓
Calculate ETA
   ↓
Socket.IO Event
   ↓
Frontend
   ↓
Update Map
```

Example events:

```text
shipment:started
vehicle:location
route:updated
shipment:status
shipment:delivered
route:deviation
```

The key benefit is that the browser does not need to repeatedly reload the page to see shipment updates.

---

# 23. Example User Journey

Consider a farmer selling onions.

## Step 1

Farmer creates:

```text
Crop: Onion
Quantity: 500 kg
Location: Farmer's location
Image: onion.jpg
```

---

## Step 2

Image is sent to AI:

```text
onion.jpg
    ↓
Vision Model
    ↓
Quality Score
    ↓
Grade
```

---

## Step 3

Market intelligence is generated:

```text
Price Forecast
+
Demand Forecast
```

---

## Step 4

Buyer matching identifies compatible buyers.

```text
Farmer's Onion
       ↓
Buyer Requirements
       ↓
Compatibility Calculation
       ↓
Potential Buyers
```

---

## Step 5

Suppose the buyer requires 1000 kg.

```text
Farmer A → 500 kg
Farmer B → 300 kg
Farmer C → 200 kg
```

Aggregation produces:

```text
1000 kg
```

---

## Step 6

An order is created.

```text
Buyer
 ↓
Order
 ↓
Spring Boot
 ↓
PostgreSQL
```

---

## Step 7

Logistics service generates a route.

```text
Farm
 ↓
Collection Centre
 ↓
Buyer
```

---

## Step 8

Vehicle begins transportation.

```text
GPS → Node.js → Socket.IO → Frontend
```

---

## Step 9

If the vehicle deviates from the route:

```text
GPS Position
      ↓
Deviation Check
      ↓
Threshold exceeded
      ↓
Recalculate route
      ↓
Broadcast update
      ↓
Frontend updates map
```

---

# 24. Deployment Architecture

A production deployment can separate each service.

```text
                         INTERNET
                            │
                            ▼
                     ┌─────────────┐
                     │   Frontend  │
                     │   Vercel    │
                     └──────┬──────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        Spring Boot      FastAPI       Node.js
          Backend        AI Service    Logistics
              │             │             │
              ▼             │             ▼
         PostgreSQL         │          Redis
                            │
                            ▼
                     Hosted AI Models
```

The deployed frontend is currently associated with:

```text
https://agri-flow-kappa.vercel.app/
```

The production URLs for the individual backend services should be configured through environment variables rather than hard-coded into the frontend.

---

# 25. Testing

Each service should be tested independently before testing the complete workflow.

## Spring Boot

Run:

```bash
./mvnw test
```

---

## FastAPI

Run:

```bash
pytest
```

If the project contains service-specific test scripts, execute them from the FastAPI service directory.

---

## Node.js

Check the available scripts:

```bash
npm run
```

Then execute the project's configured test command.

---

## API Testing

Useful tools include:

```text
Postman
curl
Swagger / OpenAPI
Browser DevTools
```

FastAPI provides interactive API documentation at:

```text
http://localhost:8000/docs
```

when the development server is running.

---

# 26. Troubleshooting

## PostgreSQL connection failed

Check:

```bash
sudo systemctl status postgresql
```

Then verify:

```text
Database name
Username
Password
Port
Host
```

Default PostgreSQL port:

```text
5432
```

---

## Spring Boot cannot connect to database

Check the datasource configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/agriflow
```

Also verify that PostgreSQL is running.

---

## FastAPI cannot start

Check:

```bash
python3 --version
pip --version
```

Then reinstall dependencies:

```bash
pip install -r requirements.txt
```

---

## `uvicorn: command not found`

Activate the virtual environment:

```bash
source .venv/bin/activate
```

Then:

```bash
pip install uvicorn
```

---

## Node.js dependencies fail

Remove existing dependencies:

```bash
rm -rf node_modules
```

Then:

```bash
npm install
```

---

## Frontend cannot reach backend

Check:

```text
Frontend API URL
Spring Boot port
FastAPI port
Node.js port
CORS configuration
```

Use browser DevTools:

```text
F12
→ Network
→ Failed Request
→ Request URL
→ Response
```

---

## Produce appears in farmer dashboard but not buyer dashboard

Check the complete data path:

```text
Database
   ↓
Spring Boot API
   ↓
Buyer API
   ↓
Frontend service
   ↓
Buyer component
```

The most common causes are:

1. Different API endpoints being used by farmer and buyer pages.
2. Incorrect authenticated user/role filtering.
3. CORS configuration.
4. Frontend environment variable pointing to the wrong backend.
5. Backend returning an empty filtered result.
6. Deployed frontend calling a local backend URL.
7. Database used by local and production environments being different.

---

# 27. Design Decisions

## Why Spring Boot?

Spring Boot is responsible for the core transactional/business layer.

It is well suited for:

```text
Authentication
CRUD
Transactions
Business rules
Database operations
```

---

## Why FastAPI?

AI workloads are implemented in Python.

FastAPI provides:

```text
Python ecosystem
+
Fast REST APIs
+
Pydantic validation
+
Easy model integration
```

This allows the AI system to remain independent from the Java backend.

---

## Why Node.js?

Logistics involves:

```text
Frequent updates
GPS events
WebSockets
Real-time communication
I/O-heavy operations
```

Node.js is therefore separated as the logistics and real-time service.

---

## Why PostgreSQL?

PostgreSQL is the primary persistent relational database.

It is suitable for:

```text
Users
Relationships
Orders
Produce
Transactions
Business state
```

---

## Why Redis?

Redis is useful for:

```text
Fast-changing state
Caching
Temporary data
Real-time logistics state
Pub/Sub
Rate limiting
```

It should complement PostgreSQL rather than replace it.

---

## Why Microservices?

The system has clearly different workloads:

```text
Business Transactions → Java
AI/ML → Python
Real-Time Logistics → Node.js
Frontend → React
```

Separating these workloads makes it easier to:

- Develop independently
- Deploy independently
- Scale independently
- Replace individual technologies
- Isolate failures
- Maintain clearer service boundaries

---

# 28. Failure Scenarios

A production system should consider partial failures.

## AI service unavailable

The core marketplace should not necessarily become completely unavailable.

Possible architecture:

```text
Spring Boot
     ↓
AI Service unavailable
     ↓
Return graceful fallback
     ↓
Core marketplace remains accessible
```

---

## Redis unavailable

Redis should generally be treated as an optimization/state layer.

Persistent business data should remain in PostgreSQL.

---

## Logistics service unavailable

The marketplace can continue operating while live tracking is temporarily unavailable.

This is one advantage of separating logistics from the core business service.

---

## External AI provider unavailable

The AI service should return a controlled error instead of crashing the entire platform.

---

# 29. Scalability

AgriFlow can scale services independently.

For example:

```text
              High AI Traffic
                    ↓
              Scale FastAPI
              × × × × ×


              High Order Traffic
                    ↓
             Scale Spring Boot
                 × × ×


              High GPS Traffic
                    ↓
              Scale Node.js
              × × × × ×
```

This is one of the primary benefits of the service-oriented architecture.

---

# 30. Future Scope

Potential future improvements include:

### AI

- Crop-specific grading models
- More accurate regional forecasting
- Advanced demand modeling
- Dynamic pricing intelligence
- Personalized recommendations

### Logistics

- Multi-vehicle optimization
- Multi-farmer route optimization
- Cold-chain monitoring
- IoT temperature sensors
- Predictive delivery delays

### Farmer Experience

- Offline-first operation
- More regional languages
- Voice interaction
- SMS notifications
- Low-bandwidth optimization

### Marketplace

- Payment gateway integration
- Digital invoices
- Automated procurement
- Buyer reputation system
- Contract-based procurement

### Infrastructure

- Redis-based caching
- Message queues
- API gateway
- Centralized logging
- Distributed tracing
- Container orchestration
- Monitoring and alerting

---

# 31. Contributing

Fork the repository:

```bash
git clone https://github.com/CreativeArun/AgriFlow.git
```

Create a branch:

```bash
git checkout -b feature/your-feature
```

Make your changes:

```bash
git add .
git commit -m "feat: describe your change"
```

Push:

```bash
git push origin feature/your-feature
```

Then create a Pull Request.

---

# 32. Repository

GitHub:

https://github.com/CreativeArun/AgriFlow

Live Application:

https://agri-flow-kappa.vercel.app/

---

# 33. Project Information

```text
Project:       AgriFlow
Category:      AgriTech / AI / Supply Chain
Architecture:  Microservice-oriented
Frontend:      React + Vite
Backend:       Spring Boot
AI:            FastAPI + Hosted AI Models
Logistics:     Node.js + Express
Database:      PostgreSQL
Cache:         Redis
Real-Time:     Socket.IO / WebSockets
```

---

# 34. Acknowledgements

AgriFlow is built as a multi-service agricultural technology platform combining:

```text
Software Engineering
+
Artificial Intelligence
+
Market Intelligence
+
Supply Chain Management
+
Logistics
+
Real-Time Systems
```

The project separates these concerns into independent services while providing a unified user experience.

---

# 🌾 AgriFlow

> **From knowing what to sell, to knowing when, where, and how to deliver it — AgriFlow connects the farm-to-market journey.**

[⬆ Back to Top](#-agriflow)
