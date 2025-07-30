import React from 'react';
import { Bot, MessageCircle, Settings, Menu, User, LogOut, Share2, Search, Upload } from 'lucide-react';
import { useThemeContext } from './ThemeProvider';
import { User as UserType } from '../types/chat';
import LogoRenderer from './LogoRenderer';

interface HeaderProps {
  onSettingsClick: () => void;
  onMenuClick: () => void;
  onShareConversation?: () => void;
  onSearchClick?: () => void;
  onUploadClick?: () => void;
  user?: UserType | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onSettingsClick,
  onMenuClick,
<<<<<<< HEAD
  onShareConversation,
  onSearchClick,
  onUploadClick,
=======
>>>>>>> f7dc412a6d89a8d828bb18be3371608babce890d
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
<<<<<<< HEAD
    <header className="relative backdrop-blur-xl bg-gradient-to-r from-slate-900/40 via-purple-900/30 to-slate-900/40 dark:from-gray-900/60 dark:via-indigo-900/40 dark:to-gray-900/60 shadow-2xl rounded-3xl mx-2 sm:mx-3 mt-2 sm:mt-3 mb-3 sm:mb-6 px-3 sm:px-8 py-2 sm:py-4 flex items-center justify-between border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-3xl group overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/20 to-cyan-600/10 opacity-50 animate-pulse rounded-3xl"></div>
      
      <div className="relative flex items-center space-x-2 sm:space-x-6">
        <button
          onClick={onMenuClick}
          className="relative group/logo touch-manipulation"
          title="Toggle chat history"
        >
          <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-20 blur animate-pulse group-hover/logo:opacity-40 transition-opacity duration-300"></div>
          <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 overflow-hidden group-hover/logo:shadow-3xl">
            <LogoRenderer 
              logoType={settings.selectedLogo || 'logo'}
              className="h-10 w-10 sm:h-14 sm:w-14"
            />
=======
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
>>>>>>> f7dc412a6d89a8d828bb18be3371608babce890d
          </div>
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center space-x-1 sm:space-x-3">
            <h1 className="text-lg sm:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-200 via-white to-slate-300 dark:from-white dark:via-gray-100 dark:to-slate-200 bg-clip-text text-transparent flex items-center gap-1 sm:gap-2">
              <span>Nexus</span>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-white px-1 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg animate-bounce">AI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-gray-400 font-semibold tracking-wide truncate">
              <span className="hidden sm:inline">Advanced AI Intelligence System</span>
              <span className="sm:hidden">AI Assistant</span>
            </p>
            <div className="hidden sm:flex items-center space-x-1 bg-slate-800/30 dark:bg-gray-800/50 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-cyan-300 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-3 bg-slate-800/20 dark:bg-gray-800/30 px-4 py-2 rounded-2xl backdrop-blur-sm">
          <MessageCircle className="h-5 w-5 text-blue-400 dark:text-blue-300 animate-pulse" />
          <span className="text-sm text-slate-300 dark:text-gray-300 font-medium">Ready to assist</span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/70 dark:from-gray-700/60 dark:to-gray-800/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:from-slate-600/60 hover:to-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/search touch-manipulation header-button"
              title="Search conversations"
            >
              <Search className="h-4 w-4 text-slate-300 dark:text-gray-300 group-hover/search:text-green-300 transition-colors" />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 group-hover/search:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
          {onUploadClick && (
            <button
              onClick={onUploadClick}
              className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/70 dark:from-gray-700/60 dark:to-gray-800/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:from-slate-600/60 hover:to-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/upload touch-manipulation header-button"
              title="Upload file"
            >
              <Upload className="h-4 w-4 text-slate-300 dark:text-gray-300 group-hover/upload:text-orange-300 transition-colors" />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
          {onShareConversation && (
            <button
              onClick={onShareConversation}
              className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/70 dark:from-gray-700/60 dark:to-gray-800/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:from-slate-600/60 hover:to-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/share touch-manipulation header-button"
              title="Share conversation"
            >
              <Share2 className="h-4 w-4 text-slate-300 dark:text-gray-300 group-hover/share:text-blue-300 transition-colors" />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover/share:opacity-100 transition-opacity duration-300"></div>
            </button>
          )}
          
          <button
            onClick={onSettingsClick}
            className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/70 dark:from-gray-700/60 dark:to-gray-800/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:from-slate-600/60 hover:to-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/settings touch-manipulation header-button"
            title="Settings"
          >
            <Settings className="h-4 w-4 text-slate-300 dark:text-gray-300 group-hover/settings:text-purple-300 transition-colors" />
            <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover/settings:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          {user ? (
            <div className="flex items-center space-x-1 sm:space-x-3 ml-1 sm:ml-3">
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/30 dark:bg-gray-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-slate-300 dark:text-gray-300 font-medium max-w-20 sm:max-w-32 truncate">{user.email}</span>
              </div>
              <div className="md:hidden w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <button
                onClick={onSignOut}
                className="relative bg-gradient-to-br from-red-600/60 to-red-700/80 p-2 sm:p-2.5 rounded-lg sm:rounded-xl hover:from-red-500/70 hover:to-red-600/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/logout touch-manipulation header-button"
                title="Sign out"
              >
                <LogOut className="h-4 w-4 text-red-100 group-hover/logout:text-white transition-colors" />
              </button>
            </div>
          ) : onSignIn ? (
            <button
              onClick={onSignIn}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transform hover:scale-105 ml-1 sm:ml-3 touch-manipulation header-login-button"
            >
              <span className="hidden xs:inline">Sign In</span>
              <span className="xs:hidden">Login</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;