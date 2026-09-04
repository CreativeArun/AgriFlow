from typing import Optional
from pydantic import BaseModel, Field


class QualityResponse(BaseModel):
    produce_name: Optional[str] = "Produce"
    score: float = Field(..., ge=0, le=100)
    grade: str = Field(..., pattern="^[ABC]$")
    good_percentage: float = Field(..., ge=0, le=100)
    damaged_percentage: float = Field(..., ge=0, le=100)
    rotten_percentage: float = Field(..., ge=0, le=100)
    description: str
    quality_score: Optional[float] = None
    defects: Optional[dict] = None


