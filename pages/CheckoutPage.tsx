import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { 
  CreditCard, Smartphone, CheckCircle, Info, ArrowLeft, 
  ChevronRight, Send, ShieldCheck
} from 'lucide-react';
import { Language, User, Course, Enrollment } from '../types';
import { COURSES, PAYMENT_INFO } from '../constants';
import { notifyAdminOfPayment } from '../services/geminiService';
import { dataService } from '../services/dataService';
import BkashPayment from '../components/BkashPayment';

interface Props {
  lang: Language;
  user: User | null;
}

const CheckoutPage: React.FC<Props> = ({ lang, user }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'bKashGateway'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchCourse = async () => {
      const allCourses = await dataService.getCourses();
      const found = allCourses.find(c => c.id === courseId);
      if (!found) {
        navigate('/courses');
        return;
      }
      setCourse(found);
    };

    fetchCourse();
  }, [courseId, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !course) return;

    setIsSubmitting(true);

    const enrollmentData: Enrollment = {
      id: 'enr-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      courseId: course.id,
      courseName: course.title[lang],
      amount: course.price,
      paymentMethod,
      senderNumber,
      transactionId,
      status: 'pending',
      date: new Date().toLocaleDateString(),
    };

    // Save to Supabase
    await dataService.saveEnrollment(enrollmentData);

    // Notify Admin (Simulated)
    await notifyAdminOfPayment(enrollmentData);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!course) return null;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            {lang === 'EN' ? 'Payment Submitted!' : 'পেমেন্ট সফলভাবে পাঠানো হয়েছে'}
          </h2>
          <p className="text-zinc-500 mb-10 text-lg">
            {lang === 'EN' 
              ? 'Your enrollment is pending admin approval. You will gain access once verified.' 
              : 'আপনার পেমেন্ট তথ্য সফলভাবে পাঠানো হয়েছে। এডমিন ভেরিফাই করলে আপনি কোর্সে এক্সেস পাবেন।'}
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-10 py-4 bg-[#C1121F] text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
          >
            {lang === 'EN' ? 'Go to Dashboard' : 'ড্যাশবোর্ডে যান'}
          </button>
        </motion.div>
      </div>
    );
  }

  const courseImage = course.image || `https://picsum.photos/seed/${course.id}/600/400`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => navigate('/courses')} className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Course Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 sticky top-24">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Selected Course</h3>
            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
              <img src={courseImage} className="w-full h-full object-cover" alt={course.title[lang]} />
            </div>
            <h2 className="text-2xl font-bold mb-2">{course.title[lang]}</h2>
            <p className="text-sm text-zinc-500 mb-6">{course.level} • {course.duration}</p>
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total</span>
                <span className="text-[#C1121F]">৳{course.price}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 p-8 md:p-12 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-[#C1121F]" />
              {lang === 'EN' ? 'Payment Details' : 'পেমেন্ট পদ্ধতি'}
            </h3>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {(['bKash', 'Nagad', 'Rocket', 'bKashGateway'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${
                    paymentMethod === method 
                    ? 'border-[#C1121F] bg-red-50 dark:bg-red-900/10' 
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                    method === 'bKash' ? 'bg-pink-100 text-pink-600' :
                    method === 'Nagad' ? 'bg-orange-100 text-orange-600' :
                    method === 'bKashGateway' ? 'bg-pink-600 text-white' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {method.charAt(0)}
                  </div>
                  <span className="font-bold text-sm">{method === 'bKashGateway' ? 'bKash Gateway' : method}</span>
                </button>
              ))}
            </div>

            {/* Payment Instructions / Gateway */}
            {paymentMethod === 'bKashGateway' ? (
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 text-center mb-12">
                    <h4 className="text-xl font-bold mb-4">Pay with bKash Gateway</h4>
                    <BkashPayment amount={course.price} orderId={courseId} />
                </div>
            ) : (
                <>
                    {/* Payment Instructions */}
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-700 mb-12 text-center">
                      <p className="text-lg font-bold mb-2">
                        নির্ধারিত নাম্বারে টাকা পাঠিয়ে নিচে প্রয়োজনীয় তথ্য দিন
                      </p>
                      <div className="text-3xl font-black text-[#C1121F] tracking-widest chinese-font mb-4">
                        {PAYMENT_INFO[paymentMethod]}
                      </div>
                      <p className="text-xs text-zinc-500 uppercase font-bold">
                        Personal Number • Cash Out/Send Money
                      </p>
                    </div>

                    {/* Submission Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* ... existing form fields ... */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Name</label>
                          <input 
                            type="text" 
                            readOnly 
                            value={user?.name} 
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-5 py-4 outline-none opacity-60" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Your Email</label>
                          <input 
                            type="email" 
                            readOnly 
                            value={user?.email} 
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl px-5 py-4 outline-none opacity-60" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Sender Mobile Number</label>
                          <div className="relative">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                              required
                              type="tel" 
                              value={senderNumber}
                              onChange={e => setSenderNumber(e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#C1121F] outline-none"
                              placeholder="01XXXXXXXXX"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Transaction ID (TxID)</label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input 
                              required
                              type="text" 
                              value={transactionId}
                              onChange={e => setTransactionId(e.target.value)}
                              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-[#C1121F] outline-none"
                              placeholder="e.g. 8N7K9L2M"
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-[#C1121F] text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                          <>
                            <Send className="w-5 h-5" />
                            {lang === 'EN' ? 'Confirm Enrollment' : 'এনরোলমেন্ট নিশ্চিত করুন'}
                          </>
                        )}
                      </button>
                    </form>
                </>
            )}
          </div>

          <div className="flex items-center gap-3 text-zinc-400 text-sm justify-center">
            <Info className="w-4 h-4" />
            <span>Secure payment verification powered by Huayu Bangladesh.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
