import { useEffect } from 'react';
import { Settings } from '../types/chat';

export const useTheme = (settings: Settings) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all possible theme classes to prevent conflicts
    root.classList.remove(
      'theme-light', 
      'theme-dark', 
      'theme-halloween', 
      'theme-blood-red', 
      'theme-cyber-neon', 
      'theme-gamer', 
      'theme-professional', 
      'theme-monochrome'
    );
    
    // Add the currently selected theme class
    if (settings.theme) {
      root.classList.add(`theme-${settings.theme}`);
    }
    
    // Update the meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors: { [key: string]: string } = {
        light: '#ffffff',
        dark: '#1f2937',
        halloween: '#1a0123',
        'blood-red': '#1a0000',
        'cyber-neon': '#1a0123',
        'gamer': '#1f2937',
        'professional': '#f8fafc',
        'monochrome': '#000000',
      };
      metaThemeColor.setAttribute('content', colors[settings.theme as keyof typeof colors] || '#ffffff');
    }
  }, [settings.theme]);
};