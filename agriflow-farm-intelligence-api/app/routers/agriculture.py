from fastapi import APIRouter

from app.schemas.agriculture import (
    AgricultureAnalysisRequest,
    AgricultureAnalysisResponse,
    AgricultureChatRequest,
    AgricultureChatResponse,
)
from app.services.agriculture_service import analyze_agriculture
from app.services.language_service import generate_agricultural_advice


router = APIRouter(
    prefix="/api/agriculture",
    tags=["Agriculture Intelligence"],
)


@router.post(
    "/analyze",
    response_model=AgricultureAnalysisResponse,
)
def analyze_agricultural_opportunity(
    request: AgricultureAnalysisRequest,
):
    """
    Execute the complete AgriFlow agricultural intelligence workflow.
    """
    return analyze_agriculture(request)


@router.post(
    "/chat",
    response_model=AgricultureChatResponse,
)
def chat_agricultural_assistant(
    request: AgricultureChatRequest,
):
    """
    Multilingual AI Agricultural Advisory & Assistant endpoint.
    Responds to voice or text questions from Farmers & Buyers in 8 Indian languages.
    """
    result = generate_agricultural_advice(
        query=request.query,
        role=request.role,
        lang=request.language,
    )
    return AgricultureChatResponse(**result)
