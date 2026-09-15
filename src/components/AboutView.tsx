import React from "react";
import { Sparkles, Users, Target, ShieldCheck, Zap, Globe, BookOpen } from "lucide-react";

interface AboutViewProps {
  isDarkMode: boolean;
  onOpenGlossary: () => void;
  onOpenSimplifyModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  isDarkMode,
  onOpenGlossary,
  onOpenSimplifyModal,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="glass-modal-content p-8 rounded-3xl text-center relative overflow-hidden shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/25">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
          About FinNews AI
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The educational financial news platform that translates intricate market news, earnings releases, and monetary policy changes into clear, beginner-friendly insights.
        </p>
      </div>

      {/* Target Audiences Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Built For Everyone Who Wants Clarity in Finance</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">
              🎓 Students Learning Finance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Understand real-world business dynamics, macroeconomic cycles, repo rate hikes, and corporate earnings without getting buried in impenetrable textbooks.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              🌱 Beginner Investors
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cut through financial noise, decipher terms like P/E ratio, market cap, and bond yields, and comprehend why markets move without sensationalism.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              📈 Retail Stock Investors
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Get direct 30-second bullet summaries, sector exposure breakdowns, and important numbers before placing trades or reviewing portfolio positions.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200 shadow-xs"
          }`}>
            <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-1">
              💼 Working Professionals
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Stay informed on global economic shifts, inflation, tech advancements, and tax announcements during your daily commute in under 2 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology / Architecture */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        isDarkMode ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-xs"
      }`}>
        <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span>How FinNews AI Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              1. Reliable Ingestion
            </span>
            Fetches live articles from premier global and Indian sources (Reuters, Bloomberg, Economic Times, Mint, TechCrunch, SEC/RBI filings).
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              2. Gemini AI Processing
            </span>
            Executes server-side prompt routines to strip hyperbole, extract hard metrics, explain obscure jargon, and formulate non-speculative takeaways.
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">
              3. Multi-Lingual Delivery
            </span>
            Provides instant, faithful simplifications in English, Hindi (हिन्दी), and Marathi (मराठी) to democratize financial literacy.
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="p-6 rounded-3xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-amber-600" />
          <span>Regulatory & Educational Disclaimer</span>
        </div>
        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          FinNews AI is strictly an <strong>educational tool and news comprehension aid</strong>. Nothing on this website constitutes financial, legal, tax, or investment advice. Market index values and news summaries are provided for informational convenience only. Users should consult licensed financial advisors and conduct independent due diligence before making investment decisions.
        </p>
      </div>

    </div>
  );
};
