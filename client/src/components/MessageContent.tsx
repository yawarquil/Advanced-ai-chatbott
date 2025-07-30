import React from 'react';
import CodeBlock from './CodeBlock';
import MathRenderer from './MathRenderer';

interface MessageContentProps {
  text: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ text }) => {
  // Parse message content to extract code blocks and markdown
  const parseContent = (content: string) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    
    let lastIndex = 0;
    let match;

    // Find code blocks
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        parts.push({ type: 'text', content: textBefore });
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push({ type: 'code', content: code, language });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return parts;
  };

  // Process markdown formatting in text parts
  const processMarkdown = (text: string) => {
    // Split by lines to handle headings and lists
    const lines = text.split('\n');
    const processedLines = lines.map((line, lineIndex) => {
      // Headings
      if (line.match(/^#{1,6}\s/)) {
        const level = line.match(/^(#{1,6})\s/)?.[1].length || 1;
        const content = line.replace(/^#{1,6}\s/, '');
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={lineIndex}
            className={`font-bold text-[var(--text-primary)] mb-2 mt-4 ${
              level === 1 ? 'text-2xl' :
              level === 2 ? 'text-xl' :
              level === 3 ? 'text-lg' :
              level === 4 ? 'text-base' :
              level === 5 ? 'text-sm' : 'text-xs'
            }`}
          >
            {processInlineMarkdown(content)}
          </HeadingTag>
        );
      }

      // Bullet points
      if (line.match(/^[\s]*[-*+]\s/)) {
        const content = line.replace(/^[\s]*[-*+]\s/, '');
        return (
          <li key={lineIndex} className="ml-4 mb-1 text-[var(--text-primary)]">
            {processInlineMarkdown(content)}
          </li>
        );
      }

      // Numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        const content = line.replace(/^[\s]*\d+\.\s/, '');
        return (
          <li key={lineIndex} className="ml-4 mb-1 text-[var(--text-primary)]">
            {processInlineMarkdown(content)}
          </li>
        );
      }

      // Empty lines
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }

      // Regular text
      return (
                  <span key={lineIndex} className="whitespace-pre-wrap text-[var(--text-primary)]">
          {processInlineMarkdown(line)}
        </span>
      );
    });

    // Group consecutive list items
    const groupedLines = [];
    let currentList = [];
    let inList = false;

    for (const line of processedLines) {
      if (line.type === 'li') {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line);
      } else {
        if (inList && currentList.length > 0) {
          groupedLines.push(
            <ul key={`list-${groupedLines.length}`} className="list-disc list-inside mb-3 space-y-1 text-[var(--text-primary)]">
              {currentList}
            </ul>
          );
          currentList = [];
          inList = false;
        }
        groupedLines.push(line);
      }
    }

    // Handle list at the end
    if (inList && currentList.length > 0) {
      groupedLines.push(
        <ul key={`list-${groupedLines.length}`} className="list-disc list-inside mb-3 space-y-1 text-[var(--text-primary)]">
          {currentList}
        </ul>
      );
    }

    return groupedLines;
  };

  // Process inline markdown (bold, italic, links, inline code, math)
  const processInlineMarkdown = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    
    // Check for LaTeX math first (block math: $$...$$ or \[...\])
    const blockMathRegex = /\$\$([^$]+)\$\$|\\\[([^\]]+)\\\]/g;
    let match;
    
    while ((match = blockMathRegex.exec(text)) !== null) {
      // Add text before math
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add block math
      const mathContent = match[1] || match[2];
      parts.push({
        type: 'block-math',
        content: mathContent
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    // Process each part for inline math and other formatting
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return processInlineMathAndFormatting(part.content, index);
      } else if (part.type === 'block-math') {
        return (
          <div key={index} className="my-4">
            <MathRenderer content={`$${part.content}$`} isBlock={true} />
          </div>
        );
      }
      return null;
    });
  };

  // Process inline math and other formatting
  const processInlineMathAndFormatting = (text: string, baseKey: string | number) => {
    const parts = [];
    let lastIndex = 0;
    
    // Check for inline LaTeX math ($...$ or \(...\))
    const inlineMathRegex = /\$([^$\n]+)\$|\\\(([^)]+)\\\)/g;
    let match;
    
    while ((match = inlineMathRegex.exec(text)) !== null) {
      // Add text before math
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add inline math
      const mathContent = match[1] || match[2];
      parts.push({
        type: 'inline-math',
        content: mathContent
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    // Process each part for other formatting
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return processBoldAndItalic(part.content, `${baseKey}-text-${index}`);
      } else if (part.type === 'inline-math') {
        return (
          <MathRenderer key={`${baseKey}-math-${index}`} content={`$${part.content}$`} isBlock={false} />
        );
      }
      return null;
    });
  };

  // Process bold and italic formatting
  const processBoldAndItalic = (text: string, baseKey: string | number) => {
    const parts = [];
    let lastIndex = 0;
    
    // Bold text: **text** or __text__
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add bold text
      const boldContent = match[1] || match[2];
      parts.push({
        type: 'bold',
        content: boldContent
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    // Process italic and inline code in each part
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return processInlineCodeAndItalic(part.content, `${baseKey}-text-${index}`);
      } else if (part.type === 'bold') {
        return (
          <strong key={`${baseKey}-bold-${index}`} className="font-bold text-[var(--text-primary)]">
            {processInlineCodeAndItalic(part.content, `${baseKey}-bold-${index}`)}
          </strong>
        );
      }
      return null;
    });
  };

  // Process inline code and italic text
  const processInlineCodeAndItalic = (text: string, baseKey: string | number) => {
    const parts = [];
    let lastIndex = 0;
    
    // Inline code: `code`
    const inlineCodeRegex = /`([^`]+)`/g;
    let match;
    
    while ((match = inlineCodeRegex.exec(text)) !== null) {
      // Add text before inline code
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        parts.push({
          type: 'text',
          content: textBefore
        });
      }

      // Add inline code
      parts.push({
        type: 'inline-code',
        content: match[1]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    // Process italic in each part
    return parts.map((part, index) => {
      if (part.type === 'text') {
        return processItalic(part.content, `${baseKey}-text-${index}`);
      } else if (part.type === 'inline-code') {
        return (
          <code
            key={`${baseKey}-code-${index}`}
            className="bg-[var(--bg-secondary)] text-[var(--text-primary)] px-1.5 py-0.5 rounded text-sm font-mono border border-[var(--border-primary)]"
          >
            {part.content}
          </code>
        );
      }
      return null;
    });
  };

  // Process italic text
  const processItalic = (text: string, baseKey: string | number) => {
    const parts = [];
    let lastIndex = 0;
    
    // Italic text: *text* or _text_
    const italicRegex = /\*(.*?)\*|_(.*?)_/g;
    let match;
    
    while ((match = italicRegex.exec(text)) !== null) {
      // Add text before italic
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add italic text
      const italicContent = match[1] || match[2];
      parts.push({
        type: 'italic',
        content: italicContent
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'text') {
        return (
                      <span key={`${baseKey}-${index}`} className="text-[var(--text-primary)]">
            {part.content}
          </span>
        );
      } else if (part.type === 'italic') {
        return (
                      <em key={`${baseKey}-${index}`} className="italic text-[var(--text-secondary)]">
            {part.content}
          </em>
        );
      }
      return null;
    });
  };

  const contentParts = parseContent(text);

  return (
          <div className="prose prose-sm max-w-none text-[var(--text-primary)]">
      {contentParts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={part.content}
              language={part.language}
            />
          );
        } else if (part.type === 'text') {
          return (
            <div key={index} className="mb-2">
              {processMarkdown(part.content)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default MessageContent;