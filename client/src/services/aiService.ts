// AI Service Factory for multiple providers
export interface AIProvider {
  generateResponse(message: string): Promise<string>;
  getName(): string;
}

// Gemini Provider
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private isAvailable: boolean;

  constructor() {
    // Try multiple sources for the API key
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                  process.env.VITE_GEMINI_API_KEY || 
                  'AIzaSyA164WKkRViwEibC4G3uuWu44RLuFwlAMM';
    
    this.isAvailable = !!this.apiKey && this.apiKey !== '';
    console.log('Gemini API Key available:', this.isAvailable);
    console.log('Gemini API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
  }

  getName(): string {
    return 'Gemini 1.5 Flash';
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your Replit Secrets or environment variables.');
    }

    try {
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
          throw new Error('Invalid Gemini API key. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('Gemini API quota exceeded. Please try again later.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while contacting Gemini.');
    }
  }
}

// AI Service Factory
export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    console.log('Initializing AI Service...');
    
    // Initialize only Gemini
    try {
      const geminiProvider = new GeminiProvider();
      this.providers.set('gemini', geminiProvider);
      console.log('✅ Gemini provider initialized successfully');
    } catch (error) {
      console.error('❌ Gemini provider failed to initialize:', error);
      throw new Error('Gemini is required but failed to initialize');
    }

    console.log('Available providers:', Array.from(this.providers.keys()));
    console.log('Total providers initialized:', this.providers.size);
  }

  getProvider(model: string): AIProvider {
    console.log(`Requesting provider for model: ${model || 'gemini'}`);
    
    // Always use Gemini or default to Gemini
    const provider = this.providers.get(model || 'gemini') || this.providers.get('gemini');
    if (provider) {
      console.log(`✅ Found Gemini provider`);
      return provider;
    }
    
    console.error('❌ Gemini provider not available');
    throw new Error('Gemini is not available. Please check your API key configuration.');
  }

  getAvailableModels(): Array<{ key: string; name: string }> {
    // Only return Gemini
    const models = [{ key: 'gemini', name: 'Gemini 1.5 Flash' }];
    
    console.log('Available models:', models);
    return models;
  }
}