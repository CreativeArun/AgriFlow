from fastapi import APIRouter

from app.schemas.matching import (
    MatchingRequest,
    MatchingResponse,
)
from app.services.matching_service import find_matches


router = APIRouter(
    prefix="/api/matching",
    tags=["Matching"],
)


@router.post(
    "/find",
    response_model=MatchingResponse,
)
def match_buyers(
    request: MatchingRequest,
):
    """
    Find and rank buyers for available agricultural produce.
    """
    return find_matches(request)
