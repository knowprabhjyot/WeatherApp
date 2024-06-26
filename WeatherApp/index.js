const Api_key = "f136e444f889bc8cb1c1cc7636fee8c4";
let weatherData = {};

async function getWeatherData(event) {
  // This is just to avoid submitting data issue because we are using Form in html, which by default
  // uses post method.
  if (event) {
    event.preventDefault();
  }

  try {
    const city = document.getElementById("cityName")?.value || "Mexico";
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`;
    
    // CALL THE WEATHER API HERE!
    const data = await fetch(API_URL);
    const { main, weather, name, wind, cod, message } = await data.json();

    // Wrong city typed
    if (cod === '404') {
        alert(message);
        console.error(message);
        return;
    }

    weatherData = {
      main,
      weather,
      name,
      wind,
    };

    generateUI(weatherData);
  } catch (error) {
    console.log(error);
  }
}

function generateMiniSection(title, data) {
  let html = "";
  for (let key in data) {
    html += `<h6 class="text-blue-600">${key}: ${data[key] || "Unknown"}</h6>`;
  }

  return `
    <div style="background-color: #d3c9c9" class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">${title}</h5>
        ${html}
    </div>
    `;
}

function generateUI(weatherData) {
  const temperatureUI = document.getElementById("temperature");
  const cityUI = document.getElementById("city");
  const weatherIconUI = document.getElementById("weatherIcon");
  const bottomContainer = document.getElementById("bottom-container");
  temperatureUI.textContent = weatherData.main.temp;
  cityUI.textContent = weatherData.name;

  const icon = weatherData.weather[0].icon;

  const imageURL = `http://openweathermap.org/img/wn/${icon}@4x.png`;
  weatherIconUI.src = imageURL;

  const windData = {
    deg: weatherData.wind.deg,
    gust: weatherData.wind.gust,
    speed: weatherData.wind.speed,
  };

  const miscData = {
    humidity: weatherData.main.humidity,
    feels_like: weatherData.main.feels_like,
    pressure: weatherData.main.pressure,
  };

  const windSection = generateMiniSection("Wind", windData);
  const miscSection = generateMiniSection("Misc", miscData);

  bottomContainer.innerHTML = "";

  bottomContainer.innerHTML += windSection;
  bottomContainer.innerHTML += miscSection;
}

getWeatherData();