import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Maximize2, 
  Minimize2, ShoppingCart, Zap, BookOpen, ShieldCheck, CheckCircle2, Eye, FileText
} from 'lucide-react';
import { PdfProduct, Language } from '../types';
import { useNavigate } from 'react-router-dom';
import { pdfService } from '../services/pdfService';
import PriceDisplay from './PriceDisplay';
import { CurrencyType, getStoredCurrency } from '../services/currencyService';

interface Props {
  product: PdfProduct | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddToCart?: (product: PdfProduct) => void;
}

const PdfPreviewModal: React.FC<Props> = ({ product, isOpen, onClose, lang, onAddToCart }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      setCurrentPage(0);
      setZoomLevel(1);
      pdfService.incrementPreviewCount(product.id);
    }
  }, [isOpen, product]);

  const samplePages: string[] = React.useMemo(() => {
    if (!product) return [];
    if (product.previewPages && product.previewPages.length > 0) {
      return product.previewPages;
    }
    // Fallback if empty
    return [
      product.coverImage,
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850"><rect width="600" height="850" fill="%23FFFFFF"/><rect x="0" y="0" width="8" height="850" fill="%23C1121F"/><rect x="25" y="25" width="550" height="60" rx="12" fill="%230F172A"/><text x="45" y="55" font-family="sans-serif" font-size="12" font-weight="900" fill="%23EF4444" letter-spacing="3">MANDARINSHELF • SAMPLE PREVIEW</text><text x="45" y="73" font-family="sans-serif" font-size="14" font-weight="700" fill="%23FFFFFF">${encodeURIComponent(product.title.slice(0, 32))}</text><rect x="45" y="110" width="510" height="680" rx="14" fill="%23F8FAFC" stroke="%23E2E8F0"/><text x="70" y="160" font-family="sans-serif" font-size="20" font-weight="bold" fill="%230F172A">Sample Page 1: Vocabulary &amp; Sentence Rules</text><text x="70" y="220" font-family="serif" font-size="36" font-weight="bold" fill="%23C1121F">你好 • Nǐ hǎo</text><text x="70" y="250" font-family="sans-serif" font-size="14" font-weight="600" fill="%23334155">বাংলা অর্থ: হ্যালো / কেমন আছেন</text><text x="70" y="330" font-family="serif" font-size="36" font-weight="bold" fill="%230F172A">谢谢 • Xièxie</text><text x="70" y="360" font-family="sans-serif" font-size="14" font-weight="600" fill="%23334155">বাংলা অর্থ: ধন্যবাদ (Thank you)</text></svg>`,
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850"><rect width="600" height="850" fill="%23FFFFFF"/><rect x="0" y="0" width="8" height="850" fill="%23C1121F"/><rect x="25" y="25" width="550" height="60" rx="12" fill="%230F172A"/><text x="45" y="55" font-family="sans-serif" font-size="12" font-weight="900" fill="%23EF4444" letter-spacing="3">MANDARINSHELF • SAMPLE PREVIEW</text><text x="45" y="73" font-family="sans-serif" font-size="14" font-weight="700" fill="%23FFFFFF">Sample Page 2: Grammar &amp; Dialogue</text><rect x="45" y="110" width="510" height="680" rx="14" fill="%23FEF2F2" stroke="%23FCA5A5"/><text x="70" y="160" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23991B1B">বাক্য গঠন ও কথোপকথন নমুনা</text><text x="70" y="220" font-family="serif" font-size="28" font-weight="bold" fill="%231E293B">你是哪国人？ • Nǐ shì nǎ guó rén?</text><text x="70" y="250" font-family="sans-serif" font-size="14" font-weight="600" fill="%23475569">আপনি কোন দেশের নাগরিক?</text><text x="70" y="320" font-family="serif" font-size="28" font-weight="bold" fill="%23C1121F">我是孟加拉国人。 • Wǒ shì Mèngjiālāguó rén.</text><text x="70" y="350" font-family="sans-serif" font-size="14" font-weight="600" fill="%23475569">আমি বাংলাদেশী।</text></svg>`
    ];
  }, [product]);

  const totalPages = samplePages.length;
  const currentImage = samplePages[currentPage] || samplePages[0];

  const handlePrev = useCallback(() => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  }, [totalPages]);

  const handleNext = useCallback(() => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  }, [totalPages]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || !product) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleBuyNow = () => {
    onClose();
    navigate('/pdf-checkout', { state: { product } });
  };

  const handleCartClick = () => {
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full ${isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-5xl max-h-[94vh] rounded-3xl'} bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/90 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#C1121F] flex items-center justify-center shrink-0 border border-red-500/30">
                <BookOpen className="w-5 h-5 text-red-500" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-red-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {lang === 'BN' ? 'কুইক প্রিভিউ (নমুনা পৃষ্ঠা)' : 'Quick Preview'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                    {product.hskLevel}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400">
                    • {product.pages} {lang === 'BN' ? 'মোট পৃষ্ঠা' : 'Total Pages'}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {product.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Zoom Controls */}
              <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700">
                <button 
                  onClick={handleZoomOut} 
                  title="Zoom Out"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset Zoom"
                  className="text-[11px] font-mono font-bold px-2 text-slate-300 hover:text-white transition"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button 
                  onClick={handleZoomIn} 
                  title="Zoom In"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Fullscreen Button */}
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)} 
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-800 transition"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button 
                onClick={onClose} 
                title="Close (Esc)"
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 border border-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="relative flex-1 bg-slate-950/95 overflow-auto flex items-center justify-center p-4 sm:p-6 select-none min-h-[360px]">
            {/* Nav Arrows */}
            {totalPages > 1 && (
              <>
                <button 
                  onClick={handlePrev} 
                  title="Previous Page (Left Arrow)"
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/85 hover:bg-[#C1121F] text-white border border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-sm transition active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNext} 
                  title="Next Page (Right Arrow)"
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/85 hover:bg-[#C1121F] text-white border border-slate-700 flex items-center justify-center shadow-xl backdrop-blur-sm transition active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Document Page Display */}
            <div 
              className="relative transition-transform duration-200 shadow-2xl rounded-xl overflow-hidden border border-slate-700/60 bg-white max-w-full"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img 
                src={currentImage} 
                alt={`${product.title} - Sample Page ${currentPage + 1}`}
                className="max-h-[60vh] sm:max-h-[64vh] w-auto max-w-full object-contain block mx-auto pointer-events-none"
              />

              {/* Security & Authenticity Watermark */}
              <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-sm text-amber-300 border border-amber-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-none">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                MandarinShelf Sample Preview
              </div>

              {/* Watermark Diagonal Subtle Pattern */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none rotate-[-25deg]">
                <span className="text-5xl font-black text-slate-900 uppercase tracking-widest">
                  MandarinShelf
                </span>
              </div>
            </div>

            {/* Page Counter Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-full px-4 py-1 text-xs font-semibold text-slate-300 flex items-center gap-2 shadow-lg z-20">
              <FileText className="w-3.5 h-3.5 text-red-500" />
              <span>
                {lang === 'BN' 
                  ? `নমুনা পৃষ্ঠা ${currentPage + 1} / ${totalPages}` 
                  : `Sample Page ${currentPage + 1} of ${totalPages}`}
              </span>
            </div>
          </div>

          {/* Sample Pages Thumbnail Strip */}
          {totalPages > 1 && (
            <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-center gap-3 overflow-x-auto shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
                {lang === 'BN' ? 'নমুনা পৃষ্ঠাসমূহ:' : 'Sample Pages:'}
              </span>
              {samplePages.map((pageSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                    currentPage === idx
                      ? 'bg-red-950/80 border-[#C1121F] text-white shadow-md shadow-red-900/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${currentPage === idx ? 'bg-red-500' : 'bg-slate-600'}`} />
                  <span>{lang === 'BN' ? `পৃষ্ঠা ${idx + 1}` : `Sample ${idx + 1}`}</span>
                </button>
              ))}
            </div>
          )}

          {/* Footer Call to Action */}
          <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div>
                <PriceDisplay 
                  amountInBdt={product.price}
                  originalAmountInBdt={product.originalPrice}
                  preferredCurrency={getStoredCurrency()}
                  showDual={true}
                  showBdBadge={true}
                  size="lg"
                  theme="dark"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Instant digital access to all {product.pages} pages with Hanzi, Pinyin & vocabulary
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onAddToCart && (
                <button 
                  onClick={handleCartClick}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 text-slate-300" />
                  {lang === 'BN' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                </button>
              )}

              <button 
                onClick={handleBuyNow}
                className="flex-1 sm:flex-initial px-6 py-3 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-white" />
                {lang === 'BN' ? 'সম্পূর্ণ বইটি এখনই কিনুন' : 'Buy Full eBook Now'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PdfPreviewModal;
