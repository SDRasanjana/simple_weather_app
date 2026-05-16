/* ==============================================
   CONFIGURATION — Replace with your real API key
   Sign up free at openweathermap.org
   ============================================== */
const API_KEY = '0ba7284598bed7b8496ba5ef054e932c'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/* ==============================================
   APP STATE
   ============================================== */
let currentUnit = 'imperial'; // 'metric' = °C, 'imperial' = °F
let lastCity = '';
let lastWeatherData = null;

/* ==============================================
   UI HELPERS
   ============================================== */
function showLoader() { document.getElementById('loader').classList.add('show'); }
function hideLoader() { document.getElementById('loader').classList.remove('show'); }
function showWeather() { document.getElementById('weatherMain').classList.add('show'); }
function hideWeather() { document.getElementById('weatherMain').classList.remove('show'); }

function showError(msg) {
    const box = document.getElementById('errorBox');
    document.getElementById('errorText').textContent = msg;
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 5000);
}

function showInfo(msg) {
    const box = document.getElementById('infoBox');
    document.getElementById('infoText').textContent = msg;
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 4000);
}

/* ==============================================
   SEARCH WEATHER BY CITY NAME
   ============================================== */
async function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) { showError('Please enter a city name.'); return; }
    lastCity = city;
    await fetchWeather({ q: city });
}

/* ==============================================
   GET WEATHER BY GPS LOCATION
   ============================================== */
function getByLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    showInfo('📍 Detecting your location…');
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await fetchWeather({ lat: latitude, lon: longitude });
        },
        () => {
            showError('Could not get location. Please allow location access.');
        }
    );
}

/* ==============================================
   SWITCH TEMPERATURE UNIT
   ============================================== */
function switchUnit(unit) {
    if (unit === currentUnit) return;
    currentUnit = unit;

    document.getElementById('btnC').classList.toggle('active', unit === 'metric');
    document.getElementById('btnF').classList.toggle('active', unit === 'imperial');

    if (lastWeatherData) {
        displayCurrentWeather(lastWeatherData);
    }
    if (lastCity) fetchWeather({ q: lastCity });
}

/* ==============================================
   CORE FETCH FUNCTION
   ============================================== */
async function fetchWeather(params) {
    if (API_KEY === 'YOUR_API_KEY') {
        showError('Please add your API key in script.js to display weather data.');
        return;
    }

    hideWeather();
    showLoader();

    try {
        const queryString = new URLSearchParams({
            ...params,
            appid: API_KEY,
            units: currentUnit,
        }).toString();

        const currentRes = await fetch(`${BASE_URL}/weather?${queryString}`);

        if (!currentRes.ok) {
            if (currentRes.status === 404) throw new Error('City not found. Try another name!');
            if (currentRes.status === 401) throw new Error('Invalid API key. Check your key in script.js');
            throw new Error(`Server error: ${currentRes.status}`);
        }

        const currentData = await currentRes.json();
        const forecastRes = await fetch(`${BASE_URL}/forecast?${queryString}`);
        const forecastData = await forecastRes.json();

        lastWeatherData = currentData;
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        showWeather();

        lastCity = currentData.name;
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoader();
    }
}

/* ==============================================
   DISPLAY CURRENT TIME
   ============================================== */
function updateTimeDisplay() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('timeDisplay').textContent = `${hours}:${mins}`;
}

/* ==============================================
   DISPLAY CURRENT WEATHER DATA
   ============================================== */
function displayCurrentWeather(data) {
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

    // Update time and date
    updateTimeDisplay();
    const dateObj = new Date();
    const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    document.getElementById('dateDisplay').textContent = dateStr;

    // City and country
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('cityCountry').textContent = data.sys.country;

    // Temperature
    document.getElementById('tempBig').textContent = `${Math.round(data.main.temp)}°`;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}${unitSymbol}`;

    // Description
    document.getElementById('weatherDesc').textContent = data.weather[0].description;

    // Weather icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Stats
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} ${windUnit}`;
    document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

    // Sun times
    document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise, data.timezone);
    document.getElementById('sunset').textContent = formatTime(data.sys.sunset, data.timezone);
}

/* ==============================================
   DISPLAY 5-DAY FORECAST
   ============================================== */
function displayForecast(data) {
    const daily = {};
    data.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        if (!daily[dateKey]) daily[dateKey] = item;
    });

    const days = Object.values(daily).slice(0, 5);
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';

    const list = document.getElementById('forecastList');
    list.innerHTML = days.map((item) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        const icon = item.weather[0].icon;
        const hi = Math.round(item.main.temp_max);
        const lo = Math.round(item.main.temp_min);
        return `
            <div class="forecast-item">
                <div class="forecast-item-day">${dayName}<br>${dayNum}</div>
                <img class="forecast-item-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${item.weather[0].description}"/>
                <div class="forecast-item-temp"><span class="forecast-item-hi">${hi}°</span><span class="forecast-item-lo">${lo}°</span></div>
            </div>
        `;
    }).join('');
}

/* ==============================================
   FORMAT TIME UTILITY
   ============================================== */
function formatTime(unixTimestamp, timezoneOffset) {
    const utcMs = unixTimestamp * 1000;
    const localMs = utcMs + timezoneOffset * 1000;
    const date = new Date(localMs);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/* ==============================================
   UPDATE TIME CONTINUOUSLY
   ============================================== */
setInterval(updateTimeDisplay, 30000);

/* ==============================================
   ON PAGE LOAD
   ============================================== */
window.addEventListener('load', () => {
    updateTimeDisplay();
    document.getElementById('cityInput').focus();
});
