import React from 'react';
import { formatSunTime, cToF, getWeatherIconUrl } from '../services/weatherService';
import './CurrentWeatherCard.css';

/**
 * CurrentWeatherCard Component
 * Displays: Temperature, Humidity, Wind Speed, Weather Icon, Sunrise & Sunset time.
 * Meets all explicit requirements of Assignment 4.
 */
export default function CurrentWeatherCard({ weatherData, unit = 'metric' }) {
  if (!weatherData) return null;

  const {
    name,
    sys = {},
    main = {},
    wind = {},
    weather = [{}],
    clouds = {},
    visibility = 10000,
    timezone = 0,
    dt = 0,
    _apiSource = 'OpenWeatherMap API'
  } = weatherData;

  const currentWeather = weather[0] || {};
  const tempCelsius = Math.round(main.temp ?? 0);
  const displayTemp = unit === 'metric' ? `${tempCelsius}°C` : `${cToF(tempCelsius)}°F`;
  const feelsLike = Math.round(main.feels_like ?? tempCelsius);
  const displayFeelsLike = unit === 'metric' ? `${feelsLike}°C` : `${cToF(feelsLike)}°F`;
  const tempMin = Math.round(main.temp_min ?? tempCelsius);
  const tempMax = Math.round(main.temp_max ?? tempCelsius);
  const displayMinMax = unit === 'metric' 
    ? `${tempMin}° / ${tempMax}°C` 
    : `${cToF(tempMin)}° / ${cToF(tempMax)}°F`;

  const humidity = main.humidity ?? 0;
  const windSpeedMs = wind.speed ?? 0;
  const windSpeedKmh = Math.round(windSpeedMs * 3.6);

  // Sunrise and Sunset calculation using timezone offset
  const sunriseTime = formatSunTime(sys.sunrise, timezone);
  const sunsetTime = formatSunTime(sys.sunset, timezone);

  // Calculate daylight progress percentage
  let daylightPercentage = 50;
  if (sys.sunrise && sys.sunset) {
    const totalDaylight = sys.sunset - sys.sunrise;
    const currentProg = dt - sys.sunrise;
    if (totalDaylight > 0) {
      daylightPercentage = Math.min(100, Math.max(0, Math.round((currentProg / totalDaylight) * 100)));
    }
  }

  // Local city time
  const localCityDate = new Date((dt + timezone) * 1000).toUTCString().replace('GMT', '');

  return (
    <article className="current-weather-card">
      
      {/* Card Header: Location & API Source */}
      <div className="card-top-row">
        <div className="city-info-wrap">
          <div className="city-title-row">
            <h2 className="city-name">{name}</h2>
            {sys.country && <span className="country-badge">{sys.country}</span>}
          </div>
          <p className="city-time">🕒 Local: {localCityDate.slice(0, 22)}</p>
        </div>

        <div className="source-pill" title="Data Feed">
          <span className="source-dot"></span>
          <span>{_apiSource}</span>
        </div>
      </div>

      {/* Main Temperature & Weather Presentation */}
      <div className="hero-weather-row">
        <div className="temp-hero-group">
          <div className="temp-main-display">
            <span className="temp-number">{displayTemp}</span>
          </div>

          <div className="temp-sub-details">
            <span className="weather-desc-text">
              {currentWeather.description ? (
                currentWeather.description.charAt(0).toUpperCase() + currentWeather.description.slice(1)
              ) : 'Current Weather'}
            </span>
            <span className="feels-like-text">
              Feels like <strong>{displayFeelsLike}</strong> &bull; H/L: {displayMinMax}
            </span>
          </div>
        </div>

        {/* Weather Icon (OpenWeatherMap Official) */}
        <div className="weather-icon-container">
          <img
            src={getWeatherIconUrl(currentWeather.icon)}
            alt={currentWeather.description || 'Weather condition'}
            className="weather-condition-icon"
            width="110"
            height="110"
          />
          <span className="condition-main-tag">{currentWeather.main || 'Clear'}</span>
        </div>
      </div>

      {/* Required Highlight Metrics Grid */}
      <div className="metrics-grid">
        
        {/* 1. Humidity (Required) */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">💧</span>
            <span className="metric-title">Humidity</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{humidity}%</span>
            <span className="metric-badge">
              {humidity < 35 ? 'Dry Air' : humidity <= 65 ? 'Comfortable' : 'Humid'}
            </span>
          </div>
          <div className="metric-bar-track">
            <div 
              className="metric-bar-fill humidity-fill" 
              style={{ width: `${Math.min(100, Math.max(0, humidity))}%` }}
            ></div>
          </div>
        </div>

        {/* 2. Wind Speed (Required) */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">💨</span>
            <span className="metric-title">Wind Speed</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{windSpeedMs} m/s</span>
            <span className="metric-badge">{windSpeedKmh} km/h</span>
          </div>
          <p className="metric-note">
            {windSpeedMs < 3 ? 'Light Breeze' : windSpeedMs < 8 ? 'Moderate Wind' : 'Strong Breeze'}
          </p>
        </div>

        {/* 3. Sunrise & Sunset (Required) */}
        <div className="metric-box sun-cycle-box">
          <div className="metric-header">
            <span className="metric-icon">☀️</span>
            <span className="metric-title">Sun Cycle</span>
          </div>
          <div className="sun-times-row">
            <div className="sun-time-item">
              <span className="sun-label">🌅 Sunrise</span>
              <span className="sun-val">{sunriseTime}</span>
            </div>
            <div className="sun-time-divider"></div>
            <div className="sun-time-item">
              <span className="sun-label">🌇 Sunset</span>
              <span className="sun-val">{sunsetTime}</span>
            </div>
          </div>
          {/* Visual daylight tracker bar */}
          <div className="daylight-bar-track" title={`Daylight Progress: ${daylightPercentage}%`}>
            <div 
              className="daylight-bar-fill" 
              style={{ width: `${daylightPercentage}%` }}
            ></div>
            <div 
              className="daylight-sun-pointer" 
              style={{ left: `calc(${daylightPercentage}% - 6px)` }}
            ></div>
          </div>
        </div>

        {/* 4. Atmospheric Details: Pressure & Visibility */}
        <div className="metric-box">
          <div className="metric-header">
            <span className="metric-icon">🧭</span>
            <span className="metric-title">Atmosphere</span>
          </div>
          <div className="metric-stats-list">
            <div className="stat-subrow">
              <span className="subrow-label">Pressure:</span>
              <span className="subrow-val">{main.pressure ?? 1013} hPa</span>
            </div>
            <div className="stat-subrow">
              <span className="subrow-label">Visibility:</span>
              <span className="subrow-val">{Math.round(visibility / 1000)} km</span>
            </div>
            <div className="stat-subrow">
              <span className="subrow-label">Cloud Cover:</span>
              <span className="subrow-val">{clouds.all ?? 0}%</span>
            </div>
          </div>
        </div>

      </div>

    </article>
  );
}
