import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowLeft, ChevronUp } from "lucide-react";
import { NavTab } from "../types";

interface GoBackButtonProps {
  currentTab: NavTab;
  onGoHome: () => void;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({
  currentTab,
  onGoHome,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolled down > 300px or when on sub-views
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250 || currentTab !== "home") {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentTab]);

  const handleGoBack = () => {
    // Smooth scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
    // If not on home tab, also return to home tab
    if (currentTab !== "home") {
      onGoHome();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        onClick={handleGoBack}
        id="green-go-back-button"
        className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-500/40 border border-emerald-300/40 backdrop-blur-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group cursor-pointer"
        title={currentTab === "home" ? "Back to Top" : "Go Back Home"}
      >
        {currentTab === "home" ? (
          <ArrowUp className="w-5 h-5 text-white stroke-[3] group-hover:-translate-y-0.5 transition-transform" />
        ) : (
          <ArrowLeft className="w-5 h-5 text-white stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>
    </div>
  );
};
