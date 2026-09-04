from app.schemas.aggregation import (
    AggregationRequest,
    AggregationResponse,
)


def aggregate_insights(
    request: AggregationRequest,
) -> AggregationResponse:
    """
    Combine quality, price, demand, and buyer matching
    scores into an overall agricultural opportunity score.
    """

    overall_score = (
        request.quality_score * 0.30
        + request.price_score * 0.20
        + request.demand_score * 0.25
        + request.best_match_score * 0.25
    )

    overall_score = round(overall_score, 2)

    if overall_score >= 80:
        recommendation = "Strong opportunity"
    elif overall_score >= 60:
        recommendation = "Moderate opportunity"
    else:
        recommendation = "Low opportunity"

    return AggregationResponse(
        quality_score=request.quality_score,
        price_score=request.price_score,
        demand_score=request.demand_score,
        best_match_score=request.best_match_score,
        overall_score=overall_score,
        recommendation=recommendation,
    )
