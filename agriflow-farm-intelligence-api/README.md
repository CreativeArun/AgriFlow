# AgriFlow — Farm Intelligence API

AgriFlow is a FastAPI-based AI/ML backend for agricultural intelligence.

It provides:

- 🌱 Produce Quality Assessment
- 📈 Price Forecasting
- 📊 Demand Forecasting
- 🤝 Buyer Matching
- 🎯 Overall Opportunity Scoring

> **No model training or fine-tuning is performed. AgriFlow uses hosted pretrained models through APIs.**

## Architecture

```text
                    AgriFlow
                       │
                    FastAPI
                       │
          ┌────────────┼────────────┐
          │            │            │
       Quality       Price        Demand
          │            │            │
     Hugging Face   TSFM.ai      TSFM.ai
      Gemma 3 4B   Chronos-Bolt  Chronos-Bolt
          │            │            │
          └────────────┼────────────┘
                       │
                Business Logic
                       │
                Pydantic Validation
                       │
                  JSON Response
```

## Project Structure

```text
app/
├── models/       # Hosted model/API integrations
├── routers/      # FastAPI endpoints
├── schemas/      # Pydantic schemas
└── services/     # Business logic
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/quality/analyze` | Produce quality analysis |
| POST | `/api/prediction/price` | Price forecasting |
| POST | `/api/prediction/demand` | Demand forecasting |
| POST | `/api/matching/find` | Buyer matching |
| POST | `/api/aggregation/analyze` | Opportunity scoring |
| POST | `/api/agriculture/analyze` | Complete agricultural analysis |

## Hosted Models

- **Quality:** Google Gemma 3 4B via Hugging Face
- **Price:** Amazon Chronos-Bolt via TSFM.ai
- **Demand:** Amazon Chronos-Bolt via TSFM.ai

## Setup

```bash
git clone <repository-url>
cd farm-intelligence-api

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
HF_TOKEN=your_huggingface_token
TSFM_API_KEY=your_tsfm_api_key
```

## Run

```bash
uvicorn app.main:app --reload
```

### API Documentation

Open Swagger UI:

```text
http://127.0.0.1:8000/docs
```

### Health Check

```text
http://127.0.0.1:8000/health
```

## Scope

This repository currently focuses on the **FastAPI AI/ML intelligence backend**.

Frontend, Spring Boot integration, deployment, authentication, monitoring, and model training are outside the current scope.