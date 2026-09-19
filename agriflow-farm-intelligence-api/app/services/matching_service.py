from app.schemas.matching import (
    Buyer,
    MatchResult,
    MatchingRequest,
    MatchingResponse,
)
from app.services.language_service import format_match_reason


BUYERS = [
    Buyer(
        buyer_id="B001",
        produce_type="Tomato",
        required_quantity=400,
        minimum_quality_grade="A",
        location="Nashik",
    ),
    Buyer(
        buyer_id="B002",
        produce_type="Tomato",
        required_quantity=800,
        minimum_quality_grade="B",
        location="Pune",
    ),
    Buyer(
        buyer_id="B003",
        produce_type="Onion",
        required_quantity=500,
        minimum_quality_grade="A",
        location="Nashik",
    ),
    Buyer(
        buyer_id="B004",
        produce_type="Potato",
        required_quantity=1000,
        minimum_quality_grade="B",
        location="Mumbai",
    ),
]


QUALITY_RANK = {
    "A": 3,
    "B": 2,
    "C": 1,
}


def calculate_match(
    request: MatchingRequest,
    buyer: Buyer,
) -> MatchResult:
    score = 0
    reasons = []
    reason_keys = []

    if request.produce_type.lower() == buyer.produce_type.lower():
        score += 40
        reasons.append("produce type matches")
        reason_keys.append("produce_matches")
    else:
        reasons.append("produce type does not match")
        reason_keys.append("produce_differs")

    if QUALITY_RANK[request.quality_grade] >= QUALITY_RANK[buyer.minimum_quality_grade]:
        score += 25
        reasons.append("quality requirement is satisfied")
        reason_keys.append("quality_satisfied")
    else:
        reasons.append("quality requirement is not satisfied")
        reason_keys.append("quality_not_satisfied")

    if request.location.lower() == buyer.location.lower():
        score += 20
        reasons.append("location matches")
        reason_keys.append("location_matches")
    else:
        reasons.append("location differs")
        reason_keys.append("location_differs")

    if request.quantity >= buyer.required_quantity:
        score += 15
        reasons.append("required quantity is available")
        reason_keys.append("quantity_available")
    else:
        quantity_ratio = request.quantity / buyer.required_quantity
        score += 15 * quantity_ratio
        reasons.append("available quantity is below requirement")
        reason_keys.append("quantity_below")

    reason_text = format_match_reason(reason_keys, lang=getattr(request, "language", "en"))

    return MatchResult(
        buyer_id=buyer.buyer_id,
        match_score=round(score, 2),
        reason=reason_text,
    )


def find_matches(
    request: MatchingRequest,
) -> MatchingResponse:
    matches = [
        calculate_match(request, buyer)
        for buyer in BUYERS
    ]

    matches.sort(
        key=lambda match: match.match_score,
        reverse=True,
    )

    return MatchingResponse(matches=matches)
