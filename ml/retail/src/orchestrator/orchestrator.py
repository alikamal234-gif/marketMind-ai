from dataclasses import dataclass, asdict
from typing import Any


@dataclass
class OrchestratorContext:
    product_id: str
    product_name: str

    price_prediction: dict[str, Any]

    demand_signal: dict[str, Any]
    inventory_signal: dict[str, Any]
    profitability_signal: dict[str, Any]
    anomaly_signal: dict[str, Any]

    data_quality: dict[str, Any]


def build_context(
    product_id: str,
    product_name: str,
    price_prediction: dict[str, Any],
    demand_signal: dict[str, Any],
    inventory_signal: dict[str, Any],
    profitability_signal: dict[str, Any],
    anomaly_signal: dict[str, Any],
) -> OrchestratorContext:

    signals = {
        "demand": demand_signal,
        "inventory": inventory_signal,
        "profitability": profitability_signal,
        "anomaly": anomaly_signal,
    }

    missing_signals = [
        name
        for name, signal in signals.items()
        if not signal
    ]

    data_quality = {
        "missing_signals": missing_signals,
        "complete": len(missing_signals) == 0,
    }

    return OrchestratorContext(
        product_id=product_id,
        product_name=product_name,
        price_prediction=price_prediction,
        demand_signal=demand_signal,
        inventory_signal=inventory_signal,
        profitability_signal=profitability_signal,
        anomaly_signal=anomaly_signal,
        data_quality=data_quality,
    )


def context_to_dict(context: OrchestratorContext) -> dict:
    return asdict(context)
