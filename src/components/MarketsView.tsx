import React, { useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, Globe, DollarSign } from "lucide-react";
import { MarketIndex, SectorPerformance } from "../types";

interface MarketsViewProps {
  indices: MarketIndex[];
  sectors: SectorPerformance[];
  onRefresh: () => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const MarketsView: React.FC<MarketsViewProps> = ({
  indices,
  sectors,
  onRefresh,
  isLoading,
  isDarkMode,
}) => {
  const [activeChartSymbol, setActiveChartSymbol] = useState<string>("NIFTY 50");
  const selectedIndex = indices.find((idx) => idx.symbol === activeChartSymbol) || indices[0];

  // SVG Chart rendering for the selected primary index
  const renderLargeChart = (points: number[], isUp: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 600;
    const height = 200;
    const pad = 12;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * (width - 2 * pad) + pad;
      const y = height - pad - ((val - min) / range) * (height - 2 * pad);
      return { x, y, val };
    });

    const linePath = coords
      .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(" ");

    const areaPath = `${linePath} L ${width - pad} ${height} L ${pad} ${height} Z`;
    const strokeColor = isUp ? "#10B981" : "#EF4444";

    return (
      <svg className="w-full h-48 sm:h-64 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#largeChartGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r="4"
            fill={isDarkMode ? "#0F172A" : "#FFFFFF"}
            stroke={strokeColor}
            strokeWidth="2.5"
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Financial Markets & Sectoral Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time equity indices, commodities, currencies, and sector rotation trends
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
            isDarkMode
              ? "border-slate-800 hover:bg-slate-800 text-slate-300"
              : "border-slate-200 hover:bg-slate-100 text-slate-700 shadow-xs"
          } ${isLoading ? "opacity-50" : ""}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Featured Index Interactive Showcase */}
      {selectedIndex && (
        <div className="glass-modal-content p-6 rounded-3xl transition-all shadow-2xl">
          {/* Index Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-200 dark:border-slate-700">
            {indices.map((idx) => (
              <button
                key={idx.symbol}
                onClick={() => setActiveChartSymbol(idx.symbol)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeChartSymbol === idx.symbol
                    ? "bg-blue-600 text-white shadow-xs"
                    : isDarkMode
                    ? "bg-slate-700/60 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {idx.symbol}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Left Metrics */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Selected Index
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                {selectedIndex.symbol}
              </h2>
              <p className="text-xs text-slate-500 mb-4">{selectedIndex.name}</p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-black font-mono">
                  {selectedIndex.currency === "INR" || selectedIndex.currency.includes("INR") ? "₹" : "$"}
                  {selectedIndex.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-sm font-extrabold px-2.5 py-1 rounded-lg ${
                    selectedIndex.change >= 0
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                >
                  {selectedIndex.change >= 0 ? "+" : ""}
                  {selectedIndex.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <div>
                  <span className="text-slate-400 block text-[11px]">Day's Low:</span>
                  <span className="font-bold font-mono">
                    {selectedIndex.dayRange.low.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Day's High:</span>
                  <span className="font-bold font-mono">
                    {selectedIndex.dayRange.high.toLocaleString()}
                  </span>
                </div>
                {selectedIndex.volume && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Volume:</span>
                    <span className="font-bold font-mono">{selectedIndex.volume}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[11px]">Last Updated:</span>
                  <span className="font-bold font-mono">{selectedIndex.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Right Chart */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Session Trend Graph</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Live Technical Simulation
                </span>
              </div>
              {renderLargeChart(selectedIndex.sparkline, selectedIndex.change >= 0)}
            </div>
          </div>
        </div>
      )}

      {/* Sector Performance Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <span>Sectoral Performance Heatmap</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
            India & Global Markets
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {sectors.map((sec) => {
            const isUp = sec.change >= 0;
            return (
              <div
                key={sec.name}
                className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                  isDarkMode
                    ? "bg-slate-800/90 border-slate-700 text-white"
                    : "bg-white border-slate-200 text-slate-900 shadow-xs"
                }`}
              >
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  {sec.name}
                </span>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-base font-black font-mono ${
                      isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {sec.change.toFixed(2)}%
                  </span>
                  <div
                    className={`p-1.5 rounded-lg ${
                      isUp
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
