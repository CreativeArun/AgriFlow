from app.schemas.matching import (
    Buyer,
    MatchResult,
    MatchingRequest,
    MatchingResponse,
)


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

    if request.produce_type.lower() == buyer.produce_type.lower():
        score += 40
        reasons.append("produce type matches")
    else:
        reasons.append("produce type does not match")

    if QUALITY_RANK[request.quality_grade] >= QUALITY_RANK[buyer.minimum_quality_grade]:
        score += 25
        reasons.append("quality requirement is satisfied")
    else:
        reasons.append("quality requirement is not satisfied")

    if request.location.lower() == buyer.location.lower():
        score += 20
        reasons.append("location matches")
    else:
        reasons.append("location differs")

    if request.quantity >= buyer.required_quantity:
        score += 15
        reasons.append("required quantity is available")
    else:
        quantity_ratio = request.quantity / buyer.required_quantity
        score += 15 * quantity_ratio
        reasons.append("available quantity is below requirement")

    return MatchResult(
        buyer_id=buyer.buyer_id,
        match_score=round(score, 2),
        reason="; ".join(reasons),
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
