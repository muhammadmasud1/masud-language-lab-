
import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';
const motion = m as any;
import { 
  User as UserIcon, Mail, Phone, Target, Camera, Save, 
  ArrowLeft, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Language, User } from '../types';
import { dataService } from '../services/dataService';

interface Props {
  lang: Language;
  user: User | null;
  setUser: (user: User | null) => void;
}

const ProfilePage: React.FC<Props> = ({ lang, user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData(user);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async () => {
    const updatedUser = { ...user, ...formData } as User;
    
    // Update Supabase
    const success = await dataService.updateUser(user.id, formData);
    
    if (success) {
      localStorage.setItem('huayu_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setStatus({
        type: 'success',
        message: lang === 'BN' ? 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে!' : 'Profile updated successfully!'
      });
    } else {
      setStatus({
        type: 'error',
        message: lang === 'BN' ? 'আপডেট করা যায়নি। আবার চেষ্টা করুন।' : 'Failed to update. Try again.'
      });
    }
    setTimeout(() => setStatus(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setStatus({
          type: 'error',
          message: lang === 'BN' ? 'ইমেজ সাইজ ২ এমবি এর নিচে হতে হবে' : 'Image size must be under 2MB'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-12">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-500 hover:text-[#C1121F] transition-colors font-bold text-sm uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" />
          {lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          {lang === 'BN' ? 'আমার প্রোফাইল' : 'My Profile'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-[2rem] bg-[#C1121F] flex items-center justify-center text-white text-4xl font-black overflow-hidden shadow-lg shadow-red-500/20">
                {formData.avatar ? (
                  <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  formData.name?.charAt(0)
                )}
              </div>
              {isEditing && (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-zinc-900 text-white rounded-xl shadow-xl hover:bg-[#C1121F] transition-all"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-[10px] font-black text-[#C1121F] uppercase tracking-[0.2em]">
              {user.isAdmin ? 'Administrator' : 'Student'}
            </p>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-black/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest">
                {lang === 'BN' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
              </h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#C1121F] hover:text-white transition-all"
                >
                  {lang === 'BN' ? 'এডিট করুন' : 'Edit Profile'}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                  >
                    {lang === 'BN' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#C1121F] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <Save className="w-3 h-3" />
                    {lang === 'BN' ? 'সেভ করুন' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                {status.message}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <UserIcon className="w-3 h-3" /> {lang === 'BN' ? 'নাম' : 'Full Name'}
                  </label>
                  {isEditing ? (
                    <input 
                      required
                      type="text" 
                      value={formData.name || ''} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#C1121F] outline-none transition-all"
                    />
                  ) : (
                    <p className="text-sm font-bold text-zinc-900 dark:text-white px-4 py-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-transparent">
                      {user.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> {lang === 'BN' ? 'ইমেইল' : 'Email Address'}
                  </label>
                  {isEditing ? (
                    <input 
                      required
                      type="email" 
                      value={formData.email || ''} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#C1121F] outline-none transition-all"
                    />
                  ) : (
                    <p className="text-sm font-bold text-zinc-900 dark:text-white px-4 py-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-transparent">
                      {user.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {lang === 'BN' ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  {isEditing ? (
                    <input 
                      required
                      type="tel" 
                      value={formData.phone || ''} 
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#C1121F] outline-none transition-all"
                    />
                  ) : (
                    <p className="text-sm font-bold text-zinc-900 dark:text-white px-4 py-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-transparent">
                      {user.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Target className="w-3 h-3" /> {lang === 'BN' ? 'আপনার লক্ষ্য' : 'Learning Goal'}
                </label>
                {isEditing ? (
                  <textarea 
                    required
                    rows={3}
                    value={formData.goal || ''} 
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold focus:border-[#C1121F] outline-none transition-all"
                  />
                ) : (
                  <p className="text-sm font-bold text-zinc-900 dark:text-white px-4 py-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-transparent leading-relaxed">
                    {user.goal}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
