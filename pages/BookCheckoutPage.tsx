
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, Smartphone, CheckCircle, Info, ArrowLeft, 
  Send, ShieldCheck, ShoppingBag, UserCircle, Mail
} from 'lucide-react';
import { Language, User, Book, BookOrder } from '../types';
import { PAYMENT_INFO } from '../constants';
import { notifyAdminOfBookOrder } from '../services/geminiService';
import { dataService } from '../services/dataService';

interface Props {
  lang: Language;
  user: User | null;
}

const BookCheckoutPage: React.FC<Props> = ({ lang, user }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Book[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const savedCart = localStorage.getItem('huayu_cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (items.length === 0) navigate('/store');
      setCart(items);
    } else {
      navigate('/store');
    }
  }, [user, navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + price;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cart.length === 0) return;

    setIsSubmitting(true);

    const orderData: BookOrder = {
      id: 'ord-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      items: cart.map(item => ({ id: item.id, title: item.title[lang], price: item.price })),
      totalAmount: `৳ ${calculateTotal()}`,
      paymentMethod,
      senderNumber,
      transactionId,
      status: 'pending',
      date: new Date().toLocaleDateString(),
    };

    // Save to Supabase
    await dataService.saveBookOrder(orderData);

    // Gemini Admin Notification Service Call
    await notifyAdminOfBookOrder(orderData);

    // Clear cart after successful commitment
    localStorage.removeItem('huayu_cart');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-900 p-12 md:p-20 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-10">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            {lang === 'EN' ? 'Order Submitted!' : 'বইয়ের অর্ডার পাঠানো হয়েছে'}
          </h2>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-12 font-medium leading-relaxed">
            {lang === 'EN' 
              ? 'Your book order is now pending admin confirmation. We will verify your transaction shortly.' 
              : 'আপনার বইয়ের অর্ডারটি বর্তমানে এডমিন প্যানেলে যাচাইাধীন আছে। পেমেন্ট নিশ্চিত হলে আপনাকে জানিয়ে দেওয়া হবে।'}
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-12 py-5 bg-[#C1121F] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 active:scale-95"
          >
            {lang === 'EN' ? 'Return to Dashboard' : 'ড্যাশবোর্ডে ফিরে যান'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/store')} className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-[1.25rem] hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-zinc-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">{lang === 'EN' ? 'Secure Checkout' : 'নিরাপদ চেকআউট'}</h1>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
           <ShieldCheck className="w-5 h-5 text-green-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{lang === 'EN' ? 'Encrypted Transaction' : 'সুরক্ষিত লেনদেন'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 sticky top-24 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-8 flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#C1121F]" /> 
              {lang === 'EN' ? 'Cart Summary' : 'অর্ডার সামারি'}
            </h3>
            <div className="space-y-6 mb-10">
              {cart.map(item => (
                <div key={item.id} className="flex gap-5">
                  <img src={item.image} className="w-16 h-20 object-cover rounded-xl shadow-md border border-zinc-100 dark:border-zinc-800" alt="" />
                  <div>
                    <h4 className="text-sm font-black leading-tight mb-2 pr-2">{item.title[lang]}</h4>
                    <p className="font-black text-sm text-[#C1121F]">৳{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center text-2xl font-black">
                <span className="text-sm font-black text-zinc-400 uppercase tracking-widest">Total</span>
                <span className="text-[#C1121F]">৳ {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Form */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <h3 className="text-2xl font-black mb-10 flex items-center gap-3 relative z-10">
              <CreditCard className="w-7 h-7 text-[#C1121F]" />
              {lang === 'EN' ? 'Payment Commitment' : 'পেমেন্ট সম্পন্ন করুন'}
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-6 mb-12 relative z-10">
              {(['bKash', 'Nagad', 'Rocket'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex flex-col items-center gap-4 p-8 rounded-[2rem] border-2 transition-all group ${
                    paymentMethod === method 
                    ? 'border-[#C1121F] bg-red-50 dark:bg-red-950/20' 
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-xl transition-all ${
                    method === 'bKash' ? 'bg-pink-100 text-pink-600' :
                    method === 'Nagad' ? 'bg-orange-100 text-orange-600' :
                    'bg-indigo-100 text-indigo-600'
                  } group-hover:scale-110`}>
                    {method.charAt(0)}
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest">{method}</span>
                </button>
              ))}
            </div>

            {/* High Impact Instructions */}
            <div className="bg-zinc-950 dark:bg-zinc-800/80 p-10 rounded-[2.5rem] mb-12 text-center shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl chinese-font text-white group-hover:rotate-12 transition-transform">付</div>
              <p className="text-xl font-black text-white mb-4 leading-tight relative z-10">
                নির্ধারিত নাম্বারে বইয়ের মূল্য পাঠিয়ে নিচে প্রয়োজনীয় তথ্য দিন
              </p>
              <div className="text-4xl font-black text-[#C1121F] tracking-[0.2em] mb-4 font-mono relative z-10">
                {PAYMENT_INFO[paymentMethod]}
              </div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] relative z-10">
                Personal Number • Cash Out / Send Money
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <UserCircle className="w-3 h-3" /> Full Name
                  </label>
                  <input required type="text" readOnly value={user?.name} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-5 outline-none font-bold opacity-60" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input required type="email" readOnly value={user?.email} className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-6 py-5 outline-none font-bold opacity-60" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Sender Mobile Number</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#C1121F] transition-colors" />
                    <input 
                      required 
                      type="tel" 
                      value={senderNumber} 
                      onChange={e => setSenderNumber(e.target.value)} 
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-16 pr-6 py-5 focus:border-[#C1121F] outline-none font-bold transition-all" 
                      placeholder="01XXXXXXXXX" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Transaction ID (TxID)</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#C1121F] transition-colors" />
                    <input 
                      required 
                      type="text" 
                      value={transactionId} 
                      onChange={e => setTransactionId(e.target.value)} 
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-16 pr-6 py-5 focus:border-[#C1121F] outline-none font-bold transition-all" 
                      placeholder="e.g. 8N7K9L2M" 
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={isSubmitting} 
                type="submit" 
                className="w-full py-6 bg-[#C1121F] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/30 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    <Send className="w-5 h-5" />
                    {lang === 'EN' ? 'Commit Book Order' : 'অর্ডার নিশ্চিত করুন'}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="flex items-center gap-3 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] justify-center">
            <Info className="w-4 h-4" />
            <span>Encrypted Verification by Huayu Bangladesh Finance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCheckoutPage;
