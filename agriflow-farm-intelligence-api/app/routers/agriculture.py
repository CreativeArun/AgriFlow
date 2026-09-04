from fastapi import APIRouter

from app.schemas.agriculture import (
    AgricultureAnalysisRequest,
    AgricultureAnalysisResponse,
)
from app.services.agriculture_service import analyze_agriculture


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
