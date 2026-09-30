import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Check, Copy, ExternalLink, QrCode } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

export const WeChatIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
  >
    <path d="M8.5 2C4.36 2 1 4.91 1 8.5c0 2.01 1.06 3.8 2.72 4.98L3 17l3.8-1.9c.54.14 1.11.22 1.7.22.4 0 .79-.04 1.18-.11-.47-.94-.74-2-.74-3.13 0-3.95 3.58-7.16 8-7.16.27 0 .54.02.8.05C16.54 3.08 12.8 2 8.5 2zm-2.25 4a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm4.5 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM15.5 8c-3.59 0-6.5 2.46-6.5 5.5 0 3.04 2.91 5.5 6.5 5.5.54 0 1.05-.07 1.54-.19L20 20.5l-.65-2.61C20.48 16.89 22 15.31 22 13.5 22 10.46 19.09 8 15.5 8zm-2 3.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm4 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
  </svg>
);

const SocialButtons: React.FC<Props> = ({ lang }) => {
  const [activeTooltip, setActiveTooltip] = useState<'whatsapp' | 'wechat' | null>(null);
  const [isWeChatModalOpen, setIsWeChatModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const phoneNumber = '8801788060657'; // WhatsApp number
  const wechatId = 'muhammadmasud1';

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener,noreferrer');
  };

  const handleCopyWechatId = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWechatButtonClick = () => {
    handleCopyWechatId();
    setIsWeChatModalOpen(true);
  };

  return (
    <>
      {/* WhatsApp Button - Positioned above AIChatbot icon (at bottom-24) */}
      <div className="fixed bottom-24 right-6 z-[60] flex items-center gap-3">
        {/* Tooltip Label */}
        <AnimatePresence>
          {activeTooltip === 'whatsapp' && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 text-xs font-black uppercase tracking-widest pointer-events-none whitespace-nowrap hidden sm:block"
            >
              {lang === 'BN' ? 'হোয়াটসঅ্যাপ করুন' : 'WhatsApp Us'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Floating Button */}
        <motion.button
          id="whatsapp-floating-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setActiveTooltip('whatsapp')}
          onMouseLeave={() => setActiveTooltip(null)}
          onClick={handleWhatsAppClick}
          className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-zinc-900 relative group transition-colors duration-300 hover:bg-[#20ba5a]"
          aria-label="Contact on WhatsApp"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping opacity-75 group-hover:hidden" />

          <MessageCircle className="w-8 h-8 fill-white text-[#25D366] stroke-[2]" />
        </motion.button>
      </div>

      {/* WeChat Button - Positioned above WhatsApp button (at bottom-[168px]) */}
      <div className="fixed bottom-[168px] right-6 z-[60] flex items-center gap-3">
        {/* Tooltip Label */}
        <AnimatePresence>
          {activeTooltip === 'wechat' && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 text-xs font-black uppercase tracking-widest pointer-events-none whitespace-nowrap hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <span>WeChat ID: <strong className="text-[#07C160] lowercase">{wechatId}</strong></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WeChat Floating Button */}
        <motion.button
          id="wechat-floating-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setActiveTooltip('wechat')}
          onMouseLeave={() => setActiveTooltip(null)}
          onClick={handleWechatButtonClick}
          className="w-16 h-16 bg-[#07C160] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-zinc-900 relative group transition-colors duration-300 hover:bg-[#06ad56]"
          aria-label="WeChat Contact"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-[#07C160]/30 animate-ping opacity-75 group-hover:hidden" />

          <WeChatIcon className="w-8 h-8 fill-white" />
        </motion.button>
      </div>

      {/* WeChat Quick Info & Copy Dialog Modal */}
      <AnimatePresence>
        {isWeChatModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden"
            >
              {/* Header Icon */}
              <div className="w-16 h-16 bg-[#07C160]/10 text-[#07C160] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#07C160]/30">
                <WeChatIcon className="w-9 h-9 fill-[#07C160]" />
              </div>

              <span className="text-[10px] font-black uppercase text-[#07C160] tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                Official WeChat Contact
              </span>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-3 mb-1">
                Add Md. Masud Rana on WeChat
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Search the WeChat ID below in your WeChat App to connect directly for Chinese courses, books & translation.
              </p>

              {/* ID Box with Copy Button */}
              <div className="bg-slate-100 dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 mb-5">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">WeChat ID</span>
                  <span className="text-base font-black text-slate-900 dark:text-white select-all font-mono">
                    {wechatId}
                  </span>
                </div>
                <button
                  onClick={handleCopyWechatId}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#07C160] hover:bg-[#06ad56] text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-4"
                >
                  ✓ WeChat ID "{wechatId}" copied to clipboard!
                </motion.p>
              )}

              {/* Close Button */}
              <button
                onClick={() => setIsWeChatModalOpen(false)}
                className="w-full py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-black text-xs uppercase tracking-wider transition"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SocialButtons;
