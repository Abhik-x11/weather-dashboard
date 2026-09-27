import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastCard from './components/ForecastCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ApiKeyModal from './components/ApiKeyModal';

import { getWeatherData, getWeatherByCoords } from './services/weatherService';
import './App.css';

const LOCAL_STORAGE_API_KEY = 'skypulse_openweathermap_api_key_v1';
const LOCAL_STORAGE_RECENT = 'skypulse_recent_cities_v1';
const DEFAULT_CITY = 'Kolkata';

export default function App() {
  // 1. STATE: API Key & Unit
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_API_KEY) || '';
  });
  const [unit, setUnit] = useState('metric'); // 'metric' (°C) or 'imperial' (°F)

  // 2. STATE: Weather data and active search
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  
  // 3. STATE: Async/Await Loading & Error Handlers (Required)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 4. STATE: Recent searches & Modal
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECENT);
      return saved ? JSON.parse(saved) : ['London', 'Tokyo', 'New York'];
    } catch {
      return ['London', 'Tokyo', 'New York'];
    }
  });
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Save API key to localStorage when updated
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem(LOCAL_STORAGE_API_KEY, newKey);
    // Reload weather with new key
    loadWeather(city, newKey);
  };

  // Helper to add to recent searches
  const addToRecent = (cityName) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECENT, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(LOCAL_STORAGE_RECENT);
  };

  // 5. ASYNC / AWAIT / FETCH: Main Weather Loader
  const loadWeather = useCallback(async (targetCity, keyToUse = apiKey) => {
    if (!targetCity || !targetCity.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { current, forecast } = await getWeatherData(targetCity, keyToUse);
      setWeatherData(current);
      setForecastList(forecast);
      setCity(current.name || targetCity);
      addToRecent(current.name || targetCity);
    } catch (err) {
      console.error('Weather Fetch Error:', err);
      setError(err);
      setWeatherData(null);
      setForecastList([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Geolocation handler (Current Device Location)
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const { current, forecast } = await getWeatherByCoords(latitude, longitude, apiKey);
          setWeatherData(current);
          setForecastList(forecast);
          setCity(current.name);
          addToRecent(current.name);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      },
      (geoErr) => {
        setIsLoading(false);
        setError(new Error(`Location access denied or unavailable (${geoErr.message}).`));
      },
      { timeout: 10000 }
    );
  };

  // 6. useEffect: Initial weather fetch on mount
  useEffect(() => {
    loadWeather(DEFAULT_CITY);
  }, [loadWeather]);

  // 7. useEffect: Dynamic body background theme based on weather
  useEffect(() => {
    if (!weatherData || !weatherData.weather?.[0]) return;
    const condition = (weatherData.weather[0].main || '').toLowerCase();
    
    // Remove previous weather themes
    document.body.classList.remove(
      'theme-clear',
      'theme-rain',
      'theme-snow',
      'theme-thunderstorm',
      'theme-clouds'
    );

    if (condition.includes('clear')) {
      document.body.classList.add('theme-clear');
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
      document.body.classList.add('theme-rain');
    } else if (condition.includes('snow')) {
      document.body.classList.add('theme-snow');
    } else if (condition.includes('thunder')) {
      document.body.classList.add('theme-thunderstorm');
    } else {
      document.body.classList.add('theme-clouds');
    }
  }, [weatherData]);

  // Fallback switch action
  const handleUseFallback = () => {
    handleSaveApiKey('');
    loadWeather(city, '');
  };

  return (
    <div className="weather-dashboard-app">
      {/* 1. Header Navigation */}
      <Navbar
        unit={unit}
        onToggleUnit={(newUnit) => setUnit(newUnit)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        apiSource={weatherData?._apiSource || (apiKey ? 'OpenWeatherMap API' : 'Live Demo Mode')}
      />

      <main className="main-content">
        {/* Banner Tag */}
        <section className="hero-section container">
          <div className="assignment-meta-tag">
            <span>Assignment 4 &bull; API Integration / Fetch / Async-Await / useEffect</span>
          </div>
          <h2 className="hero-title">Live Global Weather Radar</h2>
          <p className="hero-desc">
            Real-time meteorological observations powered by OpenWeatherMap API with temperature,
            humidity, wind speed, solar cycles, and dynamic forecasts.
          </p>
        </section>

        {/* 2. Search by City, GPS Locator & Recent History */}
        <SearchBar
          onSearch={(newCity) => loadWeather(newCity)}
          onLocate={handleLocateMe}
          isLoading={isLoading}
          recentSearches={recentSearches}
          onClearRecent={handleClearRecent}
        />

        {/* 3. Conditional Rendering: Loading / Error / Weather Dashboard */}
        <section className="weather-display-area container">
          {isLoading && (
            <LoadingSpinner cityName={city} />
          )}

          {!isLoading && error && (
            <ErrorMessage
              error={error}
              onRetry={() => loadWeather(city)}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              onUseFallback={handleUseFallback}
            />
          )}

          {!isLoading && !error && weatherData && (
            <div className="weather-content-layout">
              {/* Primary Current Weather Card */}
              <CurrentWeatherCard
                weatherData={weatherData}
                unit={unit}
              />

              {/* 5-Day Outlook */}
              {forecastList.length > 0 && (
                <ForecastCard
                  forecastList={forecastList}
                  unit={unit}
                />
              )}
            </div>
          )}
        </section>

        {/* Quick Footer */}
        <footer className="weather-footer container">
          <div className="footer-content">
            <span>SkyPulse Weather App &bull; Built with React, Fetch API, and OpenWeatherMap</span>
            <button
              type="button"
              className="footer-api-link"
              onClick={() => setIsApiKeyModalOpen(true)}
            >
              ⚙️ Manage OpenWeatherMap API Key
            </button>
          </div>
        </footer>
      </main>

      {/* 4. API Key Configuration Modal */}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          key={apiKey || 'default'}
          isOpen={true}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />
      )}
    </div>
  );
}
