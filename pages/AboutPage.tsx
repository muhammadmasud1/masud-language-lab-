
import React from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Award, Book, Heart, Search } from 'lucide-react';
import { Language } from '../types';

interface Props { lang: Language; }

const AboutPage: React.FC<Props> = ({ lang }) => {
  const timeline = [
    { year: '2020', title: { EN: 'Thakurgaon Polytechnic Institute', BN: 'ঠাকুরগাঁও পলিটেকনিক ইনস্টিটিউট' } },
    { year: '2024', title: { EN: 'Education at Nilphamari Technical Training Center', BN: 'নীলফামারী টেকনিক্যাল ট্রেনিং সেন্টার এ শিক্ষা গ্রহণ' } },
    { year: '2024', title: { EN: 'Published Master Chinese: 6000 Sentence Book', BN: 'Master Chinese: 6000 Sentence Book বই প্রকাশ' } },
    { year: '2025', title: { EN: 'Official Interpreter for Major Trade Expos', BN: 'প্রধান ট্রেড এক্সপোর অফিসিয়াল অনুবাদক' } },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="relative flex justify-center lg:justify-start"
        >
          {/* Wrapper for image and badge to ensure perfect alignment */}
          <div className="relative w-full max-w-md">
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden bg-zinc-200 shadow-2xl relative">
              <img src="https://i.ibb.co.com/w3Q2J8G/1000127502.jpg" className="w-full h-full object-cover" alt="Md. Masud Rana" />
            </div>
            {/* The Badge - Positioned absolutely to the image container */}
            <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-32 h-32 md:w-40 md:h-40 bg-[#C1121F] rounded-full flex items-center justify-center text-white p-4 md:p-6 text-center text-xs md:text-sm font-bold rotate-12 shadow-xl z-10">
              2+ {lang === 'EN' ? 'Years of Experience' : 'বছরের অভিজ্ঞতা'}
            </div>
          </div>
        </motion.div>
        
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-bold mb-8 text-zinc-900 dark:text-white">
            {lang === 'EN' ? "Hi, I'm Masud." : "আমি মাসুদ।"}
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            {lang === 'EN' 
              ? "My journey with the Chinese language began in a small corner of Bangladesh. Through my own interest, patience, and regular efforts, I realized while learning that there is a deep lack of quality Chinese learning resources in Bangladesh. From the desire to fill that gap, I gradually involved myself in the world of learning and teaching. Now my only goal is that those who want to learn Chinese in our country get the opportunity to learn easily, correctly and with confidence." 
              : "আমি মাসুদ। চীনা ভাষার সাথে আমার যাত্রা শুরু বাংলাদেশের ছোট্ট একটি কোণ থেকেই। নিজের আগ্রহ, ধৈর্য ও নিয়মিত প্রচেষ্টায় ভাষাটি শিখতে শিখতেই বুঝেছি—বাংলাদেশে চাইনিজ শেখার জন্য মানসম্মত রিসোর্সের অভাব কতটা গভীর। সেই ব্যবধান পূরণ করার ইচ্ছা থেকেই ধীরে ধীরে শেখা ও শেখানোর জগতে নিজেকে সম্পৃক্ত করেছি। এখন আমার লক্ষ্য একটাই—যারা আমাদের দেশে চীনা ভাষা শিখতে চান, তারা যেন সহজে, সঠিকভাবে ও আস্থার সঙ্গে শেখার সুযোগ পান।"}
          </p>
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <div className="flex gap-4">
              <Award className="w-6 h-6 text-[#C1121F] shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-zinc-900 dark:text-white">{lang === 'EN' ? 'Top Rated Instructor' : 'টপ রেটেড ইন্সট্রাক্টর'}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{lang === 'EN' ? 'Certified HSK 4 Master and Expert Trainer.' : 'প্রত্যয়িত HSK 4 মাস্টার এবং বিশেষজ্ঞ প্রশিক্ষক।'}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Book className="w-6 h-6 text-[#C1121F] shrink-0" />
              <div className="text-left">
                <h4 className="font-bold text-zinc-900 dark:text-white">{lang === 'EN' ? 'Author & Researcher' : 'লেখক ও গবেষক'}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{lang === 'EN' ? 'Authored 2 best-selling books on Chinese language.' : 'চাইনিজ ভাষার ওপর 2টি বেস্ট সেলিং বইয়ের লেখক।'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="py-24 border-y border-zinc-200 dark:border-zinc-800">
        <h2 className="text-4xl font-black text-center mb-16 text-zinc-900 dark:text-white tracking-tight">
          {lang === 'EN' ? 'My Journey' : 'আমার যাত্রা'}
        </h2>
        <div className="max-w-4xl mx-auto space-y-12 relative before:content-[''] before:absolute before:left-[11px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800">
          {timeline.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-6 h-6 rounded-full bg-[#C1121F] border-4 border-white dark:border-zinc-950 z-10 shrink-0"></div>
              <div className="flex-1 p-8 bg-zinc-50 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                <span className="text-sm font-black text-[#C1121F] tracking-widest block mb-2">{item.year}</span>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mx-auto">{item.title[lang]}</h4>
              </div>
              <div className="flex-1 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 text-center">
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
