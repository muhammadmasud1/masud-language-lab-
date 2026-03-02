
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
// Use a cast to any to bypass broken type definitions for motion components in this environment
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { 
  Globe, Menu, Sun, Moon, LogOut, 
  ShieldCheck, ChevronDown, ChevronRight, LayoutDashboard, X, ArrowRight, UserCircle
} from 'lucide-react';

import { Language, User } from './types';
import { NAV_LINKS } from './constants';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import LearnPage from './pages/LearnPage';
import StorePage from './pages/StorePage';
import BlogPage from './pages/BlogPage';
import InterpreterPage from './pages/InterpreterPage';
import ContactPage from './pages/ContactPage';
import LiveLabPage from './pages/LiveLabPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CheckoutPage from './pages/CheckoutPage';
import BookCheckoutPage from './pages/BookCheckoutPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import AIChatbot from './components/AIChatbot';
import CustomCursor from './components/CustomCursor';

const ScrollToTop = ({ closeMenu }: { closeMenu: () => void }) => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    closeMenu();
  }, [pathname, closeMenu]);
  return null;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('BN');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('huayu_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('huayu_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('huayu_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('huayu_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'EN' ? 'BN' : 'EN';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const closeMobileMenu = React.useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('huayu_user');
    setCurrentUser(null);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <Router>
      <ScrollToTop closeMenu={closeMobileMenu} />
      <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
        <CustomCursor />
        
        {/* Modern Sticky Navbar */}
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
          ? 'h-20 bg-white/95 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-lg' 
          : 'h-24 bg-white/50 dark:bg-transparent backdrop-blur-sm'
        }`}>
          <div className="max-w-[1440px] mx-auto px-6 h-full">
            <div className="flex justify-between items-center h-full gap-4">
              
              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-3 group relative z-[60] shrink-0">
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-11 h-11 bg-[#C1121F] rounded-2xl flex items-center justify-center text-white font-black text-2xl chinese-font shadow-lg shadow-red-500/20"
                >
                  华
                </motion.div>
                <div className="hidden sm:block">
                  <span className="text-xl font-black tracking-tighter block leading-none uppercase">MASUD</span>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[#C1121F] font-black">LANGUAGE LAB</span>
                </div>
              </Link>

              {/* Desktop Nav Links - Visible above 768px (md) */}
              <div className="hidden md:flex items-center justify-center flex-grow">
                <div className="flex items-center gap-1">
                  {NAV_LINKS.map(link => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      className="px-3 py-2 text-[13px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-[#C1121F] dark:hover:text-white transition-all relative group"
                    >
                      {link.label[lang]}
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C1121F] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 relative z-[60] shrink-0">
                <button 
                  onClick={toggleLang} 
                  className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 items-center gap-2 text-[12px] font-black uppercase tracking-widest transition-all text-zinc-600 dark:text-zinc-300 flex"
                >
                  <Globe className="w-4 h-4 text-zinc-400" /> {lang}
                </button>

                <button 
                  onClick={() => setDarkMode(!darkMode)} 
                  className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#C1121F] transition-all"
                >
                  {darkMode ? <Sun className="w-4.5 h-4.5 text-gold" /> : <Moon className="w-4.5 h-4.5 text-zinc-400" />}
                </button>

                {currentUser ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#C1121F] transition-all"
                    >
                      <div className="w-7 h-7 bg-[#C1121F] rounded-lg flex items-center justify-center text-[10px] text-white font-black">
                        {currentUser.isAdmin ? 'A' : currentUser.name.charAt(0)}
                      </div>
                      <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 z-[70] overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{currentUser.name}</p>
                          </div>
                          
                          <Link 
                            to="/profile" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[#C1121F] transition-all"
                          >
                            <UserCircle className="w-4 h-4" />
                            {lang === 'BN' ? 'প্রোফাইল' : 'My Profile'}
                          </Link>

                          <Link 
                            to="/dashboard" 
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[#C1121F] transition-all"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            {lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                          </Link>

                          {currentUser.isAdmin && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-[#C1121F] transition-all"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              {lang === 'BN' ? 'এডমিন প্যানেল' : 'Admin Panel'}
                            </Link>
                          )}

                          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />

                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            {lang === 'BN' ? 'লগআউট' : 'Logout'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="px-7 py-3 bg-[#C1121F] text-white rounded-xl text-[14px] font-black hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95">
                    {lang === 'BN' ? 'লগইন' : 'Login'}
                  </Link>
                )}

                {/* Hamburger Button - Visible below 768px (md) */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="md:hidden p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-[#C1121F] transition-all relative z-[100]"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Global Padding Fix */}
        <main className="flex-grow pt-24 transition-all">
          <Routes>
            <Route path="/" element={<HomePage lang={lang} />} />
            <Route path="/about" element={<AboutPage lang={lang} />} />
            <Route path="/courses" element={<CoursesPage lang={lang} user={currentUser} />} />
            <Route path="/learn" element={<LearnPage lang={lang} />} />
            <Route path="/store" element={<StorePage lang={lang} />} />
            <Route path="/blog" element={<BlogPage lang={lang} />} />
            <Route path="/interpreter" element={<InterpreterPage lang={lang} />} />
            <Route path="/live-lab" element={<LiveLabPage lang={lang} />} />
            <Route path="/contact" element={<ContactPage lang={lang} />} />
            <Route path="/login" element={<LoginPage lang={lang} setUser={setCurrentUser} />} />
            <Route path="/admin/login" element={<AdminLoginPage lang={lang} setUser={setCurrentUser} />} />
            <Route path="/register" element={<RegisterPage lang={lang} setUser={setCurrentUser} />} />
            <Route path="/checkout/:courseId" element={<CheckoutPage lang={lang} user={currentUser} />} />
            <Route path="/book-checkout" element={<BookCheckoutPage lang={lang} user={currentUser} />} />
            <Route path="/lesson/:courseId" element={currentUser ? <LessonPage lang={lang} user={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/quiz" element={<QuizPage lang={lang} user={currentUser} />} />
            <Route path="/profile" element={<ProfilePage lang={lang} user={currentUser} setUser={setCurrentUser} />} />
            <Route path="/dashboard" element={currentUser ? <DashboardPage lang={lang} user={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/admin/*" element={currentUser?.isAdmin ? <AdminDashboard lang={lang} /> : <Navigate to="/admin/login" />} />
          </Routes>
        </main>

        <AIChatbot lang={lang} />
        
        {/* Mobile Menu Overlay & Slide-in Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="md:hidden">
              {/* Background Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              />

              {/* Slide-in Menu */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-zinc-950 z-[9999] shadow-2xl flex flex-col"
              >
                <div className="p-6 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#C1121F] rounded-xl flex items-center justify-center text-white font-black text-xl chinese-font">华</div>
                    <span className="font-black text-sm uppercase tracking-tighter">MASUD LAB</span>
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 text-zinc-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-2">
                  {NAV_LINKS.map(link => (
                    <Link 
                      key={link.path} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-4 rounded-2xl text-lg font-black text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-[#C1121F] transition-all group"
                    >
                      {link.label[lang]}
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </Link>
                  ))}
                </div>

                <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  {currentUser ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/profile" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                      >
                        <UserCircle className="w-6 h-6 text-[#C1121F]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'BN' ? 'প্রোফাইল' : 'Profile'}</span>
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                      >
                        <LayoutDashboard className="w-6 h-6 text-[#C1121F]" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'BN' ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="col-span-2 flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs"
                      >
                        <LogOut className="w-5 h-5" />
                        {lang === 'BN' ? 'লগআউট' : 'Logout'}
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-5 bg-[#C1121F] text-white rounded-2xl text-center font-black uppercase tracking-widest text-sm shadow-xl shadow-red-500/20"
                    >
                      {lang === 'BN' ? 'লগইন করুন' : 'Login Now'}
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <footer className="bg-zinc-950 py-20 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto px-6 text-center">
             <div className="w-12 h-12 bg-[#C1121F] rounded-2xl flex items-center justify-center text-white font-black text-xl chinese-font mb-6 mx-auto">华</div>
             <p className="text-zinc-500 mb-4 tracking-widest uppercase text-[10px] font-black">Connecting Bangladesh & China</p>
             <p className="text-zinc-600 text-[11px] uppercase font-black tracking-[0.4em]">© {new Date().getFullYear()} Masud Language Lab</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
