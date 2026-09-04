from pydantic import BaseModel, Field


class ForecastRequest(BaseModel):
    historical_values: list[float] = Field(
        ...,
        min_length=2,
        description="Historical observations in chronological order.",
    )
    prediction_length: int = Field(
        ...,
        ge=1,
        le=30,
        description="Number of future periods to forecast.",
    )
    frequency: str = Field(
        default="D",
        description="Time-series frequency, for example D for daily.",
    )


class ForecastPoint(BaseModel):
    forecast: float
    p10: float
    p50: float
    p90: float


class ForecastResponse(BaseModel):
    model: str
    prediction_length: int
    forecasts: list[ForecastPoint]
