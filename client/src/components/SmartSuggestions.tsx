import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, MessageSquare, Calculator, FileText, Image, Code, X } from 'lucide-react';

interface SmartSuggestionsProps {
  messages: Array<{ type: 'user' | 'ai'; text: string }>;
  onSuggestionClick: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface Suggestion {
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  description: string;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  messages,
  onSuggestionClick,
  isVisible,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Analyze conversation context and generate suggestions
  useEffect(() => {
    if (!isVisible || messages.length === 0) {
      setSuggestions([]);
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const conversationText = messages.map(m => m.text).join(' ').toLowerCase();
    
    const newSuggestions: Suggestion[] = [];

    // Math-related suggestions
    if (conversationText.includes('math') || conversationText.includes('equation') || 
        conversationText.includes('calculate') || conversationText.includes('formula')) {
      newSuggestions.push({
        text: 'Can you help me solve this equation: $x^2 + 5x + 6 = 0$?',
        icon: Calculator,
        category: 'Math',
        description: 'Solve quadratic equations'
      });
      newSuggestions.push({
        text: 'What is the derivative of $f(x) = x^3 + 2x^2 - 5x + 1$?',
        icon: Calculator,
        category: 'Math',
        description: 'Calculate derivatives'
      });
    }

    // Code-related suggestions
    if (conversationText.includes('code') || conversationText.includes('program') || 
        conversationText.includes('function') || conversationText.includes('algorithm')) {
      newSuggestions.push({
        text: 'Can you explain this code snippet and suggest improvements?',
        icon: Code,
        category: 'Programming',
        description: 'Code review and optimization'
      });
      newSuggestions.push({
        text: 'Write a function to sort an array of numbers',
        icon: Code,
        category: 'Programming',
        description: 'Algorithm implementation'
      });
    }

    // Document analysis suggestions
    if (conversationText.includes('document') || conversationText.includes('file') || 
        conversationText.includes('pdf') || conversationText.includes('text')) {
      newSuggestions.push({
        text: 'Can you analyze this document and extract key points?',
        icon: FileText,
        category: 'Document',
        description: 'Document analysis and summarization'
      });
      newSuggestions.push({
        text: 'Summarize the main ideas from this text',
        icon: FileText,
        category: 'Document',
        description: 'Text summarization'
      });
    }

    // Image analysis suggestions
    if (conversationText.includes('image') || conversationText.includes('picture') || 
        conversationText.includes('photo') || conversationText.includes('visual')) {
      newSuggestions.push({
        text: 'Can you describe what you see in this image?',
        icon: Image,
        category: 'Image',
        description: 'Image analysis and description'
      });
      newSuggestions.push({
        text: 'What objects and people are in this picture?',
        icon: Image,
        category: 'Image',
        description: 'Object detection and recognition'
      });
    }

    // General conversation suggestions
    if (newSuggestions.length === 0) {
      newSuggestions.push({
        text: 'Can you explain this concept in simpler terms?',
        icon: MessageSquare,
        category: 'General',
        description: 'Simplified explanation'
      });
      newSuggestions.push({
        text: 'What are some practical examples of this?',
        icon: Lightbulb,
        category: 'General',
        description: 'Real-world applications'
      });
      newSuggestions.push({
        text: 'Can you provide more details about this topic?',
        icon: Sparkles,
        category: 'General',
        description: 'Detailed information'
      });
    }

    // Limit to 3 suggestions
    setSuggestions(newSuggestions.slice(0, 3));
  }, [messages, isVisible]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Smart Suggestions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close smart suggestions"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion.text)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {suggestion.text}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestions;