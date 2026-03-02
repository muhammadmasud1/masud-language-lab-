
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Trophy, Bot, RefreshCcw, Info, HelpCircle } from 'lucide-react';
import { Language, User, QuizQuestion } from '../types';

interface Props {
  lang: Language;
  user: User | null;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: "How do you say 'Hello' in Chinese?",
    options: ['Nǐ hǎo', 'Xièxiè', 'Zàijiàn', 'Duìbùqǐ'],
    correctAnswer: 0,
    explanation: "চাইনিজ ভাষায় 'হ্যালো' বলতে 'Nǐ hǎo' (你好) ব্যবহার করা হয়।"
  },
  {
    id: 'q2',
    question: "What does 'Xièxiè' mean?",
    options: ['Goodbye', 'Please', 'Thank you', 'Sorry'],
    correctAnswer: 2,
    explanation: "'Xièxiè' (谢谢) মানে হলো ধন্যবাদ।"
  }
];

const QuizPage: React.FC<Props> = ({ lang, user }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load dynamic quiz data
    const loadQuizData = () => {
      const saved = localStorage.getItem('huayu_quiz_questions');
      const qList = saved ? JSON.parse(saved) : DEFAULT_QUESTIONS;
      setQuestions(qList);
    };

    loadQuizData();

    // Event listener for storage changes (multi-tab sync)
    const handleStorageSync = () => loadQuizData();
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [user, navigate]);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setIsFinished(false);
  };

  if (!user) return null;

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="bg-white dark:bg-zinc-900 p-20 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl opacity-40">
           <HelpCircle className="w-20 h-20 mx-auto mb-6 text-[#C1121F]" />
           <p className="font-black uppercase tracking-widest">{lang === 'EN' ? 'No quizzes available' : 'বর্তমানে কোনো কুইজ নেই'}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 p-12 rounded-[4rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-600 mx-auto mb-8">
            <Trophy className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black mb-4">{lang === 'EN' ? 'Quiz Complete!' : 'কুইজ সম্পন্ন হয়েছে!'}</h2>
          <p className="text-xl text-zinc-500 mb-10">
            {lang === 'EN' ? `Your Score: ${score} / ${questions.length}` : `আপনার স্কোর: ${score} / ${questions.length}`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={restartQuiz} className="px-10 py-4 bg-[#C1121F] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20 flex items-center justify-center gap-3">
              <RefreshCcw className="w-5 h-5" /> {lang === 'EN' ? 'Try Again' : 'আবার চেষ্টা করুন'}
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-10 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
              {lang === 'EN' ? 'My Dashboard' : 'ড্যাশবোর্ড'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-[#C1121F]">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">{lang === 'EN' ? 'AI Chinese Teacher' : 'এআই চাইনিজ শিক্ষক'}</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full font-black text-xs uppercase tracking-widest">
          Score: {score}
        </div>
      </div>

      <div className="space-y-8">
        {/* Chat Message Question */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={currentIndex} className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
             <Sparkles className="w-5 h-5 text-[#C1121F]" />
          </div>
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] rounded-tl-none border border-zinc-200 dark:border-zinc-800 shadow-sm flex-grow">
            <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mb-2">
              {lang === 'EN' ? 'Answer this question carefully:' : 'এই প্রশ্নটির উত্তর মনোযোগ দিয়ে দিন:'}
            </p>
            <h3 className="text-3xl font-black text-[#C1121F] mb-0 tracking-tight">{currentQ?.question}</h3>
          </div>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ?.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctAnswer;
            const showResult = selectedOption !== null;

            return (
              <motion.button
                key={idx}
                whileHover={!showResult ? { scale: 1.02 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
                className={`p-6 rounded-[2rem] border-4 text-left font-black text-lg transition-all flex items-center justify-between gap-4 ${
                  !showResult ? 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 hover:border-[#C1121F]/30' :
                  isSelected && isCorrect ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400' :
                  isSelected && !isCorrect ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' :
                  isCorrect ? 'bg-green-50/50 dark:bg-green-900/10 border-green-500/50 text-green-700/50' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 opacity-40'
                }`}
              >
                <span>{opt}</span>
                {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 shrink-0" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {/* AI Feedback & Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center shrink-0">
                 <Bot className="w-5 h-5 text-[#C1121F]" />
              </div>
              <div className="flex-grow space-y-6">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] rounded-tl-none border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <p className="text-xl font-black text-[#C1121F] mb-4">
                    {selectedOption === currentQ.correctAnswer ? 'চমৎকার উত্তর 😊' : 'আরও একটু চেষ্টা করো 💪'}
                  </p>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 leading-relaxed">{currentQ.explanation}</p>
                  </div>
                </div>
                
                <button 
                  onClick={nextQuestion}
                  className="w-full py-6 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizPage;
