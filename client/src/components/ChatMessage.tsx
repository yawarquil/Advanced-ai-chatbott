import React, { useState } from 'react';
import React, { useState } from 'react';
import { Bot, User, Volume2, VolumeX, RotateCcw, Image, X, Share2 } from 'lucide-react';
import { Message, MessageReaction } from '../types/chat';
import { VoiceService } from '../services/voiceService';
import AttachmentPreview from './AttachmentPreview';
import ImageMessage from './ImageMessage';
import MessageContent from './MessageContent';
import LogoRenderer, { LogoType } from './LogoRenderer';
import MessageReactions from './MessageReactions';
import MathRenderer from './MathRenderer';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onRemove?: (messageId: string) => void;
  onReaction?: (messageId: string, reactionType: MessageReaction['type']) => void;
  voiceEnabled: boolean;
  voiceSettings?: {
    selectedVoice: string;
    voiceSpeed: number;
    voicePitch: number;
  };
  selectedLogo?: LogoType;
}

// Create a single, shared instance of the VoiceService
const voiceService = new VoiceService();

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  onRegenerate, 
  onRemove,
  onReaction,
  voiceEnabled, 
  voiceSettings,
  selectedLogo
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.type === 'user';
  
  const handleSpeak = async () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsSpeaking(true);
      voiceService.stopSpeaking();
      await voiceService.speak(message.text, {
        voiceName: voiceSettings?.selectedVoice,
        rate: voiceSettings?.voiceSpeed || 1,
        pitch: voiceSettings?.voicePitch || 1,
      });
      setIsSpeaking(false);
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Chat Assistant Response',
        text: message.text,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(message.text);
      alert('Response copied to clipboard!');
    }
  };

  const handleReaction = (reactionType: MessageReaction['type']) => {
    if (onReaction) {
      onReaction(message.id, reactionType);
    }
  };
  return (
    <div id={`message-${message.id}`} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in group`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300'
        }`}>
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <LogoRenderer 
              logoType={selectedLogo || 'logo'}
              className="h-10 w-10 object-cover rounded-full"
            />
          )}
        </div>
        
        <div className={`${isUser ? 'mr-3' : 'ml-3'} flex-1`}>
          <div className={`px-5 py-4 relative transition-all duration-200 hover:scale-[1.02] hover:shadow-xl group/chat-bubble
  ${isUser
    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/50'
    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-700'}
`}>
            <div className="text-[15px] leading-relaxed">
              <MessageContent text={message.text} />
            </div>
            
            {message.imageUrl && (
              <div className="mt-3">
                <ImageMessage
                  imageUrl={message.imageUrl}
                  imagePrompt={message.imagePrompt}
                />
              </div>
            )}
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview
                    key={attachment.id}
                    attachment={attachment}
                    showRemove={false}
                  />
                ))}
              </div>
            )}
            
            {!isUser && (
              <div className="flex items-center justify-end space-x-1 mt-3 opacity-100 md:opacity-0 md:group-hover/chat-bubble:opacity-100 transition-opacity">
                <MessageReactions 
                  reactions={message.reactions}
                  onReaction={handleReaction}
                  isUser={isUser}
                />
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isUser 
                      ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                {voiceEnabled && voiceService.isSpeechSupported() && (
                  <button
                    onClick={handleSpeak}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                      isUser 
                        ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                )}
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                      isUser 
                        ? 'hover:bg-white/20 text-white/80 hover:text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                    title="Regenerate response"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                {onRemove && (
                  <button
                    onClick={() => onRemove(message.id)}
                    className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Remove message"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mt-2 px-2`}>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {!isUser && message.model && (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {getModelDisplayName(message.model)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get user-friendly model names
const getModelDisplayName = (modelKey: string): string => {
  const modelNames: Record<string, string> = {
    'gemini': 'Gemini 1.5 Flash',
    'groq-llama-70b': 'LLaMA 3.3 70B (Groq)',
    'groq-llama-8b': 'LLaMA 3.1 8B (Groq)',
    'groq-mixtral': 'Mixtral 8x7B (Groq)',
    'groq-gemma': 'Gemma 2 9B (Groq)',
    'hf-gemma': 'Gemma 2 2B (Hugging Face)',
    'hf-llama': 'LLaMA 3.1 8B (Hugging Face)',
    'hf-qwen': 'Qwen 2.5 1.5B (Hugging Face)',
    'deepseek': 'DeepSeek V3',
    'grokx': 'Grok 3 Beta (xAI)',
    'perplexity-small-online': 'Perplexity Sonar Small (Online)',
    'perplexity-large-online': 'Perplexity Sonar Large (Online)',
    'perplexity-small': 'Perplexity Sonar Small',
    'perplexity-large': 'Perplexity Sonar Large',
    'perplexity-mixtral': 'Perplexity Mixtral 8x7B',
    'perplexity-codellama': 'Perplexity Code Llama 70B'
  };
  
  return modelNames[modelKey] || modelKey;
};

export default ChatMessage;