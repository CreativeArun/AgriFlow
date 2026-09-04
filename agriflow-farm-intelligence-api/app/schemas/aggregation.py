from pydantic import BaseModel, Field


class AggregationRequest(BaseModel):
    quality_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Overall produce quality score.",
    )
    price_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Normalized price opportunity score.",
    )
    demand_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Normalized demand opportunity score.",
    )
    best_match_score: float = Field(
        ...,
        ge=0,
        le=100,
        description="Highest buyer matching score.",
    )


class AggregationResponse(BaseModel):
    quality_score: float
    price_score: float
    demand_score: float
    best_match_score: float
    overall_score: float = Field(
        ...,
        ge=0,
        le=100,
    )
    recommendation: str
