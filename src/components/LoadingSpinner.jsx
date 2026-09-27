import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Fulfills the "Loading Spinner" assignment requirement with a modern glassmorphic animated radar loader.
 */
export default function LoadingSpinner({ cityName }) {
  return (
    <div className="loading-container container" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="spinner-orbit">
          <div className="orbit-ring ring-1"></div>
          <div className="orbit-ring ring-2"></div>
          <div className="orbit-ring ring-3"></div>
          <div className="orbit-center">⛅</div>
        </div>

        <h3 className="loading-title">Fetching Weather Data</h3>
        <p className="loading-subtitle">
          {cityName 
            ? `Querying atmospheric sensors and OpenWeatherMap metrics for "${cityName}"...`
            : 'Synchronizing satellite forecast feeds...'}
        </p>
      </div>
    </div>
  );
}
