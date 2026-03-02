
export type Language = 'EN' | 'BN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  goal: string;
  avatar?: string;
  isAdmin?: boolean;
  password?: string;
  enrolledCourses: string[]; // Approved course IDs
  purchasedBooks: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[]; // 4 options
  correctAnswer: number; // 0, 1, 2, or 3
  explanation: string; // Explained in Bangla
}

export interface QuizResult {
  userId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  amount: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface BookOrder {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    id: string;
    title: string;
    price: string;
  }[];
  totalAmount: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;
  order: number;
  status: 'published' | 'draft';
}

export interface NavLink {
  label: Record<Language, string>;
  path: string;
}

export interface Course {
  id: string;
  title: Record<Language, string>;
  level: string;
  duration: string;
  price: string;
  description: Record<Language, string>;
  status?: 'published' | 'draft';
  image?: string;
}

export interface Book {
  id: string;
  title: Record<Language, string>;
  price: string;
  image: string;
  description: Record<Language, string>;
}

export interface Article {
  id: string;
  title: Record<Language, string>;
  excerpt: Record<Language, string>;
  content?: Record<Language, string>;
  date: string;
  category: string;
  image: string;
  videoUrl?: string; // For Vlogs
  type: 'image' | 'article' | 'video';
  status: 'published' | 'draft';
}

export interface Testimonial {
  name: string;
  role: string;
  content: Record<Language, string>;
  avatar: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalCourses: number;
  totalArticles: number;
  totalRevenue: string;
}
