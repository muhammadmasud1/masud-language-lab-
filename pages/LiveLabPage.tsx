
import React, { useState, useEffect, useRef } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
const motion = m as any;
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  Settings, MessageSquare, Globe, Zap, 
  Shield, Volume2, Activity, User
} from 'lucide-react';
import { Language } from '../types';
import { LiveLabService } from '../services/liveService';

interface Props {
  lang: Language;
}

const LiveLabPage: React.FC<Props> = ({ lang }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const serviceRef = useRef<LiveLabService | null>(null);
  const frameRequestRef = useRef<number | null>(null);

  const startSession = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const service = new LiveLabService();
      serviceRef.current = service;

      await service.connect({
        onAudioData: (data) => {
          // Handled internally by service for playback
        },
        onInterrupted: () => {
          console.log("Interrupted by user");
        },
        onTranscription: (text, isUser) => {
          console.log(`${isUser ? 'User' : 'Model'}: ${text}`);
        },
        onError: (err) => {
          console.error("Live Lab Error:", err);
          setError(lang === 'EN' ? "Connection failed. Please check your microphone and try again." : "সংযোগ ব্যর্থ হয়েছে। আপনার মাইক্রোফোন চেক করুন।");
          stopSession();
        },
        onClose: () => {
          setIsConnected(false);
          setIsConnecting(false);
        }
      });

      setIsConnected(true);
      setIsConnecting(false);
      
      if (isVideoOn) {
        startVideoStreaming();
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      setError(lang === 'EN' ? "Could not start session." : "সেশন শুরু করা যায়নি।");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (serviceRef.current) {
      serviceRef.current.disconnect();
      serviceRef.current = null;
    }
    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
      frameRequestRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  const startVideoStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const sendFrame = () => {
        if (!serviceRef.current || !videoRef.current || !canvasRef.current || !isVideoOn) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = 320;
          canvas.height = 240;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
          serviceRef.current.sendVideoFrame(base64Data);
        }
        
        frameRequestRef.current = requestAnimationFrame(sendFrame);
      };

      sendFrame();
    } catch (err) {
      console.error("Error starting video:", err);
      setIsVideoOn(false);
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#0A0A0A] text-white p-4 md:p-8 flex flex-col items-center justify-center font-mono">
      
      {/* Header Info */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#C1121F] rounded-xl flex items-center justify-center text-2xl font-black">华</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">Live Language Lab</h1>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest">
              <Activity className="w-3 h-3 text-emerald-500" />
              {isConnected ? 'System Online' : 'System Standby'}
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Session Quality</div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />)}
            </div>
          </div>
          <div className="w-px h-8 bg-zinc-800" />
          <div className="flex items-center gap-2 text-zinc-400">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Panel: Stats & Info */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#C1121F] mb-4">Instructor Profile</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/masud/100/100" alt="Masud Rana" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-sm">Md. Masud Rana</div>
                <div className="text-[10px] text-zinc-500 uppercase">AI Digital Twin</div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {lang === 'EN' 
                ? "Practice your Chinese tones, vocabulary, and grammar in real-time. I'm here to guide you just like a physical lab session."
                : "রিয়েল-টাইমে আপনার চাইনিজ টোন, শব্দভাণ্ডার এবং ব্যাকরণ অনুশীলন করুন। আমি আপনাকে একটি ফিজিক্যাল ল্যাব সেশনের মতো গাইড করতে এখানে আছি।"}
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex-grow">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Real-time Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Latency', value: '42ms', color: 'text-emerald-500' },
                { label: 'Accuracy', value: '98.2%', color: 'text-emerald-500' },
                { label: 'Tone Detection', value: 'Active', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-600">{stat.label}</span>
                  <span className={`text-[10px] font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-zinc-800">
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">Voice Activity</div>
                <div className="h-12 flex items-end gap-1">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: isConnected ? [10, 30, 15, 40, 10][i % 5] : 4 }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                      className="flex-grow bg-[#C1121F]/30 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Video/Audio Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="aspect-video bg-zinc-900 rounded-[2.5rem] border border-zinc-800 relative overflow-hidden group shadow-2xl shadow-black">
            
            {/* Video Feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-opacity duration-1000 ${isVideoOn && isConnected ? 'opacity-100' : 'opacity-0'}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Placeholder / Audio Only Mode */}
            {(!isVideoOn || !isConnected) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
                <motion.div 
                  animate={{ 
                    scale: isConnected ? [1, 1.1, 1] : 1,
                    opacity: isConnected ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 rounded-full bg-[#C1121F]/10 border border-[#C1121F]/30 flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-[#C1121F]/20 border border-[#C1121F]/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#C1121F] flex items-center justify-center shadow-lg shadow-red-500/50">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>
                <div className="mt-8 text-center">
                  <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">
                    {isConnected ? 'Voice Link Active' : 'Ready for Connection'}
                  </div>
                  <div className="text-[10px] text-zinc-700 uppercase tracking-widest">
                    {isConnected ? 'Secure Audio Channel 01' : 'Awaiting User Authorization'}
                  </div>
                </div>
              </div>
            )}

            {/* Overlay UI */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              {isConnected && (
                <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">00:42:15</span>
                </div>
              )}
            </div>

            <div className="absolute top-6 right-6">
              <button className="p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                <Settings className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute bottom-24 left-6 right-6 bg-red-500/90 backdrop-blur-md text-white p-4 rounded-2xl text-xs font-bold flex items-center gap-3"
                >
                  <Zap className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem]">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-2xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-2xl transition-all ${!isVideoOn ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
              >
                {!isVideoOn ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <div className="w-px h-8 bg-white/10 mx-2" />

              {!isConnected ? (
                <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="px-8 py-4 bg-[#C1121F] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Start Session'}
                </button>
              ) : (
                <button 
                  onClick={stopSession}
                  className="px-8 py-4 bg-zinc-100 text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </button>
              )}
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Language Mode</div>
                <div className="text-xs font-bold">Mandarin Chinese (Standard)</div>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Audio Output</div>
                <div className="text-xs font-bold">Spatial Engine 2.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#C1121F22_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]" />
      </div>
    </div>
  );
};

export default LiveLabPage;
