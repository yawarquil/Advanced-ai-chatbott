import { playClickSound, playTaskCompleteSound } from './services/sound';
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import TypingMessage from './components/TypingMessage';
import ErrorMessage from './components/ErrorMessage';
import SettingsPanel from './components/SettingsPanel';
import ConversationSidebar from './components/ConversationSidebar';
import AuthModal from './components/AuthModal';
import { ThemeProvider } from './components/ThemeProvider';
import AIService from './services/aiService';
import { StorageService } from './services/storageService';
import { AuthService } from './services/authService';
import { DatabaseService } from './services/databaseService';
import { ImageService } from './services/imageService';
import { Message, ChatState, Settings, Conversation, User, AuthState } from './types/chat';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isGeneratingImage: false,
  });

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    aiModel: 'fallback',
    voiceEnabled: false,
    selectedVoice: '',
    voiceSpeed: 1,
    voicePitch: 1,
    autoScroll: true,
    persistHistory: true,
    imageGeneration: true,
    fontSize: 14,
    fontFamily: 'sans-serif',
    imageModel: 'pollinations', // New default setting
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [showSignInBanner, setShowSignInBanner] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stopTypingRef = useRef<(() => void) | null>(null);
  const aiService = useRef(new AIService());
  const storageService = useRef(new StorageService());
  const authService = useRef<AuthService | null>(null);
  const databaseService = useRef<DatabaseService | null>(null);
  const imageService = useRef(new ImageService());
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    try {
      authService.current = new AuthService();
      databaseService.current = new DatabaseService();
    } catch (error) {
      console.warn('Database services not available:', error);
    }
  }, []);

  useTheme(settings);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
  const handleGlobalClick = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest('button')) {
      playClickSound();
    }
  };

  document.addEventListener('click', handleGlobalClick);

  return () => {
    document.removeEventListener('click', handleGlobalClick);
  };
}, []);

  useEffect(() => {
    if (!authService.current) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const checkAuth = async () => {
      try {
        const user = await authService.current!.getCurrentUser();
        setAuthState({ user, isLoading: false, error: null });
        if (user && databaseService.current) {
          const token = localStorage.getItem('auth_token');
          databaseService.current.updateToken(token);
        }
      } catch (error) {
        setAuthState({ user: null, isLoading: false, error: null });
      }
    };
    checkAuth();

    const { data: { subscription } } = authService.current.onAuthStateChange((user) => {
      setAuthState(prev => ({ ...prev, user }));
      if (databaseService.current) {
        const token = user ? localStorage.getItem('auth_token') : null;
        databaseService.current.updateToken(token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (authState.user && databaseService.current) {
        try {
          const userSettings = await databaseService.current.loadUserSettings(authState.user.id);
          if (userSettings) setSettings(s => ({...s, ...userSettings}));
          const userConversations = await databaseService.current.loadConversations(authState.user.id);
          setConversations(userConversations);
          const currentMessages = await databaseService.current.loadCurrentConversation(authState.user.id);
          if (currentMessages.length > 0) {
            setChatState(prev => ({ ...prev, messages: currentMessages }));
          } else {
            addWelcomeMessage();
          }
        } catch (error) {
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
    };

    const loadLocalData = () => {
      const loadedSettings = storageService.current.loadSettings();
      setSettings(loadedSettings);
      const loadedConversations = storageService.current.loadConversations();
      setConversations(loadedConversations);
      if (loadedSettings.persistHistory) {
        const currentMessages = storageService.current.loadCurrentConversation();
        if (currentMessages.length > 0) {
          setChatState(prev => ({ ...prev, messages: currentMessages }));
        } else {
          addWelcomeMessage();
        }
      } else {
        addWelcomeMessage();
      }
    };

    if (!authState.isLoading) loadData();
  }, [authState.user, authState.isLoading]);
  
  useEffect(() => {
    if (settings.autoScroll) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [chatState.messages, settings.autoScroll]);

  const handleSignIn = async (email: string, password: string) => {
    if (!authService.current) throw new Error('Auth service not available');
    try {
      const user = await authService.current.signIn(email, password);
      setAuthState({ user, isLoading: false, error: null });
      setIsAuthModalOpen(false);
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Sign in failed' }));
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
     if (!authService.current) throw new Error('Auth service not available');
    try {
      const user = await authService.current.signUp(email, password);
      setAuthState({ user, isLoading: false, error: null });
      setIsAuthModalOpen(false);
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Sign up failed' }));
      throw error;
    }
  };
  
  const handleSignOut = async () => {
    if (!authService.current) return;
    await authService.current.signOut();
    setAuthState({ user: null, isLoading: false, error: null });
    setConversations([]);
    handleNewConversation();
  };
  
  const addWelcomeMessage = () => {
    const welcomeMessage: Message = { id: uuidv4(), type: 'ai', text: "Hello! I'm your AI assistant. How can I assist you today?", timestamp: new Date(), model: 'AI Assistant' };
    setChatState({ messages: [welcomeMessage], isLoading: false, error: null });
  };
  
  const handleSendMessage = async (messageText: string, attachments?: any[], generateImage?: boolean) => {
    const userMessage: Message = { id: uuidv4(), type: 'user', text: messageText, timestamp: new Date(), attachments };
    setChatState(prev => ({ ...prev, messages: [...prev.messages, userMessage], isLoading: !generateImage, isGeneratingImage: !!generateImage, error: null }));

    try {
      if (generateImage) {
        const imagePrompt = imageService.current.extractImagePrompt(messageText);
        const imageUrl = await imageService.current.generateImage(imagePrompt, settings.imageModel);
        const aiMessage: Message = { id: uuidv4(), type: 'ai', text: `Generated image for: "${imagePrompt}"`, timestamp: new Date(), model: 'AI Image Generator', imageUrl, imagePrompt };
        setChatState(prev => ({ ...prev, messages: [...prev.messages, aiMessage], isGeneratingImage: false }));
      } else {
        let contextualMessage = messageText;
        if (attachments && attachments.length > 0) {
          const attachmentContext = attachments.map(att => att.content && att.type.startsWith('text/') ? `File "${att.name}" content:\n${att.content}` : `File attached: ${att.name}`).join('\n\n');
          contextualMessage = `${messageText}\n\nAttached files:\n${attachmentContext}`;
        }
        const response = await aiService.current.generateResponse(contextualMessage, settings.aiModel);
        const currentModel = aiService.current.getAvailableModels().find(m => m.key === settings.aiModel);
        const modelName = currentModel ? currentModel.name : 'AI Assistant';
        const aiMessage: Message = { id: uuidv4(), type: 'ai', text: response, timestamp: new Date(), model: modelName };
        setChatState(prev => ({ ...prev, messages: [...prev.messages, aiMessage], isLoading: false }));
        setTypingMessageId(aiMessage.id);
      }
    } catch (error) {
      setChatState(prev => ({ ...prev, isLoading: false, isGeneratingImage: false, error: error instanceof Error ? error.message : 'Failed to get response' }));
    }
  };

  const handleStopGeneration = () => {
    stopTypingRef.current?.();
    setChatState(prev => ({ ...prev, isLoading: false, isGeneratingImage: false }));
  };
  
  const handleTypingStop = (messageId: string, currentText: string) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === messageId ? { ...msg, text: currentText } : msg
      ),
    }));
    setTypingMessageId(null);
  };
  
  const handleTypingComplete = () => setTypingMessageId(null);
  
  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const handleNewConversation = () => {
    addWelcomeMessage();
    setCurrentConversationId(null);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setChatState({ messages: conversation.messages, isLoading: false, error: null });
    setCurrentConversationId(conversation.id);
  };

  const handleDeleteConversation = (id: string) => { 
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
        handleNewConversation();
    }
  };
  
  const handleClearHistory = () => {
    setConversations([]);
    handleNewConversation();
  };
  
  const handleExportData = () => {
    const data = { conversations, settings, user: authState.user };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-chat-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleRegenerate = async () => {
    const lastUserMessage = chatState.messages.slice().reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
        setChatState(prev => ({...prev, messages: prev.messages.slice(0, -1)}));
        await handleSendMessage(lastUserMessage.text, lastUserMessage.attachments);
    }
  };
  
  const handleRetry = () => {
    const lastUserMessage = chatState.messages.slice().reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
        setChatState(prev => ({...prev, error: null}));
        handleSendMessage(lastUserMessage.text, lastUserMessage.attachments);
    }
  };
  
  const handleRemoveMessage = (id: string) => {
    setChatState(prev => ({...prev, messages: prev.messages.filter(m => m.id !== id)}));
  };

  const handleShareConversation = (id: string) => {
      const conversation = conversations.find(c => c.id === id);
      if (!conversation) return;
      const formatted = conversation.messages.map(m => `${m.type === 'user' ? 'You' : 'AI'}: ${m.text}`).join('\n\n');
      navigator.clipboard.writeText(formatted).then(() => alert('Copied to clipboard!'));
  };
  
  const generateConversationTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(m => m.type === 'user');
    return firstUserMessage ? (firstUserMessage.text.substring(0, 30) + '...') : 'New Conversation';
  };
  
  const shouldShowAuth = !authState.isLoading && !authState.user && authService.current && showSignInBanner;

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ThemeProvider settings={settings} updateSettings={handleSettingsChange}>
      <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors" style={{ fontSize: `${settings.fontSize}px`, fontFamily: settings.fontFamily }}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSignIn={handleSignIn} onSignUp={handleSignUp} isLoading={authState.isLoading} error={authState.error} />
        {isDesktop ? (
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
            <ConversationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} conversations={conversations} currentConversationId={currentConversationId} onSelectConversation={handleSelectConversation} onNewConversation={handleNewConversation} onDeleteConversation={handleDeleteConversation} onShareConversation={handleShareConversation} isDesktop={isDesktop} />
          </div>
        ) : (
          <ConversationSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} conversations={conversations} currentConversationId={currentConversationId} onSelectConversation={handleSelectConversation} onNewConversation={handleNewConversation} onDeleteConversation={handleDeleteConversation} onShareConversation={handleShareConversation} isDesktop={isDesktop} />
        )}
        <div className="flex-1 flex flex-col">
          <Header onSettingsClick={() => setIsSettingsOpen(true)} onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} user={authState.user} onSignIn={() => setIsAuthModalOpen(true)} onSignOut={handleSignOut} />
          {shouldShowAuth && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <p className="text-blue-800 dark:text-blue-200 text-sm">Sign in to save your conversations.</p>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Sign In</button>
                  <button onClick={() => setShowSignInBanner(false)} className="p-1 rounded" title="Dismiss"><X className="h-4 w-4 text-blue-600" /></button>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto chat-container">
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {chatState.messages.map((message, index) => (
                message.id === typingMessageId ? (
                  <TypingMessage key={message.id} message={message} onComplete={handleTypingComplete} onTypingStop={handleTypingStop} stopTypingRef={stopTypingRef} />
                ) : (
                  <ChatMessage key={message.id} message={message} onRegenerate={!typingMessageId && index === chatState.messages.length - 1 ? handleRegenerate : undefined} onRemove={handleRemoveMessage} voiceEnabled={settings.voiceEnabled} voiceSettings={settings} />
                )
              ))}
              {(chatState.isLoading || chatState.isGeneratingImage) && <TypingIndicator message={chatState.isGeneratingImage ? "Generating image..." : "Thinking..."} />}
              {chatState.error && <ErrorMessage message={chatState.error} onRetry={handleRetry} />}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading || chatState.isGeneratingImage} isTyping={!!typingMessageId} onStopGeneration={handleStopGeneration} voiceEnabled={settings.voiceEnabled} imageGeneration={settings.imageGeneration} />
        </div>
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onSettingsChange={handleSettingsChange} onClearHistory={handleClearHistory} onExportData={handleExportData} />
      </div>
    </ThemeProvider>
  );
};

export default App;