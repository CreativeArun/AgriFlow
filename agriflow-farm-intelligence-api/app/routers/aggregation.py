from fastapi import APIRouter

from app.schemas.aggregation import (
    AggregationRequest,
    AggregationResponse,
)
from app.services.aggregation_service import aggregate_insights


router = APIRouter(
    prefix="/api/aggregation",
    tags=["Aggregation"],
)


@router.post(
    "/analyze",
    response_model=AggregationResponse,
)
def aggregate_agricultural_insights(
    request: AggregationRequest,
):
    """
    Combine agricultural intelligence scores into an overall opportunity assessment.
    """
    return aggregate_insights(request)
