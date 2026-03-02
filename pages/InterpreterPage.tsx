
import React from 'react';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m } from 'framer-motion';
const motion = m as any;
import { Briefcase, Plane, Users, Globe2, CheckCircle, Calendar } from 'lucide-react';
import { Language } from '../types';

interface Props { lang: Language; }

const InterpreterPage: React.FC<Props> = ({ lang }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-16 h-1 bg-[#C1121F] mb-8"></div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            {lang === 'EN' 
              ? 'Bridge the Language Gap in Business' 
              : 'ব্যবসায়ে ভাষার ব্যবধান দূর করুন'}
          </h1>
          <p className="text-xl text-zinc-500 mb-10 leading-relaxed">
            {lang === 'EN' 
              ? 'Professional interpretation for business meetings, factory visits, legal consultations, and high-level delegations.' 
              : 'ব্যবসায়িক মিটিং, ফ্যাক্টরি ভিজিট, আইনি পরামর্শ এবং উচ্চ-স্তরের প্রতিনিধিদের জন্য পেশাদার অনুবাদ সেবা।'}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Briefcase, title: lang === 'EN' ? 'Business Meetings' : 'ব্যবসায়িক মিটিং' },
              { icon: Plane, title: lang === 'EN' ? 'Travel Escort' : 'ভ্রমণ সঙ্গী' },
              { icon: Users, title: lang === 'EN' ? 'Conferences' : 'কনফারেন্স' },
              { icon: Globe2, title: lang === 'EN' ? 'Remote Support' : 'রিমোট সাপোর্ট' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <item.icon className="w-6 h-6 text-[#C1121F]" />
                <span className="font-bold">{item.title}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <img src="https://picsum.photos/seed/interpreter/800/600" className="rounded-[3rem] shadow-2xl grayscale" alt="Interpreter" />
          <div className="absolute -bottom-8 -left-8 bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-700 max-w-xs">
            <h3 className="font-bold mb-2">Why Hire Me?</h3>
            <ul className="text-sm space-y-2 text-zinc-500">
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {lang === 'EN' ? 'Deep cultural understanding' : 'গভীর সাংস্কৃতিক জ্ঞান'}</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {lang === 'EN' ? 'Technical vocabulary expertise' : 'প্রযুক্তিগত শব্দভাণ্ডারে দক্ষতা'}</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> {lang === 'EN' ? 'Reliable and confidential' : 'নির্ভরযোগ্য এবং গোপনীয়তা রক্ষা'}</li>
            </ul>
          </div>
        </motion.div>
      </div>

      <div className="bg-zinc-950 text-white rounded-[3rem] p-12 lg:p-20">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-8">{lang === 'EN' ? 'Book a Session' : 'বুকিং করুন'}</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60 uppercase">{lang === 'EN' ? 'Name' : 'নাম'}</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C1121F] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60 uppercase">{lang === 'EN' ? 'Email' : 'ইমেইল'}</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C1121F] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60 uppercase">{lang === 'EN' ? 'Service Date' : 'সেবার তারিখ'}</label>
              <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C1121F] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold opacity-60 uppercase">{lang === 'EN' ? 'Service Type' : 'সেবার ধরণ'}</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C1121F] outline-none appearance-none">
                <option className="bg-zinc-900">{lang === 'EN' ? 'Business Meeting' : 'ব্যবসায়িক মিটিং'}</option>
                <option className="bg-zinc-900">{lang === 'EN' ? 'Factory Visit' : 'ফ্যাক্টরি ভিজিট'}</option>
                <option className="bg-zinc-900">{lang === 'EN' ? 'Online Support' : 'অনলাইন সাপোর্ট'}</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold opacity-60 uppercase">{lang === 'EN' ? 'Project Details' : 'প্রজেক্টের বিবরণ'}</label>
              <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#C1121F] outline-none" />
            </div>
            <button className="md:col-span-2 bg-[#C1121F] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              {lang === 'EN' ? 'Submit Booking Request' : 'অনুরোধ পাঠান'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterpreterPage;
