import React from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Award, BookOpen, ShieldCheck, CheckCircle2, Sparkles, BookMarked, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../types';

interface Props { lang: Language; }

const AboutPage: React.FC<Props> = ({ lang }) => {
  const timeline = [
    { year: '2020', title: { EN: 'Thakurgaon Polytechnic Institute', BN: 'ঠাকুরগাঁও পলিটেকনিক ইনস্টিটিউট' } },
    { year: '2024', title: { EN: 'Education at Nilphamari Technical Training Center', BN: 'নীলফামারী টেকনিক্যাল ট্রেনিং সেন্টার এ শিক্ষা গ্রহণ' } },
    { year: '2024', title: { EN: 'Published Master Chinese: 6000 Sentence Book', BN: 'Master Chinese: 6000 Sentence Book বই প্রকাশ' } },
    { year: '2025', title: { EN: 'Official Language Specialist for Major Trade Expos', BN: 'প্রধান ট্রেড এক্সপোর অফিসিয়াল ভাষা বিশেষজ্ঞ' } },
    { year: '2025', title: { EN: 'Confucius Institute at University of Dhaka', BN: 'ঢাকা বিশ্ববিদ্যালয়ের কনফুসিয়াস ইনস্টিটিউট' } },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Hero Section Without Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-stretch">
        {/* Brand Mission Visual Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 md:p-10 rounded-[3rem] text-white flex flex-col justify-between border border-zinc-800 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="w-16 h-16 bg-[#C1121F] rounded-2xl flex items-center justify-center text-white font-black text-3xl chinese-font shadow-lg shadow-red-500/20">
                书
              </div>
              <span className="px-4 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                MandarinShelf
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {lang === 'EN' ? 'Digital Chinese Literature & PDF Books' : 'বাংলাভাষীদের জন্য স্ট্যান্ডার্ড চাইনিজ ই-বুক'}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8">
              {lang === 'EN' 
                ? 'Creating Bangladesh’s most accurate, easy-to-read, and structured digital Mandarin Chinese learning materials for students, professionals, and HSK test-takers.' 
                : 'বাংলাদেশী শিক্ষার্থীদের জন্য সঠিক উচ্চারণ, পিনয়িন ও বাংলা অর্থসহ প্রমিত ম্যান্ডারিন ভাষা শিক্ষার ডিজিটাল লাইব্রেরি।'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-2xl font-black text-white mb-1">HSK 1-6</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{lang === 'EN' ? 'Full Curriculum' : 'সম্পূর্ণ সিলেবাস'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-2xl font-black text-[#C1121F] mb-1">6,000+</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{lang === 'EN' ? 'Sentences' : 'প্রয়োজনীয় বাক্য'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-2xl font-black text-amber-400 mb-1">2+ Yrs</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{lang === 'EN' ? 'Experience' : 'অভিজ্ঞতা'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-2xl font-black text-emerald-400 mb-1">100%</p>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{lang === 'EN' ? 'Instant Access' : 'ইনস্ট্যান্ট ডাউনলোড'}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">{lang === 'EN' ? 'Explore Digital Shelf' : 'আমাদের বইয়ের কালেকশন'}</span>
            <Link 
              to="/store" 
              className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-red-400 transition-colors uppercase tracking-wider"
            >
              {lang === 'EN' ? 'View Store' : 'স্টোর দেখুন'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
        
        {/* Story & Philosophy */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-[#C1121F] text-xs font-black uppercase tracking-wider w-fit mb-4">
            <BookMarked className="w-4 h-4" />
            {lang === 'EN' ? 'About the Founder & Author' : 'প্রতিষ্ঠাতা ও লেখকের পরিচিতি'}
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white leading-tight">
            {lang === 'EN' ? "Hi, I'm Masud." : "আমি মাসুদ।"}
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed">
            {lang === 'EN' 
              ? "My journey with the Chinese language began in a small corner of Bangladesh. Through my own interest, patience, and regular efforts, I realized while learning that there is a deep lack of quality Chinese learning resources in Bangladesh. From the desire to fill that gap, I gradually involved myself in the world of learning and teaching. Now my only goal is that those who want to learn Chinese in our country get the opportunity to learn easily, correctly and with confidence." 
              : "চীনা ভাষার সাথে আমার যাত্রা শুরু বাংলাদেশের ছোট্ট একটি কোণ থেকেই। নিজের আগ্রহ, ধৈর্য ও নিয়মিত প্রচেষ্টায় ভাষাটি শিখতে শিখতেই বুঝেছি—বাংলাদেশে চাইনিজ শেখার জন্য মানসম্মত রিসোর্সের অভাব কতটা গভীর। সেই ব্যবধান পূরণ করার ইচ্ছা থেকেই ধীরে ধীরে শেখা ও শেখানোর জগতে নিজেকে সম্পৃক্ত করেছি। এখন আমার লক্ষ্য একটাই—যারা আমাদের দেশে চীনা ভাষা শিখতে চান, তারা যেন সহজে, সঠিকভাবে ও আস্থার সঙ্গে শেখার সুযোগ পান।"}
          </p>

          <p className="text-base text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            {lang === 'EN'
              ? "Through MandarinShelf, we have digitized and compiled comprehensive Chinese learning guides, sentence banks, and HSK test preparations tailored directly in clear Bengali so anyone can master Mandarin without linguistic barriers."
              : "MandarinShelf-এর মাধ্যমে আমরা প্রতিটি বই অত্যন্ত যত্নের সাথে বাংলা ও চাইনিজ বর্ণে সাজিয়েছি, যাতে যে কেউ ঘরে বসেই কোনো দ্বিধা ছাড়াই সঠিকভাবে চাইনিজ পড়তে ও লিখতে পারেন।"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-[#C1121F] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">
                  {lang === 'EN' ? 'Top Rated Instructor' : 'টপ রেটেড প্রশিক্ষক'}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {lang === 'EN' ? 'Certified HSK Master with focus on tonal precision.' : 'প্রত্যয়িত HSK মাস্টার ও টোনাল প্রিসিশন ট্রেইনার।'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/30 text-[#C1121F] shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">
                  {lang === 'EN' ? 'Author & Researcher' : 'লেখক ও গবেষক'}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {lang === 'EN' ? 'Creator of standard Bengali-Chinese learning literature.' : 'বাংলা-চাইনিজ লার্নিং রেফারেন্স বইয়ের রচয়িতা।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Affiliations */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 my-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-12 text-center tracking-tight text-zinc-900 dark:text-white">
            {lang === 'EN' ? 'Certifications & Affiliations' : 'সার্টিফিকেশন এবং অধিভুক্তি'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-left shadow-sm">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-[#C1121F] mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">Confucius Institute</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {lang === 'EN' 
                  ? 'Affiliated with the Confucius Institute at the University of Dhaka (2025), promoting cultural and linguistic exchange.' 
                  : 'ঢাকা বিশ্ববিদ্যালয়ের কনফুসিয়াস ইনস্টিটিউটের (২০২৫) সাথে সম্পৃক্ত, যা সাংস্কৃতিক ও ভাষাগত বিনিময়ে ভূমিকা রাখছে।'}
              </p>
            </div>
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 text-left shadow-sm">
              <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-[#C1121F] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">HSK Certified</h4>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                {lang === 'EN' 
                  ? 'Certified HSK 4 and HSK 6 proficiency, ensuring the highest standards of Mandarin instruction.' 
                  : 'HSK ৪ এবং HSK ৬ প্রত্যয়িত দক্ষতা, যা মানসম্মত ম্যান্ডারিন শিক্ষার নিশ্চয়তা দেয়।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20 border-y border-zinc-200 dark:border-zinc-800">
        <h2 className="text-4xl font-black text-center mb-16 text-zinc-900 dark:text-white tracking-tight">
          {lang === 'EN' ? 'My Journey' : 'আমার যাত্রা'}
        </h2>
        <div className="max-w-4xl mx-auto space-y-10 relative before:content-[''] before:absolute before:left-[11px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
          {timeline.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-6 h-6 rounded-full bg-[#C1121F] border-4 border-white dark:border-zinc-950 z-10 shrink-0"></div>
              <div className="flex-1 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-xs font-black text-[#C1121F] tracking-widest block mb-1">{item.year}</span>
                <h4 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white leading-tight mx-auto">{item.title[lang]}</h4>
              </div>
              <div className="flex-1 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center">
          <div className="text-6xl md:text-8xl text-zinc-100 dark:text-zinc-900 chinese-font mb-8 select-none">三人行, 必有我师</div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 italic text-zinc-900 dark:text-white">"Sān rén xíng, bì yǒu wǒ shī"</h3>
            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
              {lang === 'EN' 
                ? '"When three people walk together, there is always one who can be my teacher."' 
                : '"যখন তিনজন একসাথে হাঁটে, তখন অবশ্যই তাদের মধ্যে একজন আমার শিক্ষক হতে পারে।"'}
            </p>
            <p className="mt-6 text-sm font-black text-[#C1121F] uppercase tracking-[0.3em]">- Confucius</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
