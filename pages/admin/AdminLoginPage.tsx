
import React, { useState } from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, ShieldAlert, ArrowRight } from 'lucide-react';
import { Language, User } from '../../types';
import { dataService } from '../../services/dataService';

interface Props { 
  lang: Language;
  setUser: (user: User) => void;
}

const AdminLoginPage: React.FC<Props> = ({ lang, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const foundUser = await dataService.login(formData.email, formData.password);

      if (foundUser && foundUser.isAdmin) {
        const { password, ...userSession } = foundUser;
        localStorage.setItem('huayu_user', JSON.stringify(userSession));
        setUser(userSession as User);
        navigate('/admin');
      } else if (foundUser && !foundUser.isAdmin) {
        setError(lang === 'EN' ? 'Access denied. Not an administrator.' : 'প্রবেশাধিকার নেই। আপনি এডমিন নন।');
        setIsLoading(false);
      } else {
        setError(lang === 'EN' ? 'Invalid admin credentials.' : 'ভুল এডমিন তথ্য।');
        setIsLoading(false);
      }
    } catch (err) {
      setError(lang === 'EN' ? 'Connection error.' : 'নেটওয়ার্ক সমস্যা।');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-9xl text-white/5 chinese-font pointer-events-none">管</div>
          
          <div className="text-center mb-10 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C1121F] to-[#780000] rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-red-900/20">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{lang === 'EN' ? 'Admin Portal' : 'এডমিন পোর্টাল'}</h1>
            <p className="text-zinc-500 text-sm">Authorized Management Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:border-[#C1121F] outline-none transition-all"
                  placeholder="mdmasudrana0783@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-2xl pl-12 pr-4 py-4 focus:border-[#C1121F] outline-none transition-all"
                  placeholder="••••"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl text-center">
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#C1121F] text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/20"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {lang === 'EN' ? 'Authorize' : 'লগইন করুন'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <button onClick={() => navigate('/')} className="text-zinc-500 text-xs hover:text-white transition-colors">
              Return to Website
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
