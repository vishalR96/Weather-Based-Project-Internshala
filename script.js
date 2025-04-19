// -------------------------JS CODE STARTS FROM HERE------------------------------------
// ------------------------JS CODE FOR DAY NIGHT TOGGLE MODE-------------------------- 
let icon = document.getElementById("icon")
icon.onclick = function(){
  document.body.classList.toggle("dark")
  if(document.body.classList.contains("dark")){
    icon.src = "sun.png"
  }else{
    icon.src = "moon.png"
  }
}
// -------------------------JS CODE FOR PRELOADER---------------------------------------------  
let a = document.getElementById("preloader")
window.addEventListener("load", function(){
    setTimeout(() => {
        a.style.display = "none"
    }, 5000)
})
// -----------------JS CODE FOR weather based data---------------------------------------------

// ---------------------API KEY ------------------------------------------------------------------
const apiKey = "9b57f5437ad719906a29efde198f57c6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";

const searchBox = document.querySelector(".col2 input");
const searchBtn = document.querySelector(".col2 button");
const weathericon = document.querySelector(".col3 .weathericon");
const recentCitiesDropdown = document.querySelector(".recent-cities-dropdown");
const locationIcon = document.querySelector(".fa-location-crosshairs"); // Icon element

// ------------------Loading recent cities from local storage and update the dropdown----------------
function loadRecentCities() {
  const recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentCitiesDropdown.innerHTML = ""; 

  if (recentCities.length > 0) {
    recentCities.forEach(city => {
      const cityOption = document.createElement("option");
      cityOption.value = city;
      cityOption.innerText = city;
      recentCitiesDropdown.appendChild(cityOption);
    });
    recentCitiesDropdown.style.display = "block"; // Showing the dropdown 
  } else {
    recentCitiesDropdown.style.display = "none"; // Hiding the dropdown 
  }
}

// --------------------Saving the recent cities to localStorage-----------------------------------------
function saveRecentCity(city) {
  let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
  if (!recentCities.includes(city)) {
    if (recentCities.length >= 5) {
      recentCities.shift(); // Remove the oldest city if there are more than 5 cities
    }
    recentCities.push(city);
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
  }
  loadRecentCities();
}

// -------------------Fetch current weather for the selected city----------------------------------------
async function checkWeather(city) {
  try {
    const response = await fetch(apiUrl + "q=" + city + "&units=metric&appid=" + apiKey);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log("Current Weather:", data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".feel").innerHTML = data.main.feels_like + "°c";

    const condition = data.weather[0].main;
    if (condition === "Clouds") {
      weathericon.src = "clouds.png";
    } else if (condition === "Clear") {
      weathericon.src = "clear.png";
    } else if (condition === "Drizzle") {
      weathericon.src = "drizzle.png";
    } else if (condition === "Mist") {
      weathericon.src = "mist.png";
    } else if (condition === "Rain") {
      weathericon.src = "rain.png"; 
    } else if (condition === "Snow") {
      weathericon.src = "snow.png";
    } else {
      weathericon.src = "default.png";
    }

    document.querySelectorAll(".panel").forEach(element => {
      element.style.display = "block";
    });

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// ----------------------------------Fetch the forecast for the selected city---------------------------
async function getForecast(city) {
  try {
    const res = await fetch(forecastUrl + city + "&units=metric&appid=" + apiKey);
    const data = await res.json();
    console.log("Forecast Data:", data);

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    dailyForecasts.forEach((day, index) => {
      const card = document.querySelector(`.card${index + 1}`);
      const date = new Date(day.dt_txt).toDateString().split(" ").slice(0, 3).join(" ");
      const temp = Math.round(day.main.temp) + "°C";
      const icon = day.weather[0].icon;
      const weather = day.weather[0].main;

      card.innerHTML = `
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weather}" />
        <p>${weather}</p>
        <p>Temp: ${temp}</p>
        <p>Wind: ${day.wind.speed} km/h</p>
        <p>Humidity: ${day.main.humidity}%</p>
      `;
    });
  } catch (err) {
    console.error("Forecast Error:", err);
  }
}

// ------------------------Getting the user's live location------------------------------------------
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log("Latitude:", lat, "Longitude:", lon);

      checkWeatherByCoordinates(lat, lon);
    }, error => {
      alert("Error retrieving location: " + error.message);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function checkWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(apiUrl + "lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey);
    if (!response.ok) throw new Error("Weather not found");

    const data = await response.json();
    console.log("Weather Data by Coordinates:", data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    document.querySelector(".feel").innerHTML = data.main.feels_like + "°c";

    const condition = data.weather[0].main;
    if (condition === "Clouds") {
      weathericon.src = "clouds.png";
    } else if (condition === "Clear") {
      weathericon.src = "clear.png";
    } else if (condition === "Drizzle") {
      weathericon.src = "drizzle.png";
    } else if (condition === "Mist") {
      weathericon.src = "mist.png";
    } else if (condition === "Rain") {
      weathericon.src = "rain.png"; 
    } else if (condition === "Snow") {
      weathericon.src = "snow.png";
    } else {
      weathericon.src = "default.png"; 
    }

    document.querySelectorAll(".panel").forEach(element => {
      element.style.display = "block";
    });

  } catch (error) {
    alert("Error: " + error.message);
  }
}

// -----------------Event listener for the location icon---------------------------------------
locationIcon.addEventListener("click", () => {
  // Prompt the user to allow access to their location
  alert("Please allow access to your location to get the weather!");
  getUserLocation();
});

// --------------------------Event listener for the search button------------------------------
searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city === "") {
    alert("Please enter a city name!");
    return;
  }
  checkWeather(city);
  getForecast(city);

  //------------------- Clear the input field after the search----------------------------------
  searchBox.value = "";

  // --------------------Save the searched city and update recent cities dropdown------------
  saveRecentCity(city);
});

//-------------- Event listener for selecting a city from the dropdown------------------------
recentCitiesDropdown.addEventListener("change", (event) => {
  const selectedCity = event.target.value;
  if (selectedCity) {
    checkWeather(selectedCity);
    getForecast(selectedCity);
  }
});


window.addEventListener("DOMContentLoaded", loadRecentCities);
// ---------------------------------js code ends here-------------------------------------
