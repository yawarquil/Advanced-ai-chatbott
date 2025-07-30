import React from 'react';
import { X, Palette, Bot, Settings as SettingsIcon, History, Trash2, Type, Image } from 'lucide-react';
import { Settings } from '../types/chat';
import AIService from '../services/aiService';
import VoiceSettings from './VoiceSettings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Partial<Settings>) => void;
  onClearHistory: () => void;
  onExportData: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onClearHistory,
  onExportData,
}) => {
  const aiService = new AIService();
  const availableModels = aiService.getAvailableModels();

  const themes = [
    { key: 'light', name: 'Light', color: 'bg-white border-gray-300' },
    { key: 'dark', name: 'Dark', color: 'bg-black border-gray-600' },
    { key: 'halloween', name: 'Halloween Party', color: 'bg-orange-500 border-purple-500' },
    { key: 'blood-red', name: 'Blood Red', color: 'bg-red-800 border-red-500' },
    { key: 'cyber-neon', name: 'Cyber Neon', color: 'bg-pink-500 border-cyan-400' },
    { key: 'gamer', name: 'Gamer\'s Hub', color: 'bg-orange-500 border-gray-800' },
    { key: 'professional', name: 'Professional', color: 'bg-slate-200 border-slate-400' },
    { key: 'monochrome', name: 'Monochrome', color: 'bg-white border-black' },
  ];

  const fonts = [
    { key: 'sans-serif', name: 'Sans-Serif' },
    { key: 'serif', name: 'Serif' },
    { key: 'monospace', name: 'Monospace' },
  ];

  const imageModels = [
      { key: 'pollinations', name: 'Pollinations AI' },
      { key: 'huggingface', name: 'Hugging Face (SD)' },
  ];

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto settings-panel-content">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => onSettingsChange({ theme: theme.key as any })}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    settings.theme === theme.key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${theme.color}`} />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Font Customization */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Type className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Customization</label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onSettingsChange({ fontSize: parseInt(e.target.value, 10) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => onSettingsChange({ fontFamily: e.target.value })}
                  className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  {fonts.map((font) => (
                    <option key={font.key} value={font.key}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* AI Model Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Model</label>
            </div>
            <div className="space-y-2">
              {availableModels.map((model: any) => (
                <label
                  key={model.key}
                  className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    settings.aiModel === model.key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="aiModel"
                    value={model.key}
                    checked={settings.aiModel === model.key}
                    onChange={(e) => onSettingsChange({ aiModel: e.target.value as any })}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{model.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{model.provider}</div>
                    </div>
                    {settings.aiModel === model.key && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Image Generation Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
                <Image className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image Generation</label>
            </div>
            <div className="space-y-2">
                {imageModels.map((model) => (
                    <label key={model.key} className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${settings.imageModel === model.key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}`}>
                        <input
                            type="radio"
                            name="imageModel"
                            value={model.key}
                            checked={settings.imageModel === model.key}
                            onChange={(e) => onSettingsChange({ imageModel: e.target.value as any })}
                            className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{model.name}</span>
                            {settings.imageModel === model.key && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>
                    </label>
                ))}
            </div>
          </div>
          
          {/* Voice Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.voiceEnabled}
                onChange={(e) => onSettingsChange({ voiceEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable voice input and text-to-speech</span>
            </label>
            {settings.voiceEnabled && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <VoiceSettings
                  selectedVoice={settings.selectedVoice}
                  voiceSpeed={settings.voiceSpeed}
                  voicePitch={settings.voicePitch}
                  onVoiceChange={(voice) => onSettingsChange({ selectedVoice: voice })}
                  onSpeedChange={(speed) => onSettingsChange({ voiceSpeed: speed })}
                  onPitchChange={(pitch) => onSettingsChange({ voicePitch: pitch })}
                />
              </div>
            )}
          </div>
           {/* Other Settings */}

          {/* Data Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <History className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Management</label>
            </div>
            <div className="space-y-2">
              <button onClick={onExportData} className="w-full p-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
                Export chat history
              </button>
              <button onClick={onClearHistory} className="w-full p-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Clear all data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;