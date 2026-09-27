import React from 'react';
import './Navbar.css';

/**
 * Navbar Component
 * Displays brand logo, assignment badge, temperature unit toggle, and API Settings button.
 */
export default function Navbar({
  unit,
  onToggleUnit,
  onOpenApiKeyModal,
  apiSource
}) {
  const isUsingOpenWeather = apiSource.includes('OpenWeatherMap');

  return (
    <header className="weather-navbar">
      <div className="container nav-container">
        
        {/* Brand / Logo */}
        <div className="nav-brand">
          <div className="brand-logo">
            <span className="logo-icon">⛅</span>
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">SkyPulse</h1>
              <span className="assignment-badge">Assignment 4</span>
            </div>
            <p className="brand-tagline">OpenWeatherMap API Weather Dashboard</p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="nav-actions">
          
          {/* API Status Badge */}
          <button 
            type="button" 
            className={`api-status-btn ${isUsingOpenWeather ? 'status-active' : 'status-demo'}`}
            onClick={onOpenApiKeyModal}
            title="Configure OpenWeatherMap API Key"
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {isUsingOpenWeather ? 'OpenWeatherMap API' : 'Live Demo Mode'}
            </span>
            <span className="status-gear">⚙️</span>
          </button>

          {/* Celsius / Fahrenheit Toggle */}
          <div className="unit-toggle" role="group" aria-label="Temperature Unit">
            <button
              type="button"
              className={`unit-btn ${unit === 'metric' ? 'active' : ''}`}
              onClick={() => onToggleUnit('metric')}
              title="Celsius (°C)"
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`}
              onClick={() => onToggleUnit('imperial')}
              title="Fahrenheit (°F)"
            >
              °F
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
