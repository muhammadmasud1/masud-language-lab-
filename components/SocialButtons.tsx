import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Facebook } from 'lucide-react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

const SocialButtons: React.FC<Props> = ({ lang }) => {
  const [activeTooltip, setActiveTooltip] = useState<'whatsapp' | 'facebook' | null>(null);
  
  const phoneNumber = '8801788060657'; // Internationally formatted WhatsApp number for 01788060657
  const fbLink = 'https://www.facebook.com/masudlanguagelab';

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookClick = () => {
    window.open(fbLink, '_blank', 'noopener,noreferrer');
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

      {/* Facebook Button - Positioned above WhatsApp button (at bottom-[168px]) */}
      <div className="fixed bottom-[168px] right-6 z-[60] flex items-center gap-3">
        {/* Tooltip Label */}
        <AnimatePresence>
          {activeTooltip === 'facebook' && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 text-xs font-black uppercase tracking-widest pointer-events-none whitespace-nowrap hidden sm:block"
            >
              {lang === 'BN' ? 'ফেসবুক পেজ' : 'Facebook Page'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Facebook Floating Button */}
        <motion.button
          id="facebook-floating-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setActiveTooltip('facebook')}
          onMouseLeave={() => setActiveTooltip(null)}
          onClick={handleFacebookClick}
          className="w-16 h-16 bg-[#1877F2] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-zinc-900 relative group transition-colors duration-300 hover:bg-[#166fe5]"
          aria-label="Visit Facebook Page"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-[#1877F2]/30 animate-ping opacity-75 group-hover:hidden" />

          <Facebook className="w-8 h-8 fill-white text-[#1877F2] stroke-[1]" />
        </motion.button>
      </div>
    </>
  );
};

export default SocialButtons;
