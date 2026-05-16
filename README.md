# SkyScope — Simple Weather App

A clean and responsive weather app built with **HTML**, **CSS**, and **vanilla JavaScript**.  
It fetches real-time weather and forecast data from the **OpenWeatherMap API**.

## Features

- Search weather by city name
- Get weather using your current location (geolocation)
- Toggle temperature units (**°C / °F**)
- View current weather details:
  - Temperature and feels-like
  - Weather condition and icon
  - Humidity, wind speed, pressure, visibility
  - Sunrise and sunset times
- 5-day forecast display
- Mobile-friendly responsive UI

## Project Structure

```text
simple_weather_app/
├── index.html      # Main UI structure
├── styles.css      # Styling and responsive layout
├── script.js       # Weather logic and API integration
└── README.md
```

## Requirements

- A modern web browser
- Internet connection
- OpenWeatherMap API key

## Setup

1. Clone or download this repository.
2. Open `script.js`.
3. Update the API key in the `API_KEY` constant:

   ```js
   const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
   ```

4. Save the file.
5. Open `index.html` in your browser.

## Usage

- Type a city name in the search field and press **Enter**.
- Or click **Current Location** to use GPS-based weather.
- Use the **°C / °F** toggle to switch units.

## API Reference

- Current weather endpoint: `https://api.openweathermap.org/data/2.5/weather`
- Forecast endpoint: `https://api.openweathermap.org/data/2.5/forecast`
- Weather icons: `https://openweathermap.org/img/wn/`

## Notes

- If geolocation is blocked by the browser, location-based weather will not work.
- Avoid committing personal API keys in public repositories.

## License

This project is open source. Add a license file if you want to define usage terms explicitly.
