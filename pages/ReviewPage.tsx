
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquare, Sparkles } from 'lucide-react';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all relative group"
              >
                <div className="absolute top-8 right-8 text-zinc-100 dark:text-zinc-800 group-hover:text-[#C1121F]/10 transition-colors">
                  <Quote className="w-12 h-12 fill-current" />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-zinc-800">
                    <img 
                      src={review.image || `https://ui-avatars.com/api/?name=${review.userName}&background=random`} 
                      alt={review.userName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-zinc-900 dark:text-white leading-tight">{review.userName || (lang === 'EN' ? 'Anonymous Student' : 'অজ্ঞাত শিক্ষার্থী')}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{review.userRole || (lang === 'EN' ? 'Student' : 'শিক্ষার্থী')}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-200 dark:text-zinc-800'}`} 
                    />
                  ))}
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                  "{review.content?.[lang] || (lang === 'EN' ? 'No content provided.' : 'কোনো তথ্য প্রদান করা হয়নি।')}"
                </p>

                <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{review.date}</span>
                  <div className="w-8 h-8 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                    <MessageSquare className="w-4 h-4" />
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
