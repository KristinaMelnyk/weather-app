let now = new Date();
let date = document.querySelector("#date");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
let minutes = now.getMinutes();

date.innerHTML = `${day},  ${hour}:${minutes}`;

function showTemperature(response) {
  document.querySelector("h1").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = response.data.wind.speed;
}

function searchCity(event) {
  event.preventDefault();
  let apiKey = "fc6fe7180f75f61eb4c6a27ee5f57b6b";
  let units = "metric";
  let city = document.querySelector(".enter-city").value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

let form = document.querySelector("form");
form.addEventListener("submit", searchCity);
