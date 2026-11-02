import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export function BrandLogo({ size = 'md', showSubtitle = true, className = '' }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-lg sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* Official White Flame Symbol on Royal Blue */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-[#2565D8] via-[#3478F0] to-[#538BF3] p-1.5 shadow-md shadow-[#3478F0]/30 group-hover:shadow-lg group-hover:shadow-[#3478F0]/50 transition-all duration-300 flex items-center justify-center shrink-0`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white transform group-hover:scale-105 transition-transform"
        >
          {/* Stylized White Flame Mascot */}
          <path
            d="M12.8 3C12.8 3 14.8 6.5 14.8 9.5C14.8 10.4 14.5 11.2 14.1 11.9C15.6 10.7 16.6 8.8 16.6 8.8C16.6 8.8 18.8 12.2 18.8 16C18.8 20.4 15.6 22 12 22C8.4 22 5.2 18.8 5.2 14.8C5.2 10.5 8.8 7 9.5 6C9.5 6 9.1 8.5 10.2 10C10.2 8.5 11.2 4.5 12.8 3Z"
            fill="#FFFFFF"
          />
          <path
            d="M12 20C13.8 20 15 18.2 15 16C15 13.8 12.8 12 12 10.5C11.2 12 9 13.8 9 16C9 18.2 10.2 20 12 20Z"
            fill="#EAF2FF"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Wordmark */}
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
    </div>
  );
}
