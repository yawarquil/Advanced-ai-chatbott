import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, LogIn, UserPlus, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  isLoading,
  error,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && password !== confirmPassword) {
      return;
    }

    try {
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
    } catch (error) {
      // Error is handled by parent component
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20 dark:border-gray-700/50 relative auth-modal">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/20 to-cyan-600/10 opacity-50 animate-pulse rounded-3xl"></div>
        
        <div className="relative flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-gradient-to-r from-slate-900/40 via-purple-900/30 to-slate-900/40 dark:from-gray-900/60 dark:via-indigo-900/40 dark:to-gray-900/60">
          <div className="flex items-center space-x-3">
            <div className="relative bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 rounded-full shadow-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300 overflow-hidden">
              {isSignUp ? 
                <UserPlus className="h-5 w-5 text-white" /> :
                <LogIn className="h-5 w-5 text-white" />
              }
            </div>
            <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-200 via-white to-slate-300 dark:from-white dark:via-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/70 dark:from-gray-700/60 dark:to-gray-800/80 p-2 rounded-full hover:from-slate-600/60 hover:to-slate-700/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group/close touch-manipulation"
          >
            <X className="h-4 w-4 text-slate-300 dark:text-gray-300 group-hover/close:text-white transition-colors" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 opacity-0 group-hover/close:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-3 shadow-md animate-fadeIn">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-red-700 dark:text-red-400 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors duration-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md transition-all duration-300"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md transition-all duration-300"
                    placeholder="Confirm your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              {password !== confirmPassword && confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> Passwords do not match
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || (isSignUp && password !== confirmPassword)}
            className="relative w-full mt-6 group overflow-hidden"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 animate-gradient-x transition duration-300 group-disabled:opacity-50"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01] group-disabled:opacity-50 group-disabled:cursor-not-allowed">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Please wait...</span>
                </>
              ) : (
                <span className="font-bold flex items-center">
                  {isSignUp ? (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </span>
              )}
            </div>
          </button>

          <div className="text-center mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={switchMode}
              className="mt-4 text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm font-medium transition-colors duration-300 flex items-center justify-center mx-auto bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 px-4 py-2 rounded-full"
            >
              {isSignUp 
                ? (
                  <>
                    <LogIn className="h-3.5 w-3.5 mr-2" />
                    Already have an account? Sign in
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5 mr-2" />
                    Don't have an account? Sign up
                  </>
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;