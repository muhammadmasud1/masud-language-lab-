
import React, { useState } from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Mail, Phone, MapPin, Send, MessageCircle, User, MessageSquare, Info } from 'lucide-react';
import { Language } from '../types';

interface Props { lang: Language; }

const ContactPage: React.FC<Props> = ({ lang }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { fullName, email, subject, message } = formData;
    
    // Basic validation
    if (!fullName || !email || !subject || !message) {
      alert(lang === 'EN' ? 'Please fill in all fields.' : 'দয়া করে সব ঘর পূরণ করুন।');
      return;
    }

    // Format the WhatsApp message
    const formattedMessage = lang === 'BN' 
      ? `নাম: ${fullName}\nইমেইল: ${email}\nবিষয়: ${subject}\nবার্তা: ${message}`
      : `Name: ${fullName}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;

    // Encode the message for URI
    const encodedMessage = encodeURIComponent(formattedMessage);
    
    // WhatsApp URL
    const whatsappUrl = `https://wa.me/8801788060657?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-block px-4 py-1.5 bg-red-100 dark:bg-red-900/20 text-[#C1121F] rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-red-200 dark:border-red-800/30">
            Connect With Us
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-zinc-900 dark:text-white">
            {lang === 'EN' ? "Let's Start a Conversation" : 'কথপোকথন শুরু করা যাক'}
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-12 leading-relaxed font-medium">
            {lang === 'EN' 
              ? 'Have a project or want to learn Chinese? Reach out via WhatsApp for an immediate response.' 
              : 'কোনো প্রজেক্ট বা চাইনিজ শিখতে চান? দ্রুত উত্তরের জন্য হোয়াটসঅ্যাপের মাধ্যমে যোগাযোগ করুন।'}
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[#C1121F] shrink-0 shadow-lg shadow-black/5 group-hover:bg-[#C1121F] group-hover:text-white transition-all">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-1">{lang === 'EN' ? 'Official Email' : 'অফিশিয়াল ইমেইল'}</h4>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">mdmasudrana0783@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[#C1121F] shrink-0 shadow-lg shadow-black/5 group-hover:bg-[#C1121F] group-hover:text-white transition-all">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-1">{lang === 'EN' ? 'Direct Line / WhatsApp' : 'ফোন / হোয়াটসঅ্যাপ'}</h4>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">+880 1788 060657</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-[#C1121F] shrink-0 shadow-lg shadow-black/5 group-hover:bg-[#C1121F] group-hover:text-white transition-all">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest text-zinc-400 mb-1">{lang === 'EN' ? 'Consultancy Office' : 'পরামর্শ অফিস'}</h4>
                <p className="text-xl font-bold text-zinc-900 dark:text-white">Panchagarh, Rangpur, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <a 
              href="https://wa.me/8801788060657" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" /> Direct WhatsApp
            </a>
            <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
               Messenger Support
            </button>
          </div>
        </motion.div>

        {/* Right Side: Contact Form (Sends to WhatsApp) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-red-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl chinese-font pointer-events-none select-none dark:text-white">信</div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User className="w-3 h-3 text-[#C1121F]" />
                  {lang === 'EN' ? 'Full Name' : 'পুরো নাম'}
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={lang === 'EN' ? "e.g. Rahim Ahmed" : "উদা: রহিম আহমেদ"}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold transition-all" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-[#C1121F]" />
                  {lang === 'EN' ? 'Email Address' : 'ইমেইল ঠিকানা'}
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold transition-all" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Info className="w-3 h-3 text-[#C1121F]" />
                {lang === 'EN' ? 'Subject' : 'বিষয়'}
              </label>
              <input 
                type="text" 
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={lang === 'EN' ? "What are you inquiring about?" : "আপনার জিজ্ঞাসার বিষয় কি?"}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold transition-all" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare className="w-3 h-3 text-[#C1121F]" />
                {lang === 'EN' ? 'Your Message' : 'বার্তা'}
              </label>
              <textarea 
                rows={5} 
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder={lang === 'EN' ? "Describe your project or query..." : "আপনার প্রজেক্ট বা জিজ্ঞাসার বিবরণ দিন..."}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-[#C1121F] rounded-2xl px-6 py-5 outline-none font-bold transition-all resize-none" 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-6 bg-[#C1121F] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] hover:bg-red-700 transition-all shadow-2xl shadow-red-500/20 flex items-center justify-center gap-4 active:scale-95"
            >
              <Send className="w-5 h-5" />
              {lang === 'EN' ? 'Send via WhatsApp' : 'বার্তা পাঠান'}
            </button>

            <p className="text-center text-[9px] text-zinc-400 uppercase font-black tracking-widest">
              {lang === 'EN' 
                ? 'Clicking will open WhatsApp with your pre-filled message.' 
                : 'ক্লিক করলে আপনার বার্তাটি সরাসরি হোয়াটসঅ্যাপে ওপেন হবে।'}
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
