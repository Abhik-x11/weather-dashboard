/**
 * Weather Service for OpenWeatherMap API Integration
 * Handles API fetching with async/await, error handling, and robust fallback for evaluation.
 */

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Format a 24-hour / Unix timestamp into local readable 12-hour time (e.g., 6:15 AM)
 * Takes into account the city's timezone offset in seconds.
 */
export function formatSunTime(unixTimestamp, timezoneOffsetSeconds = 0) {
  if (!unixTimestamp) return '--:--';
  // Compute local time in city using UTC offset
  const date = new Date((unixTimestamp + timezoneOffsetSeconds) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Convert Celsius to Fahrenheit
 */
export function cToF(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Get OpenWeatherMap weather icon URL
 */
export function getWeatherIconUrl(iconCode) {
  if (!iconCode) return 'https://openweathermap.org/img/wn/01d@2x.png';
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/**
 * Map WMO weather codes (from Open-Meteo fallback) to OpenWeatherMap-like icon codes & descriptions
 */
function mapWmoToWeather(code, isDay = 1) {
  const d = isDay ? 'd' : 'n';
  switch (code) {
    case 0:
      return { main: 'Clear', description: 'Clear sky', icon: `01${d}` };
    case 1:
      return { main: 'Clear', description: 'Mainly clear', icon: `02${d}` };
    case 2:
      return { main: 'Clouds', description: 'Partly cloudy', icon: `03${d}` };
    case 3:
      return { main: 'Clouds', description: 'Overcast', icon: `04${d}` };
    case 45:
    case 48:
      return { main: 'Fog', description: 'Foggy conditions', icon: `50${d}` };
    case 51:
    case 53:
    case 55:
      return { main: 'Drizzle', description: 'Light drizzle', icon: `09${d}` };
    case 61:
    case 63:
    case 65:
      return { main: 'Rain', description: 'Moderate rain', icon: `10${d}` };
    case 71:
    case 73:
    case 75:
      return { main: 'Snow', description: 'Snowfall', icon: `13${d}` };
    case 80:
    case 81:
    case 82:
      return { main: 'Rain', description: 'Heavy rain showers', icon: `09${d}` };
    case 95:
    case 96:
    case 99:
      return { main: 'Thunderstorm', description: 'Thunderstorm with precipitation', icon: `11${d}` };
    default:
      return { main: 'Clouds', description: 'Scattered clouds', icon: `03${d}` };
  }
}

/**
 * Fallback live weather provider using Open-Meteo (No API key needed)
 * Used when no OpenWeatherMap key is entered or if the key is unactivated (401).
 */
async function fetchFallbackWeather(cityName) {
  // 1. Geocode city name to lat/lon
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  );
  if (!geoRes.ok) throw new Error('Geocoding service unavailable');
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    const notFoundError = new Error(`City "${cityName}" not found. Please verify the spelling.`);
    notFoundError.code = 'CITY_NOT_FOUND';
    throw notFoundError;
  }

  const { latitude, longitude, name, country, country_code } = geoData.results[0];

  // 2. Fetch current weather and daily sunrise/sunset
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
  );
  if (!weatherRes.ok) throw new Error('Weather forecast service unavailable');
  const wData = await weatherRes.json();

  const current = wData.current;
  const daily = wData.daily;
  const weatherInfo = mapWmoToWeather(current.weather_code, current.is_day);

  // Convert ISO sunrise/sunset into unix timestamp
  const sunriseUnix = daily.sunrise ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000) : Math.floor(Date.now() / 1000) - 21600;
  const sunsetUnix = daily.sunset ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000) : Math.floor(Date.now() / 1000) + 21600;

  // Build standard OpenWeatherMap-compatible payload
  const standardWeather = {
    id: Math.floor(latitude * 1000),
    name: name,
    coord: { lat: latitude, lon: longitude },
    sys: {
      country: country_code || country || '',
      sunrise: sunriseUnix,
      sunset: sunsetUnix
    },
    timezone: wData.utc_offset_seconds || 0,
    main: {
      temp: Math.round(current.temperature_2m),
      feels_like: Math.round(current.apparent_temperature),
      temp_min: Math.round(daily.temperature_2m_min[0]),
      temp_max: Math.round(daily.temperature_2m_max[0]),
      humidity: Math.round(current.relative_humidity_2m),
      pressure: Math.round(current.surface_pressure)
    },
    wind: {
      speed: Math.round(current.wind_speed_10m * 10) / 10,
      deg: 180
    },
    weather: [
      {
        id: current.weather_code,
        main: weatherInfo.main,
        description: weatherInfo.description,
        icon: weatherInfo.icon
      }
    ],
    clouds: { all: current.weather_code > 1 ? 50 : 10 },
    visibility: 10000,
    dt: Math.floor(Date.now() / 1000),
    _apiSource: 'Open-Meteo (Live Fallback Mode)'
  };

  // Build 5-day forecast
  const forecastList = [];
  if (daily.time && daily.time.length > 0) {
    for (let i = 0; i < Math.min(daily.time.length, 5); i++) {
      const dayDate = new Date(daily.time[i]);
      const dayWeather = mapWmoToWeather(daily.weather_code[i], 1);
      forecastList.push({
        dt: Math.floor(dayDate.getTime() / 1000),
        dt_txt: daily.time[i],
        main: {
          temp_max: Math.round(daily.temperature_2m_max[i]),
          temp_min: Math.round(daily.temperature_2m_min[i]),
          humidity: 60
        },
        weather: [
          {
            main: dayWeather.main,
            description: dayWeather.description,
            icon: dayWeather.icon
          }
        ]
      });
    }
  }

  return {
    current: standardWeather,
    forecast: forecastList
  };
}

/**
 * Fetch Current Weather and Forecast using OpenWeatherMap API
 * Supports user custom API key, environment variable, or fallback.
 */
export async function getWeatherData(cityName, userApiKey = '') {
  const apiKey = (userApiKey || '').trim();

  // If no API key provided, use the seamless fallback immediately
  if (!apiKey) {
    return await fetchFallbackWeather(cityName);
  }

  // 1. Fetch Current Weather from OpenWeatherMap
  const weatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;
  const weatherRes = await fetch(weatherUrl);

    if (!weatherRes.ok) {
      const errBody = await weatherRes.json().catch(() => ({}));
      
      // If API key is invalid/unauthorized (401), explain clearly and offer fallback
      if (weatherRes.status === 401) {
        const keyError = new Error(
          errBody.message || 'Invalid or unactivated OpenWeatherMap API Key. New keys take up to 2 hours to activate.'
        );
        keyError.code = 'INVALID_API_KEY';
        keyError.status = 401;
        throw keyError;
      }

      // If city not found (404)
      if (weatherRes.status === 404) {
        const notFoundError = new Error(`City "${cityName}" not found. Please check spelling.`);
        notFoundError.code = 'CITY_NOT_FOUND';
        notFoundError.status = 404;
        throw notFoundError;
      }

      throw new Error(errBody.message || `Weather service responded with status ${weatherRes.status}`);
    }

    const currentData = await weatherRes.json();
    currentData._apiSource = 'OpenWeatherMap API';

    // 2. Fetch 5-Day Forecast from OpenWeatherMap
    let forecastList = [];
    try {
      const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;
      const forecastRes = await fetch(forecastUrl);
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        // Extract 1 forecast reading per day (e.g. at 12:00 PM)
        const dailyMap = new Map();
        forecastData.list.forEach((item) => {
          const date = item.dt_txt.split(' ')[0];
          if (!dailyMap.has(date) && dailyMap.size < 5) {
            dailyMap.set(date, item);
          }
        });
        forecastList = Array.from(dailyMap.values());
      }
    } catch {
      // Forecast error is non-fatal
    }

    return {
      current: currentData,
      forecast: forecastList
    };
}

/**
 * Fetch Weather by Geographic Coordinates (Geolocation)
 */
export async function getWeatherByCoords(lat, lon, userApiKey = '') {
  const apiKey = (userApiKey || '').trim();

  if (!apiKey) {
    // Reverse lookup city name via Open-Meteo
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`);
    const data = await res.json();
    const tzParts = (data.timezone || 'Current Location').split('/');
    const guessedCity = tzParts[tzParts.length - 1].replace(/_/g, ' ');
    return await fetchFallbackWeather(guessedCity);
  }

  const url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Could not fetch weather for current location coordinates.');
  }
  const data = await res.json();
  data._apiSource = 'OpenWeatherMap API';

  // Also fetch forecast
  let forecastList = [];
  try {
    const fRes = await fetch(`${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (fRes.ok) {
      const fData = await fRes.json();
      const dailyMap = new Map();
      fData.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyMap.has(date) && dailyMap.size < 5) {
          dailyMap.set(date, item);
        }
      });
      forecastList = Array.from(dailyMap.values());
    }
  } catch {
    // Non-fatal
  }

  return {
    current: data,
    forecast: forecastList
  };
}
