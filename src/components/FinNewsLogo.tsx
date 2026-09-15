import React from "react";

interface FinNewsLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const FinNewsLogo: React.FC<FinNewsLogoProps> = ({
  className = "",
  size = "md",
  showText = true,
  showSubtitle = true,
  onClick,
}) => {
  // Size mappings for logo image icon
  const iconSizes = {
    sm: "h-9 w-9",
    md: "h-11 w-11 sm:h-12 sm:w-12",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-4xl",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
    >
      {/* High-Res Logo Image Icon Box */}
      <div className="relative shrink-0 overflow-hidden rounded-2xl shadow-lg border border-white/40 dark:border-white/15 group-hover:scale-105 transition-transform duration-300">
        <img
          src="/logo.jpg"
          alt="FinNews AI Logo"
          className={`${iconSizes[size]} object-cover object-center`}
        />
      </div>

      {/* Brand Name Typography Next to Logo */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight leading-none">
            <span className={`font-black ${textSizes[size]} text-slate-900 dark:text-white`}>
              FinNews
            </span>
            <span className={`font-black ${textSizes[size]} bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent ml-1.5`}>
              AI
            </span>
          </div>

          {showSubtitle && (
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-bold tracking-wide mt-0.5 leading-tight hidden sm:block">
              Complex Financial News. Made Simple.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
