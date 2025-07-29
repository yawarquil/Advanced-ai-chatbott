import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Detect language from code content if not provided
  const detectLanguage = (code: string): string => {
    if (code.includes('import ') || code.includes('export ') || code.includes('const ') || code.includes('function ')) {
      if (code.includes('<') && code.includes('>')) return 'jsx';
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ') && code.includes('from ')) return 'python';
    if (code.includes('#include') || code.includes('int main')) return 'cpp';
    if (code.includes('public class') || code.includes('System.out')) return 'java';
    if (code.includes('SELECT') || code.includes('CREATE TABLE')) return 'sql';
    if (code.includes('<!DOCTYPE') || code.includes('<html')) return 'html';
    if (code.includes('{') && code.includes('}') && code.includes(':')) return 'css';
    return 'text';
  };

  const detectedLanguage = language === 'javascript' ? detectLanguage(code) : language;

  return (
    <div className="relative bg-gray-900 rounded-2xl overflow-hidden my-4 border border-gray-700/50 shadow-2xl shadow-black/20 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-800/90 to-gray-700/90 border-b border-gray-600/30 backdrop-blur-sm">
        <span className="text-sm text-gray-200 font-semibold capitalize tracking-wide">
          {detectedLanguage}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-black/20"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span className="font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={detectedLanguage}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            borderRadius: '0 0 1rem 1rem',
          }}
          showLineNumbers={code.split('\n').length > 5}
          lineNumberStyle={{
            color: '#6b7280',
            paddingRight: '1.25rem',
            minWidth: '2.5rem',
            opacity: 0.7,
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;