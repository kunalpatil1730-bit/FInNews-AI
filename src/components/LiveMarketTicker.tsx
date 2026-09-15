import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Zap } from "lucide-react";
import { MarketIndex } from "../types";

interface LiveMarketTickerProps {
  indices: MarketIndex[];
  isDarkMode: boolean;
}

export const LiveMarketTicker: React.FC<LiveMarketTickerProps> = React.memo(({
  indices,
  isDarkMode,
}) => {
  const [tickerItems, setTickerItems] = useState<MarketIndex[]>(indices);

  // Synchronize when indices update
  useEffect(() => {
    if (indices && indices.length > 0) {
      setTickerItems(indices);
    }
  }, [indices]);

  // Dynamic subtle price flipper simulation for real-time live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerItems((prev) =>
        prev.map((item) => {
          // Random 20% chance to micro-adjust price for live ticker dynamism
          if (Math.random() > 0.7) {
            const delta = (Math.random() - 0.48) * (item.value * 0.0008);
            const newValue = Math.max(1, item.value + delta);
            const newChange = item.change + delta;
            const newPercent = (newChange / (item.value - item.change)) * 100;
            return {
              ...item,
              value: newValue,
              change: newChange,
              changePercent: newPercent,
              direction: delta >= 0 ? "up" : "down",
            };
          }
          return item;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (!tickerItems || tickerItems.length === 0) return null;

  // Duplicate items for continuous smooth infinite scrolling loop
  const displayItems = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div className="w-full overflow-hidden glass-panel border-y border-slate-300/40 dark:border-white/10 py-2 relative z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left Live Indicator Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white dark:bg-purple-900/80 dark:text-purple-100 rounded-full border border-purple-400/40 text-[11px] font-black tracking-wider shrink-0 mr-3 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Zap className="w-3 h-3 text-pink-300" />
          <span>LIVE MARKETS</span>
        </div>

        {/* Marquee Infinite Scrolling Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
            {displayItems.map((item, idx) => {
              const isUp = item.direction === "up" || item.change >= 0;
              return (
                <div
                  key={`${item.symbol}-${idx}`}
                  className="inline-flex items-center gap-2 text-xs font-black cursor-pointer group"
                >
                  <span className="text-slate-950 dark:text-white font-black tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {item.symbol}
                  </span>
                  <span className="font-mono text-slate-900 dark:text-slate-100 font-extrabold">
                    {item.currency === "INR" || item.currency.includes("INR") ? "₹" : "$"}
                    {item.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isUp
                        ? "bg-emerald-600 text-white dark:bg-emerald-500/30 dark:text-emerald-300"
                        : "bg-rose-600 text-white dark:bg-rose-500/30 dark:text-rose-300"
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[3]" />
                    )}
                    {isUp ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
