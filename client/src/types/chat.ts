export interface MessageReaction {
  type: 'like' | 'dislike' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  model?: string;
  attachments?: Attachment[];
  imageUrl?: string; // For AI-generated images
  imagePrompt?: string; // Original prompt for image generation
  reactions?: MessageReaction[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isGeneratingImage?: boolean;
}

export interface Settings {
  theme: 'light' | 'dark' | 'halloween' | 'blood-red' | 'cyber-neon' | 'gamer' | 'professional' | 'monochrome';
  aiModel: string;
  voiceEnabled: boolean;
  selectedVoice: string;
  voiceSpeed: number;
  voicePitch: number;
  autoScroll: boolean;
  persistHistory: boolean;
  imageGeneration: boolean;
  fontSize: number;
  fontFamily: string;
  imageModel: 'pollinations' | 'huggingface' | 'unsplash' | 'pixabay' | 'pexels' | 'lorem-picsum' | 'dalle-mini';
  imageModelHf: 'stable-diffusion-xl-base-1.0';
  particlePreset?: 'geometric' | 'sparkles' | 'bubbles' | 'stars' | 'thunderstorm' | 'matrix' | 'fireflies' | 'snow' | 'neon' | 'galaxy' | 'rain' | 'electric';
  selectedLogo?: 'logo' | 'logo2' | 'logo3' | 'logo4';
  clickSoundsEnabled?: boolean;
  taskCompleteSoundsEnabled?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
  userId?: string; // For database storage
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  content?: string; // For text files or base64 for images
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  settings?: Settings;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}