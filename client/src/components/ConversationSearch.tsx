import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MessageCircle, Clock, FileText } from 'lucide-react';
import { Conversation, Message } from '../types/chat';

interface ConversationSearchProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onSelectMessage: (conversationId: string, messageId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  type: 'conversation' | 'message';
  conversation: Conversation;
  message?: Message;
  relevance: number;
  preview: string;
}

const ConversationSearch: React.FC<ConversationSearchProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onSelectMessage,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search through conversations
    conversations.forEach(conversation => {
      // Search in conversation title
      if (conversation.title.toLowerCase().includes(query)) {
        results.push({
          type: 'conversation',
          conversation,
          relevance: 10,
          preview: conversation.title
        });
      }

      // Search in messages
      conversation.messages.forEach(message => {
        if (message.text.toLowerCase().includes(query)) {
          const preview = message.text.length > 100 
            ? message.text.substring(0, 100) + '...' 
            : message.text;
          
          results.push({
            type: 'message',
            conversation,
            message,
            relevance: message.text.toLowerCase().indexOf(query),
            preview
          });
        }
      });
    });

    // Sort by relevance
    results.sort((a, b) => a.relevance - b.relevance);
    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setSelectedIndex(0);
  }, [searchQuery, conversations]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      e.preventDefault();
      const selectedResult = searchResults[selectedIndex];
      if (selectedResult) {
        if (selectedResult.type === 'conversation') {
          onSelectConversation(selectedResult.conversation);
        } else if (selectedResult.message) {
          onSelectMessage(selectedResult.conversation.id, selectedResult.message.id);
        }
        onClose();
      }
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'conversation') {
      onSelectConversation(result.conversation);
    } else if (result.message) {
      onSelectMessage(result.conversation.id, result.message.id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Search Header */}
        <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search conversations and messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto">
          {searchResults.length === 0 && searchQuery && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found for "{searchQuery}"
            </div>
          )}
          
          {searchResults.map((result, index) => (
            <div
              key={`${result.type}-${result.conversation.id}-${result.message?.id || ''}`}
              onClick={() => handleResultClick(result)}
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              } ${result.conversation.id === currentConversationId ? 'border-l-4 border-blue-500' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {result.type === 'conversation' ? (
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-green-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {result.conversation.title}
                    </span>
                    {result.conversation.id === currentConversationId && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {result.preview}
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {result.type === 'conversation' 
                        ? result.conversation.updatedAt.toLocaleDateString()
                        : result.message?.timestamp.toLocaleDateString()
                      }
                    </span>
                    {result.type === 'message' && (
                      <>
                        <span>•</span>
                        <span>{result.message?.type === 'user' ? 'You' : 'AI'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search Tips */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">Tip:</span> Use ↑↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationSearch; 