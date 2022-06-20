// Variables
var oneCallBaseEndPointURL = 'https://api.openweathermap.org/data/2.5/onecall';
var city = '';
var date = new Date();
const APIKey = "fecd3d56b2813a3ed8fb92d0063908c5";
var weatherBaseEndPointURL = 'https://api.openweathermap.org/data/2.5/weather';
var cityArray = JSON.parse(localStorage.getItem('searchedCity')) ? JSON.parse(localStorage.getItem('searchedCity')) : [];

// DOM Elements
var inputValue = document.getElementById('cityInput');
var searchBtn = document.getElementById('searchBtn');
var cardContainer = document.getElementById('cardContainer');
var currentWeatherContainer = document.getElementById('currentWeather');
var forecast = document.getElementById('forecast');
var futureWeatherContainer = document.getElementById('futureWeather');
var searchHistoryContainer = document.getElementById('side');
var searchHistoryList = document.getElementById('history');



// Get weather data from API (both current and forecast)
function getWeather(city) {
  fetch(weatherBaseEndPointURL + `?q=${encodeURI(city)}&appid=${APIKey}`)
    .then(function (cityResponse) {
      return cityResponse.json();
    })
    .then(function (cityData) {
      var lat = cityData.coord.lat;
      var lon = cityData.coord.lon;

      fetch(oneCallBaseEndPointURL + `?lat=${lat}&lon=${lon}&appid=${APIKey}`)
        .then(function (oneCallResponse) {
          return oneCallResponse.json();
        })
        .then(function (oneCallData) {
          console.log(oneCallData);
          displayCurrentWeather(oneCallData);
          displayFutureWeather(oneCallData);
          if (cityArray.indexOf(city) === -1) {
            cityArray.push(city)
            localStorage.setItem('searchedCity', JSON.stringify(cityArray));
          }
          searchHistory();
        })
    })
}

// Search button event listener
searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  city = inputValue.value.trim();
  inputValue.value = '';
  getWeather(city);
});

// Display current weather
function displayCurrentWeather(data) {
  console.log(data.current)
  currentWeather.innerHTML = "";
  var cityDate = document.createElement('div');
  var cityTemp = document.createElement('div');
  var cityHumidity = document.createElement('div');
  var cityWind = document.createElement('div');
  var cityUV = document.createElement('div');
  var cityUVBadge = document.createElement('button');
  var tempKelvin = data.current.temp;

  cityDate.innerText = `${city} (${date})`
  cityTemp.innerText = "Temp: " + Math.round((((tempKelvin - 273.15) * 1.8) + 32)) + "°F";
  cityWind.innerText = "Wind: " + data.current.wind_speed + " mph";
  cityHumidity.innerText = "Humidity: " + data.current.humidity + "%";
  cityUV.innerText = "UV Index: ";
  cityUVBadge.innerText = data.current.uvi;
  cityUVBadge.setAttribute('class', 'btn')

  if (data.current.uvi <= 2) {
    cityUVBadge.setAttribute('class', 'btn-success')
  } else if (data.current.uvi <= 7) {
    cityUVBadge.setAttribute('class', 'btn-warning');
  } else if (data.current.uvi <= 15) {
    cityUVBadge.setAttribute('class', 'btn-danger');
  }

  cardContainer.setAttribute('class', 'card-container')
  cardContainer.setAttribute('class', 'card w-75')
  cityDate.setAttribute('class', 'card-title')
  cityTemp.setAttribute('class', 'card-text')
  cityWind.setAttribute('class', 'card-text')
  cityHumidity.setAttribute('class', 'card-text')
  cityUV.append(cityUVBadge)

  var icons = document.createElement('img');
  icons.setAttribute('src', `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
  cityDate.append(icons)
  currentWeather.append(cityDate, cityTemp, cityWind, cityHumidity, cityUV);
}


// Display future weather
function displayFutureWeather(data) {
  console.log(data.daily)
  forecast.innerHTML = "";
  var futureForecast = document.createElement('div');
  futureForecast.innerText = "5-Day Forecast: ";
  forecast.append(futureForecast);
  futureWeather.innerHTML = "";

  for (var i = 1; i < 6; i++) {
    var futureDate = document.createElement('div');
    var futureTemp = document.createElement('div');
    var futureHumidity = document.createElement('div');
    var futureWind = document.createElement('div');
    var futureUV = document.createElement('div');
    var futureUVBadge = document.createElement('button');
    var tempKelvin = data.daily[i].temp.day;
    var eachCard = document.createElement('div');

    futureDate.innerText = moment().add(i, 'days').format('MM/DD/YYYY');
    futureTemp.innerText = "Temp: " + Math.round((((tempKelvin - 273.15) * 1.8) + 32)) + "°F";
    futureWind.innerText = "Wind: " + data.daily[i].wind_speed + " mph";
    futureHumidity.innerText = "Humidity: " + data.daily[i].humidity + "%";
    futureUV.innerText = "UV Index: ";
    futureUVBadge.innerText = data.daily[i].uvi;
    futureUVBadge.classList.add('btn');

     // future weather UV index info
    if (data.daily[i].uvi <= 2) {
      futureUVBadge.classList.add('btn-success');
    } else if (data.daily[i].uvi <= 7) {
      futureUVBadge.classList.add('btn-warning');
    } else if (data.daily[i].uvi <= 15) {
      futureUVBadge.classList.add('btn-danger');
    }

    var futureIcons = document.createElement('img');
    futureIcons.setAttribute('src', `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`);

    futureDate.setAttribute('class', 'card-title');
    futureTemp.setAttribute('class', 'card-text');
    futureWind.setAttribute('class', 'card-text');
    futureHumidity.setAttribute('class', 'card-text');
    eachCard.setAttribute('class', 'card-text');
    eachCard.append(futureDate, futureIcons, futureTemp, futureWind, futureHumidity, futureUV, futureUVBadge);
    futureWeather.append(eachCard);
  }
}

// Search history
function searchHistory() {
  searchHistoryList.innerHTML = "";
  for (var i = 0; i < cityArray.length; i++) {
    var searchHistoryItem = document.createElement('li');
    searchHistoryItem.innerText = cityArray[i];
    searchHistoryList.append(searchHistoryItem);
    searchHistoryItem.addEventListener('click', function (event) {
      event.preventDefault()
      city = event.target.innerText;
      getWeather(city);
    })
  }
}

searchHistory();






    