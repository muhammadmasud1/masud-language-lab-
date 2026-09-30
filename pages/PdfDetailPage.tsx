import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ShieldCheck, BookOpen, Download, ShoppingCart, Zap, 
  Eye, CheckCircle2, ChevronRight, ArrowLeft, Clock, FileText, 
  Globe, Sparkles, MessageSquare, Award, ArrowUpRight 
} from 'lucide-react';
import { PdfProduct, User, Language, PdfReview } from '../types';
import { pdfService } from '../services/pdfService';
import PdfPreviewModal from '../components/PdfPreviewModal';
import PdfCartDrawer from '../components/PdfCartDrawer';
import PriceDisplay from '../components/PriceDisplay';
import { CurrencyType, getStoredCurrency } from '../services/currencyService';

interface Props {
  lang: Language;
  user: User | null;
}

const PdfDetailPage: React.FC<Props> = ({ lang, user }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<PdfProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<PdfProduct[]>([]);
  const [reviews, setReviews] = useState<PdfReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Cart
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<PdfProduct[]>([]);
  const [currency, setCurrency] = useState<CurrencyType>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<CurrencyType>;
      if (custom.detail) setCurrency(custom.detail);
    };
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  // User Access check
  const [hasPurchased, setHasPurchased] = useState(false);

  // Review Form
  const [userRating, setUserRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      if (!slug) return;
      
      const found = await pdfService.getPdfProductBySlug(slug);
      if (found) {
        setProduct(found);
        pdfService.incrementViewCount(found.id);

        const [all, prodReviews] = await Promise.all([
          pdfService.getPdfProducts(),
          pdfService.getPdfReviews(found.id)
        ]);
        setRelatedProducts(all.filter(p => p.id !== found.id).slice(0, 4));
        setReviews(prodReviews);

        if (user) {
          const hasAccess = await pdfService.checkUserHasAccess(user.id, found.id);
          setHasPurchased(hasAccess);
        }
      }
      setIsLoading(false);
    };

    const loadCart = () => {
      const saved = localStorage.getItem('mandarinshelf_cart');
      if (saved) {
        try { setCart(JSON.parse(saved)); } catch {}
      }
    };

    loadData();
    loadCart();
  }, [slug, user]);

  const handleAddToCart = (item: PdfProduct) => {
    let updated = [...cart];
    if (!updated.some(p => p.id === item.id)) {
      updated.push(item);
      setCart(updated);
      localStorage.setItem('mandarinshelf_cart', JSON.stringify(updated));
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    const updated = cart.filter(p => p.id !== id);
    setCart(updated);
    localStorage.setItem('mandarinshelf_cart', JSON.stringify(updated));
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!user) {
      navigate('/login', {
        state: {
          redirectTo: '/pdf-checkout',
          checkoutState: { product },
          checkoutMessage: lang === 'EN' 
            ? 'Please log in to purchase this eBook and unlock instant delivery.' 
            : 'বইটি কেনার জন্য দয়া করে আগে আপনার একাউন্টে লগইন করুন।'
        }
      });
      return;
    }
    navigate('/pdf-checkout', { state: { product } });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product || !userReviewText.trim()) return;

    setIsSubmittingReview(true);
    const newRev: PdfReview = {
      id: `rev_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      productId: product.id,
      rating: userRating,
      review: userReviewText.trim(),
      createdAt: new Date().toISOString(),
      approved: true
    };

    await pdfService.addPdfReview(newRev);
    setReviews([newRev, ...reviews]);
    setUserReviewText('');
    setReviewSuccess(lang === 'EN' ? 'Thank you! Your review has been published.' : 'ধন্যবাদ! আপনার রিভিউ সফলভাবে প্রকাশিত হয়েছে।');
    setIsSubmittingReview(false);
    setTimeout(() => setReviewSuccess(''), 4000);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black mb-2">Book Not Found</h2>
        <p className="text-slate-500 mb-6">The requested Chinese learning eBook does not exist or has been removed.</p>
        <Link to="/store" className="px-6 py-3 bg-[#C1121F] text-white rounded-xl font-bold text-xs uppercase">
          Return to MandarinShelf
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8 font-semibold">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/store" className="hover:text-red-500 transition">MandarinShelf</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 dark:text-slate-200 truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
        {/* Left: 3D Book Cover & Preview Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative group">
            {/* Ambient Red Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-amber-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition duration-500" />

            {/* Book Cover Frame */}
            <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
              <img 
                src={product.coverImage} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />

              {/* Spine Effect Overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

              {/* Badges on Cover */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-[#C1121F] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                  {product.hskLevel}
                </span>
                {product.discount && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Click to Preview Hover Overlay */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white transition-opacity duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#C1121F] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700">
                  {lang === 'BN' ? 'কুইক প্রিভিউ (নমুনা পৃষ্ঠা)' : 'Quick Preview (Sample Pages)'}
                </span>
              </button>
            </div>
          </div>

          {/* Preview Button below cover */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full max-w-md mx-auto py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-800 dark:text-slate-200 hover:text-[#C1121F] rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 transition shadow-sm"
          >
            <Eye className="w-4 h-4 text-red-500" />
            <span>{lang === 'EN' ? 'Click to Read Sample Pages' : '১-৩টি স্যাম্পল পাতা পড়ে দেখুন'}</span>
          </button>
        </div>

        {/* Right: Book Details & Purchase Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                {product.category}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Author: Md. Masud Rana (HSK 6)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating Stars & Stats */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1.5">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">({product.reviewCount} customer reviews)</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {product.salesCount}+ Copies Sold
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-black">Level</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{product.hskLevel}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-black">Pages</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{product.pages} Pages</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-black">File Size</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{product.fileSize}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-black">Format</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">High-Res PDF</p>
            </div>
          </div>

          {/* Pricing Box & Action Buttons */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Instant Access Price</p>
                <PriceDisplay 
                  amountInBdt={product.price}
                  originalAmountInBdt={product.originalPrice}
                  preferredCurrency={currency}
                  showDual={true}
                  showBdBadge={true}
                  size="xl"
                />
              </div>

              {hasPurchased && (
                <div className="text-right">
                  <span className="text-xs font-black uppercase tracking-wider text-green-500 bg-green-950/60 border border-green-800 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Your Library
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{lang === 'EN' ? 'Buy Now • Instant Delivery' : 'এখনই কিনুন • ইন্সট্যান্ট ডেলিভারি'}</span>
              </button>

              <button
                onClick={() => handleAddToCart(product)}
                className="py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition"
              >
                <ShoppingCart className="w-4 h-4 text-slate-500" />
                <span>{lang === 'EN' ? 'Add to Cart' : 'কার্টে যোগ'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> bKash, Nagad, Rocket & Binance Accepted
              </span>
              <span>100% Genuine Digital Edition</span>
            </div>
          </div>

          {/* Key Features Bullet List */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              {lang === 'EN' ? 'Key Learning Highlights' : 'এই বইটির বিশেষত্বসমূহ'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Breakdown Accordion */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-16">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          {lang === 'EN' ? 'Complete Chapter Outline' : 'বইয়ের সূচিপত্র ও অধ্যায়সমূহ'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Detailed curriculum engineered specifically for Bengali native speakers to acquire natural Mandarin.
        </p>

        <div className="space-y-3">
          {product.chapters.map((ch, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-red-500/50 transition group"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-red-100 dark:bg-red-950 text-[#C1121F] font-mono font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-red-500 transition">
                  {ch}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                Included in Full PDF
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-16 mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {lang === 'EN' ? 'Verified Student Reviews' : 'শিক্ষার্থীদের মতামত ও রিভিউ'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Read how fellow Bangladeshi students achieved HSK success with this guide.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-4 py-2 rounded-2xl">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-lg font-black text-slate-900 dark:text-white">{product.rating}</span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
        </div>

        {/* Review Submission Box (for logged in students) */}
        {user ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-8">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              {lang === 'EN' ? 'Share Your Experience' : 'আপনার মতামত লিখুন'}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Your Rating:</span>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star 
                      className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={userReviewText}
                onChange={e => setUserReviewText(e.target.value)}
                placeholder={lang === 'EN' ? 'Write a review about this eBook...' : 'বইটি পড়ে আপনার অভিজ্ঞতা লিখুন...'}
                rows={3}
                required
                className="w-full p-4 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl text-xs focus:outline-none focus:border-red-500 text-slate-900 dark:text-white"
              />

              {reviewSuccess && (
                <p className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {reviewSuccess}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-2.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center mb-8">
            <Link to="/login" className="text-red-500 font-bold hover:underline">Log in</Link> to write a review.
          </div>
        )}

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No reviews yet for this eBook. Be the first to review!</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-[#C1121F] font-black text-xs flex items-center justify-center">
                      {r.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{r.userName}</p>
                      <p className="text-[10px] text-slate-400">Verified Reader</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(r.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                  "{r.review}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <PdfPreviewModal
        product={product}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        lang={lang}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <PdfCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        onClear={() => { setCart([]); localStorage.removeItem('mandarinshelf_cart'); }}
        lang={lang}
        user={user}
      />
    </div>
  );
};

export default PdfDetailPage;
