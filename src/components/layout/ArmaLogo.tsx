import React from 'react';

interface ArmaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ArmaLogo: React.FC<ArmaLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* SVG Emblem matching Rwanda colors and modeling silhouettes */}
      <div className={`aspect-square ${sizeClasses[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#12161A] to-[#1E2630] border border-white/10 shadow-lg p-1.5 overflow-hidden group`}>
        {/* Flag background gradient subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00A1DE]/20 via-[#FAD201]/10 to-[#20603D]/20 opacity-60 group-hover:opacity-100 transition-opacity" />
        
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
          {/* Outer Ring Rwanda Colors */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#00A1DE" strokeWidth="4" strokeDasharray="180 100" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FAD201" strokeWidth="4" strokeDasharray="60 220" strokeDashoffset="-180" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#20603D" strokeWidth="4" strokeDasharray="60 220" strokeDashoffset="-240" />

          {/* Model Silhouette & Letter A */}
          <path
            d="M 25,80 L 50,20 L 75,80 L 62,80 L 50,50 L 38,80 Z"
            fill="url(#arma-blue-grad)"
          />
          {/* Sun symbol from Rwanda Flag */}
          <circle cx="72" cy="28" r="6" fill="#FAD201" />
          <path d="M72 18 L72 20 M72 36 L72 38 M62 28 L64 28 M80 28 L82 28" stroke="#FAD201" strokeWidth="2" strokeLinecap="round" />

          <defs>
            <linearGradient id="arma-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A1DE" />
              <stop offset="100%" stopColor="#20603D" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-widest text-lg sm:text-xl font-serif text-slate-900 dark:text-white flex items-center gap-1">
          ARMA
          <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-[#00A1DE]/10 text-[#00A1DE] border border-[#00A1DE]/20 ml-1">
            RWANDA
          </span>
        </span>
        <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 font-sans uppercase mt-0.5 font-medium">
          Association of Models & Agencies
        </span>
      </div>
    </div>
  );
};
