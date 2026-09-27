import React, { useState, useEffect } from 'react';
import './ApiKeyModal.css';

/**
 * ApiKeyModal Component
 * Allows user to configure, test, and save their OpenWeatherMap API key.
 */
export default function ApiKeyModal({
  isOpen,
  onClose,
  apiKey = '',
  onSaveApiKey
}) {
  const [inputKey, setInputKey] = useState(apiKey);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-header-icon">⚙️</span>
            <div>
              <h2 className="modal-title">OpenWeatherMap API Settings</h2>
              <p className="modal-subtitle">Configure your official API Key or use Live Demo Mode</p>
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="form-group">
            <label htmlFor="api-key-input" className="form-label">
              OpenWeatherMap API Key
            </label>
            <input
              id="api-key-input"
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your 32-character API key here..."
              className="modal-input font-mono"
            />
            <span className="field-hint">
              Leave empty to use our built-in <strong>Live Demo Mode</strong> (powered by Open-Meteo with live satellite data, no key required).
            </span>
          </div>

          <div className="api-guidance-card">
            <h4>💡 How to get a Free OpenWeatherMap Key:</h4>
            <ol>
              <li>Go to <a href="https://home.openweathermap.org/users/sign_up" target="_blank" rel="noreferrer">OpenWeatherMap Sign Up</a>.</li>
              <li>Create a free account and verify your email.</li>
              <li>Navigate to the <strong>API Keys</strong> tab on your dashboard.</li>
              <li>Generate or copy your default key and paste it above!</li>
            </ol>
            <div className="warning-callout">
              ⚠️ <em>Important Note:</em> OpenWeatherMap takes <strong>10 to 120 minutes</strong> to activate brand-new API keys on their global servers. If your key returns error 401, simply use Live Demo Mode while waiting!
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              Clear &amp; Use Demo Mode
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              💾 Save API Key
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
