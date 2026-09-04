from pydantic import BaseModel, Field


class MatchingRequest(BaseModel):
    produce_type: str = Field(
        ...,
        min_length=1,
        description="Type of agricultural produce.",
    )
    quantity: float = Field(
        ...,
        gt=0,
        description="Available quantity of produce.",
    )
    quality_grade: str = Field(
        ...,
        pattern="^[ABC]$",
        description="Produce quality grade.",
    )
    location: str = Field(
        ...,
        min_length=1,
        description="Farmer or produce location.",
    )


class Buyer(BaseModel):
    buyer_id: str
    produce_type: str
    required_quantity: float = Field(..., gt=0)
    minimum_quality_grade: str = Field(..., pattern="^[ABC]$")
    location: str


class MatchResult(BaseModel):
    buyer_id: str
    match_score: float = Field(..., ge=0, le=100)
    reason: str


class MatchingResponse(BaseModel):
    matches: list[MatchResult]
