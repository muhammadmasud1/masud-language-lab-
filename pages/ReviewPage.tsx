
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquare, Sparkles, CheckCircle } from 'lucide-react';
import { Language, Review } from '../types';
import { dataService } from '../services/dataService';

interface Props { lang: Language; }

const ReviewPage: React.FC<Props> = ({ lang }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await dataService.getReviews();
        console.log('Fetched reviews:', data);
        setReviews(data.filter(r => r.status === 'published'));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const translations = {
    title: { EN: 'Student Reviews', BN: 'শিক্ষার্থীদের মতামত' },
    subtitle: { EN: 'What our students say about their learning experience.', BN: 'আমাদের শিক্ষার্থীদের শেখার অভিজ্ঞতা সম্পর্কে তাদের মতামত।' },
    noReviews: { EN: 'No reviews yet.', BN: 'এখনও কোনো রিভিউ নেই।' }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C1121F]/10 rounded-full text-[#C1121F] text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              {lang === 'EN' ? 'Wall of Love' : 'ভালোবাসার দেয়াল'}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter leading-tight">
              {translations.title[lang]}
            </h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              {translations.subtitle[lang]}
            </p>
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial from-[#C1121F]/5 to-transparent blur-3xl pointer-events-none -z-10" />
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#C1121F]/20 border-t-[#C1121F] rounded-full animate-spin" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="break-inside-avoid bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all overflow-hidden group"
              >
                {/* Screenshot Image */}
                {review.image && (
                  <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img 
                      src={review.image} 
                      alt={review.userName || 'Review Screenshot'}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-[#C1121F] shadow-sm border border-red-100 dark:border-red-900/30">
                      {lang === 'EN' ? 'Verified Purchase' : 'ভেরিফাইড পারচেজ'}
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-200 dark:text-zinc-800'}`} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-[#C1121F]">
                      <CheckCircle className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verified Buy</span>
                    </div>
                  </div>

                  {review.content?.[lang] && (
                    <div className="relative">
                      <Quote className="w-8 h-8 text-zinc-100 dark:text-zinc-800 absolute -top-4 -left-2 -z-0" />
                      <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic relative z-10 text-sm">
                        "{review.content[lang]}"
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{review.date}</span>
                    <div className="w-6 h-6 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 font-bold">{translations.noReviews[lang]}</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 mt-32">
        <div className="bg-[#C1121F] rounded-[3rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-red-500/20">
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tighter">
              {lang === 'EN' ? 'Ready to Start Your Journey?' : 'আপনার যাত্রা শুরু করতে প্রস্তুত?'}
            </h2>
            <p className="text-white/80 font-medium mb-10 max-w-xl mx-auto">
              {lang === 'EN' ? 'Join thousands of students and master a new language today.' : 'হাজার হাজার শিক্ষার্থীর সাথে যোগ দিন এবং আজই একটি নতুন ভাষা শিখুন।'}
            </p>
            <a 
              href="#/courses" 
              className="inline-flex items-center gap-3 bg-white text-[#C1121F] px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-100 transition-all active:scale-95 shadow-xl"
            >
              {lang === 'EN' ? 'Explore Courses' : 'কোর্সগুলো দেখুন'}
            </a>
          </div>
          
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
