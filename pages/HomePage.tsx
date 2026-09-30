import React, { useState, useEffect } from "react";
import { motion as m, AnimatePresence } from "framer-motion";
const motion = m as any;
import {
  ArrowRight,
  Star,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Book,
  Zap,
  Eye,
  BookOpen,
  Layers,
  ShoppingBag,
  Download,
  Tag,
  Check,
  TrendingUp,
} from "lucide-react";
import { Language, PdfProduct } from "../types";
import { TESTIMONIALS } from "../constants";
import { Link } from "react-router-dom";
import { pdfService, DEMO_PDF_PRODUCTS } from "../services/pdfService";
import PdfPreviewModal from "../components/PdfPreviewModal";
import PriceDisplay from "../components/PriceDisplay";
import { CurrencyType, getStoredCurrency, formatBdtPrice, formatUsdPrice } from "../services/currencyService";

interface Props {
  lang: Language;
}

const HomePage: React.FC<Props> = ({ lang }) => {
  const [currency, setCurrency] = useState<CurrencyType>(getStoredCurrency());

  useEffect(() => {
    const handleCurrencyChange = (e: Event) => {
      const custom = e as CustomEvent<CurrencyType>;
      if (custom.detail) setCurrency(custom.detail);
    };
    window.addEventListener('currency_change', handleCurrencyChange);
    return () => window.removeEventListener('currency_change', handleCurrencyChange);
  }, []);
  // Pure Book Selling Hero Slides (No personal instructor portrait images)
  const heroSlides = [
    {
      id: 1,
      title:
        lang === "BN" ? (
          <>
            বাংলা মাধ্যমে <span className="text-[#C1121F]">চাইনিজ শেখার</span> সেরা ই-বুক
          </>
        ) : (
          <>
            Master <span className="text-[#C1121F]">Chinese</span> With Better eBooks
          </>
        ),
      description:
        lang === "BN"
          ? "পিনয়িন, টোন, বাংলা অর্থ ও ব্যাকরণসহ HSK ১ থেকে ৬ এর পূর্ণাঙ্গ ডিজিটাল বুকসেলফ। কেনার আগে যেকোনো বইয়ের ১–৩ পৃষ্ঠা ফ্রি প্রিভিউ পড়ুন।"
          : "Complete digital Chinese learning PDFs with Hanzi, Pinyin, Bengali transliterations, grammar rules, and 1–3 free sample preview pages.",
      image:
        "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1200",
      badge:
        lang === "BN"
          ? "ম্যান্ডারিনশেল্ফ ডিজিটাল বুকস্টোর"
          : "MandarinShelf Digital Bookstore",
      cta: lang === "BN" ? "বইসমূহ দেখুন" : "Browse eBooks",
      link: "/store",
      icon: <Book className="w-5 h-5" />,
      color: "#C1121F",
      priceTag: "৳ 499",
      subBadge: "HSK 1–4 Master Guide",
      slug: "hsk-1-4-complete-master-handbook"
    },
    {
      id: 2,
      title:
        lang === "BN" ? (
          <>
            ১৮০০+ প্রয়োজনীয় শব্দ ও <span className="text-[#C1121F]">বাস্তব বাক্য</span>
          </>
        ) : (
          <>
            1800+ Common Words & <span className="text-[#C1121F]">Daily Sentences</span>
          </>
        ),
      description:
        lang === "BN"
          ? "দৈনন্দিন ও বাণিজ্যিক যোগাযোগের জন্য সর্বাধিক ব্যবহৃত শব্দাবলী ক্যাটাগরি অনুযায়ী সাজানো, সহজ বাংলা উচ্চারণ ও বাস্তব উদাহরণসহ।"
          : "Most practical vocabulary and daily conversation patterns categorized with Bengali pronunciation and real-life examples.",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200",
      badge:
        lang === "BN"
          ? "টপ সেলিং ভোকাবুলারি ই-বুক"
          : "Top Selling Vocabulary eBook",
      cta: lang === "BN" ? "স্যাম্পল প্রিভিউ পড়ুন" : "Read Free Sample",
      link: "/pdf/1800-most-common-chinese-words",
      icon: <Eye className="w-5 h-5" />,
      color: "#b91c1c",
      priceTag: "৳ 350",
      subBadge: "1800+ Words Guide",
      slug: "1800-most-common-chinese-words"
    },
    {
      id: 3,
      title:
        lang === "BN" ? (
          <>
            আল্টিমেট ৪-ইন-১ <span className="text-amber-500">মেগা লাইব্রেরি বান্ডেল</span>
          </>
        ) : (
          <>
            Ultimate 4-in-1 <span className="text-amber-500">Digital Library Bundle</span>
          </>
        ),
      description:
        lang === "BN"
          ? "মাস্টার হ্যান্ডবুক, ভোকাবুলারি, ব্যাকরণ ও স্পোকেন বুক — চারটি পূর্ণাঙ্গ ই-বুক এক সাথে ৫৭% মেগা ডিসকাউন্টে সংগ্রহ করুন।"
          : "Get 4 complete Chinese master eBooks (Handbooks, Vocab, Grammar, Spoken) in one ultimate discounted combo digital bundle.",
      image:
        "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=1200",
      badge:
        lang === "BN"
          ? "৫৭% মেগা ডিসকাউন্ট অফার"
          : "57% Mega Discount Offer",
      cta: lang === "BN" ? "মেগা বান্ডেল কিনুন" : "Get Mega Bundle",
      link: "/pdf/ultimate-chinese-digital-library-bundle",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "#d97706",
      priceTag: "৳ 1,199",
      subBadge: "Save ৳ 1,600",
      slug: "ultimate-chinese-digital-library-bundle"
    },
    {
      id: 4,
      title:
        lang === "BN" ? (
          <>
            চীন-বাংলাদেশ বাণিজ্য ও <span className="text-[#C1121F]">ফ্যাক্টরি গাইড</span>
          </>
        ) : (
          <>
            Business Chinese & <span className="text-[#C1121F]">Factory Trade Guide</span>
          </>
        ),
      description:
        lang === "BN"
          ? "চীনা সাপ্লায়ারদের সাথে যোগাযোগ, দামাদামি, স্যাম্পল অর্ডার, ফ্যাক্টরি ভিজিট ও উইচ্যাট বিজনেসের প্রফেশনাল হ্যান্ডবুক।"
          : "Professional trade communication, price bargaining, WeChat business templates, and factory inspection terms.",
      image:
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200",
      badge:
        lang === "BN"
          ? "বাণিজ্যিক ও প্র্যাকটিক্যাল গাইড"
          : "Business & Factory Guide",
      cta: lang === "BN" ? "বইটি অর্ডার করুন" : "Order Business eBook",
      link: "/pdf/business-chinese-factory-communication-guide",
      icon: <BookOpen className="w-5 h-5" />,
      color: "#991b1b",
      priceTag: "৳ 550",
      subBadge: "Trade & Factory",
      slug: "business-chinese-factory-communication-guide"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // MandarinShelf PDF Products & Preview Modal State
  const [pdfProducts, setPdfProducts] = useState<PdfProduct[]>(() => {
    try {
      const saved = localStorage.getItem('mandarinshelf_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Local storage read error", e);
    }
    return DEMO_PDF_PRODUCTS;
  });
  const [previewModalBook, setPreviewModalBook] = useState<PdfProduct | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await pdfService.getPdfProducts();
        setPdfProducts(prods);
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleOpenPreviewModal = (book: PdfProduct) => {
    setPreviewModalBook(book);
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="overflow-x-hidden bg-white dark:bg-zinc-950 transition-colors">
      {/* ========================================== */}
      {/* HERO SECTION: PURE EBOOK STORE SLIDES */}
      {/* ========================================== */}
      <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center py-16 sm:py-20 px-6 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
        {/* Subtle Watermark Character Animation */}
        <div className="absolute left-[35%] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none z-0">
          <motion.span
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-[40rem] chinese-font font-black leading-none text-white"
          >
            书
          </motion.span>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-950/80 text-red-400 text-xs font-black mb-8 border border-red-800 shadow-sm uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{heroSlides[currentSlide].badge}</span>
                </motion.div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-white">
                  {heroSlides[currentSlide].title}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed font-medium">
                  {heroSlides[currentSlide].description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                  <Link
                    to={heroSlides[currentSlide].link}
                    className="px-10 py-5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-red-600/30"
                  >
                    {heroSlides[currentSlide].icon}
                    <span>{heroSlides[currentSlide].cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/store"
                    className="px-10 py-5 bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-750 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <BookOpen className="w-4 h-4 text-red-400" />
                    <span>{lang === "BN" ? "সকল ই-বুক দেখুন" : "View All eBooks"}</span>
                  </Link>
                </div>

                {/* Rating & Guarantee Bar */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-800 w-full justify-center lg:justify-start">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-200 ml-1">4.9 / 5.0</span>
                  </div>
                  <span className="text-xs text-slate-400">|</span>
                  <div className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>1,200+ Students Reading</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right: Pure 3D Book Showcase Slide (No Instructor Portrait) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative flex items-center justify-center"
            >
              {/* Glow Accent */}
              <div className="absolute -inset-4 bg-gradient-to-r from-red-600/25 to-amber-600/25 rounded-[3rem] blur-3xl opacity-60 pointer-events-none" />

              {/* 3D Book Cover Frame */}
              <div className="relative aspect-[3/4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-950 flex flex-col justify-between group">
                <img
                  src={heroSlides[currentSlide].image}
                  alt="Book cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Book Spine Shadow Effect */}
                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

                {/* Slide Floating Pill */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-[#C1121F] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                    {heroSlides[currentSlide].subBadge}
                  </span>
                  <span className="px-3 py-1 bg-slate-900/90 text-amber-300 text-[10px] font-mono font-bold rounded-full border border-slate-700 shadow-md">
                    {heroSlides[currentSlide].priceTag}
                  </span>
                </div>

                {/* Clickable Preview Action on Cover */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-red-400 tracking-wider">MandarinShelf Edition</p>
                    <p className="text-sm font-bold text-white">Full Bengali Explanations</p>
                  </div>
                  <Link
                    to={heroSlides[currentSlide].link}
                    className="p-3 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl shadow-lg transition"
                    title="View Book"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Slider Controls: Dots Indicator & Arrows */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-[#C1121F] text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 shadow-md active:scale-90"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentSlide === idx ? "w-8 bg-[#C1121F]" : "w-2 bg-slate-700 hover:bg-slate-500"
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-[#C1121F] text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 shadow-md active:scale-90"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* BOOKSTORE STATS GRID */}
      {/* ========================================== */}
      <section className="py-16 px-6 bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                label: lang === "BN" ? "প্রিমিয়াম ই-বুক" : "Core Chinese eBooks",
                value: "8+",
                icon: BookOpen,
              },
              {
                label: lang === "BN" ? "সন্তুষ্ট পাঠক" : "Active Readers",
                value: "1,200+",
                icon: ShieldCheck,
              },
              {
                label: lang === "BN" ? "HSK কভারেজ" : "HSK Curriculum",
                value: "HSK 1-6",
                icon: Award,
              },
              {
                label: lang === "BN" ? "ইন্সট্যান্ট এক্সেস" : "Cloud Delivery",
                value: "100%",
                icon: Zap,
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900/60 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all group"
              >
                <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-[#C1121F] mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 1. FEATURED CHINESE PDFS (BOOK SELLING MAIN) */}
      {/* ========================================== */}
      <section className="py-20 px-6 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#C1121F_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-black uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Chinese Bookshelf
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Featured Chinese <span className="text-[#C1121F]">PDFs</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-2 font-medium">
                Your Digital Shelf for Learning Chinese. Browse premium eBooks with instant 1–3 sample pages preview before purchasing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/store"
                className="px-6 py-3.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-600/30 transition active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse PDF Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Book Cards Grid (8 Core eBooks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pdfProducts.slice(0, 8).map((book, idx) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-950/90 rounded-3xl border border-slate-800 hover:border-red-500/60 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                {/* 3D Cover */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-900 cursor-pointer">
                  <Link to={`/pdf/${book.slug}`}>
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                  </Link>

                  {/* Spine Shadow */}
                  <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />

                  {/* Badges */}
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

                  {/* Preview Trigger Button */}
                  <button
                    onClick={() => handleOpenPreviewModal(book)}
                    className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-[#C1121F] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-lg backdrop-blur-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    <span>Quick Preview</span>
                  </button>
                </div>

                {/* Info & Price */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                      <span className="text-red-400">{book.category}</span>
                      <span>{book.pages} Pages</span>
                    </div>

                    <Link to={`/pdf/${book.slug}`}>
                      <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-medium">
                      {book.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-start justify-between">
                      <PriceDisplay 
                        amountInBdt={book.price} 
                        originalAmountInBdt={book.originalPrice}
                        preferredCurrency={currency}
                        showDual={true}
                        showBdBadge={true}
                        size="md"
                        theme="dark"
                      />
                      <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{book.rating}</span>
                      </div>
                    </div>

                    {/* Dedicated Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreviewModal(book)}
                      className="w-full py-2 px-3 bg-red-950/40 hover:bg-[#C1121F] text-red-400 hover:text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border border-red-900/60 hover:border-red-500 transition-all shadow-sm active:scale-95 group/prev"
                    >
                      <Eye className="w-3.5 h-3.5 text-red-400 group-hover/prev:text-white" />
                      <span>Quick Preview (Sample Pages)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/pdf/${book.slug}`}
                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition border border-slate-700"
                      >
                        Details
                      </Link>
                      <Link
                        to="/pdf-checkout"
                        state={{ product: book }}
                        className="py-2.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-red-600/20 transition active:scale-95"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        <span>Buy Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 2. BOOK SELLING CATEGORIES & SHELVES */}
      {/* ========================================== */}
      <section className="py-20 px-6 bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-950/50 px-2.5 py-0.5 rounded-full border border-red-900">
                Book Catalog Categories
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 text-white">
                Find Your Perfect Learning Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                From foundational HSK exams to fluent spoken Chinese and factory trade negotiations.
              </p>
            </div>
            <Link to="/store" className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 uppercase tracking-wider">
              <span>Explore All Shelves</span> <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'HSK PDFs', icon: Award, desc: 'HSK 1, 2, 3, 4 & 5 Handbooks', tag: 'Core Syllabus' },
              { name: 'Vocabulary', icon: BookOpen, desc: '1800+ Most Common Words', tag: 'Essential' },
              { name: 'Grammar', icon: Layers, desc: 'Sentence Structures & Particles', tag: 'Simplified' },
              { name: 'Speaking', icon: MessageSquare, desc: 'Tones, Pronunciation & Fluency', tag: 'High Practicality' },
              { name: 'Conversation', icon: Globe, desc: 'Factory Tour & Trade Deals', tag: 'Business' },
              { name: 'Reading', icon: Book, desc: 'Hanzi Radicals & Stroke Orders', tag: 'Handwriting' },
              { name: 'Bundles', icon: ShoppingBag, desc: 'Ultimate 4-in-1 Combo Pack', tag: '57% Savings' },
              { name: 'Chinese-Bangla', icon: Download, desc: 'Free Starter Guide & Tone Sheet', tag: '100% Free' }
            ].map(cat => (
              <Link
                key={cat.name}
                to="/store"
                className="p-5 bg-slate-950 rounded-3xl border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 transition text-left group flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-400 flex items-center justify-center group-hover:scale-110 transition border border-red-900/40">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                    {cat.tag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-red-400 transition">{cat.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. SPECIAL DIGITAL BUNDLE SPOTLIGHT */}
      {/* ========================================== */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-950 via-slate-950 to-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-800">
              Save 57% • Mega Combo Deal
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ultimate 4-in-1 Chinese Digital Library Bundle
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Get all 4 master eBooks — HSK 1–4 Master Handbook, 1800+ Words, Grammar Blueprint, and Spoken Chinese — with 57% savings. Unlock the complete digital Chinese syllabus in a single instant order.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>HSK 1–4 Master</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>1800+ Words</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Grammar Rules</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Spoken Chinese</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
              <PriceDisplay 
                amountInBdt={1199}
                originalAmountInBdt={2800}
                preferredCurrency={currency}
                showDual={true}
                showBdBadge={true}
                size="xl"
                theme="dark"
              />

              <Link
                to="/pdf/ultimate-chinese-digital-library-bundle"
                className="w-full sm:w-auto px-8 py-4 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl shadow-red-600/30 transition transform active:scale-95"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Claim Bundle Offer</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative aspect-[3/4] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-950 group">
              <img
                src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800"
                alt="Ultimate Chinese Bundle"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full shadow-lg">
                57% OFF BUNDLE
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-slate-950 to-transparent">
                <p className="text-xs font-black uppercase text-red-400">1050+ Pages • Complete Shelf</p>
                <p className="text-base font-bold text-white">Instant Unlock in My Books</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 5. WHY LEARN WITH MANDARINSHELF DIGITAL PDFS */}
      {/* ========================================== */}
      <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-black uppercase text-[#C1121F] tracking-widest bg-red-100 dark:bg-red-950/60 px-4 py-1.5 rounded-full border border-red-200 dark:border-red-900">
              Transformative Language Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white mt-4 mb-3 tracking-tight">
              Why Learn Chinese with MandarinShelf PDFs?
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Crafted specifically for learners with Hanzi, Pinyin, English translations, radical breakdowns, and real-world speaking hacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Hanzi Radicals & Visual Mnemonics",
                chinese: "汉字解构 • Character Logic",
                desc: "Never memorize characters blindly. Uncover the fascinating visual logic behind 214 radicals — discover why 木 (tree) builds 林 (woods) and 森 (forest). Decode intricate Hanzi characters with intuitive pictographic memory keys.",
                badge: "Visual Memory"
              },
              {
                icon: Sparkles,
                title: "Tone Precision & Pitch Contour",
                chinese: "声调突破 • 4 Tones Mastered",
                desc: "Eliminate pronunciation anxiety. Master the 4 core tones and neutral tone transitions so you never confuse 妈 (mā - mother) with 马 (mǎ - horse). Includes pitch charts, tongue placement diagrams, and natural tone-pair rhythm formulas.",
                badge: "Accurate Accent"
              },
              {
                icon: Eye,
                title: "Interactive 1–3 Page Sample Reader",
                chinese: "即时预览 • Instant Peek",
                desc: "Explore typography, color-coded pinyin, grammar callout boxes, and stroke orders inside our interactive web viewer before purchasing. Experience full transparency and zero guesswork with verified sample chapters.",
                badge: "Try Before Buy"
              },
              {
                icon: Layers,
                title: "HSK 1–6 Standardized Blueprints",
                chinese: "官方标准 • Exam Mastery",
                desc: "Engineered around official Hanban test criteria. Includes high-frequency trap questions, vital connector particles, reading speed formulas, and stroke-order guidelines to help you target 280+ scores with absolute confidence.",
                badge: "100% Exam Ready"
              },
              {
                icon: TrendingUp,
                title: "1,800+ High-Yield Scenarios & Slang",
                chinese: "实用口语 • Conversational Fluency",
                desc: "Skip archaic textbook phrases. Learn the top 20% high-frequency vocabulary that powers 80% of everyday life in China — from ordering authentic spicy Sichuan hotpot to chatting casually on WeChat and shopping effortlessly.",
                badge: "Active Fluency"
              },
              {
                icon: ShieldCheck,
                title: "Trade, Factory & Business Chinese",
                chinese: "商务谈判 • Deal Closer",
                desc: "Actionable factory inspection checklists, price bargaining dialogues, payment terms (FOB/CIF), and essential Chinese business banquet etiquette (酒桌文化) to build deep trust with Chinese suppliers and global partners.",
                badge: "Career Advantage"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#C1121F] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#C1121F] group-hover:text-white transition-all shadow-sm">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C1121F] dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider block">
                      {feature.chinese}
                    </span>
                    <h3 className="text-xl font-black text-zinc-900 dark:text-white group-hover:text-[#C1121F] transition-colors">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <Link
                    to="/store"
                    className="text-xs font-bold text-[#C1121F] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Browse eBook Shelves</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 6. READER REVIEWS & BOOK TESTIMONIALS */}
      {/* ========================================== */}
      <section className="py-20 bg-white dark:bg-zinc-950 overflow-hidden border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#C1121F] bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full">
            Student Feedback
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-2 tracking-tight text-zinc-900 dark:text-white">
            {lang === "BN" ? "পাঠক ও শিক্ষার্থীদের বিশ্বস্ত" : "Trusted by 1,000+ Readers"}
          </h2>
          <div className="flex justify-center gap-1.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="fill-current w-4 h-4" />
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex">
            <motion.div
              className="flex gap-6 py-6"
              animate={{ x: [0, -1600] }}
              transition={{ duration: 35, ease: "linear", repeat: Infinity }}
              style={{ width: "fit-content" }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="w-[340px] md:w-[420px] shrink-0 bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-md relative overflow-hidden group hover:border-[#C1121F] transition-colors"
                >
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="fill-current w-3.5 h-3.5" />
                    ))}
                  </div>

                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed min-h-[90px] font-serif">
                    "{testimonial.content[lang]}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <img
                      src={testimonial.avatar}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                      alt=""
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 7. FINAL BOOKSTORE CALL TO ACTION */}
      {/* ========================================== */}
      <section className="py-20 px-6 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#780000] rounded-[3.5rem] p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 px-4 py-1.5 rounded-full border border-amber-800">
                Start Learning Mandarin Today
              </span>
              <h2 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight">
                {lang === "BN" ? "আপনার চাইনিজ শেখা শুরু হোক সেরা বই দিয়ে" : "Build Your Personal Chinese Bookshelf"}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl mx-auto">
                {lang === "BN"
                  ? "এখনই MandarinShelf ঘুরে দেখুন, পছন্দমতো বইয়ের স্যাম্পল পাতা পড়ে নিশ্চিন্তে অর্ডার করুন।"
                  : "Explore MandarinShelf digital bookstore now, read 1–3 sample preview pages, and instantly download your eBooks."}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  to="/store"
                  className="w-full sm:w-auto px-10 py-5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{lang === "BN" ? "পিডিএফ স্টোরে যান" : "Explore PDF Store"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/pdf/ultimate-chinese-digital-library-bundle"
                  className="w-full sm:w-auto px-10 py-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl transition active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>{lang === "BN" ? "মেগা বান্ডেল অফার (৫৭% ছাড়)" : "Claim Mega Bundle (57% Off)"}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 1-3 Sample Pages Preview Modal */}
      <PdfPreviewModal
        product={previewModalBook}
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};

export default HomePage;
