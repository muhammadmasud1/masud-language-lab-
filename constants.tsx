
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
  Rocket: '01788060657-1',
};

export const NAV_LINKS: NavLink[] = [
  { path: '/', label: { EN: 'Home', BN: 'হোম' } },
  { path: '/about', label: { EN: 'About', BN: 'সম্পর্কে' } },
  { path: '/courses', label: { EN: 'Courses', BN: 'কোর্সসমূহ' } },
  { path: '/learn', label: { EN: 'Learn', BN: 'শিখুন' } },
  { path: '/store', label: { EN: 'Books', BN: 'বইসমূহ' } },
  { path: '/interpreter', label: { EN: 'Interpreter', BN: 'অনুবাদ সেবা' } },
  { path: '/live-lab', label: { EN: 'Live Lab', BN: 'লাইভ ল্যাব' } },
  { path: '/blog', label: { EN: 'Blog', BN: 'ব্লগ' } },
  { path: '/contact', label: { EN: 'Contact', BN: 'যোগাযোগ' } },
];

export const PREMIUM_SERVICES = [
  {
    id: 'instructor',
    title: { EN: 'Master Instructor', BN: 'প্রধান প্রশিক্ষক' },
    desc: { EN: 'Direct HSK training from HSK-6 certified expert with a focus on tonal precision.', BN: 'টোনাল নির্ভুলতার সাথে HSK-৬ প্রত্যয়িত বিশেষজ্ঞের কাছ থেকে সরাসরি প্রশিক্ষণ।' },
    icon: 'GraduationCap'
  },
  {
    id: 'interpreter',
    title: { EN: 'Professional Interpreter', BN: 'পেশাদার অনুবাদক' },
    desc: { EN: 'Expert linguistic bridge for high-level business summits and factory visits.', BN: 'ব্যবসায়িক সম্মেলন এবং ফ্যাক্টরি ভিজিটের জন্য বিশেষজ্ঞ ল্যাঙ্গুয়েজ ব্রিজ।' },
    icon: 'Globe'
  },
  {
    id: 'author',
    title: { EN: 'Lead Author', BN: 'প্রধান লেখক' },
    desc: { EN: 'Creator of the definitive Bengali-Chinese learning literature used nationwide.', BN: 'দেশব্যাপী ব্যবহৃত বাংলা-চাইনিজ শিক্ষার মানদণ্ড বইয়ের রচয়িতা।' },
    icon: 'PenTool'
  }
];

export const COURSES: Course[] = [
  {
    id: 'hsk-1',
    title: { EN: 'HSK 1: Standard Course', BN: 'HSK ১: স্ট্যান্ডার্ড কোর্স' },
    level: 'Beginner',
    duration: '8 Weeks',
    price: '৳ 1,500',
    description: { 
      EN: 'The essential start. Master the Pinyin system and initial 150 Hanzi characters.', 
      BN: 'নতুনদের জন্য আদর্শ শুরু। ১৫০টি মূল শব্দ এবং মৌলিক বাক্য গঠন শিখুন।' 
    },
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-2',
    title: { EN: 'HSK 2: Standard Course', BN: 'HSK ২: স্ট্যান্ডার্ড কোর্স' },
    level: 'Elementary',
    duration: '10 Weeks',
    price: '৳ 1,500',
    description: { 
      EN: 'Expand your vocabulary. Master 300 words and daily conversations.', 
      BN: 'আপনার দক্ষতা বাড়ান। ৩০০ শব্দ আয়ত্ত করুন এবং দৈনন্দিন কথোপকথন শিখুন।' 
    },
    image: 'https://images.unsplash.com/photo-1523050335191-51fae873910e?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-3',
    title: { EN: 'HSK 3: Standard Course', BN: 'HSK ৩: স্ট্যান্ডার্ড কোর্স' },
    level: 'Intermediate',
    duration: '12 Weeks',
    price: '৳ 2,000',
    description: { 
      EN: 'Achieve fluency. Master 600 words and discuss various topics.', 
      BN: 'সাবলীলতা অর্জন করুন। ৬০০ শব্দ আয়ত্ত করুন এবং বিভিন্ন বিষয়ে কথা বলা শিখুন।' 
    },
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-4',
    title: { EN: 'HSK 4: Standard Course', BN: 'HSK ৪: স্ট্যান্ডার্ড কোর্স' },
    level: 'Advanced',
    duration: '16 Weeks',
    price: '৳ 3,000',
    description: { 
      EN: 'Professional proficiency. Master 1200 words and complex topics.', 
      BN: 'পেশাদার দক্ষতা। ১২০০ শব্দ আয়ত্ত করুন এবং জটিল বিষয়ে সাবলীলভাবে আলোচনা করুন।' 
    },
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'hsk-bundle',
    title: { EN: 'Full Course: HSK 1 to 4 Bundle', BN: 'ফুল কোর্স: HSK ১ থেকে ৪ বান্ডেল' },
    level: 'Comprehensive',
    duration: '12 Months',
    price: '৳ 6,000',
    description: { 
      EN: 'Complete HSK 1-4 access at a discounted price. Best for career success.', 
      BN: 'সাবলীল চাইনিজ শেখার সেরা পথ। ডিসকাউন্ট মূল্যে HSK ১, ২, ৩ এবং ৪ এর পূর্ণ এক্সেস।' 
    },
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  },
  {
    id: 'intensive-spoken',
    title: { EN: 'Intensive Spoken Chinese', BN: 'নিবিড় কথোপকথন চাইনিজ' },
    level: 'Conversation',
    duration: '8 Weeks',
    price: '৳ 5,000',
    description: { 
      EN: 'Focus on speaking fluency and natural pronunciation for business.', 
      BN: 'ব্যবসা এবং যোগাযোগের জন্য সাবলীল উচ্চারণ শিখুন।' 
    },
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    status: 'published'
  }
];

export const BOOKS: Book[] = [
  {
    id: 'book-1',
    title: { EN: 'Bengali to Chinese Master Guide', BN: 'বাংলা থেকে চাইনিজ মাস্টার গাইড' },
    price: '৳ 450',
    image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
    description: { EN: 'The definitive textbook for Bengali speakers.', BN: 'বাঙালিদের জন্য চাইনিজ শেখার সেরা পাঠ্যবই।' },
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: { EN: 'The Strategic Advantage of Mandarin', BN: 'চাইনিজ ভাষার কৌশলগত গুরুত্ব' },
    excerpt: { EN: 'Why knowing Chinese is a career catalyst in 2024.', BN: '২০২৪ সালে কেন চাইনিজ জানা আপনার ক্যারিয়ারের জন্য টার্নিং পয়েন্ট হতে পারে।' },
    date: 'Dec 12, 2023',
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
      EN: 'His translation skills helped our company finalize a major deal in Shenzhen.', 
      BN: 'তার অনুবাদ দক্ষতা আমাদের কোম্পানিকে শেনজেনে একটি বড় চুক্তি সম্পন্ন করতে সাহায্য করেছে।' 
    },
    avatar: 'https://i.pravatar.cc/150?u=consultant',
  },
  {
    name: 'Sumaiya Akhter',
    role: 'HSK 3 STUDENT',
    content: { 
      EN: 'The best Chinese teacher in Bangladesh. His teaching is extremely easy to understand!', 
      BN: 'বাংলাদেশের সেরা চাইনিজ শিক্ষক। তার পাঠদান অত্যন্ত সহজবোধ্য!' 
    },
    avatar: 'https://i.pravatar.cc/150?u=sumaiya',
  }
];
