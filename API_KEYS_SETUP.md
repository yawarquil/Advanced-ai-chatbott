# API Keys Setup for Free AI Image Generation

Your chat app now supports multiple free AI image generation services! Here's how to set up the API keys:

## 🆓 Free Services (No API Key Required)

### 1. **Pollinations AI** ✅
- **Status**: Ready to use
- **API Key**: Not required
- **Features**: AI-generated images from text prompts

### 2. **Lorem Picsum** ✅
- **Status**: Ready to use  
- **API Key**: Not required
- **Features**: Random placeholder images

## 🔑 Free Services (API Key Required)

### 3. **Unsplash Photos**
- **Get API Key**: https://unsplash.com/developers
- **Free Tier**: 5,000 requests per hour
- **Environment Variable**: `VITE_UNSPLASH_API_KEYS=your_unsplash_access_key`

### 4. **Pixabay Photos**
- **Get API Key**: https://pixabay.com/api/docs/
- **Free Tier**: 5,000 requests per hour
- **Environment Variable**: `VITE_PIXABAY_API_KEYS=your_pixabay_api_key`

### 5. **Pexels Photos**
- **Get API Key**: https://www.pexels.com/api/
- **Free Tier**: 200 requests per hour
- **Environment Variable**: `VITE_PEXELS_API_KEYS=your_pexels_api_key`

### 6. **Hugging Face** (for DALL-E Mini & Stable Diffusion)
- **Get API Key**: https://huggingface.co/settings/tokens
- **Free Tier**: Limited requests per day
- **Environment Variable**: `VITE_HUGGINGFACE_API_KEYS=your_hf_token`

## 🤖 AI Text Models Setup

### **Perplexity AI** (Real-time Information & Web Search)
- **Get API Key**: https://www.perplexity.ai/settings/api
- **Free Tier**: 5 requests per minute
- **Environment Variable**: `VITE_PERPLEXITY_API_KEYS=your_perplexity_api_key`
- **Features**: 
  - Real-time web search capabilities
  - Access to current information
  - Multiple models including Sonar Small/Large (Online)
  - Code generation with Code Llama 70B

### **Other AI Models**
- **Gemini**: `VITE_GEMINI_API_KEYS=your_gemini_key`
- **Groq**: `VITE_GROQ_API_KEYS=your_groq_key`
- **Hugging Face**: `VITE_HUGGINGFACE_API_KEYS=your_hf_token`
- **DeepSeek**: `VITE_DEEPSEEK_API_KEYS=your_deepseek_key`
- **Grok (xAI)**: `VITE_GROKX_API_KEYS=your_grokx_key`

## 🚀 Setup Instructions

1. **Create a `.env` file** in your project root (if it doesn't exist)

2. **Add your API keys** to the `.env` file:
```env
# AI Text Models
VITE_GEMINI_API_KEYS=your_gemini_key
VITE_GROQ_API_KEYS=your_groq_key
VITE_HUGGINGFACE_API_KEYS=your_hf_token
VITE_DEEPSEEK_API_KEYS=your_deepseek_key
VITE_GROKX_API_KEYS=your_grokx_key
VITE_PERPLEXITY_API_KEYS=your_perplexity_api_key

# Image Generation Services
VITE_UNSPLASH_API_KEYS=your_unsplash_access_key
VITE_PIXABAY_API_KEYS=your_pixabay_api_key
VITE_PEXELS_API_KEYS=your_pexels_api_key
```

3. **Restart your development server** after adding the keys

## 🎯 How to Use

### **AI Text Models**
1. Open the **Settings Panel** in your chat app
2. Go to the **AI Model** section
3. Select your preferred AI model from the dropdown
4. Start chatting with your chosen AI!

### **Image Generation**
1. Open the **Settings Panel** in your chat app
2. Go to the **Image Generation** section
3. Select your preferred image provider from the dropdown
4. Start generating images with prompts like:
   - "draw a beautiful sunset"
   - "create an image of a cat"
   - "generate a photo of mountains"

## 💡 Tips

- **Perplexity AI** is excellent for real-time information and current events
- **Pollinations AI** and **Lorem Picsum** work immediately without setup
- **Unsplash/Pixabay/Pexels** provide real photos, not AI-generated images
- **DALL-E Mini** and **Hugging Face** provide AI-generated images
- If an API key is missing, the app will automatically fall back to available services

## 🔄 Fallback System

If any service fails or API keys are missing, the app will automatically use a fallback service to ensure you always get a response. 