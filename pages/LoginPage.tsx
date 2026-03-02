
import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language, User } from '../types';
import { dataService } from '../services/dataService';

interface Props { 
  lang: Language;
  setUser: (user: User) => void;
}

const LoginPage: React.FC<Props> = ({ lang, setUser }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Fetch user from Cloud Database
      const foundUser = await dataService.login(formData.email, formData.password);

      if (foundUser) {
        const { password, ...userSession } = foundUser;
        localStorage.setItem('huayu_user', JSON.stringify(userSession));
        setUser(userSession as User);
        
        if (foundUser.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(lang === 'EN' ? 'Invalid credentials provided.' : 'ভুল জিমেইল অথবা পাসওয়ার্ড।');
      }
    } catch (err) {
      setError(lang === 'EN' ? 'Connection error.' : 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[3.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-red-500/5"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center text-[#C1121F] text-3xl font-black chinese-font mx-auto mb-8 shadow-lg shadow-red-500/10">
            华
          </div>
          <h1 className="text-4xl font-black mb-3 tracking-tight">{lang === 'EN' ? 'Academy Portal' : 'লগইন'}</h1>
          <p className="text-sm text-zinc-500 font-medium">{lang === 'EN' ? 'Continue your Mandarin excellence.' : 'আপনার শিক্ষা যাত্রা চালিয়ে যেতে লগইন করুন।'}</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-10 p-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 rounded-2xl flex items-center gap-4 text-sm font-bold"
          >
            <AlertCircle className="w-6 h-6 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Gmail Address' : 'জিমেইল ঠিকানা'}</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#C1121F] transition-colors" />
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl pl-14 pr-6 py-5 outline-none font-bold transition-all shadow-sm"
                placeholder="example@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{lang === 'EN' ? 'Security Key' : 'পাসওয়ার্ড'}</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-[#C1121F] transition-colors" />
              <input 
                required
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl pl-14 pr-14 py-5 outline-none font-bold transition-all shadow-sm"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-[#C1121F] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (lang === 'EN' ? 'Access Portal' : 'লগইন করুন')}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-zinc-400">{lang === 'EN' ? "Academy Newcomer?" : "একাউন্ট নেই?"}</span>{' '}
          <Link to="/register" className="text-[#C1121F] hover:underline transition-colors">{lang === 'EN' ? "Join Registry" : "নিবন্ধন করুন"}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
