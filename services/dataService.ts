
import { Course, Book, Article, Lesson, QuizQuestion, Enrollment, BookOrder, User, Review, CarouselImage } from '../types';
import { supabase } from './supabaseClient';

export const dataService = {
  // --- Users ---
  getUserById: async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id);
    
    if (error) {
      console.error("Supabase GetUserById Error:", error.message);
      return null;
    }
    return (data && data.length > 0) ? data[0] as User : null;
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase());
    
    if (error) {
      console.error("Supabase GetUserByEmail Error:", error.message);
      return null;
    }
    return (data && data.length > 0) ? data[0] as User : null;
  },

  registerUser: async (user: User) => {
    const { error } = await supabase
      .from('users')
      .insert([user]);
    
    if (error) {
      console.error("Supabase Register Error:", error.message || JSON.stringify(error));
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);
    
    return !error;
  },

  // --- Courses ---
  getCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) return [];
    return data as Course[];
  },
  saveCourse: async (course: Course) => {
    const { error } = await supabase
      .from('courses')
      .upsert([course]);
    
    return !error;
  },
  deleteCourse: async (id: string) => {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Lessons ---
  getLessons: async (courseId?: string): Promise<Lesson[]> => {
    let query = supabase.from('lessons').select('*').order('order', { ascending: true });
    if (courseId) query = query.eq('courseId', courseId);
    
    const { data, error } = await query;
    if (error) return [];
    return data as Lesson[];
  },
  saveLesson: async (lesson: Lesson) => {
    const { error } = await supabase
      .from('lessons')
      .upsert([lesson]);
    
    return !error;
  },
  deleteLesson: async (id: string) => {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Books ---
  getBooks: async (): Promise<Book[]> => {
    const { data, error } = await supabase
      .from('books')
      .select('*');
    
    if (error) return [];
    return data as Book[];
  },
  saveBook: async (book: Book) => {
    const { error } = await supabase
      .from('books')
      .upsert([book]);
    
    return !error;
  },
  deleteBook: async (id: string) => {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Blog ---
  getArticles: async (): Promise<Article[]> => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) return [];
    return data as Article[];
  },
  saveArticle: async (article: Article) => {
    const { error } = await supabase
      .from('articles')
      .upsert([article]);
    
    return !error;
  },
  deleteArticle: async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Quiz ---
  getQuizQuestions: async (): Promise<QuizQuestion[]> => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*');
    
    if (error) return [];
    return data as QuizQuestion[];
  },
  saveQuizQuestion: async (q: QuizQuestion) => {
    const { error } = await supabase
      .from('quiz_questions')
      .upsert([q]);
    
    return !error;
  },
  deleteQuizQuestion: async (id: string) => {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Enrollments & Orders ---
  getEnrollments: async (userId?: string): Promise<Enrollment[]> => {
    let query = supabase.from('enrollments').select('*').order('date', { ascending: false });
    if (userId) query = query.eq('userId', userId);
    
    const { data, error } = await query;
    if (error) return [];
    return data as Enrollment[];
  },
  saveEnrollment: async (enr: Enrollment) => {
    const { error } = await supabase
      .from('enrollments')
      .insert([enr]);
    
    return !error;
  },
  updateEnrollmentStatus: async (id: string, status: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status })
      .eq('id', id);
    
    return !error;
  },
  deleteEnrollment: async (id: string) => {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  getBookOrders: async (userId?: string): Promise<BookOrder[]> => {
    let query = supabase.from('book_orders').select('*').order('date', { ascending: false });
    if (userId) query = query.eq('userId', userId);
    
    const { data, error } = await query;
    if (error) return [];
    return data as BookOrder[];
  },
  saveBookOrder: async (order: BookOrder) => {
    const { error } = await supabase
      .from('book_orders')
      .insert([order]);
    
    return !error;
  },

  // --- Reviews ---
  getReviews: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) return [];
    return data as Review[];
  },
  saveReview: async (review: Review) => {
    const { error } = await supabase
      .from('reviews')
      .upsert([review]);
    
    if (error) {
      console.error("Supabase Save Review Error:", error);
      throw new Error(error.message);
    }
    return true;
  },
  deleteReview: async (id: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    return !error;
  },

  // --- Storage ---
  uploadImage: async (file: File, bucket: string = 'reviews'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // --- Carousel Images ---
  getCarouselImages: async (): Promise<CarouselImage[]> => {
    try {
      const { data, error } = await supabase
        .from('carousel_images')
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        throw new Error(error.message);
      }
      if (data && data.length > 0) {
        return data as CarouselImage[];
      }
    } catch (err) {
      console.warn("Supabase carousel_images query failed/table not found, using localStorage & default fallback:", err);
    }
    
    // Fallback to localStorage
    const saved = localStorage.getItem('masud_carousel_images');
    if (saved) {
      try {
        return JSON.parse(saved) as CarouselImage[];
      } catch (e) {
        console.error("Parsed local storage carousel error:", e);
      }
    }
    return DEFAULT_CAROUSEL_IMAGES;
  },

  saveCarouselImage: async (imageItem: CarouselImage): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('carousel_images')
        .upsert([imageItem]);
      
      if (!error) return true;
      throw new Error(error.message);
    } catch (err) {
      console.warn("Supabase save carousel image failed, using localStorage fallback:", err);
    }

    // LocalStorage Fallback
    try {
      const current = await dataService.getCarouselImages();
      const existsIdx = current.findIndex(item => item.id === imageItem.id);
      if (existsIdx >= 0) {
        current[existsIdx] = imageItem;
      } else {
        current.push(imageItem);
      }
      current.sort((a, b) => (a.order || 0) - (b.order || 0));
      localStorage.setItem('masud_carousel_images', JSON.stringify(current));
      return true;
    } catch (e) {
      console.error("Local save carousel error:", e);
      return false;
    }
  },

  deleteCarouselImage: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('carousel_images')
        .delete()
        .eq('id', id);
      
      if (!error) return true;
      throw new Error(error.message);
    } catch (err) {
      console.warn("Supabase delete carousel image failed, using localStorage fallback:", err);
    }

    // LocalStorage Fallback
    try {
      const current = await dataService.getCarouselImages();
      const filtered = current.filter(item => item.id !== id);
      localStorage.setItem('masud_carousel_images', JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error("Local delete carousel error:", e);
      return false;
    }
  }
};

const DEFAULT_CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 'default-1',
    image: 'https://i.ibb.co.com/BVt9KnYL/file-00000000819071fdac0a25375e832d12-2.jpg',
    title: { EN: 'Practical Classrooms', BN: 'বাস্তবমুখী পাঠদান' },
    order: 1
  },
  {
    id: 'default-2',
    image: 'https://i.ibb.co.com/YTZ3mxcV/Whats-App-Image-2026-05-19-at-10-21-51-PM.jpg',
    title: { EN: 'Professional Translation Services', BN: 'পেশাদার অনুবাদসেবা ও সফল কার্যক্রম' },
    order: 2
  },
  {
    id: 'default-3',
    image: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=1200',
    title: { EN: 'High Quality Academic Books', BN: 'উচ্চমানের ডিকশনারি ও বইসমূহ' },
    order: 3
  },
  {
    id: 'default-4',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200',
    title: { EN: 'Advanced Translation & Interpreting Summit', BN: 'উচ্চপর্যায়ের কারিগরি অনুবাদ সামিট' },
    order: 4
  },
  {
    id: 'default-5',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    title: { EN: 'Direct Communication Practice', BN: 'সহজ ও সাবলীল যোগাযোগ কৌশল' },
    order: 5
  }
];
