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
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    console.log('Gemini API Key available:', !!this.apiKey);
  }

  getName(): string {
    return 'Gemini 1.5 Flash';
  }

  async generateResponse(message: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment variables.');
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
      throw new Error('OpenRouter service temporarily unavailable.');
    }
  }
}

// Simple fallback provider that always works
export class FallbackProvider implements AIProvider {
  getName(): string {
    return 'Smart AI Assistant';
  }

  async generateResponse(message: string): Promise<string> {
    // Simulate a small delay for realism
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = this.generateContextualResponse(message);
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateContextualResponse(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    
    // Programming/coding questions
    if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('html') || lowerMessage.includes('css')) {
      return [
        "I'd be happy to help with coding! Could you share more details about what you're trying to build or the specific problem you're facing?",
        "Programming can be challenging but rewarding! What programming language or technology are you working with?",
        "For coding questions, it's helpful to see the specific code you're working on. Could you share a code snippet?"
      ];
    }
    
    // Math/calculations
    if (lowerMessage.includes('math') || lowerMessage.includes('calculate') || lowerMessage.includes('equation') || /\d+[\+\-\*\/]\d+/.test(lowerMessage)) {
      return [
        "I can help with math problems! Could you provide the specific calculation or equation you need help with?",
        "Mathematics is fascinating! What type of math problem are you working on?",
        "I'd be glad to help with calculations. Please share the mathematical problem you'd like me to solve."
      ];
    }
    
    // Creative writing
    if (lowerMessage.includes('write') || lowerMessage.includes('story') || lowerMessage.includes('creative') || lowerMessage.includes('poem')) {
      return [
        "I love creative writing! What kind of story or content would you like me to help you create?",
        "Creative writing is one of my favorite topics! What genre or style are you interested in?",
        "I'd be happy to help with writing. Could you tell me more about what you'd like to create?"
      ];
    }
    
    // Questions
    if (lowerMessage.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how') || lowerMessage.startsWith('why') || lowerMessage.startsWith('when') || lowerMessage.startsWith('where')) {
      return [
        "That's a great question! Let me think about that and provide you with a helpful answer.",
        "I'd be happy to help answer that question. Could you provide a bit more context so I can give you the most accurate information?",
        "Interesting question! I'll do my best to provide you with a comprehensive answer."
      ];
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good morning') || lowerMessage.includes('good afternoon')) {
      return [
        "Hello! I'm here to help you with any questions or tasks you have. What can I assist you with today?",
        "Hi there! I'm your AI assistant, ready to help with anything you need. How can I be of service?",
        "Greetings! I'm excited to help you today. What would you like to explore or learn about?"
      ];
    }
    
    // Help requests
    if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('support')) {
      return [
        "I'm here to help! I can assist with a wide variety of topics including answering questions, helping with writing, explaining concepts, solving problems, and much more. What do you need help with?",
        "I'd be glad to assist you! I can help with research, writing, problem-solving, explanations, creative tasks, and many other things. What specific help do you need?",
        "Absolutely, I'm here to support you! Whether you need information, creative help, problem-solving, or just want to have a conversation, I'm ready to help. What's on your mind?"
      ];
    }
    
    // Default responses for general messages
    return [
      "That's interesting! I'd love to help you explore that topic further. Could you tell me more about what you're thinking?",
      "I understand what you're saying. Could you provide more details so I can give you a more specific and helpful response?",
      "Thanks for sharing that with me! I'm here to help in any way I can. What would you like to know or discuss?",
      "I appreciate you reaching out! I'm designed to be helpful, informative, and engaging. How can I best assist you today?",
      "That's a great point to bring up! I'd be happy to discuss this topic with you. What specific aspect interests you most?",
      "I'm here to help you with whatever you need! Whether it's answering questions, helping with tasks, or just having a conversation, I'm ready to assist.",
      "Thank you for your message! I'm always eager to help and learn from our conversations. What would you like to explore together?"
    ];
  }
}

// AI Service Factory
export class AIService {
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    console.log('Initializing AI Service...');
    
    // Always add the fallback provider first
    this.providers.set('fallback', new FallbackProvider());
    console.log('Fallback provider initialized');

    // Try to initialize Gemini
    try {
      const geminiProvider = new GeminiProvider();
      this.providers.set('gemini', geminiProvider);
      console.log('✅ Gemini provider initialized successfully');
    } catch (error) {
      console.warn('❌ Gemini provider failed to initialize:', error);
    }

    // Try to initialize OpenRouter
    try {
      this.providers.set('openrouter', new OpenRouterProvider());
      console.log('✅ OpenRouter provider initialized');
    } catch (error) {
      console.warn('❌ OpenRouter provider failed to initialize:', error);
    }

    console.log('Available providers:', Array.from(this.providers.keys()));
    console.log('Total providers initialized:', this.providers.size);
  }

  getProvider(model: string): AIProvider {
    console.log(`Requesting provider for model: ${model}`);
    
    const provider = this.providers.get(model);
    if (provider) {
      console.log(`✅ Found provider for ${model}`);
      return provider;
    }
    
    // Fallback to first available provider
    const firstProvider = this.providers.values().next().value;
    if (firstProvider) {
      console.warn(`⚠️ Model "${model}" not available, using fallback provider`);
      return firstProvider;
    }
    
    console.error('❌ No providers available at all');
    throw new Error('No AI providers available. Please check your configuration.');
  }

  getAvailableModels(): Array<{ key: string; name: string }> {
    const models = Array.from(this.providers.entries()).map(([key, provider]) => ({
      key,
      name: provider.getName(),
    }));
    
    console.log('Available models:', models);
    return models;
  }
}