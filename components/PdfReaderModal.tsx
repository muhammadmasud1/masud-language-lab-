import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, 
  BookOpen, List, ShieldCheck, CheckCircle2, Bookmark 
} from 'lucide-react';
import { PdfProduct, User, Language } from '../types';

interface Props {
  product: PdfProduct;
  user: User;
  orderId?: string;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const PdfReaderModal: React.FC<Props> = ({ product, user, orderId, isOpen, onClose, lang }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showToc, setShowToc] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const totalPages = product.pages || 100;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Create a downloadable text file blob with the licensed book information or link
      const content = `=====================================================
MANDARINSHELF • DIGITAL BOOKSTORE
Licensed eBook Copy
=====================================================
Book Title   : ${product.title}
Author       : Md. Masud Rana (HSK 6 Certified Expert)
Licensed To  : ${user.name} (${user.email})
User ID      : ${user.id}
Order ID     : ${orderId || 'Direct-Access'}
Pages        : ${product.pages}
File Format  : Digital PDF Master
Security     : Protected - Redistribution Prohibited
=====================================================

Dear ${user.name},

Thank you for purchasing "${product.title}" on MandarinShelf!
Your digital license has been verified by the administrator.

Chapters in this edition:
${product.chapters.map((c, i) => `${i + 1}. ${c}`).join('\n')}

For study support or pronunciation questions, contact our lab:
WhatsApp: 01788060657
Website : https://masudlanguagelab.com
=====================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${product.slug || 'mandarinshelf-ebook'}-licensed.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.98 }}
          className="relative w-full max-w-5xl h-[94vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setShowToc(!showToc)}
                className={`p-2 rounded-xl border transition ${showToc ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}`}
                title="Table of Contents"
              >
                <List className="w-4 h-4" />
              </button>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-400 bg-green-950/80 border border-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Licensed Access
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Order #{orderId || 'Active'}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-lg">
                  {product.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 transition"
              >
                <Download className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">{isDownloading ? 'Preparing...' : 'Download'}</span>
              </button>

              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 border border-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Reader Body with optional Table of Contents */}
          <div className="flex-1 flex overflow-hidden">
            {/* Table of Contents Drawer */}
            {showToc && (
              <div className="w-72 bg-slate-950 border-r border-slate-800 p-4 overflow-y-auto shrink-0 animate-in slide-in-from-left duration-200">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Bookmark className="w-3.5 h-3.5 text-red-500" /> Chapters
                </h4>
                <div className="space-y-1.5">
                  {product.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentPage(idx * 25 + 1);
                        setShowToc(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition truncate border border-transparent hover:border-slate-700"
                    >
                      <span className="text-red-400 font-bold mr-2">0{idx + 1}.</span>
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Viewport */}
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-between p-4 overflow-y-auto">
              <div 
                className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 relative min-h-[580px] my-auto transition-transform"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* Security stamp watermark in bottom */}
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between border-t border-slate-200 pt-2 text-[10px] text-slate-400 font-mono">
                  <span>Licensed to: {user.name} ({user.email})</span>
                  <span>MandarinShelf • Page {currentPage} of {totalPages}</span>
                </div>

                {/* Page Content simulation */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <span className="text-xs font-black uppercase tracking-widest text-[#C1121F]">
                      {product.hskLevel} • {product.category}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">MandarinShelf Official Edition</span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    {product.chapters[(currentPage - 1) % product.chapters.length] || 'Essential Mastery Course'}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed font-serif">
                    ম্যান্ডারিন চাইনিজ ভাষায় বাক্য গঠনের মূল সূত্র এবং ধ্বনিতত্ত্বের নিয়মিত অনুশীলন আপনাকে অত্যন্ত দ্রুত আত্মবিশ্বাসী করে তুলবে। 
                    নিচের পাঠগুলো প্রতিদিন ২০ মিনিট করে উচ্চস্বরে পড়ুন।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                    <div className="bg-red-50/70 border border-red-200 rounded-xl p-4">
                      <div className="text-2xl font-black text-[#C1121F] mb-1">学无止境</div>
                      <div className="text-xs font-mono font-bold text-slate-600">Xué wú zhǐ jìng</div>
                      <div className="text-xs text-slate-700 mt-1 font-semibold">জ্ঞান অর্জনের কোনো শেষ নেই (চাইনিজ প্রবাদ)</div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="text-2xl font-black text-slate-800 mb-1">千里之行，始于足下</div>
                      <div className="text-xs font-mono font-bold text-slate-600">Qiān lǐ zhī xíng, shǐ yú zú xià</div>
                      <div className="text-xs text-slate-700 mt-1 font-semibold">হাজার মাইলের যাত্রা এক কদম দিয়ে শুরু হয়</div>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                    <strong>শিক্ষকের বিশেষ পরামর্শ:</strong> প্রতিটি নতুন শব্দের পিনয়িন টোন ও ক্যারেক্টারের স্ট্রোক ভালো করে খেয়াল করুন। 
                    অডিও প্র্যাকটিস করার জন্য আমাদের Live Lab পেইজে গিয়ে সরাসরি ভয়েস কথোপকথন চর্চা করতে পারেন।
                  </div>
                </div>
              </div>

              {/* Bottom Pagination Controls */}
              <div className="mt-4 flex items-center justify-center gap-4 bg-slate-900/90 border border-slate-800 rounded-full px-5 py-2 shadow-xl">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-xs font-mono font-bold text-slate-300">
                  Page {currentPage} of {totalPages}
                </span>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PdfReaderModal;
