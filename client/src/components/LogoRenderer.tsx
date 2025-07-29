import React from 'react';
import { Bot } from 'lucide-react';

export type LogoType = 'logo' | 'logo2' | 'logo3' | 'logo4';

interface LogoRendererProps {
  logoType?: LogoType;
  className?: string;
  style?: React.CSSProperties;
  onError?: () => void;
}

const LogoRenderer: React.FC<LogoRendererProps> = ({ 
  logoType = 'logo', 
  className = "h-14 w-14 drop-shadow-lg",
  style,
  onError 
}) => {
  const logoSrc = `./assets/${logoType}.gif`;
  
  return (
    <div className="relative">
      <img 
        src={logoSrc}
        alt="Nexus AI Logo" 
        className={`${className} object-cover rounded-xl`}
        style={{ filter: 'brightness(1.1) contrast(1.1)', ...style }}
        onError={(e) => {
          console.log(`GIF loading error for ${logoType}, using fallback`);
          if (onError) onError();
          // Fallback to Bot icon if GIF fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <Bot className={`${className} text-white hidden`} style={style} />
    </div>
  );
};

export default LogoRenderer; 