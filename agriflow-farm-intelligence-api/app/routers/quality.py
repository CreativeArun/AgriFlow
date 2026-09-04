import base64

from typing import Optional

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.quality import QualityResponse
from app.services.quality_service import analyze_quality


router = APIRouter(
    prefix="/api/quality",
    tags=["Quality Assessment"],
)


@router.post("/analyze", response_model=QualityResponse)
async def analyze_produce_quality(
    image: Optional[UploadFile] = File(None),
):
    """
    Analyze agricultural produce from an uploaded image.
    """
    if image is None:
        return analyze_quality("")

    image_bytes = await image.read()

    if not image_bytes or not image.content_type or not image.content_type.startswith("image/"):
        return analyze_quality("")

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    image_data_url = (
        f"data:{image.content_type};base64,{encoded_image}"
    )

    return analyze_quality(image_data_url)

