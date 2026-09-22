import React from "react";
import { ArrowUpRight, ArrowDownRight, RefreshCw, Activity } from "lucide-react";
import { MarketIndex } from "../types";

interface MarketOverviewProps {
  indices: MarketIndex[];
  onRefresh: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const MarketOverview: React.FC<MarketOverviewProps> = React.memo(({
  indices,
  onRefresh,
  isLoading,
  isDarkMode,
}) => {
  // Helper to render responsive SVG mini sparkline
  const renderSparkline = (points: number[], isUp: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 36;
    const padding = 3;

    const pathD = points
      .map((pt, idx) => {
        const x = (idx / (points.length - 1)) * (width - 2 * padding) + padding;
        const y = height - padding - ((pt - min) / range) * (height - 2 * padding);
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");

    const strokeColor = isUp ? "#10B981" : "#EF4444";
    const gradientId = `spark-${Math.random().toString(36).substring(7)}`;

    return (
      <svg className="w-24 h-9 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="mb-8">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <span>Market Overview</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full glass-pill text-purple-900 dark:text-purple-200 border-purple-300/40">
              Live Indices
            </span>
          </h2>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          id="refresh-markets-button"
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl glass-pill transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95 text-slate-800 dark:text-slate-200"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-purple-600" : ""}`} />
          <span className="hidden sm:inline">Refresh Markets</span>
        </button>
      </div>

      {/* Grid of 6 market index cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        {indices.map((idx) => {
          const isUp = idx.direction === "up" || idx.change >= 0;
          return (
            <div
              key={idx.symbol}
              id={`market-card-${idx.symbol.replace(/\s+/g, "-").toLowerCase()}`}
              className="glass-card p-3 sm:p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Row: Symbol & Up/Down Badge */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-extrabold text-sm tracking-tight block text-slate-900 dark:text-white">
                    {idx.symbol}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-1 font-semibold">
                    {idx.name.split("(")[0]}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-0.5 text-[11px] font-extrabold px-2 py-0.5 rounded-lg border glass-pill ${
                    isUp
                      ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/40"
                      : "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400/40"
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[3]" />
                  )}
                  <span>
                    {isUp ? "+" : "-"}{Math.abs(idx.changePercent).toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Middle: Current Value */}
              <div className="my-2">
                <div className="text-base sm:text-lg font-black tracking-tight font-mono text-slate-900 dark:text-white">
                  {idx.currency === "INR" || idx.currency.includes("INR")
                    ? "₹"
                    : idx.currency === "USD"
                    ? "$"
                    : ""}
                  {idx.value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {isUp ? "+" : ""}
                  {idx.change.toFixed(2)} pts
                </div>
              </div>

              {/* Bottom: Sparkline & Last Updated */}
              <div className="flex items-center justify-between pt-2 border-t-2 border-purple-400/60 dark:border-purple-400/50">
                <span className="text-[9px] text-slate-600 dark:text-slate-300 font-bold">
                  {idx.lastUpdated}
                </span>
                <div className="shrink-0">
                  {renderSparkline(idx.sparkline, isUp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
