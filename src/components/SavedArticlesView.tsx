import React, { useState } from "react";
import { Bookmark, Trash2, Search, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Article } from "../types";

interface SavedArticlesViewProps {
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveBookmark: (id: string) => void;
  onExploreLatest: () => void;
  isDarkMode: boolean;
}

export const SavedArticlesView: React.FC<SavedArticlesViewProps> = ({
  savedArticles,
  onSelectArticle,
  onRemoveBookmark,
  onExploreLatest,
  isDarkMode,
}) => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = savedArticles.filter((art) => {
    const matchCat = selectedCategory === "All" || art.category === selectedCategory;
    const matchQuery =
      art.title.toLowerCase().includes(query.toLowerCase()) ||
      art.description.toLowerCase().includes(query.toLowerCase()) ||
      art.source.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const categories = ["All", ...Array.from(new Set(savedArticles.map((a) => a.category)))];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
            <span>Saved Articles ({savedArticles.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Articles saved for offline reading and financial reference
          </p>
        </div>

        {/* Search */}
        {savedArticles.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved articles..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Category filters if multiple categories */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Articles List or Empty State */}
      {savedArticles.length === 0 ? (
        <div className={`p-12 text-center rounded-3xl border ${
          isDarkMode ? "bg-slate-800/40 border-slate-700" : "bg-white border-slate-200 shadow-xs"
        }`}>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Saved Articles Yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Bookmark any financial news article from the homepage or search results to read and review its AI simplification later.
          </p>
          <button
            onClick={onExploreLatest}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-sm"
          >
            <span>Explore Latest News</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No saved articles match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((article) => (
            <div
              key={article.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden hover:shadow-md ${
                isDarkMode
                  ? "bg-slate-800/90 border-slate-700"
                  : "bg-white border-slate-200 shadow-xs"
              }`}
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
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
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-blue-700 dark:text-blue-300">
                      {article.category}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveBookmark(article.id)}
                    title="Remove from saved"
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {article.source}
                  </span>
                  <h3
                    onClick={() => onSelectArticle(article)}
                    className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 cursor-pointer mb-2"
                  >
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => onSelectArticle(article)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Read Simplification</span>
                </button>
                <button
                  onClick={() => onRemoveBookmark(article.id)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
