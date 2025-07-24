import React from 'react';
import { Bot, MessageCircle, Settings, Menu, User, LogOut } from 'lucide-react';
import { useThemeContext } from './ThemeProvider';
import { User as UserType } from '../types/chat';

interface HeaderProps {
  onSettingsClick: () => void;
  onMenuClick: () => void;
  user?: UserType | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onMenuClick,
  user,
  onSignIn,
  onSignOut
}) => {
  const { settings } = useThemeContext();

  const getGradientClass = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-gradient-to-r from-black to-gray-900 text-white';
      case 'halloween':
        return 'bg-gradient-to-r from-orange-500 to-purple-800 text-white';
      case 'blood-red':
        return 'bg-gradient-to-r from-red-800 to-black text-white';
      case 'cyber-neon':
        return 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white';
      case 'gamer':
        return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      case 'professional':
        return 'bg-gradient-to-r from-slate-500 to-slate-700 text-white';
      case 'monochrome':
        return 'bg-gradient-to-r from-gray-700 to-black text-white';
      default: // This will now apply to 'light' theme
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
    }
  };

  return (
    <header className={`${getGradientClass()} p-4 shadow-lg transition-all duration-300`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuClick}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
            title="Toggle chat history"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="bg-white/20 p-2 rounded-full">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Chat Assistant</h1>
            <p className="text-blue-100 text-sm">Multi-Model AI Chatbot</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-200" />
            <span className="text-sm text-blue-100">Always here to help</span>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-4 w-4 text-blue-200" />
                <span className="text-sm text-blue-100">{user.email}</span>
              </div>
              <button
                onClick={onSignOut}
                className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : onSignIn ? (
            <button
              onClick={onSignIn}
              className="bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors text-sm"
            >
              Sign In
            </button>
          ) : null}
          
          <button
            onClick={onSettingsClick}
            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;