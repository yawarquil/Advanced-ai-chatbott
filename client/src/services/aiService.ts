// AI Service Factory for multiple providers
export interface AIProvider {
  generateResponse(message: string): Promise<string>;
  getName(): string;
}

// Gemini Provider
export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private readonly apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
    }
  }

  getName(): string {
    return 'Gemini 1.5 Flash';
  }

  async generateResponse(message: string): Promise<string> {
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
      
      if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later.');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error. Please check your internet connection.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while contacting the AI service.');
    }
  }
}

// OpenRouter Provider
export class OpenRouterProvider implements AIProvider {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

  getName(): string {
    return 'OpenRouter (Mistral 7B)';
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Assistant',
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct:free',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to get response from OpenRouter. Please try again.');
    }
  }
}

// Perplexity Provider
export class PerplexityProvider implements AIProvider {
  private readonly apiUrl = 'https://api.perplexity.ai/chat/completions';

  getName(): string {
    return 'Perplexity (Mixtral 8x7B)';
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-instruct',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Perplexity API error:', error);
      throw new Error('Failed to get response from Perplexity. Please try again.');
    }
  }
}

// Groq Provider
export class GroqProvider implements AIProvider {
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  getName(): string {
    return 'Groq (Mixtral 8x7B)';
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to get response from Groq. Please try again.');
    }
  }
}

// HuggingFace Provider
export class HuggingFaceProvider implements AIProvider {
  private readonly apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

  getName(): string {
    return 'HuggingFace (DialoGPT)';
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 1024,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        let responseText = data[0].generated_text;
        if (responseText.startsWith(message)) {
          responseText = responseText.substring(message.length).trim();
        }
        return responseText || "I understand your message. Could you please rephrase or ask something else?";
      }
      
      return "I understand what you're saying. Could you tell me more about that?";
    } catch (error) {
      console.error('HuggingFace API error:', error);
      throw new Error('Failed to get response from HuggingFace. Please try again.');
    }
  }
}

// AnyScale Provider
export class AnyScaleProvider implements AIProvider {
  private readonly apiUrl = 'https://api.endpoints.anyscale.com/v1/chat/completions';

  getName(): string {
    return 'AnyScale (Llama 3 8B)';
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/Llama-3-8b-chat-hf',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`AnyScale API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('AnyScale API error:', error);
      throw new Error('Failed to get response from AnyScale. Please try again.');
    }
  }
}

// AI Service Factory
export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    // Always try to initialize Gemini first
    try {
      this.providers.set('gemini', new GeminiProvider());
      console.log('Gemini provider initialized successfully');
    } catch (error) {
      console.warn('Gemini provider not available:', error);
    }

    // Initialize other providers
    try {
      this.providers.set('openrouter', new OpenRouterProvider());
      console.log('OpenRouter provider initialized');
    } catch (error) {
      console.warn('OpenRouter provider not available:', error);
    }

    try {
      this.providers.set('perplexity', new PerplexityProvider());
      console.log('Perplexity provider initialized');
    } catch (error) {
      console.warn('Perplexity provider not available:', error);
    }

    try {
      this.providers.set('groq', new GroqProvider());
      console.log('Groq provider initialized');
    } catch (error) {
      console.warn('Groq provider not available:', error);
    }

    try {
      this.providers.set('huggingface', new HuggingFaceProvider());
      console.log('HuggingFace provider initialized');
    } catch (error) {
      console.warn('HuggingFace provider not available:', error);
    }

    try {
      this.providers.set('anyscale', new AnyScaleProvider());
      console.log('AnyScale provider initialized');
    } catch (error) {
      console.warn('AnyScale provider not available:', error);
    }

    console.log('Available providers:', Array.from(this.providers.keys()));
  }

  getProvider(model: string): AIProvider {
    const provider = this.providers.get(model);
    if (!provider) {
      // Fallback to first available provider
      const firstProvider = this.providers.values().next().value;
      if (firstProvider) {
        console.warn(`Model "${model}" not available, using fallback provider`);
        return firstProvider;
      }
      throw new Error(`No AI providers available. Please check your configuration.`);
    }
    return provider;
  }

  getAvailableModels(): Array<{ key: string; name: string }> {
    return Array.from(this.providers.entries()).map(([key, provider]) => ({
      key,
      name: provider.getName(),
    }));
  }
}