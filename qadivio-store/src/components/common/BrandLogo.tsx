import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  showWordmark?: boolean;
}

export function BrandLogo({ 
  size = 'md', 
  showSubtitle = true, 
  className = '',
  showWordmark = true 
}: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-13 h-13 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Official Qadivio Store Flame Mascot with Signature Eyes */}
      <div
        className={`${iconSizes[size]} overflow-hidden shadow-md shadow-[#3478F0]/30 group-hover:shadow-lg group-hover:shadow-[#3478F0]/50 transition-all duration-300 flex items-center justify-center shrink-0 border border-white/25 bg-[#2f73ee]`}
      >
        <img
          src="/brand/official-logo.png"
          alt="Qadivio Store Official Logo"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Official Wordmark */}
      {showWordmark && (
        <div className="flex flex-col text-right">
          <div className={`font-black tracking-tight text-slate-900 dark:text-white leading-none ${textSizes[size]}`}>
            <span>Qadivio</span>
            <span className="text-[#3478F0] font-black mr-1">Store</span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
              متجر الاشتراكات الرقمية والذكاء الاصطناعي
            </span>
          )}
        </div>
      )}
    </div>
  );
}
