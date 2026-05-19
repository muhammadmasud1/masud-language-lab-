
import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { ArrowRight, Star, GraduationCap, Globe, PenTool, Sparkles, Languages, ChevronRight, Award, CheckCircle2, ShieldCheck, MessageSquare, Book, Briefcase, Activity, Zap } from 'lucide-react';
import { Language } from '../types';
import { COURSES, TESTIMONIALS, PREMIUM_SERVICES } from '../constants';
import { Link } from 'react-router-dom';

interface Props { lang: Language; }

const HomePage: React.FC<Props> = ({ lang }) => {
  const heroSlides = [
    {
      id: 1,
      title: lang === 'BN' ? (
        <>নির্ভুলতা এবং গভীরতায় <span className="text-[#C1121F]">চাইনিজ</span> শিখুন</>
      ) : (
        <>Learn <span className="text-[#C1121F]">Chinese</span> with Precision & Depth</>
      ),
      description: lang === 'BN' 
        ? 'বাংলাদেশে অভিজ্ঞ বিশেষজ্ঞের কাছ থেকে HSK কোচিং এবং মানসম্মত শিক্ষা নিশ্চিত করুন।' 
        : 'Ensure quality education and HSK coaching from experienced experts in Bangladesh.',
      image: "https://i.ibb.co.com/BVt9KnYL/file-00000000819071fdac0a25375e832d12-2.jpg",
      badge: lang === 'BN' ? 'সার্টিফায়েড চাইনিজ ইন্সট্রাক্টর' : 'Certified Chinese Instructor',
      cta: lang === 'BN' ? 'শিক্ষা শুরু করুন' : 'Start Education',
      link: "/courses",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "#C1121F"
    },
    {
      id: 2,
      title: lang === 'BN' ? (
        <>পেশাদার <span className="text-blue-600">অনুবাদ</span> এবং দোভাষী সেবা</>
      ) : (
        <>Professional <span className="text-blue-600">Translation</span> & Interpreting</>
      ),
      description: lang === 'BN' 
        ? 'উচ্চপর্যায়ের ব্যবসায়িক সম্মেলন এবং ফ্যাক্টরি ভিজিটের জন্য নির্ভরযোগ্য দোভাষী সেবা।' 
        : 'Reliable interpretation services for high-level business summits and factory visits.',
      image: "https://i.ibb.co.com/YTZ3mxcV/Whats-App-Image-2026-05-19-at-10-21-51-PM.jpg",
      badge: lang === 'BN' ? 'পেশাদার অনুবাদক' : 'Professional Interpreter',
      cta: lang === 'BN' ? 'সেবা গ্রহণ করুন' : 'Get Service',
      link: "/interpreter",
      icon: <Globe className="w-5 h-5" />,
      color: "#2563eb"
    },
    {
      id: 3,
      title: lang === 'BN' ? (
        <>সেরা মানের চাইনিজ <span className="text-orange-500">বইসমূহ</span></>
      ) : (
        <>Top Quality Chinese <span className="text-orange-500">Books</span> & Resources</>
      ),
      description: lang === 'BN' 
        ? 'সহজ ও কার্যকর ভাবে চাইনিজ শিখতে আমাদের সংকলিত বইগুলো সংগ্রহ করুন।' 
        : 'Collect our compiled books to learn Chinese easily and effectively.',
      image: "https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1200",
      badge: lang === 'BN' ? 'প্রধান লেখক' : 'Lead Author',
      cta: lang === 'BN' ? 'বই কিনুন' : 'Buy Books',
      link: "/store",
      icon: <Book className="w-5 h-5" />,
      color: "#f59e0b"
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="overflow-x-hidden bg-white dark:bg-zinc-950 transition-colors">
      
      {/* Immersive Hero Carousel Section */}
      <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center py-20 px-6 overflow-hidden">
        {/* Background Chinese Character Animation */}
        <div className="absolute left-[30%] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] dark:opacity-[0.02] select-none z-0">
          <motion.span 
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-[40rem] chinese-font font-black leading-none"
          >
            {currentSlide === 0 ? '教' : currentSlide === 1 ? '译' : '书'}
          </motion.span>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[12px] font-black mb-10 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>{heroSlides[currentSlide].badge}</span>
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white">
                  {heroSlides[currentSlide].title}
                </h1>

                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 mb-12 max-w-2xl leading-relaxed font-medium">
                  {heroSlides[currentSlide].description}
                </p>

                <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-16">
                  <Link 
                    to={heroSlides[currentSlide].link} 
                    className="px-12 py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] font-black uppercase tracking-widest text-[14px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 shadow-2xl"
                  >
                    {heroSlides[currentSlide].icon}
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/about" className="px-12 py-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-2 border-zinc-100 dark:border-zinc-800 rounded-[2rem] font-black uppercase tracking-widest text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3">
                    {lang === 'BN' ? 'বিস্তারিত জানুন' : 'Learn More'}
                  </Link>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${i+50}`} className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-950 shadow-xl object-cover" alt="" />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex gap-1 mb-1.5">
                       {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-gold fill-current" />)}
                    </div>
                    <p className="text-[12px] font-black text-zinc-400 uppercase tracking-widest">
                      {lang === 'BN' ? '১০০+ ছাত্রছাত্রীদের ভালোবাসা' : 'Loved by 100+ Students'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`img-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="lg:col-span-5 relative"
            >
              {/* HSK Success Card - Matching Screenshot */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-16 -right-12 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white dark:border-zinc-800 flex items-center gap-4"
              >
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600">
                   <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1.5">{lang === 'BN' ? 'HSK সাফল্য' : 'HSK SUCCESS'}</p>
                   <p className="text-xl font-black text-zinc-900 dark:text-white leading-none">98% Pass Rate</p>
                </div>
              </motion.div>

              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-[16px] border-white dark:border-zinc-900 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.4)] relative group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={heroSlides[currentSlide].image}
                    src={heroSlides[currentSlide].image} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1 }}
                    className="w-full h-full object-cover transition-all" 
                    alt="MD. MASUD RANA" 
                  />
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                   <p className="text-zinc-300 font-bold uppercase tracking-widest text-[12px] mb-3">MD. MASUD RANA</p>
                   <h3 className="text-2xl md:text-3xl font-black text-white leading-[1.2] tracking-tight">
                      {lang === 'BN' ? 'চাইনিজ দোভাষী এবং ভাষা প্রশিক্ষক' : 'Chinese Interpreter & Language Teacher'}
                   </h3>
                </div>
              </div>

              {/* Slider Indicators */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-12 bg-[#C1121F]' : 'w-3 bg-zinc-300 dark:bg-zinc-700'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: lang === 'BN' ? 'অভিজ্ঞতা' : 'Experience', value: '2+', icon: MessageSquare },
              { label: lang === 'BN' ? 'ছাত্রছাত্রী' : 'Students', value: '100+', icon: GraduationCap },
              { label: lang === 'BN' ? 'বই বিক্রি' : 'Books Sold', value: '1K+', icon: Book },
              { label: lang === 'BN' ? 'প্রকল্প' : 'Projects', value: '10+', icon: ShieldCheck },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] p-12 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-[#C1121F] mb-8 shadow-lg group-hover:scale-110 transition-transform">
                  <stat.icon className="w-10 h-10" />
                </div>
                <h3 className="text-5xl font-black text-zinc-900 dark:text-white mb-3">{stat.value}</h3>
                <p className="text-[12px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 px-6 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="text-center md:text-left">
               <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 tracking-tight leading-none">আমাদের জনপ্রিয় কোর্সসমূহ</h2>
               <p className="text-zinc-500 max-w-xl font-medium leading-relaxed">
                 HSK প্রস্তুতি থেকে বিশেষায়িত ব্যবসায়িক চাইনিজ পর্যন্ত, আপনার লক্ষ্য অনুযায়ী আমাদের পাঠ্যক্রম রয়েছে।
               </p>
            </div>
            <Link to="/courses" className="flex items-center gap-2 text-[#C1121F] font-black text-sm uppercase tracking-widest hover:gap-3 transition-all group">
              সকল কোর্স দেখুন <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-zinc-100 dark:border-zinc-800 flex flex-col text-center shadow-xl shadow-black/5 hover:shadow-2xl hover:-translate-y-2 transition-all group"
              >
                {/* Top Icon */}
                <div className="w-14 h-14 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-[#C1121F] mx-auto mb-8">
                  <GraduationCap className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight group-hover:text-[#C1121F] transition-colors">{course.title[lang]}</h3>
                <p className="text-zinc-500 text-[15px] font-medium leading-relaxed mb-10 flex-grow">
                  {course.description[lang]}
                </p>

                {/* Footer Row */}
                <div className="flex items-center justify-between pt-8 border-t border-zinc-50 dark:border-zinc-800">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1">মূল্য</p>
                    <p className="text-2xl font-black text-[#C1121F]">{course.price}</p>
                  </div>
                  <Link to={`/checkout/${course.id}`} className="w-14 h-14 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg active:scale-95">
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Lab Promotion Section */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950 overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#C1121F]/10 rounded-full blur-3xl" />
            <div className="relative aspect-square bg-zinc-900 rounded-[4rem] border border-zinc-800 p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {[1,2,3].map(i => <div key={i} className="w-3 h-3 rounded-full bg-zinc-800" />)}
                </div>
                <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Live Engine</span>
                </div>
              </div>
              
              <div className="flex-grow flex items-center justify-center">
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-[#C1121F] rounded-full blur-2xl"
                  />
                  <div className="w-48 h-48 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center relative z-10 overflow-hidden">
                    <img src="https://picsum.photos/seed/live/300/300" className="w-full h-full object-cover opacity-50" alt="Live Lab" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                    <Activity className="absolute bottom-8 w-12 h-12 text-[#C1121F]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 h-12 items-end">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [10, 30, 15, 40, 10][i % 5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="bg-[#C1121F]/40 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 text-[12px] font-black mb-8 border border-blue-100 dark:border-blue-900/30 uppercase tracking-widest">
              <Zap className="w-4 h-4" />
              <span>{lang === 'BN' ? 'নতুন ফিচার' : 'New Feature'}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-8 tracking-tight leading-none">
              {lang === 'BN' ? 'লাইভ চাইনিজ ল্যাব' : 'Live Chinese Lab'}
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
              {lang === 'BN' 
                ? 'আমাদের নতুন এআই-পাওয়ারড লাইভ ল্যাবে রিয়েল-টাইমে কথা বলা অনুশীলন করুন। সরাসরি ভিডিও এবং অডিও কলের মাধ্যমে আপনার উচ্চারণ এবং টোন উন্নত করুন।' 
                : 'Practice speaking in real-time with our new AI-powered Live Lab. Improve your pronunciation and tones through direct video and audio calls.'}
            </p>
            <Link to="/live-lab" className="inline-flex items-center gap-4 px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-[13px] hover:scale-105 transition-all shadow-2xl group">
              {lang === 'BN' ? 'ল্যাব শুরু করুন' : 'Enter Live Lab'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section - Attractive Carousel */}
      <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="text-5xl font-black mb-4 tracking-tight text-zinc-900 dark:text-white">छाত্রছাত্রীদের বিশ্বস্ত</h2>
          <div className="flex justify-center gap-1.5 text-gold mb-10">
            {[1,2,3,4,5].map(s => <Star key={s} className="fill-current w-5 h-5" />)}
          </div>
        </div>

        <div className="relative">
          {/* Gradient Masks for a polished look */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
          
          <div className="flex">
            <motion.div 
              className="flex gap-8 py-10"
              animate={{ 
                x: [0, -1920] // Adjust based on total width
              }}
              transition={{ 
                duration: 40, 
                ease: "linear", 
                repeat: Infinity 
              }}
              style={{ width: "fit-content" }}
            >
              {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="w-[350px] md:w-[450px] shrink-0 bg-white dark:bg-zinc-900 p-10 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-[#C1121F] transition-colors"
                >
                  {/* Watermark character */}
                  <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-9xl chinese-font pointer-events-none select-none">赞</div>
                  
                  <div className="flex gap-1 mb-6 text-gold">
                    {[1,2,3,4,5].map(s => <Star key={s} className="fill-current w-3 h-3" />)}
                  </div>

                  <p className="text-lg md:text-xl font-medium italic text-zinc-500 dark:text-zinc-300 mb-10 leading-relaxed min-h-[120px]">
                    "{testimonial.content[lang]}"
                  </p>
                  
                  <div className="flex items-center gap-5">
                    <img src={testimonial.avatar} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-100 dark:border-zinc-800" alt={testimonial.name} />
                    <div>
                      <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">{testimonial.name}</h4>
                      <p className="text-[9px] font-black text-[#C1121F] uppercase tracking-[0.2em]">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
           <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">
             {lang === 'BN' ? '১০০+ ছাত্রছাত্রীদের সাথে যোগ দিন' : 'Join 100+ satisfied students'}
           </p>
        </div>
      </section>

      {/* CTA Section - Matching Screenshot */}
      <section className="py-12 px-6 mb-20">
        <div className="max-w-7xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-[#C1121F] rounded-[4rem] p-10 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-red-900/30"
           >
              {/* Abstract Chinese Character Background */}
              <div className="absolute -bottom-20 -right-20 opacity-10 text-[35rem] chinese-font pointer-events-none select-none">书</div>
              
              <div className="relative z-10">
                <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-tight">চাইনিজ শিখতে প্রস্তুত?</h2>
                <p className="text-lg md:text-2xl opacity-80 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
                  ১০০+ ছাত্র এবং পেশাদারদের সাথে যোগ দিন যারা আমাদের সাথে নতুন ক্যারিয়ার শুরু করেছেন।
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                   <Link to="/quiz" className="w-full sm:w-auto px-12 py-6 bg-white text-[#C1121F] rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-zinc-100 transition-all active:scale-95">
                      <Sparkles className="w-5 h-5" /> ফ্রি কুইজ শুরু করুন
                   </Link>
                   <Link to="/register" className="w-full sm:w-auto px-12 py-6 bg-[#780000] text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all active:scale-95">
                      এখনি নিবন্ধন করুন
                   </Link>
                </div>
              </div>
           </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
