
import { Course, Book, Article, Lesson, QuizQuestion, Enrollment, BookOrder, User } from '../types';
import { supabase } from './supabaseClient';

export const dataService = {
  // --- Users ---
  getUserByEmail: async (email: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error) return null;
    return data as User;
  },

  registerUser: async (user: User) => {
    const { error } = await supabase
      .from('users')
      .insert([user]);
    
    return !error;
  },

  updateUser: async (id: string, updates: Partial<User>) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);
    
    return !error;
  },

  login: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('password', password)
      .single();
    
    if (error) return null;
    return data as User;
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
  }
};
