// Add type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class VoiceService {
  private synthesis: SpeechSynthesis;
  private recognition: any = null;
  private isListening = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private elevenLabsApiKeys: string[];
  private currentApiKeyIndex: number = 0;
  private activeAudio: HTMLAudioElement | null = null;
  private elevenLabsVoices = [
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Male, Deep)', gender: 'Male' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Female, Soft)', gender: 'Female' },
    { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold (Male, Crisp)', gender: 'Male' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli (Female, Young)', gender: 'Female' },
    { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh (Male, Young)', gender: 'Male' },
    { id: 'CYw3kZ02Hs0563khs1Fj', name: 'Gigi (Female, Childlike)', gender: 'Female' },
    { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum (Male, Hoarse)', gender: 'Male' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Male, Casual)', gender: 'Male' },
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Female, Seductive)', gender: 'Female' },
    { id: 'oWAxZDx7w5VEj9dCyTzz', name: 'Grace (Female, Southern)', gender: 'Female' }
  ];

  constructor() {
    this.elevenLabsApiKeys = (import.meta.env.VITE_ELEVENLABS_API_KEYS || '').split(',').filter(Boolean);
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.availableVoices = this.synthesis.getVoices();
  }

  getAvailableVoices(): Array<{ name: string; lang: string; gender: string }> {
    if (this.availableVoices.length === 0) {
      this.availableVoices = this.synthesis.getVoices();
    }

    const elevenLabsVoiceList = this.elevenLabsVoices.map(voice => ({
      name: `ElevenLabs: ${voice.name}`,
      lang: 'en-US',
      gender: voice.gender,
    }));

    const systemVoiceList = this.availableVoices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: this.detectGender(voice.name),
    })).filter(v => v.lang.startsWith('en'));

    return [...elevenLabsVoiceList, ...systemVoiceList];
  }

  private detectGender(voiceName: string): string {
    const name = voiceName.toLowerCase();
    const femaleIndicators = ['female', 'woman', 'girl', 'samantha', 'alex', 'victoria', 'zira', 'susan', 'karen', 'hazel'];
    const maleIndicators = ['male', 'man', 'boy', 'david', 'mark', 'daniel', 'george', 'james'];
    
    if (femaleIndicators.some(indicator => name.includes(indicator))) return 'Female';
    if (maleIndicators.some(indicator => name.includes(indicator))) return 'Male';
    return 'Neutral';
  }

  speak(text: string, options: { 
    rate?: number; 
    pitch?: number; 
    volume?: number; 
    voiceName?: string;
  } = {}): Promise<void> {
    this.stopSpeaking();

    return new Promise((resolve, reject) => {
      if (options.voiceName && options.voiceName.startsWith('ElevenLabs:')) {
        this.speakWithElevenLabs(text, options.voiceName).then(resolve).catch(reject);
      } else {
        this.speakWithBrowser(text, options).then(resolve).catch(reject);
      }
    });
  }

  private speakWithBrowser(text: string, options: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      if (options.voiceName) {
        const voice = this.availableVoices.find(v => v.name === options.voiceName);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      this.synthesis.speak(utterance);
    });
  }

  private async speakWithElevenLabs(text: string, voiceName: string): Promise<void> {
    if (this.elevenLabsApiKeys.length === 0) {
      throw new Error('ElevenLabs API key(s) are not configured.');
    }
    
    try {
      const voiceDisplayName = voiceName.replace('ElevenLabs: ', '');
      const voice = this.elevenLabsVoices.find(v => voiceDisplayName.includes(v.name.split(' ')[0]));
      
      if (!voice) throw new Error('Voice not found');
      
      const apiKey = this.elevenLabsApiKeys[this.currentApiKeyIndex];

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: { stability: 0.5, similarity_boost: 0.5 }
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.elevenLabsApiKeys.length;
          console.warn(`ElevenLabs key failed, trying next key (index: ${this.currentApiKeyIndex})`);
          return this.speakWithElevenLabs(text, voiceName);
        }
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this.activeAudio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        this.activeAudio!.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.activeAudio = null;
          resolve();
        };
        this.activeAudio!.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          this.activeAudio = null;
          reject(new Error('Audio playback failed'));
        };
        this.activeAudio!.play().catch(reject);
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw new Error('Failed to generate speech with ElevenLabs');
    }
  }

  stopSpeaking(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.src = ''; // Detach the source
      this.activeAudio = null;
    }
  }

  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser. Please try Chrome or Edge.'));
        return;
      }
      if (this.isListening) {
        reject(new Error('Voice input is already active'));
        return;
      }

      // Reset recognition instance to avoid stale state
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }

      this.isListening = true;
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };
      
      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        let errorMessage = 'Voice input failed';
        
        switch (event.error) {
          case 'network': 
            errorMessage = 'Network error: Speech recognition service unavailable. This could be due to:\n\n' +
              '• Internet connection issues\n' +
              '• Firewall blocking speech services\n' +
              '• Corporate network restrictions\n' +
              '• VPN interference\n\n' +
              'Please try:\n' +
              '• Checking your internet connection\n' +
              '• Using a different network (mobile hotspot)\n' +
              '• Disabling VPN if active\n' +
              '• Using Chrome or Edge browser\n' +
              '• Refreshing the page and trying again'; 
            break;
          case 'not-allowed': 
            errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.'; 
            break;
          case 'no-speech': 
            errorMessage = 'No speech detected. Please try speaking again.'; 
            break;
          case 'audio-capture': 
            errorMessage = 'Microphone not found. Please check your microphone connection.'; 
            break;
          case 'service-not-allowed': 
            errorMessage = 'Speech recognition service not available. Please try a different browser (Chrome recommended).'; 
            break;
          case 'aborted':
            errorMessage = 'Voice recognition was aborted.';
            break;
          case 'audio-capture-device':
            errorMessage = 'Audio capture device error. Please check your microphone.';
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            errorMessage = 'Language not supported. Please try English.';
            break;
          default: 
            errorMessage = `Voice input error: ${event.error}. Please try again or use a different browser.`;
        }
        
        console.error('Speech recognition error:', event.error, errorMessage);
        
        // For network errors, provide additional debugging info
        if (event.error === 'network') {
          console.error('Network error details:', {
            userAgent: navigator.userAgent,
            online: navigator.onLine,
            connection: (navigator as any).connection?.effectiveType || 'unknown',
            timestamp: new Date().toISOString()
          });
        }
        
        reject(new Error(errorMessage));
      };
      
      this.recognition.onend = () => {
        this.isListening = false;
      };
      
      this.recognition.onstart = () => {
        console.log('Speech recognition started');
      };
      
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        console.error('Failed to start speech recognition:', error);
        reject(new Error('Failed to start voice recognition. Please try refreshing the page.'));
      }
    });
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  isSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  isRecognitionSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  // Test function to diagnose speech recognition issues
  testSpeechRecognition(): Promise<{ success: boolean; details: any }> {
    return new Promise((resolve) => {
      if (!this.isRecognitionSupported()) {
        resolve({
          success: false,
          details: {
            error: 'Speech recognition not supported',
            browser: navigator.userAgent,
            supported: false
          }
        });
        return;
      }

      const testRecognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
      testRecognition.continuous = false;
      testRecognition.interimResults = false;
      testRecognition.lang = 'en-US';
      testRecognition.maxAlternatives = 1;

      const timeout = setTimeout(() => {
        testRecognition.stop();
        resolve({
          success: false,
          details: {
            error: 'Test timeout - no response from speech service',
            browser: navigator.userAgent,
            online: navigator.onLine,
            connection: (navigator as any).connection?.effectiveType || 'unknown'
          }
        });
      }, 5000);

      testRecognition.onstart = () => {
        console.log('Speech recognition test started');
      };

      testRecognition.onresult = () => {
        clearTimeout(timeout);
        resolve({
          success: true,
          details: {
            browser: navigator.userAgent,
            online: navigator.onLine,
            connection: (navigator as any).connection?.effectiveType || 'unknown'
          }
        });
      };

      testRecognition.onerror = (event: any) => {
        clearTimeout(timeout);
        resolve({
          success: false,
          details: {
            error: event.error,
            errorMessage: event.errorMessage || 'Unknown error',
            browser: navigator.userAgent,
            online: navigator.onLine,
            connection: (navigator as any).connection?.effectiveType || 'unknown'
          }
        });
      };

      testRecognition.onend = () => {
        clearTimeout(timeout);
      };

      try {
        testRecognition.start();
      } catch (error) {
        clearTimeout(timeout);
        resolve({
          success: false,
          details: {
            error: 'Failed to start test',
            errorMessage: (error as Error).message,
            browser: navigator.userAgent
          }
        });
      }
    });
  }
}