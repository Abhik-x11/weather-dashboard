import React from 'react';
import { cToF, getWeatherIconUrl } from '../services/weatherService';
import './ForecastCard.css';

/**
 * ForecastCard Component
 * Displays multi-day weather outlook from the API.
 */
export default function ForecastCard({ forecastList = [], unit = 'metric' }) {
  if (!forecastList || forecastList.length === 0) return null;

  return (
    <section className="forecast-section">
      <div className="forecast-header">
        <h3 className="forecast-title">📅 5-Day Weather Outlook</h3>
        <span className="forecast-subtitle">Daily atmospheric projection</span>
      </div>

      <div className="forecast-grid">
        {forecastList.map((item, idx) => {
          const date = new Date(item.dt * 1000);
          const dayName = idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateFormatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const weather = item.weather?.[0] || {};
          
          const maxCelsius = Math.round(item.main?.temp_max ?? item.main?.temp ?? 0);
          const minCelsius = Math.round(item.main?.temp_min ?? item.main?.temp ?? 0);
          const displayMax = unit === 'metric' ? `${maxCelsius}°` : `${cToF(maxCelsius)}°`;
          const displayMin = unit === 'metric' ? `${minCelsius}°` : `${cToF(minCelsius)}°`;

          return (
            <div key={item.dt || idx} className="forecast-day-card">
              <span className="day-name">{dayName}</span>
              <span className="day-date">{dateFormatted}</span>

              <img
                src={getWeatherIconUrl(weather.icon)}
                alt={weather.description || 'Forecast weather'}
                className="day-icon"
                width="56"
                height="56"
              />

              <span className="day-desc">{weather.main || 'Clear'}</span>

              <div className="day-temps">
                <span className="day-temp-high">{displayMax}</span>
                <span className="day-temp-low">{displayMin}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
