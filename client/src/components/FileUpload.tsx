import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, X, File, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, type: 'document' | 'image') => void;
  isVisible: boolean;
  onClose: () => void;
}

interface UploadedFile {
  file: File;
  type: 'document' | 'image';
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isVisible,
  onClose
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedDocuments = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
  const supportedImages = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (file.size > maxFileSize) {
        setUploadedFiles(prev => [...prev, {
          file,
          type: 'document',
          status: 'error',
          error: 'File size exceeds 10MB limit'
        }]);
        return;
      }

      let fileType: 'document' | 'image' = 'document';
      
      if (supportedImages.includes(fileExtension)) {
        fileType = 'image';
      } else if (!supportedDocuments.includes(fileExtension)) {
        setUploadedFiles(prev => [...prev, {
          file,
          type: 'document',
          status: 'error',
          error: 'Unsupported file type'
        }]);
        return;
      }

      // Add file to list with uploading status
      setUploadedFiles(prev => [...prev, {
        file,
        type: fileType,
        status: 'uploading'
      }]);

      // Simulate upload process
      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.file === file ? { ...f, status: 'success' } : f
        ));
        
        // Call the upload handler
        onFileUpload(file, fileType);
      }, 1000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const getFileIcon = (file: File, type: 'document' | 'image') => {
    if (type === 'image') return <Image className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Upload File
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
        <div className="p-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Support for PDF, Word, text files, and images (max 10MB)
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={[...supportedDocuments, ...supportedImages].join(',')}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                Uploaded Files
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(uploadedFile.file, uploadedFile.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {uploadedFile.error && (
                          <p className="text-xs text-red-500">{uploadedFile.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(uploadedFile.status)}
                      <button
                        onClick={() => removeFile(uploadedFile.file)}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 