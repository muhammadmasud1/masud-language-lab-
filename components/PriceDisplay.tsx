import React from 'react';
import { 
  formatBdtShort, 
  formatUsdPrice, 
  CurrencyType 
} from '../services/currencyService';

interface PriceDisplayProps {
  amountInBdt: number;
  originalAmountInBdt?: number;
  preferredCurrency?: CurrencyType;
  showDual?: boolean;
  showBdBadge?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amountInBdt,
  originalAmountInBdt,
  preferredCurrency = 'USD',
  showDual = true,
  showBdBadge = true,
  size = 'md',
  className = '',
  theme = 'auto'
}) => {
  if (amountInBdt <= 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="font-black text-emerald-500 tracking-wide uppercase">
          Free
        </span>
      </div>
    );
  }

  const usdPrice = formatUsdPrice(amountInBdt);
  const usdBdtOriginal = originalAmountInBdt ? formatUsdPrice(originalAmountInBdt) : null;
  const bdtShort = formatBdtShort(amountInBdt);
  const bdtOriginalShort = originalAmountInBdt ? formatBdtShort(originalAmountInBdt) : null;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const isUsd = preferredCurrency === 'USD';

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Primary Price Row */}
      <div className="flex items-baseline flex-wrap gap-2">
        <span className={`font-black tracking-tight ${sizeClasses[size]} ${
          theme === 'dark' ? 'text-white' : 'text-slate-900 dark:text-white'
        }`}>
          {isUsd ? usdPrice : `৳ ${bdtShort}`}
        </span>

        {originalAmountInBdt && originalAmountInBdt > amountInBdt && (
          <span className="text-xs sm:text-sm text-slate-400 line-through">
            {isUsd ? usdBdtOriginal : `৳ ${bdtOriginalShort}`}
          </span>
        )}

        {isUsd && (
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            USD
          </span>
        )}
      </div>

      {/* Local BDT Payment Reference */}
      {showDual && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {showBdBadge && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              BDT:
            </span>
          )}
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-sans">
            ৳ {bdtShort}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            (bKash/Nagad)
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
