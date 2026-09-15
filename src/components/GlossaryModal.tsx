import React, { useState } from "react";
import { X, BookOpen, Search, Sparkles } from "lucide-react";

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface GlossaryEntry {
  term: string;
  category: "Stock Market" | "Banking & Policy" | "Valuation" | "Crypto & Commodities";
  simpleMeaning: string;
  example: string;
}

const GLOSSARY_DATA: GlossaryEntry[] = [
  {
    term: "PE Ratio (Price-to-Earnings)",
    category: "Valuation",
    simpleMeaning: "Compares a company's current share price to its annual profit per share, indicating how expensive or cheap the stock is.",
    example: "If a company has a PE ratio of 20, investors are paying ₹20 for every ₹1 of annual earnings.",
  },
  {
    term: "Bull Market",
    category: "Stock Market",
    simpleMeaning: "A period where stock prices are steadily rising by 20% or more, supported by strong investor confidence and economic expansion.",
    example: "During a bull market, everyday news is received with optimism and benchmark indices like Nifty or S&P 500 set fresh records.",
  },
  {
    term: "Bear Market",
    category: "Stock Market",
    simpleMeaning: "A sustained market downturn where major stock indices drop by 20% or more from recent peaks, accompanied by widespread caution.",
    example: "During the early 2020 pandemic crash, global stock markets quickly entered a bear market before rebounding.",
  },
  {
    term: "Repo Rate",
    category: "Banking & Policy",
    simpleMeaning: "The benchmark interest rate at which a central bank (like the RBI) lends short-term funds to commercial banks.",
    example: "When the RBI raises the repo rate from 6.0% to 6.5%, commercial banks raise their home loan and car loan interest rates.",
  },
  {
    term: "Inflation (CPI)",
    category: "Banking & Policy",
    simpleMeaning: "The rate at which prices of groceries, fuel, housing, and everyday goods increase, decreasing consumer purchasing power.",
    example: "If inflation is 5%, a basket of groceries that cost ₹1,000 last year will cost ₹1,050 today.",
  },
  {
    term: "Market Capitalization",
    category: "Valuation",
    simpleMeaning: "The total market value of all a company's outstanding shares added together.",
    example: "If TCS has 3.6 billion shares trading at ₹4,000 each, its market capitalization is ₹14.4 Lakh Crore.",
  },
  {
    term: "Initial Public Offering (IPO)",
    category: "Stock Market",
    simpleMeaning: "The very first time a private company sells its shares to the general public and lists on a stock exchange.",
    example: "When Zomato or PhonePe conducts an IPO, retail investors can apply to buy shares directly before public trading begins.",
  },
  {
    term: "Dividend",
    category: "Valuation",
    simpleMeaning: "A portion of a company's profits distributed directly in cash to its shareholders as a reward for holding the stock.",
    example: "If you own 100 shares of Infosys and it announces a ₹30 dividend per share, ₹3,000 is directly credited into your bank account.",
  },
  {
    term: "Bond Yield",
    category: "Banking & Policy",
    simpleMeaning: "The annual rate of return an investor receives on a government or corporate debt security.",
    example: "When US 10-year Treasury yields rise toward 4.5%, investors often pull money from riskier tech stocks into safe guaranteed bonds.",
  },
  {
    term: "Monetary Policy",
    category: "Banking & Policy",
    simpleMeaning: "Strategies and interest-rate controls used by a central bank (like the Fed or RBI) to manage inflation and economic growth.",
    example: "Hawkish policy means hiking interest rates to fight inflation; dovish policy means cutting rates to boost job growth.",
  },
  {
    term: "EBITDA",
    category: "Valuation",
    simpleMeaning: "Earnings Before Interest, Taxes, Depreciation, and Amortization — a measure of a company's core operating profitability.",
    example: "It shows how much operational cash a factory or software company generates before accounting expenses.",
  },
  {
    term: "Bitcoin Halving",
    category: "Crypto & Commodities",
    simpleMeaning: "A programmed event occurring every 4 years that cuts the block reward given to Bitcoin miners in half, reducing new supply.",
    example: "In 2024, daily new Bitcoin production dropped from 900 BTC to 450 BTC, tightening market supply.",
  },
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("All");

  if (!isOpen) return null;

  const filtered = GLOSSARY_DATA.filter((item) => {
    const matchCat = selectedCat === "All" || item.category === selectedCat;
    const matchQuery =
      item.term.toLowerCase().includes(search.toLowerCase()) ||
      item.simpleMeaning.toLowerCase().includes(search.toLowerCase()) ||
      item.example.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const categories = ["All", "Valuation", "Stock Market", "Banking & Policy", "Crypto & Commodities"];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto glass-modal-overlay flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl glass-modal-content rounded-3xl p-6 relative transition-all max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Financial Terms Explainer Dictionary
              </h3>
              <p className="text-xs text-slate-500">
                Beginner-friendly explanations and real-world examples for complex jargon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category filter */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search financial terms (e.g., PE Ratio, Repo Rate, Bull Market)..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCat === cat
                    ? "bg-indigo-600 text-white"
                    : isDarkMode
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No financial terms match "{search}". Try searching for PE Ratio, Repo Rate, or Inflation.
            </div>
          ) : (
            filtered.map((entry) => (
              <div
                key={entry.term}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-extrabold text-blue-700 dark:text-blue-400">
                    {entry.term}
                  </h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {entry.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 mb-2 leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">Simple Meaning: </span>
                  {entry.simpleMeaning}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Real Example: </span>
                  {entry.example}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
