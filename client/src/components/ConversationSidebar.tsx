import React from 'react';
import { X, Plus, MessageSquare, Trash2, Calendar, Share2 } from 'lucide-react';
import { Conversation } from '../types/chat';

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onShareConversation: (conversationId: string) => void;
  isDesktop?: boolean;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  isOpen,
  onClose,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onShareConversation,
  isDesktop = false,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getConversationPreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return 'New conversation';
    return lastMessage.text.length > 50 
      ? lastMessage.text.substring(0, 50) + '...'
      : lastMessage.text;
  };

  return (
    <>
      {isOpen && !isDesktop && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      <div className={`${
        isDesktop 
          ? 'relative h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col' 
          : `fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-50 flex flex-col ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Conversations</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewConversation}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="New conversation"
            >
              <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors ${
                isDesktop ? 'hidden' : ''
              }`}
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-conversations">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    currentConversationId === conversation.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{conversation.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{getConversationPreview(conversation)}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(conversation.updatedAt)}
                      </div>
                    </div>
                    <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => { e.stopPropagation(); onShareConversation(conversation.id); }}
                        className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                        title="Share conversation"
                      >
                        <Share2 className="h-3 w-3 text-blue-500" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteConversation(conversation.id); }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConversationSidebar;