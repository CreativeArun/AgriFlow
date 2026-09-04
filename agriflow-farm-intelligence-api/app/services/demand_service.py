from fastapi import HTTPException

from app.models.demand_model import forecast_demand
from app.models.price_model import MODEL_ID
from app.schemas.prediction import (
    ForecastPoint,
    ForecastRequest,
    ForecastResponse,
)


def predict_demand(
    request: ForecastRequest,
) -> ForecastResponse:
    """
    Generate a demand forecast using the hosted Chronos-Bolt model.
    """

    try:
        result = forecast_demand(
            target=request.historical_values,
            prediction_length=request.prediction_length,
            frequency=request.frequency,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Hosted demand forecasting request failed: {exc}",
        ) from exc

    try:
        output = result["outputs"][0]

        mean_values = output["mean"]
        quantiles = output["quantile_predictions"]

        quantile_map = {
            item["level"]: item["values"]
            for item in quantiles
        }

        p10_values = quantile_map[0.1]
        p50_values = quantile_map[0.5]
        p90_values = quantile_map[0.9]

        forecasts = []

        for index in range(request.prediction_length):
            forecasts.append(
                ForecastPoint(
                    forecast=float(mean_values[index][0]),
                    p10=float(p10_values[index][0]),
                    p50=float(p50_values[index][0]),
                    p90=float(p90_values[index][0]),
                )
            )

    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise HTTPException(
            status_code=502,
            detail="Hosted demand model returned an unexpected response",
        ) from exc

    return ForecastResponse(
        model=MODEL_ID,
        prediction_length=request.prediction_length,
        forecasts=forecasts,
    )
