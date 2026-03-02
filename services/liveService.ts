
import { GoogleGenAI, Modality } from "@google/genai";

export class LiveLabService {
  private ai: GoogleGenAI;
  private session: any = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private nextStartTime: number = 0;

  constructor() {
    // Use the provided API key or the one from environment
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(callbacks: {
    onAudioData: (data: string) => void;
    onInterrupted: () => void;
    onTranscription: (text: string, isUser: boolean) => void;
    onError: (error: any) => void;
    onClose: () => void;
  }) {
    try {
      this.session = await this.ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are Md. Masud Rana, a Chinese language expert. You are helping a student practice Chinese. Speak naturally, encourage them, and provide corrections in a friendly way. Use a mix of Bengali and Chinese as appropriate for their level.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            console.log("Live session opened");
            this.startAudioCapture();
          },
          onmessage: async (message) => {
            if (message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data) {
              callbacks.onAudioData(message.serverContent.modelTurn.parts[0].inlineData.data);
              this.playAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
            }
            if (message.serverContent?.interrupted) {
              callbacks.onInterrupted();
              this.stopPlayback();
            }
            if (message.serverContent?.modelTurn?.parts?.[0]?.text) {
              // Handle transcription if available
            }
          },
          onerror: (error) => callbacks.onError(error),
          onclose: () => callbacks.onClose(),
        },
      });
    } catch (error) {
      callbacks.onError(error);
    }
  }

  private async startAudioCapture() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.session) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7fff;
        }
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        this.session.sendRealtimeInput({
          media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
        });
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error("Error capturing audio:", error);
    }
  }

  private playAudio(base64Data: string) {
    if (!this.audioContext) return;
    
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      floatData[i] = pcmData[i] / 0x7fff;
    }

    const buffer = this.audioContext.createBuffer(1, floatData.length, 24000);
    buffer.getChannelData(0).set(floatData);

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    const startTime = Math.max(this.audioContext.currentTime, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + buffer.duration;
  }

  private stopPlayback() {
    this.nextStartTime = 0;
    // In a real implementation, we'd keep track of active sources and stop them
  }

  async sendVideoFrame(base64Data: string) {
    if (this.session) {
      this.session.sendRealtimeInput({
        media: { data: base64Data, mimeType: 'image/jpeg' }
      });
    }
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
