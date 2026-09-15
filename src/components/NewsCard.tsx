import React from "react";
import { Bookmark, Clock, Sparkles, ArrowRight, ExternalLink } from "lucide-react";
import { Article } from "../types";

interface NewsCardProps {
  article: Article;
  onSelectArticle: (article: Article) => void;
  isSaved: boolean;
  onToggleSave: (article: Article) => void;
  isDarkMode: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = React.memo(({
  article,
  onSelectArticle,
  isSaved,
  onToggleSave,
  isDarkMode,
}) => {
  // Format publication time relative
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recent";
    }
  };

  // Sentiment style helper
  const sentiment = article.initial_sentiment || "Neutral";
  const score = article.sentiment_score ?? 10;
  const isPositive = sentiment === "Positive" || score > 25;
  const isNegative = sentiment === "Negative" || score < -25;

  const sentimentColor = isPositive
    ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/40"
    : isNegative
    ? "bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400/40"
    : "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/40";

  const sentimentIcon = isPositive ? "🟢" : isNegative ? "🔴" : "🟡";

  return (
    <div
      id={`news-card-${article.id}`}
      className="glass-card rounded-3xl flex flex-col justify-between overflow-hidden group cursor-pointer"
      onClick={() => onSelectArticle(article)}
    >
      <div>
        {/* News Image & Floating Badges */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-200/50 dark:bg-slate-800/50">
          <img
            src={article.image_url}
            alt={article.title}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80";
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-xl text-[11px] font-black glass-pill text-purple-950 dark:text-purple-100 border-white/60 shadow-sm">
              {article.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(article);
            }}
            id={`bookmark-button-${article.id}`}
            title={isSaved ? "Remove from saved" : "Save article"}
            className={`absolute top-3 right-3 p-2 rounded-xl glass-pill transition-all ${
              isSaved
                ? "bg-purple-600 text-white border-purple-400 shadow-md scale-105"
                : "text-white hover:bg-white/30"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
          </button>

          {/* Sentiment Badge on Image Bottom */}
          <div className="absolute bottom-3 left-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-extrabold glass-pill border ${sentimentColor}`}>
              <span>{sentimentIcon}</span>
              <span>{sentiment}</span>
              <span className="opacity-90 text-[10px] font-bold">
                ({score > 0 ? `+${score}` : score})
              </span>
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {/* Source & Timestamp */}
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-200 mb-2.5 font-bold">
            <span className="font-black text-purple-950 dark:text-purple-300 truncate max-w-[65%]">
              {article.source}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold">
              <Clock className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              {formatTimeAgo(article.published_at)}
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-base font-black tracking-tight text-slate-950 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 line-clamp-2 mb-2.5 leading-snug transition-colors">
            {article.title}
          </h3>

          {/* AI Quick Description / Summary snippet */}
          <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed mb-4 font-semibold">
            {article.description}
          </p>

          {/* Mentioned Companies / Sectors chips */}
          {((article.companies && article.companies.length > 0) || (article.sectors && article.sectors.length > 0)) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(article.companies || []).slice(0, 2).map((comp) => (
                <span
                  key={comp}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold glass-pill text-slate-950 dark:text-slate-100"
                >
                  {comp}
                </span>
              ))}
              {(article.sectors || []).slice(0, 2).map((sec) => (
                <span
                  key={sec}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold glass-pill text-purple-950 dark:text-purple-200 border-purple-400/40"
                >
                  {sec}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-4 pt-3 border-t-2 border-purple-400/50 dark:border-purple-400/40 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectArticle(article);
          }}
          id={`read-simplify-btn-${article.id}`}
          className="flex items-center gap-1.5 text-xs font-black text-purple-800 hover:text-purple-950 dark:text-purple-300 dark:hover:text-white transition-all group/btn"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 animate-pulse" />
          <span>Read AI Simplification</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        {article.url && article.url !== "#" && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Read Original Article at Source"
            className="p-1.5 text-slate-700 hover:text-purple-700 dark:text-slate-300 dark:hover:text-purple-300 rounded-lg glass-pill font-bold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
});
