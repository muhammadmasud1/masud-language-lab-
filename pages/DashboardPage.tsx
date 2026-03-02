
import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Play, 
  Settings, Bookmark,
  TrendingUp, CheckCircle, Lock, XCircle, ShieldCheck, ShoppingBag, Eye
} from 'lucide-react';
import { Language, User, Enrollment, BookOrder, Course } from '../types';
import { COURSES, BOOKS } from '../constants';
import { dataService } from '../services/dataService';

interface Props { 
  lang: Language;
  user: User;
}

const DashboardPage: React.FC<Props> = ({ lang, user }) => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookOrders, setBookOrders] = useState<BookOrder[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCloudData = async () => {
      setIsLoading(true);
      const [userEnr, userOrders, courses] = await Promise.all([
        dataService.getEnrollments(user.id),
        dataService.getBookOrders(user.id),
        dataService.getCourses()
      ]);
      setEnrollments(userEnr);
      setBookOrders(userOrders);
      setAllCourses(courses);

      // Extract approved books for local session
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

  if (isLoading) return <div className="h-[80vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white dark:bg-zinc-950 transition-colors">
      <header className="mb-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-5xl font-black mb-3 text-zinc-900 dark:text-white tracking-tight leading-none">
            {lang === 'EN' ? `Hey, ${user.name.split(' ')[0]}!` : `স্বাগতম, ${user.name.split(' ')[0]}!`}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.2em]">
            <ShieldCheck className="w-5 h-5 text-[#C1121F]" />
            {lang === 'EN' ? 'Cloud Authenticated Student' : 'ক্লাউড ভেরিফাইড স্টুডেন্ট'}
          </p>
        </motion.div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{lang === 'EN' ? 'Global ID' : 'গ্লোবাল আইডি'}</p>
             <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">{user.id}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-14">
          {/* Active Courses */}
          <div className="space-y-10">
            <h3 className="text-xl font-black uppercase tracking-[0.1em] text-zinc-800 dark:text-zinc-200 flex items-center gap-3 px-3">
              <BookOpen className="w-6 h-6 text-[#C1121F]" />
              {lang === 'EN' ? 'My Curriculum' : 'আমার কোর্সসমূহ'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {allCourses.filter(c => approvedCourseIds.includes(c.id)).map(course => (
                <motion.div key={course.id} whileHover={{ y: -8 }} className="bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col group">
                  <h4 className="text-2xl font-black mb-6 tracking-tight">{course.title[lang]}</h4>
                  <button onClick={() => navigate(`/lesson/${course.id}`)} className="w-full py-5 bg-zinc-950 dark:bg-zinc-800 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#C1121F] transition-all shadow-xl">
                    <Play className="w-4 h-4 fill-current" /> {lang === 'EN' ? 'Launch' : 'শুরু করুন'}
                  </button>
                </motion.div>
              ))}
              {approvedCourseIds.length === 0 && (
                <div className="col-span-full py-20 text-center border-4 border-dashed rounded-[4rem] border-zinc-100 dark:border-zinc-800/40 opacity-40">
                   <Lock className="w-10 h-10 mx-auto mb-4" />
                   <p className="font-black uppercase tracking-widest text-[10px]">{lang === 'EN' ? 'No Cloud Approved Courses' : 'অনুমোদিত কোনো কোর্স নেই'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 px-4">{lang === 'EN' ? 'Recent Transactions' : 'সাম্প্রতিক লেনদেন'}</h3>
            {enrollments.map(e => (
              <div key={e.id} className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{e.courseName}</p>
                  <p className="text-[10px] text-zinc-400">{e.date} • {e.transactionId}</p>
                </div>
                <div className={`text-[10px] font-black uppercase px-4 py-1 rounded-full ${e.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {e.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Library */}
        <div className="space-y-10">
          <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-zinc-200 dark:border-zinc-800 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">{lang === 'EN' ? 'My Library' : 'আমার লাইব্রেরি'}</h3>
            <div className="grid grid-cols-2 gap-4">
              {BOOKS.filter(b => user.purchasedBooks?.includes(b.id)).map(book => (
                <div key={book.id} className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-lg">
                  <img src={book.image} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
            {(!user.purchasedBooks || user.purchasedBooks.length === 0) && (
              <p className="text-center py-10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Library Empty</p>
            )}
            <Link to="/store" className="w-full mt-8 py-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">Browse Bookstore</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
