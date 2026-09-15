import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Bookmark,
  Share2,
  ExternalLink,
  Clock,
  Globe,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Building2,
  Hash,
  Send,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { Article, SimplifiedAnalysis, LanguageCode, ChatMessage } from "../types";
import { summarizeArticle, sendChatMessageApi } from "../services/api";

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
  defaultLanguage: LanguageCode;
  isDarkMode: boolean;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isSaved,
  onToggleSave,
  defaultLanguage,
  isDarkMode,
}) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(defaultLanguage);
  const [analysis, setAnalysis] = useState<SimplifiedAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Chat tab state
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Synchronize language when default changes
  useEffect(() => {
    setCurrentLang(defaultLanguage);
  }, [defaultLanguage]);

  // Load or fetch analysis when article or language changes
  useEffect(() => {
    if (!article) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    summarizeArticle(article, currentLang)
      .then((data) => {
        if (isMounted) {
          setAnalysis(data);
          setLoading(false);
          // Initial greeting for chat
          setChatMessages([
            {
              role: "assistant",
              content: `Hello! I'm your FinNews AI Assistant. You're reading about **${article.title}**. Feel free to ask me anything — like *"Explain this like I'm 10"*, *"Will this change my bank interest?"*, or *"What does this mean for stocks?"*`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("Unable to simplify news article right now. Please try again.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [article, currentLang]);

  // Handle Chat Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    const newMsgList: ChatMessage[] = [
      ...chatMessages,
      {
        role: "user",
        content: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setChatMessages(newMsgList);
    setChatLoading(true);

    try {
      const res = await sendChatMessageApi(newMsgList, {
        title: article?.title,
        description: article?.description,
        summary: analysis?.summary,
      });

      setChatMessages([
        ...newMsgList,
        {
          role: "assistant",
          content: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setChatMessages([
        ...newMsgList,
        {
          role: "assistant",
          content: "Sorry, I couldn't process your question right now. Please try again in a moment.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Quick prompt buttons for chat
  const handleQuickChatPrompt = (promptText: string) => {
    setChatInput(promptText);
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const textToCopy = `FinNews AI Summary: ${article?.title}\n\nKey Takeaway: ${analysis.takeaway}\n\nSummary: ${analysis.summary}\n\nRead more on FinNews AI.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) return null;

  return (
    <div
      id="article-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto glass-modal-overlay flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="article-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl glass-modal-content rounded-3xl shadow-2xl overflow-hidden my-auto transition-all max-h-[92vh] flex flex-col"
      >
        {/* Modal Top Header Bar */}
        <div className="sticky top-0 z-30 px-5 sm:px-6 py-4 border-b flex items-center justify-between backdrop-blur-md bg-inherit/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                FinNews AI Simplifier
              </span>
              <span className="text-xs text-slate-400 ml-2 hidden sm:inline">
                • Educational Breakdown
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector Dropdown inside modal */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <select
                id="modal-language-selector"
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value as LanguageCode)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="text-slate-900 bg-white">English</option>
                <option value="hi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
                <option value="mr" className="text-slate-900 bg-white">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(article)}
              id="modal-bookmark-button"
              className={`p-2 rounded-lg border transition-all ${
                isSaved
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
              title={isSaved ? "Saved" : "Save Article"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
            </button>

            {/* Share / Copy Summary button */}
            <button
              onClick={handleCopySummary}
              id="modal-share-button"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Copy Summary to Clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              id="modal-close-button"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switching: Analysis vs Ask AI Chatbot */}
        <div className="px-5 sm:px-6 pt-3 pb-0 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "analysis"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Simplification & Insights</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "chat"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Bot className="w-4 h-4 text-indigo-500" />
            <span>Ask AI About This Article</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold">
              Gemini
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Article Header info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                {article.category}
              </span>
              <span>•</span>
              <span className="text-slate-700 dark:text-slate-300">{article.source}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(article.published_at).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-snug mb-4">
              {article.title}
            </h2>

            {/* Original Article Hero Image */}
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-6 relative">
              <img
                src={article.image_url}
                alt={article.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3">
                {article.url && article.url !== "#" && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md"
                  >
                    <span>Read Original Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* TAB 1: AI SIMPLIFICATION BREAKDOWN */}
          {activeTab === "analysis" && (
            <>
              {loading && (
                <div className="p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto animate-bounce">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <h4 className="text-base font-bold">Simplifying Financial News with Gemini AI...</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Translating complex market terminology, extracting key numbers, and generating beginner-friendly takeaways in {currentLang === "hi" ? "Hindi" : currentLang === "mr" ? "Marathi" : "English"}.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!loading && analysis && (
                <div className="space-y-6">
                  
                  {/* 1. Simple Summary Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200/80 dark:border-blue-900/60">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>1. Simple Summary (Beginner-Friendly)</span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                      "{analysis.summary}"
                    </p>
                  </div>

                  {/* 2. Key Points */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <span>📌 Key Insights</span>
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {analysis.key_points.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. Why This Matters */}
                  <div className="p-5 rounded-2xl border border-indigo-200/70 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20">
                    <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>💡 Why This Matters (For Common Consumers & Investors)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {analysis.why_it_matters}
                    </p>
                  </div>

                  {/* 4. Market Impact, Affected Sectors & Companies */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span>📊 Market Impact & Exposure</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {analysis.market_impact}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {/* Affected Sectors */}
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                          Affected Sectors:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.affected_sectors.map((sec) => (
                            <span
                              key={sec}
                              className="px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 border border-slate-200 dark:border-slate-600"
                            >
                              {sec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Affected Companies */}
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
                          Mentioned Companies:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.affected_companies.length > 0 ? (
                            analysis.affected_companies.map((comp) => (
                              <span
                                key={comp}
                                className="px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                              >
                                {comp}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">General broader market</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Important Numbers */}
                  {analysis.important_numbers && analysis.important_numbers.length > 0 && (
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                        <Hash className="w-4 h-4 text-emerald-500" />
                        <span>🔢 Important Numbers & Key Metrics</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {analysis.important_numbers.map((num, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs font-medium text-emerald-900 dark:text-emerald-200"
                          >
                            • {num}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Financial Terms Explained (Section 5) */}
                  <div className="p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/80 bg-blue-50/20 dark:bg-blue-950/10">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>📖 Financial Terms Explained (Beginner Definitions)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysis.financial_terms.map((termItem, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs"
                        >
                          <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-1">
                            {termItem.term}
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-200 mb-2 leading-relaxed">
                            <span className="font-semibold text-slate-900 dark:text-white">Meaning: </span>
                            {termItem.simple_meaning}
                          </p>
                          <div className="text-[11px] p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 italic">
                            <span className="font-semibold not-italic text-slate-800 dark:text-slate-200">Example: </span>
                            {termItem.example}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. AI Sentiment Analysis (Section 6) */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>🤖 AI Sentiment Analysis</span>
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {analysis.sentiment === "Positive" ? "🟢 Positive" : analysis.sentiment === "Negative" ? "🔴 Negative" : "🟡 Neutral"}
                        </span>
                        <span className="text-xs font-bold font-mono text-slate-600 dark:text-slate-300">
                          Score: {analysis.sentiment_score > 0 ? `+${analysis.sentiment_score}` : analysis.sentiment_score}/100
                        </span>
                      </div>
                    </div>

                    {/* Sentiment Bar (-100 to +100) */}
                    <div>
                      <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            analysis.sentiment_score > 20
                              ? "bg-emerald-500"
                              : analysis.sentiment_score < -20
                              ? "bg-rose-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.max(10, Math.min(100, (analysis.sentiment_score + 100) / 2))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                        <span>-100 (Bearish)</span>
                        <span>0 (Neutral)</span>
                        <span>+100 (Bullish)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Rationale: </span>
                      {analysis.sentiment_reason}
                    </p>

                    {/* Educational Disclaimer */}
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Important Notice:</strong> Sentiment score is an automated AI text classification based solely on reported market tone. It does NOT constitute guaranteed financial advice, price forecasts, or investment solicitation.
                      </span>
                    </div>
                  </div>

                  {/* 8. Risk & Uncertainty */}
                  {analysis.uncertainty && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Key Risks & Uncertainties to Watch</span>
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {analysis.uncertainty}
                      </p>
                    </div>
                  )}

                  {/* 9. One-Line Takeaway */}
                  <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200 block mb-1">
                      📝 One-Line Takeaway
                    </span>
                    <p className="text-sm sm:text-base font-bold">
                      "{analysis.takeaway}"
                    </p>
                  </div>

                  {/* 10. Footer Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    {article.url && article.url !== "#" ? (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs sm:text-sm hover:opacity-90 transition-all shadow-sm"
                      >
                        <span>Read Original Article</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Direct Source Article</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveTab("chat")}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-semibold text-xs sm:text-sm hover:bg-indigo-100 transition-all"
                    >
                      <Bot className="w-4 h-4" />
                      <span>Have questions? Ask AI</span>
                    </button>
                  </div>

                </div>
              )}
            </>
          )}

          {/* TAB 2: INTERACTIVE AI CHATBOT ABOUT THIS ARTICLE */}
          {activeTab === "chat" && (
            <div className="space-y-4">
              
              {/* Quick sample prompt chips */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Suggestions:</span>
                {[
                  "Explain this like I'm 10 years old",
                  "Will this affect my loan EMI?",
                  "Why did stocks react this way?",
                  "What is the biggest risk here?",
                ].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => handleQuickChatPrompt(sugg)}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors"
                  >
                    {sugg}
                  </button>
                ))}
              </div>

              {/* Chat Thread Messages */}
              <div className="min-h-[300px] max-h-[380px] overflow-y-auto space-y-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-tl-none shadow-2xs whitespace-pre-wrap"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                    <Bot className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>FinNews AI is analyzing and thinking...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <form onSubmit={handleSendChat} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any question about this financial article or term..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || chatLoading}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
