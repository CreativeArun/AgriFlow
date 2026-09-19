from pydantic import BaseModel, Field, field_validator

from app.schemas.prediction import ForecastResponse
from app.schemas.quality import QualityResponse
from app.schemas.matching import MatchingResponse
from app.schemas.aggregation import AggregationResponse


class AgricultureAnalysisRequest(BaseModel):
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
    location: str = Field(
        ...,
        min_length=1,
        description="Farmer or produce location.",
    )
    quality_image_data_url: str = Field(
        ...,
        min_length=1,
        description="Base64 data URL containing the produce image.",
    )
    price_history: list[float] = Field(
        ...,
        min_length=2,
        description="Historical agricultural prices in chronological order.",
    )
    demand_history: list[float] = Field(
        ...,
        min_length=2,
        description="Historical agricultural demand values in chronological order.",
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
    language: str = Field(
        default="en",
        description="Language code for natural-language analysis.",
    )
    @field_validator("quality_image_data_url")
    @classmethod
    def validate_image_data_url(cls, value: str) -> str:
        if not value.startswith("data:image/"):
            raise ValueError(
                "quality_image_data_url must be a valid image data URL"
            )

        if ";base64," not in value:
            raise ValueError(
                "quality_image_data_url must contain base64-encoded image data"
            )

        encoded_data = value.split(";base64,", 1)[1]

        if not encoded_data:
            raise ValueError(
                "quality_image_data_url contains no image data"
            )

        return value


class AgricultureAnalysisResponse(BaseModel):
    quality: QualityResponse
    price: ForecastResponse
    demand: ForecastResponse
    matching: MatchingResponse
    aggregation: AggregationResponse


class AgricultureChatRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Farmer or buyer query/question.")
    language: str = Field(default="en", description="Language code (en, hi, pa, bn, mr, te, ta, gu)")
    role: str = Field(default="farmer", description="User role: farmer or buyer")


class AgricultureChatResponse(BaseModel):
    query: str
    language: str
    language_name: str
    role: str
    response: str
    status: str = "success"
