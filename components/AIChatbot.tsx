
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Sparkles, Trash2, Bot, User, 
  CornerDownRight, Phone, PhoneOff, Mic, MicOff, Volume2, Video, VideoOff, Loader2
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { getChatbotResponse } from '../services/geminiService';
import { Language } from '../types';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

interface Props {
  lang: Language;
}

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const blobToBase64 = (blob: globalThis.Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const AIChatbot: React.FC<Props> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live API States
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isCallActive]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: lang === 'BN' 
          ? "আসসালামু আলাইকুম! আমি মাসুদ ল্যাঙ্গুয়েজ ল্যাব-এর এআই সহকারী। চাইনিজ শেখা বা কোর্স নিয়ে কোনো প্রশ্ন আছে? আপনি চাইলে আমাকে অডিও বা ভিডিও কল করতে পারেন। 😊"
          : "Hello! I am your AI Assistant at Masud Language Lab. Need help with Chinese? You can message me or even start an audio/video call! 😊",
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, lang]);

  const startCall = async (useVideo: boolean = false) => {
    if (isCallActive || isConnecting) return;
    setIsConnecting(true);
    setIsVideoEnabled(useVideo);

    try {
      // 1. Initialize API Client right before use
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // 2. Request Hardware Access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: useVideo ? { width: 640, height: 480, frameRate: 15 } : false 
      });
      streamRef.current = stream;

      // 3. Audio Context Setup
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      // 4. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsCallActive(true);
            setIsConnecting(false);

            // Audio Input Logic
            const micSource = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            micSource.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);

            // Video Input Logic (Image Frames)
            if (useVideo) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              frameIntervalRef.current = window.setInterval(() => {
                if (videoRef.current && ctx) {
                  canvas.width = videoRef.current.videoWidth;
                  canvas.height = videoRef.current.videoHeight;
                  ctx.drawImage(videoRef.current, 0, 0);
                  canvas.toBlob(async (blob) => {
                    if (blob) {
                      const base64Data = await blobToBase64(blob);
                      sessionPromise.then(s => s.sendRealtimeInput({
                        media: { data: base64Data, mimeType: 'image/jpeg' }
                      }));
                    }
                  }, 'image/jpeg', 0.5);
                }
              }, 1000); // 1 FPS to optimize bandwidth
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outputCtx) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            stopCall();
          },
          onclose: () => stopCall(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: 'You are the helpful AI assistant of Masud Language Lab. You can see the user via camera if enabled. Help them learn Chinese. Speak in Bengali.',
        }
      });

      sessionRef.current = await sessionPromise;
      if (useVideo && videoRef.current) videoRef.current.srcObject = stream;

    } catch (err) {
      console.error("Call failed:", err);
      setIsConnecting(false);
      alert(lang === 'BN' ? 'ক্যামেরা বা মাইক্রোফোন ব্যবহারের অনুমতি দিন।' : 'Please allow camera and microphone access.');
    }
  };

  const stopCall = () => {
    setIsCallActive(false);
    setIsConnecting(false);
    setIsVideoEnabled(false);

    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botReply = await getChatbotResponse(input, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: botReply || '...', timestamp: Date.now() }]);
    setIsLoading(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-[#C1121F] text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-zinc-900"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[60] w-[calc(100vw-3rem)] sm:w-[420px] h-[600px] max-h-[80vh] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[#C1121F] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest">Masud AI Assistant</h3>
                  <p className="text-[10px] opacity-70 uppercase font-bold">{isCallActive ? 'Live Call Active' : 'Online'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => isCallActive ? stopCall() : startCall(true)} className="p-2 hover:bg-white/10 rounded-lg">
                  <Video className={`w-5 h-5 ${isCallActive && isVideoEnabled ? 'text-green-300' : ''}`} />
                </button>
                <button onClick={() => isCallActive ? stopCall() : startCall(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className={`w-5 h-5 ${isCallActive && !isVideoEnabled ? 'text-green-300' : ''}`} />}
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-zinc-50 dark:bg-zinc-950/30">
              {isCallActive ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  {isVideoEnabled ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full aspect-video bg-black rounded-3xl shadow-xl object-cover scale-x-[-1]" />
                  ) : (
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-[#C1121F]">
                      <Mic className="w-10 h-10" />
                    </motion.div>
                  )}
                  <div className="space-y-1">
                    <p className="font-black text-[#C1121F] uppercase text-xs tracking-widest">{isVideoEnabled ? 'Gemini is watching' : 'Assistant is listening'}</p>
                    <p className="text-zinc-500 text-xs">{lang === 'BN' ? 'আপনি সরাসরি কথা বলতে পারেন...' : 'You can speak naturally now...'}</p>
                  </div>
                  <button onClick={stopCall} className="px-8 py-3 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <PhoneOff className="w-4 h-4" /> End Call
                  </button>
                </div>
              ) : (
                <>
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-zinc-900 text-white rounded-br-none' : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-bl-none shadow-sm'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-1 p-2">
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150" />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Footer */}
            {!isCallActive && (
              <form onSubmit={handleSend} className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={lang === 'BN' ? "কিছু লিখুন..." : "Type here..."}
                  className="flex-grow bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 outline-none font-medium text-sm"
                />
                <button type="submit" className="w-12 h-12 bg-[#C1121F] text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;
