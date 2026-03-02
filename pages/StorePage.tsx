
import React, { useState, useEffect } from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { ShoppingCart, Star, Eye, ShieldCheck, X, ArrowRight, Check, PackageSearch } from 'lucide-react';
import { Language, Book } from '../types';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

interface Props { lang: Language; }

const StorePage: React.FC<Props> = ({ lang }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<Book[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      const allBooks = await dataService.getBooks();
      setBooks(allBooks);
      setIsLoading(false);
    };

    const loadCart = () => {
      const savedCart = localStorage.getItem('huayu_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    };

    loadBooks();
    loadCart();
  }, []);

  const addToCart = (book: Book) => {
    if (cart.find(item => item.id === book.id)) {
      setIsCartOpen(true);
      return;
    }
    const newCart = [...cart, book];
    setCart(newCart);
    localStorage.setItem('huayu_cart', JSON.stringify(newCart));
    setIsCartOpen(true);
  };

  const removeFromCart = (bookId: string) => {
    const newCart = cart.filter(item => item.id !== bookId);
    setCart(newCart);
    localStorage.setItem('huayu_cart', JSON.stringify(newCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + price;
    }, 0);
  };

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#C1121F] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            {lang === 'EN' ? 'Recommended Reading' : 'প্রস্তাবিত পঠন সামগ্রী'}
          </h1>
          <p className="text-xl text-zinc-500 font-medium">
            {lang === 'EN' 
              ? 'Expertly crafted books designed specifically for Bengali speakers to master Mandarin.' 
              : 'বাঙালিদের চাইনিজ ভাষা আয়ত্ত করার জন্য বিশেষভাবে তৈরি প্রিমিয়াম বইসমূহ।'}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-5 bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 hover:border-[#C1121F] transition-all shadow-xl shadow-black/5"
          >
            <ShoppingCart className="w-6 h-6 text-[#C1121F]" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#C1121F] text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-zinc-950">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {books.map((book, idx) => {
          const inCart = cart.some(item => item.id === book.id);
          return (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col lg:flex-row gap-8 bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 hover:shadow-2xl hover:shadow-red-500/5 transition-all group"
            >
              <div className="w-full lg:w-1/3 aspect-[3/4] overflow-hidden rounded-[2rem] shadow-xl relative shrink-0">
                <img src={book.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title[lang]} />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                    <span className="text-[10px] font-black text-zinc-400 ml-3 uppercase tracking-widest">Premium Choice</span>
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-[#C1121F] transition-colors leading-tight">{book.title[lang]}</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed line-clamp-2 font-medium">{book.description[lang]}</p>
                </div>
                <div className="flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-zinc-800 mt-8">
                  <span className="text-3xl font-black text-zinc-900 dark:text-white">{book.price}</span>
                  <button 
                    onClick={() => addToCart(book)}
                    className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${
                      inCart 
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 cursor-default' 
                      : 'bg-[#C1121F] text-white hover:bg-red-700 active:scale-95 shadow-red-500/20'
                    }`}
                  >
                    {inCart ? (
                      <><Check className="w-4 h-4" /> {lang === 'EN' ? 'In Cart' : 'কার্টে আছে'}</>
                    ) : (
                      lang === 'EN' ? 'Order Now' : 'অর্ডার করুন'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {books.length === 0 && (
        <div className="py-40 text-center opacity-30">
          <PackageSearch className="w-16 h-16 mx-auto mb-6" />
          <p className="font-black uppercase tracking-widest text-xs">No books available currently</p>
        </div>
      )}

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-white dark:bg-zinc-900 h-full relative z-10 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-[#C1121F]" />
                  {lang === 'EN' ? 'Your Cart' : 'আপনার কার্ট'}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6 scroll-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <ShoppingCart className="w-10 h-10 mb-6" />
                    <p className="font-black uppercase tracking-widest text-xs">{lang === 'EN' ? 'Empty Bag' : 'কার্ট খালি'}</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-5 p-5 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] border border-zinc-100 dark:border-zinc-700 relative group">
                      <img src={item.image} className="w-16 h-20 object-cover rounded-xl shadow-md" alt="" />
                      <div className="flex-grow">
                        <h4 className="font-black text-sm leading-tight mb-2 pr-6">{item.title[lang]}</h4>
                        <p className="text-[#C1121F] font-black text-lg">{item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-all"><X className="w-4 h-4" /></button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-10 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 space-y-8 rounded-t-[3rem]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">{lang === 'EN' ? 'Grand Total' : 'মোট মূল্য'}</span>
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">৳ {calculateTotal()}</span>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); navigate('/book-checkout'); }} className="w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-4">
                    {lang === 'EN' ? 'Finalize Order' : 'অর্ডার সম্পন্ন করুন'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StorePage;
