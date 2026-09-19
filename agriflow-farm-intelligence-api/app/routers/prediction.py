from fastapi import APIRouter
from typing import Optional

from fastapi import APIRouter, Query

from app.schemas.prediction import (
    CropRateResponse,
    ForecastRequest,
    ForecastResponse,
)
from app.services.price_service import predict_price
from app.services.price_service import (
    get_crop_rate_and_forecast,
    predict_price,
)
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


@router.get(
    "/crop-rate",
    response_model=CropRateResponse,
)
def search_crop_rate(
    crop: str = Query(..., description="Name of fruit, crop, or produce to search"),
    days: int = Query(7, ge=1, le=30, description="Forecast horizon in days"),
    language: Optional[str] = Query("en", description="Language code (en, hi, pa, bn, mr, te, ta, gu)"),
):
    """
    Search actual Mandi benchmark rates for any fruit or crop,
    and generate Chronos-Bolt price projection with multilingual recommendations.
    """
    return get_crop_rate_and_forecast(crop, prediction_length=days, language=language or "en")
