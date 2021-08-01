"use-strict";

///////////////////
const API_KEY = `3bcee8d340b7eb85f4f2ffb2e4c646b8`;
const mainContainer = document.querySelector("main");
const form = document.querySelector(".form");
const CityInput = document.querySelector("#city_input");
const searchBtn = document.querySelector("#submit_btn");
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
const airQuality = document.querySelector(".airQuality");
const uvQuality = document.querySelector(".uvQuality");

///////////////////

let now = moment();

const formatDate = function (d) {
  return ` ${d.format("MMMM Do YYYY")}`;
};

const setData = function (data) {
  // date
  displayDate.innerHTML = formatDate(now);
  // city name
  user_location.innerHTML = `${data.location.country},${data.location.name}`;
  // current weather
  climate.innerHTML = `${data.current.temp_c}  &#8451 `;
  // climate status
  climate_status.innerHTML = `${data.current.condition.text}`;
  // feels like
  feelsLikeTemp.innerHTML = `Feels like ${data.current.feelslike_c} &#8451`;
  // other details
  cloudPer.innerHTML = `Clouds ${data.current.cloud} %`;
  windSpeed.innerHTML = `Wind ${data.current.wind_kph} m/s`;
  humidity.innerHTML = `Humidity ${data.current.humidity} %`;
  visibility.innerHTML = `Visibility ${data.current.vis_km} km `;
  airQuality.innerHTML = `Air level ${data.current.air_quality["gb-defra-index"]}`;
  uvQuality.innerHTML = `Uv level ${data.current.uv}`;

  // for upcoming days

  nextDayBlock.forEach((block, i) => {
    block.innerHTML = formatDate(moment().add(i + 1, "days"));
  });
  nextDayClimate.forEach((block, i) => {
    block.innerHTML = `${data.forecast.forecastday[i].day.maxtemp_c} &#8451`;
  });

  //weather logo
  weatherLogo.src = `http://${data.current.condition.icon.slice(2)}`;
};

const loadErrorMsg = function (msg) {
  const markup = `
    <div class="error-box">
      <img src="https://img.icons8.com/carbon-copy/100/ffffff/error-cloud.png" />
      <p>${msg}</p>
    </div>
  `;
  weather_container.style.display = "none";
  form.style.display = "none";
  mainContainer.insertAdjacentHTML("afterbegin", markup);
};

const getData = async function (cityName) {
  try {
    if (!cityName) throw new Error("Please type a valid city name");

    const url = `https://cors-anywhere.herokuapp.com/http://api.weatherapi.com/v1/forecast.json?key=18fdeb53a3a44ea5a21131705212505&q=${cityName}&days=2&aqi=yes&alerts=no`;

    const res = await fetch(url);
    console.log(res);
    if (!res) return;
    const data = await res.json();

    setData(data);
  } catch (err) {
    loadErrorMsg(err);
  }
};
//////////////////////////////
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  getData(CityInput.value);
});
