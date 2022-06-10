// Variables
var oneCallBaseEndPointURL = 'https://api.openweathermap.org/data/2.5/onecall';
var city = '';
var date = new Date();
// var todaysDate = date.format('MM/DD/YYYY');
const APIKey = "fecd3d56b2813a3ed8fb92d0063908c5";
var weatherBaseEndPointURL = 'https://api.openweathermap.org/data/2.5/weather';
var cityArray = JSON.parse(localStorage.getItem('searchedCity')) ? JSON.parse(localStorage.getItem('searchedCity')) : [];

// DOM Elements

// Get weather data from API (both current and forecast)
function getWeather(city) {
  fetch(weatherBaseEndPointURL + `?q=${encodeURI(city)}&appid=${APIKey}`)
    .then(function (cityResponse) {
      return cityResponse.json();
    })
    .then(function (cityData) {
      var lat = cityData.coord.lat;
      var lon = cityData.coord.lon;

      fetch(oneCallBaseEndPointURL + `?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIKey}`)
        .then(function (oneCallResponse) {
          return oneCallResponse.json();
        })
        .then(function (oneCallData) {
          console.log(oneCallData);
          displayCurrentWeather(oneCallData);
          // displayFutureWeather(oneCallData);
          if (cityArray.indexOf(city) === -1) {
            cityArray.push(city);
            localStorage.setItem('searchedCity', JSON.stringify(cityArray));
          }
          // searchHistory();
        })
    })

}

document.querySelector('#search').addEventListener('click', function() {
    var inputedCity = document.querySelector('#cityInput').value
    console.log('city', inputedCity)
    getWeather(inputedCity)
  })

  // Display current weather
function displayCurrentWeather(data) {
  console.log(data.current)
  displayCurrentWeather.innerHTML = "";
  var currentWeather = document.createElement('div');
  var cityDate = document.createElement('div');
  var cityTemp = document.createElement('div');
  var cityHumidity = document.createElement('div');
  var cityWind = document.createElement('div');
  var cityUV = document.createElement('div');
  var cityUVBadge = document.createElement('button');
  var tempKelvin = data.current.temp;

  cityDate.innerText = `${city} (${date})`
  cityTemp.innerText = "Temp: " + Math.round((((tempKelvin - 273.15)*1.8)+32)) + "°F";
  cityWind.innerText = "Wind: " + data.current.wind_speed + " mph";
  cityHumidity.innerText = "Humidity: " + data.current.humidity + "%";
  cityUV.innerText = "UV Index: ";
  cityUVBadge.innerText = data.current.uvi;
  cityUVBadge.classList.add('badge');
  
  if (data.current.uvi <= 2) {
    cityUVBadge.classList.add('badge-success');
  } else if (data.current.uvi <= 5) {
    cityUVBadge.classList.add('badge-warning');
  } else if (data.current.uvi <= 7) {
    cityUVBadge.classList.add('badge-danger');
  }

  cardContainer.setAttribute('class', 'card w-75')
  cityDate.setAttribute('class', 'card-header')
  cityTemp.setAttribute('class', 'card-body')
  cityWind.setAttribute('class', 'card-body')
  cityHumidity.setAttribute('class', 'card-body')
  cityUV.append(cityUVBadge)

  var icons = document.createElement('img');
  icons.setAttribute('src', `http://openweathermap.org/img/wn/${data.current.weather[0].icon + '@2x.png'}`);
  cityDate.append(icons);
  currentWeather.append(cityDate, cityTemp, cityWind, cityHumidity, cityUV);
}


  //   .then(weatherRes => weatherRes.json())
  //   .then(weatherData => {
  //     console.log('weather data', weatherData)
  //     var lat = weatherData.coord.lat;
  //     var lon = weatherData.coord.lon;
  //     console.log('lat and lon', { lat, lon })
  //     fetch(oneCallBaseEndPoint + `?lat=${lat}&lon=${lon}&appid=${APIKey}`)
  //     .then(oneCallRes => oneCallRes.json())
  //     .then(oneCallData => {
  //       var currentWeather = oneCallData.current.weather[0].main
  //       console.log('currentWeather', currentWeather)
  //       document.querySelector('#weather').textContent = currentWeather
  //       console.log(oneCallData)
  //       var baseUrl = 'http://api.openweathermap.org/geo/1.0/direct'
  //       return fetch(`${baseUrl}?q=${name}&limit=5&appid=${APIKey}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         console.log(data)
  //         return ({
  //           coords: {
  //             lat: data[0].lat,
  //             lon: data[0].lon
  //           },
  //           name: data[0].name
  //         })
  //       })
  //       .catch(err => console.log(err))
  //     })
  //   })
  // }
  