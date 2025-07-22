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
    // Get API key from Vite environment variables
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    this.isAvailable = !!this.apiKey && this.apiKey !== '';
    console.log('Gemini API Key available:', this.isAvailable);
    if (this.apiKey) {
      console.log('Gemini API Key (first 10 chars):', this.apiKey.substring(0, 10) + '...');
    }
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
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error instanceof Error ? error : new Error('Failed to get response from Gemini');
    }
  }
}

// Groq Provider
export class GroqProvider implements AIProvider {
  private apiKey: string;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private isAvailable: boolean;
  private model: string;

  constructor(model: 'llama-3.3-70b' | 'llama-3.1-8b' | 'mixtral-8x7b' | 'gemma2-9b' = 'llama-3.3-70b') {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.model = this.getModelId(model);
    this.isAvailable = !!this.apiKey && this.apiKey !== '';
  }

  private getModelId(model: string): string {
    const modelMap: Record<string, string> = {
      'llama-3.3-70b': 'llama-3.3-70b-versatile',
      'llama-3.1-8b': 'llama-3.1-8b-instant',
      'mixtral-8x7b': 'mixtral-8x7b-32768',
      'gemma2-9b': 'gemma2-9b-it'
    };
    return modelMap[model] || 'llama-3.3-70b-versatile';
  }

  getName(): string {
    const nameMap: Record<string, string> = {
      'llama-3.3-70b-versatile': 'LLaMA 3.3 70B (Groq)',
      'llama-3.1-8b-instant': 'LLaMA 3.1 8B (Groq)',
      'mixtral-8x7b-32768': 'Mixtral 8x7B (Groq)',
      'gemma2-9b-it': 'Gemma 2 9B (Groq)'
    };
    return nameMap[this.model] || 'Groq AI';
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('Groq API key not configured. Please add VITE_GROQ_API_KEY to your environment variables.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Groq API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API error:', error);
      throw error instanceof Error ? error : new Error('Failed to get response from Groq');
    }
  }
}

// Hugging Face Provider
export class HuggingFaceProvider implements AIProvider {
  private apiKey: string;
  private readonly apiUrl = 'https://router.huggingface.co/hf-inference/v1/chat/completions';
  private isAvailable: boolean;
  private model: string;

  constructor(model: 'gemma-2-2b' | 'llama-3.1-8b' | 'qwen-2.5-1.5b' = 'gemma-2-2b') {
    this.apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    this.model = this.getModelId(model);
    this.isAvailable = !!this.apiKey && this.apiKey !== '';
  }

  private getModelId(model: string): string {
    const modelMap: Record<string, string> = {
      'gemma-2-2b': 'google/gemma-2-2b-it',
      'llama-3.1-8b': 'meta-llama/Llama-3.1-8B-Instruct',
      'qwen-2.5-1.5b': 'Qwen/Qwen2.5-1.5B-Instruct'
    };
    return modelMap[model] || 'google/gemma-2-2b-it';
  }

  getName(): string {
    const nameMap: Record<string, string> = {
      'google/gemma-2-2b-it': 'Gemma 2 2B (HF)',
      'meta-llama/Llama-3.1-8B-Instruct': 'LLaMA 3.1 8B (HF)',
      'Qwen/Qwen2.5-1.5B-Instruct': 'Qwen 2.5 1.5B (HF)'
    };
    return nameMap[this.model] || 'Hugging Face AI';
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('Hugging Face API key not configured. Please add VITE_HUGGINGFACE_API_KEY to your environment variables.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from Hugging Face API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error instanceof Error ? error : new Error('Failed to get response from Hugging Face');
    }
  }
}

// DeepSeek Provider
export class DeepSeekProvider implements AIProvider {
  private apiKey: string;
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private isAvailable: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.isAvailable = !!this.apiKey && this.apiKey !== '';
  }

  getName(): string {
    return 'DeepSeek V3';
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.isAvailable) {
      throw new Error('DeepSeek API key not configured. Please add VITE_DEEPSEEK_API_KEY to your environment variables.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error instanceof Error ? error : new Error('Failed to get response from DeepSeek');
    }
  }
}

// Export model configuration
export interface AIModel {
  key: string;
  name: string;
  provider: string;
}

// Smart AI Service that manages multiple providers
class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private availableModels: AIModel[] = [];

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    console.log('Initializing AI Service...');

    // Initialize Gemini provider
    try {
      const gemini = new GeminiProvider();
      this.providers.set('gemini', gemini);
      this.availableModels.push({ key: 'gemini', name: gemini.getName(), provider: 'gemini' });
      console.log('✅ Gemini provider initialized successfully');
    } catch (error) {
      console.log('❌ Gemini provider initialization failed:', error);
    }

    // Initialize Groq providers
    try {
      const groqLlama70b = new GroqProvider('llama-3.3-70b');
      const groqLlama8b = new GroqProvider('llama-3.1-8b');
      const groqMixtral = new GroqProvider('mixtral-8x7b');
      const groqGemma = new GroqProvider('gemma2-9b');
      
      this.providers.set('groq-llama-70b', groqLlama70b);
      this.providers.set('groq-llama-8b', groqLlama8b);
      this.providers.set('groq-mixtral', groqMixtral);
      this.providers.set('groq-gemma', groqGemma);
      
      this.availableModels.push(
        { key: 'groq-llama-70b', name: groqLlama70b.getName(), provider: 'groq' },
        { key: 'groq-llama-8b', name: groqLlama8b.getName(), provider: 'groq' },
        { key: 'groq-mixtral', name: groqMixtral.getName(), provider: 'groq' },
        { key: 'groq-gemma', name: groqGemma.getName(), provider: 'groq' }
      );
      console.log('✅ Groq providers initialized successfully');
    } catch (error) {
      console.log('❌ Groq provider initialization failed:', error);
    }

    // Initialize Hugging Face providers
    try {
      const hfGemma = new HuggingFaceProvider('gemma-2-2b');
      const hfLlama = new HuggingFaceProvider('llama-3.1-8b');
      const hfQwen = new HuggingFaceProvider('qwen-2.5-1.5b');
      
      this.providers.set('hf-gemma', hfGemma);
      this.providers.set('hf-llama', hfLlama);
      this.providers.set('hf-qwen', hfQwen);
      
      this.availableModels.push(
        { key: 'hf-gemma', name: hfGemma.getName(), provider: 'huggingface' },
        { key: 'hf-llama', name: hfLlama.getName(), provider: 'huggingface' },
        { key: 'hf-qwen', name: hfQwen.getName(), provider: 'huggingface' }
      );
      console.log('✅ Hugging Face providers initialized successfully');
    } catch (error) {
      console.log('❌ Hugging Face provider initialization failed:', error);
    }

    // Initialize DeepSeek provider
    try {
      const deepSeek = new DeepSeekProvider();
      this.providers.set('deepseek', deepSeek);
      this.availableModels.push({ key: 'deepseek', name: deepSeek.getName(), provider: 'deepseek' });
      console.log('✅ DeepSeek provider initialized successfully');
    } catch (error) {
      console.log('❌ DeepSeek provider initialization failed:', error);
    }

    console.log('Available providers:', Array.from(this.providers.keys()));
    console.log('Total providers initialized:', this.providers.size);
    console.log('Available models:', this.availableModels);
  }

  getAvailableModels(): AIModel[] {
    return this.availableModels;
  }

  async generateResponse(message: string, modelKey: string = 'gemini'): Promise<string> {
    const provider = this.providers.get(modelKey);
    
    if (!provider) {
      // Fallback to Gemini if the selected model is not available
      const fallbackProvider = this.providers.get('gemini');
      if (fallbackProvider) {
        console.log(`Model ${modelKey} not available, falling back to Gemini`);
        return await fallbackProvider.generateResponse(message);
      }
      throw new Error(`No AI provider available for model: ${modelKey}`);
    }

    try {
      return await provider.generateResponse(message);
    } catch (error) {
      console.error(`Error with ${modelKey} provider:`, error);
      
      // Try fallback to Gemini if it's available and not the original provider
      if (modelKey !== 'gemini') {
        const fallbackProvider = this.providers.get('gemini');
        if (fallbackProvider) {
          console.log(`Falling back to Gemini due to error with ${modelKey}`);
          try {
            return await fallbackProvider.generateResponse(message);
          } catch (fallbackError) {
            console.error('Fallback to Gemini also failed:', fallbackError);
          }
        }
      }
      
      throw error;
    }
  }
}

export default AIService;