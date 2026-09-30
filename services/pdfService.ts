import { db, storage } from './firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PdfProduct, PdfOrder, PdfPurchase, PdfReview, PdfPaymentSettings } from '../types';

// ==========================================
// Demo Preview SVG Generator (High Quality)
// ==========================================
const createSamplePreviewPage = (title: string, pageNum: number, hskLevel: string, topic: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 850" width="600" height="850">
    <defs>
      <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#1E293B"/>
      </linearGradient>
      <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F1F5F9" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Page Background -->
    <rect width="600" height="850" fill="#FFFFFF"/>
    <rect width="600" height="850" fill="url(#grid)" opacity="0.6"/>

    <!-- Decorative Left Spine Line -->
    <rect x="0" y="0" width="8" height="850" fill="#C1121F"/>

    <!-- Top Header -->
    <rect x="25" y="25" width="550" height="60" rx="12" fill="url(#headerGrad)"/>
    <text x="45" y="55" font-family="sans-serif" font-size="12" font-weight="900" fill="#EF4444" letter-spacing="3">MANDARINSHELF • DIGITAL BOOKSTORE</text>
    <text x="45" y="73" font-family="sans-serif" font-size="14" font-weight="700" fill="#FFFFFF">${title.substring(0, 36)}</text>
    <rect x="490" y="38" width="65" height="26" rx="8" fill="#C1121F"/>
    <text x="522" y="55" font-family="sans-serif" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">${hskLevel}</text>

    <!-- Lesson Subtitle / Topic -->
    <text x="45" y="125" font-family="sans-serif" font-size="18" font-weight="900" fill="#0F172A">Sample Page ${pageNum} : ${topic}</text>
    <line x1="45" y1="138" x2="555" y2="138" stroke="#E2E8F0" stroke-width="2"/>

    <!-- Content Blocks (Vocabulary / Dialogue / Grammar) -->
    <!-- Card 1: Chinese Characters with Pinyin & English -->
    <rect x="45" y="160" width="510" height="90" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="70" y="200" font-family="serif" font-size="34" font-weight="bold" fill="#C1121F">你好 • Nǐ hǎo</text>
    <text x="70" y="230" font-family="sans-serif" font-size="14" font-weight="600" fill="#334155">Meaning: Hello / How are you (Common daily greeting)</text>
    <rect x="460" y="175" width="75" height="24" rx="6" fill="#FEE2E2"/>
    <text x="497" y="191" font-family="sans-serif" font-size="11" font-weight="700" fill="#991B1B" text-anchor="middle">HSK Core</text>

    <!-- Card 2 -->
    <rect x="45" y="265" width="510" height="90" rx="12" fill="#F8FAFC" stroke="#E2E8F0"/>
    <text x="70" y="305" font-family="serif" font-size="34" font-weight="bold" fill="#0F172A">谢谢 • Xièxie</text>
    <text x="70" y="335" font-family="sans-serif" font-size="14" font-weight="600" fill="#334155">Meaning: Thank you / Expressing gratitude</text>
    <rect x="460" y="280" width="75" height="24" rx="6" fill="#FEF3C7"/>
    <text x="497" y="296" font-family="sans-serif" font-size="11" font-weight="700" fill="#92400E" text-anchor="middle">Essential</text>

    <!-- Card 3: Grammar Rule Box -->
    <rect x="45" y="375" width="510" height="150" rx="14" fill="#FEF2F2" stroke="#FCA5A5" stroke-dasharray="4,4"/>
    <rect x="65" y="392" width="140" height="26" rx="6" fill="#C1121F"/>
    <text x="135" y="410" font-family="sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Key Grammar Pattern</text>
    <text x="65" y="445" font-family="sans-serif" font-size="14" font-weight="700" fill="#1E293B">1. In Mandarin Chinese, verbs never conjugate for tense.</text>
    <text x="65" y="475" font-family="sans-serif" font-size="13" font-weight="500" fill="#475569">Simply add time indicators like 昨天 (Zuótiān - Yesterday) or 明天 (Míngtiān - Tomorrow).</text>
    <text x="65" y="505" font-family="serif" font-size="15" font-weight="bold" fill="#991B1B">Example: 我昨天去学校 (I went to school yesterday).</text>

    <!-- Card 4: Practical Dialogue Practice -->
    <rect x="45" y="545" width="510" height="155" rx="14" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="70" y="580" font-family="sans-serif" font-size="15" font-weight="800" fill="#0F172A">Practical Dialogue (Standard Pronunciation)</text>
    <text x="70" y="612" font-family="serif" font-size="16" font-weight="bold" fill="#1E293B">A: 您好！请问您是马苏德老师吗？(Nín hǎo! Qǐngwèn nín shì Mǎsùdé lǎoshī ma?)</text>
    <text x="70" y="635" font-family="sans-serif" font-size="12" font-weight="500" fill="#64748B">— Hello! May I ask if you are Teacher Masud?</text>
    <text x="70" y="665" font-family="serif" font-size="16" font-weight="bold" fill="#C1121F">B: 是的，我就是。很高兴认识您！(Shì de, wǒ jiù shì. Hěn gāoxìng rènshí nín!)</text>
    <text x="70" y="688" font-family="sans-serif" font-size="12" font-weight="500" fill="#64748B">— Yes, that is me. Very pleased to meet you!</text>

    <!-- Watermark Across Center (Diagonal) -->
    <g transform="translate(300, 425) rotate(-35)">
      <text x="0" y="0" font-family="sans-serif" font-size="34" font-weight="900" fill="#C1121F" opacity="0.18" text-anchor="middle" letter-spacing="6">MANDARINSHELF PREVIEW</text>
      <text x="0" y="32" font-family="sans-serif" font-size="13" font-weight="700" fill="#000000" opacity="0.15" text-anchor="middle" letter-spacing="3">SAMPLE PAGE • DO NOT REDISTRIBUTE</text>
    </g>

    <!-- Bottom Page Indicator & Copyright -->
    <line x1="45" y1="790" x2="555" y2="790" stroke="#E2E8F0" stroke-width="1.5"/>
    <text x="45" y="815" font-family="sans-serif" font-size="11" font-weight="700" fill="#94A3B8">MandarinShelf by Md. Masud Rana (HSK 6)</text>
    <text x="555" y="815" font-family="sans-serif" font-size="12" font-weight="800" fill="#C1121F" text-anchor="end">Page ${pageNum} of 3</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ==========================================
// Initial High Quality Demo Seed Products
// ==========================================
export const DEMO_PDF_PRODUCTS: PdfProduct[] = [
  {
    id: 'pdf-hsk-1-4-master',
    title: 'HSK 1–4 Complete Master Handbook',
    slug: 'hsk-1-4-complete-master-handbook',
    shortDescription: 'Complete 1,200 essential vocabulary words, standard pinyin, grammar structures, and sample sentences for HSK 1 to 4.',
    description: 'The definitive master handbook designed for international learners and professionals aiming to master HSK 1 through 4. Includes accurate pinyin tone markings, English definitions, contextual example sentences, and stroke order diagrams for exam success.',
    price: 499,
    originalPrice: 950,
    discount: 47,
    currency: 'BDT',
    category: 'HSK PDFs',
    hskLevel: 'HSK 1',
    language: 'Chinese - English',
    pages: 320,
    fileSize: '24.5 MB',
    coverImage: 'https://images.unsplash.com/photo-1544640808-32ca72ac7f37?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-hsk-1-4-master/full.pdf',
    downloadUrl: 'https://example.com/demo/hsk-1-4-master.pdf',
    previewPages: [
      createSamplePreviewPage('HSK 1–4 Complete Master Handbook', 1, 'HSK 1-4', 'Pinyin Rules & Initial Greetings'),
      createSamplePreviewPage('HSK 1–4 Complete Master Handbook', 2, 'HSK 1-4', 'Grammar Patterns & Essential Verbs'),
      createSamplePreviewPage('HSK 1–4 Complete Master Handbook', 3, 'HSK 1-4', 'Practical Dialogue & Real Test Phrases'),
    ],
    features: [
      'All 1,200 HSK 1-4 official vocabulary with pinyin and definitions',
      'Contextual real-world example sentences for each term',
      'Visual tone and pronunciation breakthrough charts',
      'Print-ready high-resolution vector PDF format',
      'Lifetime digital access and free future edition updates'
    ],
    chapters: [
      'Chapter 1: Chinese Phonetics and Pinyin Mastery',
      'Chapter 2: HSK 1 Core Vocabulary and Sentence Structure',
      'Chapter 3: HSK 2 Everyday Essential Conversations',
      'Chapter 4: HSK 3 Connectives and Intermediate Grammar',
      'Chapter 5: HSK 4 Advanced Reading and Test Strategies'
    ],
    keywords: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'Chinese vocabulary', 'Pinyin', 'Chinese grammar', 'Exam prep'],
    rating: 4.9,
    reviewCount: 148,
    salesCount: 820,
    viewCount: 3420,
    previewCount: 1250,
    published: true,
    featured: true,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-03-15T12:00:00Z'
  },
  {
    id: 'pdf-1800-common-words',
    title: '1800+ Most Common Chinese Words & Real-Life Sentences',
    slug: '1800-most-common-chinese-words',
    shortDescription: '1,800+ high-frequency Chinese words and conversational phrases categorized by real-life daily topics.',
    description: 'The fastest shortcut to conversational fluency. This curated collection organizes 1,800+ high-utility words into practical thematic domains: food, shopping, travel, business, digital tech, and healthcare.',
    price: 350,
    originalPrice: 650,
    discount: 46,
    currency: 'BDT',
    category: 'Vocabulary',
    hskLevel: 'All Levels',
    language: 'Chinese - English',
    pages: 240,
    fileSize: '18.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-1800-common-words/full.pdf',
    downloadUrl: 'https://example.com/demo/1800-common-words.pdf',
    previewPages: [
      createSamplePreviewPage('1800+ Most Common Chinese Words', 1, 'All Levels', 'Core Daily Verbs & Actions'),
      createSamplePreviewPage('1800+ Most Common Chinese Words', 2, 'All Levels', 'Food, Market & Shopping Vocabulary'),
      createSamplePreviewPage('1800+ Most Common Chinese Words', 3, 'All Levels', 'Office & Digital Communication'),
    ],
    features: [
      '1,800+ high-frequency words grouped by practical real-world themes',
      'Realistic colloquial sentences for every single word',
      'Quick revision index with alphabetical and pinyin search',
      'Optimized typography for reading smoothly on mobile and iPad'
    ],
    chapters: [
      'Module 1: Time, Calendar, and Counting Numbers',
      'Module 2: Daily Routines, Family, and Work Activities',
      'Module 3: Travel, Hotels, Asking Directions, and Transit',
      'Module 4: E-Commerce, Digital Chat, and Business Terms'
    ],
    keywords: ['Chinese vocabulary', 'Common Chinese words', 'Daily conversation', 'Fluency'],
    rating: 4.8,
    reviewCount: 92,
    salesCount: 540,
    viewCount: 2890,
    previewCount: 980,
    published: true,
    featured: true,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-20T12:00:00Z'
  },
  {
    id: 'pdf-business-chinese-guide',
    title: 'Business Chinese & Factory Communication Guide',
    slug: 'business-chinese-factory-communication-guide',
    shortDescription: 'Professional handbook for international trade, factory visits, price negotiations, and business meetings.',
    description: 'An indispensable practical manual for international traders, merchandisers, and interpreters. Covers direct supplier communication in China, letters of credit (LC), factory inspections, MOQ negotiation, and business culture etiquette.',
    price: 550,
    originalPrice: 1100,
    discount: 50,
    currency: 'BDT',
    category: 'Conversation',
    hskLevel: 'HSK 3',
    language: 'Chinese - English',
    pages: 280,
    fileSize: '22.0 MB',
    coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-business-chinese-guide/full.pdf',
    downloadUrl: 'https://example.com/demo/business-chinese.pdf',
    previewPages: [
      createSamplePreviewPage('Business Chinese & Factory Guide', 1, 'HSK 3', 'Factory Tour & Sample Inquiries'),
      createSamplePreviewPage('Business Chinese & Factory Guide', 2, 'HSK 3', 'Price Negotiation & MOQ Terms'),
      createSamplePreviewPage('Business Chinese & Factory Guide', 3, 'HSK 3', 'Contracts, Shipping & WeChat Business'),
    ],
    features: [
      'Commercial email and WeChat business negotiation templates',
      'Factory inspection, quality assurance (QA), and testing terminology',
      'Comprehensive glossary of bilateral import-export vocabulary'
    ],
    chapters: [
      'Chapter 1: Formal Introductions and Business Card Exchange',
      'Chapter 2: Sample Orders, Tooling, and Production Timelines',
      'Chapter 3: Price Bargaining, Payment Terms, and Discounts',
      'Chapter 4: Banquet Etiquette and Chinese Business Dining Culture'
    ],
    keywords: ['Business Chinese', 'Factory communication', 'Trade', 'Interpreter', 'Negotiation'],
    rating: 5.0,
    reviewCount: 64,
    salesCount: 310,
    viewCount: 1980,
    previewCount: 740,
    published: true,
    featured: true,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-22T12:00:00Z'
  },
  {
    id: 'pdf-chinese-grammar-demystified',
    title: 'Chinese Grammar Demystified: Sentence Structure & Rules',
    slug: 'chinese-grammar-demystified',
    shortDescription: 'Clear breakdown of complex Mandarin grammar rules, aspect particles, and sentence structures.',
    description: 'Mastering Chinese grammar is simple when explained through clear patterns. This guide demystifies tricky particles such as 把 (bǎ), 被 (bèi), 过 (guò), 了 (le), and provides an exhaustive reference of measure words (classifiers).',
    price: 399,
    originalPrice: 750,
    discount: 47,
    currency: 'BDT',
    category: 'Grammar',
    hskLevel: 'HSK 2',
    language: 'Chinese - English',
    pages: 210,
    fileSize: '15.8 MB',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-chinese-grammar-demystified/full.pdf',
    downloadUrl: 'https://example.com/demo/chinese-grammar.pdf',
    previewPages: [
      createSamplePreviewPage('Chinese Grammar Demystified', 1, 'HSK 2', 'Sentence Structure & Word Order'),
      createSamplePreviewPage('Chinese Grammar Demystified', 2, 'HSK 2', 'Aspect Particles: Le, Guo, Zhe'),
      createSamplePreviewPage('Chinese Grammar Demystified', 3, 'HSK 2', 'Measure Words & Classifier Reference'),
    ],
    features: [
      'Systematic comparison of English vs Chinese syntax patterns',
      'Top 50 common grammatical mistakes and how to avoid them',
      'Chapter-by-chapter exercises with complete answer keys'
    ],
    chapters: [
      'Chapter 1: Subject-Verb-Object (SVO) and Time-Manner-Place Order',
      'Chapter 2: Aspect Particles and Completion (Le, Guo, Zhe)',
      'Chapter 3: Question Formation and Negation with 不 (Bù) & 没 (Méi)',
      'Chapter 4: The Ba-Construction (把) and Passive Voice (被)'
    ],
    keywords: ['Chinese grammar', 'Grammar', 'HSK 2', 'Sentence structure', 'Syntax'],
    rating: 4.9,
    reviewCount: 88,
    salesCount: 420,
    viewCount: 2210,
    previewCount: 890,
    published: true,
    featured: false,
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-03-18T12:00:00Z'
  },
  {
    id: 'pdf-intensive-spoken-chinese',
    title: 'Intensive Spoken Chinese & Pronunciation Breakthrough',
    slug: 'intensive-spoken-chinese-pronunciation',
    shortDescription: 'Master 4 tones, tone changes, and speak Mandarin naturally with confidence and authentic rhythm.',
    description: 'Overcome hesitation and speak fluent Mandarin naturally. Learn how native speakers connect sounds, use colloquial fillers, apply the half-third-tone rule, and express complex feelings with ease.',
    price: 420,
    originalPrice: 800,
    discount: 48,
    currency: 'BDT',
    category: 'Speaking',
    hskLevel: 'All Levels',
    language: 'Chinese - English',
    pages: 260,
    fileSize: '19.6 MB',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-intensive-spoken-chinese/full.pdf',
    downloadUrl: 'https://example.com/demo/spoken-chinese.pdf',
    previewPages: [
      createSamplePreviewPage('Intensive Spoken Chinese', 1, 'All Levels', 'Tone Mastery & Mouth Position'),
      createSamplePreviewPage('Intensive Spoken Chinese', 2, 'All Levels', 'Expressing Emotions & Slang'),
      createSamplePreviewPage('Intensive Spoken Chinese', 3, 'All Levels', 'Real-world Telephone & Online Chat'),
    ],
    features: [
      'Tone sandhi rules and secret techniques for natural pronunciation',
      'Authentic dialogues for every real-life social scenario',
      'Illustrated mouth position guides for tricky initials like Zh, Ch, Sh, R'
    ],
    chapters: [
      'Chapter 1: The 4 Tones, Neutral Tone, and Half-Third Tone Rules',
      'Chapter 2: Natural Opinions, Agreement, and Polite Disagreement',
      'Chapter 3: Casual Banter, Trendy Internet Slang, and Idioms',
      'Chapter 4: Emergency Situations, Medical Visits, and Asking Help'
    ],
    keywords: ['Speaking', 'Pinyin', 'Tones', 'Conversation', 'Spoken Chinese'],
    rating: 4.8,
    reviewCount: 76,
    salesCount: 380,
    viewCount: 1840,
    previewCount: 650,
    published: true,
    featured: false,
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-24T12:00:00Z'
  },
  {
    id: 'pdf-hsk-5-advanced-vocab',
    title: 'HSK 5 Advanced Vocabulary & Speed Reading Masterclass',
    slug: 'hsk-5-advanced-vocabulary-speed-reading',
    shortDescription: 'Comprehensive breakdown of 2,500 HSK 5 terms, synonyms, and rapid reading comprehension passages.',
    description: 'Essential for students and scholars preparing for HSK 5 examinations or higher university education in China. Builds sharp capability to comprehend modern Chinese essays, news reports, and formal literature.',
    price: 590,
    originalPrice: 1200,
    discount: 51,
    currency: 'BDT',
    category: 'HSK PDFs',
    hskLevel: 'HSK 5',
    language: 'Chinese - English',
    pages: 380,
    fileSize: '31.2 MB',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-hsk-5-advanced-vocab/full.pdf',
    downloadUrl: 'https://example.com/demo/hsk-5-advanced.pdf',
    previewPages: [
      createSamplePreviewPage('HSK 5 Advanced Vocabulary', 1, 'HSK 5', 'Synonym Differentiation & Collocations'),
      createSamplePreviewPage('HSK 5 Advanced Vocabulary', 2, 'HSK 5', 'Speed Reading & Key Points Scanning'),
      createSamplePreviewPage('HSK 5 Advanced Vocabulary', 3, 'HSK 5', 'Formal Written Chinese (Shūmiànyǔ)'),
    ],
    features: [
      'Fine distinction guide for confusing HSK 5 near-synonym word pairs',
      '10 full-length practice reading passages modeled on official exam papers',
      'Origin stories and usage contexts of essential four-character idioms (Chengyu)'
    ],
    chapters: [
      'Chapter 1: Subtle Differences in High-Level Synonyms',
      'Chapter 2: Spoken vs Formal Written Chinese (Shūmiànyǔ)',
      'Chapter 3: Science, Economics, and Social Opinion Articles',
      'Chapter 4: Exam Time Management and Rapid Skimming Techniques'
    ],
    keywords: ['HSK 5', 'HSK 4', 'HSK PDFs', 'Reading', 'Advanced vocabulary'],
    rating: 4.9,
    reviewCount: 42,
    salesCount: 190,
    viewCount: 1420,
    previewCount: 510,
    published: true,
    featured: false,
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-03-25T12:00:00Z'
  },
  {
    id: 'pdf-hanzi-radicals-stroke-workbook',
    title: 'Hanzi Radicals & Stroke Order Practice Workbook',
    slug: 'hanzi-radicals-stroke-order-workbook',
    shortDescription: 'Master Chinese character stroke order, 214 historical radicals, and practice with Tian Zi Ge grids.',
    description: 'Remembering Chinese characters becomes intuitive once you understand how radicals combine. Learn the mnemonic logic behind characters, avoid wrong stroke sequences, and practice handwriting with printable Tian Zi Ge worksheets.',
    price: 290,
    originalPrice: 500,
    discount: 42,
    currency: 'BDT',
    category: 'Reading',
    hskLevel: 'HSK 1',
    language: 'Chinese - English',
    pages: 180,
    fileSize: '14.1 MB',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-hanzi-radicals-stroke-workbook/full.pdf',
    downloadUrl: 'https://example.com/demo/hanzi-radicals.pdf',
    previewPages: [
      createSamplePreviewPage('Hanzi Radicals & Stroke Order', 1, 'HSK 1', 'Basic 8 Strokes & Writing Principles'),
      createSamplePreviewPage('Hanzi Radicals & Stroke Order', 2, 'HSK 1', 'Top 50 Semantic Radicals with Meanings'),
      createSamplePreviewPage('Hanzi Radicals & Stroke Order', 3, 'HSK 1', 'Tian Zi Ge Grid Handwriting Practice'),
    ],
    features: [
      'Breakdown of 214 official Kangxi radicals with mnemonic meanings',
      'The 8 fundamental stroke types and stroke-order precedence rules',
      'Printable high-resolution Tian Zi Ge (田字格) handwriting grid pages'
    ],
    chapters: [
      'Chapter 1: The Origins and Evolution of Chinese Characters',
      'Chapter 2: Left-to-Right, Top-to-Bottom Writing Rules',
      'Chapter 3: Decoding Unknown Characters Through Radicals'
    ],
    keywords: ['Hanzi', 'Stroke order', 'Radicals', 'Reading', 'Pinyin', 'Handwriting'],
    rating: 4.8,
    reviewCount: 53,
    salesCount: 290,
    viewCount: 1650,
    previewCount: 710,
    published: true,
    featured: false,
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-26T12:00:00Z'
  },
  {
    id: 'pdf-ultimate-bundle',
    title: 'Ultimate 4-in-1 Chinese Digital Library Bundle',
    slug: 'ultimate-chinese-digital-library-bundle',
    shortDescription: 'Master Handbook, 1800+ Words, Grammar Demystified, and Spoken Chinese — the complete mega bundle.',
    description: 'Our most popular comprehensive digital package for dedicated learners. Get instant lifetime access to all 4 flagship eBooks with over 1,000 pages of high-yield study material at over 57% savings.',
    price: 1199,
    originalPrice: 2800,
    discount: 57,
    currency: 'BDT',
    category: 'Bundles',
    hskLevel: 'All Levels',
    language: 'Chinese - English',
    pages: 1050,
    fileSize: '78.3 MB',
    coverImage: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/private/pdf-ultimate-bundle/full.pdf',
    downloadUrl: 'https://example.com/demo/ultimate-bundle.pdf',
    previewPages: [
      createSamplePreviewPage('Ultimate 4-in-1 Library Bundle', 1, 'Bundle', 'Complete Bundle Curriculum Map'),
      createSamplePreviewPage('Ultimate 4-in-1 Library Bundle', 2, 'Bundle', 'Sample Masterclass Chapter'),
      createSamplePreviewPage('Ultimate 4-in-1 Library Bundle', 3, 'Bundle', 'Quick Reference Tables & Cheat Sheets'),
    ],
    features: [
      'All-in-one instant access to all 4 bestselling PDF eBooks',
      '1,000+ pages of professionally edited learning content',
      'Huge 57% bundle discount savings',
      'Priority direct learning assistance and student support'
    ],
    chapters: [
      'Book 1: HSK 1–4 Complete Master Handbook',
      'Book 2: 1800+ Most Common Chinese Words',
      'Book 3: Chinese Grammar Demystified',
      'Book 4: Intensive Spoken Chinese Breakthrough'
    ],
    keywords: ['Bundles', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'Chinese vocabulary', 'Chinese grammar', 'Speaking'],
    rating: 5.0,
    reviewCount: 165,
    salesCount: 620,
    viewCount: 4200,
    previewCount: 1840,
    published: true,
    featured: true,
    isBundle: true,
    bundleProductIds: [
      'pdf-hsk-1-4-master',
      'pdf-1800-common-words',
      'pdf-chinese-grammar-demystified',
      'pdf-intensive-spoken-chinese'
    ],
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-27T12:00:00Z'
  },
  {
    id: 'pdf-free-starter-guide',
    title: 'Free Chinese Quick Starter & Tone Cheat Sheet',
    slug: 'free-chinese-quick-starter-tone-guide',
    shortDescription: 'Free tone pronunciation chart, 50 essential first words, and daily greetings booklet.',
    description: 'Jumpstart your Chinese learning journey with this 100% free starter booklet. Instant download with no fees or subscription required.',
    price: 0,
    originalPrice: 200,
    discount: 100,
    currency: 'BDT',
    category: 'Chinese-Bangla',
    hskLevel: 'HSK 1',
    language: 'Chinese - English',
    pages: 45,
    fileSize: '5.4 MB',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
    fullPdfPath: 'pdfs/public/free-starter-guide.pdf',
    downloadUrl: 'https://example.com/demo/free-starter-guide.pdf',
    previewPages: [
      createSamplePreviewPage('Free Chinese Quick Starter Guide', 1, 'HSK 1', '4 Tones Mastery Visual Chart'),
      createSamplePreviewPage('Free Chinese Quick Starter Guide', 2, 'HSK 1', 'First 50 Hanzi with English Meaning'),
      createSamplePreviewPage('Free Chinese Quick Starter Guide', 3, 'HSK 1', 'Self-Introduction 5 Step Formula'),
    ],
    features: [
      '100% free instant download in vector PDF format',
      'Clear visual tone pronunciation chart',
      'First 50 essential everyday Chinese vocabulary words'
    ],
    chapters: [
      'Part 1: Introduction to Mandarin & Tone Pitch Chart',
      'Part 2: Counting Numbers from 1 to 100',
      'Part 3: Introducing Yourself in 5 Simple Sentences'
    ],
    keywords: ['Free', 'HSK 1', 'Pinyin', 'Tones', 'Cheat sheet', 'Beginner'],
    rating: 4.9,
    reviewCount: 210,
    salesCount: 1540,
    viewCount: 5600,
    previewCount: 2200,
    published: true,
    featured: true,
    isFree: true,
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-28T12:00:00Z'
  }
];

// ==========================================
// Default Payment Settings
// ==========================================
export const DEFAULT_PAYMENT_SETTINGS: PdfPaymentSettings = {
  bKash: {
    enabled: true,
    number: '01788060657',
    instructions: 'Send Money via bKash personal account or dial *247#. Once the transaction is complete, submit your Transaction ID (TrxID) and sender number below.'
  },
  Nagad: {
    enabled: true,
    number: '01788060657',
    instructions: 'Send Money via Nagad app or dial *167#. Once successful, submit your TrxID and sender number below.'
  },
  Rocket: {
    enabled: true,
    number: '017880606578',
    instructions: 'Send Money via Rocket app or dial *322# to the 12-digit account number. Submit your TrxID below.'
  },
  Binance: {
    enabled: true,
    address: 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUS5',
    qrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUS5',
    instructions: 'Send USDT (TRC20 network) to the address or scan the QR code. Enter your Binance transaction TxID or hash for rapid verification.'
  }
};

// ==========================================
// Main PDF Service Implementation
// ==========================================
export const pdfService = {
  // --- Products ---
  getPdfProducts: async (): Promise<PdfProduct[]> => {
    try {
      if (db) {
        const snap = await getDocs(collection(db, 'pdfProducts'));
        if (!snap.empty) {
          const list: PdfProduct[] = [];
          snap.forEach(d => list.push(d.data() as PdfProduct));
          localStorage.setItem('mandarinshelf_products', JSON.stringify(list));
          return list;
        }
      }
    } catch (err) {
      console.warn('Firestore fetch pdfProducts fallback:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Local products parse error:', e);
      }
    }

    localStorage.setItem('mandarinshelf_products', JSON.stringify(DEMO_PDF_PRODUCTS));
    return DEMO_PDF_PRODUCTS;
  },

  getPdfProductBySlug: async (slug: string): Promise<PdfProduct | null> => {
    const all = await pdfService.getPdfProducts();
    return all.find(p => p.slug === slug) || null;
  },

  getPdfProductById: async (id: string): Promise<PdfProduct | null> => {
    const all = await pdfService.getPdfProducts();
    return all.find(p => p.id === id) || null;
  },

  savePdfProduct: async (product: PdfProduct): Promise<boolean> => {
    try {
      if (db) {
        await setDoc(doc(db, 'pdfProducts', product.id), product, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore save pdfProduct error:', err);
    }

    const all = await pdfService.getPdfProducts();
    const idx = all.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      all[idx] = product;
    } else {
      all.unshift(product);
    }
    localStorage.setItem('mandarinshelf_products', JSON.stringify(all));
    return true;
  },

  deletePdfProduct: async (id: string): Promise<boolean> => {
    try {
      if (db) {
        await deleteDoc(doc(db, 'pdfProducts', id));
      }
    } catch (err) {
      console.warn('Firestore delete pdfProduct error:', err);
    }

    const all = await pdfService.getPdfProducts();
    const filtered = all.filter(p => p.id !== id);
    localStorage.setItem('mandarinshelf_products', JSON.stringify(filtered));
    return true;
  },

  incrementViewCount: async (id: string) => {
    const all = await pdfService.getPdfProducts();
    const item = all.find(p => p.id === id);
    if (item) {
      item.viewCount = (item.viewCount || 0) + 1;
      await pdfService.savePdfProduct(item);
    }
  },

  incrementPreviewCount: async (id: string) => {
    const all = await pdfService.getPdfProducts();
    const item = all.find(p => p.id === id);
    if (item) {
      item.previewCount = (item.previewCount || 0) + 1;
      await pdfService.savePdfProduct(item);
    }
  },

  // --- Orders ---
  createPdfOrder: async (order: PdfOrder): Promise<boolean> => {
    try {
      if (db) {
        await setDoc(doc(db, 'pdfOrders', order.orderId), order);
      }
    } catch (err) {
      console.warn('Firestore save pdfOrder error:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_orders');
    const orders: PdfOrder[] = saved ? JSON.parse(saved) : [];
    orders.unshift(order);
    localStorage.setItem('mandarinshelf_orders', JSON.stringify(orders));
    return true;
  },

  getPdfOrders: async (userId?: string): Promise<PdfOrder[]> => {
    try {
      if (db) {
        const collRef = collection(db, 'pdfOrders');
        const q = userId ? query(collRef, where('userId', '==', userId)) : collRef;
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list: PdfOrder[] = [];
          snap.forEach(d => list.push(d.data() as PdfOrder));
          return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }
    } catch (err) {
      console.warn('Firestore fetch pdfOrders fallback:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_orders');
    const orders: PdfOrder[] = saved ? JSON.parse(saved) : [];
    if (userId) {
      return orders.filter(o => o.userId === userId);
    }
    return orders;
  },

  updatePdfOrderStatus: async (
    orderId: string, 
    status: PdfOrder['status'], 
    rejectionReason?: string
  ): Promise<boolean> => {
    const now = new Date().toISOString();
    const updateData: Partial<PdfOrder> = {
      status,
      approvedAt: status === 'paid' ? now : undefined,
      rejectionReason: status === 'rejected' ? rejectionReason : undefined
    };

    try {
      if (db) {
        await updateDoc(doc(db, 'pdfOrders', orderId), updateData);
      }
    } catch (err) {
      console.warn('Firestore update pdfOrder error:', err);
    }

    // Local mirror
    const saved = localStorage.getItem('mandarinshelf_orders');
    const orders: PdfOrder[] = saved ? JSON.parse(saved) : [];
    const target = orders.find(o => o.orderId === orderId);
    if (target) {
      target.status = status;
      if (status === 'paid') target.approvedAt = now;
      if (status === 'rejected') target.rejectionReason = rejectionReason;
      localStorage.setItem('mandarinshelf_orders', JSON.stringify(orders));

      // If approved, automatically create / update purchases!
      if (status === 'paid') {
        for (const item of target.items) {
          // Check if this item is a bundle
          const prod = await pdfService.getPdfProductById(item.id);
          if (prod && prod.isBundle && prod.bundleProductIds?.length) {
            for (const bundleId of prod.bundleProductIds) {
              await pdfService.grantPdfPurchase(
                target.userId, 
                bundleId, 
                target.orderId, 
                item.price, 
                target.paymentMethod
              );
            }
          }
          await pdfService.grantPdfPurchase(
            target.userId, 
            item.id, 
            target.orderId, 
            item.price, 
            target.paymentMethod
          );
        }
      }
    }
    return true;
  },

  // --- Purchases (Access System) ---
  grantPdfPurchase: async (
    userId: string, 
    productId: string, 
    orderId: string, 
    price: number, 
    paymentMethod: string
  ): Promise<boolean> => {
    const purchaseId = `pur_${userId}_${productId}`;
    const product = await pdfService.getPdfProductById(productId);
    const purchase: PdfPurchase = {
      purchaseId,
      userId,
      productId,
      productTitle: product?.title || 'Chinese Learning eBook',
      orderId,
      price,
      currency: 'BDT',
      paymentMethod,
      paymentStatus: 'approved',
      accessGranted: true,
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    };

    try {
      if (db) {
        await setDoc(doc(db, 'pdfPurchases', purchaseId), purchase, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore grantPdfPurchase error:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_purchases');
    const purchases: PdfPurchase[] = saved ? JSON.parse(saved) : [];
    const idx = purchases.findIndex(p => p.purchaseId === purchaseId);
    if (idx >= 0) {
      purchases[idx] = purchase;
    } else {
      purchases.push(purchase);
    }
    localStorage.setItem('mandarinshelf_purchases', JSON.stringify(purchases));

    // Update sales count on product
    if (product) {
      product.salesCount = (product.salesCount || 0) + 1;
      await pdfService.savePdfProduct(product);
    }

    return true;
  },

  getPdfPurchases: async (userId: string): Promise<PdfPurchase[]> => {
    try {
      if (db) {
        const snap = await getDocs(query(
          collection(db, 'pdfPurchases'),
          where('userId', '==', userId),
          where('accessGranted', '==', true)
        ));
        if (!snap.empty) {
          const list: PdfPurchase[] = [];
          snap.forEach(d => list.push(d.data() as PdfPurchase));
          return list;
        }
      }
    } catch (err) {
      console.warn('Firestore getPdfPurchases fallback:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_purchases');
    const purchases: PdfPurchase[] = saved ? JSON.parse(saved) : [];
    return purchases.filter(p => p.userId === userId && p.accessGranted);
  },

  checkUserHasAccess: async (userId: string, productId: string): Promise<boolean> => {
    const purchases = await pdfService.getPdfPurchases(userId);
    return purchases.some(p => p.productId === productId && p.accessGranted);
  },

  // --- Reviews ---
  getPdfReviews: async (productId: string): Promise<PdfReview[]> => {
    try {
      if (db) {
        const snap = await getDocs(query(
          collection(db, 'pdfReviews'),
          where('productId', '==', productId)
        ));
        if (!snap.empty) {
          const list: PdfReview[] = [];
          snap.forEach(d => list.push(d.data() as PdfReview));
          return list.filter(r => r.approved);
        }
      }
    } catch (err) {
      console.warn('Firestore getPdfReviews fallback:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_reviews');
    const reviews: PdfReview[] = saved ? JSON.parse(saved) : [];
    return reviews.filter(r => r.productId === productId && r.approved);
  },

  addPdfReview: async (review: PdfReview): Promise<boolean> => {
    try {
      if (db) {
        await setDoc(doc(db, 'pdfReviews', review.id), review);
      }
    } catch (err) {
      console.warn('Firestore addPdfReview error:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_reviews');
    const reviews: PdfReview[] = saved ? JSON.parse(saved) : [];
    reviews.unshift(review);
    localStorage.setItem('mandarinshelf_reviews', JSON.stringify(reviews));
    return true;
  },

  // --- Payment Settings ---
  getPaymentSettings: async (): Promise<PdfPaymentSettings> => {
    try {
      if (db) {
        const snap = await getDoc(doc(db, 'settings', 'pdfPayments'));
        if (snap.exists()) {
          return snap.data() as PdfPaymentSettings;
        }
      }
    } catch (err) {
      console.warn('Firestore getPaymentSettings fallback:', err);
    }

    const saved = localStorage.getItem('mandarinshelf_payment_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PAYMENT_SETTINGS;
  },

  savePaymentSettings: async (settings: PdfPaymentSettings): Promise<boolean> => {
    try {
      if (db) {
        await setDoc(doc(db, 'settings', 'pdfPayments'), settings, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore savePaymentSettings error:', err);
    }
    localStorage.setItem('mandarinshelf_payment_settings', JSON.stringify(settings));
    return true;
  },

  // --- Analytics ---
  getPdfAnalytics: async () => {
    const products = await pdfService.getPdfProducts();
    const orders = await pdfService.getPdfOrders();

    const totalRevenue = orders
      .filter(o => o.status === 'paid' || o.status === 'completed')
      .reduce((sum, o) => sum + (o.amount || 0), 0);

    const paidOrdersCount = orders.filter(o => o.status === 'paid' || o.status === 'completed').length;
    const pendingOrdersCount = orders.filter(o => o.status === 'payment_submitted' || o.status === 'pending' || o.status === 'under_review').length;

    const mostViewed = [...products].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
    const mostPreviewed = [...products].sort((a, b) => (b.previewCount || 0) - (a.previewCount || 0)).slice(0, 5);
    const bestSellers = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5);

    return {
      totalRevenue,
      totalOrders: orders.length,
      paidOrdersCount,
      pendingOrdersCount,
      totalProducts: products.length,
      mostViewed,
      mostPreviewed,
      bestSellers
    };
  }
};
