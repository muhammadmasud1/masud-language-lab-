
import React, { useState, useEffect } from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
// Fixed: Added FileSearch to the imports from lucide-react
import { Calendar, User, ArrowRight, X, Clock, Tag, PlayCircle, FileText, ImageIcon, FileSearch } from 'lucide-react';
import { Language, Article } from '../types';
import { dataService } from '../services/dataService';

interface Props { lang: Language; }

const BlogPage: React.FC<Props> = ({ lang }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      const allArticles = await dataService.getArticles();
      setArticles(allArticles.filter((a: Article) => a.status === 'published'));
      setIsLoading(false);
    };

    loadArticles();
  }, []);

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <div className="inline-block px-4 py-1.5 bg-red-100 dark:bg-red-900/20 text-[#C1121F] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-red-200 dark:border-red-800/30">
          Global Insight Blog
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-zinc-900 dark:text-white leading-none">
          {lang === 'EN' ? 'Educational Hub' : 'শিক্ষামূলক ব্লগ'}
        </h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium">
          {lang === 'EN' 
            ? 'Access professional articles, visual vocabulary guides, and expert vlogs from our instructors.' 
            : 'আমাদের ইন্সট্রাক্টরদের কাছ থেকে প্রফেশনাল আর্টিকেল, ভিজ্যুয়াল গাইড এবং এক্সপার্ট ভ্লগসমূহ।'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {articles.map((article, idx) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="group cursor-pointer flex flex-col"
            onClick={() => setSelectedArticle(article)}
          >
            <div className="aspect-[16/10] overflow-hidden rounded-[3rem] mb-8 relative border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5">
              <img 
                src={article.image} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                alt={article.title[lang]} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
              
              {article.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 group-hover:scale-110 transition-transform shadow-2xl">
                      <PlayCircle className="w-8 h-8 fill-current" />
                   </div>
                </div>
              )}

              <div className="absolute top-6 left-6 px-4 py-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-zinc-100 dark:border-zinc-800">
                {article.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-[#C1121F]" />}
                {article.type === 'video' && <PlayCircle className="w-3.5 h-3.5 text-[#C1121F]" />}
                {article.type === 'article' && <FileText className="w-3.5 h-3.5 text-[#C1121F]" />}
                {article.category}
              </div>
            </div>
            
            <div className="px-6 flex-grow">
              <div className="flex items-center gap-6 text-[10px] text-zinc-400 dark:text-zinc-500 mb-5 font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {article.date}</span>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Admin Team</span>
              </div>
              <h2 className="text-3xl font-black mb-4 group-hover:text-[#C1121F] transition-colors leading-tight text-zinc-900 dark:text-white tracking-tight">
                {article.title[lang]}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed font-medium line-clamp-2">
                {article.excerpt[lang]}
              </p>
              <div className="inline-flex items-center gap-3 font-black text-[#C1121F] uppercase tracking-widest text-[11px] group/btn">
                {lang === 'EN' ? 'Read Insight' : 'বিস্তারিত দেখুন'} 
                <div className="w-8 h-px bg-current group-hover/btn:w-12 transition-all" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="py-40 text-center opacity-30">
          <FileSearch className="w-16 h-16 mx-auto mb-6" />
          <p className="font-black uppercase tracking-widest text-xs">No posts available yet</p>
        </div>
      )}

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-[#C1121F] border border-red-200/30">
                      {selectedArticle.type === 'image' ? <ImageIcon className="w-5 h-5" /> : selectedArticle.type === 'video' ? <PlayCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{selectedArticle.category}</p>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors text-zinc-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 lg:p-20 scroll-hide">
                <header className="mb-14">
                   <h1 className="text-4xl lg:text-6xl font-black mb-10 leading-[1.1] text-zinc-900 dark:text-white tracking-tighter">{selectedArticle.title[lang]}</h1>
                   
                   <div className="flex items-center gap-8 mb-14 text-xs font-black uppercase tracking-widest">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[#C1121F] font-black border border-zinc-200 dark:border-zinc-700">A</div>
                         <div>
                            <p className="text-zinc-900 dark:text-white mb-1">Admin Editorial</p>
                            <p className="text-zinc-400 opacity-60">Verified Post</p>
                         </div>
                      </div>
                      <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
                      <div>
                         <p className="text-zinc-400 opacity-60 mb-1">Published</p>
                         <p className="text-zinc-900 dark:text-white">{selectedArticle.date}</p>
                      </div>
                   </div>

                   {selectedArticle.type === 'video' && selectedArticle.videoUrl ? (
                      <div className="aspect-video w-full rounded-[3rem] overflow-hidden mb-12 border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl bg-black">
                         <iframe 
                            src={selectedArticle.videoUrl.replace('watch?v=', 'embed/')} 
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                         ></iframe>
                      </div>
                   ) : (
                      <div className="aspect-video w-full rounded-[3rem] overflow-hidden mb-12 border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl">
                         <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
                      </div>
                   )}
                </header>

                <div className="max-w-3xl mx-auto space-y-10 pb-12">
                   <p className="text-2xl font-bold leading-relaxed border-l-8 border-[#C1121F] pl-10 py-2 text-zinc-900 dark:text-zinc-100">
                      {selectedArticle.excerpt[lang]}
                   </p>
                   {selectedArticle.content && (
                     <div className="text-xl leading-[1.8] text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-medium">
                        {selectedArticle.content[lang]}
                     </div>
                   )}
                </div>
              </div>

              <div className="p-10 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end shrink-0">
                 <button onClick={() => setSelectedArticle(null)} className="px-14 py-5 bg-[#C1121F] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all">
                    Return to Feed
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
