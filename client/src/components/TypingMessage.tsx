import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { Message } from '../types/chat';
import AttachmentPreview from './AttachmentPreview';
import ImageMessage from './ImageMessage';
import MessageContent from './MessageContent';

interface TypingMessageProps {
  message: Message;
  onComplete?: () => void;
  typingSpeed?: number;
}

const TypingMessage: React.FC<TypingMessageProps> = ({ 
  message, 
  onComplete, 
  typingSpeed = 30 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (message.text.length === 0) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < message.text.length) {
        setDisplayedText(message.text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        onComplete?.();
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [message.text, typingSpeed, onComplete]);

  return (
    <div className="flex justify-start mb-6 animate-fade-in group">
      <div className="flex flex-row items-start space-x-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <Bot className="h-4 w-4" />
        </div>
        
        <div className="ml-3 flex-1">
          <div className="px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-md dark:bg-gray-800 dark:text-gray-200 shadow-sm relative">
            <div className="text-sm leading-relaxed">
              <MessageContent text={displayedText} />
              {!isComplete && (
                <span className="inline-block w-2 h-5 bg-gray-600 dark:bg-gray-300 ml-1 animate-pulse" />
              )}
            </div>
            
            {/* Show attachments and images only after typing is complete */}
            {isComplete && (
              <>
                {/* AI Generated Image */}
                {message.imageUrl && (
                  <ImageMessage
                    imageUrl={message.imageUrl}
                    imagePrompt={message.imagePrompt}
                  />
                )}
                
                {/* Attachments */}
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
              </>
            )}
          </div>
          
          <div className="flex justify-start mt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.model && (
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {message.model}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingMessage;