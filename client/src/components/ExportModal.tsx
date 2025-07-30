import React, { useState } from 'react';
import { X, Download, FileText, FileJson, FileCode, FileType } from 'lucide-react';
import { Conversation } from '../types/chat';
import { ExportFormat, ExportOptions } from '../services/exportService';
import exportService from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  selectedConversation?: Conversation;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  conversations,
  selectedConversation
}) => {
  const [format, setFormat] = useState<ExportFormat>('md');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeReactions, setIncludeReactions] = useState(true);
  const [includeAttachments, setIncludeAttachments] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMode, setExportMode] = useState<'single' | 'multiple'>(
    selectedConversation ? 'single' : 'multiple'
  );

  const formatOptions = [
    { value: 'md', label: 'Markdown', icon: FileText, description: 'Best for documentation and notes' },
    { value: 'html', label: 'HTML', icon: FileCode, description: 'Web-ready with styling' },
    { value: 'txt', label: 'Plain Text', icon: FileType, description: 'Simple text format' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'Structured data format' },
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Print-friendly format' }
  ];

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      const options: ExportOptions = {
        format,
        includeMetadata,
        includeTimestamps,
        includeReactions,
        includeAttachments
      };

      if (exportMode === 'single' && selectedConversation) {
        await exportService.exportConversation(selectedConversation, options);
      } else {
        await exportService.exportMultipleConversations(conversations, options);
      }

      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20 dark:border-gray-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Export Conversation{exportMode === 'multiple' ? 's' : ''}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Mode */}
          {selectedConversation && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Mode
              </label>
              <div className="flex space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="single"
                    checked={exportMode === 'single'}
                    onChange={(e) => setExportMode(e.target.value as 'single' | 'multiple')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Current conversation
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="multiple"
                    checked={exportMode === 'multiple'}
                    onChange={(e) => setExportMode(e.target.value as 'single' | 'multiple')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    All conversations ({conversations.length})
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Format
            </label>
            <div className="grid grid-cols-1 gap-2">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      format === option.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={format === option.value}
                      onChange={(e) => setFormat(e.target.value as ExportFormat)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Export Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include metadata (creation date, etc.)
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimestamps}
                  onChange={(e) => setIncludeTimestamps(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include message timestamps
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeReactions}
                  onChange={(e) => setIncludeReactions(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include message reactions
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAttachments}
                  onChange={(e) => setIncludeAttachments(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include attachment information
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 