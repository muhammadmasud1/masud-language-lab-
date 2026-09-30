import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check, Sparkles 
} from 'lucide-react';
import { PdfProduct, Language, User } from '../types';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';
import { formatBdtPrice, formatUsdPrice, toBanglaDigits, getStoredCurrency } from '../services/currencyService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: PdfProduct[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  lang: Language;
  user?: User | null;
}

const VALID_COUPONS: { [code: string]: number } = {
  'WELCOME10': 10,
  'HSK20': 20,
  'NEWUSER': 15,
};

const PdfCartDrawer: React.FC<Props> = ({ isOpen, onClose, cart, onRemove, onClear, lang, user }) => {
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.percent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (VALID_COUPONS[clean]) {
      setAppliedCoupon({ code: clean, percent: VALID_COUPONS[clean] });
      setCouponError('');
    } else {
      setCouponError(lang === 'EN' ? 'Invalid coupon code' : 'কুপন কোডটি সঠিক নয়');
    }
  };

  const handleCheckout = () => {
    onClose();
    const checkoutState = { 
      cartItems: cart, 
      coupon: appliedCoupon, 
      discount: discountAmount, 
      total 
    };

    if (!user) {
      navigate('/login', { 
        state: { 
          redirectTo: '/pdf-checkout', 
          checkoutState,
          checkoutMessage: lang === 'EN' 
            ? 'Please log in to proceed with your eBook checkout.' 
            : 'বই কেনার প্রক্রিয়া সম্পন্ন করার জন্য দয়া করে আগে লগইন করুন।'
        } 
      });
      return;
    }

    navigate('/pdf-checkout', { state: checkoutState });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10001] flex justify-end">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Drawer */}
        <motion.div 
          initial={{ x: '100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '100%' }} 
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl z-10"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-[#C1121F] flex items-center justify-center border border-red-500/30">
                <ShoppingBag className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-lg text-white">
                  {lang === 'EN' ? 'Digital PDF Cart' : 'ডিজিটাল বুক কার্ট'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {cart.length} {cart.length === 1 ? 'eBook' : 'eBooks'} selected
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <ShoppingBag className="w-14 h-14 text-slate-600 mb-4 stroke-1" />
                <h4 className="font-black text-white text-base mb-1">
                  {lang === 'EN' ? 'Your cart is empty' : 'আপনার কার্ট খালি'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  {lang === 'EN' 
                    ? 'Explore our premium Chinese eBooks with 1–3 sample pages preview.' 
                    : 'আমাদের প্রিমিয়াম চাইনিজ বইগুলো দেখুন এবং ফ্রি ১-৩ পাতা পড়ে কিনে নিন।'}
                </p>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition"
                >
                  {lang === 'EN' ? 'Browse Books' : 'বইগুলো দেখুন'}
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id}
                  className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-750 flex items-center gap-3.5 group hover:border-slate-700 transition"
                >
                  <img 
                    src={item.coverImage} 
                    alt={item.title} 
                    className="w-14 h-18 object-cover rounded-xl shadow-md shrink-0 bg-slate-950" 
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black uppercase text-red-400 tracking-wider">
                      {item.hskLevel}
                    </span>
                    <h5 className="font-bold text-xs text-white truncate max-w-[200px]">
                      {item.title}
                    </h5>
                    <div className="mt-1">
                      <PriceDisplay 
                        amountInBdt={item.price}
                        originalAmountInBdt={item.originalPrice}
                        preferredCurrency={getStoredCurrency()}
                        showDual={true}
                        showBdBadge={false}
                        size="sm"
                        theme="dark"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Summary & Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950 space-y-4">
              {/* Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Coupon: WELCOME10"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white uppercase placeholder:normal-case placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl border border-slate-700 text-slate-200 transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-green-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> {appliedCoupon.code} applied ({appliedCoupon.percent}% off)
                  </p>
                )}
                {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              </form>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between items-baseline">
                  <span>Subtotal</span>
                  <div className="text-right">
                    <span className="font-semibold text-slate-200">{formatUsdPrice(subtotal)}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({formatBdtPrice(subtotal, true)})</span>
                  </div>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400 items-baseline">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatUsdPrice(discountAmount)} ({formatBdtPrice(discountAmount, true)})</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <div className="text-right">
                    <div className="text-xl text-[#C1121F] font-black">
                      {formatUsdPrice(total)}
                    </div>
                    <div className="text-xs font-bold text-amber-400 font-sans">
                      🇧🇩 {formatBdtPrice(total, true)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Delivery Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant full PDF download in "My Books" after payment approval.</span>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform active:scale-95"
              >
                <span>{lang === 'EN' ? 'Proceed to Checkout' : 'চেকআউট করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PdfCartDrawer;
