async function getCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results) throw new Error('City not found');
  const { latitude, longitude, name, country_code } = data.results[0];
  return { latitude, longitude, name, country_code };
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code`;
  const res = await fetch(url);
  const data = await res.json();
  return data.current;
}

function getWeatherInfo(code) {
  if (code === 0)            return { icon: '☀️',  desc: 'Clear sky' };
  if (code <= 2)             return { icon: '🌤',  desc: 'Partly cloudy' };
  if (code === 3)            return { icon: '☁️',  desc: 'Overcast' };
  if (code <= 48)            return { icon: '🌫',  desc: 'Foggy' };
  if (code <= 55)            return { icon: '🌦',  desc: 'Drizzle' };
  if (code <= 65)            return { icon: '🌧',  desc: 'Rainy' };
  if (code <= 75)            return { icon: '🌨',  desc: 'Snowy' };
  if (code <= 82)            return { icon: '🌧',  desc: 'Rain showers' };
  return                            { icon: '⛈',  desc: 'Thunderstorm' };
}

function feelsDesc(apparent, actual) {
  const diff = apparent - actual;
  if (diff > 3)  return 'feels warm';
  if (diff < -3) return 'feels cool';
  return 'feels about right';
}

function displayWeather(weather, location) {
  const { temperature_2m, relative_humidity_2m, wind_speed_10m, apparent_temperature, weather_code } = weather;
  const { icon, desc } = getWeatherInfo(weather_code);
  const card = document.getElementById('weather-card');
  card.innerHTML = `
    <div class="card-top">
      <div>
        <div class="location">📍 ${location.country_code}</div>
        <div class="city-name">${location.name}</div>
      </div>
      <div class="weather-icon">${icon}</div>
    </div>
    <div class="temp-row">
      <span class="temp">${Math.round(temperature_2m)}</span>
      <span class="temp-unit">°C</span>
    </div>
    <div class="weather-desc">${desc} · ${feelsDesc(apparent_temperature, temperature_2m)}</div>
    <div class="divider"></div>
    <div class="stats-grid">
      <div class="stat">
        <div class="stat-label">Humidity</div>
        <div class="stat-value">💧 ${relative_humidity_2m}%</div>
      </div>
      <div class="stat">
        <div class="stat-label">Wind</div>
        <div class="stat-value">💨 ${wind_speed_10m} km/h</div>
      </div>
      <div class="stat feels-like">
        <div class="stat-label">Feels like</div>
        <div class="stat-value">🌡️ ${Math.round(apparent_temperature)}°C</div>
      </div>
    </div>
  `;
}

document.getElementById('search-btn').addEventListener('click', async () => {
  const city = document.getElementById('city-input').value.trim();
  const errorEl = document.getElementById('error-msg');
  const card = document.getElementById('weather-card');
  errorEl.textContent = '';
  if (!city) return;

  card.classList.add('loading');
  try {
    const location = await getCoordinates(city);
    const weather = await getWeather(location.latitude, location.longitude);
    displayWeather(weather, location);
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    card.classList.remove('loading');
  }
});

document.getElementById('city-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('search-btn').click();
});
