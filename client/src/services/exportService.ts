import { Conversation, Message } from '../types/chat';

export type ExportFormat = 'json' | 'txt' | 'md' | 'html' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  includeTimestamps?: boolean;
  includeReactions?: boolean;
  includeAttachments?: boolean;
}

export class ExportService {
  private formatConversationToText(conversation: Conversation, options: ExportOptions): string {
    let content = `# ${conversation.title}\n\n`;
    
    if (options.includeMetadata) {
      content += `**Created:** ${conversation.createdAt.toLocaleString()}\n`;
      content += `**Last Updated:** ${conversation.updatedAt.toLocaleString()}\n\n`;
    }
    
    content += `---\n\n`;
    
    conversation.messages.forEach((message, index) => {
      const sender = message.type === 'user' ? 'You' : 'AI';
      const timestamp = options.includeTimestamps 
        ? ` (${message.timestamp.toLocaleTimeString()})` 
        : '';
      
      content += `**${sender}${timestamp}:**\n`;
      content += `${message.text}\n\n`;
      
      // Include reactions if enabled
      if (options.includeReactions && message.reactions && message.reactions.length > 0) {
        const reactions = message.reactions
          .map(r => `${r.type}: ${r.count}`)
          .join(', ');
        content += `*Reactions: ${reactions}*\n\n`;
      }
      
      // Include attachments if enabled
      if (options.includeAttachments && message.attachments && message.attachments.length > 0) {
        message.attachments.forEach(attachment => {
          content += `*Attachment: ${attachment.name} (${attachment.type}, ${this.formatFileSize(attachment.size)})*\n`;
        });
        content += '\n';
      }
      
      if (index < conversation.messages.length - 1) {
        content += `---\n\n`;
      }
    });
    
    return content;
  }

  private formatConversationToHTML(conversation: Conversation, options: ExportOptions): string {
    let content = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${conversation.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .message { margin: 20px 0; padding: 15px; border-radius: 10px; }
        .user { background: #e3f2fd; border-left: 4px solid #2196f3; }
        .ai { background: #f3e5f5; border-left: 4px solid #9c27b0; }
        .timestamp { font-size: 0.8em; color: #666; margin-bottom: 5px; }
        .reactions { font-size: 0.8em; color: #888; margin-top: 5px; }
        .attachments { font-size: 0.8em; color: #888; margin-top: 5px; }
        .metadata { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
        hr { border: none; border-top: 1px solid #eee; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>${conversation.title}</h1>
`;
    
    if (options.includeMetadata) {
      content += `
    <div class="metadata">
        <strong>Created:</strong> ${conversation.createdAt.toLocaleString()}<br>
        <strong>Last Updated:</strong> ${conversation.updatedAt.toLocaleString()}
    </div>
`;
    }
    
    conversation.messages.forEach((message, index) => {
      const sender = message.type === 'user' ? 'You' : 'AI';
      const messageClass = message.type === 'user' ? 'user' : 'ai';
      
      content += `
    <div class="message ${messageClass}">
`;
      
      if (options.includeTimestamps) {
        content += `        <div class="timestamp">${message.timestamp.toLocaleString()}</div>\n`;
      }
      
      content += `        <strong>${sender}:</strong><br>\n`;
      content += `        ${this.escapeHtml(message.text)}\n`;
      
      // Include reactions if enabled
      if (options.includeReactions && message.reactions && message.reactions.length > 0) {
        const reactions = message.reactions
          .map(r => `${r.type}: ${r.count}`)
          .join(', ');
        content += `        <div class="reactions">Reactions: ${reactions}</div>\n`;
      }
      
      // Include attachments if enabled
      if (options.includeAttachments && message.attachments && message.attachments.length > 0) {
        content += `        <div class="attachments">`;
        message.attachments.forEach(attachment => {
          content += `Attachment: ${attachment.name} (${attachment.type}, ${this.formatFileSize(attachment.size)})<br>`;
        });
        content += `</div>\n`;
      }
      
      content += `    </div>\n`;
      
      if (index < conversation.messages.length - 1) {
        content += `    <hr>\n`;
      }
    });
    
    content += `
</body>
</html>`;
    
    return content;
  }

  private formatConversationToPlainText(conversation: Conversation, options: ExportOptions): string {
    let content = `${conversation.title}\n`;
    content += '='.repeat(conversation.title.length) + '\n\n';
    
    if (options.includeMetadata) {
      content += `Created: ${conversation.createdAt.toLocaleString()}\n`;
      content += `Last Updated: ${conversation.updatedAt.toLocaleString()}\n\n`;
    }
    
    content += '-'.repeat(50) + '\n\n';
    
    conversation.messages.forEach((message, index) => {
      const sender = message.type === 'user' ? 'You' : 'AI';
      const timestamp = options.includeTimestamps 
        ? ` (${message.timestamp.toLocaleTimeString()})` 
        : '';
      
      content += `${sender}${timestamp}:\n`;
      content += `${message.text}\n\n`;
      
      // Include reactions if enabled
      if (options.includeReactions && message.reactions && message.reactions.length > 0) {
        const reactions = message.reactions
          .map(r => `${r.type}: ${r.count}`)
          .join(', ');
        content += `Reactions: ${reactions}\n\n`;
      }
      
      // Include attachments if enabled
      if (options.includeAttachments && message.attachments && message.attachments.length > 0) {
        message.attachments.forEach(attachment => {
          content += `Attachment: ${attachment.name} (${attachment.type}, ${this.formatFileSize(attachment.size)})\n`;
        });
        content += '\n';
      }
      
      if (index < conversation.messages.length - 1) {
        content += '-'.repeat(30) + '\n\n';
      }
    });
    
    return content;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  async exportConversation(conversation: Conversation, options: ExportOptions): Promise<void> {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (options.format) {
      case 'json':
        content = JSON.stringify(conversation, null, 2);
        filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
        mimeType = 'application/json';
        break;
        
      case 'md':
        content = this.formatConversationToText(conversation, options);
        filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
        mimeType = 'text/markdown';
        break;
        
      case 'html':
        content = this.formatConversationToHTML(conversation, options);
        filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        mimeType = 'text/html';
        break;
        
      case 'txt':
        content = this.formatConversationToPlainText(conversation, options);
        filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        mimeType = 'text/plain';
        break;
        
      case 'pdf':
        // For PDF, we'll use the HTML version and let the browser handle it
        content = this.formatConversationToHTML(conversation, options);
        filename = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        mimeType = 'application/pdf';
        break;
        
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }

    // Create and download the file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportMultipleConversations(conversations: Conversation[], options: ExportOptions): Promise<void> {
    if (options.format === 'json') {
      const content = JSON.stringify(conversations, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus-ai-conversations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For other formats, export each conversation separately
      for (const conversation of conversations) {
        await this.exportConversation(conversation, options);
        // Small delay to prevent browser from blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}

export default new ExportService(); 