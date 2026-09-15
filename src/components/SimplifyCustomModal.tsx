import React, { useState } from "react";
import { X, Sparkles, Link2, FileText, ArrowRight, Loader2, Globe } from "lucide-react";
import { LanguageCode, Article } from "../types";
import { analyzeCustomContent } from "../services/api";

interface SimplifyCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimplifiedSuccess: (article: Article) => void;
  defaultLanguage: LanguageCode;
  isDarkMode: boolean;
}

export const SimplifyCustomModal: React.FC<SimplifyCustomModalProps> = ({
  isOpen,
  onClose,
  onSimplifiedSuccess,
  defaultLanguage,
  isDarkMode,
}) => {
  const [activeMode, setActiveMode] = useState<"text" | "url">("text");
  const [inputUrl, setInputUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(defaultLanguage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeMode === "url" && !inputUrl.trim()) {
      setError("Please provide a valid financial news URL");
      return;
    }

    if (activeMode === "text" && !inputText.trim()) {
      setError("Please paste the financial article or press release text");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        url: activeMode === "url" ? inputUrl.trim() : undefined,
        rawText: activeMode === "text" ? inputText.trim() : undefined,
        title: inputTitle.trim() || undefined,
        language: selectedLang,
      };

      const analysisResult = await analyzeCustomContent(payload);

      // Construct dynamic article object to display in ArticleModal
      const dynamicArticle: Article = {
        id: analysisResult.article_id || `custom-${Date.now()}`,
        title: inputTitle.trim() || (activeMode === "url" ? inputUrl : inputText.slice(0, 75) + "..."),
        description: analysisResult.summary || (activeMode === "text" ? inputText.slice(0, 160) : inputUrl),
        content: activeMode === "text" ? inputText : `Analysis for article from ${inputUrl}`,
        source: activeMode === "url" ? new URL(inputUrl).hostname.replace("www.", "") : "Custom Document",
        url: activeMode === "url" ? inputUrl : "#",
        image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=80",
        published_at: new Date().toISOString(),
        category: "Custom Analysis",
        initial_sentiment: analysisResult.sentiment,
        sentiment_score: analysisResult.sentiment_score,
      };

      setLoading(false);
      onClose();
      onSimplifiedSuccess(dynamicArticle);
    } catch (err: any) {
      setError("Unable to simplify news article right now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto glass-modal-overlay flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl glass-modal-content rounded-3xl p-6 relative transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Fetch & Simplify Any Financial Article
              </h3>
              <p className="text-xs text-slate-500">
                Paste any news link or paragraph to convert it into beginner-friendly insights
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

        {/* Input Mode Selector */}
        <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode("text")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeMode === "text"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste News Text / Excerpt</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("url")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeMode === "url"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Paste Article URL</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProcess} className="space-y-4">
          {activeMode === "text" ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RBI MPC Meeting Outcome"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  News Content / Paragraphs *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Paste complex financial news paragraphs, earnings reports, or central bank policy announcements here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                News Article URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://www.bloomberg.com/news/articles/..."
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Target Output Language */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Explanation Language:</span>
            </span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as LanguageCode)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Simplifying with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simplify Article</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
