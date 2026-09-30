// Currency & Localization Service
// Supports International USD and BDT (৳) with English-only UI standards

export type CurrencyType = 'USD' | 'BDT';

// Clean fixed price tier mappings for eBooks and bundles
const BDT_TO_USD_TIERS: Record<number, number> = {
  0: 0.00,
  200: 1.99,
  290: 2.49,
  350: 2.99,
  399: 3.49,
  420: 3.75,
  499: 4.49,
  500: 4.49,
  550: 4.99,
  590: 5.25,
  600: 5.49,
  650: 5.99,
  750: 6.99,
  800: 7.49,
  950: 8.49,
  1100: 9.49,
  1199: 9.99,
  1200: 9.99,
  2800: 24.99,
};

export const bdtToUsd = (bdtAmount: number): number => {
  if (bdtAmount <= 0) return 0.00;
  if (BDT_TO_USD_TIERS[bdtAmount] !== undefined) {
    return BDT_TO_USD_TIERS[bdtAmount];
  }
  const raw = bdtAmount / 115;
  return Math.round(raw * 100) / 100;
};

export const toBanglaDigits = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (w) => banglaDigits[+w]);
};

export const formatBdtPrice = (amount: number, short: boolean = false): string => {
  if (amount <= 0) return 'Free';
  if (short) {
    return `৳ ${amount.toLocaleString('en-US')}`;
  }
  return `৳ ${amount.toLocaleString('en-US')} BDT`;
};

export const formatBdtShort = (amount: number): string => {
  if (amount <= 0) return 'Free';
  return `৳ ${amount.toLocaleString('en-US')}`;
};

export const formatUsdPrice = (amountInBdt: number): string => {
  if (amountInBdt <= 0) return 'Free';
  const usd = bdtToUsd(amountInBdt);
  return `$${usd.toFixed(2)}`;
};

export const getStoredCurrency = (): CurrencyType => {
  return 'USD';
};

export const setStoredCurrency = (currency: CurrencyType): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mandarin_currency', currency);
    window.dispatchEvent(new CustomEvent('currency_change', { detail: currency }));
  }
};
