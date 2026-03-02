
import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Language, User } from '../types';
import { dataService } from '../services/dataService';

interface Props { 
  lang: Language;
  setUser: (user: User) => void;
}

const RegisterPage: React.FC<Props> = ({ lang, setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', goal: 'Study'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if Gmail already exists in Cloud Database
      const existingUser = await dataService.getUserByEmail(formData.email);

      if (existingUser) {
        setError(lang === 'BN' ? 'এই Gmail দিয়ে ইতিমধ্যে একটি একাউন্ট রয়েছে' : 'Account already exists with this Gmail');
        setIsLoading(false);
        return;
      }

      const newUser: any = {
        id: 'u-' + Date.now(),
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        goal: formData.goal,
        password: formData.password, // Simple pass storage for demo
        isAdmin: false,
        enrolledCourses: [],
        purchasedBooks: []
      };

      // Save to Firebase Cloud
      const success = await dataService.registerUser(newUser);
      
      if (success) {
        const { password, ...userSession } = newUser;
        localStorage.setItem('huayu_user', JSON.stringify(userSession));
        setUser(userSession as User);
        navigate('/dashboard');
      } else {
        setError('Database Error. Try again.');
      }
    } catch (err) {
      setError('Registration failed. Check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length > 6) strength += 33;
    if (/[A-Z]/.test(formData.password)) strength += 33;
    if (/[0-9]/.test(formData.password)) strength += 34;
    return strength;
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-red-500/5"
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex gap-2.5">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${step >= s ? 'w-12 bg-[#C1121F]' : 'w-4 bg-zinc-200 dark:bg-zinc-800'}`} />
            ))}
          </div>
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol {step} of 2</span>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="mb-10 p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 rounded-2xl flex items-center gap-4 text-sm font-bold"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <header>
                <h1 className="text-4xl font-black mb-4 tracking-tight">{lang === 'EN' ? 'Join Academy' : 'যোগ দিন'}</h1>
                <p className="text-zinc-500 font-medium">{lang === 'EN' ? 'Create your cloud-synced student identity.' : 'আপনার ক্লাউড-সিঙ্কড একাউন্ট তৈরি করুন।'}</p>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Identity Name' : 'পুরো নাম'}</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold shadow-sm transition-all"
                    placeholder="e.g. Mehedi Hasan"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Gmail Access' : 'জিমেইল ঠিকানা'}</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold shadow-sm transition-all"
                    placeholder="example@gmail.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Contact Mobile' : 'ফোন নম্বর'}</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold shadow-sm transition-all"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-5 bg-zinc-950 dark:bg-zinc-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C1121F] transition-all shadow-xl flex items-center justify-center gap-4"
              >
                {lang === 'EN' ? 'Security Protocol' : 'পরবর্তী ধাপ'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <header>
                <button onClick={() => setStep(1)} className="text-[#C1121F] font-black flex items-center gap-2 text-[10px] uppercase tracking-widest mb-8">
                  <ArrowLeft className="w-4 h-4" /> {lang === 'EN' ? 'Revision' : 'পেছনে যান'}
                </button>
                <h1 className="text-4xl font-black mb-4 tracking-tight">{lang === 'EN' ? 'Final Auth' : 'একাউন্ট সুরক্ষিত করুন'}</h1>
              </header>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Academy Focus' : 'মূল লক্ষ্য'}</label>
                  <select 
                    value={formData.goal}
                    onChange={e => setFormData({...formData, goal: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-black uppercase tracking-widest text-[11px]"
                  >
                    <option value="Study">{lang === 'EN' ? 'Study in China' : 'চীনে উচ্চশিক্ষা'}</option>
                    <option value="Business">{lang === 'EN' ? 'Business with China' : 'চীনের সাথে ব্যবসা'}</option>
                    <option value="Job">{lang === 'EN' ? 'Career Excellence' : 'ক্যারিয়ারের সুযোগ'}</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Access Key' : 'পাসওয়ার্ড'}</label>
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold transition-all"
                    placeholder="••••••••"
                  />
                  <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getPasswordStrength()}%` }}
                      className={`h-full transition-colors ${getPasswordStrength() > 66 ? 'bg-green-500' : getPasswordStrength() > 33 ? 'bg-yellow-500' : 'bg-[#C1121F]'}`}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full py-5 bg-[#C1121F] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (lang === 'EN' ? 'Create Global Account' : 'নিবন্ধন সম্পন্ন করুন')}
                {!isLoading && <CheckCircle className="w-5 h-5" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center text-xs font-bold uppercase tracking-widest">
          <span className="text-zinc-400">{lang === 'EN' ? 'Returning Student?' : 'একাউন্ট আছে?'}</span>{' '}
          <Link to="/login" className="text-[#C1121F] hover:underline transition-colors">{lang === 'EN' ? 'Login Portal' : 'লগইন করুন'}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
