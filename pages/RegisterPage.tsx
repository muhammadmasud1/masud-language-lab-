
import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Language, User } from '../types';
import { dataService } from '../services/dataService';

import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification, signOut } from 'firebase/auth';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Google users are usually verified by default, but we can check
      // For Google login, we don't force email verification redirect usually
      
      // Check if user exists in Supabase by ID
      let foundUser = await dataService.getUserById(firebaseUser.uid);
      
      if (!foundUser) {
        // If not found by ID, check by Email
        foundUser = await dataService.getUserByEmail(firebaseUser.email || '');
        
        if (foundUser) {
          // Link the existing profile to this new Firebase UID
          await dataService.updateUser(foundUser.id, { id: firebaseUser.uid });
          foundUser.id = firebaseUser.uid;
        } else {
          // Create new user profile if it doesn't exist
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Google User',
            email: firebaseUser.email || '',
            phone: '',
            goal: 'Study',
            isAdmin: false,
            enrolledCourses: [],
            purchasedBooks: [],
            completedLessons: [],
            lessonNotes: {}
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
        navigate('/dashboard');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Check if user already exists in Supabase to prevent duplicate key errors
      const existingSupabaseUser = await dataService.getUserByEmail(formData.email.toLowerCase());
      if (existingSupabaseUser) {
        setError(lang === 'EN' 
          ? 'An account with this email already exists. Please log in instead.' 
          : 'এই জিমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট রয়েছে। দয়া করে লগইন করুন।');
        setIsLoading(false);
        return;
      }

      // 2. Firebase Registration
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // 3. Send Verification Email
      await sendEmailVerification(firebaseUser);

      const newUser: User = {
        id: firebaseUser.uid, // Use Firebase UID
        name: formData.name,
        email: formData.email.toLowerCase(),
        phone: formData.phone,
        goal: formData.goal,
        isAdmin: false,
        enrolledCourses: [],
        purchasedBooks: [],
        completedLessons: [],
        lessonNotes: {}
      };

      // 4. Save additional user data to Supabase
      const result = await dataService.registerUser(newUser);
      
      if (result.success) {
        // Sign out user immediately after registration so they must verify and login
        await signOut(auth);
        setShowSuccessModal(true);
        
        // Reset form and go back to step 1
        setFormData({ name: '', email: '', phone: '', password: '', goal: 'Study' });
        setStep(1);
      } else {
        // Handle specific Supabase errors
        if (result.error?.includes('unique constraint "users_email_key"')) {
          setError(lang === 'EN' ? 'This email is already registered.' : 'এই জিমেইলটি ইতিমধ্যে নিবন্ধিত।');
        } else {
          setError(lang === 'EN' ? `Database Error: ${result.error}` : `ডাটাবেস সমস্যা: ${result.error}`);
        }
        // If Supabase failed but Firebase succeeded, we might have an orphaned Firebase user.
        // But since we checked Supabase first, this is less likely unless there's a race condition.
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError(lang === 'BN' ? 'এই Gmail দিয়ে ইতিমধ্যে একটি একাউন্ট রয়েছে' : 'Account already exists with this Gmail');
      } else if (err.code === 'auth/weak-password') {
        setError(lang === 'BN' ? 'পাসওয়ার্ডটি অন্তত ৬ অক্ষরের হতে হবে' : 'Password should be at least 6 characters');
      } else {
        setError(lang === 'EN' ? 'Registration failed. Please try again.' : 'নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
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

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black mb-4 tracking-tight">
                  {lang === 'EN' ? 'Check Your Gmail!' : 'আপনার জিমেইল চেক করুন!'}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
                  {lang === 'EN' 
                    ? 'Registration successful! A verification link has been sent to your Gmail. Please verify it to access your portal.' 
                    : 'নিবন্ধন সফল হয়েছে! আপনার জিমেইলে একটি ভেরিফিকেশন লিঙ্ক পাঠানো হয়েছে। পোর্টাল এক্সেস করতে দয়া করে সেটি ভেরিফাই করুন।'}
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 mb-8">
                  <p className="text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {lang === 'EN' 
                      ? 'Note: If not in Inbox, please check your SPAM folder.' 
                      : 'নোট: ইনবক্সে না পেলে দয়া করে SPAM ফোল্ডার চেক করুন।'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/login');
                  }}
                  className="w-full py-4 bg-[#C1121F] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20"
                >
                  {lang === 'EN' ? 'Proceed to Login' : 'লগইন করতে যান'}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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

        <div className="mt-8 flex items-center gap-4">
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 flex-grow" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{lang === 'EN' ? 'Or register with' : 'অথবা নিবন্ধন করুন'}</span>
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
          {lang === 'EN' ? 'Continue with Google' : 'গুগল দিয়ে এগিয়ে যান'}
        </button>

        <div className="mt-12 text-center text-xs font-bold uppercase tracking-widest">
          <span className="text-zinc-400">{lang === 'EN' ? 'Returning Student?' : 'একাউন্ট আছে?'}</span>{' '}
          <Link to="/login" className="text-[#C1121F] hover:underline transition-colors">{lang === 'EN' ? 'Login Portal' : 'লগইন করুন'}</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
