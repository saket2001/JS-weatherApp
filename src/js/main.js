"use-strict";

///////////////////
const API_KEY = `3bcee8d340b7eb85f4f2ffb2e4c646b8`;
const mainContainer = document.querySelector("main");
const weather_container = document.querySelector(".weather__container");
const displayDate = document.querySelector(".current_date");
const feelsLikeTemp = document.querySelector(".weather__feels");
const user_location = document.querySelector(".weather__location");
const climate_status = document.querySelector(".weather__status p");
const climate = document.querySelector(".weather__number");
const nextDayBlock = document.querySelectorAll(".weather__block p");
const nextDayClimate = document.querySelectorAll(".nextDay");
const weatherLogo = document.querySelector(".weather__logo");
const windSpeed = document.querySelector(".windspeed");
const cloudPer = document.querySelector(".cloudPer");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");

///////////////////

let now = moment();

const formatDate = function (d) {
  return `${d.format("dddd")} ${d.format("MMMM Do YYYY")}`;
};

const fetchData = async function (url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

const setData = function (data) {
  // date
  displayDate.innerHTML = formatDate(now);
  // city name
  user_location.innerHTML = data.timezone;
  // current weather
  climate.innerHTML = Math.round(data.current.temp) - 270 + "  &#8451";
  // feels like
  feelsLikeTemp.innerHTML = `Feels like  ${
    Math.round(data.current.feels_like) - 270 + "  &#8451"
  }`;
  // other details
  cloudPer.innerHTML = `Clouds ${data.current.clouds} %`;
  windSpeed.innerHTML = `Wind speed ${data.current.wind_speed} m/s`;
  humidity.innerHTML = `Humidity ${data.current.humidity} %`;
  visibility.innerHTML = `Visibility ${data.current.visibility * 0.001} km `;

  // for upcoming days

  nextDayBlock.forEach((block, i) => {
    block.innerHTML = formatDate(moment().add(i + 1, "days"));
  });
  nextDayClimate.forEach((block, i) => {
    block.innerHTML = Math.round(data.daily[i++].temp.day) - 270 + "  &#8451";
  });

  //
  if (data.current.weather[0]["main"] === "Clouds") {
    weatherLogo.setAttribute = `http://openweathermap.org/img/wn/${data.current.weather[0]["icon"]}@2x.png`;
    climate_status.innerHTML = data.current.weather[0]["description"];
  }

  if (data.current.weather[0]["main"] === "Rains") {
    weatherLogo.setAttribute = `http://openweathermap.org/img/wn/${data.current.weather[0]["icon"]}@2x.png`;
    climate_status.innerHTML = data.current.weather[0]["description"];
  }
};

const loadErrorMsg = function (msg) {
  const markup = `
    <div class="error-box">
      <img src="https://img.icons8.com/carbon-copy/100/ffffff/error-cloud.png" />
      <p>${msg}</p>
    </div>
  `;
  weather_container.style.display = "none";
  mainContainer.insertAdjacentHTML("afterbegin", markup);
};

const loadData = async function (position) {
  try {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${API_KEY}`;

    const data = await fetchData(url);

    // setting data
    setData(data);
  } catch (err) {
    loadErrorMsg(err);
  }
};

const currPositionWeather = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(loadData, function () {
      loadErrorMsg(
        `OOPS!! Not able to get your location<br>Try Again with your location ON`
      );
    });
  }
};

// const getData = async function () {
//   try {
//     const cityname = (await CityInput.value) || "Mumbai";

//     const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_KEY}`;
//     const data = await fetchData(url);

//     console.log(data);
//     setData(data);
//   } catch (err) {
//     alert(err);
//   }
// };

//////////////////////////////
currPositionWeather();
