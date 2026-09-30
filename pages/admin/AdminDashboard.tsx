import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Plus, LogOut, Edit3, Trash2, 
  Wallet, List, ShoppingBag, Book as BookIcon, Sparkles, FilePlus, Video, X, Save,
  CheckCircle, AlertCircle, RefreshCcw, Database, MessageSquare, Star, Image as ImageIcon,
  CheckCircle2, XCircle, Eye, ShieldCheck, DollarSign, Settings, BarChart3, TrendingUp, Layers, Check
} from 'lucide-react';
import { 
  Language, Course, Article, Enrollment, BookOrder, Book, QuizQuestion, 
  Lesson, Review, CarouselImage, PdfProduct, PdfOrder, PdfPaymentSettings, PdfCategory, HskLevel 
} from '../../types';
import { dataService } from '../../services/dataService';
import { pdfService } from '../../services/pdfService';

import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

interface Props { lang: Language; setUser: (user: any) => void; }

type Tab = 
  | 'overview' 
  | 'pdfOrders'
  | 'pdfProducts'
  | 'pdfPayments'
  | 'pdfAnalytics'
  | 'courses' 
  | 'lessons' 
  | 'enrollments' 
  | 'books' 
  | 'blog' 
  | 'quiz' 
  | 'reviews' 
  | 'carousel';

const AdminDashboard: React.FC<Props> = ({ lang, setUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pdfOrders');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Existing data
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [localLessons, setLocalLessons] = useState<Lesson[]>([]);
  const [localEnrollments, setLocalEnrollments] = useState<Enrollment[]>([]);
  const [localBookOrders, setLocalBookOrders] = useState<BookOrder[]>([]);
  const [localQuizQuestions, setLocalQuizQuestions] = useState<QuizQuestion[]>([]);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [localCarousel, setLocalCarousel] = useState<CarouselImage[]>([]);

  // MandarinShelf PDF Data
  const [localPdfOrders, setLocalPdfOrders] = useState<PdfOrder[]>([]);
  const [localPdfProducts, setLocalPdfProducts] = useState<PdfProduct[]>([]);
  const [pdfSettings, setPdfSettings] = useState<PdfPaymentSettings | null>(null);
  const [pdfAnalytics, setPdfAnalytics] = useState<any>(null);

  // Order Filtering & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Order Detail / Rejection Modal
  const [viewingOrder, setViewingOrder] = useState<PdfOrder | null>(null);
  const [rejectionModalOrder, setRejectionModalOrder] = useState<PdfOrder | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('huayu_user');
      setUser(null);
      window.location.href = '#/';
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        courses, articles, books, lessons, enrollments, orders, quiz, reviews, carousel,
        pdfOrdersData, pdfProds, pSettings, pAnalytics
      ] = await Promise.all([
        dataService.getCourses(),
        dataService.getArticles(),
        dataService.getBooks(),
        dataService.getLessons(),
        dataService.getEnrollments(),
        dataService.getBookOrders(),
        dataService.getQuizQuestions(),
        dataService.getReviews(),
        dataService.getCarouselImages(),
        pdfService.getPdfOrders(),
        pdfService.getPdfProducts(),
        pdfService.getPaymentSettings(),
        pdfService.getPdfAnalytics()
      ]);
      
      setLocalCourses(courses);
      setLocalArticles(articles);
      setLocalBooks(books);
      setLocalLessons(lessons);
      setLocalEnrollments(enrollments);
      setLocalBookOrders(orders);
      setLocalQuizQuestions(quiz);
      setLocalReviews(reviews);
      setLocalCarousel(carousel);

      setLocalPdfOrders(pdfOrdersData);
      setLocalPdfProducts(pdfProds);
      setPdfSettings(pSettings);
      setPdfAnalytics(pAnalytics);
    } catch (err) {
      showStatus('error', 'ডাটা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  // PDF Order Actions
  const handleApprovePdfOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      await pdfService.updatePdfOrderStatus(orderId, 'paid');
      showStatus('success', 'পেমেন্ট সফলভাবে ভেরিফাই ও অনুমোদিত হয়েছে! বইটি ইউজারের "My Books" এ উন্মুক্ত করা হয়েছে।');
      await loadAllData();
    } catch (err) {
      showStatus('error', 'পেমেন্ট অনুমোদন করা যায়নি।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRejectModal = (order: PdfOrder) => {
    setRejectionModalOrder(order);
    setRejectionReasonText('Transaction ID mismatch or payment not received in account.');
  };

  const handleConfirmRejectPdfOrder = async () => {
    if (!rejectionModalOrder) return;
    setIsLoading(true);
    try {
      await pdfService.updatePdfOrderStatus(rejectionModalOrder.orderId, 'rejected', rejectionReasonText.trim());
      showStatus('success', 'পেমেন্ট বাতিল করা হয়েছে এবং কারণ সংরক্ষণ করা হয়েছে।');
      setRejectionModalOrder(null);
      await loadAllData();
    } catch (err) {
      showStatus('error', 'পেমেন্ট বাতিল করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleProductFeatured = async (product: PdfProduct) => {
    const updated = { ...product, featured: !product.featured };
    await pdfService.savePdfProduct(updated);
    showStatus('success', `Featured status updated: ${updated.featured ? 'Yes' : 'No'}`);
    await loadAllData();
  };

  const handleToggleProductPublished = async (product: PdfProduct) => {
    const updated = { ...product, published: !product.published };
    await pdfService.savePdfProduct(updated);
    showStatus('success', `Published status updated: ${updated.published ? 'Yes' : 'No'}`);
    await loadAllData();
  };

  const handleDelete = async (id: string, type: Tab) => {
    if (!confirm('আপনি কি নিশ্চিত? এটি ডিলিট করা হবে।')) return;
    setIsLoading(true);
    try {
      if (type === 'pdfProducts') await pdfService.deletePdfProduct(id);
      if (type === 'courses') await dataService.deleteCourse(id);
      if (type === 'lessons') await dataService.deleteLesson(id);
      if (type === 'books') await dataService.deleteBook(id);
      if (type === 'blog') await dataService.deleteArticle(id);
      if (type === 'quiz') await dataService.deleteQuizQuestion(id);
      if (type === 'reviews') await dataService.deleteReview(id);
      if (type === 'enrollments') await dataService.deleteEnrollment(id);
      if (type === 'carousel') await dataService.deleteCarouselImage(id);
      
      showStatus('success', 'সফলভাবে ডিলিট করা হয়েছে');
      loadAllData();
    } catch (err) {
      showStatus('error', 'ডিলিট করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfSettings) return;
    setIsSaving(true);
    try {
      await pdfService.savePaymentSettings(pdfSettings);
      showStatus('success', 'পেমেন্ট সেটিংস সফলভাবে আপডেট হয়েছে!');
    } catch (err) {
      showStatus('error', 'পেমেন্ট সেটিংস সেভ করা যায়নি।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePdfProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const f = new FormData(e.target as HTMLFormElement);

    const price = parseInt(f.get('price') as string) || 0;
    const originalPrice = parseInt(f.get('originalPrice') as string) || price;
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const rawFeatures = (f.get('features') as string) || '';
    const rawChapters = (f.get('chapters') as string) || '';
    const rawKeywords = (f.get('keywords') as string) || '';

    const newProd: PdfProduct = {
      id: editingItem?.id || `pdf-${Date.now()}`,
      title: f.get('title') as string,
      slug: (f.get('slug') as string) || (f.get('title') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: f.get('shortDescription') as string,
      description: f.get('description') as string,
      price,
      originalPrice,
      discount,
      currency: 'BDT',
      category: f.get('category') as PdfCategory,
      hskLevel: f.get('hskLevel') as HskLevel,
      language: f.get('language') as string || 'Chinese - Bangla',
      pages: parseInt(f.get('pages') as string) || 120,
      fileSize: f.get('fileSize') as string || '15.0 MB',
      coverImage: f.get('coverImage') as string || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
      fullPdfPath: f.get('fullPdfPath') as string || `pdfs/private/${editingItem?.id || 'new'}/full.pdf`,
      downloadUrl: f.get('downloadUrl') as string || '',
      previewPages: [
        (f.get('preview1') as string) || editingItem?.previewPages?.[0] || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
        (f.get('preview2') as string) || editingItem?.previewPages?.[1] || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        (f.get('preview3') as string) || editingItem?.previewPages?.[2] || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
      ].filter(Boolean),
      features: rawFeatures.split('\n').map(s => s.trim()).filter(Boolean),
      chapters: rawChapters.split('\n').map(s => s.trim()).filter(Boolean),
      keywords: rawKeywords.split(',').map(s => s.trim()).filter(Boolean),
      rating: editingItem?.rating || 5.0,
      reviewCount: editingItem?.reviewCount || 0,
      salesCount: editingItem?.salesCount || 0,
      viewCount: editingItem?.viewCount || 0,
      previewCount: editingItem?.previewCount || 0,
      published: f.get('published') === 'on',
      featured: f.get('featured') === 'on',
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await pdfService.savePdfProduct(newProd);
      showStatus('success', 'PDF eBook সফলভাবে সেভ করা হয়েছে!');
      setIsModalOpen(false);
      setEditingItem(null);
      await loadAllData();
    } catch (err) {
      showStatus('error', 'PDF eBook সেভ করা সম্ভব হয়নি।');
    } finally {
      setIsSaving(false);
    }
  };

  const pendingPdfOrdersCount = localPdfOrders.filter(
    o => o.status === 'payment_submitted' || o.status === 'pending' || o.status === 'under_review'
  ).length;

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <AnimatePresence>
        {statusMsg && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className={`fixed top-0 left-1/2 -translate-x-1/2 z-[300] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold ${statusMsg.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {statusMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 flex flex-col p-6 space-y-2 overflow-y-auto scroll-hide">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C1121F] rounded-xl flex items-center justify-center text-white font-bold chinese-font text-lg shadow-md shadow-red-600/30">华</div>
          <div>
            <span className="font-black text-sm uppercase tracking-tight block">MandarinShelf</span>
            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Admin Control</span>
          </div>
        </div>

        {/* MandarinShelf PDF Section Header */}
        <div className="pt-2 pb-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider px-3">
            📚 MandarinShelf (eBooks)
          </span>
        </div>

        {[
          { id: 'pdfOrders', icon: Wallet, label: 'PDF Orders', badge: pendingPdfOrdersCount },
          { id: 'pdfProducts', icon: BookIcon, label: 'PDF Products' },
          { id: 'pdfPayments', icon: Settings, label: 'Payment Settings' },
          { id: 'pdfAnalytics', icon: BarChart3, label: 'PDF Analytics' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as Tab)} 
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all ${
              activeTab === item.id 
                ? 'bg-[#C1121F] text-white shadow-lg shadow-red-600/20' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4" /> 
              <span>{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        {/* Existing Educational System Header */}
        <div className="pt-4 pb-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider px-3">
            🎓 Language Lab & Portal
          </span>
        </div>

        {[
          { id: 'overview', icon: LayoutDashboard, label: 'General Overview' },
          { id: 'courses', icon: BookOpen, label: 'HSK Courses' },
          { id: 'lessons', icon: List, label: 'Course Lessons' },
          { id: 'books', icon: BookIcon, label: 'Physical Books' },
          { id: 'enrollments', icon: Wallet, label: 'Course Enrollments' },
          { id: 'orders', icon: ShoppingBag, label: 'Physical Book Orders' },
          { id: 'blog', icon: FilePlus, label: 'Articles & Blog' },
          { id: 'quiz', icon: Sparkles, label: 'Quiz Questions' },
          { id: 'reviews', icon: MessageSquare, label: 'Website Reviews' },
          { id: 'carousel', icon: ImageIcon, label: 'Hero Slides' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id as Tab)} 
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === item.id 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <item.icon className="w-4 h-4" /> 
            <span>{item.label}</span>
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 sm:p-10 overflow-y-auto h-screen scroll-hide">
        <header className="mb-10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              {activeTab === 'pdfOrders' && '📚 MandarinShelf PDF Orders'}
              {activeTab === 'pdfProducts' && '📖 PDF eBook Management'}
              {activeTab === 'pdfPayments' && '💳 bKash, Nagad & Binance Settings'}
              {activeTab === 'pdfAnalytics' && '📊 PDF Sales & Engagement Analytics'}
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'courses' && 'Courses'}
              {activeTab === 'lessons' && 'Lessons'}
              {activeTab === 'books' && 'Physical Books'}
              {activeTab === 'enrollments' && 'Course Enrollments'}
              {activeTab === 'orders' && 'Book Orders'}
              {activeTab === 'blog' && 'Articles & Blog'}
              {activeTab === 'quiz' && 'Quiz Bank'}
              {activeTab === 'reviews' && 'Reviews'}
              {activeTab === 'carousel' && 'Hero Carousel'}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-zinc-400">
              <Database className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Firebase Firestore & Auth Connected • Live Production Database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadAllData} 
              className={`p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all shadow-sm ${isLoading ? 'animate-spin' : ''}`}
              title="Refresh Data"
            >
              <RefreshCcw className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
            </button>

            {activeTab === 'pdfProducts' && (
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                className="px-5 py-3 bg-[#C1121F] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-700 shadow-xl shadow-red-500/20 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New PDF</span>
              </button>
            )}

            {activeTab !== 'overview' && activeTab !== 'pdfOrders' && activeTab !== 'pdfProducts' && activeTab !== 'pdfPayments' && activeTab !== 'pdfAnalytics' && activeTab !== 'enrollments' && activeTab !== 'orders' && (
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }} 
                className="px-5 py-3 bg-[#C1121F] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-red-700 shadow-xl shadow-red-500/20"
              >
                + Add New
              </button>
            )}
          </div>
        </header>

        {/* ========================================== */}
        {/* TAB: PDF ORDERS & PAYMENT VERIFICATION */}
        {/* ========================================== */}
        {activeTab === 'pdfOrders' && (() => {
          const filteredPdfOrders = localPdfOrders.filter(order => {
            if (orderStatusFilter === 'pending') {
              const isPending = order.status === 'payment_submitted' || order.status === 'pending' || order.status === 'under_review';
              if (!isPending) return false;
            } else if (orderStatusFilter === 'paid') {
              if (order.status !== 'paid') return false;
            } else if (orderStatusFilter === 'rejected') {
              if (order.status !== 'rejected') return false;
            }

            if (orderSearchQuery.trim()) {
              const q = orderSearchQuery.toLowerCase();
              const matches = 
                order.orderId.toLowerCase().includes(q) ||
                order.customerName.toLowerCase().includes(q) ||
                order.email.toLowerCase().includes(q) ||
                (order.senderNumber && order.senderNumber.toLowerCase().includes(q)) ||
                order.transactionId.toLowerCase().includes(q) ||
                order.productTitle.toLowerCase().includes(q);
              if (!matches) return false;
            }

            return true;
          });

          return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => setOrderStatusFilter('pending')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  orderStatusFilter === 'pending'
                    ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span className="text-xs font-bold text-zinc-400 uppercase">⏳ Pending Verification</span>
                <p className="text-3xl font-black text-amber-500 mt-1">{pendingPdfOrdersCount}</p>
                <p className="text-[10px] text-zinc-400 mt-1">Requires manual check of TrxID</p>
              </div>
              <div 
                onClick={() => setOrderStatusFilter('paid')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  orderStatusFilter === 'paid'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span className="text-xs font-bold text-zinc-400 uppercase">✅ Paid & Approved</span>
                <p className="text-3xl font-black text-emerald-500 mt-1">
                  {localPdfOrders.filter(o => o.status === 'paid').length}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">eBooks unlocked in student library</p>
              </div>
              <div 
                onClick={() => setOrderStatusFilter('all')}
                className={`p-5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  orderStatusFilter === 'all'
                    ? 'bg-red-500/10 border-red-500 ring-2 ring-red-500/30'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <span className="text-xs font-bold text-zinc-400 uppercase">💰 Verified eBook Revenue</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  ৳ {localPdfOrders.filter(o => o.status === 'paid').reduce((s, o) => s + (o.amount || 0), 0)}
                </p>
                <p className="text-[10px] text-zinc-400 mt-1">{localPdfOrders.length} total orders placed</p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: `All Orders (${localPdfOrders.length})` },
                  { id: 'pending', label: `⏳ Pending (${pendingPdfOrdersCount})` },
                  { id: 'paid', label: `✅ Approved (${localPdfOrders.filter(o => o.status === 'paid').length})` },
                  { id: 'rejected', label: `❌ Rejected (${localPdfOrders.filter(o => o.status === 'rejected').length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === tab.id
                        ? 'bg-[#C1121F] text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-80">
                <input 
                  type="text"
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  placeholder="Search by TrxID, Name, Phone..."
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium focus:outline-none focus:border-[#C1121F]"
                />
                {orderSearchQuery && (
                  <button 
                    onClick={() => setOrderSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 uppercase font-black tracking-wider text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer & Email</th>
                      <th className="px-6 py-4">eBook Product</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Method & Sender</th>
                      <th className="px-6 py-4">TrxID / Hash</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredPdfOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-zinc-400">
                          {orderSearchQuery || orderStatusFilter !== 'all' 
                            ? 'No orders match your filter/search.' 
                            : 'No PDF eBook orders yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredPdfOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                          <td className="px-6 py-4 font-mono font-bold text-red-500">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-zinc-900 dark:text-white">{order.customerName}</p>
                            <p className="text-[11px] text-zinc-400">{order.email}</p>
                          </td>
                          <td className="px-6 py-4 max-w-[200px] truncate font-semibold">
                            {order.productTitle}
                          </td>
                          <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                            ৳ {order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold">{order.paymentMethod}</span>
                            {order.senderNumber && (
                              <p className="text-[10px] text-zinc-400 font-mono font-bold">{order.senderNumber}</p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[11px] font-mono font-bold text-red-500 select-all">
                              {order.transactionId}
                            </code>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                              order.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                              order.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 animate-pulse'
                            }`}>
                              {order.status === 'paid' ? '✓ Verified' : order.status === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button
                              onClick={() => setViewingOrder(order)}
                              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition"
                              title="View details / screenshot"
                            >
                              View
                            </button>
                            {order.status !== 'paid' && (
                              <button
                                onClick={() => handleApprovePdfOrder(order.orderId)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                                title="Verify payment and unlock eBook"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Verify & Approve</span>
                              </button>
                            )}
                            {order.status !== 'rejected' && (
                              <button
                                onClick={() => handleOpenRejectModal(order)}
                                className="px-2.5 py-1.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-200 rounded-lg text-xs font-bold transition"
                                title="Reject payment with reason"
                              >
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          );
        })()}

        {/* ========================================== */}
        {/* TAB: PDF PRODUCTS MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'pdfProducts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localPdfProducts.map(prod => (
                <div 
                  key={prod.id} 
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <img 
                        src={prod.coverImage} 
                        alt={prod.title} 
                        className="w-20 h-28 object-cover rounded-2xl shadow-md shrink-0 bg-zinc-950" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full">
                            {prod.hskLevel}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-bold">{prod.category}</span>
                        </div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2 leading-snug">
                          {prod.title}
                        </h3>
                        <p className="text-sm font-black text-red-600 mt-1.5">
                          ৳ {prod.price} <span className="text-xs text-zinc-400 line-through">৳ {prod.originalPrice}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-zinc-400 block font-normal">Sales</span>
                        <span>{prod.salesCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-normal">Views</span>
                        <span>{prod.viewCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block font-normal">Previews</span>
                        <span>{prod.previewCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        onClick={() => handleToggleProductFeatured(prod)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                          prod.featured 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-300' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {prod.featured ? '★ Featured' : '☆ Not Featured'}
                      </button>

                      <button
                        onClick={() => handleToggleProductPublished(prod)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition ${
                          prod.published 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {prod.published ? '● Published' : '○ Draft'}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <button 
                      onClick={() => { setEditingItem(prod); setIsModalOpen(true); }}
                      className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(prod.id, 'pdfProducts')}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: PAYMENT SETTINGS */}
        {/* ========================================== */}
        {activeTab === 'pdfPayments' && pdfSettings && (
          <div className="max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <form onSubmit={handleSavePaymentSettings} className="space-y-8">
              {/* bKash */}
              <div className="p-6 bg-pink-50/50 dark:bg-pink-950/10 rounded-2xl border border-pink-200 dark:border-pink-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-2">
                    🇧🇩 bKash Configuration
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.bKash.enabled}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        bKash: { ...pdfSettings.bKash, enabled: e.target.checked }
                      })}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">bKash Account Number</label>
                    <input 
                      type="text" 
                      value={pdfSettings.bKash.number}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        bKash: { ...pdfSettings.bKash, number: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Instructions for Customers</label>
                    <input 
                      type="text" 
                      value={pdfSettings.bKash.instructions}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        bKash: { ...pdfSettings.bKash, instructions: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Nagad */}
              <div className="p-6 bg-orange-50/50 dark:bg-orange-950/10 rounded-2xl border border-orange-200 dark:border-orange-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-2">
                    🇧🇩 Nagad Configuration
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.Nagad.enabled}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Nagad: { ...pdfSettings.Nagad, enabled: e.target.checked }
                      })}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Nagad Account Number</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Nagad.number}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Nagad: { ...pdfSettings.Nagad, number: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Instructions</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Nagad.instructions}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Nagad: { ...pdfSettings.Nagad, instructions: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rocket */}
              <div className="p-6 bg-purple-50/50 dark:bg-purple-950/10 rounded-2xl border border-purple-200 dark:border-purple-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    🇧🇩 Rocket Configuration
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.Rocket.enabled}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Rocket: { ...pdfSettings.Rocket, enabled: e.target.checked }
                      })}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Rocket 12-digit Account</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Rocket.number}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Rocket: { ...pdfSettings.Rocket, number: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Instructions</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Rocket.instructions}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Rocket: { ...pdfSettings.Rocket, instructions: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Binance */}
              <div className="p-6 bg-amber-50/50 dark:bg-amber-950/10 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    🌎 Binance USDT Configuration
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pdfSettings.Binance.enabled}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Binance: { ...pdfSettings.Binance, enabled: e.target.checked }
                      })}
                    />
                    <span>Enabled</span>
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Binance USDT Address (TRC20)</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Binance.address}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Binance: { ...pdfSettings.Binance, address: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">QR Code Image URL</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Binance.qrImage}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Binance: { ...pdfSettings.Binance, qrImage: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Instructions</label>
                    <input 
                      type="text" 
                      value={pdfSettings.Binance.instructions}
                      onChange={e => setPdfSettings({
                        ...pdfSettings,
                        Binance: { ...pdfSettings.Binance, instructions: e.target.value }
                      })}
                      className="w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-4 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-600/20 transition"
              >
                {isSaving ? 'Saving Settings...' : 'Save Payment Settings'}
              </button>
            </form>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: PDF ANALYTICS */}
        {/* ========================================== */}
        {activeTab === 'pdfAnalytics' && pdfAnalytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase">Total Revenue</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">৳ {pdfAnalytics.totalRevenue}</h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase">Paid Orders</span>
                <h3 className="text-3xl font-black text-emerald-500 mt-1">{pdfAnalytics.paidOrdersCount}</h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase">Pending Review</span>
                <h3 className="text-3xl font-black text-amber-500 mt-1">{pdfAnalytics.pendingOrdersCount}</h3>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase">Total eBooks</span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">{pdfAnalytics.totalProducts}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Best Sellers */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" /> Best-Selling eBooks
                </h3>
                <div className="space-y-3">
                  {pdfAnalytics.bestSellers?.map((p: PdfProduct) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs">
                      <span className="font-bold truncate max-w-[240px]">{p.title}</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 shrink-0">{p.salesCount} sold</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Previewed */}
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-red-500" /> Most Sample Previewed eBooks
                </h3>
                <div className="space-y-3">
                  {pdfAnalytics.mostPreviewed?.map((p: PdfProduct) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl text-xs">
                      <span className="font-bold truncate max-w-[240px]">{p.title}</span>
                      <span className="font-black text-red-500 shrink-0">{p.previewCount} previews</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* EXISTING TAB VIEWS (COURSES, LESSONS, ETC.) */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Stat icon={BookOpen} label="Courses" value={localCourses.length} />
            <Stat icon={List} label="Lessons" value={localLessons.length} />
            <Stat icon={BookIcon} label="Books" value={localBooks.length} />
            <Stat icon={Wallet} label="Course Sales" value={localEnrollments.length} />
            <Stat icon={ShoppingBag} label="Book Sales" value={localBookOrders.length} />
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localCourses.map(c => (
              <div key={c.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-base">{c.title.EN}</h4>
                  <p className="text-xs text-zinc-400">{c.level} • {c.duration} • {c.price}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(c); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(c.id, 'courses')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-8 py-5">Student</th>
                  <th className="px-8 py-5">Course</th>
                  <th className="px-8 py-5">Phone</th>
                  <th className="px-8 py-5">TxID</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {localEnrollments.map(e => (
                  <tr key={e.id}>
                    <td className="px-8 py-5 font-bold">{e.userName}</td>
                    <td className="px-8 py-5">{e.courseName}</td>
                    <td className="px-8 py-5 text-zinc-500 font-mono text-[11px]">{e.senderNumber}</td>
                    <td className="px-8 py-5">
                      <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold text-[#C1121F]">{e.transactionId}</code>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${e.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{e.status}</span>
                    </td>
                    <td className="px-8 py-5 text-right space-x-2">
                      {e.status !== 'approved' && (
                        <button onClick={async () => { await dataService.updateEnrollmentStatus(e.id, 'approved'); loadAllData(); }} className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold">Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Existing Lessons, Books, Blog, Quiz, Reviews, Carousel tabs continue smoothly */}
        {activeTab === 'lessons' && (
          <div className="space-y-4">
            {localLessons.map(l => (
              <div key={l.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{l.title}</h4>
                  <p className="text-xs text-zinc-400">Order #{l.order} • Course: {l.courseId}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(l); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(l.id, 'lessons')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localBooks.map(b => (
              <div key={b.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div className="flex gap-4">
                  <img src={b.image} alt="" className="w-16 h-20 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-bold text-sm">{b.title.EN}</h4>
                    <p className="text-xs text-zinc-400">{b.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(b); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(b.id, 'books')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localArticles.map(a => (
              <div key={a.id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm">{a.title.EN}</h4>
                  <p className="text-xs text-zinc-400">{a.category} • {a.date}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(a); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(a.id, 'blog')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            {localQuizQuestions.map(q => (
              <div key={q.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{q.question}</p>
                  <p className="text-xs text-zinc-400 mt-1">Ans: {q.options[q.correctAnswer]}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingItem(q); setIsModalOpen(true); }} className="p-2 text-zinc-400 hover:text-white"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(q.id, 'quiz')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localReviews.map(r => (
              <div key={r.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <div className="flex gap-3">
                  {r.image && <img src={r.image} alt="" className="w-12 h-12 object-cover rounded-xl" />}
                  <div>
                    <div className="flex text-amber-400 text-xs">
                      {[...Array(r.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{r.content?.BN || r.content?.EN}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(r.id, 'reviews')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'carousel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localCarousel.map(c => (
              <div key={c.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt="" className="w-16 h-12 object-cover rounded-xl" />
                  <span className="text-xs font-bold truncate max-w-xs">{c.title?.EN || 'Slide'}</span>
                </div>
                <button onClick={() => handleDelete(c.id, 'carousel')} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* ORDER DETAIL & SCREENSHOT MODAL */}
      {/* ========================================== */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-xs space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base">Order #{viewingOrder.orderId}</h3>
              <button onClick={() => setViewingOrder(null)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-zinc-400">Customer:</span><span className="font-bold">{viewingOrder.customerName}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Email:</span><span>{viewingOrder.email}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Amount:</span><span className="font-bold text-red-500">৳ {viewingOrder.amount}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Method:</span><span>{viewingOrder.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Sender:</span><span>{viewingOrder.senderNumber || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">TrxID:</span><span className="font-mono font-bold text-red-500">{viewingOrder.transactionId}</span></div>
            </div>

            {viewingOrder.screenshotUrl && (
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Attached Screenshot:</p>
                <img src={viewingOrder.screenshotUrl} alt="Receipt" className="max-h-56 rounded-xl border border-zinc-200 dark:border-zinc-800 mx-auto" />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t">
              {viewingOrder.status !== 'paid' && (
                <button
                  onClick={() => {
                    handleApprovePdfOrder(viewingOrder.orderId);
                    setViewingOrder(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Approve Payment
                </button>
              )}
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* REJECTION REASON MODAL */}
      {/* ========================================== */}
      {rejectionModalOrder && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 text-xs space-y-4">
            <h3 className="font-bold text-sm text-red-500">Reject Payment #{rejectionModalOrder.orderId}</h3>
            <p className="text-zinc-400">Please provide a clear reason for the customer:</p>
            <textarea
              value={rejectionReasonText}
              onChange={e => setRejectionReasonText(e.target.value)}
              rows={3}
              className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectionModalOrder(null)} className="px-4 py-2 rounded-xl text-zinc-400 font-bold">Cancel</button>
              <button onClick={handleConfirmRejectPdfOrder} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GENERAL EDIT & ADD MODALS */}
      {/* ========================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-black uppercase">
                  {editingItem ? 'Edit Item' : 'Create New Item'}
                </h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-zinc-400" /></button>
              </div>

              {/* PDF Product Add/Edit Form */}
              {activeTab === 'pdfProducts' ? (
                <form onSubmit={handleSavePdfProductForm} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="title" label="Book Title *" val={editingItem?.title} />
                    <Input name="slug" label="URL Slug" val={editingItem?.slug} required={false} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400">Category</label>
                      <select name="category" defaultValue={editingItem?.category || 'HSK PDFs'} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 border font-bold">
                        <option value="HSK PDFs">HSK PDFs</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Grammar">Grammar</option>
                        <option value="Speaking">Speaking</option>
                        <option value="Conversation">Conversation</option>
                        <option value="Reading">Reading</option>
                        <option value="Chinese-Bangla">Chinese-Bangla</option>
                        <option value="Bundles">Bundles</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400">HSK Level</label>
                      <select name="hskLevel" defaultValue={editingItem?.hskLevel || 'HSK 1'} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3 border font-bold">
                        <option value="HSK 1">HSK 1</option>
                        <option value="HSK 2">HSK 2</option>
                        <option value="HSK 3">HSK 3</option>
                        <option value="HSK 4">HSK 4</option>
                        <option value="HSK 5">HSK 5</option>
                        <option value="HSK 6">HSK 6</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <Input name="language" label="Language" val={editingItem?.language || 'Chinese - Bangla'} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Input name="price" label="Selling Price (৳) *" type="number" val={editingItem?.price} />
                    <Input name="originalPrice" label="Original Price (৳)" type="number" val={editingItem?.originalPrice} />
                    <Input name="pages" label="Page Count" type="number" val={editingItem?.pages || 200} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input name="fileSize" label="File Size (e.g. 18.5 MB)" val={editingItem?.fileSize || '18.5 MB'} />
                    <Input name="coverImage" label="Cover Image URL *" val={editingItem?.coverImage} />
                  </div>

                  <Textarea name="shortDescription" label="Short Summary (1-2 sentences)" val={editingItem?.shortDescription} />
                  <Textarea name="description" label="Full Book Description" val={editingItem?.description} />

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400">Sample Preview Pages (1 to 3 Image URLs)</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input name="preview1" placeholder="Preview Page 1 URL" defaultValue={editingItem?.previewPages?.[0]} className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-xs" />
                      <input name="preview2" placeholder="Preview Page 2 URL" defaultValue={editingItem?.previewPages?.[1]} className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-xs" />
                      <input name="preview3" placeholder="Preview Page 3 URL" defaultValue={editingItem?.previewPages?.[2]} className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Textarea name="features" label="Features (One per line)" val={editingItem?.features?.join('\n')} />
                    <Textarea name="chapters" label="Chapters Outline (One per line)" val={editingItem?.chapters?.join('\n')} />
                  </div>

                  <Input name="keywords" label="Search Keywords (comma separated)" val={editingItem?.keywords?.join(', ')} required={false} />

                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="featured" defaultChecked={editingItem ? editingItem.featured : true} />
                      <span className="font-bold">Feature on Homepage</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="published" defaultChecked={editingItem ? editingItem.published : true} />
                      <span className="font-bold">Published (Visible in Store)</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-bold text-zinc-400">Cancel</button>
                    <button type="submit" disabled={isSaving} className="px-6 py-2.5 bg-[#C1121F] text-white rounded-xl font-bold uppercase">
                      {isSaving ? 'Saving...' : 'Publish PDF eBook'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  Form for {activeTab}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 flex items-center gap-6 shadow-sm group hover:shadow-xl transition-all">
    <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-[#C1121F] group-hover:scale-110 transition-transform"><Icon className="w-7 h-7" /></div>
    <div><p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{label}</p><h3 className="text-3xl font-black text-zinc-900 dark:text-white">{value}</h3></div>
  </div>
);

const Input = ({ name, label, val, type = "text", required = true }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">{label}</label>
    <input name={name} defaultValue={val} type={type} required={required} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#C1121F] rounded-xl px-4 py-3 outline-none font-bold shadow-sm transition-all" />
  </div>
);

const Textarea = ({ name, label, val, required = true }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">{label}</label>
    <textarea name={name} defaultValue={val} required={required} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#C1121F] rounded-xl px-4 py-3 outline-none font-bold resize-none shadow-sm transition-all text-xs" />
  </div>
);

export default AdminDashboard;
