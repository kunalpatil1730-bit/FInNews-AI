import React, { useState } from "react";
import {
  TrendingUp,
  Bookmark,
  Search,
  Globe,
  Sun,
  Moon,
  Sparkles,
  Camera,
  BookOpen,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { NavTab, LanguageCode } from "../types";
import { FinNewsLogo } from "./FinNewsLogo";

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  savedCount: number;
  currentLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSimplifyModal: () => void;
  onOpenImageModal: () => void;
  onOpenGlossary: () => void;
  onSearchSubmit: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({
  currentTab,
  onSelectTab,
  savedCount,
  currentLanguage,
  onChangeLanguage,
  isDarkMode,
  onToggleDarkMode,
  onOpenSimplifyModal,
  onOpenImageModal,
  onOpenGlossary,
  onSearchSubmit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery.trim());
      setSearchOpen(false);
    }
  };

  const navItems: { id: NavTab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "latest", label: "Latest News" },
    { id: "markets", label: "Markets" },
    { id: "saved", label: "Saved" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 glass-header transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo with 3D Graphics */}
          <div id="brand-logo-button">
            <FinNewsLogo size="md" showSubtitle onClick={() => onSelectTab("home")} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 p-1 rounded-2xl glass-panel">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all relative ${
                    active
                      ? "bg-purple-600 text-white dark:bg-purple-900/80 dark:text-purple-100 shadow-md shadow-purple-500/20 border border-purple-400/40"
                      : "text-slate-900 dark:text-slate-100 hover:text-purple-700 hover:bg-white/60 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {item.label}
                  {item.id === "saved" && savedCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-extrabold rounded-full bg-pink-600 text-white shadow-xs">
                      {savedCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    id="header-search-input"
                    autoFocus
                    placeholder="Search company, stock, topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-64 px-3 py-1.5 text-xs sm:text-sm rounded-xl glass-input focus:outline-none text-slate-950 dark:text-white placeholder:text-slate-500 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 ml-1 text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  id="header-search-button"
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-xl glass-pill hover:scale-105 active:scale-95 text-slate-900 dark:text-slate-100 font-extrabold"
                  title="Search news"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Glossary Button */}
            <button
              id="header-glossary-button"
              onClick={onOpenGlossary}
              className="p-2.5 rounded-xl glass-pill hover:scale-105 active:scale-95 text-slate-900 dark:text-slate-100 hidden sm:flex items-center gap-1.5 text-xs font-extrabold"
              title="Financial Terms Dictionary"
            >
              <BookOpen className="w-4 h-4 text-purple-700 dark:text-purple-400" />
              <span>Glossary</span>
            </button>

            {/* Image / Chart Analyzer */}
            <button
              id="header-image-analyzer-button"
              onClick={onOpenImageModal}
              className="p-2.5 rounded-xl glass-pill hover:scale-105 active:scale-95 text-slate-900 dark:text-slate-100 hidden sm:flex items-center gap-1.5 text-xs font-extrabold"
              title="Upload Chart or Financial Screenshot to Analyze with Gemini"
            >
              <Camera className="w-4 h-4 text-pink-700 dark:text-pink-400" />
              <span className="hidden lg:inline">Analyze Chart</span>
            </button>

            {/* Language Selector */}
            <div className="relative">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-pill text-xs font-extrabold text-slate-950 dark:text-slate-100">
                <Globe className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                <select
                  id="header-language-select"
                  value={currentLanguage}
                  onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
                  className="bg-transparent text-xs font-black focus:outline-none cursor-pointer text-slate-950 dark:text-slate-100"
                >
                  <option value="en" className="text-slate-950 bg-white">EN</option>
                  <option value="hi" className="text-slate-950 bg-white">HI (हिन्दी)</option>
                  <option value="mr" className="text-slate-950 bg-white">MR (मराठी)</option>
                </select>
              </div>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              id="header-theme-toggle-button"
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl glass-pill hover:scale-105 active:scale-95 text-amber-600 dark:text-amber-400 font-extrabold"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Fetch & Simplify Quick Action Button */}
            <button
              id="header-fetch-simplify-button"
              onClick={onOpenSimplifyModal}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 transition-all active:scale-95 border border-white/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simplify Article</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="header-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl glass-pill text-slate-950 dark:text-slate-100 font-extrabold"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-300/40 dark:border-slate-800 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-between glass-pill ${
                  currentTab === item.id
                    ? "bg-purple-600 text-white border-purple-400/50"
                    : "text-slate-950 dark:text-slate-100"
                }`}
              >
                <span>{item.label}</span>
                {item.id === "saved" && savedCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black rounded-full bg-pink-600 text-white">
                    {savedCount}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-300/40 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenSimplifyModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-black shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Fetch & Simplify Any Article</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenGlossary();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl glass-pill text-xs font-extrabold text-slate-950 dark:text-slate-100"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>Terms Glossary</span>
                </button>
                <button
                  onClick={() => {
                    onOpenImageModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl glass-pill text-xs font-extrabold text-slate-950 dark:text-slate-100"
                >
                  <Camera className="w-3.5 h-3.5 text-pink-600" />
                  <span>Analyze Chart</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
});
