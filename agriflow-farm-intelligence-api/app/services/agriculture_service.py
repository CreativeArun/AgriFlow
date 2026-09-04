from fastapi import HTTPException

from app.schemas.agriculture import (
    AgricultureAnalysisRequest,
    AgricultureAnalysisResponse,
)
from app.schemas.aggregation import AggregationRequest
from app.schemas.matching import MatchingRequest
from app.schemas.prediction import ForecastRequest

from app.services.quality_service import analyze_quality
from app.services.price_service import predict_price
from app.services.demand_service import predict_demand
from app.services.matching_service import find_matches
from app.services.aggregation_service import aggregate_insights


def _normalize_forecast_score(
    historical_values: list[float],
    forecast_values: list[float],
) -> float:
    """
    Convert a forecast into a 0-100 opportunity score.

    50 means the forecast is approximately equal to the
    latest historical value.

    A higher forecast produces a higher score, while a lower
    forecast produces a lower score.

    The forecast horizon is represented by the average
    forecast value.
    """

    latest_value = historical_values[-1]
    average_forecast = sum(forecast_values) / len(forecast_values)

    if latest_value == 0:
        return 50.0

    percentage_change = (
        (average_forecast - latest_value)
        / abs(latest_value)
    ) * 100

    score = 50 + percentage_change

    return round(max(0.0, min(100.0, score)), 2)


def analyze_agriculture(
    request: AgricultureAnalysisRequest,
) -> AgricultureAnalysisResponse:
    """
    Execute the complete AgriFlow agricultural intelligence workflow.
    """

    # 1. Quality assessment
    try:
        quality = analyze_quality(
            request.quality_image_data_url
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Quality assessment failed: {exc}",
        ) from exc

    # 2. Price forecasting
    price_request = ForecastRequest(
        historical_values=request.price_history,
        prediction_length=request.prediction_length,
        frequency=request.frequency,
    )

    price = predict_price(price_request)

    # 3. Demand forecasting
    demand_request = ForecastRequest(
        historical_values=request.demand_history,
        prediction_length=request.prediction_length,
        frequency=request.frequency,
    )

    demand = predict_demand(demand_request)

    # 4. Buyer matching
    matching_request = MatchingRequest(
        produce_type=request.produce_type,
        quantity=request.quantity,
        quality_grade=quality.grade,
        location=request.location,
    )

    matching = find_matches(matching_request)

    # 5. Determine best buyer match
    best_match_score = (
        matching.matches[0].match_score
        if matching.matches
        else 0.0
    )

    # 6. Normalize price and demand forecasts
    price_p50_values = [
        forecast.p50
        for forecast in price.forecasts
    ]

    demand_p50_values = [
        forecast.p50
        for forecast in demand.forecasts
    ]

    price_score = _normalize_forecast_score(
        request.price_history,
        price_p50_values,
    )

    demand_score = _normalize_forecast_score(
        request.demand_history,
        demand_p50_values,
    )

    # 7. Aggregate all intelligence
    aggregation_request = AggregationRequest(
        quality_score=quality.score,
        price_score=price_score,
        demand_score=demand_score,
        best_match_score=best_match_score,
    )

    aggregation = aggregate_insights(
        aggregation_request
    )

    return AgricultureAnalysisResponse(
        quality=quality,
        price=price,
        demand=demand,
        matching=matching,
        aggregation=aggregation,
    )
