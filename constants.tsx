import { NavLink, Course, Book, Article, Testimonial } from './types';

export const COLORS = {
  primary: '#C1121F',
  secondary: '#000000',
  white: '#FFFFFF',
  gold: '#D4AF37',
};

export const PAYMENT_INFO = {
  bKash: '01788060657',
  Nagad: '01788060657',
  Rocket: '017880606578',
};

export const NAV_LINKS: NavLink[] = [
  { path: '/', label: { EN: 'Home', BN: 'Home' } },
  { path: '/store', label: { EN: 'PDF Store', BN: 'PDF Store' } },
  { path: '/courses', label: { EN: 'Courses', BN: 'Courses' } },
  { path: '/about', label: { EN: 'About', BN: 'About' } },
  { path: '/reviews', label: { EN: 'Reviews', BN: 'Reviews' } },
  { path: '/contact', label: { EN: 'Contact', BN: 'Contact' } },
];

export const PREMIUM_SERVICES = [
  {
    id: 'instructor',
    title: { EN: 'Master Instructor', BN: 'Master Instructor' },
    desc: { EN: 'Direct HSK training from HSK-6 certified expert with a focus on tonal precision and Hanzi stroke rules.', BN: 'Direct HSK training from HSK-6 certified expert with a focus on tonal precision and Hanzi stroke rules.' },
    icon: 'GraduationCap'
  },
  {
    id: 'interpreter',
    title: { EN: 'Professional Interpreter', BN: 'Professional Interpreter' },
    desc: { EN: 'Expert linguistic bridge for high-level bilateral summits, trade negotiations, and factory inspections.', BN: 'Expert linguistic bridge for high-level bilateral summits, trade negotiations, and factory inspections.' },
    icon: 'Globe'
  },
  {
    id: 'author',
    title: { EN: 'Lead Author', BN: 'Lead Author' },
    desc: { EN: 'Author of definitive Chinese learning literature featuring Hanzi, Pinyin, and comprehensive translations.', BN: 'Author of definitive Chinese learning literature featuring Hanzi, Pinyin, and comprehensive translations.' },
    icon: 'PenTool'
  }
];

export const COURSES: Course[] = [
  {
    id: 'hsk-1',
    title: { EN: 'HSK 1: Standard Course', BN: 'HSK 1: Standard Course' },
    level: 'Beginner',
    duration: '8 Weeks',
    price: '1499',
    description: { 
      EN: 'The essential start. Master the Pinyin pronunciation system, 4 tones, and initial 150 Hanzi characters with English/Bengali reference.', 
      BN: 'The essential start. Master the Pinyin pronunciation system, 4 tones, and initial 150 Hanzi characters with English/Bengali reference.' 
    },
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-2',
    title: { EN: 'HSK 2: Standard Course', BN: 'HSK 2: Standard Course' },
    level: 'Elementary',
    duration: '10 Weeks',
    price: '1499',
    description: { 
      EN: 'Expand your vocabulary. Master 300 words and daily conversations in Mandarin Chinese.', 
      BN: 'Expand your vocabulary. Master 300 words and daily conversations in Mandarin Chinese.' 
    },
    image: 'https://images.unsplash.com/photo-1523050335191-51fae873910e?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-3',
    title: { EN: 'HSK 3: Standard Course', BN: 'HSK 3: Standard Course' },
    level: 'Intermediate',
    duration: '12 Weeks',
    price: '2999',
    description: { 
      EN: 'Achieve communicative fluency. Master 600 words, grammar patterns, and discussion topics.', 
      BN: 'Achieve communicative fluency. Master 600 words, grammar patterns, and discussion topics.' 
    },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-4',
    title: { EN: 'HSK 4: Standard Course', BN: 'HSK 4: Standard Course' },
    level: 'Advanced',
    duration: '16 Weeks',
    price: '3999',
    description: { 
      EN: 'Professional proficiency. Master 1,200 words and converse fluently on complex academic and business topics.', 
      BN: 'Professional proficiency. Master 1,200 words and converse fluently on complex academic and business topics.' 
    },
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-bundle',
    title: { EN: 'Full Course: HSK 1 to 4 Complete Bundle', BN: 'Full Course: HSK 1 to 4 Complete Bundle' },
    level: 'Comprehensive',
    duration: '12 Months',
    price: '6999',
    description: { 
      EN: 'Complete HSK 1 to 4 all-in-one mastery bundle with lifetime access, mock tests, and student support.', 
      BN: 'Complete HSK 1 to 4 all-in-one mastery bundle with lifetime access, mock tests, and student support.' 
    },
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'intensive-spoken',
    title: { EN: 'Intensive Spoken Chinese & Pronunciation', BN: 'Intensive Spoken Chinese & Pronunciation' },
    level: 'Conversation',
    duration: '8 Weeks',
    price: '4999',
    description: { 
      EN: 'Focus on native speaking fluency, rapid tone sandhi mastery, and authentic business dialogues.', 
      BN: 'Focus on native speaking fluency, rapid tone sandhi mastery, and authentic business dialogues.' 
    },
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  }
];

export const BOOKS: Book[] = [
  {
    id: 'book-1',
    title: { EN: 'Chinese Master Guide (Hanzi, Pinyin & Translation)', BN: 'Chinese Master Guide (Hanzi, Pinyin & Translation)' },
    price: '450',
    image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
    description: { 
      EN: 'The definitive textbook for mastering Chinese with Hanzi, Pinyin, and translations.', 
      BN: 'The definitive textbook for mastering Chinese with Hanzi, Pinyin, and translations.' 
    },
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: { EN: 'The Strategic Advantage of Learning Mandarin Chinese', BN: 'The Strategic Advantage of Learning Mandarin Chinese' },
    excerpt: { EN: 'Why knowing Chinese is a career catalyst in modern global trade and international business.', BN: 'Why knowing Chinese is a career catalyst in modern global trade and international business.' },
    date: 'Dec 12, 2024',
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1528610624838-51846c4f9f6e?auto=format&fit=crop&q=80&w=800',
    type: 'article',
    status: 'published'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rahat Islam',
    role: 'BUSINESS CONSULTANT',
    content: { 
      EN: 'His translation and teaching expertise helped our company finalize a major trade deal in Shenzhen with confidence.', 
      BN: 'His translation and teaching expertise helped our company finalize a major trade deal in Shenzhen with confidence.' 
    },
    avatar: 'https://i.pravatar.cc/150?u=consultant',
  },
  {
    name: 'Sumaiya Akhter',
    role: 'HSK 3 STUDENT',
    content: { 
      EN: 'The best Chinese learning material available. The Hanzi stroke orders and Pinyin explanations are crystal clear!', 
      BN: 'The best Chinese learning material available. The Hanzi stroke orders and Pinyin explanations are crystal clear!' 
    },
    avatar: 'https://i.pravatar.cc/150?u=sumaiya',
  },
  {
    name: 'Asif Mahmud',
    role: 'HSK 4 SCHOLAR',
    content: { 
      EN: 'I passed HSK 4 with top scores! The eBook study guides and practice sheets were instrumental to my success.', 
      BN: 'I passed HSK 4 with top scores! The eBook study guides and practice sheets were instrumental to my success.' 
    },
    avatar: 'https://i.pravatar.cc/150?u=asif',
  },
  {
    name: 'Farhana Yeasmin',
    role: 'BEGINNER STUDENT',
    content: { 
      EN: 'Chinese characters seemed intimidating at first, but the step-by-step breakdown made it enjoyable and intuitive.', 
      BN: 'Chinese characters seemed intimidating at first, but the step-by-step breakdown made it enjoyable and intuitive.' 
    },
    avatar: 'https://i.pravatar.cc/150?u=farhana',
  },
  {
    name: 'Tanvir Ahmed',
    role: 'INTERNATIONAL TRADER',
    content: { 
      EN: 'The books are the absolute best resource for learning Chinese with practical vocabulary and dialogue examples.', 
      BN: 'The books are the absolute best resource for learning Chinese with practical vocabulary and dialogue examples.' 
    },
    avatar: 'https://i.pravatar.cc/150?u=tanvir',
  },
  {
    name: 'Nusrat Jahan',
    role: 'HSK 2 STUDENT',
    content: { 
      EN: 'The learning guides are very well structured. I feel completely confident speaking and writing Chinese now.', 
      BN: 'The learning guides are very well structured. I feel completely confident speaking and writing Chinese now.' 
    },
    avatar: 'https://i.pravatar.cc/150?u=nusrat',
  }
];
