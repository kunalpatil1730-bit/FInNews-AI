import React, { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  Search,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  CheckCircle2,
  X,
  Bot,
} from "lucide-react";
import {
  Article,
  MarketIndex,
  SectorPerformance,
  NavTab,
  LanguageCode,
  LiveMarketData,
} from "./types";
import {
  fetchMarkets,
  fetchLatestNews,
  searchNews,
  fetchBookmarks,
  saveBookmarkApi,
  removeBookmarkApi,
} from "./services/api";

import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { MarketOverview } from "./components/MarketOverview";
import { CategoryFilter } from "./components/CategoryFilter";
import { NewsCard } from "./components/NewsCard";
import { ArticleModal } from "./components/ArticleModal";
import { SimplifyCustomModal } from "./components/SimplifyCustomModal";
import { ImageAnalysisModal } from "./components/ImageAnalysisModal";
import { GlossaryModal } from "./components/GlossaryModal";
import { AskAiModal } from "./components/AskAiModal";
import { MarketsView } from "./components/MarketsView";
import { SavedArticlesView } from "./components/SavedArticlesView";
import { AboutView } from "./components/AboutView";
import { Footer } from "./components/Footer";
import { DynamicGlassCanvas, GlassTheme } from "./components/DynamicGlassCanvas";
import { LiveMarketTicker } from "./components/LiveMarketTicker";
import { GoBackButton } from "./components/GoBackButton";

export default function App() {
  // Navigation & Theme State
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [glassThemePreset, setGlassThemePreset] = useState<GlassTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("finnews_glass_theme") as GlassTheme) || "amethyst";
    }
    return "amethyst";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("finnews_theme") === "dark";
    }
    return false;
  });
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");

  // News & Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("finnews_interests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Market Data State
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [marketsLoading, setMarketsLoading] = useState<boolean>(false);

  // Bookmarks State
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [liveMarketData, setLiveMarketData] = useState<LiveMarketData | null>(null);

  // Loading & Error States
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Modal States
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [simplifyModalOpen, setSimplifyModalOpen] = useState<boolean>(false);
  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
  const [glossaryModalOpen, setGlossaryModalOpen] = useState<boolean>(false);
  const [askAiModalOpen, setAskAiModalOpen] = useState<boolean>(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Synchronize Dark Mode on HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("finnews_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("finnews_theme", "light");
    }
  }, [isDarkMode]);

  // Persist user interests
  useEffect(() => {
    localStorage.setItem("finnews_interests", JSON.stringify(selectedInterests));
  }, [selectedInterests]);

  // Load Markets
  const loadMarkets = useCallback(async () => {
    setMarketsLoading(true);
    try {
      const data = await fetchMarkets();
      setIndices(data.indices || []);
      setSectors(data.sectors || []);
    } catch (err) {
      console.error("Failed to load markets:", err);
    } finally {
      setMarketsLoading(false);
    }
  }, []);

  // Load Saved Bookmarks
  const loadBookmarks = useCallback(async () => {
    try {
      const data = await fetchBookmarks();
      setSavedArticles(data.bookmarks || []);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    }
  }, []);

  // Load News Articles
  const loadNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      if (searchQuery.trim()) {
        setIsSearching(true);
        const data = await searchNews(searchQuery.trim());
        setArticles(data.articles || []);
        setLiveMarketData(data.liveMarketData || null);
      } else {
        setIsSearching(false);
        setLiveMarketData(null);
        const data = await fetchLatestNews(selectedCategory, selectedInterests);
        setArticles(data.articles || []);
      }
    } catch (err: any) {
      setNewsError("Unable to fetch news. Please try again.");
    } finally {
      setNewsLoading(false);
    }
  }, [selectedCategory, selectedInterests, searchQuery]);

  // Initial Load
  useEffect(() => {
    loadMarkets();
    loadBookmarks();
  }, [loadMarkets, loadBookmarks]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Toggle Bookmark Handler
  const handleToggleBookmark = async (article: Article) => {
    const isAlreadySaved = savedArticles.some((a) => a.id === article.id);
    if (isAlreadySaved) {
      // Remove
      setSavedArticles((prev) => prev.filter((a) => a.id !== article.id));
      showToast("Article removed from saved");
      try {
        await removeBookmarkApi(article.id);
      } catch (err) {
        console.error("Bookmark removal failed:", err);
      }
    } else {
      // Save
      const updatedArticle = { ...article, saved_at: new Date().toISOString() };
      setSavedArticles((prev) => [updatedArticle, ...prev]);
      showToast("Article saved to your reading list");
      try {
        await saveBookmarkApi(updatedArticle);
      } catch (err) {
        console.error("Save bookmark failed:", err);
      }
    }
  };

  // Toggle Interest Handler
  const handleToggleInterest = useCallback((interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }, []);

  // Search Trigger from Header or Hero
  const handleSearchSubmit = useCallback((query: string) => {
    setSearchQuery((prev) => (prev === query ? prev : query));
    setCurrentTab((prevTab) => {
      if (prevTab !== "home" && prevTab !== "latest") return "home";
      return prevTab;
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setLiveMarketData(null);
  }, []);

  return (
    <DynamicGlassCanvas
      isDarkMode={isDarkMode}
      themePreset={glassThemePreset}
      onChangeThemePreset={(theme) => {
        setGlassThemePreset(theme);
        localStorage.setItem("finnews_glass_theme", theme);
      }}
    >
      <div className="min-h-screen font-sans antialiased">
      
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-semibold shadow-xl border border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white dark:hover:text-slate-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedArticles.length}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenSimplifyModal={() => setSimplifyModalOpen(true)}
        onOpenImageModal={() => setImageModalOpen(true)}
        onOpenGlossary={() => setGlossaryModalOpen(true)}
        onOpenAskAi={() => setAskAiModalOpen(true)}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Real-time Dynamic Live Market Ticker */}
      <LiveMarketTicker indices={indices} isDarkMode={isDarkMode} />

      {/* Primary Main Content Area */}
      <main className="min-h-[80vh]">
        
        {/* VIEW: HOME DASHBOARD */}
        {currentTab === "home" && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onSearch={handleSearchSubmit}
              onOpenSimplifyModal={() => setSimplifyModalOpen(true)}
              onExploreLatest={() => {
                setSearchQuery("");
                setCurrentTab("latest");
              }}
              onOpenAskAi={() => setAskAiModalOpen(true)}
              isDarkMode={isDarkMode}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Market Overview Row */}
              <MarketOverview
                indices={indices}
                onRefresh={loadMarkets}
                isLoading={marketsLoading}
                isDarkMode={isDarkMode}
              />

              {/* Active Search Filter Banner if searching and request succeeded */}
              {searchQuery && !newsError && !newsLoading && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>
                      Showing results for <strong>"{searchQuery}"</strong> ({articles.length} found)
                    </span>
                  </div>
                  <button
                    onClick={handleClearSearch}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {/* Live Financial Data Highlight Card */}
              {searchQuery && liveMarketData && !newsLoading && (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/30 dark:border-amber-500/40 shadow-lg backdrop-blur-md">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-amber-500 text-white font-extrabold text-xs shadow-md animate-pulse tracking-wide">
                        ⚡ LIVE MARKET DATA
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          {liveMarketData.name}
                          <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono">
                            {liveMarketData.symbol}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Source: {liveMarketData.source} • Updated at {liveMarketData.lastUpdated}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {liveMarketData.valueFormatted}
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-end gap-1 ${liveMarketData.direction === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {liveMarketData.direction === "up" ? "▲ +" : "▼ "}
                        {liveMarketData.change} ({liveMarketData.changePercent}%)
                      </div>
                    </div>
                  </div>

                  {/* Rates Breakdown Grid for Gold / Commodities */}
                  {liveMarketData.ratesBreakdown && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      {liveMarketData.ratesBreakdown.gold24k_10g && (
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-2xs">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">24K Pure Gold (10g)</div>
                          <div className="text-base font-black text-amber-600 dark:text-amber-400">{liveMarketData.ratesBreakdown.gold24k_10g}</div>
                        </div>
                      )}
                      {liveMarketData.ratesBreakdown.gold22k_10g && (
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-2xs">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">22K Jewelry Gold (10g)</div>
                          <div className="text-base font-black text-amber-600 dark:text-amber-400">{liveMarketData.ratesBreakdown.gold22k_10g}</div>
                        </div>
                      )}
                      {liveMarketData.ratesBreakdown.gold18k_10g && (
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-2xs">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">18K Hallmarked (10g)</div>
                          <div className="text-base font-black text-slate-700 dark:text-slate-300">{liveMarketData.ratesBreakdown.gold18k_10g}</div>
                        </div>
                      )}
                      {liveMarketData.ratesBreakdown.goldSpotUsdOz && (
                        <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-slate-800 shadow-2xs">
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Global Spot Gold</div>
                          <div className="text-base font-black text-blue-600 dark:text-blue-400">{liveMarketData.ratesBreakdown.goldSpotUsdOz}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {liveMarketData.note && (
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-amber-500/10">
                      💡 <strong>Note:</strong> {liveMarketData.note}
                    </p>
                  )}
                </div>
              )}

              {/* Category Pills & Personalization */}
              {!searchQuery && (
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  selectedInterests={selectedInterests}
                  onToggleInterest={handleToggleInterest}
                  isDarkMode={isDarkMode}
                />
              )}

              {/* News Feed Section Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
                    <span>{searchQuery ? "Search Results" : selectedCategory === "All" ? "Top Financial Stories" : `${selectedCategory} News`}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      AI Simplified
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Click any story to read the plain-English translation, key metrics, and market consequences
                  </p>
                </div>

                <button
                  onClick={loadNews}
                  disabled={newsLoading}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    isDarkMode
                      ? "border-slate-800 hover:bg-slate-800 text-slate-300"
                      : "border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? "animate-spin text-blue-600" : ""}`} />
                  <span className="hidden sm:inline">Refresh Stories</span>
                </button>
              </div>

              {/* News Cards Grid / Loading / Error */}
              {newsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className={`h-80 rounded-2xl border p-4 animate-pulse ${
                        isDarkMode ? "bg-slate-800/50 border-slate-800" : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : newsError ? (
                <div className="p-8 text-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <p className="text-sm font-semibold">{newsError}</p>
                  <button
                    onClick={loadNews}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                  >
                    Retry Loading News
                  </button>
                </div>
              ) : articles.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                  <p className="text-sm font-semibold">No news articles found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                    className="mt-3 text-xs text-blue-600 font-bold hover:underline"
                  >
                    Reset filters to see all news
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <NewsCard
                      key={article.id}
                      article={article}
                      onSelectArticle={(art) => setActiveArticle(art)}
                      isSaved={savedArticles.some((a) => a.id === article.id)}
                      onToggleSave={handleToggleBookmark}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW: LATEST NEWS STREAM */}
        {currentTab === "latest" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Latest Financial & Stock Market Feeds
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Continuous real-time updates curated and simplified by Gemini AI
              </p>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedInterests={selectedInterests}
              onToggleInterest={handleToggleInterest}
              isDarkMode={isDarkMode}
            />

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {articles.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  onSelectArticle={(art) => setActiveArticle(art)}
                  isSaved={savedArticles.some((a) => a.id === article.id)}
                  onToggleSave={handleToggleBookmark}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW: MARKETS & SECTOR HEATMAP */}
        {currentTab === "markets" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MarketsView
              indices={indices}
              sectors={sectors}
              onRefresh={loadMarkets}
              isLoading={marketsLoading}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: SAVED ARTICLES */}
        {currentTab === "saved" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SavedArticlesView
              savedArticles={savedArticles}
              onSelectArticle={(art) => setActiveArticle(art)}
              onRemoveBookmark={(id) => {
                setSavedArticles((prev) => prev.filter((a) => a.id !== id));
                removeBookmarkApi(id);
                showToast("Article removed from saved");
              }}
              onExploreLatest={() => setCurrentTab("latest")}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: ABOUT */}
        {currentTab === "about" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AboutView
              isDarkMode={isDarkMode}
              onOpenGlossary={() => setGlossaryModalOpen(true)}
              onOpenSimplifyModal={() => setSimplifyModalOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Detailed Article Modal */}
      {activeArticle && (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          isSaved={savedArticles.some((a) => a.id === activeArticle.id)}
          onToggleSave={handleToggleBookmark}
          defaultLanguage={currentLanguage}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Fetch & Simplify Any Article Modal */}
      <SimplifyCustomModal
        isOpen={simplifyModalOpen}
        onClose={() => setSimplifyModalOpen(false)}
        onSimplifiedSuccess={(newArticle) => {
          setActiveArticle(newArticle);
        }}
        defaultLanguage={currentLanguage}
        isDarkMode={isDarkMode}
      />

      {/* Image / Financial Chart Vision Analyzer Modal */}
      <ImageAnalysisModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Financial Terms Explainer Glossary Modal */}
      <GlossaryModal
        isOpen={glossaryModalOpen}
        onClose={() => setGlossaryModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Universal Ask AI (GPT & Gemini Assistant) Modal */}
      <AskAiModal
        isOpen={askAiModalOpen}
        onClose={() => setAskAiModalOpen(false)}
        currentLanguage={currentLanguage}
        onChangeLanguage={setCurrentLanguage}
        initialArticleContext={activeArticle}
      />

      {/* Floating Ask AI Launcher Button */}
      <button
        id="floating-ask-ai-launcher-button"
        onClick={() => setAskAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm shadow-2xl shadow-purple-500/50 flex items-center gap-2 border border-white/40 hover:scale-110 active:scale-95 transition-all group"
        title="Ask AI Assistant (GPT & Gemini Mode)"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white animate-pulse" />
        </div>
        <span>Ask Anything</span>
        <span className="px-1.5 py-0.5 text-[9px] font-black rounded-full bg-pink-500/80 text-white uppercase tracking-wider">
          GPT
        </span>
      </button>

      {/* Global Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenGlossary={() => setGlossaryModalOpen(true)}
        onOpenSimplifyModal={() => setSimplifyModalOpen(true)}
        isDarkMode={isDarkMode}
      />

      {/* Floating Green Go Back Button */}
      <GoBackButton
        currentTab={currentTab}
        onGoHome={() => setCurrentTab("home")}
      />

    </div>
    </DynamicGlassCanvas>
  );
}
