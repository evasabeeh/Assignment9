const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temp_value = document.getElementById('temp-value');
const unit = document.getElementById('unit');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');
const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');
const city_name = document.querySelector('.city-name');
const loadingMessage = document.querySelector('.loading-message');
const unitToggle = document.getElementById('unit-toggle');

const API_KEY = "587ec90db71ba32d80ef5421092fe962";
let isCelsius = true;
let currentTemperatureCelsius = null;

async function checkWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    // Show loading message
    loadingMessage.style.display = "block";
    weather_body.style.display = "none";
    location_not_found.style.display = "none";

    try {
        const response = await fetch(url);
        const weather_data = await response.json();

        if (weather_data.cod === "404") {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            loadingMessage.style.display = "none";
            return;
        }

        // Hide loading message and show weather data
        loadingMessage.style.display = "none";
        location_not_found.style.display = "none";
        weather_body.style.display = "flex";

        // Display city name
        city_name.textContent = `${weather_data.name}, ${weather_data.sys.country}`;

        // Convert temperature to Celsius and store it
        currentTemperatureCelsius = Math.round(weather_data.main.temp - 273.15);
        updateTemperatureDisplay();

        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed} Km/H`;

        // Set weather image based on condition
        const weatherCondition = weather_data.weather[0].main;
        const weatherImages = {
            Clouds: "/assets/cloud.png",
            Clear: "/assets/clear.png",
            Rain: "/assets/rain.png",
            Mist: "/assets/mist.png",
            Snow: "/assets/snow.png",
        };
        weather_img.src = weatherImages[weatherCondition] || "/assets/default.png";

    } catch (error) {
        console.error("Error fetching data:", error);
        loadingMessage.style.display = "none";
        location_not_found.style.display = "flex";
    }
}

// Update temperature display based on unit
function updateTemperatureDisplay() {
    if (isCelsius) {
        temp_value.innerText = currentTemperatureCelsius;
        unit.innerText = "°C";
        unitToggle.innerText = "Switch to °F";
    } else {
        temp_value.innerText = Math.round((currentTemperatureCelsius * 9) / 5 + 32);
        unit.innerText = "°F";
        unitToggle.innerText = "Switch to °C";
    }
}

// Get user’s location using Geolocation API
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const geo_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

            try {
                const response = await fetch(geo_url);
                const data = await response.json();
                checkWeather(data.name);
            } catch (error) {
                console.error("Error fetching location data:", error);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
        });
    }
}

// Event listeners
searchBtn.addEventListener('click', () => checkWeather(inputBox.value));
inputBox.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        checkWeather(inputBox.value);
    }
});
unitToggle.addEventListener('click', () => {
    isCelsius = !isCelsius;
    updateTemperatureDisplay();
});

// Detect user's location on page load
getUserLocation();
