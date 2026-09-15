import random
import datetime
from typing import Dict, Any, List

BASE_MARKETS: Dict[str, Dict[str, Any]] = {
    "nifty": {
        "symbol": "NIFTY 50",
        "name": "NSE Nifty 50 Index (India)",
        "value": 24892.40,
        "change": 142.30,
        "changePercent": 0.58,
        "direction": "up",
        "currency": "INR",
        "sparkline": [24720, 24760, 24740, 24810, 24790, 24850, 24892.4],
        "dayRange": {"low": 24710.15, "high": 24925.80},
        "volume": "284.5M",
    },
    "sensex": {
        "symbol": "SENSEX",
        "name": "BSE S&P Sensex (India)",
        "value": 81785.56,
        "change": 421.20,
        "changePercent": 0.52,
        "direction": "up",
        "currency": "INR",
        "sparkline": [81200, 81350, 81290, 81500, 81620, 81710, 81785.56],
        "dayRange": {"low": 81150.0, "high": 81920.4},
        "volume": "18.2M",
    },
    "nasdaq": {
        "symbol": "NASDAQ",
        "name": "Nasdaq Composite (US)",
        "value": 17882.65,
        "change": -112.45,
        "changePercent": -0.62,
        "direction": "down",
        "currency": "USD",
        "sparkline": [18010, 17980, 17920, 17850, 17890, 17840, 17882.65],
        "dayRange": {"low": 17810.2, "high": 18040.5},
        "volume": "4.8B",
    },
    "sp500": {
        "symbol": "S&P 500",
        "name": "Standard & Poor's 500 (US)",
        "value": 5648.40,
        "change": -14.20,
        "changePercent": -0.25,
        "direction": "down",
        "currency": "USD",
        "sparkline": [5670, 5665, 5650, 5635, 5642, 5638, 5648.4],
        "dayRange": {"low": 5630.1, "high": 5682.0},
        "volume": "3.2B",
    },
    "gold": {
        "symbol": "Gold",
        "name": "Gold Spot / 10g (Global & India)",
        "value": 73840.00,
        "change": 380.00,
        "changePercent": 0.52,
        "direction": "up",
        "currency": "INR/10g",
        "sparkline": [73300, 73420, 73380, 73550, 73680, 73750, 73840],
        "dayRange": {"low": 73250, "high": 73920},
        "volume": "12.4K lots",
    },
    "usdinr": {
        "symbol": "USD/INR",
        "name": "US Dollar to Indian Rupee",
        "value": 83.94,
        "change": 0.06,
        "changePercent": 0.07,
        "direction": "up",
        "currency": "INR",
        "sparkline": [83.85, 83.88, 83.91, 83.90, 83.92, 83.93, 83.94],
        "dayRange": {"low": 83.82, "high": 83.98},
    },
}

SECTOR_PERFORMANCE: List[Dict[str, Any]] = [
    {"name": "Nifty IT", "change": 1.45, "direction": "up"},
    {"name": "Banking & Financials", "change": 0.62, "direction": "up"},
    {"name": "Auto & Mobility", "change": -0.34, "direction": "down"},
    {"name": "Pharma & Healthcare", "change": 0.88, "direction": "up"},
    {"name": "Energy & Utilities", "change": -1.15, "direction": "down"},
    {"name": "FMCG Consumer", "change": 0.21, "direction": "up"},
    {"name": "Metals & Mining", "change": -0.48, "direction": "down"},
    {"name": "Real Estate", "change": 0.95, "direction": "up"},
]

class MarketService:
    def get_market_data(self) -> Dict[str, Any]:
        now_str = datetime.datetime.now().strftime("%H:%M")
        updated_indices = []

        for key, data in BASE_MARKETS.items():
            drift = (random.random() - 0.5) * 0.04
            sim_val = round(data["value"] * (1 + drift / 100), 2)
            item = dict(data)
            item["value"] = sim_val
            item["lastUpdated"] = now_str
            updated_indices.append(item)

        return {
            "indices": updated_indices,
            "sectors": SECTOR_PERFORMANCE,
            "asOf": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

market_service = MarketService()
