import React, { useState, useEffect } from 'react';
import { CurrencyType, getStoredCurrency, setStoredCurrency } from '../services/currencyService';

interface CurrencySwitcherProps {
  className?: string;
  onCurrencyChange?: (currency: CurrencyType) => void;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  className = '',
  onCurrencyChange,
}) => {
  const [currency, setCurrency] = useState<CurrencyType>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<CurrencyType>;
      if (custom.detail) {
        setCurrency(custom.detail);
      }
    };
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  const toggleCurrency = () => {
    const next: CurrencyType = currency === 'USD' ? 'BDT' : 'USD';
    setCurrency(next);
    setStoredCurrency(next);
    if (onCurrencyChange) onCurrencyChange(next);
  };

  return (
    <button
      onClick={toggleCurrency}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all shadow-sm ${
        currency === 'USD'
          ? 'bg-zinc-800 text-zinc-100 border-zinc-700 hover:border-zinc-500'
          : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40 hover:border-emerald-400'
      } ${className}`}
      title={
        currency === 'USD'
          ? 'International Pricing (USD $). Click to switch to Bangladeshi Taka (৳ টাকা)'
          : 'Bangladeshi Pricing (৳ টাকা). Click to switch to International USD ($)'
      }
    >
      {currency === 'USD' ? (
        <>
          <span className="text-xs">🌐</span>
          <span>USD ($)</span>
          <span className="text-[10px] text-zinc-400 border-l border-zinc-600 pl-1.5 font-normal">
            Intl
          </span>
        </>
      ) : (
        <>
          <span className="text-xs">🇧🇩</span>
          <span>BDT (৳ টাকা)</span>
          <span className="text-[10px] text-emerald-300 border-l border-emerald-700 pl-1.5 font-normal">
            BD
          </span>
        </>
      )}
    </button>
  );
};

export default CurrencySwitcher;
