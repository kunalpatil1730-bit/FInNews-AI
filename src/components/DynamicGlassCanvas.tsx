import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Palette, Layers, Eye, RefreshCw } from "lucide-react";
import { NeonLightRibbons } from "./NeonLightRibbons";

export type GlassTheme = "amethyst" | "hyper" | "emerald" | "cosmic";

interface DynamicGlassCanvasProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  themePreset: GlassTheme;
  onChangeThemePreset: (theme: GlassTheme) => void;
}

// Palette configurations matching the user's reference image & alternative glass styles
const themesConfig: Record<
  GlassTheme,
  {
    name: string;
    iconBg: string;
    bgGradient: string;
    darkBgGradient: string;
    orbColors: string[];
    accentGlow: string;
  }
> = {
  amethyst: {
    name: "Amethyst Dream",
    iconBg: "bg-purple-500",
    bgGradient: "from-purple-200 via-pink-200 to-fuchsia-300",
    darkBgGradient: "from-purple-950 via-slate-950 to-fuchsia-950",
    orbColors: [
      "linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #d946ef 100%)",
      "linear-gradient(135deg, #e879f9 0%, #f472b6 60%, #c084fc 100%)",
      "linear-gradient(135deg, #a855f7 0%, #818cf8 100%)",
      "linear-gradient(135deg, #f472b6 0%, #d946ef 100%)",
      "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
    ],
    accentGlow: "rgba(217, 70, 239, 0.25)",
  },
  hyper: {
    name: "Cyber Neon",
    iconBg: "bg-cyan-500",
    bgGradient: "from-cyan-100 via-indigo-100 to-purple-200",
    darkBgGradient: "from-slate-950 via-indigo-950 to-cyan-950",
    orbColors: [
      "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)",
      "linear-gradient(135deg, #38bdf8 0%, #c084fc 100%)",
      "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      "linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)",
    ],
    accentGlow: "rgba(6, 182, 212, 0.25)",
  },
  emerald: {
    name: "Emerald Velvet",
    iconBg: "bg-emerald-500",
    bgGradient: "from-emerald-100 via-teal-100 to-amber-100",
    darkBgGradient: "from-emerald-950 via-slate-950 to-teal-950",
    orbColors: [
      "linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)",
      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      "linear-gradient(135deg, #fbbf24 0%, #34d399 100%)",
      "linear-gradient(135deg, #14b8a6 0%, #10b981 100%)",
    ],
    accentGlow: "rgba(16, 185, 129, 0.25)",
  },
  cosmic: {
    name: "Cosmic Obsidian",
    iconBg: "bg-indigo-600",
    bgGradient: "from-slate-200 via-indigo-100 to-slate-300",
    darkBgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    orbColors: [
      "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      "linear-gradient(135deg, #9333ea 0%, #4f46e5 100%)",
    ],
    accentGlow: "rgba(99, 102, 241, 0.25)",
  },
};

export const DynamicGlassCanvas: React.FC<DynamicGlassCanvasProps> = ({
  children,
  isDarkMode,
  themePreset,
  onChangeThemePreset,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const activeTheme = themesConfig[themePreset] || themesConfig.amethyst;

  // High-performance DOM-direct cursor tracking (0 React re-renders)
  useEffect(() => {
    let animFrame: number;
    let currX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
    let currY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
    let targetX = currX;
    let targetY = currY;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const updateLoop = () => {
      currX += (targetX - currX) * 0.12;
      currY += (targetY - currY) * 0.12;

      document.documentElement.style.setProperty("--mouse-x", `${currX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${currY}px`);

      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(650px circle at ${currX}px ${currY}px, ${activeTheme.accentGlow}, transparent 80%)`;
      }

      animFrame = requestAnimationFrame(updateLoop);
    };

    animFrame = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, [activeTheme.accentGlow]);

  // Parallax offsets for floating 3D spheres based on mouse position
  const calcParallax = (factor: number) => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (mousePos.x - cx) * factor;
    const dy = (mousePos.y - cy) * factor;
    return { x: dx, y: dy };
  };

  const orb1Parallax = calcParallax(0.04);
  const orb2Parallax = calcParallax(-0.03);
  const orb3Parallax = calcParallax(0.05);
  const orb4Parallax = calcParallax(-0.02);

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen transition-colors duration-700 overflow-x-hidden ${
        isDarkMode
          ? `bg-gradient-to-br ${activeTheme.darkBgGradient} text-slate-100`
          : `bg-gradient-to-br ${activeTheme.bgGradient} text-slate-900`
      }`}
    >
      {/* Dynamic Interactive Cursor Glow Spotlight */}
      <div
        ref={spotlightRef}
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at 50% 50%, ${activeTheme.accentGlow}, transparent 80%)`,
        }}
      />

      {/* Continuous Glowing Neon Light Streamers & Ribbons */}
      <NeonLightRibbons mousePos={mousePos} isDarkMode={isDarkMode} />

      {/* Floating 3D Orbs / Spheres Background (Matching User Image aesthetics) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Orb 1: Central Large 3D Glass Sphere */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full glass-orb-3d animate-float-slow"
          style={{
            top: "15%",
            left: "50%",
            transform: `translate(-50%, 0) translate3d(${orb1Parallax.x}px, ${orb1Parallax.y}px, 0)`,
            background: activeTheme.orbColors[0],
            boxShadow: `0 30px 60px -12px ${activeTheme.accentGlow}, inset 0 -10px 20px rgba(0,0,0,0.2), inset 0 10px 25px rgba(255,255,255,0.7)`,
            filter: "blur(0.5px)",
            opacity: isDarkMode ? 0.45 : 0.65,
          }}
        />

        {/* Orb 2: Top Right Medium Sphere */}
        <div
          className="absolute w-44 h-44 sm:w-60 sm:h-60 rounded-full glass-orb-3d animate-float-delayed"
          style={{
            top: "10%",
            right: "12%",
            transform: `translate3d(${orb2Parallax.x}px, ${orb2Parallax.y}px, 0)`,
            background: activeTheme.orbColors[1],
            boxShadow: `0 20px 50px -10px ${activeTheme.accentGlow}, inset 0 -8px 16px rgba(0,0,0,0.25), inset 0 8px 20px rgba(255,255,255,0.8)`,
            opacity: isDarkMode ? 0.5 : 0.7,
          }}
        />

        {/* Orb 3: Bottom Left Sphere */}
        <div
          className="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full glass-orb-3d animate-pulse-slow"
          style={{
            bottom: "18%",
            left: "8%",
            transform: `translate3d(${orb3Parallax.x}px, ${orb3Parallax.y}px, 0)`,
            background: activeTheme.orbColors[2],
            boxShadow: `0 25px 55px -10px ${activeTheme.accentGlow}, inset 0 -8px 18px rgba(0,0,0,0.2), inset 0 8px 22px rgba(255,255,255,0.75)`,
            opacity: isDarkMode ? 0.45 : 0.65,
          }}
        />

        {/* Orb 4: Small Accent Floating Spheres */}
        <div
          className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full glass-orb-3d animate-float-slow"
          style={{
            bottom: "35%",
            right: "22%",
            transform: `translate3d(${orb4Parallax.x}px, ${orb4Parallax.y}px, 0)`,
            background: activeTheme.orbColors[3] || activeTheme.orbColors[0],
            boxShadow: `0 15px 35px -8px ${activeTheme.accentGlow}, inset 0 -5px 12px rgba(0,0,0,0.2), inset 0 6px 15px rgba(255,255,255,0.7)`,
            opacity: isDarkMode ? 0.55 : 0.75,
          }}
        />

        {/* Tiny Floating Micro Spheres */}
        <div
          className="absolute w-12 h-12 rounded-full glass-orb-3d animate-bounce-slow"
          style={{
            top: "28%",
            left: "22%",
            background: activeTheme.orbColors[0],
            boxShadow: "inset 0 4px 8px rgba(255,255,255,0.8)",
            opacity: 0.8,
          }}
        />

        <div
          className="absolute w-10 h-10 rounded-full glass-orb-3d animate-float-delayed"
          style={{
            bottom: "15%",
            right: "45%",
            background: activeTheme.orbColors[1],
            boxShadow: "inset 0 3px 6px rgba(255,255,255,0.8)",
            opacity: 0.85,
          }}
        />
      </div>

      {/* Subtle Dynamic Geometric Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-15 dark:opacity-10"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Application Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
