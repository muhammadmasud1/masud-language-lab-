
import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Clock, BarChart, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Language, User, Course } from '../types';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

interface Props { 
  lang: Language; 
  user: User | null;
}

const CoursesPage: React.FC<Props> = ({ lang, user }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      const allCourses = await dataService.getCourses();
      setCourses(allCourses);
      
      if (user) {
        const enrollments = await dataService.getEnrollments(user.id);
        const approvedIds = enrollments
          .filter(e => e.status === 'approved' || e.status === 'pending')
          .map(e => e.courseId);
        setUserEnrollments(approvedIds);
      }
      setIsLoading(false);
    };
    loadCourses();
  }, [user]);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-zinc-900 dark:text-white">
          {lang === 'EN' ? 'Master Chinese Step-by-Step' : 'ধাপে ধাপে চাইনিজ শিখুন'}
        </h1>
        <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
          {lang === 'EN' 
            ? 'Structured HSK-aligned courses built for structural mastery and career readiness.' 
            : 'ক্যারিয়ারের সাফল্যের জন্য বিশেষভাবে ডিজাইন করা স্ট্রাকচার্ড HSK কোর্স।'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses.map((course, idx) => {
          const isEnrolled = userEnrollments.includes(course.id);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col bg-white dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <div className="h-60 bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                <img src={course.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="" />
                <div className="absolute top-6 left-6 bg-[#C1121F] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{course.level}</div>
                {isEnrolled && (
                  <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white/90 px-6 py-2 rounded-2xl flex items-center gap-2 border border-white/20 shadow-xl">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-900">{lang === 'EN' ? 'Authorized' : 'ক্রয় করা'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-10 flex-grow flex flex-col">
                <h3 className="text-2xl font-black mb-4 group-hover:text-[#C1121F] transition-colors text-zinc-900 dark:text-white">{course.title[lang]}</h3>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed line-clamp-2">{course.description[lang]}</p>
                <div className="space-y-4 mb-10 flex-grow">
                  <div className="flex items-center gap-3 text-xs font-bold uppercase text-zinc-400"><Clock className="w-4 h-4 text-[#C1121F]" /><span>{course.duration}</span></div>
                  <div className="flex items-center gap-3 text-xs font-bold uppercase text-zinc-400"><BarChart className="w-4 h-4 text-[#C1121F]" /><span>HSK Certified</span></div>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-2xl font-black text-[#C1121F]">৳{course.price}</span>
                  {isEnrolled ? (
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-4 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Start Learning</button>
                  ) : (
                    <button onClick={() => navigate(`/checkout/${course.id}`)} className="px-8 py-4 bg-[#C1121F] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95">Enroll Now</button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;
