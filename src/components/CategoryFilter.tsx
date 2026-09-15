import React, { useState } from "react";
import { SlidersHorizontal, Check, X, Sparkles } from "lucide-react";
import { CATEGORIES, INTEREST_OPTIONS } from "../types";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedInterests: string[];
  onToggleInterest: (interest: string) => void;
  isDarkMode: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = React.memo(({
  selectedCategory,
  onSelectCategory,
  selectedInterests,
  onToggleInterest,
  isDarkMode,
}) => {
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between gap-2">
        {/* Category Horizontal Scrollable Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar flex-1">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`category-pill-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40"
                    : "glass-pill text-slate-950 dark:text-slate-100 hover:border-purple-500"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Personalize Interests Button */}
        <button
          id="personalize-interests-toggle-button"
          onClick={() => setPersonalizeOpen(!personalizeOpen)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black glass-pill transition-all shrink-0 ${
            selectedInterests.length > 0
              ? "bg-purple-600 text-white border-purple-400/50"
              : "text-slate-950 dark:text-slate-100 hover:border-purple-500"
          }`}
          title="Customize your news feed topics"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700 dark:text-purple-300" />
          <span className="hidden sm:inline">My Feed</span>
          {selectedInterests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-black shadow-xs">
              {selectedInterests.length}
            </span>
          )}
        </button>
      </div>

      {/* Personalization Dropdown Panel */}
      {personalizeOpen && (
        <div className="p-5 rounded-3xl glass-panel shadow-2xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-700 dark:text-purple-300 animate-pulse" />
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-200">
                Personalized News Feed Preferences
              </h4>
            </div>
            <button
              onClick={() => setPersonalizeOpen(false)}
              className="text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white p-1 rounded-lg glass-pill font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 mb-4 font-semibold">
            Select the sectors and markets you are tracking. FinNews AI will prioritize matching articles at the top of your feed:
          </p>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  id={`interest-option-${interest.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => onToggleInterest(interest)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md border border-purple-400/40"
                      : "glass-pill text-slate-950 dark:text-slate-100 hover:border-purple-500"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                    isSelected ? "bg-white text-purple-600 border-white" : "border-slate-500"
                  }`}>
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
