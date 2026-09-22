import React, { useState, useEffect } from "react";
import { Search, Sparkles, ArrowRight, BookOpen, ShieldCheck, Zap, Globe2, TrendingUp, Bot } from "lucide-react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onOpenSimplifyModal: () => void;
  onExploreLatest: () => void;
  onOpenAskAi?: () => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({
  onSearch,
  onOpenSimplifyModal,
  onExploreLatest,
  onOpenAskAi,
  isDarkMode,
}) => {
  const [query, setQuery] = useState("");

  // Debounced auto-search effect (350ms delay)
  useEffect(() => {
    if (!query.trim()) return;
    const timer = setTimeout(() => {
      onSearch(query.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const quickChips = [
    { label: "NIFTY 50", query: "NIFTY 50" },
    { label: "TCS", query: "TCS" },
    { label: "NVIDIA AI", query: "NVIDIA" },
    { label: "RBI Repo Rate", query: "RBI" },
    { label: "Federal Reserve", query: "Federal Reserve" },
    { label: "Gold Highs", query: "Gold" },
    { label: "Bitcoin", query: "Bitcoin" },
    { label: "Crude Oil", query: "Oil" },
  ];

  return (
    <section className="relative overflow-hidden py-10 sm:py-16">
      {/* Central Glass Hero Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-modal-content rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-white/40 dark:border-white/15">
          {/* Subtle Ambient Background Highlight */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl pointer-events-none" />

          {/* Main Headline with Dynamic Gradient Text Shift */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-4 text-slate-950 dark:text-white">
            Complex Financial News.{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 via-fuchsia-600 to-indigo-600 dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300 bg-clip-text text-transparent animate-gradient-text">
              Made Simple.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-800 dark:text-slate-200 mb-8 font-semibold leading-relaxed">
            Understand financial news, market trends, and business updates in seconds.
            Translate jargon into everyday takeaways, key points, and clear market impacts.
          </p>

          {/* Interactive Search Box */}
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto mb-6 relative group/search"
          >
            <div className="flex items-center rounded-2xl glass-input p-1.5 sm:p-2 shadow-lg transition-all group-hover/search:border-purple-400 group-hover/search:shadow-purple-500/20">
              <Search className="w-5 h-5 ml-3 text-purple-700 dark:text-purple-300" />
              <input
                type="text"
                id="hero-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search financial news, companies, stocks or topics (e.g., TCS, Inflation, Fed)..."
                className="w-full px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none placeholder:text-slate-600 dark:placeholder:text-slate-400 text-slate-950 dark:text-white font-bold"
              />
              <button
                type="submit"
                id="hero-search-submit-button"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 shadow-md shadow-purple-500/30"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            {onOpenAskAi && (
              <button
                type="button"
                id="hero-ask-ai-action"
                onClick={onOpenAskAi}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-500/30 flex items-center gap-2 transition-all active:scale-95 border border-white/30 hover:scale-105"
              >
                <Bot className="w-4.5 h-4.5 animate-pulse text-white" />
                <span>Ask Anything</span>
              </button>
            )}

            <button
              type="button"
              id="hero-fetch-simplify-action"
              onClick={onOpenSimplifyModal}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-purple-500/30 flex items-center gap-2 transition-all active:scale-95 border border-white/30 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Fetch & Simplify Any Article</span>
            </button>

            <button
              type="button"
              id="hero-explore-latest-action"
              onClick={onExploreLatest}
              className="px-6 py-3 rounded-2xl glass-pill font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 text-slate-950 dark:text-slate-100 hover:border-purple-500 hover:scale-105"
            >
              <span>Explore Latest News</span>
              <ArrowRight className="w-4 h-4 text-purple-700 dark:text-purple-300" />
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-xs font-black text-slate-950 dark:text-slate-100 mr-1">
              Trending Topics:
            </span>
            {quickChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => onSearch(chip.query)}
                className="px-3 py-1.5 rounded-xl text-xs font-extrabold glass-pill text-purple-950 dark:text-purple-200 hover:border-purple-500 transition-all hover:scale-110 active:scale-95 shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Feature Highlights Grid */}
          <div className="pt-6 border-t border-slate-300/40 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 text-left">
            <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel transition-all hover:scale-105">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 font-black">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white">Zero Jargon</h4>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Everyday words & clear takeaways</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel transition-all hover:scale-105">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-700 dark:text-pink-300 flex items-center justify-center shrink-0 font-black">
                <Globe2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white">Multi-Language</h4>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">English, Hindi & Marathi AI</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel transition-all hover:scale-105">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 font-black">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white">Terms Explainer</h4>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Interactive financial dictionary</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel transition-all hover:scale-105">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 font-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-950 dark:text-white">Factual & Safe</h4>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Grounded news summaries</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
