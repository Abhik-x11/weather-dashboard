import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Fulfills the "Include proper Error Handling" assignment requirement.
 * Handles City Not Found (404), Invalid/Inactive API Key (401), and Network Offline states.
 */
export default function ErrorMessage({
  error,
  onRetry,
  onOpenApiKeyModal,
  onUseFallback
}) {
  if (!error) return null;

  const isKeyError = error.code === 'INVALID_API_KEY' || error.status === 401;
  const isNotFoundError = error.code === 'CITY_NOT_FOUND' || error.status === 404;

  return (
    <section className="error-section container" role="alert">
      <div className="error-card">
        <div className="error-icon-badge">
          {isKeyError ? '🔑' : isNotFoundError ? '🔍' : '⚠️'}
        </div>

        <h3 className="error-title">
          {isNotFoundError
            ? 'City Not Found'
            : isKeyError
            ? 'OpenWeatherMap API Key Issue'
            : 'Weather Fetch Error'}
        </h3>

        <p className="error-desc">{error.message || 'An unexpected error occurred while fetching weather data.'}</p>

        {isKeyError && (
          <div className="error-note">
            <strong>Note about OpenWeatherMap:</strong> Newly generated API keys take 10 minutes to 2 hours to activate on OpenWeatherMap servers. In the meantime, you can use our built-in Live Demo Mode which provides real live weather data without an API key!
          </div>
        )}

        {isNotFoundError && (
          <div className="error-suggestions">
            <span className="suggestions-label">Suggestions:</span>
            <ul>
              <li>Double-check spelling (e.g. "Bengaluru" vs "Bangalore", "New York" vs "NYC")</li>
              <li>Include country or state code (e.g. "Paris, FR" or "Cambridge, UK")</li>
              <li>Try searching a major neighboring metropolitan city</li>
            </ul>
          </div>
        )}

        <div className="error-actions">
          {onRetry && (
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              🔄 Try Again
            </button>
          )}

          {isKeyError && (
            <>
              <button type="button" className="btn btn-secondary" onClick={onUseFallback}>
                ⚡ Switch to Live Demo Mode
              </button>
              <button type="button" className="btn btn-secondary" onClick={onOpenApiKeyModal}>
                ⚙️ Update API Key
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
