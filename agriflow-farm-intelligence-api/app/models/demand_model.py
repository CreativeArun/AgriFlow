from app.models.price_model import forecast_prices


def forecast_demand(
    target: list[float],
    prediction_length: int,
    frequency: str = "D",
) -> dict:
    """
    Forecast future agricultural demand using the hosted
    Chronos-Bolt model.

    No model is trained or loaded locally.
    """

    return forecast_prices(
        target=target,
        prediction_length=prediction_length,
        frequency=frequency,
    )
