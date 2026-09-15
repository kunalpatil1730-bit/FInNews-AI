import React from "react";

interface NeonLightRibbonsProps {
  mousePos: { x: number; y: number };
  isDarkMode: boolean;
}

export const NeonLightRibbons: React.FC<NeonLightRibbonsProps> = ({
  mousePos,
  isDarkMode,
}) => {
  // Parallax subtle offset from mouse position
  const offsetX = (mousePos.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0)) * 0.02;
  const offsetY = (mousePos.y - (typeof window !== "undefined" ? window.innerHeight / 2 : 0)) * 0.02;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="w-full h-full opacity-80 dark:opacity-90"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          transform: `translate3d(${offsetX}px, ${offsetY}px, 0)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <defs>
          {/* Vibrant Neon Color Gradients */}
          <linearGradient id="neonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
            <stop offset="30%" stopColor="#d946ef" stopOpacity="1" />
            <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="neonGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="40%" stopColor="#f43f5e" stopOpacity="1" />
            <stop offset="80%" stopColor="#c084fc" stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="neonGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="50%" stopColor="#e879f9" stopOpacity="1" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="neonGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#facc15" stopOpacity="1" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
            <stop offset="100%" stopColor="#e879f9" stopOpacity="1" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="neonGlowIntense" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur1" />
            <feGaussianBlur stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonGlowSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Background Ambient Glow Ribbon Trails --- */}
        
        {/* Ribbon Trail 1: Wide Glowing Base Stream */}
        <path
          d="M -100 250 C 300 100, 450 600, 900 350 C 1200 180, 1400 400, 1600 300"
          fill="none"
          stroke="url(#neonGrad1)"
          strokeWidth="32"
          strokeLinecap="round"
          filter="url(#neonGlowSoft)"
          opacity="0.35"
          className="animate-pulse-slow"
        />

        {/* Ribbon Trail 2: Main Flowing Neon Ribbon S-Curve (Matches Reference Image) */}
        <path
          d="M -150 200 C 250 80, 420 580, 880 320 C 1150 150, 1380 380, 1600 260"
          fill="none"
          stroke="url(#neonGrad1)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#neonGlowIntense)"
          className="animate-neon-flow-1"
        />

        {/* Ribbon Trail 3: Inner Core Bright White/Cyan Light Streamer */}
        <path
          d="M -150 195 C 250 75, 420 575, 880 315 C 1150 145, 1380 375, 1600 255"
          fill="none"
          stroke="url(#neonGrad3)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#neonGlowIntense)"
          className="animate-neon-flow-2"
        />

        {/* Ribbon Trail 4: Parallel Glowing Gold/Pink Accent Ribbon */}
        <path
          d="M -150 220 C 260 100, 430 600, 890 340 C 1170 170, 1400 400, 1600 280"
          fill="none"
          stroke="url(#neonGrad2)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#neonGlowIntense)"
          className="animate-neon-flow-3"
        />

        {/* Ribbon Trail 5: High-Speed Glowing Light Bullets Sweeping Along Curve */}
        <path
          d="M -150 200 C 250 80, 420 580, 880 320 C 1150 150, 1380 380, 1600 260"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeDasharray="80 400"
          strokeLinecap="round"
          filter="url(#neonGlowIntense)"
          className="animate-neon-fast-dash"
        />

        {/* Ribbon Trail 6: Secondary Gold Light Fast Trail */}
        <path
          d="M -150 220 C 260 100, 430 600, 890 340 C 1170 170, 1400 400, 1600 280"
          fill="none"
          stroke="url(#neonGradGold)"
          strokeWidth="5"
          strokeDasharray="120 500"
          strokeLinecap="round"
          filter="url(#neonGlowIntense)"
          className="animate-neon-fast-dash-delayed"
        />
      </svg>
    </div>
  );
};
