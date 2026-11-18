import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', animated = false }) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', svg: 'w-4 h-4', text: 'text-sm' },
    md: { box: 'w-9 h-9', svg: 'w-5 h-5', text: 'text-base' },
    lg: { box: 'w-12 h-12', svg: 'w-7 h-7', text: 'text-xl' }
  };

  const dim = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Sonic M Glyph with Glow */}
      <div className={`relative ${dim.box} rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-950 border border-zinc-700/80 dark:border-zinc-700 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105`}>
        {/* Subtle ambient glow aura */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/20 to-[#D4FF00]/20 blur-sm pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Custom Geometric Soundwave Glyph */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${dim.svg} relative z-10`}
        >
          {/* Sound bars forming a sleek modern 'M' */}
          <path
            d="M4 16V8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-emerald-500 dark:text-[#D4FF00]"
          />
          <path
            d="M9 19V5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-emerald-400 dark:text-[#D4FF00]"
          />
          <path
            d="M14 15V9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-teal-400 dark:text-lime-300"
          />
          <path
            d="M19 18V6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-emerald-500 dark:text-[#D4FF00]"
          />
          {/* Sonic Pulse Dot */}
          <circle
            cx="14"
            cy="5"
            r="1.5"
            fill="currentColor"
            className="text-amber-400 dark:text-amber-300 animate-pulse"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex items-center gap-1.5">
        <span className={`font-display font-black tracking-tight text-zinc-900 dark:text-white ${dim.text} group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors`}>
          MUSILY
        </span>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/90 text-zinc-600 dark:text-zinc-400 font-bold border border-zinc-200/80 dark:border-zinc-700/80 tracking-wider shadow-xs">
          AUX
        </span>
      </div>
    </div>
  );
};
