# Advanced AI Chatbot

A modern, full-stack AI chatbot app with multi-model support, image generation, voice features, and a beautiful, customizable UI. Built with React, TypeScript, Express, and optional Python image server for advanced image generation.

---

## ✨ Features

- **Multi-Model AI Chat**: Switch between Gemini, Groq, Hugging Face, DeepSeek, Perplexity, and more.
- **Image Generation**: Generate images from text prompts using Pollinations, Hugging Face, Unsplash, Pixabay, Pexels, and Lorem Picsum.
- **Voice Output**: Listen to AI responses with customizable voice, speed, and pitch.
- **Conversation Management**: Save, export, and organize multiple conversations.
- **Rich UI**: Modern, responsive design with multiple themes, font choices, and animated backgrounds.
- **Authentication**: Register/login with JWT-secured endpoints.
- **Settings Panel**: Fine-tune AI model, image provider, theme, font, and more.
- **Attachment Support**: Send and preview images/files in chat.
- **Mobile & Desktop Ready**: Fully responsive and touch-friendly.

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: (Pluggable, see `server/storage.ts`)
- **Optional Image Server**: Python (Flask)

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Advanced-ai-chatbott
npm install
```

### 2. API Keys Setup

See [API_KEYS_SETUP.md](./API_KEYS_SETUP.md) for full details. Most features work out of the box, but for advanced AI/image providers:

- Copy `.env.example` to `.env` and add your API keys:

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

### 3. Run the App

#### Development (with hot reload):
```bash
npm run dev
```

#### Production:
```bash
npm run build
npm start
```

The app runs on [http://localhost:5000](http://localhost:5000)

---

## 🧩 Project Structure

```
client/         # Frontend React app
  src/
    components/ # UI components (Chat, Settings, Sidebar, etc.)
    services/   # AI, image, voice, storage, and auth services
    hooks/      # Custom React hooks
    types/      # TypeScript types
    utils/      # Utility functions
server/         # Express backend (API, auth, storage)
shared/         # Shared types/schema
attached_assets/# Error logs, assets
image_server.py # Optional Python image server
```

---

## ⚙️ Customization

- **Themes**: Choose from Light, Dark, Halloween, Cyber Neon, and more.
- **Fonts**: Sans-serif, Serif, Monospace.
- **AI Models**: Select from Gemini, Groq, Hugging Face, DeepSeek, Perplexity, and more.
- **Image Providers**: Pollinations, Hugging Face, Unsplash, Pixabay, Pexels, Lorem Picsum, DALL-E Mini.
- **Voice**: Enable/disable, pick voice, adjust speed/pitch.
- **Settings Panel**: Access all options in-app.

---

## 🔒 Authentication

- Register/login with email & password
- JWT-secured API endpoints
- User settings and conversation history are saved per account

---

## 🖼️ Optional: Python Image Server

For advanced image generation (e.g., Stable Diffusion XL):

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Set your Hugging Face API key in `.env`:
   ```env
   HUGGINGFACE_API_KEY=your_hf_token
   ```
3. Run the server:
   ```bash
   python image_server.py
   ```
   The server runs on port 5001 by default.

---

## 📦 Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm start` – Start production server

---

## 🤝 Contributing

Pull requests and issues welcome! Please open an issue for bugs or feature requests.

---

## 📄 License

MIT 