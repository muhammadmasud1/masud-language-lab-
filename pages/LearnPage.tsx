
import React, { useState, useEffect } from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { Search, Sparkles, Book, RefreshCw, Volume2, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { getChineseExplanation, getDailyWord } from '../services/geminiService';

interface Props { lang: Language; }

const LearnPage: React.FC<Props> = ({ lang }) => {
  const [search, setSearch] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dailyWord, setDailyWord] = useState<any>(null);

  useEffect(() => {
    fetchDailyWord();
  }, []);

  const fetchDailyWord = async () => {
    const word = await getDailyWord(lang);
    setDailyWord(word);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    const result = await getChineseExplanation(search, lang);
    setExplanation(result || "Error fetching explanation.");
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: AI Assistant */}
        <div className="lg:col-span-2 space-y-12">
          <header>
            <h1 className="text-4xl font-bold mb-4">{lang === 'EN' ? 'Interactive Learning Hub' : 'ইন্টারেক্টিভ লার্নিং হাব'}</h1>
            <p className="text-zinc-500">{lang === 'EN' ? 'Use our AI-powered tool to decode characters and grammar.' : 'ক্যারেক্টার এবং গ্রামার শিখতে আমাদের এআই টুল ব্যবহার করুন।'}</p>
          </header>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl shadow-red-500/5">
            <form onSubmit={handleSearch} className="flex gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === 'EN' ? "Enter any Chinese word or character..." : "যেকোনো চাইনিজ শব্দ বা ক্যারেক্টার লিখুন..."}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#C1121F]"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#C1121F] text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {lang === 'EN' ? 'Analyze' : 'বিশ্লেষণ'}
              </button>
            </form>

            <AnimatePresence mode="wait">
              {explanation ? (
                <motion.div 
                  key="explanation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose dark:prose-invert max-w-none bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {explanation}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-20 text-center text-zinc-400"
                >
                  <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{lang === 'EN' ? 'Results will appear here.' : 'ফলাফল এখানে দেখা যাবে।'}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Daily Word & Tools */}
        <div className="space-y-8">
          <div className="bg-[#C1121F] text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl shadow-red-500/20">
            <div className="absolute top-0 right-0 p-6 text-6xl opacity-10 chinese-font pointer-events-none">语</div>
            <div className="flex justify-between items-start mb-8">
              <h3 className="font-bold text-sm uppercase tracking-widest opacity-80">{lang === 'EN' ? 'Word of the Day' : 'আজকের শব্দ'}</h3>
              <button onClick={fetchDailyWord} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {dailyWord && (
              <div className="space-y-4">
                <div className="text-6xl font-bold chinese-font">{dailyWord.word}</div>
                <div>
                  <div className="text-sm font-bold tracking-widest uppercase opacity-70">Pinyin</div>
                  <div className="text-xl font-medium">{dailyWord.pinyin}</div>
                </div>
                <div>
                  <div className="text-sm font-bold tracking-widest uppercase opacity-70">{lang === 'EN' ? 'Meaning' : 'অর্থ'}</div>
                  <div className="text-xl font-medium">{dailyWord.meaning}</div>
                </div>
                <div className="pt-6 border-t border-white/20 mt-6">
                  <p className="text-sm italic opacity-90">"{dailyWord.example}"</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#C1121F]" />
              {lang === 'EN' ? 'Learning Resources' : 'শিক্ষার উপকরণ'}
            </h3>
            <ul className="space-y-4">
              {[
                { title: 'HSK 1 Vocab List', path: '#' },
                { title: 'Common Phrases', path: '#' },
                { title: 'Radicals Chart', path: '#' },
                { title: 'Practice Quiz', path: '#' },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.path} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:text-[#C1121F] transition-colors group">
                    <span className="font-medium">{item.title}</span>
                    <ArrowRight className="w-4 h-4 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
