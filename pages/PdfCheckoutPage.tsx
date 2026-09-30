import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ArrowLeft, Copy, Check, QrCode, Upload, 
  AlertCircle, CheckCircle2, Clock, Sparkles, BookOpen, Smartphone 
} from 'lucide-react';
import { User, Language, PdfProduct, PdfOrder, PdfPaymentSettings } from '../types';
import { pdfService } from '../services/pdfService';
import PriceDisplay from '../components/PriceDisplay';
import { 
  formatBdtPrice, 
  formatUsdPrice, 
  toBanglaDigits, 
  getStoredCurrency, 
  setStoredCurrency, 
  CurrencyType 
} from '../services/currencyService';

interface Props {
  lang: Language;
  user: User | null;
}

const PdfCheckoutPage: React.FC<Props> = ({ lang, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State from cart or direct "Buy Now"
  const passedProduct: PdfProduct | undefined = location.state?.product;
  const passedCart: PdfProduct[] | undefined = location.state?.cartItems;
  const passedDiscount: number = location.state?.discount || 0;

  const [items, setItems] = useState<PdfProduct[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PdfPaymentSettings | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Binance'>('bKash');

  // Customer Form
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerCountry, setCustomerCountry] = useState('Bangladesh');

  // Payment Submission Form
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState(user?.phone || '');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Flow State
  const [orderId, setOrderId] = useState(() => `MS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<PdfOrder | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (passedProduct) {
      setItems([passedProduct]);
    } else if (passedCart && passedCart.length > 0) {
      setItems(passedCart);
    } else {
      // Check localStorage cart
      const savedCart = localStorage.getItem('mandarinshelf_cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          if (parsed.length > 0) setItems(parsed);
          else navigate('/store');
        } catch {
          navigate('/store');
        }
      } else {
        navigate('/store');
      }
    }

    const loadSettings = async () => {
      const s = await pdfService.getPaymentSettings();
      setPaymentSettings(s);
    };
    loadSettings();
  }, [passedProduct, passedCart, navigate]);

  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const total = Math.max(0, subtotal - passedDiscount);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate high speed image upload preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerEmail.trim()) {
      setErrorMsg(lang === 'EN' ? 'Please provide your name and email.' : 'দয়া করে আপনার নাম এবং ইমেইল প্রদান করুন।');
      return;
    }

    if (!transactionId.trim()) {
      setErrorMsg(lang === 'EN' ? 'Transaction ID is required.' : 'ট্রানজেকশন আইডি (TrxID / TxID) প্রদান করা আবশ্যক।');
      return;
    }

    if (paymentMethod !== 'Binance' && !senderNumber.trim()) {
      setErrorMsg(lang === 'EN' ? 'Sender phone number is required.' : 'যে নম্বর থেকে টাকা পাঠিয়েছেন তা দেওয়া আবশ্যক।');
      return;
    }

    setIsSubmitting(true);

    const orderData: PdfOrder = {
      orderId,
      userId: user?.id || `guest_${Date.now()}`,
      customerName: customerName.trim(),
      email: customerEmail.trim().toLowerCase(),
      country: customerCountry,
      productId: items[0]?.id || 'multi_item',
      productTitle: items.length === 1 ? items[0].title : `${items[0]?.title} + ${items.length - 1} more eBooks`,
      items: items.map(i => ({
        id: i.id,
        title: i.title,
        price: i.price,
        coverImage: i.coverImage,
        slug: i.slug
      })),
      amount: total,
      currency: 'BDT',
      paymentMethod,
      transactionId: transactionId.trim(),
      senderNumber: senderNumber.trim(),
      screenshotUrl: screenshotUrl || undefined,
      status: 'payment_submitted',
      createdAt: new Date().toISOString()
    };

    try {
      await pdfService.createPdfOrder(orderData);
      setSubmittedOrder(orderData);
      // Clear cart
      localStorage.removeItem('mandarinshelf_cart');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-slate-100 space-y-6"
        >
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
              Payment Under Review
            </span>
            <h2 className="text-3xl font-black text-white mt-3 mb-2">
              {lang === 'EN' ? 'Payment Submitted for Verification' : 'পেমেন্ট ভেরিফিকেশনের জন্য জমা হয়েছে'}
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              {lang === 'EN' 
                ? 'Our administrative team manually checks the transaction ID and amount. Once verified, your eBook will immediately be unlocked.' 
                : 'আমাদের অ্যাডমিন টিম আপনার ট্রানজেকশন আইডি যাচাই করে বইটি অনুমোদন করবেন। অনুমোদনের সাথে সাথে এটি আপনার "My Books" এ উন্মুক্ত হবে।'}
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Order ID:</span>
              <span className="text-white font-bold">{submittedOrder.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="text-slate-300">{submittedOrder.customerName} ({submittedOrder.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="text-slate-300">{submittedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <span className="text-red-400 font-bold">{submittedOrder.transactionId}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-500">Total Amount:</span>
              <div className="text-right">
                <span className="text-emerald-400 font-bold">{formatUsdPrice(submittedOrder.amount)}</span>
                <span className="text-amber-400 font-bold ml-2 font-sans">({formatBdtPrice(submittedOrder.amount, true)})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link 
              to="/dashboard"
              className="px-6 py-3.5 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-600/30"
            >
              {lang === 'EN' ? 'Go to My Books' : 'আমার বইসমূহ দেখুন'}
            </Link>
            <Link 
              to="/store"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition border border-slate-700"
            >
              {lang === 'EN' ? 'Back to Store' : 'স্টোরে ফিরে যান'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentSettings = paymentSettings ? (paymentSettings as any)[paymentMethod] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          to="/store" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MandarinShelf
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Secure eBook Checkout
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          MandarinShelf by Masud Language Lab • Instant Digital Delivery
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C1121F] text-white flex items-center justify-center text-xs">1</span>
              Customer Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Tanvir Ahmed"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Country
                </label>
                <select 
                  value={customerCountry}
                  onChange={e => setCustomerCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="China">China</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other International</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method Selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#C1121F] text-white flex items-center justify-center text-xs">2</span>
              Select Payment Method
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'bKash', label: 'bKash', sub: 'BDT Mobile', color: 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400' },
                { id: 'Nagad', label: 'Nagad', sub: 'BDT Mobile', color: 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400' },
                { id: 'Rocket', label: 'Rocket', sub: 'BDT Mobile', color: 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400' },
                { id: 'Binance', label: 'Binance', sub: 'USDT Crypto', color: 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`p-3.5 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center ${
                    paymentMethod === method 
                      ? `${method.color} shadow-md` 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <span className="font-black text-sm">{method.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{method.sub}</span>
                </button>
              ))}
            </div>

            {/* Payment Details Panel */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 space-y-4">
              {paymentMethod !== 'Binance' ? (
                <>
                  {/* BDT Payment Reference */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                        Payment Amount:
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-sans">
                          {formatBdtPrice(total)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          ({formatUsdPrice(total)} USD equivalent)
                        </span>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
                      {paymentMethod} Send Money
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-black">
                        {paymentMethod} Personal / Send Money Number
                      </p>
                      <p className="text-xl font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                        {currentSettings?.number || '01788060657'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentSettings?.number || '01788060657')}
                      className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm hover:border-red-500 transition"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAddress ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/60 space-y-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Send {formatBdtPrice(total)} via {paymentMethod} Send Money to the number above, then submit your Transaction ID (TrxID) below.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <img 
                      src={currentSettings?.qrImage || "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUS5"} 
                      alt="Binance QR" 
                      className="w-32 h-32 rounded-xl bg-white p-2 border border-slate-300 shadow-md shrink-0"
                    />
                    <div className="min-w-0 space-y-1.5 text-center sm:text-left">
                      <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-950/40 border border-amber-800 px-2 py-0.5 rounded-md">
                        USDT (TRC20 Network)
                      </span>
                      <p className="text-xs text-slate-500">Pay equivalent ~ ${(total / 125).toFixed(2)} USDT</p>
                      <p className="text-xs font-mono text-slate-900 dark:text-slate-200 break-all bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        {currentSettings?.address || 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUS5'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentSettings?.address || 'TQn9Y2khEsLJW1ChVWFMSMeSTow5KaxUS5')}
                        className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5"
                      >
                        {copiedAddress ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Wallet Address</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800/60">
                    {currentSettings?.instructions || 'Send USDT via TRC20 and paste your transaction hash (TxID) below.'}
                  </p>
                </div>
              )}
            </div>

            {/* Step 3: Transaction ID & Submission */}
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {paymentMethod === 'Binance' ? 'Binance TxID / Hash' : `${paymentMethod} Transaction ID (TrxID)`} *
                  </label>
                  <input 
                    type="text" 
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. 9J817XAZL0"
                    required
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm font-mono focus:outline-none focus:border-red-500 text-slate-900 dark:text-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {lang === 'EN' ? 'Sender Phone / Account' : 'প্রেরকের মোবাইল নম্বর'} {paymentMethod !== 'Binance' && '*'}
                  </label>
                  <input 
                    type="text" 
                    value={senderNumber}
                    onChange={e => setSenderNumber(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    required={paymentMethod !== 'Binance'}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-red-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {lang === 'EN' ? 'Payment Screenshot (Optional for faster verification)' : 'পেমেন্ট স্ক্রিনশট (ঐচ্ছিক)'}
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200"
                  />
                  {screenshotUrl && (
                    <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Attached
                    </span>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C1121F] hover:bg-[#a50f1a] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition transform active:scale-95 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Submit Payment for Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-black text-base uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C1121F]" />
              {lang === 'EN' ? 'Order Summary' : 'অর্ডারের বিবরণ'}
            </h3>
            <span className="text-xs font-mono font-bold text-slate-400">#{orderId}</span>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img 
                  src={item.coverImage} 
                  alt={item.title} 
                  className="w-12 h-16 object-cover rounded-xl shrink-0 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-red-500">
                    {item.hskLevel}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500">{item.pages} Pages • Digital PDF</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-xs text-slate-900 dark:text-white block">
                    {formatUsdPrice(item.price)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-sans">
                    ৳ {toBanglaDigits(item.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-baseline">
              <span>Subtotal ({items.length} items)</span>
              <div className="text-right">
                <span className="font-bold text-slate-900 dark:text-white">{formatUsdPrice(subtotal)}</span>
                <span className="text-[11px] text-slate-400 ml-2">({formatBdtPrice(subtotal, true)})</span>
              </div>
            </div>
            {passedDiscount > 0 && (
              <div className="flex justify-between text-green-500 items-baseline">
                <span>Applied Coupon Discount</span>
                <span>-{formatUsdPrice(passedDiscount)} ({formatBdtPrice(passedDiscount, true)})</span>
              </div>
            )}
            <div className="flex justify-between items-baseline text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>
                <span>Total Payable</span>
                <span className="block text-[10px] font-normal text-slate-400">
                  Dual currency: USD & BDT (টাকা)
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl text-[#C1121F] font-black block leading-none">
                  {formatUsdPrice(total)}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-sans mt-1 block">
                  🇧🇩 {formatBdtPrice(total, true)}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2 text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Satisfaction & Security Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-700 dark:text-emerald-400">
              All eBooks include Hanzi, Pinyin, Bengali transliterations, grammar references, and lifetime cloud bookshelf access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCheckoutPage;
