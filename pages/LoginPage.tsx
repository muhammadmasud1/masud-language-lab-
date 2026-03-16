
import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language, User } from '../types';
import { dataService } from '../services/dataService';

import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

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

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user exists in Supabase by ID
      let foundUser = await dataService.getUserById(firebaseUser.uid);
      
      if (!foundUser) {
        // If not found by ID, check by Email (user might have registered with email/password before)
        foundUser = await dataService.getUserByEmail(firebaseUser.email || '');
        
        if (foundUser) {
          // Link the existing profile to this new Firebase UID
          await dataService.updateUser(foundUser.id, { id: firebaseUser.uid });
          foundUser.id = firebaseUser.uid;
        } else {
          // Create new user profile if it doesn't exist at all
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Google User',
            email: firebaseUser.email || '',
            phone: '',
            goal: 'Study',
            isAdmin: false,
            enrolledCourses: [],
            purchasedBooks: []
          };
          
          const result = await dataService.registerUser(newUser);
          if (result.success) {
            foundUser = newUser;
          } else {
            throw new Error(result.error || 'Failed to create user profile in database.');
          }
        }
      }
      
      if (foundUser) {
        localStorage.setItem('huayu_user', JSON.stringify(foundUser));
        setUser(foundUser);
        
        if (foundUser.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError(lang === 'EN' ? 'Popup blocked. Please allow popups for this site.' : 'পপআপ ব্লক করা হয়েছে। দয়া করে পপআপ এলাউ করুন।');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(lang === 'EN' ? 'This domain is not authorized in Firebase. Please add it to Authorized Domains.' : 'এই ডোমেইনটি ফায়ারবেসে অনুমোদিত নয়।');
      } else {
        setError(lang === 'EN' ? `Google login failed: ${err.message}` : `গুগল লগইন ব্যর্থ হয়েছে: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Firebase Login
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // Fetch additional user data from Supabase
      const foundUser = await dataService.getUserById(firebaseUser.uid);

      if (foundUser) {
        localStorage.setItem('huayu_user', JSON.stringify(foundUser));
        setUser(foundUser);
        
        if (foundUser.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(lang === 'EN' ? 'User profile not found in database.' : 'ডাটাবেসে ইউজার প্রোফাইল পাওয়া যায়নি।');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(lang === 'EN' ? 'Invalid email or password.' : 'ভুল জিমেইল অথবা পাসওয়ার্ড।');
      } else {
        setError(lang === 'EN' ? 'Authentication failed. Please try again.' : 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
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

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-grow" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'EN' ? 'Or login with' : 'অথবা লগইন করুন'}</span>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-grow" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full mt-8 py-5 bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-[#C1121F] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {lang === 'EN' ? 'Login with Google' : 'গুগল দিয়ে লগইন'}
        </button>

        <div className="mt-12 text-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-zinc-400">{lang === 'EN' ? "Academy Newcomer?" : "একাউন্ট নেই?"}</span>{' '}
          <Link to="/register" className="text-[#C1121F] hover:underline transition-colors">{lang === 'EN' ? "Join Registry" : "নিবন্ধন করুন"}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
