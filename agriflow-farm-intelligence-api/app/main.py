from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.quality import router as quality_router
from app.routers.prediction import router as prediction_router
from app.routers.matching import router as matching_router
from app.routers.aggregation import router as aggregation_router
from app.routers.agriculture import router as agriculture_router


app = FastAPI(
    title="Farm Intelligence API",
    description="AI and ML services for AgriFlow",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(quality_router)
app.include_router(prediction_router)
app.include_router(matching_router)
app.include_router(aggregation_router)
app.include_router(agriculture_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "farm-intelligence-api",
    }
