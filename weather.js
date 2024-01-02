// HTML Elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notifcationElement = document.querySelector(".notification");

// APP KEY AND CONSTANTS
const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0";

const weather = {};

weather.temperature = {
    unit: "celsius"
}

// CHECKING BROWSER SUPPORT FOR GEOLOCATION
if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notifcationElement.style.display = 'block';
    notifcationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

// GET USER LOCATION
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// SHOW ERRORS
function showError(error) {
    notifcationElement.style.display = "block";
    notifcationElement.innerHTML = `<p> ${error.message} </p>`;
    iconElement.innerHTML = `<img src="icons/unknown.png"/>`;
    document.body.style.backgroundColor = "#472d30";
}

// GET WEATHER FROM API
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

// DISPLAY WEATHER UI
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F
function celsiusToFar(temp) {
    return (temp * 9/5) + 32;
}

// WHEN USER CLICKS TEMP ELEMENT
tempElement.addEventListener("click" , function() {
    if (weather.temperature.value == undefined) return;

    if (weather.temperature.unit == "celsius") {
        let fahrenheit = celsiusToFar(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    } 
});