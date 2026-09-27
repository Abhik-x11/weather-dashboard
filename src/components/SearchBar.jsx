import React, { useState } from 'react';
import './SearchBar.css';

const POPULAR_CITIES = ['London', 'New York', 'Tokyo', 'Paris', 'Kolkata', 'Sydney', 'Dubai'];

/**
 * SearchBar Component
 * Allows users to search weather by city, locate with GPS coordinates,
 * and select from popular or recent cities.
 */
export default function SearchBar({
  onSearch,
  onLocate,
  isLoading,
  recentSearches = [],
  onClearRecent
}) {
  const [cityInput, setCityInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = cityInput.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  const handleCityClick = (city) => {
    setCityInput(city);
    onSearch(city);
  };

  return (
    <section className="search-section container">
      <div className="search-card">
        
        {/* Search Input Form */}
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">📍</span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Search by city name (e.g. London, Tokyo, Mumbai, San Francisco)..."
              className="search-input"
              disabled={isLoading}
              aria-label="City search"
            />
            {cityInput && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setCityInput('')}
                title="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <div className="search-actions">
            <button
              type="submit"
              className="btn btn-primary search-submit-btn"
              disabled={isLoading || !cityInput.trim()}
            >
              {isLoading ? (
                <>
                  <span className="spinner-micro"></span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍 Search City</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary locate-btn"
              onClick={onLocate}
              disabled={isLoading}
              title="Detect weather using your current device GPS"
            >
              <span>🧭 Current Location</span>
            </button>
          </div>
        </form>

        {/* Popular Cities Quick Pills */}
        <div className="quick-cities-row">
          <span className="quick-label">Popular:</span>
          <div className="city-pills-list">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                className="city-pill"
                onClick={() => handleCityClick(city)}
                disabled={isLoading}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches (Conditionally Rendered) */}
        {recentSearches.length > 0 && (
          <div className="recent-searches-row">
            <div className="recent-header">
              <span className="quick-label">Recent Searches:</span>
              <button
                type="button"
                className="clear-recent-btn"
                onClick={onClearRecent}
              >
                Clear
              </button>
            </div>
            <div className="city-pills-list">
              {recentSearches.map((city) => (
                <button
                  key={city}
                  type="button"
                  className="city-pill recent-pill"
                  onClick={() => handleCityClick(city)}
                  disabled={isLoading}
                >
                  🕒 {city}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
