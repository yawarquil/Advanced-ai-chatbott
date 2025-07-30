// AI Service Factory for multiple providers
export interface AIProvider {
  generateResponse(message: string): Promise<string>;
  getName(): string;
}

// Gemini Provider
export class GeminiProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKeys = (import.meta.env.VITE_GEMINI_API_KEYS || '').split(',').filter(Boolean);
  }

  getName(): string {
    return 'Gemini 1.5 Flash';
  }

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('Gemini API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All Gemini API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(`${this.apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) throw new Error('Invalid Gemini response');
      return data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.warn(`Gemini key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// Groq Provider
export class GroqProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private model: string;

  constructor(model: 'llama-3.3-70b' | 'llama-3.1-8b' | 'mixtral-8x7b' | 'gemma2-9b' = 'llama-3.3-70b') {
    this.apiKeys = (import.meta.env.VITE_GROQ_API_KEYS || '').split(',').filter(Boolean);
    this.model = this.getModelId(model);
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

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('Groq API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All Groq API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, messages: [{ role: 'user', content: message }] }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Invalid Groq response');
      return data.choices[0].message.content;
    } catch (error) {
      console.warn(`Groq key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// Hugging Face Provider
export class HuggingFaceProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://router.huggingface.co/hf-inference/v1/chat/completions';
  private model: string;
  
  constructor(model: 'gemma-2-2b' | 'llama-3.1-8b' | 'qwen-2.5-1.5b' = 'gemma-2-2b') {
    this.apiKeys = (import.meta.env.VITE_HUGGINGFACE_API_KEYS || '').split(',').filter(Boolean);
    this.model = this.getModelId(model);
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

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('Hugging Face API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All Hugging Face API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.model, messages: [{ role: 'user', content: message }] }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Invalid Hugging Face response');
      return data.choices[0].message.content;
    } catch (error) {
      console.warn(`Hugging Face key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// DeepSeek Provider
export class DeepSeekProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://api.deepseek.com/v1/chat/completions';

  constructor() {
    this.apiKeys = (import.meta.env.VITE_DEEPSEEK_API_KEYS || '').split(',').filter(Boolean);
  }
  
  getName(): string { return 'DeepSeek V3'; }

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('DeepSeek API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All DeepSeek API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: message }] }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Invalid DeepSeek response');
      return data.choices[0].message.content;
    } catch (error) {
      console.warn(`DeepSeek key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// Add GrokXProvider for xAI Grok
class GrokXProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://api.aimlapi.com/v1/chat/completions';
  private readonly model = 'x-ai/grok-3-beta';

  constructor() {
    this.apiKeys = (import.meta.env.VITE_GROKX_API_KEYS || '').split(',').filter(Boolean);
  }

  getName(): string {
    return 'Grok 3 Beta (xAI)';
  }

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('GrokX API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All GrokX API keys failed.`);
    const apiKey = this.apiKeys[this.currentApiKeyIndex];
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'user', content: message }
          ],
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Invalid GrokX response');
      return data.choices[0].message.content;
    } catch (error) {
      console.warn(`GrokX key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// Perplexity Provider
export class PerplexityProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';
  private model: string;

  constructor(model: 'llama-3.1-sonar-small-128k-online' | 'llama-3.1-sonar-large-128k-online' | 'llama-3.1-sonar-small-128k' | 'llama-3.1-sonar-large-128k' | 'mixtral-8x7b-instruct' | 'codellama-70b-instruct' = 'llama-3.1-sonar-small-128k-online') {
    this.apiKeys = (import.meta.env.VITE_PERPLEXITY_API_KEYS || '').split(',').filter(Boolean);
    this.model = model;
  }

  getName(): string {
    const nameMap: Record<string, string> = {
      'llama-3.1-sonar-small-128k-online': 'Perplexity Sonar Small (Online)',
      'llama-3.1-sonar-large-128k-online': 'Perplexity Sonar Large (Online)',
      'llama-3.1-sonar-small-128k': 'Perplexity Sonar Small',
      'llama-3.1-sonar-large-128k': 'Perplexity Sonar Large',
      'mixtral-8x7b-instruct': 'Perplexity Mixtral 8x7B',
      'codellama-70b-instruct': 'Perplexity Code Llama 70B'
    };
    return nameMap[this.model] || 'Perplexity AI';
  }

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('Perplexity API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All Perplexity API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${apiKey}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          model: this.model, 
          messages: [{ role: 'user', content: message }],
          max_tokens: 1024,
          temperature: 0.7
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) throw new Error('Invalid Perplexity response');
      return data.choices[0].message.content;

    } catch (error) {
      console.warn(`Perplexity key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
    }
  }
}

// Claude Provider
export class ClaudeProvider implements AIProvider {
  private apiKeys: string[];
  private currentApiKeyIndex = 0;
  private readonly apiUrl = 'https://api.anthropic.com/v1/messages';
  private readonly model = 'claude-3-opus-20240229';

  constructor() {
    this.apiKeys = (import.meta.env.VITE_CLAUDE_API_KEYS || '').split(',').filter(Boolean);
  }

  getName(): string {
    return 'Claude 3 Opus';
  }

  async generateResponse(message: string, attempts = 0): Promise<string> {
    if (this.apiKeys.length === 0) throw new Error('Claude API key(s) not configured.');
    if (attempts >= this.apiKeys.length) throw new Error(`All Claude API keys failed.`);
    
    const apiKey = this.apiKeys[this.currentApiKeyIndex];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'deepseek-chat', messages: [{ role: 'user', content: message }] }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.content?.[0]?.text) throw new Error('Invalid Claude response');
      return data.content[0].text;

    } catch (error) {
      console.warn(`Claude key failed, trying next...`);
      this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.apiKeys.length;
      return this.generateResponse(message, attempts + 1);
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
    try {
      const gemini = new GeminiProvider();
      this.providers.set('gemini', gemini);
      this.availableModels.push({ key: 'gemini', name: gemini.getName(), provider: 'gemini' });
    } catch(e) { console.error("Failed to initialize Gemini:", e); }

    try {
      const claude = new ClaudeProvider();
      this.providers.set('claude', claude);
      this.availableModels.push({ key: 'claude', name: claude.getName(), provider: 'claude' });
    } catch(e) { console.error("Failed to initialize Claude:", e); }

    try {
      const groqLlama70b = new GroqProvider('llama-3.3-70b');
      this.providers.set('groq-llama-70b', groqLlama70b);
      this.availableModels.push({ key: 'groq-llama-70b', name: groqLlama70b.getName(), provider: 'groq' });
      
      const groqLlama8b = new GroqProvider('llama-3.1-8b');
      this.providers.set('groq-llama-8b', groqLlama8b);
      this.availableModels.push({ key: 'groq-llama-8b', name: groqLlama8b.getName(), provider: 'groq' });

      const groqMixtral = new GroqProvider('mixtral-8x7b');
      this.providers.set('groq-mixtral', groqMixtral);
      this.availableModels.push({ key: 'groq-mixtral', name: groqMixtral.getName(), provider: 'groq' });
      
      const groqGemma = new GroqProvider('gemma2-9b');
      this.providers.set('groq-gemma', groqGemma);
      this.availableModels.push({ key: 'groq-gemma', name: groqGemma.getName(), provider: 'groq' });
    } catch(e) { console.error("Failed to initialize Groq models:", e); }
    
    try {
      const hfGemma = new HuggingFaceProvider('gemma-2-2b');
      this.providers.set('hf-gemma', hfGemma);
      this.availableModels.push({ key: 'hf-gemma', name: hfGemma.getName(), provider: 'huggingface' });
      
      const hfLlama = new HuggingFaceProvider('llama-3.1-8b');
      this.providers.set('hf-llama', hfLlama);
      this.availableModels.push({ key: 'hf-llama', name: hfLlama.getName(), provider: 'huggingface' });

      const hfQwen = new HuggingFaceProvider('qwen-2.5-1.5b');
      this.providers.set('hf-qwen', hfQwen);
      this.availableModels.push({ key: 'hf-qwen', name: hfQwen.getName(), provider: 'huggingface' });
    } catch(e) { console.error("Failed to initialize Hugging Face models:", e); }
    
    try {
      const deepSeek = new DeepSeekProvider();
      this.providers.set('deepseek', deepSeek);
      this.availableModels.push({ key: 'deepseek', name: deepSeek.getName(), provider: 'deepseek' });
    } catch(e) { console.error("Failed to initialize DeepSeek:", e); }

    try {
      const grokX = new GrokXProvider();
      this.providers.set('grokx', grokX);
      this.availableModels.push({ key: 'grokx', name: grokX.getName(), provider: 'grokx' });
    } catch(e) { console.error("Failed to initialize GrokX:", e); }

    try {
      const perplexitySmallOnline = new PerplexityProvider('llama-3.1-sonar-small-128k-online');
      this.providers.set('perplexity-small-online', perplexitySmallOnline);
      this.availableModels.push({ key: 'perplexity-small-online', name: perplexitySmallOnline.getName(), provider: 'perplexity' });
      
      const perplexityLargeOnline = new PerplexityProvider('llama-3.1-sonar-large-128k-online');
      this.providers.set('perplexity-large-online', perplexityLargeOnline);
      this.availableModels.push({ key: 'perplexity-large-online', name: perplexityLargeOnline.getName(), provider: 'perplexity' });

      const perplexitySmall = new PerplexityProvider('llama-3.1-sonar-small-128k');
      this.providers.set('perplexity-small', perplexitySmall);
      this.availableModels.push({ key: 'perplexity-small', name: perplexitySmall.getName(), provider: 'perplexity' });

      const perplexityLarge = new PerplexityProvider('llama-3.1-sonar-large-128k');
      this.providers.set('perplexity-large', perplexityLarge);
      this.availableModels.push({ key: 'perplexity-large', name: perplexityLarge.getName(), provider: 'perplexity' });

      const perplexityMixtral = new PerplexityProvider('mixtral-8x7b-instruct');
      this.providers.set('perplexity-mixtral', perplexityMixtral);
      this.availableModels.push({ key: 'perplexity-mixtral', name: perplexityMixtral.getName(), provider: 'perplexity' });

      const perplexityCodeLlama = new PerplexityProvider('codellama-70b-instruct');
      this.providers.set('perplexity-codellama', perplexityCodeLlama);
      this.availableModels.push({ key: 'perplexity-codellama', name: perplexityCodeLlama.getName(), provider: 'perplexity' });
    } catch(e) { console.error("Failed to initialize Perplexity models:", e); }

    console.log('Available models:', this.availableModels);
  }

  getAvailableModels(): AIModel[] {
    return this.availableModels;
  }

  async generateResponse(message: string, modelKey: string = 'gemini'): Promise<string> {
    const provider = this.providers.get(modelKey);
    
    if (!provider) {
      const fallbackProvider = this.providers.get('gemini');
      if (fallbackProvider) {
        console.warn(`Model ${modelKey} not available, falling back to Gemini`);
        return fallbackProvider.generateResponse(message);
      }
      throw new Error(`No AI provider available for model: ${modelKey}`);
    }

    try {
      return await provider.generateResponse(message);
    } catch (error) {
      console.error(`Error with ${modelKey} provider:`, error);
      const fallbackProvider = this.providers.get('gemini');
      if (modelKey !== 'gemini' && fallbackProvider) {
        console.warn(`Falling back to Gemini due to error with ${modelKey}`);
        return fallbackProvider.generateResponse(message);
      }
      throw error;
    }
  }
}

export default AIService;