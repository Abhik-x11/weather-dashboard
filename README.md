# ⛅ SkyPulse - Weather Dashboard using OpenWeatherMap API

**Assignment 4: Weather Dashboard using API**  
Built with **React**, **Vite**, **Async/Await / Fetch API**, and **Vanilla CSS**.

---

## 📌 Project Overview

SkyPulse is a responsive real-time meteorological dashboard. It integrates with the **OpenWeatherMap API** to deliver live global atmospheric observations, solar cycles, and dynamic 5-day forecasts.

---

## ✨ Features Implemented (Assignment 4 Requirements)

| Feature | Description | Implementation File |
| :--- | :--- | :--- |
| **Temperature** | Real-time temperature display with **°C / °F unit toggle**, Feels-Like, and Daily High/Low. | [`CurrentWeatherCard.jsx`](src/components/CurrentWeatherCard.jsx) |
| **Humidity** | Relative humidity percentage with comfort status classification (*Dry*, *Comfortable*, *Humid*) and visual bar. | [`CurrentWeatherCard.jsx`](src/components/CurrentWeatherCard.jsx) |
| **Wind Speed** | Wind velocity in **m/s** and **km/h** with Beaufort wind scale descriptions. | [`CurrentWeatherCard.jsx`](src/components/CurrentWeatherCard.jsx) |
| **Weather Icon** | High-definition animated **OpenWeatherMap weather icon** with condition badge (*Rain*, *Clear*, *Clouds*, *Snow*, etc.). | [`CurrentWeatherCard.jsx`](src/components/CurrentWeatherCard.jsx) |
| **Sunrise & Sunset Time** | Localized 12-hour AM/PM sunrise and sunset times calculated using timezone offsets with an animated **daylight progress tracker**. | [`CurrentWeatherCard.jsx`](src/components/CurrentWeatherCard.jsx) |
| **Search by City** | Controlled search input with real-time submit, clear button (`✕`), and quick popular city buttons (*London, Tokyo, New York, Paris, Kolkata, Sydney, Dubai*). | [`SearchBar.jsx`](src/components/SearchBar.jsx) |
| **Loading Spinner** | Glassmorphic radar/sun orbit animated spinner with live query status. | [`LoadingSpinner.jsx`](src/components/LoadingSpinner.jsx) |
| **Error Handling** | Comprehensive error component handling **404 City Not Found**, **401 Invalid/Unactivated API Key**, and network offline scenarios with one-click retry. | [`ErrorMessage.jsx`](src/components/ErrorMessage.jsx) |
| **OpenWeatherMap API + Live Demo** | Supports direct OpenWeatherMap API keys, plus a seamless live fallback mode (powered by Open-Meteo) so the app works out-of-the-box even before key activation. | [`weatherService.js`](src/services/weatherService.js) |
| **Pre-requisite Hooks** | Comprehensive implementation of **`useEffect`**, **`useState`**, **`useCallback`**, and **`async/await`** with `fetch()`. | [`App.jsx`](src/App.jsx) |

---

## 🌟 Bonus Capabilities

1. **GPS Geolocation**: Click **"🧭 Current Location"** to automatically detect your coordinates and pull local weather.
2. **5-Day Weather Outlook**: Multi-day forecast cards showing weather icons, descriptions, and day/night temps.
3. **Dynamic Atmospheric Themes**: Body background ambient lighting shifts dynamically based on current condition (*Clear/Sunny*, *Rain*, *Snow*, *Thunderstorm*, *Clouds*).
4. **Recent Searches**: Saves previous city queries in browser `localStorage` for fast one-tap re-fetching.
5. **API Key Settings Manager**: Modal to enter, update, or clear your OpenWeatherMap key at any time.

---

## 🚀 How to Run Locally

1. **Navigate to the project folder**:
   ```bash
   cd weather-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:5174/`** (or port displayed in terminal) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🐙 How to Upload this Project to GitHub

### Step 1: Install Git (if not yet installed)
If Git is not installed on your system:
- Download and install Git from: [https://git-scm.com/downloads/win](https://git-scm.com/downloads/win)
- Or install via Windows Package Manager:
  ```powershell
  winget install --id Git.Git -e --source winget
  ```

### Step 2: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com/).
2. Click the **`+`** icon in the upper right and select **New repository**.
3. Name your repository (e.g., `weather-dashboard` or `react-weather-api`).
4. Keep it **Public** (or Private).
5. **Do not** check "Add a README file" (this project already includes one).
6. Click **Create repository**.
7. Copy the repository HTTPS URL (e.g., `https://github.com/<your-username>/weather-dashboard.git`).

### Step 3: Initialize Git and Push your Code
Open PowerShell inside `C:\Users\abhik\.gemini\antigravity-ide\scratch\weather-dashboard` and run:

```powershell
# 1. Initialize git on the main branch
git init -b main

# 2. Add all project files
git add .

# 3. Commit your code
git commit -m "Assignment 4: Weather Dashboard using OpenWeatherMap API"

# 4. Link your local repo to GitHub (replace with your URL)
git remote add origin https://github.com/<your-username>/weather-dashboard.git

# 5. Push to GitHub
git push -u origin main
```

*(If prompted by Windows, authenticate via your browser or Personal Access Token).*
