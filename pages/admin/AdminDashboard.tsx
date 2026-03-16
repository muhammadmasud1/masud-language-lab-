
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, Plus, LogOut, Edit3, Trash2, 
  Wallet, List, ShoppingBag, Book as BookIcon, Sparkles, FilePlus, Video, X, Save,
  CheckCircle, AlertCircle, RefreshCcw, Database
} from 'lucide-react';
import { Language, Course, Article, Enrollment, BookOrder, Book, QuizQuestion, Lesson } from '../../types';
import { dataService } from '../../services/dataService';

import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

interface Props { lang: Language; setUser: (user: any) => void; }

type Tab = 'overview' | 'courses' | 'lessons' | 'enrollments' | 'books' | 'blog' | 'quiz';

const AdminDashboard: React.FC<Props> = ({ lang, setUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [localLessons, setLocalLessons] = useState<Lesson[]>([]);
  const [localEnrollments, setLocalEnrollments] = useState<Enrollment[]>([]);
  const [localBookOrders, setLocalBookOrders] = useState<BookOrder[]>([]);
  const [localQuizQuestions, setLocalQuizQuestions] = useState<QuizQuestion[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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
      const [courses, articles, books, lessons, enrollments, orders, quiz] = await Promise.all([
        dataService.getCourses(),
        dataService.getArticles(),
        dataService.getBooks(),
        dataService.getLessons(),
        dataService.getEnrollments(),
        dataService.getBookOrders(),
        dataService.getQuizQuestions()
      ]);
      
      setLocalCourses(courses);
      setLocalArticles(articles);
      setLocalBooks(books);
      setLocalLessons(lessons);
      setLocalEnrollments(enrollments);
      setLocalBookOrders(orders);
      setLocalQuizQuestions(quiz);
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

  const handleDelete = async (id: string, type: Tab) => {
    if (!confirm('আপনি কি নিশ্চিত? এটি ডিলিট করা হবে।')) return;
    setIsLoading(true);
    try {
      if (type === 'courses') await dataService.deleteCourse(id);
      if (type === 'lessons') await dataService.deleteLesson(id);
      if (type === 'books') await dataService.deleteBook(id);
      if (type === 'blog') await dataService.deleteArticle(id);
      if (type === 'quiz') await dataService.deleteQuizQuestion(id);
      if (type === 'enrollments') await dataService.deleteEnrollment(id);
      await loadAllData();
      showStatus('success', 'সফলভাবে মুছে ফেলা হয়েছে');
    } catch (err) {
      showStatus('error', 'মুছতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    try {
      await dataService.updateEnrollmentStatus(id, 'approved');
      await loadAllData();
      showStatus('success', 'পেমেন্ট অনুমোদিত হয়েছে');
    } catch (err) {
      showStatus('error', 'অনুমোদন করা যায়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে আপনি এই পেমেন্টটি বাতিল করতে চান?')) return;
    setIsLoading(true);
    try {
      await dataService.updateEnrollmentStatus(id, 'rejected');
      await loadAllData();
      showStatus('success', 'পেমেন্ট বাতিল করা হয়েছে');
    } catch (err) {
      showStatus('error', 'বাতিল করা যায়নি');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const f = new FormData(e.target as HTMLFormElement);

    try {
      if (activeTab === 'courses') {
        const data: Course = {
          id: editingItem?.id || 'c-' + Date.now(),
          title: { EN: f.get('title_en') as string, BN: f.get('title_bn') as string },
          description: { EN: f.get('desc_en') as string, BN: f.get('desc_bn') as string },
          level: f.get('level') as string,
          duration: f.get('duration') as string,
          price: f.get('price') as string,
          image: f.get('image') as string || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
          status: 'published'
        };
        await dataService.saveCourse(data);
      } else if (activeTab === 'lessons') {
        const data: Lesson = {
          id: editingItem?.id || 'l-' + Date.now(),
          courseId: f.get('courseId') as string,
          title: f.get('title') as string,
          videoUrl: f.get('videoUrl') as string,
          order: parseInt(f.get('order') as string),
          status: 'published'
        };
        await dataService.saveLesson(data);
      } else if (activeTab === 'books') {
        const data: Book = {
          id: editingItem?.id || 'book-' + Date.now(),
          title: { EN: f.get('title_en') as string, BN: f.get('title_bn') as string },
          price: f.get('price') as string,
          image: f.get('image') as string || 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
          description: { EN: f.get('desc_en') as string, BN: f.get('desc_bn') as string }
        };
        await dataService.saveBook(data);
      } else if (activeTab === 'blog') {
        const data: Article = {
          id: editingItem?.id || 'art-' + Date.now(),
          title: { EN: f.get('title_en') as string, BN: f.get('title_bn') as string },
          excerpt: { EN: f.get('excerpt_en') as string, BN: f.get('excerpt_bn') as string },
          content: { EN: f.get('content_en') as string, BN: f.get('content_bn') as string },
          category: f.get('category') as string,
          image: f.get('image') as string || 'https://images.unsplash.com/photo-1528610624838-51846c4f9f6e?auto=format&fit=crop&q=80&w=800',
          videoUrl: f.get('videoUrl') as string || undefined,
          type: (f.get('type') as any) || 'article',
          date: new Date().toLocaleDateString(),
          status: 'published'
        };
        await dataService.saveArticle(data);
      } else if (activeTab === 'quiz') {
        const data: QuizQuestion = {
          id: editingItem?.id || 'q-' + Date.now(),
          question: f.get('question') as string,
          options: [
            f.get('opt0') as string,
            f.get('opt1') as string,
            f.get('opt2') as string,
            f.get('opt3') as string
          ],
          correctAnswer: parseInt(f.get('correctAnswer') as string),
          explanation: f.get('explanation') as string
        };
        await dataService.saveQuizQuestion(data);
      }

      await loadAllData();
      setIsModalOpen(false);
      setEditingItem(null);
      showStatus('success', 'তথ্য সংরক্ষিত হয়েছে');
    } catch (err) {
      showStatus('error', 'সেভ করা যায়নি');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
      <AnimatePresence>
        {statusMsg && (
          <motion.div initial={{ y: -100 }} animate={{ y: 20 }} exit={{ y: -100 }} className={`fixed top-0 left-1/2 -translate-x-1/2 z-[200] px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold ${statusMsg.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {statusMsg.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-screen sticky top-0 flex flex-col p-6 space-y-2">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C1121F] rounded-xl flex items-center justify-center text-white font-bold chinese-font">华</div>
          <span className="font-black text-sm uppercase tracking-tighter">Masud CMS</span>
        </div>
        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
          { id: 'courses', icon: BookOpen, label: 'Courses' },
          { id: 'lessons', icon: List, label: 'Lessons' },
          { id: 'books', icon: BookIcon, label: 'Books' },
          { id: 'enrollments', icon: Wallet, label: 'Course Payments' },
          { id: 'orders', icon: ShoppingBag, label: 'Book Orders' },
          { id: 'blog', icon: FilePlus, label: 'Blog' },
          { id: 'quiz', icon: Sparkles, label: 'Quiz' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === item.id ? 'bg-[#C1121F] text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 font-bold text-xs hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow p-10 overflow-y-auto h-screen scroll-hide">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black uppercase">Shared CMS Panel</h1>
            <div className="flex items-center gap-2 mt-1 text-zinc-400">
               <Database className="w-4 h-4 text-green-500" />
               <p className="text-[10px] font-black uppercase tracking-widest">Supabase Cloud (Active)</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={loadAllData} className={`p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl transition-all ${isLoading ? 'animate-spin' : ''}`}>
                <RefreshCcw className="w-5 h-5" />
             </button>
             {activeTab !== 'overview' && activeTab !== 'enrollments' && (
               <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="px-6 py-3 bg-[#C1121F] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-xl shadow-red-500/20">
                 + Add New
               </button>
             )}
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Stat icon={BookOpen} label="Courses" value={localCourses.length} />
            <Stat icon={List} label="Lessons" value={localLessons.length} />
            <Stat icon={BookIcon} label="Books" value={localBooks.length} />
            <Stat icon={Wallet} label="Course Sales" value={localEnrollments.length} />
            <Stat icon={ShoppingBag} label="Book Sales" value={localBookOrders.length} />
          </div>
        )}

        {activeTab === 'enrollments' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
             <table className="w-full text-left">
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
                   <tr key={e.id} className="text-sm">
                     <td className="px-8 py-5 font-bold">{e.userName}</td>
                     <td className="px-8 py-5">{e.courseName}</td>
                     <td className="px-8 py-5 text-zinc-500 font-mono text-[11px]">{e.senderNumber}</td>
                     <td className="px-8 py-5">
                       <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold text-[#C1121F]">{e.transactionId}</code>
                     </td>
                     <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         e.status === 'approved' ? 'bg-green-100 text-green-700' : 
                         e.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {e.status}
                       </span>
                     </td>
                     <td className="px-8 py-5 text-right space-x-2">
                       {e.status === 'pending' && (
                         <>
                           <button onClick={() => handleApprove(e.id)} className="px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-600 transition-colors">Approve</button>
                           <button onClick={() => handleReject(e.id)} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-orange-600 transition-colors">Cancel</button>
                         </>
                       )}
                       <button onClick={() => handleDelete(e.id, 'enrollments')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
             <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                 <tr>
                   <th className="px-8 py-5">Customer</th>
                   <th className="px-8 py-5">Items</th>
                   <th className="px-8 py-5">Amount</th>
                   <th className="px-8 py-5">TxID</th>
                   <th className="px-8 py-5">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                 {localBookOrders.map(o => (
                   <tr key={o.id} className="text-sm">
                     <td className="px-8 py-5 font-bold">{o.userName}</td>
                     <td className="px-8 py-5 text-xs text-zinc-500">{o.items.map(i => i.title).join(', ')}</td>
                     <td className="px-8 py-5 font-bold">৳{o.totalAmount}</td>
                     <td className="px-8 py-5">
                       <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[10px] font-bold text-[#C1121F]">{o.transactionId}</code>
                     </td>
                     <td className="px-8 py-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         o.status === 'approved' ? 'bg-green-100 text-green-700' : 
                         o.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {o.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab !== 'overview' && activeTab !== 'enrollments' && activeTab !== 'orders' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="px-8 py-5">Title</th>
                  <th className="px-8 py-5">Meta / Category</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {(activeTab === 'courses' ? localCourses : 
                  activeTab === 'lessons' ? localLessons : 
                  activeTab === 'books' ? localBooks : 
                  activeTab === 'blog' ? localArticles : localQuizQuestions).map((item: any) => (
                  <tr key={item.id} className="text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-8 py-5 font-bold text-zinc-900 dark:text-zinc-100">{item.title?.EN || item.title || item.question}</td>
                    <td className="px-8 py-5 text-zinc-400">{item.price ? `৳${item.price}` : (item.courseId || item.category || 'Quiz')}</td>
                    <td className="px-8 py-5 text-right space-x-2">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id, activeTab)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] p-10 overflow-y-auto max-h-[90vh] scroll-hide shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-black uppercase tracking-tight">{editingItem ? 'Edit' : 'Add New'} {activeTab}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
               </div>
               <form onSubmit={handleSave} className="space-y-6">
                 {activeTab === 'courses' && (
                   <>
                     <div className="grid grid-cols-2 gap-6">
                       <Input name="title_en" label="Title (EN)" val={editingItem?.title?.EN} />
                       <Input name="title_bn" label="Title (BN)" val={editingItem?.title?.BN} />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <Input name="price" label="Price (৳)" type="number" val={editingItem?.price} />
                        <Input name="level" label="Level" val={editingItem?.level} />
                     </div>
                     <Input name="duration" label="Duration" val={editingItem?.duration} />
                     <Input name="image" label="Image URL" val={editingItem?.image} />
                     <Textarea name="desc_en" label="Desc (EN)" val={editingItem?.description?.EN} />
                     <Textarea name="desc_bn" label="Desc (BN)" val={editingItem?.description?.BN} />
                   </>
                 )}
                 {activeTab === 'lessons' && (
                   <>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Parent Course</label>
                        <select name="courseId" defaultValue={editingItem?.courseId} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-4 outline-none font-bold">
                           {localCourses.map(c => <option key={c.id} value={c.id}>{c.title.EN}</option>)}
                        </select>
                     </div>
                     <Input name="title" label="Lesson Title" val={editingItem?.title} />
                     <Input name="videoUrl" label="Video URL" val={editingItem?.videoUrl} />
                     <Input name="order" label="Order" type="number" val={editingItem?.order} />
                   </>
                 )}
                 {activeTab === 'books' && (
                   <>
                     <div className="grid grid-cols-2 gap-6">
                       <Input name="title_en" label="Title (EN)" val={editingItem?.title?.EN} />
                       <Input name="title_bn" label="Title (BN)" val={editingItem?.title?.BN} />
                     </div>
                     <Input name="price" label="Price" type="number" val={editingItem?.price} />
                     <Input name="image" label="Cover Image URL" val={editingItem?.image} />
                     <Textarea name="desc_en" label="Summary (EN)" val={editingItem?.description?.EN} />
                     <Textarea name="desc_bn" label="Summary (BN)" val={editingItem?.description?.BN} />
                   </>
                 )}
                {activeTab === 'blog' && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <Input name="title_en" label="Title (EN)" val={editingItem?.title?.EN} />
                      <Input name="title_bn" label="Title (BN)" val={editingItem?.title?.BN} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Input name="category" label="Category" val={editingItem?.category} />
                      <div className="space-y-1">
                         <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Type</label>
                         <select name="type" defaultValue={editingItem?.type || 'article'} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-4 outline-none font-bold">
                            <option value="article">Article</option>
                            <option value="video">Video/Vlog</option>
                            <option value="image">Image/Gallery</option>
                         </select>
                      </div>
                    </div>
                    <Input name="image" label="Feature Image URL" val={editingItem?.image} />
                    <Input name="videoUrl" label="Video URL (Optional)" val={editingItem?.videoUrl} />
                    <div className="grid grid-cols-2 gap-6">
                      <Textarea name="excerpt_en" label="Excerpt (EN)" val={editingItem?.excerpt?.EN} />
                      <Textarea name="excerpt_bn" label="Excerpt (BN)" val={editingItem?.excerpt?.BN} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <Textarea name="content_en" label="Full Content (EN)" val={editingItem?.content?.EN} />
                      <Textarea name="content_bn" label="Full Content (BN)" val={editingItem?.content?.BN} />
                    </div>
                  </>
                )}
                {activeTab === 'quiz' && (
                  <>
                    <Input name="question" label="Question" val={editingItem?.question} />
                    <div className="grid grid-cols-2 gap-6">
                      <Input name="opt0" label="Option 1" val={editingItem?.options?.[0]} />
                      <Input name="opt1" label="Option 2" val={editingItem?.options?.[1]} />
                      <Input name="opt2" label="Option 3" val={editingItem?.options?.[2]} />
                      <Input name="opt3" label="Option 4" val={editingItem?.options?.[3]} />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Correct Answer</label>
                       <select name="correctAnswer" defaultValue={editingItem?.correctAnswer || 0} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-4 outline-none font-bold">
                          <option value="0">Option 1</option>
                          <option value="1">Option 2</option>
                          <option value="2">Option 3</option>
                          <option value="3">Option 4</option>
                       </select>
                    </div>
                    <Textarea name="explanation" label="Explanation (Bangla)" val={editingItem?.explanation} />
                  </>
                )}
                 <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 font-bold text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
                    <button type="submit" className="bg-[#C1121F] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95">
                       <Save className="w-5 h-5" /> Save Data
                    </button>
                 </div>
               </form>
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

const Input = ({ name, label, val, type = "text" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">{label}</label>
    <input name={name} defaultValue={val} type={type} required className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-4 outline-none font-bold shadow-sm transition-all" />
  </div>
);

const Textarea = ({ name, label, val }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">{label}</label>
    <textarea name={name} defaultValue={val} required rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-4 outline-none font-bold resize-none shadow-sm transition-all" />
  </div>
);

export default AdminDashboard;
