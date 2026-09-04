import json
import re

from fastapi import HTTPException

from app.models.quality_model import analyze_image
from app.schemas.quality import QualityResponse


def _parse_model_json(raw_result: str) -> dict:
    """
    Extract a JSON object from the hosted VLM response.

    Handles:
    - Plain JSON
    - JSON wrapped in ```json ... ```
    - JSON wrapped in ``` ... ```
    """

    text = raw_result.strip()

    # Remove Markdown code fences if present.
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)

    # Find the JSON object if the model added surrounding text.
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end < start:
        raise HTTPException(
            status_code=502,
            detail="Hosted quality model returned invalid JSON",
        )

    json_text = text[start:end + 1]

    try:
        result = json.loads(json_text)
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=502,
            detail="Hosted quality model returned invalid JSON",
        ) from exc

    if not isinstance(result, dict):
        raise HTTPException(
            status_code=502,
            detail="Hosted quality model returned JSON that is not an object",
        )

    return result


def analyze_quality(
    image_data_url: str,
    crop_hint: str = "",
    filename: str = "",
) -> QualityResponse:
    """
    Analyze agricultural produce using the hosted VLM or local computer vision.

    No model is trained or loaded locally.
    """

    try:
        raw_result = analyze_image(image_data_url, crop_hint=crop_hint, filename=filename)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Hosted quality model request failed: {exc}",
        ) from exc

    result = _parse_model_json(raw_result)

    try:
        quality = QualityResponse(**result)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Hosted quality model returned invalid quality data: {exc}",
        ) from exc

    percentage_total = (
        quality.good_percentage
        + quality.damaged_percentage
        + quality.rotten_percentage
    )

    if percentage_total > 0 and abs(percentage_total - 100) > 0.1:
        # Normalize to 100%
        factor = 100.0 / percentage_total
        quality.good_percentage = round(quality.good_percentage * factor, 1)
        quality.damaged_percentage = round(quality.damaged_percentage * factor, 1)
        quality.rotten_percentage = round(100.0 - quality.good_percentage - quality.damaged_percentage, 1)

    if not quality.produce_name:
        quality.produce_name = result.get("produce_name", "Produce")

    if quality.quality_score is None:
        quality.quality_score = quality.score

    if quality.defects is None:
        quality.defects = {
            "good_produce": quality.good_percentage,
            "damaged": quality.damaged_percentage,
            "rotten": quality.rotten_percentage,
        }

    return quality
