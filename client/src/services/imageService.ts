import { Settings } from '../types/chat';

export class ImageService {
  private readonly POLLINATIONS_API_URL = 'https://image.pollinations.ai/prompt';

  async generateImage(prompt: string, model: Settings['imageModel']): Promise<string> {
    // If the selected model is Hugging Face, use the alternative service
    if (model === 'huggingface') {
      return this.generateWithAlternativeService(prompt);
    }
    
    // Default to the Pollinations.ai service with its fallbacks
    try {
      const services = [
        () => {
          const encodedPrompt = encodeURIComponent(prompt);
          return `${this.POLLINATIONS_API_URL}/${encodedPrompt}?width=512&height=512&model=flux&enhance=true&nologo=true`;
        },
        () => {
          const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
          return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
        },
        () => this.generateFallbackImage(prompt)
      ];

      for (const getUrl of services) {
        try {
          const imageUrl = getUrl();
          await this.testImageLoad(imageUrl);
          return imageUrl;
        } catch (error) {
          console.warn('Image service failed, trying next...', error);
          continue;
        }
      }
      
      return this.generateFallbackImage(prompt);
    } catch (error) {
      console.error('Image generation error:', error);
      return this.generateFallbackImage(prompt);
    }
  }

  private async testImageLoad(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = url;
      setTimeout(() => reject(new Error('Image load timeout')), 10000);
    });
  }

  private generateFallbackImage(prompt: string): string {
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 100));
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodedPrompt}&backgroundColor=4F46E5,7C3AED,EC4899&size=512`;
  }

  isImageGenerationPrompt(text: string): boolean {
    const lowerText = text.toLowerCase().trim();
    const imageRegex = /^(generate|create|draw|paint|sketch|make|show me|visualize|illustrate|design)\s+(a|an|the)?\s*(image|photo|picture|artwork|drawing|painting|sketch|illustration|design)\s+(of|about)?/i;
    const simpleCommands = ['draw', 'paint', 'sketch', 'illustrate'];
    return imageRegex.test(lowerText) || simpleCommands.some(cmd => lowerText.startsWith(cmd));
  }

  extractImagePrompt(text: string): string {
    const lowerText = text.toLowerCase().trim();
    const imageRegex = /^(generate|create|draw|paint|sketch|make|show me|visualize|illustrate|design)\s+(a|an|the)?\s*(image|photo|picture|artwork|drawing|painting|sketch|illustration|design)\s+(of|about)?\s*/i;
    const cleanedPrompt = lowerText.replace(imageRegex, '').trim();
    return cleanedPrompt.charAt(0).toUpperCase() + cleanedPrompt.slice(1);
  }

  async generateWithAlternativeService(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 512,
            height: 512,
          }
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
      throw new Error('Hugging Face API request failed');
    } catch (error) {
      console.error('Alternative service error:', error);
    }
    
    return this.generateFallbackImage(prompt);
  }
}