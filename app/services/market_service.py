import random
import datetime
import json
import urllib.request
from typing import Dict, Any, List

def fetch_yahoo_symbol(symbol: str) -> Dict[str, Any]:
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            meta = data.get("chart", {}).get("result", [{}])[0].get("meta", {})
            price = meta.get("regularMarketPrice")
            if price is not None:
                prev_close = meta.get("chartPreviousClose", meta.get("previousClose", price))
                change = price - prev_close
                change_pct = (change / prev_close * 100) if prev_close else 0.0
                return {
                    "price": price,
                    "change": change,
                    "changePercent": change_pct,
                    "high": meta.get("regularMarketDayHigh", price * 1.005),
                    "low": meta.get("regularMarketDayLow", price * 0.995)
                }
    except Exception:
        pass
    return {}

BASE_MARKETS_FALLBACK: Dict[str, Dict[str, Any]] = {
    "nifty": {
        "symbol": "NIFTY 50",
        "name": "NSE Nifty 50 Index (India)",
        "value": 25182.40,
        "change": 142.30,
        "changePercent": 0.57,
        "direction": "up",
        "currency": "INR",
        "sparkline": [25010, 25060, 25110, 25150, 25182.40],
        "dayRange": {"low": 24980.15, "high": 25220.80},
        "volume": "284.5M",
    },
    "sensex": {
        "symbol": "SENSEX",
        "name": "BSE S&P Sensex (India)",
        "value": 82450.60,
        "change": 421.20,
        "changePercent": 0.51,
        "direction": "up",
        "currency": "INR",
        "sparkline": [81900, 82100, 82250, 82380, 82450.60],
        "dayRange": {"low": 81850.0, "high": 82600.4},
        "volume": "18.2M",
    },
    "nasdaq": {
        "symbol": "NASDAQ",
        "name": "Nasdaq Composite (US)",
        "value": 18420.15,
        "change": -112.45,
        "changePercent": -0.61,
        "direction": "down",
        "currency": "USD",
        "sparkline": [18550, 18510, 18480, 18420.15],
        "dayRange": {"low": 18380.2, "high": 18600.5},
        "volume": "4.8B",
    },
    "sp500": {
        "symbol": "S&P 500",
        "name": "Standard & Poor's 500 (US)",
        "value": 5680.20,
        "change": -14.20,
        "changePercent": -0.25,
        "direction": "down",
        "currency": "USD",
        "sparkline": [5700, 5690, 5685, 5680.20],
        "dayRange": {"low": 5665.1, "high": 5710.0},
        "volume": "3.2B",
    },
    "gold": {
        "symbol": "Gold",
        "name": "Gold Spot 24K / 10g (India & Global)",
        "value": 86450.00,
        "change": 380.00,
        "changePercent": 0.44,
        "direction": "up",
        "currency": "INR/10g",
        "sparkline": [85900, 86100, 86250, 86450],
        "dayRange": {"low": 85750, "high": 86620},
        "volume": "14.2K lots",
    },
    "usdinr": {
        "symbol": "USD/INR",
        "name": "US Dollar to Indian Rupee",
        "value": 86.42,
        "change": 0.08,
        "changePercent": 0.09,
        "direction": "up",
        "currency": "INR",
        "sparkline": [86.30, 86.35, 86.38, 86.42],
        "dayRange": {"low": 86.25, "high": 86.48},
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

        # Attempt live fetch
        nifty_q = fetch_yahoo_symbol("^NSEI")
        sensex_q = fetch_yahoo_symbol("^BSESN")
        nasdaq_q = fetch_yahoo_symbol("^IXIC")
        sp500_q = fetch_yahoo_symbol("^GSPC")
        gold_q = fetch_yahoo_symbol("GC=F")
        usdinr_q = fetch_yahoo_symbol("INR=X")

        usd_inr = usdinr_q.get("price", 86.42)
        gold_usd = gold_q.get("price", 2912.50)
        gold_24k = round((gold_usd / 31.1034768) * 10 * usd_inr * 1.155) if gold_usd else 86450

        quotes = {
            "nifty": nifty_q,
            "sensex": sensex_q,
            "nasdaq": nasdaq_q,
            "sp500": sp500_q,
            "usdinr": usdinr_q,
        }

        for key, base in BASE_MARKETS_FALLBACK.items():
            q = quotes.get(key, {})
            item = dict(base)
            item["lastUpdated"] = now_str
            if key == "gold" and gold_24k:
                item["value"] = gold_24k
                if gold_q.get("change"):
                    item["change"] = round((gold_q["change"] / 31.1034768) * 10 * usd_inr * 1.155)
                    item["changePercent"] = round(gold_q.get("changePercent", 0.44), 2)
                    item["direction"] = "up" if item["change"] >= 0 else "down"
            elif q.get("price"):
                item["value"] = round(q["price"], 2)
                item["change"] = round(q.get("change", item["change"]), 2)
                item["changePercent"] = round(q.get("changePercent", item["changePercent"]), 2)
                item["direction"] = "up" if item["change"] >= 0 else "down"

            updated_indices.append(item)

        return {
            "indices": updated_indices,
            "sectors": SECTOR_PERFORMANCE,
            "asOf": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

market_service = MarketService()

