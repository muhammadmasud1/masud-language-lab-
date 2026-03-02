
import React from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { ArrowRight, Star, GraduationCap, Globe, PenTool, Sparkles, Languages, ChevronRight, Award, CheckCircle2, ShieldCheck, MessageSquare, Book, Briefcase, Activity, Zap } from 'lucide-react';
import { Language } from '../types';
import { COURSES, TESTIMONIALS, PREMIUM_SERVICES } from '../constants';
import { Link } from 'react-router-dom';

interface Props { lang: Language; }

const HomePage: React.FC<Props> = ({ lang }) => {
  return (
    <div className="overflow-x-hidden bg-white dark:bg-zinc-950 transition-colors">
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center py-10 px-6 overflow-hidden">
        <div className="absolute left-[30%] top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] dark:opacity-[0.02] select-none z-0">
          <span className="text-[40rem] chinese-font font-black leading-none">华</span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950/20 text-[#C1121F] text-[12px] font-black mb-8 border border-red-100 dark:border-red-900/30">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'BN' ? 'সার্টিফায়েড চাইনিজ ইন্সট্রাক্টর' : 'Certified Chinese Instructor'}</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-zinc-900 dark:text-white">
              {lang === 'BN' ? (
                <>নির্ভুলতা এবং গভীরতায় <span className="text-[#C1121F]">চাইনিজ</span> শিখুন।</>
              ) : (
                <>Learn <span className="text-[#C1121F]">Chinese</span> with Precision & Depth.</>
              )}
            </h1>

            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl leading-relaxed font-medium">
              {lang === 'BN' 
                ? 'বাংলাদেশে অভিজ্ঞ বিশেষজ্ঞের কাছ থেকে HSK কোচিং, পেশাদার অনুবাদ সেবা এবং মানসম্মত বই পাবেন।' 
                : 'Get HSK coaching, professional translation services, and quality books from experienced experts in Bangladesh.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-12">
              <Link to="/courses" className="px-10 py-5 bg-[#C1121F] text-white rounded-2xl font-black uppercase tracking-widest text-[13px] hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 group">
                {lang === 'BN' ? 'শিক্ষা শুরু করুন' : 'Start Education'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/quiz" className="px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest text-[13px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl">
                <Sparkles className="w-5 h-5 text-gold" />
                {lang === 'BN' ? 'চাইনিজ লার্ন কুইজ' : 'Chinese Learn Quiz'}
              </Link>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=${i+20}`} className="w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 shadow-sm object-cover" alt="" />
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-1 mb-1">
                   {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-gold fill-current" />)}
                </div>
                <p className="text-[12px] font-black text-zinc-400 uppercase tracking-widest leading-none">
                  {lang === 'BN' ? '১০০+ সফল ছাত্রছাত্রী' : '100+ Successful Students'}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-6 md:-right-10 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl border border-white/50 dark:border-zinc-800/50 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'BN' ? 'HSK সাফল্য' : 'HSK SUCCESS'}</p>
                 <p className="text-xl font-black text-zinc-900 dark:text-white">98% Pass Rate</p>
              </div>
            </motion.div>

            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border-[12px] border-white dark:border-zinc-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative group">
              <img 
                src="https://i.ibb.co.com/w3Q2J8G/1000127502.jpg" 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                alt="Md. Masud Rana" 
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                 <p className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] mb-2">MD. MASUD RANA</p>
                 <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                    Chinese Interpreter & Chinese Language Teacher
                 </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-16 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
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
               className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] p-10 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group"
             >
               <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-[#C1121F] mb-6 shadow-md group-hover:scale-110 transition-transform">
                 <stat.icon className="w-8 h-8" />
               </div>
               <h3 className="text-4xl font-black text-zinc-900 dark:text-white mb-2">{stat.value}</h3>
               <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
             </motion.div>
           ))}
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

      {/* Testimonials Section - Matching Screenshot */}
      <section className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 tracking-tight text-zinc-900 dark:text-white">ছাত্রছাত্রীদের বিশ্বস্ত</h2>
            <div className="flex justify-center gap-1.5 text-gold mb-10">
              {[1,2,3,4,5].map(s => <Star key={s} className="fill-current w-5 h-5" />)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5 relative overflow-hidden group"
              >
                {/* Watermark character */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-9xl chinese-font pointer-events-none select-none">赞</div>
                
                <p className="text-xl md:text-2xl font-medium italic text-zinc-500 dark:text-zinc-300 mb-10 leading-relaxed">
                  "{testimonial.content[lang]}"
                </p>
                
                <div className="flex items-center gap-5">
                  <img src={testimonial.avatar} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-100 dark:border-zinc-800" alt={testimonial.name} />
                  <div>
                    <h4 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider">{testimonial.name}</h4>
                    <p className="text-[10px] font-black text-[#C1121F] uppercase tracking-[0.2em]">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                  ১,০০০+ ছাত্র এবং পেশাদারদের সাথে যোগ দিন যারা আমাদের সাথে নতুন ক্যারিয়ার শুরু করেছেন।
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
