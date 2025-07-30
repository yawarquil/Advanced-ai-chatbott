import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart, Laugh, Eye, Frown, Angry } from 'lucide-react';
import { MessageReaction } from '../types/chat';

interface MessageReactionsProps {
  reactions?: MessageReaction[];
  onReaction: (reactionType: MessageReaction['type']) => void;
  isUser: boolean;
}

const reactionConfig = {
  like: { icon: ThumbsUp, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  dislike: { icon: ThumbsDown, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  love: { icon: Heart, color: 'text-pink-500', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  laugh: { icon: Laugh, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  wow: { icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  sad: { icon: Frown, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  angry: { icon: Angry, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/30' }
};

const MessageReactions: React.FC<MessageReactionsProps> = ({ reactions = [], onReaction, isUser }) => {
  const [showReactions, setShowReactions] = useState(false);

  const getReactionCount = (type: MessageReaction['type']) => {
    const reaction = reactions.find(r => r.type === type);
    return reaction?.count || 0;
  };

  const hasUserReacted = (type: MessageReaction['type']) => {
    const reaction = reactions.find(r => r.type === type);
    return reaction?.userReacted || false;
  };

  const handleReactionClick = (reactionType: MessageReaction['type']) => {
    onReaction(reactionType);
    setShowReactions(false);
  };

  const reactionTypes: MessageReaction['type'][] = ['like', 'dislike', 'love', 'laugh', 'wow', 'sad', 'angry'];

  return (
    <div className="relative">
      {/* Quick reaction button */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
          isUser 
            ? 'hover:bg-white/20 text-white/80 hover:text-white' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
        }`}
        title="Add reaction"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>

      {/* Reaction counts display */}
      {reactions.length > 0 && (
        <div className="flex items-center space-x-1 mt-1">
          {reactions
            .filter(r => r.count > 0)
            .slice(0, 3) // Show max 3 reactions
            .map((reaction) => {
              const config = reactionConfig[reaction.type];
              const Icon = config.icon;
              return (
                <div
                  key={reaction.type}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${
                    reaction.userReacted 
                      ? `${config.bgColor} ${config.color}` 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  onClick={() => handleReactionClick(reaction.type)}
                >
                  <Icon className="h-3 w-3" />
                  <span>{reaction.count}</span>
                </div>
              );
            })}
        </div>
      )}

      {/* Reaction picker popup */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-2 z-50 animate-fade-in">
          <div className="flex items-center space-x-1">
            {reactionTypes.map((type) => {
              const config = reactionConfig[type];
              const Icon = config.icon;
              const isReacted = hasUserReacted(type);
              return (
                <button
                  key={type}
                  onClick={() => handleReactionClick(type)}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-125 ${
                    isReacted 
                      ? `${config.bgColor} ${config.color}` 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showReactions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowReactions(false)}
        />
      )}
    </div>
  );
};

export default MessageReactions; 