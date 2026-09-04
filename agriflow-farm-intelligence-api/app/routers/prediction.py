from fastapi import APIRouter

from app.schemas.prediction import (
    ForecastRequest,
    ForecastResponse,
)
from app.services.price_service import predict_price
from app.services.demand_service import predict_demand


router = APIRouter(
    prefix="/api/prediction",
    tags=["Prediction"],
)


@router.post(
    "/price",
    response_model=ForecastResponse,
)
def forecast_price(
    request: ForecastRequest,
):
    """
    Forecast future agricultural prices using Chronos-Bolt.
    """
    return predict_price(request)


@router.post(
    "/demand",
    response_model=ForecastResponse,
)
def forecast_demand_endpoint(
    request: ForecastRequest,
):
    """
    Forecast future agricultural demand using Chronos-Bolt.
    """
    return predict_demand(request)
