
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
  completedLessons: string[]; // Lesson IDs
  lessonNotes?: { [lessonId: string]: string };
  lastViewedLessons?: { [courseId: string]: string }; // courseId -> lessonId
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
  driveUrl?: string;
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

export interface Review {
  id: string;
  userName?: string;
  userRole?: string;
  content?: Record<Language, string>;
  rating?: number;
  image: string;
  date?: string;
  status?: 'published' | 'draft';
}

export interface PlatformStats {
  totalUsers: number;
  totalCourses: number;
  totalArticles: number;
  totalRevenue: string;
}

export interface CarouselImage {
  id: string;
  image: string;
  title?: Record<Language, string>;
  order?: number;
}

// ==========================================
// MandarinShelf - PDF & eBook System Types
// ==========================================

export type PdfCategory = 
  | 'HSK PDFs'
  | 'Vocabulary'
  | 'Grammar'
  | 'Speaking'
  | 'Conversation'
  | 'Reading'
  | 'Chinese-Bangla'
  | 'Mock Tests'
  | 'Bundles';

export type HskLevel = 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6' | 'All Levels';

export interface PdfProduct {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number; // in BDT e.g. 350
  originalPrice: number; // in BDT e.g. 600
  discount?: number; // e.g. 42 (%)
  currency: string; // 'BDT'
  category: PdfCategory;
  subcategory?: string;
  hskLevel: HskLevel;
  language: string; // e.g. 'Chinese - Bengali'
  pages: number;
  fileSize: string; // e.g. '18.4 MB'
  coverImage: string;
  fullPdfPath?: string; // Protected Storage path
  downloadUrl?: string; // Protected download/content URL
  previewPages: string[]; // 1 to 3 page image URLs
  features: string[];
  chapters: string[];
  keywords: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  viewCount: number;
  previewCount: number;
  published: boolean;
  featured: boolean;
  isBundle?: boolean;
  bundleProductIds?: string[];
  isFree?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PdfOrderStatus = 
  | 'pending'
  | 'payment_submitted'
  | 'under_review'
  | 'paid'
  | 'rejected'
  | 'completed';

export interface PdfOrderItem {
  id: string;
  title: string;
  price: number;
  coverImage?: string;
  slug?: string;
}

export interface PdfOrder {
  orderId: string;
  userId: string;
  customerName: string;
  email: string;
  phone?: string;
  country?: string;
  productId: string;
  productTitle: string;
  items: PdfOrderItem[];
  amount: number;
  currency: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Binance';
  transactionId: string;
  senderNumber?: string;
  screenshotUrl?: string;
  status: PdfOrderStatus;
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface PdfPurchase {
  purchaseId: string;
  userId: string;
  productId: string;
  productTitle?: string;
  orderId: string;
  price: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'approved';
  accessGranted: boolean;
  createdAt: string;
  approvedAt: string;
}

export interface PdfReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  review: string;
  createdAt: string;
  approved: boolean;
}

export interface PdfPaymentSettings {
  bKash: {
    enabled: boolean;
    number: string;
    instructions: string;
  };
  Nagad: {
    enabled: boolean;
    number: string;
    instructions: string;
  };
  Rocket: {
    enabled: boolean;
    number: string;
    instructions: string;
  };
  Binance: {
    enabled: boolean;
    address: string;
    qrImage: string;
    instructions: string;
  };
}

