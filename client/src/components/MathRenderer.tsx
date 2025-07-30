import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  content: string;
  isBlock?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content, isBlock = false }) => {
  // Function to detect if content contains LaTeX
  const containsLatex = (text: string): boolean => {
    // Check for inline math: $...$ or \(...\)
    const inlineMathRegex = /\$[^$\n]+\$|\\\([^)]+\\\)/;
    // Check for block math: $$...$$ or \[...\]
    const blockMathRegex = /\$\$[^$]+\$\$|\\\[[^\]]+\\\]/;
    
    return inlineMathRegex.test(text) || blockMathRegex.test(text);
  };

  // Function to render content with LaTeX
  const renderWithLatex = (text: string) => {
    if (!containsLatex(text)) {
      return <span>{text}</span>;
    }

    // Split by LaTeX delimiters
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$\n]+\$|\\\[[^\]]+\\\]|\\\([^)]+\\\))/);
    
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Block math
        const math = part.slice(2, -2);
        return (
          <BlockMath key={index} math={math} />
        );
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math
        const math = part.slice(1, -1);
        return (
          <InlineMath key={index} math={math} />
        );
      } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
        // Block math with \[...\]
        const math = part.slice(2, -2);
        return (
          <BlockMath key={index} math={math} />
        );
      } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
        // Inline math with \(...\)
        const math = part.slice(2, -2);
        return (
          <InlineMath key={index} math={math} />
        );
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  return (
    <div className="math-content">
      {renderWithLatex(content)}
    </div>
  );
};

export default MathRenderer; 