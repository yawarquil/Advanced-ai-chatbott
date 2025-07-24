import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff, Paperclip, X, Image, Wrench, Square } from 'lucide-react';
import { VoiceService } from '../services/voiceService';
import { FileService } from '../services/fileService';
import { ImageService } from '../services/imageService';
import { Attachment } from '../types/chat';
import AttachmentPreview from './AttachmentPreview';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: Attachment[], generateImage?: boolean) => void;
  isLoading: boolean;
  isGeneratingImage?: boolean;
  voiceEnabled: boolean;
  imageGeneration: boolean;
  onStopGeneration: () => void;
  isTyping: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  isGeneratingImage = false,
  voiceEnabled, 
  imageGeneration,
  onStopGeneration,
  isTyping,
}) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceService = useRef(new VoiceService());
  const fileService = useRef(new FileService());
  const imageService = useRef(new ImageService());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !isLoading) {
      const shouldGenerateImage = imageGeneration && imageService.current.isImageGenerationPrompt(message.trim());
      onSendMessage(message.trim(), attachments, shouldGenerateImage);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleImageGeneration = () => {
    if (message.trim() && !isLoading) {
      const button = document.querySelector('[title="Generate image"]') as HTMLButtonElement;
      if (button) {
        button.classList.add('animate-pulse');
        setTimeout(() => button.classList.remove('animate-pulse'), 1000);
      }
      
      onSendMessage(message.trim(), attachments, true);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      voiceService.current.stopListening();
      setIsListening(false);
      return;
    }

    if (!voiceService.current.isRecognitionSupported()) {
      alert('Voice input is not supported in this browser. Please try Chrome or Edge.');
      return;
    }

    try {
      setIsListening(true);
      const transcript = await voiceService.current.startListening();
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    } catch (error) {
      console.error('Voice input error:', error);
      alert((error as Error).message);
      setIsListening(false);
    }
  };

  const handleFileSelect = async (files: FileList) => {
    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      try {
        const attachment = await fileService.current.processFile(files[i]);
        newAttachments.push(attachment);
      } catch (error) {
        alert(`Error processing ${files[i].name}: ${(error as Error).message}`);
      }
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const toolButtons = (
    <>
      {voiceEnabled && voiceService.current.isRecognitionSupported() && (
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={isLoading || isTyping}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-500/10"
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
      )}
      {imageGeneration && (
        <button
          type="button"
          onClick={handleImageGeneration}
          disabled={!message.trim() || isLoading || isTyping || isGeneratingImage}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-500/10"
          title="Generate image"
        >
          {isGeneratingImage ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Image className="h-5 w-5" />}
        </button>
      )}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading || isTyping}
        className="p-2 rounded-full text-gray-500 hover:bg-gray-500/10"
        title="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </button>
    </>
  );

  return (
    <div 
      className={`p-2 sm:p-4 transition-colors ${
        isDragOver ? 'bg-gray-500/10' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="max-w-4xl mx-auto">
        {attachments.length > 0 && (
          <div className="mb-2 sm:mb-4">
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <AttachmentPreview
                  key={attachment.id}
                  attachment={attachment}
                  onRemove={() => removeAttachment(attachment.id)}
                  showRemove={true}
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3 bg-gray-500/10 p-2 rounded-full border border-transparent focus-within:border-gray-500/30">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 w-full px-3 py-1 bg-transparent focus:outline-none resize-none min-h-[32px] max-h-32 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 hide-scrollbar"
            rows={1}
            disabled={isLoading || isTyping}
          />
          
          <div className="flex items-center space-x-1">
            {toolButtons}
            {isLoading || isTyping ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-500/10"
                title="Stop generation"
              >
                <Square className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim() && attachments.length === 0}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-500/10 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          A.I can make mistakes, so double-check it
        </p>
      </div>
    </div>
  );
};

export default ChatInput;