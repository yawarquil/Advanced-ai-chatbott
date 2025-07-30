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
<<<<<<< HEAD
          ? 'relative h-full w-80 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border-primary)]/30 flex flex-col shadow-2xl' 
          : `fixed left-0 top-0 h-full w-80 bg-[var(--bg-secondary)]/90 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 z-50 flex flex-col border-r border-[var(--border-primary)]/30 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
      }`}>
        {/* Modern Header with Glassmorphism */}
        <div className="relative p-6 border-b border-[var(--border-primary)]/20 bg-gradient-to-r from-[var(--bg-primary)]/10 to-[var(--bg-secondary)]/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-[var(--border-primary)]/20">
                <MessageSquare className="h-5 w-5 text-[var(--text-primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Conversations</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">Chat History</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNewConversation}
                className="relative group p-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-[var(--border-primary)]/20"
                title="New conversation"
              >
                <Plus className="h-4 w-4 text-[var(--text-primary)] group-hover:text-blue-400 transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={onClose}
                className={`relative group p-2.5 bg-gradient-to-br from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-[var(--border-primary)]/20 ${
                  isDesktop ? 'hidden' : ''
                }`}
              >
                <X className="h-4 w-4 text-[var(--text-primary)] group-hover:text-red-400 transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto sidebar-conversations p-1">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[var(--border-primary)]/20">
                <MessageSquare className="h-8 w-8 text-[var(--text-secondary)] opacity-60" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] font-medium">No conversations yet</p>
              <p className="text-xs text-[var(--text-secondary)]/70 mt-1">Start a new conversation to begin</p>
=======
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
>>>>>>> f7dc412a6d89a8d828bb18be3371608babce890d
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                    currentConversationId === conversation.id
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 shadow-lg backdrop-blur-sm ring-1 ring-blue-400/20'
                      : 'bg-[var(--bg-primary)]/30 hover:bg-[var(--bg-primary)]/50 border border-[var(--border-primary)]/20 hover:border-[var(--border-primary)]/40 backdrop-blur-sm hover:shadow-lg'
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
<<<<<<< HEAD
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate leading-5">{conversation.title}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 leading-4">{getConversationPreview(conversation)}</p>
                      <div className="flex items-center mt-3 text-xs text-[var(--text-secondary)]/70">
                        <div className="w-3 h-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center mr-2">
                          <Calendar className="h-2 w-2" />
                        </div>
                        <span className="font-medium">{formatDate(conversation.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); onShareConversation(conversation.id); }}
                        className="relative p-2 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 border border-blue-400/20"
                        title="Share conversation"
                      >
                        <Share2 className="h-3 w-3 text-blue-400 group-hover:text-blue-300" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteConversation(conversation.id); }}
                        className="relative p-2 bg-gradient-to-br from-red-500/10 to-pink-500/10 hover:from-red-500/20 hover:to-pink-500/20 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 border border-red-400/20"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-3 w-3 text-red-400 group-hover:text-red-300" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
=======
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
>>>>>>> f7dc412a6d89a8d828bb18be3371608babce890d
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