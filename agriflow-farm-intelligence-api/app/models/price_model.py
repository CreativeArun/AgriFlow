import logging
import math
import os

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

TSFM_API_URL = "https://api.tsfm.ai/v1/forecast"
MODEL_ID = "amazon/chronos-bolt-base"


def _local_statistical_forecast(
    target: list[float],
    prediction_length: int,
    frequency: str = "D",
) -> dict:
    """
    High-fidelity statistical time-series forecasting fallback using linear trend,
    volatility estimation, and quantile intervals (p10, p50, p90).
    """
    n = len(target)
    last_val = float(target[-1]) if n > 0 else 50.0

    if n < 2:
        slope = 0.0
        std_err = max(1.0, last_val * 0.05)
    else:
        x_mean = (n - 1) / 2.0
        y_mean = sum(target) / float(n)
        numerator = sum((i - x_mean) * (target[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        raw_slope = (numerator / denominator) if denominator != 0 else 0.0

        # Gentle trend clamping to maintain realistic price/demand dynamics
        max_slope = max(1.0, last_val * 0.08)
        slope = max(-max_slope, min(max_slope, raw_slope))

        residuals = [
            target[i] - (y_mean + raw_slope * (i - x_mean)) for i in range(n)
        ]
        var = sum(r**2 for r in residuals) / max(1, n - 2) if n > 2 else (last_val * 0.05) ** 2
        std_err = math.sqrt(max(0.2, var))

    means = []
    p10_list = []
    p50_list = []
    p90_list = []

    for h in range(1, prediction_length + 1):
        damping = max(0.4, 1.0 - (0.04 * (h - 1)))
        pred = max(1.0, last_val + slope * h * damping)
        spread = 1.28 * std_err * math.sqrt(h)

        means.append(round(pred, 2))
        p50_list.append(round(pred, 2))
        p10_list.append(round(max(0.0, pred - spread), 2))
        p90_list.append(round(pred + spread, 2))

    return {
        "outputs": [
            {
                "mean": [[v] for v in means],
                "quantile_predictions": [
                    {"level": 0.1, "values": [[v] for v in p10_list]},
                    {"level": 0.5, "values": [[v] for v in p50_list]},
                    {"level": 0.9, "values": [[v] for v in p90_list]},
                ],
            }
        ]
    }


def forecast_prices(
    target: list[float],
    prediction_length: int,
    frequency: str = "D",
) -> dict:
    """
    Call the hosted Chronos-Bolt forecasting model, with automatic
    fallback to statistical forecasting if API key is not configured or unavailable.
    """

    api_key = os.getenv("TSFM_API_KEY")

    if not api_key or api_key == "your_tsfm_api_key_here":
        logger.info("TSFM_API_KEY not configured. Using statistical time-series forecasting.")
        return _local_statistical_forecast(target, prediction_length, frequency)

    payload = {
        "model": MODEL_ID,
        "inputs": [
            {
                "target": [[value] for value in target],
            }
        ],
        "parameters": {
            "prediction_length": prediction_length,
            "frequency": frequency,
            "quantile_levels": [0.1, 0.5, 0.9],
        },
    }

    try:
        response = requests.post(
            TSFM_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=4,
        )
        response.raise_for_status()
        return response.json()
    except Exception as exc:
        logger.warning(
            "Hosted forecasting call failed (%s). Falling back to statistical engine.",
            exc,
        )
        return _local_statistical_forecast(target, prediction_length, frequency)

