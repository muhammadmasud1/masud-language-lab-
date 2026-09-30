import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Play, Download,
  Settings, Bookmark, ExternalLink,
  TrendingUp, CheckCircle, Lock, XCircle, ShieldCheck, 
  ShoppingBag, Eye, Book, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { Language, User, Enrollment, BookOrder, Course, PdfPurchase, PdfOrder, PdfProduct } from '../types';
import { COURSES, BOOKS } from '../constants';
import { dataService } from '../services/dataService';
import { pdfService } from '../services/pdfService';
import PdfReaderModal from '../components/PdfReaderModal';

interface Props { 
  lang: Language;
  user: User;
}

type DashboardTab = 'myBooks' | 'courses' | 'orders';

const DashboardPage: React.FC<Props> = ({ lang, user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('myBooks');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookOrders, setBookOrders] = useState<BookOrder[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  
  // MandarinShelf PDF Purchases & Orders
  const [pdfPurchases, setPdfPurchases] = useState<PdfPurchase[]>([]);
  const [pdfOrders, setPdfOrders] = useState<PdfOrder[]>([]);
  const [allPdfProducts, setAllPdfProducts] = useState<PdfProduct[]>([]);
  const [selectedReaderBook, setSelectedReaderBook] = useState<{ product: PdfProduct; orderId?: string } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCloudData = async () => {
      setIsLoading(true);
      const [
        userEnr, 
        userOrders, 
        courses, 
        userPurchases, 
        userPdfOrders, 
        pdfProds
      ] = await Promise.all([
        dataService.getEnrollments(user.id),
        dataService.getBookOrders(user.id),
        dataService.getCourses(),
        pdfService.getPdfPurchases(user.id),
        pdfService.getPdfOrders(user.id),
        pdfService.getPdfProducts()
      ]);

      setEnrollments(userEnr);
      setBookOrders(userOrders);
      setAllCourses(courses);
      setPdfPurchases(userPurchases);
      setPdfOrders(userPdfOrders);
      setAllPdfProducts(pdfProds);

      // Extract approved physical books for local session
      const approvedBooks = userOrders
        .filter(o => o.status === 'approved')
        .flatMap(o => o.items.map(i => i.id));
      
      const updatedUser = { ...user, purchasedBooks: [...new Set(approvedBooks)] };
      localStorage.setItem('huayu_user', JSON.stringify(updatedUser));
      setIsLoading(false);
    };

    fetchCloudData();
  }, [user.id]);

  const approvedCourseIds = enrollments
    .filter(e => e.status === 'approved')
    .map(e => e.courseId);

  const handleOpenPdfReader = (productId: string, orderId?: string) => {
    const prod = allPdfProducts.find(p => p.id === productId);
    if (prod) {
      setSelectedReaderBook({ product: prod, orderId });
    }
  };

  const handleDirectDownload = (productId: string, orderId?: string) => {
    const prod = allPdfProducts.find(p => p.id === productId);
    if (!prod) return;

    const content = `=====================================================
MANDARINSHELF • DIGITAL BOOKSTORE
Licensed PDF Edition
=====================================================
Title       : ${prod.title}
Author      : Md. Masud Rana (HSK 6 Certified Expert)
Licensed To : ${user.name} (${user.email})
Order ID    : ${orderId || 'Licensed-Access'}
User ID     : ${user.id}
Level       : ${prod.hskLevel}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prod.slug || 'ebook'}-licensed.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white dark:bg-zinc-950 transition-colors">
      {/* Student Welcome Header */}
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C1121F] bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-full border border-red-200 dark:border-red-900">
              MandarinShelf Student Portal
            </span>
            <span className="text-zinc-400 text-xs">•</span>
            <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verified Account
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
            {lang === 'EN' ? `Welcome back, ${user.name.split(' ')[0]}!` : `স্বাগতম, ${user.name.split(' ')[0]}!`}
          </h1>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
              Account ID
            </p>
            <p className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              {user.id.substring(0, 14)}...
            </p>
          </div>
          <Link 
            to="/store"
            className="px-5 py-3 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/20 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>PDF Store</span>
          </Link>
        </div>
      </header>

      {/* Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('myBooks')}
          className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeTab === 'myBooks'
              ? 'bg-[#C1121F] text-white shadow-lg shadow-red-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <Book className="w-4 h-4" />
          <span>{lang === 'EN' ? 'My Books (eBooks)' : 'আমার বইসমূহ (ই-বুক)'}</span>
          {pdfPurchases.length > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'myBooks' ? 'bg-white text-red-600' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}>
              {pdfPurchases.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeTab === 'courses'
              ? 'bg-[#C1121F] text-white shadow-lg shadow-red-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'EN' ? 'My Courses' : 'আমার কোর্সসমূহ'}</span>
          {approvedCourseIds.length > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'courses' ? 'bg-white text-red-600' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}>
              {approvedCourseIds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition ${
            activeTab === 'orders'
              ? 'bg-[#C1121F] text-white shadow-lg shadow-red-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{lang === 'EN' ? 'Orders & Transactions' : 'অর্ডার ও লেনদেন'}</span>
          {pdfOrders.length > 0 && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeTab === 'orders' ? 'bg-white text-red-600' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
            }`}>
              {pdfOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: MY BOOKS (MANDARINSHELF) */}
      {activeTab === 'myBooks' && (
        <div className="space-y-12">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {lang === 'EN' ? 'My Digital Chinese Bookshelf' : 'আমার ডিজিটাল চাইনিজ বুকশেলফ'}
                </h2>
                <p className="text-xs text-zinc-500">
                  Approved eBooks with lifetime cloud reading and high-resolution PDF download.
                </p>
              </div>
            </div>

            {pdfPurchases.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed rounded-3xl border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
                <BookOpen className="w-14 h-14 text-zinc-400 mx-auto stroke-1" />
                <div className="space-y-1">
                  <h4 className="font-bold text-lg text-zinc-800 dark:text-white">
                    {lang === 'EN' ? 'No eBooks on your shelf yet' : 'আপনার বুকশেলফে এখনো কোনো বই নেই'}
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    {lang === 'EN'
                      ? 'Browse our premium Chinese eBooks with 1–3 sample pages preview and start learning today.'
                      : 'আমাদের প্রিমিয়াম চাইনিজ বইগুলোর ফ্রি প্রিভিউ দেখে কিনে নিন এবং সহজে ভাষা শেখা শুরু করুন।'}
                  </p>
                </div>
                <Link
                  to="/store"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse MandarinShelf</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pdfPurchases.map(pur => {
                  const prod = allPdfProducts.find(p => p.id === pur.productId);
                  return (
                    <div 
                      key={pur.purchaseId}
                      className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-xl hover:border-red-500/40 transition flex flex-col justify-between"
                    >
                      <div className="flex gap-4">
                        <img 
                          src={prod?.coverImage || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=300'} 
                          alt={pur.productTitle || 'Book'} 
                          className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0 bg-zinc-950" 
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase text-red-500 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full">
                            {prod?.hskLevel || 'Licensed'}
                          </span>
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-white mt-1 line-clamp-2 leading-snug">
                            {pur.productTitle || prod?.title}
                          </h4>
                          <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                            Purchased: {new Date(pur.approvedAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            Order #{pur.orderId}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                          onClick={() => handleOpenPdfReader(pur.productId, pur.orderId)}
                          className="py-2.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition active:scale-95"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open PDF</span>
                        </button>

                        <button
                          onClick={() => handleDirectDownload(pur.productId, pur.orderId)}
                          className="py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-zinc-200 dark:border-zinc-700 transition"
                        >
                          <Download className="w-3.5 h-3.5 text-red-500" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending or Recent PDF Orders Alert */}
          {pdfOrders.length > 0 && (
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <h3 className="font-black text-sm uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C1121F]" />
                Recent PDF Orders Status
              </h3>
              <div className="space-y-2">
                {pdfOrders.slice(0, 3).map(o => (
                  <div key={o.orderId} className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white">{o.productTitle}</span>
                        <span className="text-[10px] font-mono text-zinc-400">#{o.orderId}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        {o.paymentMethod} • TrxID: {o.transactionId} • ৳ {o.amount}
                      </p>
                      {o.status === 'rejected' && o.rejectionReason && (
                        <p className="text-xs text-red-500 font-semibold mt-1">
                          Rejection Reason: {o.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {o.status === 'paid' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950/80 dark:text-green-400 text-[10px] font-black uppercase rounded-full">
                          Approved & Active
                        </span>
                      )}
                      {(o.status === 'payment_submitted' || o.status === 'pending' || o.status === 'under_review') && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400 text-[10px] font-black uppercase rounded-full">
                          Under Verification
                        </span>
                      )}
                      {o.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 text-[10px] font-black uppercase rounded-full">
                          Payment Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: COURSES (PRESERVED SYSTEM) */}
      {activeTab === 'courses' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                {lang === 'EN' ? 'My Enrolled Courses' : 'আমার এনরোল করা কোর্সসমূহ'}
              </h2>
              <p className="text-xs text-zinc-500">
                HSK interactive curriculum and video classroom sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allCourses.filter(c => approvedCourseIds.includes(c.id)).map(course => (
              <motion.div key={course.id} whileHover={{ y: -6 }} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl flex flex-col justify-between group">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                    {course.level}
                  </span>
                  <h4 className="text-xl font-black text-zinc-900 dark:text-white mt-1 mb-4 tracking-tight">
                    {course.title[lang]}
                  </h4>
                  <p className="text-xs text-zinc-500 mb-6">{course.description[lang]}</p>
                </div>

                <button 
                  onClick={() => navigate(`/lesson/${course.id}`)} 
                  className="w-full py-4 bg-zinc-950 dark:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#C1121F] transition shadow-lg"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{lang === 'EN' ? 'Launch Course' : 'ক্লাস শুরু করুন'}</span>
                </button>
              </motion.div>
            ))}

            {approvedCourseIds.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed rounded-3xl border-zinc-200 dark:border-zinc-800 p-8">
                <Lock className="w-10 h-10 mx-auto mb-3 text-zinc-400" />
                <h4 className="font-bold text-zinc-700 dark:text-zinc-200 text-sm">
                  {lang === 'EN' ? 'No Enrolled Courses Found' : 'অনুমোদিত কোনো কোর্স পাওয়া যায়নি'}
                </h4>
                <p className="text-xs text-zinc-500 mt-1 mb-4">Explore our comprehensive HSK standard live courses.</p>
                <Link to="/courses" className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase">
                  Browse Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ORDERS & TRANSACTION HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
              {lang === 'EN' ? 'Order History & Transactions' : 'লেনদেন ও অর্ডারের ইতিহাস'}
            </h2>
            <p className="text-xs text-zinc-500">
              Complete log of all course enrollments, physical books, and MandarinShelf eBook purchases.
            </p>
          </div>

          <div className="space-y-3">
            {/* PDF Orders */}
            {pdfOrders.map(o => (
              <div key={o.orderId} className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-full">
                      eBook
                    </span>
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{o.productTitle}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    {new Date(o.createdAt).toLocaleDateString()} • {o.paymentMethod} • TrxID: {o.transactionId}
                  </p>
                  {o.rejectionReason && (
                    <p className="text-xs text-red-500 mt-1">Reason: {o.rejectionReason}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-zinc-900 dark:text-white">৳ {o.amount}</p>
                  <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full mt-1 ${
                    o.status === 'paid' ? 'bg-green-100 text-green-700' :
                    o.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}

            {/* Course Enrollments */}
            {enrollments.map(e => (
              <div key={e.id} className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-between items-center shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                      Course
                    </span>
                    <span className="font-bold text-sm text-zinc-900 dark:text-white">{e.courseName}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">{e.date} • {e.paymentMethod} • TrxID: {e.transactionId}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-zinc-900 dark:text-white">{e.amount}</p>
                  <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full mt-1 ${
                    e.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {e.status}
                  </span>
                </div>
              </div>
            ))}

            {pdfOrders.length === 0 && enrollments.length === 0 && (
              <p className="text-center py-12 text-xs text-zinc-400">No transactions recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Reader Modal */}
      {selectedReaderBook && (
        <PdfReaderModal
          product={selectedReaderBook.product}
          user={user}
          orderId={selectedReaderBook.orderId}
          isOpen={!!selectedReaderBook}
          onClose={() => setSelectedReaderBook(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

export default DashboardPage;
