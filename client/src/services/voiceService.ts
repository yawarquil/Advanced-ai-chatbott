export class VoiceService {
  private synthesis: SpeechSynthesis;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private elevenLabsApiKey: string;
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
    this.elevenLabsApiKey = 'sk_cb41062ce3bb479e81952df9973a7b08a5ec2df76513006d';
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }

    // Load voices when they become available
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.availableVoices = this.synthesis.getVoices();
  }

  getAvailableVoices(): Array<{ name: string; lang: string; gender: string }> {
    // Ensure voices are loaded
    if (this.availableVoices.length === 0) {
      this.availableVoices = this.synthesis.getVoices();
    }

    // Combine ElevenLabs voices with system voices
    const elevenLabsVoiceList = this.elevenLabsVoices.map(voice => ({
      name: `ElevenLabs: ${voice.name}`,
      lang: 'en-US',
      gender: voice.gender,
      isElevenLabs: true,
      voiceId: voice.id
    }));

    // System voices
    const systemVoiceList = this.availableVoices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: this.detectGender(voice.name),
      voice: voice,
      isElevenLabs: false
    })).filter(v => v.lang.startsWith('en')); // English voices only

    // Combine and return (ElevenLabs first, then system voices)
    return [
      ...elevenLabsVoiceList,
      ...systemVoiceList.slice(0, 10) // Limit system voices
    ].map(v => ({ name: v.name, lang: v.lang, gender: v.gender }));
  }

  private detectGender(voiceName: string): string {
    const name = voiceName.toLowerCase();
    const femaleIndicators = ['female', 'woman', 'girl', 'samantha', 'alex', 'victoria', 'zira', 'susan', 'karen', 'hazel'];
    const maleIndicators = ['male', 'man', 'boy', 'david', 'mark', 'daniel', 'george', 'james'];
    
    if (femaleIndicators.some(indicator => name.includes(indicator))) return 'Female';
    if (maleIndicators.some(indicator => name.includes(indicator))) return 'Male';
    return 'Neutral';
  }

  // Text-to-Speech
  speak(text: string, options: { 
    rate?: number; 
    pitch?: number; 
    volume?: number; 
    voiceName?: string;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if it's an ElevenLabs voice
      if (options.voiceName && options.voiceName.startsWith('ElevenLabs:')) {
        this.speakWithElevenLabs(text, options.voiceName)
          .then(() => resolve())
          .catch(reject);
        return;
      }

      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set specific voice if requested
      if (options.voiceName) {
        const voice = this.availableVoices.find(v => v.name === options.voiceName);
        if (voice) {
          utterance.voice = voice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  // ElevenLabs Text-to-Speech
  private async speakWithElevenLabs(text: string, voiceName: string): Promise<void> {
    try {
      // Extract voice ID from the voice name
      const voiceDisplayName = voiceName.replace('ElevenLabs: ', '');
      const voice = this.elevenLabsVoices.find(v => voiceDisplayName.includes(v.name.split(' ')[0]));
      
      if (!voice) {
        throw new Error('Voice not found');
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          reject(new Error('Audio playback failed'));
        };
        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      throw new Error('Failed to generate speech with ElevenLabs');
    }
  }

  // Stop current speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    // Also stop any playing audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Speech-to-Text
  startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Voice input is already active'));
        return;
      }

      // Check for microphone permissions
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
          if (result.state === 'denied') {
            reject(new Error('Microphone access denied. Please enable microphone permissions.'));
            return;
          }
        }).catch(() => {
          // Permissions API not supported, continue anyway
        });
      }

      this.isListening = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        resolve(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        
        let errorMessage = 'Voice input failed';
        switch (event.error) {
          case 'network':
            errorMessage = 'Network error. Please check your internet connection and try again.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions in your browser.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking again.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone connection.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available.';
            break;
          default:
            errorMessage = `Voice input error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(new Error('Failed to start voice recognition. Please try again.'));
      }
    });
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Check if speech synthesis is supported
  isSpeechSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Check if speech recognition is supported
  isRecognitionSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}