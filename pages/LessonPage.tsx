
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { 
  Play, ChevronRight, ChevronLeft, ArrowLeft, Video, 
  Lock, BookOpen, Clock, CheckCircle2, Volume2, Maximize2, ShieldAlert
} from 'lucide-react';
import { Language, User, Lesson, Course, Enrollment } from '../types';
import { dataService } from '../services/dataService';
import { getYouTubeEmbedUrl } from '../utils/youtube';

interface Props {
  lang: Language;
  user: User;
  setUser: (user: User) => void;
}

const LessonPage: React.FC<Props> = ({ lang, user, setUser }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLessonComplete = async (lessonId: string) => {
    if (user.completedLessons.includes(lessonId)) return;

    const updatedCompletedLessons = [...user.completedLessons, lessonId];
    const updatedUser = { ...user, completedLessons: updatedCompletedLessons };
    
    const success = await dataService.updateUser(user.id, { completedLessons: updatedCompletedLessons });
    if (success) {
      setUser(updatedUser);
      localStorage.setItem('huayu_user', JSON.stringify(updatedUser));
    }
  };

  const currentIndex = lessons.findIndex(l => l.id === currentLesson?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;
  const handlePrev = () => { if (hasPrev) setCurrentLesson(lessons[currentIndex - 1]); };
  const handleNext = () => { if (hasNext) setCurrentLesson(lessons[currentIndex + 1]); };

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      try {
        // 1. Authorization Check
        const enrollments = await dataService.getEnrollments(user.id);
        const userEnrollment = enrollments.find(e => e.courseId === courseId);
        
        if (!userEnrollment || userEnrollment.status !== 'approved') {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // 2. Fetch Course & Lessons
        const [allCourses, courseLessons] = await Promise.all([
          dataService.getCourses(),
          dataService.getLessons(courseId)
        ]);

        const foundCourse = allCourses.find(c => c.id === courseId);
        if (!foundCourse) { 
          navigate('/dashboard'); 
          return; 
        }

        setCourse(foundCourse);
        setIsAuthorized(true);
        
        const publishedLessons = courseLessons
          .filter(l => l.status === 'published')
          .sort((a, b) => a.order - b.order);
        
        setLessons(publishedLessons);
        if (publishedLessons.length > 0) {
          setCurrentLesson(publishedLessons[0]);
        }
      } catch (err) {
        console.error("Error loading lesson data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLessonData();
  }, [courseId, user.id, navigate]);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C1121F]/20 border-t-[#C1121F] rounded-full animate-spin"></div>
    </div>
  );

  if (isAuthorized === false) return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-8" />
        <h2 className="text-3xl font-black mb-4">Access Restricted</h2>
        <p className="text-zinc-500 mb-10 text-lg">You do not have active approval for this curriculum yet.</p>
        <button onClick={() => navigate('/dashboard')} className="px-10 py-4 bg-zinc-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Return to Dashboard</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-96 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 h-auto lg:h-[calc(100vh-6rem)] sticky top-24 flex flex-col z-20 shadow-sm">
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-[#C1121F] font-black text-[10px] uppercase tracking-widest mb-6 hover:gap-3 transition-all"><ArrowLeft className="w-4 h-4" /> Back to Portal</button>
          <h2 className="text-xl font-black leading-tight mb-4">{course?.title[lang]}</h2>
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-zinc-500">{lessons.length} Units Available</div>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-3">
          {lessons.map((lesson, idx) => (
            <button 
              key={lesson.id} 
              onClick={() => setCurrentLesson(lesson)} 
              className={`w-full text-left p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                currentLesson?.id === lesson.id 
                ? 'bg-[#C1121F] border-[#C1121F] text-white shadow-xl shadow-red-500/20' 
                : 'bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 ${
                currentLesson?.id === lesson.id ? 'bg-white/20' : 'bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800'
              }`}>
                {idx + 1}
              </div>
              <p className="font-bold text-sm leading-tight pt-2">{lesson.title}</p>
            </button>
          ))}
          {lessons.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                 <Lock className="w-6 h-6" />
              </div>
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">No lessons released yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentLesson ? (
            <motion.div 
              key={currentLesson.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="max-w-6xl mx-auto pb-24"
            >
              <h1 className="text-4xl font-black mb-10 tracking-tight text-zinc-900 dark:text-white leading-tight">{currentLesson.title}</h1>
              
              <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-black shadow-2xl border-4 border-white dark:border-zinc-800 mb-12 relative group">
                <iframe 
                  src={getYouTubeEmbedUrl(currentLesson.videoUrl)} 
                  className="w-full h-full" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="flex justify-between items-center mb-12">
                <button 
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2 hover:bg-zinc-300 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button 
                  onClick={() => handleLessonComplete(currentLesson.id)}
                  className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 ${
                    user.completedLessons.includes(currentLesson.id) 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                    : 'bg-zinc-900 text-white hover:bg-[#C1121F] shadow-xl shadow-zinc-900/20'
                  }`}
                >
                  {user.completedLessons.includes(currentLesson.id) ? (
                    <><CheckCircle2 className="w-5 h-5" /> Completed</>
                  ) : (
                    'Mark as Completed'
                  )}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center gap-2 hover:bg-zinc-300 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-8xl chinese-font pointer-events-none select-none">学</div>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-[#C1121F]" />
                  Instructional Notes
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed font-medium">
                  {lang === 'EN' 
                    ? "This professional lesson focuses on tonal accuracy and essential Hanzi structures. Please watch carefully and complete associated exercises in your workbook." 
                    : "এই লেসনটি চাইনিজ টোন এবং হাক্সি (Hanzi) স্ট্রাকচারের ওপর ভিত্তি করে তৈরি। ভিডিওটি মনোযোগ দিয়ে দেখুন এবং আপনার ওয়ার্কবুকের সংশ্লিষ্ট কাজগুলো সম্পন্ন করুন।"}
                </p>
                
                <div className="mt-10 pt-10 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-2xl flex items-center justify-center text-green-600">
                         <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-zinc-400">Status</p>
                         <p className="font-bold text-sm">Verified Content</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center text-blue-600">
                         <Clock className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase text-zinc-400">Duration</p>
                         <p className="font-bold text-sm">Full Session</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center opacity-30">
              <div className="max-w-xs">
                <Play className="w-20 h-20 mb-6 mx-auto text-[#C1121F]" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Select a unit from the sidebar to begin your session</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LessonPage;
