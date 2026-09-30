import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Star, Eye, ShieldCheck, Search, Filter, 
  BookOpen, Sparkles, Download, Zap, Check, ArrowRight, Tag, Layers,
  Award, Briefcase, MessageSquare, Book, X, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';
import { Language, PdfProduct, PdfCategory, HskLevel } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { pdfService, DEMO_PDF_PRODUCTS } from '../services/pdfService';
import PdfPreviewModal from '../components/PdfPreviewModal';
import PdfCartDrawer from '../components/PdfCartDrawer';
import PriceDisplay from '../components/PriceDisplay';
import { CurrencyType, getStoredCurrency } from '../services/currencyService';

interface Props { 
  lang: Language; 
}

export type StoreCategoryFilter = 
  | 'All'
  | 'Beginners'
  | 'HSK Exam Levels'
  | 'Business Chinese'
  | 'Grammar & Sentences'
  | 'Vocabulary'
  | 'Speaking & Tones'
  | 'Value Bundles'
  | 'Free Downloads';

const CATEGORY_TABS: { id: StoreCategoryFilter; label: string; icon: any; desc: string }[] = [
  { id: 'All', label: 'All Books', icon: BookOpen, desc: 'Complete Digital Chinese Library' },
  { id: 'Beginners', label: 'Beginners & Pinyin', icon: Sparkles, desc: 'HSK 1-2, Pinyin & Stroke Radicals' },
  { id: 'HSK Exam Levels', label: 'HSK Exam Levels', icon: Award, desc: 'HSK 1 to 6 Standard Blueprints' },
  { id: 'Business Chinese', label: 'Business & Trade', icon: Briefcase, desc: 'Factory Tour, Negotiation & Deals' },
  { id: 'Grammar & Sentences', label: 'Grammar & Syntax', icon: Layers, desc: 'Particles, SVO & Sentence Rules' },
  { id: 'Vocabulary', label: 'Vocabulary & Words', icon: Book, desc: '1,800+ High-Frequency Words' },
  { id: 'Speaking & Tones', label: 'Speaking & Tones', icon: MessageSquare, desc: '4 Tones & Conversational Fluency' },
  { id: 'Value Bundles', label: 'Value Bundles', icon: Tag, desc: 'Combo Packs with 57% Savings' },
  { id: 'Free Downloads', label: 'Free Resources', icon: Download, desc: 'Free Starter PDFs & Cheat Sheets' },
];

const HSK_SUB_LEVELS: ('All' | HskLevel)[] = [
  'All',
  'HSK 1',
  'HSK 2',
  'HSK 3',
  'HSK 4',
  'HSK 5',
  'HSK 6'
];

const StorePage: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<PdfProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mandarinshelf_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEMO_PDF_PRODUCTS;
  });

  const [cart, setCart] = useState<PdfProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategoryFilter>('All');
  const [selectedHsk, setSelectedHsk] = useState<'All' | HskLevel>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'priceAsc' | 'priceDesc' | 'pages'>('popular');

  // Modals
  const [previewProduct, setPreviewProduct] = useState<PdfProduct | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyType>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<CurrencyType>;
      if (custom.detail) setCurrency(custom.detail);
    };
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const all = await pdfService.getPdfProducts();
        if (all && all.length > 0) {
          setProducts(all);
        }
      } catch (err) {
        console.error('Error fetching store products:', err);
      }
    };

    const loadCart = () => {
      const saved = localStorage.getItem('mandarinshelf_cart');
      if (saved) {
        try { setCart(JSON.parse(saved)); } catch {}
      }
    };

    loadProducts();
    loadCart();
  }, []);

  const handleAddToCart = (product: PdfProduct) => {
    let newCart = [...cart];
    if (!newCart.some(p => p.id === product.id)) {
      newCart.push(product);
      setCart(newCart);
      localStorage.setItem('mandarinshelf_cart', JSON.stringify(newCart));
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    const newCart = cart.filter(p => p.id !== id);
    setCart(newCart);
    localStorage.setItem('mandarinshelf_cart', JSON.stringify(newCart));
  };

  const handleOpenPreview = (product: PdfProduct) => {
    setPreviewProduct(product);
    setIsPreviewOpen(true);
  };

  // Check if a book matches a category
  const matchesCategory = (item: PdfProduct, cat: StoreCategoryFilter): boolean => {
    if (cat === 'All') return true;

    if (cat === 'Beginners') {
      const isHsk12 = item.hskLevel === 'HSK 1' || item.hskLevel === 'HSK 2';
      const hasBeginnerKeyword = item.keywords.some(k => 
        ['pinyin', 'beginner', 'radicals', 'stroke', 'handbook', 'reading', 'starter'].some(w => k.toLowerCase().includes(w))
      );
      const titleMatches = /hsk 1|hsk 2|pinyin|radical|stroke|beginner/i.test(item.title);
      return isHsk12 || hasBeginnerKeyword || titleMatches;
    }

    if (cat === 'HSK Exam Levels') {
      return item.category === 'HSK PDFs' || item.hskLevel.startsWith('HSK') || item.keywords.some(k => k.toLowerCase().includes('hsk'));
    }

    if (cat === 'Business Chinese') {
      const isBusinessCat = item.category === 'Conversation';
      const hasBusinessKeyword = item.keywords.some(k => 
        ['business', 'trade', 'factory', 'negotiation', 'merchandiser', 'commercial'].some(w => k.toLowerCase().includes(w))
      );
      const titleMatches = /business|factory|trade|negotiation/i.test(item.title);
      return isBusinessCat || hasBusinessKeyword || titleMatches;
    }

    if (cat === 'Grammar & Sentences') {
      return item.category === 'Grammar' || item.keywords.some(k => k.toLowerCase().includes('grammar')) || /grammar|structure|sentence/i.test(item.title);
    }

    if (cat === 'Vocabulary') {
      return item.category === 'Vocabulary' || item.keywords.some(k => k.toLowerCase().includes('vocabulary') || k.toLowerCase().includes('words')) || /word|vocab/i.test(item.title);
    }

    if (cat === 'Speaking & Tones') {
      return item.category === 'Speaking' || item.keywords.some(k => k.toLowerCase().includes('speaking') || k.toLowerCase().includes('tones') || k.toLowerCase().includes('pronunciation')) || /spoken|speaking|pronunciation|tone/i.test(item.title);
    }

    if (cat === 'Value Bundles') {
      return item.isBundle === true || item.category === 'Bundles' || /bundle|library/i.test(item.title);
    }

    if (cat === 'Free Downloads') {
      return item.isFree === true || item.price === 0 || item.category === 'Chinese-Bangla';
    }

    return true;
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<StoreCategoryFilter, number> = {
      'All': 0,
      'Beginners': 0,
      'HSK Exam Levels': 0,
      'Business Chinese': 0,
      'Grammar & Sentences': 0,
      'Vocabulary': 0,
      'Speaking & Tones': 0,
      'Value Bundles': 0,
      'Free Downloads': 0,
    };

    products.filter(p => p.published).forEach(item => {
      CATEGORY_TABS.forEach(tab => {
        if (matchesCategory(item, tab.id)) {
          counts[tab.id] = (counts[tab.id] || 0) + 1;
        }
      });
    });

    return counts;
  }, [products]);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      if (!item.published) return false;

      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchShortDesc = item.shortDescription.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchHsk = item.hskLevel.toLowerCase().includes(q);
        const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchShortDesc && !matchCat && !matchHsk && !matchKeywords) {
          return false;
        }
      }

      // Category filter
      if (!matchesCategory(item, selectedCategory)) {
        return false;
      }

      // HSK Level filter
      if (selectedHsk !== 'All') {
        const matchesDirectHsk = item.hskLevel === selectedHsk;
        const matchesKeywordHsk = item.keywords.some(k => k.toLowerCase() === selectedHsk.toLowerCase());
        const isBundleOrAll = item.hskLevel === 'All Levels';
        if (!matchesDirectHsk && !matchesKeywordHsk && !isBundleOrAll) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return (b.salesCount || 0) - (a.salesCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'pages') return (b.pages || 0) - (a.pages || 0);
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedHsk, sortBy]);

  const freeResources = products.filter(p => p.isFree && p.published);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedHsk('All');
    setSortBy('popular');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'All' || selectedHsk !== 'All';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* MandarinShelf Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            MandarinShelf • Digital Bookstore
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
            Learn Chinese With <span className="text-[#C1121F]">Better Books.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Premium Chinese-learning PDFs with Hanzi, Pinyin, English translations, radical breakdowns, and practical examples.
          </p>

          {/* Search Box Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center shadow-2xl rounded-2xl bg-slate-800/90 border border-slate-700 p-2">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by HSK level, grammar, vocabulary, topic..."
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick search tags */}
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Popular Searches:</span>
              {['HSK 1', 'HSK 4', 'Pinyin', 'Business Chinese', 'Grammar', 'Speaking', 'Bundles'].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    if (tag === 'Business Chinese') {
                      setSelectedCategory('Business Chinese');
                    } else if (tag === 'Grammar') {
                      setSelectedCategory('Grammar & Sentences');
                    } else if (tag === 'Speaking') {
                      setSelectedCategory('Speaking & Tones');
                    } else if (tag === 'Bundles') {
                      setSelectedCategory('Value Bundles');
                    } else {
                      setSearchQuery(tag);
                    }
                  }}
                  className="hover:text-red-400 underline decoration-slate-700 hover:decoration-red-400 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Store Viewport */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Category Showcase Tiles (4 Core Pillars) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            {
              id: 'Beginners' as StoreCategoryFilter,
              title: 'Beginners & Pinyin',
              subtitle: 'HSK 1–2 & Hanzi Radicals',
              icon: Sparkles,
              count: categoryCounts['Beginners'],
              color: 'from-amber-500/20 to-red-500/10 border-amber-500/30 text-amber-500'
            },
            {
              id: 'HSK Exam Levels' as StoreCategoryFilter,
              title: 'HSK Exam Levels',
              subtitle: 'HSK 1–6 Standard Handbooks',
              icon: Award,
              count: categoryCounts['HSK Exam Levels'],
              color: 'from-red-500/20 to-pink-500/10 border-red-500/30 text-red-500'
            },
            {
              id: 'Business Chinese' as StoreCategoryFilter,
              title: 'Business & Trade',
              subtitle: 'Factory & Negotiation Guide',
              icon: Briefcase,
              count: categoryCounts['Business Chinese'],
              color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-500'
            },
            {
              id: 'Value Bundles' as StoreCategoryFilter,
              title: 'Value Bundles',
              subtitle: 'Mega Combo with 57% OFF',
              icon: Tag,
              count: categoryCounts['Value Bundles'],
              color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500'
            }
          ].map((card) => {
            const isActive = selectedCategory === card.id;
            return (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedCategory(isActive ? 'All' : card.id);
                  setSelectedHsk('All');
                }}
                className={`p-5 rounded-3xl text-left border transition-all relative overflow-hidden group shadow-sm ${
                  isActive
                    ? 'bg-red-500/10 dark:bg-red-950/40 border-[#C1121F] ring-2 ring-[#C1121F]/30 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {card.count} Books
                  </span>
                </div>
                <h3 className={`font-black text-sm transition-colors ${isActive ? 'text-[#C1121F]' : 'text-slate-900 dark:text-white group-hover:text-[#C1121F]'}`}>
                  {card.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium line-clamp-1">
                  {card.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Floating Header Bar: Title, Count, Sort, Cart */}
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedCategory === 'All' ? 'All Digital eBooks' : selectedCategory}
              </h2>
              <span className="bg-red-100 dark:bg-red-950/60 text-[#C1121F] dark:text-red-400 text-xs font-black px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                {filteredProducts.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instant digital PDF downloads with Hanzi, Pinyin & 1–3 free preview sample pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="pl-8 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#C1121F] shadow-sm appearance-none cursor-pointer"
              >
                <option value="popular">🔥 Most Popular (Best Sellers)</option>
                <option value="rating">⭐ Highest Rated (Reviews)</option>
                <option value="newest">✨ Newest Releases</option>
                <option value="priceAsc">💲 Price: Low to High</option>
                <option value="priceDesc">💎 Price: High to Low</option>
                <option value="pages">📄 Page Count (Longest)</option>
              </select>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#C1121F] text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <ShoppingCart className="w-4 h-4 text-[#C1121F]" />
              <span className="hidden sm:inline">Cart</span>
              {cart.length > 0 && (
                <span className="bg-[#C1121F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Category Tabs Filter */}
        <div className="space-y-4 mb-8">
          {/* Main Category Filter Horizontal Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map(tab => {
              const isSelected = selectedCategory === tab.id;
              const count = categoryCounts[tab.id];
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedCategory(tab.id);
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#C1121F] text-white border-[#C1121F] shadow-lg shadow-red-600/25 scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#C1121F]'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* HSK Level Sub-Filter Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs bg-slate-100/80 dark:bg-slate-900/60 p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#C1121F]" />
              HSK Level:
            </span>
            {HSK_SUB_LEVELS.map(lvl => {
              const isSelected = selectedHsk === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedHsk(lvl)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                  }`}
                >
                  {lvl === 'All' ? 'All HSK Levels' : lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Chips & Reset Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-8 p-3 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Active Filters:</span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')} className="text-slate-400 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedHsk !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                Level: {selectedHsk}
                <button onClick={() => setSelectedHsk('All')} className="text-slate-400 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-red-500">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            <button
              onClick={resetAllFilters}
              className="text-xs font-bold text-[#C1121F] hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Bookshelf Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">No books match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Try clearing search terms or changing category selection.</p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-2xl hover:border-red-500/40 transition-all flex flex-col overflow-hidden group"
              >
                {/* Book Cover Container with 3D spine shadow */}
                <div className="relative aspect-[3/4] bg-slate-950 overflow-hidden cursor-pointer">
                  <Link to={`/pdf/${book.slug}`} className="block w-full h-full">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </Link>

                  {/* Spine Shadow Effect */}
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                  {/* Level & Discount Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#C1121F] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                      {book.hskLevel}
                    </span>
                    {book.discount && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                        {book.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Center Hover Quick Preview Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenPreview(book);
                      }}
                      className="pointer-events-auto px-4 py-2.5 bg-[#C1121F] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-2xl transition transform scale-90 group-hover:scale-100 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Quick Preview</span>
                    </button>
                  </div>

                  {/* Corner Quick Preview Badge */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenPreview(book);
                    }}
                    className="absolute bottom-3 right-3 bg-slate-950/90 hover:bg-[#C1121F] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl border border-slate-700/80 hover:border-red-500 flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all active:scale-95 group/covbtn z-20"
                  >
                    <Eye className="w-3.5 h-3.5 text-red-400 group-hover/covbtn:text-white" />
                    <span>Quick Preview</span>
                  </button>
                </div>

                {/* Book Meta & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-bold text-red-500">{book.category}</span>
                      <span>{book.pages} Pages</span>
                    </div>

                    <Link to={`/pdf/${book.slug}`}>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 hover:text-red-500 transition leading-snug">
                        {book.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 font-medium leading-relaxed">
                      {book.shortDescription}
                    </p>
                  </div>

                  {/* Rating & Sales */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{book.rating}</span>
                      <span className="text-[10px] text-slate-400">({book.reviewCount})</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {book.salesCount}+ Sold
                    </span>
                  </div>

                  {/* Pricing & Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start justify-between">
                      <PriceDisplay 
                        amountInBdt={book.price} 
                        originalAmountInBdt={book.originalPrice}
                        preferredCurrency={currency}
                        showDual={true}
                        showBdBadge={true}
                        size="md"
                      />
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Digital PDF
                      </span>
                    </div>

                    {/* Dedicated Quick Preview Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenPreview(book);
                      }}
                      className="w-full py-2.5 px-3 bg-slate-50 hover:bg-red-50 dark:bg-slate-800/80 dark:hover:bg-red-950/40 text-slate-700 hover:text-[#C1121F] dark:text-slate-200 dark:hover:text-red-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-200/90 dark:border-slate-700/80 hover:border-red-300 dark:hover:border-red-800 transition-all shadow-sm active:scale-[0.98] group/prevbtn"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C1121F] group-hover/prevbtn:scale-110 transition-transform" />
                      <span>Quick Preview</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => navigate('/pdf-checkout', { state: { product: book } })}
                        className="py-2.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-red-600/20 transition active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Buy Now</span>
                      </button>

                      <button
                        onClick={() => handleAddToCart(book)}
                        className="py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Free Resources Section */}
        {freeResources.length > 0 && selectedCategory === 'All' && (
          <section className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Free Chinese Resources & Cheat Sheets
                </h3>
                <p className="text-xs text-slate-500">
                  Instant free PDF downloads with no payment required.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freeResources.map(res => (
                <div 
                  key={res.id} 
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-5 items-center shadow-sm"
                >
                  <img 
                    src={res.coverImage} 
                    alt={res.title} 
                    className="w-24 h-32 object-cover rounded-2xl shadow-md shrink-0 bg-slate-950" 
                  />
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      100% Free Download
                    </span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                      {res.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {res.shortDescription}
                    </p>
                    <div className="pt-2 flex gap-3 justify-center sm:justify-start">
                      <button
                        onClick={() => handleOpenPreview(res)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#C1121F] hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C1121F]" />
                        <span>Quick Preview</span>
                      </button>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = res.downloadUrl || '#';
                          link.download = `${res.slug}.pdf`;
                          link.click();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Free</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Interactive 1-3 Page Preview Modal */}
      <PdfPreviewModal
        product={previewProduct}
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
      />
    </div>
  );
};

export default StorePage;
